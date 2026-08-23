import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

/**
 * FileBlobManager
 * Persistent Blob-based URL Management System mapping persistent IDs (e.g. file_123)
 * to local Blob data via IndexedDB and Firestore permanent metadata store.
 */

const DB_NAME = 'PatrikaFileStore';
const STORE_NAME = 'file_blobs';

// Open or initialize IndexedDB for storing local file Blobs
function openBlobDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB unavailable in current environment'));
    }
    const request = window.indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Save Blob to IndexedDB
export async function saveFileToIndexedDB(fileId: string, blob: Blob): Promise<void> {
  if (!fileId || !blob) return;
  try {
    const idb = await openBlobDB();
    const tx = idb.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(blob, fileId);
    await new Promise((res, rej) => {
      tx.oncomplete = res;
      tx.onerror = rej;
    });
  } catch (e) {
    console.warn('[FileBlobManager] IndexedDB save warning:', e);
  }
}

// Retrieve Blob from IndexedDB
export async function getFileFromIndexedDB(fileId: string): Promise<Blob | null> {
  if (!fileId) return null;
  try {
    const idb = await openBlobDB();
    const tx = idb.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(fileId);
    return await new Promise((res, rej) => {
      req.onsuccess = () => res((req.result as Blob) || null);
      req.onerror = () => rej(req.error);
    });
  } catch (e) {
    return null;
  }
}

// Helper: Convert base64 data to Blob
export function base64ToBlob(base64Data: string, contentType = 'application/pdf'): Blob | null {
  if (!base64Data) return null;
  try {
    let cleanBase64 = base64Data;
    let type = contentType;

    if (base64Data.includes(';base64,')) {
      const parts = base64Data.split(';base64,');
      type = parts[0].replace('data:', '') || contentType;
      cleanBase64 = parts[1];
    }

    const binaryString = atob(cleanBase64.trim().replace(/[\r\n\s]/g, ''));
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes], { type });
  } catch (err) {
    console.error('[FileBlobManager] Failed base64ToBlob:', err);
    return null;
  }
}

class FileBlobRegistry {
  private urlMap = new Map<string, string>(); // fileId -> blobUrl
  private pendingPromises = new Map<string, Promise<string>>();

  /**
   * Get or generate a stable local blob: URL for a given persistent file ID, path, or raw Data URL.
   */
  async getBlobUrl(rawInput: string): Promise<string> {
    if (!rawInput) return '';

    const trimmed = rawInput.trim();

    // 1. Direct HTTP/HTTPS or existing Blob URL
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }

    if (trimmed.startsWith('blob:')) {
      return trimmed;
    }

    // Extract clean persistent file ID
    const fileId = trimmed.includes('/') ? trimmed.split('/').pop()! : trimmed;

    // 2. Return from active memory map if available
    if (this.urlMap.has(fileId)) {
      return this.urlMap.get(fileId)!;
    }

    // 3. Deduplicate simultaneous async requests
    if (this.pendingPromises.has(fileId)) {
      return this.pendingPromises.get(fileId)!;
    }

    const promise = this.resolveAndCreateBlobUrl(fileId, trimmed);
    this.pendingPromises.set(fileId, promise);

    try {
      const blobUrl = await promise;
      if (blobUrl && blobUrl.startsWith('blob:')) {
        this.urlMap.set(fileId, blobUrl);
      }
      return blobUrl;
    } finally {
      this.pendingPromises.delete(fileId);
    }
  }

  private async resolveAndCreateBlobUrl(fileId: string, rawInput: string): Promise<string> {
    // A. If raw input is direct base64 string
    if (rawInput.startsWith('data:') || rawInput.length > 300) {
      const blob = base64ToBlob(rawInput);
      if (blob) {
        const url = URL.createObjectURL(blob);
        saveFileToIndexedDB(fileId, blob).catch(() => {});
        return url;
      }
    }

    // B. Check IndexedDB persistent store on device
    const localBlob = await getFileFromIndexedDB(fileId);
    if (localBlob) {
      const url = URL.createObjectURL(localBlob);
      return url;
    }

    // C. Check localStorage cache
    try {
      const cached = localStorage.getItem(`pdf_cache_${fileId}`);
      if (cached) {
        const blob = base64ToBlob(cached);
        if (blob) {
          saveFileToIndexedDB(fileId, blob).catch(() => {});
          return URL.createObjectURL(blob);
        }
      }
    } catch (e) {}

    // D. Fetch from Firestore permanent document store (user_files collection)
    try {
      const userFileSnap = await getDoc(doc(db, 'user_files', fileId));
      if (userFileSnap.exists()) {
        const data = userFileSnap.data();
        const base64Data = data?.content || data?.base64 || (data?.url?.includes(',') ? data.url.split(',')[1] : null);
        const mimeType = data?.type || 'application/pdf';

        if (base64Data) {
          const blob = base64ToBlob(base64Data, mimeType);
          if (blob) {
            saveFileToIndexedDB(fileId, blob).catch(() => {});
            return URL.createObjectURL(blob);
          }
        }
      }

      // Check media collection fallback
      const mediaSnap = await getDoc(doc(db, 'media', fileId));
      if (mediaSnap.exists()) {
        const data = mediaSnap.data();
        if (data?.url) {
          if (data.url.startsWith('data:') || data.url.length > 300) {
            const blob = base64ToBlob(data.url);
            if (blob) {
              saveFileToIndexedDB(fileId, blob).catch(() => {});
              return URL.createObjectURL(blob);
            }
          } else {
            return data.url;
          }
        }
      }
    } catch (err) {
      console.warn('[FileBlobRegistry] Firestore lookup note:', err);
    }

    return rawInput;
  }

  /**
   * Register a Blob or File directly into registry and IndexedDB
   */
  registerBlob(fileId: string, blob: Blob): string {
    const blobUrl = URL.createObjectURL(blob);
    this.urlMap.set(fileId, blobUrl);
    saveFileToIndexedDB(fileId, blob).catch(() => {});
    return blobUrl;
  }

  /**
   * Get cached blob URL synchronously if available in memory
   */
  getMemoryBlobUrl(fileIdOrPath: string): string | null {
    if (!fileIdOrPath) return null;
    const fileId = fileIdOrPath.includes('/') ? fileIdOrPath.split('/').pop()! : fileIdOrPath;
    return this.urlMap.get(fileId) || null;
  }
}

export const fileBlobManager = new FileBlobRegistry();
