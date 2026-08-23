import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  increment,
  query,
  where
} from 'firebase/firestore';

export function sanitizeForFirestore<T>(obj: T): T {
  if (obj === null || obj === undefined) return null as any;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeForFirestore) as any;
  const cleaned: any = {};
  for (const key of Object.keys(obj as any)) {
    const val = (obj as any)[key];
    if (val !== undefined) {
      cleaned[key] = sanitizeForFirestore(val);
    }
  }
  return cleaned as T;
}
import { ref, uploadBytes, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage, auth, firebaseConfig } from './firebase';
import { 
  JournalSettings, 
  Article, 
  Issue, 
  PageContent, 
  EditorialMember, 
  Announcement, 
  MediaFile,
  ContactMessage,
  ActivityLogItem,
  PawariShabdkoshItem,
  PawariPaheliItem,
  PawariLokgeetItem,
  QuizQuestion,
  QuizCertificate
} from '../types';
import { BookItem, BlogItem, SAMPLE_BOOKS, SAMPLE_BLOGS } from '../data/booksBlogsData';
import { 
  SAMPLE_SHABDKOSH, 
  SAMPLE_PAHELI, 
  SAMPLE_LOKGEET, 
  SAMPLE_QUIZ_QUESTIONS 
} from '../data/pawariCulturalData';
import { 
  DEFAULT_SETTINGS, 
  DEFAULT_PAGES, 
  SAMPLE_ISSUES, 
  SAMPLE_ARTICLES, 
  SAMPLE_EDITORIAL_BOARD, 
  SAMPLE_ANNOUNCEMENTS 
} from '../data/seedData';
import { fileBlobManager, saveFileToIndexedDB, base64ToBlob } from './fileBlobManager';
import { parseRouteFromUrl, navigateTo } from './router';

export interface UploadProgressDetails {
  loaded: number;
  total: number;
  speedBps: number;
  timeRemainingSec: number;
  statusText?: string;
}

export const INITIAL_SAMPLE_LOGS: ActivityLogItem[] = [
  {
    id: 'log_01',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    action: 'update',
    category: 'books',
    title: 'Updated Book Details',
    details: 'Modified pricing and publication metadata for "पावारी लोक साहित्य एवं संस्कृति"',
    performedBy: 'Rupesh Pawar',
    performedByEmail: 'rupeshpawar10@gmail.com'
  },
  {
    id: 'log_02',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    action: 'create',
    category: 'blogs',
    title: 'Published New Community Blog',
    details: 'Created blog entry titled "पावारी भाषा में बाल साहित्य का महत्व"',
    performedBy: 'Editorial Team',
    performedByEmail: 'editorial@pawarishodh.org'
  },
  {
    id: 'log_03',
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    action: 'status_change',
    category: 'users',
    title: 'User Account Status Changed',
    details: 'Changed status of user account (editor@pawarishodh.org) to Active (सक्रिय)',
    performedBy: 'Super Admin',
    performedByEmail: 'rupeshpawar10@gmail.com'
  },
  {
    id: 'log_04',
    timestamp: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
    action: 'role_change',
    category: 'users',
    title: 'User Account Credentials & Role Updated',
    details: 'Assigned "book_editor" role and assigned module access permissions (Books, Blogs, Other)',
    performedBy: 'Super Admin',
    performedByEmail: 'rupeshpawar10@gmail.com'
  },
  {
    id: 'log_05',
    timestamp: new Date(Date.now() - 1000 * 60 * 2880).toISOString(),
    action: 'create',
    category: 'books',
    title: 'Published New Book',
    details: 'Added book entry "पावारी व्याकरण एवं भाषा-शास्त्रीय अध्ययन" by Dr. Ashok Pawar',
    performedBy: 'Book Editor',
    performedByEmail: 'book_editor@pawarishodh.org'
  }
];

export type PublicPageView = 
  | 'home' 
  | 'about' 
  | 'current_issue' 
  | 'archive' 
  | 'articles' 
  | 'books_blogs'
  | 'pawari_shabdkosh'
  | 'pawari_paheli'
  | 'pawari_lokgeet'
  | 'pawari_quiz'
  | 'article_detail' 
  | 'editorial_board' 
  | 'author_guidelines' 
  | 'submit_manuscript'
  | 'contact' 
  | 'admin';

export type AdminTab = 
  | 'dashboard' 
  | 'articles' 
  | 'issues' 
  | 'books_blogs'
  | 'shabdkosh'
  | 'paheli'
  | 'lokgeet'
  | 'cultural_quizzes'
  | 'public_contributions'
  | 'pages' 
  | 'section_manager' 
  | 'editorial_board' 
  | 'announcements' 
  | 'media' 
  | 'submissions'
  | 'settings' 
  | 'users'
  | 'roles'
  | 'activity_log';

interface CmsContextType {
  lang: 'hi' | 'en';
  setLang: (lang: 'hi' | 'en') => void;
  activeView: PublicPageView;
  setActiveView: (view: PublicPageView, articleIdOrSlug?: string | null, issueId?: string | null) => void;
  selectedArticleId: string | null;
  setSelectedArticleId: (id: string | null) => void;
  isNotFound: boolean;
  setIsNotFound: (val: boolean) => void;
  activeAdminTab: AdminTab;
  setActiveAdminTab: (tab: AdminTab) => void;
  
  settings: JournalSettings;
  articles: Article[];
  issues: Issue[];
  books: BookItem[];
  blogs: BlogItem[];
  shabdkoshList: PawariShabdkoshItem[];
  paheliList: PawariPaheliItem[];
  lokgeetList: PawariLokgeetItem[];
  quizQuestions: QuizQuestion[];
  pages: Record<string, PageContent>;
  editorialMembers: EditorialMember[];
  announcements: Announcement[];
  mediaFiles: MediaFile[];
  contactMessages: ContactMessage[];
  submissions: import('../types').Submission[];
  activityLogs: ActivityLogItem[];
  loadingData: boolean;

  // Audit Activity Logger
  logActivity: (item: Omit<ActivityLogItem, 'id' | 'timestamp'>) => Promise<void>;
  clearActivityLogs: () => Promise<void>;

  // View PDF Modal State
  activePdfUrl: string | null;
  activePdfTitle: string | null;
  openPdfViewer: (url: string, title: string) => void;
  closePdfViewer: () => void;

  // CRUD Actions
  saveSettings: (newSettings: JournalSettings) => Promise<void>;
  saveArticle: (article: Article) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  saveIssue: (issue: Issue) => Promise<void>;
  deleteIssue: (id: string) => Promise<void>;
  saveBook: (book: BookItem) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  saveBlog: (blog: BlogItem) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
  
  // Shabdkosh, Paheli, Lokgeet, Quiz CRUD
  saveShabdkosh: (item: PawariShabdkoshItem) => Promise<void>;
  deleteShabdkosh: (id: string) => Promise<void>;
  savePaheli: (item: PawariPaheliItem) => Promise<void>;
  deletePaheli: (id: string) => Promise<void>;
  saveLokgeet: (item: PawariLokgeetItem) => Promise<void>;
  deleteLokgeet: (id: string) => Promise<void>;
  saveQuizQuestion: (question: QuizQuestion) => Promise<void>;
  deleteQuizQuestion: (id: string) => Promise<void>;
  submitPublicContribution: (type: 'shabdkosh' | 'paheli' | 'lokgeet' | 'blogs' | 'books', itemData: any) => Promise<void>;
  updateContributionStatus: (type: 'shabdkosh' | 'paheli' | 'lokgeet' | 'blogs' | 'books' | 'submissions', id: string, status: 'approved' | 'pending' | 'rejected') => Promise<void>;

  savePage: (page: PageContent) => Promise<void>;
  saveEditorialMember: (member: EditorialMember) => Promise<void>;
  deleteEditorialMember: (id: string) => Promise<void>;
  saveAnnouncement: (announcement: Announcement) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  uploadFileToStorage: (file: File, folder?: string, onProgress?: (progress: number) => void) => Promise<{ url: string; path: string; fileId: string }>;
  deleteFileFromStorage: (path: string) => Promise<void>;
  submitContactMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'status'>) => Promise<void>;
  incrementArticleViews: (articleId: string) => Promise<void>;
  incrementArticleDownloads: (articleId: string) => Promise<void>;
  
  // Submission Actions
  addSubmission: (sub: Omit<import('../types').Submission, 'id' | 'status' | 'submitted_at'>) => Promise<void>;
  saveSubmission: (submission: import('../types').Submission) => Promise<void>;
  updateSubmissionStatus: (id: string, status: import('../types').Submission['status']) => Promise<void>;
  deleteSubmission: (id: string) => Promise<void>;
  
  seedDatabaseIfEmpty: () => Promise<void>;
  fetchArticleByIdOrSlug: (idOrSlug: string) => Promise<Article | null>;
  syncAllArticlesToCloud: () => Promise<{ synced: number; errors: number }>;
}

const CmsContext = createContext<CmsContextType | undefined>(undefined);

async function readFileAsDataUrl(file: File, maxDim = 600, quality = 0.80): Promise<string> {
  const nameLower = (file.name || '').toLowerCase();
  const fileType = file.type || '';
  const isImg = fileType.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg|bmp|heic|heif)$/i.test(nameLower);

  // Strategy 1: Read natively via FileReader
  let rawDataUrl = '';
  try {
    rawDataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string' && reader.result.length > 0) resolve(reader.result);
        else reject(new Error('Empty result'));
      };
      reader.onerror = () => reject(reader.error || new Error('FileReader error'));
      reader.readAsDataURL(file);
    });
  } catch (e) {
    console.warn('FileReader failed, attempting Blob fallback:', e);
  }

  // Strategy 2: Blob fallback
  if (!rawDataUrl) {
    try {
      const blob = new Blob([file], { type: fileType || 'image/jpeg' });
      rawDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      console.warn('Blob FileReader failed:', e);
    }
  }

  // Strategy 3: ObjectURL fallback
  if (!rawDataUrl && isImg) {
    try {
      rawDataUrl = URL.createObjectURL(file);
    } catch (e) {}
  }

  if (!rawDataUrl) {
    throw new Error(`Unable to read file "${file.name}". Please re-select the image file.`);
  }

  if (!isImg) return rawDataUrl;

  // Canvas compression to keep base64 photos lightweight (<50KB) & 100% compatible with Firestore & LocalStorage
  try {
    const compressedUrl = await new Promise<string>((resolve) => {
      const img = new Image();
      img.onload = () => {
        try {
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) { resolve(rawDataUrl); return; }
          ctx.drawImage(img, 0, 0, width, height);
          const result = canvas.toDataURL('image/jpeg', quality);
          resolve(result || rawDataUrl);
        } catch (err) {
          resolve(rawDataUrl);
        }
      };
      img.onerror = () => {
        resolve(rawDataUrl);
      };
      img.src = rawDataUrl;
    });

    return compressedUrl;
  } catch (err) {
    return rawDataUrl;
  }
}

async function compressImageDataUrlIfNeeded(dataUrl: string, maxDim = 800, quality = 0.80): Promise<string> {
  if (!dataUrl.startsWith('data:image/')) return dataUrl;

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width <= maxDim && height <= maxDim && dataUrl.length < 150 * 1024) {
        resolve(dataUrl);
        return;
      }
      if (width > height) {
        if (width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(dataUrl); return; }
      ctx.drawImage(img, 0, 0, width, height);
      try {
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      } catch (e) {
        resolve(dataUrl);
      }
    };
    img.onerror = () => {
      resolve(dataUrl);
    };
    img.src = dataUrl;
  });
}

const parseDeepLinkFromUrl = (): { initialView: PublicPageView; initialArticleId: string | null } => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const articleParam = urlParams.get('article') || urlParams.get('paper') || urlParams.get('id');
    
    let hashArticle = '';
    if (window.location.hash.includes('article=')) {
      hashArticle = window.location.hash.split('article=')[1]?.split('&')[0] || '';
    } else if (window.location.hash.includes('paper=')) {
      hashArticle = window.location.hash.split('paper=')[1]?.split('&')[0] || '';
    } else if (window.location.hash.startsWith('#/article/')) {
      hashArticle = window.location.hash.replace('#/article/', '');
    }

    const targetId = (articleParam || hashArticle || '').trim();
    if (targetId) {
      return { initialView: 'article_detail', initialArticleId: targetId };
    }
  } catch (err) {}
  return { initialView: 'home', initialArticleId: null };
};

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialRoute = parseRouteFromUrl();
  const [lang, setLang] = useState<'hi' | 'en'>('hi');
  const [activeView, setActiveViewRaw] = useState<PublicPageView>(initialRoute.view);
  const [selectedArticleId, setSelectedArticleIdRaw] = useState<string | null>(initialRoute.articleIdOrSlug);
  const [isNotFound, setIsNotFound] = useState<boolean>(initialRoute.isNotFound);
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('dashboard');

  const setActiveView = (view: PublicPageView, articleIdOrSlug?: string | null, issueId?: string | null) => {
    setIsNotFound(false);
    setActiveViewRaw(view);
    if (articleIdOrSlug !== undefined) {
      setSelectedArticleIdRaw(articleIdOrSlug);
    }
    navigateTo(view, articleIdOrSlug !== undefined ? articleIdOrSlug : selectedArticleId, issueId);
  };

  const setSelectedArticleId = (id: string | null) => {
    setSelectedArticleIdRaw(id);
    if (activeView === 'article_detail') {
      navigateTo('article_detail', id);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const currentRoute = parseRouteFromUrl();
      setActiveViewRaw(currentRoute.view);
      setSelectedArticleIdRaw(currentRoute.articleIdOrSlug);
      setIsNotFound(currentRoute.isNotFound);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [settings, setSettings] = useState<JournalSettings>(DEFAULT_SETTINGS);
  const [articles, setArticles] = useState<Article[]>(SAMPLE_ARTICLES);
  const [issues, setIssues] = useState<Issue[]>(SAMPLE_ISSUES);
  const [books, setBooks] = useState<BookItem[]>(() => {
    try {
      const saved = localStorage.getItem('local_books_cache');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return SAMPLE_BOOKS;
  });
  const [blogs, setBlogs] = useState<BlogItem[]>(() => {
    try {
      const saved = localStorage.getItem('local_blogs_cache');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return SAMPLE_BLOGS;
  });

  const [shabdkoshList, setShabdkoshList] = useState<PawariShabdkoshItem[]>(() => {
    try {
      const saved = localStorage.getItem('pawari_shabdkosh_cache');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return SAMPLE_SHABDKOSH;
  });

  const [paheliList, setPaheliList] = useState<PawariPaheliItem[]>(() => {
    try {
      const saved = localStorage.getItem('pawari_paheli_cache');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((p: PawariPaheliItem) => p.id));
          const missingSamples = SAMPLE_PAHELI.filter(s => !existingIds.has(s.id));
          if (missingSamples.length > 0) {
            const merged = [...parsed, ...missingSamples];
            try { localStorage.setItem('pawari_paheli_cache', JSON.stringify(merged)); } catch (e) {}
            return merged;
          }
          return parsed;
        }
      }
    } catch (e) {}
    return SAMPLE_PAHELI;
  });

  const [lokgeetList, setLokgeetList] = useState<PawariLokgeetItem[]>(() => {
    try {
      const saved = localStorage.getItem('pawari_lokgeet_cache');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return SAMPLE_LOKGEET;
  });

  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(() => {
    try {
      const saved = localStorage.getItem('pawari_quiz_cache');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((q: QuizQuestion) => q.id));
          const missingSamples = SAMPLE_QUIZ_QUESTIONS.filter(s => !existingIds.has(s.id));
          if (missingSamples.length > 0) {
            const merged = [...parsed, ...missingSamples];
            try { localStorage.setItem('pawari_quiz_cache', JSON.stringify(merged)); } catch (e) {}
            return merged;
          }
          return parsed;
        }
      }
    } catch (e) {}
    return SAMPLE_QUIZ_QUESTIONS;
  });
  const [pages, setPages] = useState<Record<string, PageContent>>(DEFAULT_PAGES);
  const [editorialMembers, setEditorialMembers] = useState<EditorialMember[]>(() => {
    try {
      const saved = localStorage.getItem('local_editorial_members_cache');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return SAMPLE_EDITORIAL_BOARD;
  });
  const [announcements, setAnnouncements] = useState<Announcement[]>(SAMPLE_ANNOUNCEMENTS);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [submissions, setSubmissions] = useState<import('../types').Submission[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(() => {
    try {
      const saved = localStorage.getItem('pawari_activity_logs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_SAMPLE_LOGS;
  });
  const [loadingData, setLoadingData] = useState<boolean>(true);

  // Audit Activity Logger
  const logActivity = async (entry: Omit<ActivityLogItem, 'id' | 'timestamp'>) => {
    const currentUser = auth.currentUser;
    const newLog: ActivityLogItem = {
      ...entry,
      id: 'log_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      performedBy: entry.performedBy || currentUser?.displayName || currentUser?.email || 'Admin User',
      performedByEmail: entry.performedByEmail || currentUser?.email || ''
    };

    setActivityLogs(prev => [newLog, ...prev]);

    try {
      const local = localStorage.getItem('pawari_activity_logs');
      const logs = local ? JSON.parse(local) : INITIAL_SAMPLE_LOGS;
      localStorage.setItem('pawari_activity_logs', JSON.stringify([newLog, ...logs.slice(0, 100)]));
    } catch (e) {}

    try {
      await setDoc(doc(db, 'activity_logs', newLog.id), newLog, { merge: true });
    } catch (e) {}
  };

  const clearActivityLogs = async () => {
    setActivityLogs([]);
    try {
      localStorage.removeItem('pawari_activity_logs');
    } catch (e) {}
    try {
      const snap = await getDocs(collection(db, 'activity_logs'));
      snap.docs.forEach(async (d) => {
        await deleteDoc(doc(db, 'activity_logs', d.id));
      });
    } catch (e) {}
  };

  // PDF Modal Viewer
  const [activePdfUrl, setActivePdfUrl] = useState<string | null>(null);
  const [activePdfTitle, setActivePdfTitle] = useState<string | null>(null);

  const openPdfViewer = (url: string, title: string) => {
    setActivePdfUrl(url);
    setActivePdfTitle(title);
  };

  const closePdfViewer = () => {
    setActivePdfUrl(null);
    setActivePdfTitle(null);
  };

  // Load initial data from Firestore
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoadingData(true);
      
      // 1. Journal Settings
      try {
        const settingsSnap = await getDoc(doc(db, 'settings', 'journal_settings'));
        if (settingsSnap.exists() && isMounted) {
          setSettings(settingsSnap.data() as JournalSettings);
        } else if (auth.currentUser) {
          setDoc(doc(db, 'settings', 'journal_settings'), DEFAULT_SETTINGS).catch(() => {});
        }
      } catch (e) {
        // Fallback to DEFAULT_SETTINGS silently
      }

      // 2. Articles
      try {
        const articlesSnap = await getDocs(collection(db, 'articles'));
        let loadedArticles: Article[] = [];
        if (!articlesSnap.empty) {
          loadedArticles = articlesSnap.docs.map(d => ({ id: d.id, ...d.data() } as Article));
        }

        // Merge with local cache if local cache has custom pdf_url or newly created articles
        const cached = localStorage.getItem('local_articles_cache');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              parsed.forEach((cachedArt: Article) => {
                const idx = loadedArticles.findIndex(a => a.id === cachedArt.id);
                if (idx !== -1) {
                  if (cachedArt.pdf_url && !loadedArticles[idx].pdf_url) {
                    loadedArticles[idx].pdf_url = cachedArt.pdf_url;
                    loadedArticles[idx].pdf_storage_path = cachedArt.pdf_storage_path || loadedArticles[idx].pdf_storage_path;
                  }
                } else {
                  loadedArticles.unshift(cachedArt);
                  // Background auto-sync missing local article to Cloud Firestore
                  setDoc(doc(db, 'articles', cachedArt.id), sanitizeForFirestore(cachedArt)).catch(err => {
                    console.warn(`[AutoSync] Background sync for article ${cachedArt.id}:`, err);
                  });
                }
              });
            }
          } catch (e) {}
        }

        // Ensure all sample articles exist in loadedArticles
        SAMPLE_ARTICLES.forEach((sampleArt) => {
          if (!loadedArticles.some(a => a.id === sampleArt.id || a.slug === sampleArt.slug)) {
            loadedArticles.push(sampleArt);
          }
        });

        if (loadedArticles.length > 0 && isMounted) {
          setArticles(loadedArticles);
          try { localStorage.setItem('local_articles_cache', JSON.stringify(loadedArticles)); } catch (e) {}
        } else if (isMounted) {
          if (auth.currentUser) {
            SAMPLE_ARTICLES.forEach(art => {
              setDoc(doc(db, 'articles', art.id), art).catch(() => {});
            });
          }
          setArticles(SAMPLE_ARTICLES);
        }
      } catch (e) {
        const cached = localStorage.getItem('local_articles_cache');
        let fallbackArticles: Article[] = SAMPLE_ARTICLES;
        if (cached && isMounted) {
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              SAMPLE_ARTICLES.forEach((sampleArt) => {
                if (!parsed.some((a: Article) => a.id === sampleArt.id || a.slug === sampleArt.slug)) {
                  parsed.push(sampleArt);
                }
              });
              fallbackArticles = parsed;
            }
          } catch (err) {}
        }
        if (isMounted) setArticles(fallbackArticles);
      }

      // 3. Issues
      try {
        const issuesSnap = await getDocs(collection(db, 'issues'));
        if (!issuesSnap.empty && isMounted) {
          const loadedIssues = issuesSnap.docs.map(d => ({ id: d.id, ...d.data() } as Issue));
          setIssues(loadedIssues);
          try { localStorage.setItem('local_issues_cache', JSON.stringify(loadedIssues)); } catch (e) {}
        } else {
          const cached = localStorage.getItem('local_issues_cache');
          if (cached) {
            try {
              const parsed = JSON.parse(cached);
              if (Array.isArray(parsed) && parsed.length > 0) setIssues(parsed);
            } catch (e) {}
          } else if (auth.currentUser) {
            SAMPLE_ISSUES.forEach(iss => {
              setDoc(doc(db, 'issues', iss.id), iss).catch(() => {});
            });
          }
        }
      } catch (e) {
        const cached = localStorage.getItem('local_issues_cache');
        if (cached && isMounted) {
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) setIssues(parsed);
          } catch (err) {}
        }
      }

      // 3.1 Books
      try {
        const booksSnap = await getDocs(collection(db, 'books'));
        if (!booksSnap.empty && isMounted) {
          const loadedBooks = booksSnap.docs.map(d => ({ id: d.id, ...d.data() } as BookItem));
          setBooks(loadedBooks);
          try { localStorage.setItem('local_books_cache', JSON.stringify(loadedBooks)); } catch (e) {}
        } else {
          const cached = localStorage.getItem('local_books_cache');
          if (cached) {
            try {
              const parsed = JSON.parse(cached);
              if (Array.isArray(parsed) && parsed.length > 0) setBooks(parsed);
            } catch (e) {}
          }
        }
      } catch (e) {
        // Fallback silently
      }

      // 3.2 Blogs
      try {
        const blogsSnap = await getDocs(collection(db, 'blogs'));
        if (!blogsSnap.empty && isMounted) {
          const loadedBlogs = blogsSnap.docs.map(d => ({ id: d.id, ...d.data() } as BlogItem));
          setBlogs(loadedBlogs);
          try { localStorage.setItem('local_blogs_cache', JSON.stringify(loadedBlogs)); } catch (e) {}
        } else {
          const cached = localStorage.getItem('local_blogs_cache');
          if (cached) {
            try {
              const parsed = JSON.parse(cached);
              if (Array.isArray(parsed) && parsed.length > 0) setBlogs(parsed);
            } catch (e) {}
          }
        }
      } catch (e) {
        // Fallback silently
      }

      // 4. Pages
      try {
        const pagesSnap = await getDocs(collection(db, 'pages'));
        if (!pagesSnap.empty && isMounted) {
          const loadedPages: Record<string, PageContent> = {};
          pagesSnap.docs.forEach(d => {
            loadedPages[d.id] = d.data() as PageContent;
          });
          setPages(loadedPages);
        } else if (auth.currentUser) {
          Object.entries(DEFAULT_PAGES).forEach(([key, val]) => {
            setDoc(doc(db, 'pages', key), val).catch(() => {});
          });
        }
      } catch (e) {
        // Fallback to DEFAULT_PAGES
      }

      // 5. Editorial Board
      try {
        const boardSnap = await getDocs(collection(db, 'editorial_members'));
        let loadedBoard: EditorialMember[] = [];
        if (!boardSnap.empty) {
          loadedBoard = boardSnap.docs.map(d => ({ id: d.id, ...d.data() } as EditorialMember));
        }

        const cached = localStorage.getItem('local_editorial_members_cache');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              parsed.forEach((cachedMember: EditorialMember) => {
                const idx = loadedBoard.findIndex(m => m.id === cachedMember.id);
                if (idx !== -1) {
                  if (cachedMember.photo_url && (!loadedBoard[idx].photo_url || loadedBoard[idx].photo_url === '')) {
                    loadedBoard[idx].photo_url = cachedMember.photo_url;
                  }
                } else {
                  loadedBoard.push(cachedMember);
                }
              });
            }
          } catch (e) {}
        }

        if (loadedBoard.length > 0 && isMounted) {
          loadedBoard.sort((a, b) => a.order - b.order);
          setEditorialMembers(loadedBoard);
          try { localStorage.setItem('local_editorial_members_cache', JSON.stringify(loadedBoard)); } catch (e) {}
        } else if (isMounted) {
          if (auth.currentUser) {
            SAMPLE_EDITORIAL_BOARD.forEach(member => {
              setDoc(doc(db, 'editorial_members', member.id), member).catch(() => {});
            });
          }
          setEditorialMembers(SAMPLE_EDITORIAL_BOARD);
        }
      } catch (e) {
        const cached = localStorage.getItem('local_editorial_members_cache');
        if (cached && isMounted) {
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) setEditorialMembers(parsed);
          } catch (err) {}
        }
      }

      // 6. Announcements
      try {
        const annSnap = await getDocs(collection(db, 'announcements'));
        if (!annSnap.empty && isMounted) {
          const loadedAnn = annSnap.docs.map(d => ({ id: d.id, ...d.data() } as Announcement));
          setAnnouncements(loadedAnn);
        } else if (auth.currentUser) {
          SAMPLE_ANNOUNCEMENTS.forEach(ann => {
            setDoc(doc(db, 'announcements', ann.id), ann).catch(() => {});
          });
        }
      } catch (e) {
        // Fallback silently
      }

      // 7. Media Library
      try {
        const mediaSnap = await getDocs(collection(db, 'media'));
        if (!mediaSnap.empty && isMounted) {
          const items = mediaSnap.docs.map(d => ({ id: d.id, ...d.data() } as MediaFile));
          setMediaFiles(items);
        }
      } catch (e) {
        // Silent fallback
      }

      // 8. Contact Messages
      try {
        const msgSnap = await getDocs(collection(db, 'contact_messages'));
        if (!msgSnap.empty && isMounted) {
          setContactMessages(msgSnap.docs.map(d => ({ id: d.id, ...d.data() } as ContactMessage)));
        }
      } catch (e) {
        // Silent fallback
      }

      // 9. Submissions
      try {
        const subSnap = await getDocs(collection(db, 'submissions'));
        if (!subSnap.empty && isMounted) {
          setSubmissions(subSnap.docs.map(d => ({ id: d.id, ...d.data() } as import('../types').Submission)));
        }
      } catch (e) {
        // Silent fallback
      }

      // 10. Lokgeet
      try {
        const snap = await getDocs(collection(db, 'lokgeet'));
        let loaded: PawariLokgeetItem[] = [];
        if (!snap.empty) {
          loaded = snap.docs.map(d => ({ id: d.id, ...d.data() } as PawariLokgeetItem));
        }
        const cached = localStorage.getItem('pawari_lokgeet_cache');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              parsed.forEach((c: PawariLokgeetItem) => {
                if (!loaded.some(l => l.id === c.id)) loaded.push(c);
              });
            }
          } catch (e) {}
        }
        SAMPLE_LOKGEET.forEach(s => {
          if (!loaded.some(l => l.id === s.id)) loaded.push(s);
        });
        if (isMounted && loaded.length > 0) {
          setLokgeetList(loaded);
          try { localStorage.setItem('pawari_lokgeet_cache', JSON.stringify(loaded)); } catch (e) {}
        }
      } catch (e) {}

      // 11. Shabdkosh
      try {
        const snap = await getDocs(collection(db, 'shabdkosh'));
        let loaded: PawariShabdkoshItem[] = [];
        if (!snap.empty) {
          loaded = snap.docs.map(d => ({ id: d.id, ...d.data() } as PawariShabdkoshItem));
        }
        const cached = localStorage.getItem('pawari_shabdkosh_cache');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              parsed.forEach((c: PawariShabdkoshItem) => {
                if (!loaded.some(l => l.id === c.id)) loaded.push(c);
              });
            }
          } catch (e) {}
        }
        SAMPLE_SHABDKOSH.forEach(s => {
          if (!loaded.some(l => l.id === s.id)) loaded.push(s);
        });
        if (isMounted && loaded.length > 0) {
          setShabdkoshList(loaded);
          try { localStorage.setItem('pawari_shabdkosh_cache', JSON.stringify(loaded)); } catch (e) {}
        }
      } catch (e) {}

      // 12. Paheli
      try {
        const snap = await getDocs(collection(db, 'paheli'));
        let loaded: PawariPaheliItem[] = [];
        if (!snap.empty) {
          loaded = snap.docs.map(d => ({ id: d.id, ...d.data() } as PawariPaheliItem));
        }
        const cached = localStorage.getItem('pawari_paheli_cache');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              parsed.forEach((c: PawariPaheliItem) => {
                if (!loaded.some(l => l.id === c.id)) loaded.push(c);
              });
            }
          } catch (e) {}
        }
        SAMPLE_PAHELI.forEach(s => {
          if (!loaded.some(l => l.id === s.id)) loaded.push(s);
        });
        if (isMounted && loaded.length > 0) {
          setPaheliList(loaded);
          try { localStorage.setItem('pawari_paheli_cache', JSON.stringify(loaded)); } catch (e) {}
        }
      } catch (e) {}

      if (isMounted) {
        setLoadingData(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Deep Linking Handler for ?article=XYZ or #article=XYZ or ?paper=XYZ
  useEffect(() => {
    const handleDeepLink = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const articleParam = urlParams.get('article') || urlParams.get('paper') || urlParams.get('id');
        
        let hashArticle = '';
        if (window.location.hash.includes('article=')) {
          hashArticle = window.location.hash.split('article=')[1]?.split('&')[0] || '';
        } else if (window.location.hash.startsWith('#/article/')) {
          hashArticle = window.location.hash.replace('#/article/', '');
        }

        const targetId = articleParam || hashArticle;
        if (targetId && targetId.trim() !== '') {
          setSelectedArticleId(targetId.trim());
          setActiveView('article_detail');
        }
      } catch (err) {
        console.warn('URL deep linking error:', err);
      }
    };

    handleDeepLink();
    window.addEventListener('popstate', handleDeepLink);
    window.addEventListener('hashchange', handleDeepLink);
    return () => {
      window.removeEventListener('popstate', handleDeepLink);
      window.removeEventListener('hashchange', handleDeepLink);
    };
  }, []);

  // Sync URL search params when viewing an article detail
  useEffect(() => {
    if (activeView === 'article_detail' && selectedArticleId) {
      try {
        const currentUrl = new URL(window.location.href);
        if (currentUrl.searchParams.get('article') !== selectedArticleId) {
          currentUrl.searchParams.set('article', selectedArticleId);
          window.history.replaceState({}, '', currentUrl.toString());
        }
      } catch (e) {}
    } else if (activeView !== 'article_detail') {
      try {
        const currentUrl = new URL(window.location.href);
        if (currentUrl.searchParams.has('article')) {
          currentUrl.searchParams.delete('article');
          currentUrl.searchParams.delete('paper');
          window.history.replaceState({}, '', currentUrl.toString());
        }
      } catch (e) {}
    }
  }, [activeView, selectedArticleId]);

  const seedDatabaseIfEmpty = async () => {
    try {
      await setDoc(doc(db, 'settings', 'journal_settings'), DEFAULT_SETTINGS);
      for (const art of SAMPLE_ARTICLES) {
        await setDoc(doc(db, 'articles', art.id), art);
      }
      for (const iss of SAMPLE_ISSUES) {
        await setDoc(doc(db, 'issues', iss.id), iss);
      }
      for (const [key, val] of Object.entries(DEFAULT_PAGES)) {
        await setDoc(doc(db, 'pages', key), val);
      }
      for (const m of SAMPLE_EDITORIAL_BOARD) {
        await setDoc(doc(db, 'editorial_members', m.id), m);
      }
      for (const a of SAMPLE_ANNOUNCEMENTS) {
        await setDoc(doc(db, 'announcements', a.id), a);
      }
      setSettings(DEFAULT_SETTINGS);
      setArticles(SAMPLE_ARTICLES);
      setIssues(SAMPLE_ISSUES);
      setPages(DEFAULT_PAGES);
      setEditorialMembers(SAMPLE_EDITORIAL_BOARD);
      setAnnouncements(SAMPLE_ANNOUNCEMENTS);
    } catch (e) {
      console.error('Failed to seed database:', e);
    }
  };

  // Actions
  const saveSettings = async (newSettings: JournalSettings) => {
    setSettings(newSettings);
    try {
      await setDoc(doc(db, 'settings', 'journal_settings'), newSettings);
      if (newSettings.homepage_sections && Array.isArray(newSettings.homepage_sections)) {
        for (const sec of newSettings.homepage_sections) {
          await setDoc(doc(db, 'homepage_sections', sec.id || sec.key), sec).catch(console.warn);
        }
      }
    } catch (e) {
      console.error('Error saving settings to firestore:', e);
    }
  };

  const fetchArticleByIdOrSlug = async (idOrSlug: string): Promise<Article | null> => {
    if (!idOrSlug) return null;
    try {
      const existing = articles.find(a => a.id === idOrSlug || a.slug === idOrSlug);
      if (existing) return existing;

      // 1. Query Firestore by doc ID
      const docRef = doc(db, 'articles', idOrSlug);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const art = { id: snap.id, ...snap.data() } as Article;
        setArticles(prev => {
          if (prev.some(a => a.id === art.id)) return prev;
          const newArr = [art, ...prev];
          try { localStorage.setItem('local_articles_cache', JSON.stringify(newArr)); } catch (e) {}
          return newArr;
        });
        return art;
      }

      // 2. Query Firestore by slug field
      const q = query(collection(db, 'articles'), where('slug', '==', idOrSlug));
      const qSnap = await getDocs(q);
      if (!qSnap.empty) {
        const d = qSnap.docs[0];
        const art = { id: d.id, ...d.data() } as Article;
        setArticles(prev => {
          if (prev.some(a => a.id === art.id)) return prev;
          const newArr = [art, ...prev];
          try { localStorage.setItem('local_articles_cache', JSON.stringify(newArr)); } catch (e) {}
          return newArr;
        });
        return art;
      }
    } catch (e) {
      console.warn('[fetchArticleByIdOrSlug] Error fetching targeted article:', e);
    }
    return null;
  };

  const syncAllArticlesToCloud = async (): Promise<{ synced: number; errors: number }> => {
    let synced = 0;
    let errors = 0;
    const cached = localStorage.getItem('local_articles_cache');
    let localArts: Article[] = articles;
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localArts = parsed;
        }
      } catch (e) {}
    }

    for (const art of localArts) {
      try {
        const sanitized = sanitizeForFirestore(art);
        await setDoc(doc(db, 'articles', art.id), sanitized);
        synced++;
      } catch (e) {
        console.error(`Failed to sync article ${art.id}:`, e);
        errors++;
      }
    }
    return { synced, errors };
  };

  const saveArticle = async (article: Article) => {
    let articleToSave = { ...article };

    // If pdf_url is a base64 Data URL, isolate it to user_files collection to prevent exceeding Firestore's 1MB document limit
    if (articleToSave.pdf_url && (articleToSave.pdf_url.startsWith('data:') || articleToSave.pdf_url.length > 300)) {
      const dataUrl = articleToSave.pdf_url;
      const fileId = 'file_art_' + articleToSave.id + '_' + Date.now();
      const storagePath = `user_files/${fileId}`;
      const base64Content = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;

      try {
        localStorage.setItem(`pdf_cache_${fileId}`, dataUrl);
      } catch (e) {}

      const blob = base64ToBlob(dataUrl);
      if (blob) {
        fileBlobManager.registerBlob(fileId, blob);
      }

      // Store lightweight metadata record in user_files (keep content empty if base64 > 800KB to avoid 1MB limit)
      const isTooLargeForDoc = base64Content.length > 800000;
      const userFileRecord = sanitizeForFirestore({
        id: fileId,
        name: `${articleToSave.title_english || 'article'}.pdf`,
        type: 'application/pdf',
        size: dataUrl.length,
        content: isTooLargeForDoc ? '' : base64Content,
        base64: isTooLargeForDoc ? '' : base64Content,
        url: isTooLargeForDoc ? '' : dataUrl,
        uploaded_at: new Date().toISOString(),
        storage_path: storagePath
      });

      try {
        await setDoc(doc(db, 'user_files', fileId), userFileRecord);
        articleToSave.pdf_url = fileId;
        articleToSave.pdf_storage_path = storagePath;
      } catch (err) {
        console.warn('Failed to save user_files metadata:', err);
      }
    }

    const updated = articles.filter(a => a.id !== articleToSave.id);
    updated.unshift(articleToSave);
    setArticles(updated);

    try {
      localStorage.setItem('local_articles_cache', JSON.stringify(updated));
    } catch (e) {}

    const sanitizedArticle = sanitizeForFirestore(articleToSave);

    try {
      await setDoc(doc(db, 'articles', articleToSave.id), sanitizedArticle);
      console.log(`[saveArticle] Successfully saved article metadata to Firestore with pdf_url: ${articleToSave.pdf_url}`);
    } catch (e) {
      console.error('Error saving article to Firestore:', e);
      throw e;
    }
  };

  const deleteArticle = async (id: string) => {
    const updated = articles.filter(a => a.id !== id);
    setArticles(updated);
    try {
      localStorage.setItem('local_articles_cache', JSON.stringify(updated));
    } catch (e) {}
    try {
      await deleteDoc(doc(db, 'articles', id));
    } catch (e) {
      console.error('Error deleting article:', e);
    }
  };

  const saveIssue = async (issue: Issue) => {
    let updated = issues.filter(i => i.id !== issue.id);
    if (issue.status === 'current') {
      // Set other current issues to published
      updated = updated.map(i => i.status === 'current' ? { ...i, status: 'published' } : i);
    }
    updated.unshift(issue);
    setIssues(updated);
    try {
      localStorage.setItem('local_issues_cache', JSON.stringify(updated));
    } catch (e) {}
    try {
      if (issue.status === 'current') {
        const snap = await getDocs(collection(db, 'issues'));
        snap.docs.forEach(async (d) => {
          if (d.data().status === 'current' && d.id !== issue.id) {
            await updateDoc(doc(db, 'issues', d.id), { status: 'published' });
          }
        });
      }
      await setDoc(doc(db, 'issues', issue.id), issue);
    } catch (e) {
      console.error('Error saving issue:', e);
    }
  };

  const deleteIssue = async (id: string) => {
    setIssues(prev => prev.filter(i => i.id !== id));
    try {
      await deleteDoc(doc(db, 'issues', id));
    } catch (e) {
      console.error('Error deleting issue:', e);
    }
  };

  const saveBook = async (book: BookItem) => {
    const isNew = !books.some(b => b.id === book.id);
    const updated = books.filter(b => b.id !== book.id);
    updated.unshift(book);
    setBooks(updated);
    try {
      localStorage.setItem('local_books_cache', JSON.stringify(updated));
    } catch (e) {}
    try {
      await setDoc(doc(db, 'books', book.id), book);
    } catch (e) {
      console.error('Error saving book:', e);
    }

    logActivity({
      category: 'books',
      action: isNew ? 'create' : 'update',
      title: isNew ? `Published New Book "${book.title_hindi || book.title_english}"` : `Updated Book Metadata "${book.title_hindi || book.title_english}"`,
      details: `Authors: ${book.authors || 'N/A'}, Category: ${book.category || 'N/A'}, Price: ${book.price || 'N/A'}`
    }).catch(console.warn);
  };

  const deleteBook = async (id: string) => {
    const bookToDelete = books.find(b => b.id === id);
    const updated = books.filter(b => b.id !== id);
    setBooks(updated);
    try {
      localStorage.setItem('local_books_cache', JSON.stringify(updated));
    } catch (e) {}
    try {
      await deleteDoc(doc(db, 'books', id));
    } catch (e) {
      console.error('Error deleting book:', e);
    }

    logActivity({
      category: 'books',
      action: 'delete',
      title: `Deleted Book "${bookToDelete?.title_hindi || bookToDelete?.title_english || id}"`,
      details: `Removed book item from literature catalog`
    }).catch(console.warn);
  };

  const saveBlog = async (blog: BlogItem) => {
    const isNew = !blogs.some(b => b.id === blog.id);
    const updated = blogs.filter(b => b.id !== blog.id);
    updated.unshift(blog);
    setBlogs(updated);
    try {
      localStorage.setItem('local_blogs_cache', JSON.stringify(updated));
    } catch (e) {}
    try {
      await setDoc(doc(db, 'blogs', blog.id), blog);
    } catch (e) {
      console.error('Error saving blog:', e);
    }

    logActivity({
      category: 'blogs',
      action: isNew ? 'create' : 'update',
      title: isNew ? `Published Blog Post "${blog.title_hindi || blog.title_english}"` : `Updated Blog Post "${blog.title_hindi || blog.title_english}"`,
      details: `Author: ${blog.author || 'N/A'}, Category: ${blog.category || 'N/A'}`
    }).catch(console.warn);
  };

  const deleteBlog = async (id: string) => {
    const blogToDelete = blogs.find(b => b.id === id);
    const updated = blogs.filter(b => b.id !== id);
    setBlogs(updated);
    try {
      localStorage.setItem('local_blogs_cache', JSON.stringify(updated));
    } catch (e) {}
    try {
      await deleteDoc(doc(db, 'blogs', id));
    } catch (e) {
      console.error('Error deleting blog:', e);
    }

    logActivity({
      category: 'blogs',
      action: 'delete',
      title: `Deleted Blog Post "${blogToDelete?.title_hindi || blogToDelete?.title_english || id}"`,
      details: `Removed blog post entry`
    }).catch(console.warn);
  };

  const savePage = async (page: PageContent) => {
    setPages(prev => ({ ...prev, [page.id]: page }));
    try {
      await setDoc(doc(db, 'pages', page.id), page);
    } catch (e) {
      console.error('Error saving page content:', e);
    }
  };

  const saveEditorialMember = async (member: EditorialMember) => {
    const updated = editorialMembers.filter(m => m.id !== member.id);
    updated.push(member);
    updated.sort((a, b) => a.order - b.order);
    setEditorialMembers(updated);
    try {
      localStorage.setItem('local_editorial_members_cache', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
    try {
      await setDoc(doc(db, 'editorial_members', member.id), member);
      await setDoc(doc(db, 'editorial_board', member.id), member).catch(console.warn);
    } catch (e) {
      console.error('Error saving editorial member:', e);
    }
  };

  const deleteEditorialMember = async (id: string) => {
    const updated = editorialMembers.filter(m => m.id !== id);
    setEditorialMembers(updated);
    try {
      localStorage.setItem('local_editorial_members_cache', JSON.stringify(updated));
    } catch (e) {}
    try {
      await deleteDoc(doc(db, 'editorial_members', id));
      await deleteDoc(doc(db, 'editorial_board', id)).catch(console.warn);
    } catch (e) {
      console.error('Error deleting editorial member:', e);
    }
  };

  const saveAnnouncement = async (announcement: Announcement) => {
    const updated = announcements.filter(a => a.id !== announcement.id);
    updated.unshift(announcement);
    setAnnouncements(updated);
    try {
      await setDoc(doc(db, 'announcements', announcement.id), announcement);
    } catch (e) {
      console.error('Error saving announcement:', e);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    try {
      await deleteDoc(doc(db, 'announcements', id));
    } catch (e) {
      console.error('Error deleting announcement:', e);
    }
  };

  // Fast client-side image/photo compression before uploading to Firebase Storage
  const compressImageFileIfNeeded = async (file: File, maxDim = 1920, quality = 0.82): Promise<File> => {
    const nameLower = file.name.toLowerCase();
    const isSvg = file.type === 'image/svg+xml' || nameLower.endsWith('.svg');
    const isGif = file.type === 'image/gif' || nameLower.endsWith('.gif');
    
    // Skip small images (<350KB), SVGs, and GIFs
    if (isSvg || isGif || file.size <= 350 * 1024) {
      return file;
    }

    return new Promise<File>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width <= maxDim && height <= maxDim && file.size <= 600 * 1024) {
            resolve(file);
            return;
          }
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(file);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob && blob.size < file.size) {
                const cleanName = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
                const compressedFile = new File([blob], cleanName, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
                console.log(`[Image Compress] Reduced "${file.name}" from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(compressedFile.size / 1024).toFixed(1)}KB`);
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = () => resolve(file);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  };

  const uploadFileToStorage = async (
    rawFile: File, 
    folder?: string,
    onProgress?: (progress: number, details?: UploadProgressDetails) => void
  ): Promise<{ url: string; path: string; fileId: string }> => {
    // 1. Verify File object
    if (!rawFile || !(rawFile instanceof File)) {
      throw new Error('Invalid File: Expected a valid File object.');
    }

    if (rawFile.size <= 0) {
      throw new Error(`Empty File: Selected file "${rawFile.name}" has 0 bytes.`);
    }

    const nameLower = rawFile.name.toLowerCase();
    const isJpg = nameLower.endsWith('.jpg') || nameLower.endsWith('.jpeg') || rawFile.type === 'image/jpeg';
    const isPng = nameLower.endsWith('.png') || rawFile.type === 'image/png';
    const isWebp = nameLower.endsWith('.webp') || rawFile.type === 'image/webp';
    const isImage = isJpg || isPng || isWebp || rawFile.type.startsWith('image/');

    const isPdf = rawFile.type === 'application/pdf' || nameLower.endsWith('.pdf');
    const isDoc = rawFile.type.includes('word') || /\.(doc|docx)$/i.test(nameLower);
    const isSupportedDoc = isPdf || isDoc;

    // Reject unsupported formats clearly
    if (!isImage && !isSupportedDoc) {
      throw new Error(`Unsupported file format "${rawFile.name}". Only PDF, DOC, DOCX, JPG, PNG, and WEBP files are supported.`);
    }

    // Size validation: Images max 5MB, Documents max 15MB
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
    const MAX_DOC_SIZE = 15 * 1024 * 1024;

    if (isImage && rawFile.size > MAX_IMAGE_SIZE) {
      throw new Error(`Image size (${(rawFile.size / 1024 / 1024).toFixed(1)} MB) exceeds maximum allowed 5 MB limit.`);
    }

    if (isSupportedDoc && rawFile.size > MAX_DOC_SIZE) {
      throw new Error(`Document size (${(rawFile.size / 1024 / 1024).toFixed(1)} MB) exceeds maximum allowed 15 MB limit.`);
    }

    if (onProgress) {
      onProgress(5, {
        loaded: 0,
        total: rawFile.size,
        speedBps: 0,
        timeRemainingSec: 0,
        statusText: 'प्रारंभ हो रहा है...'
      });
    }

    // Compress photo images over 350KB before upload for lightning-fast transfer
    let fileToUpload = rawFile;
    if (isImage) {
      if (onProgress) onProgress(15);
      fileToUpload = await compressImageFileIfNeeded(rawFile, 1920, 0.82);
    }

    const fileId = 'file_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    // Register blob locally for instant preview (<10ms) & store in IndexedDB
    const localBlobUrl = fileBlobManager.registerBlob(fileId, fileToUpload);
    if (onProgress) {
      onProgress(20, {
        loaded: Math.round(fileToUpload.size * 0.2),
        total: fileToUpload.size,
        speedBps: 0,
        timeRemainingSec: 0,
        statusText: 'लोकल स्टोरेज में सुरक्षित...'
      });
    }

    // Determine specific Content-Type metadata
    let contentType = fileToUpload.type;
    if (!contentType || contentType === 'application/octet-stream') {
      if (isPdf) contentType = 'application/pdf';
      else if (nameLower.endsWith('.docx')) contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      else if (nameLower.endsWith('.doc')) contentType = 'application/msword';
      else if (isPng) contentType = 'image/png';
      else if (isWebp) contentType = 'image/webp';
      else if (isJpg) contentType = 'image/jpeg';
      else if (isImage) contentType = 'image/jpeg';
      else contentType = 'application/octet-stream';
    }

    const currentUser = auth.currentUser;
    const userUid = currentUser?.uid || 'guest';
    
    const userCategory = isImage ? 'images' : 'documents';
    const targetFolder = folder || `users/${userUid}/${userCategory}`;
    const cleanFileName = fileToUpload.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${targetFolder}/${Date.now()}_${cleanFileName}`;

    const metadata = {
      contentType: contentType,
      customMetadata: {
        originalName: rawFile.name,
        uploadedBy: userUid,
        uploadedAt: new Date().toISOString()
      }
    };

    let downloadUrl = '';
    let storageUploadSuccess = false;

    // Fast-track Resumable Firebase Storage upload with live percentage progress & 12s adaptive fallback
    try {
      const storageRef = ref(storage, storagePath);
      console.log(`[Firebase Storage Upload] Uploading "${fileToUpload.name}" (${(fileToUpload.size / 1024).toFixed(1)} KB)...`);

      const uploadTask = uploadBytesResumable(storageRef, fileToUpload, metadata);
      const startTime = Date.now();

      const taskPromise = new Promise<string>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            if (snapshot.totalBytes > 0) {
              const rawPct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              const pct = Math.min(98, Math.max(20, rawPct));
              const elapsedSec = Math.max(0.1, (Date.now() - startTime) / 1000);
              const speedBps = snapshot.bytesTransferred / elapsedSec;
              const remainingBytes = snapshot.totalBytes - snapshot.bytesTransferred;
              const timeRemainingSec = speedBps > 0 ? Math.ceil(remainingBytes / speedBps) : 0;

              if (onProgress) {
                onProgress(pct, {
                  loaded: snapshot.bytesTransferred,
                  total: snapshot.totalBytes,
                  speedBps,
                  timeRemainingSec,
                  statusText: `क्लाउड अपलोड जारी: ${pct}%`
                });
              }
            }
          },
          (error) => {
            reject(error);
          },
          async () => {
            try {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            } catch (err) {
              reject(err);
            }
          }
        );
      });

      // 12s adaptive timeout for high-speed response
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Firebase Storage response timeout (12s limit reached)')), 12000)
      );

      downloadUrl = await Promise.race([taskPromise, timeoutPromise]);
      storageUploadSuccess = true;
      console.log(`[Firebase Storage Upload] Direct Storage URL:`, downloadUrl);
    } catch (storageErr) {
      console.warn('[uploadFileToStorage] Firebase Storage direct upload skipped or timed out, using local persistent store:', storageErr);
    }

    // Fallback URL if Storage skipped or timed out
    if (!storageUploadSuccess || !downloadUrl) {
      if (isImage && fileToUpload.size < 1024 * 1024 * 2) {
        try {
          let dataUrl = await readFileAsDataUrl(fileToUpload);
          dataUrl = await compressImageDataUrlIfNeeded(dataUrl, 1000, 0.80);
          downloadUrl = dataUrl;
        } catch (e) {
          downloadUrl = localBlobUrl;
        }
      } else {
        downloadUrl = localBlobUrl;
      }
    }

    if (onProgress) {
      onProgress(100, {
        loaded: fileToUpload.size,
        total: fileToUpload.size,
        speedBps: 0,
        timeRemainingSec: 0,
        statusText: 'अपलोड पूर्ण (100%)'
      });
    }

    // Save lightweight metadata record to Firestore collections (user_files & media)
    const userFileRecord = {
      id: fileId,
      name: rawFile.name,
      type: contentType,
      size: fileToUpload.size,
      user_id: userUid,
      url_id: fileId,
      url: storageUploadSuccess ? downloadUrl : fileId,
      uploaded_at: new Date().toISOString(),
      storage_path: storagePath
    };

    try {
      await setDoc(doc(db, 'user_files', fileId), userFileRecord);
    } catch (err) {
      console.warn('Firestore setDoc warning for user_files:', err);
    }

    const mediaItem: MediaFile = {
      id: fileId,
      name: rawFile.name,
      url: storageUploadSuccess ? downloadUrl : fileId,
      storage_path: storagePath,
      type: isPdf ? 'pdf' : isImage ? 'image' : 'doc',
      size: fileToUpload.size,
      uploaded_at: new Date().toISOString()
    };

    setMediaFiles(prev => [mediaItem, ...prev.filter(m => m.id !== fileId)]);
    await setDoc(doc(db, 'media', fileId), mediaItem).catch(e => {
      console.warn('Firestore media record save warning:', e);
    });

    if (onProgress) onProgress(100);

    return { 
      url: storageUploadSuccess ? downloadUrl : localBlobUrl, 
      path: storagePath, 
      fileId: fileId 
    };
  };

  const deleteFileFromStorage = async (path: string) => {
    try {
      if (path.startsWith('user_files/')) {
        const fileId = path.replace('user_files/', '');
        await deleteDoc(doc(db, 'user_files', fileId)).catch(() => {});
        await deleteDoc(doc(db, 'media', fileId)).catch(() => {});
      } else {
        await deleteDoc(doc(db, 'media', path)).catch(() => {});
      }
    } catch (err) {
      console.warn('Error deleting file record from Firestore:', err);
    }
    setMediaFiles(prev => prev.filter(m => m.storage_path !== path));
  };

  const submitContactMessage = async (msg: Omit<ContactMessage, 'id' | 'date' | 'status'>) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: 'msg_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'unread'
    };
    setContactMessages(prev => [newMsg, ...prev]);
    try {
      await setDoc(doc(db, 'contact_messages', newMsg.id), newMsg);
    } catch (e) {
      console.error('Error submitting contact message:', e);
    }
  };

  const addSubmission = async (sub: Omit<import('../types').Submission, 'id' | 'status' | 'submitted_at'>) => {
    const newSub: import('../types').Submission = {
      ...sub,
      id: crypto.randomUUID(),
      status: 'pending',
      submitted_at: new Date().toISOString()
    };
    setSubmissions(prev => [newSub, ...prev]);
    try {
      await setDoc(doc(db, 'submissions', newSub.id), newSub);
    } catch (e) {
      console.error('Error adding submission:', e);
    }
  };

  const saveSubmission = async (submission: import('../types').Submission) => {
    setSubmissions(prev => {
      const exists = prev.some(s => s.id === submission.id);
      if (exists) {
        return prev.map(s => s.id === submission.id ? submission : s);
      }
      return [submission, ...prev];
    });
    try {
      await setDoc(doc(db, 'submissions', submission.id), submission);
    } catch (e) {
      console.error('Error saving submission:', e);
    }
  };

  const updateSubmissionStatus = async (id: string, status: import('../types').Submission['status']) => {
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    try {
      await updateDoc(doc(db, 'submissions', id), { status });
    } catch (e) {
      console.error('Error updating submission status:', e);
    }
  };

  const deleteSubmission = async (id: string) => {
    setSubmissions(prev => prev.filter(s => s.id !== id));
    try {
      await deleteDoc(doc(db, 'submissions', id));
    } catch (e) {
      console.error('Error deleting submission:', e);
    }
  };

  const incrementArticleViews = async (articleId: string) => {
    setArticles(prev => prev.map(a => a.id === articleId ? { ...a, views_count: (a.views_count || 0) + 1 } : a));
    try {
      const refDoc = doc(db, 'articles', articleId);
      await updateDoc(refDoc, { views_count: increment(1) });
    } catch (e) {
      console.warn('Could not update views count:', e);
    }
  };

  const incrementArticleDownloads = async (articleId: string) => {
    setArticles(prev => prev.map(a => a.id === articleId ? { ...a, downloads_count: (a.downloads_count || 0) + 1 } : a));
    try {
      const refDoc = doc(db, 'articles', articleId);
      await updateDoc(refDoc, { downloads_count: increment(1) });
    } catch (e) {
      console.warn('Could not update downloads count:', e);
    }
  };

  // Shabdkosh CRUD
  const saveShabdkosh = async (item: PawariShabdkoshItem) => {
    const isNew = !shabdkoshList.some(s => s.id === item.id);
    const updated = shabdkoshList.filter(s => s.id !== item.id);
    updated.unshift(item);
    setShabdkoshList(updated);
    try { localStorage.setItem('pawari_shabdkosh_cache', JSON.stringify(updated)); } catch (e) {}
    try { await setDoc(doc(db, 'shabdkosh', item.id), item); } catch (e) { console.error(e); }

    logActivity({
      category: 'shabdkosh',
      action: isNew ? 'create' : 'update',
      title: isNew ? `Added Shabdkosh Word "${item.word_pawari}"` : `Updated Shabdkosh Word "${item.word_pawari}"`,
      details: `Meaning: ${item.meaning_hindi}, Category: ${item.category}`
    }).catch(console.warn);
  };

  const deleteShabdkosh = async (id: string) => {
    const itemToDelete = shabdkoshList.find(s => s.id === id);
    const updated = shabdkoshList.filter(s => s.id !== id);
    setShabdkoshList(updated);
    try { localStorage.setItem('pawari_shabdkosh_cache', JSON.stringify(updated)); } catch (e) {}
    try { await deleteDoc(doc(db, 'shabdkosh', id)); } catch (e) { console.error(e); }

    logActivity({
      category: 'shabdkosh',
      action: 'delete',
      title: `Deleted Shabdkosh Word "${itemToDelete?.word_pawari || id}"`,
      details: `Removed word entry from dictionary`
    }).catch(console.warn);
  };

  // Paheli CRUD
  const savePaheli = async (item: PawariPaheliItem) => {
    const isNew = !paheliList.some(p => p.id === item.id);
    const updated = paheliList.filter(p => p.id !== item.id);
    updated.unshift(item);
    setPaheliList(updated);
    try { localStorage.setItem('pawari_paheli_cache', JSON.stringify(updated)); } catch (e) {}
    try { await setDoc(doc(db, 'paheli', item.id), item); } catch (e) { console.error(e); }

    logActivity({
      category: 'paheli',
      action: isNew ? 'create' : 'update',
      title: isNew ? `Added Paheli Riddle` : `Updated Paheli Riddle`,
      details: `Riddle: "${item.riddle_pawari.slice(0, 40)}...", Answer: ${item.answer_hindi}`
    }).catch(console.warn);
  };

  const deletePaheli = async (id: string) => {
    const itemToDelete = paheliList.find(p => p.id === id);
    const updated = paheliList.filter(p => p.id !== id);
    setPaheliList(updated);
    try { localStorage.setItem('pawari_paheli_cache', JSON.stringify(updated)); } catch (e) {}
    try { await deleteDoc(doc(db, 'paheli', id)); } catch (e) { console.error(e); }

    logActivity({
      category: 'paheli',
      action: 'delete',
      title: `Deleted Paheli Riddle`,
      details: `Removed riddle "${itemToDelete?.riddle_pawari.slice(0, 30)}..."`
    }).catch(console.warn);
  };

  // Lokgeet CRUD
  const saveLokgeet = async (item: PawariLokgeetItem) => {
    const isNew = !lokgeetList.some(l => l.id === item.id);
    const updated = lokgeetList.filter(l => l.id !== item.id);
    updated.unshift(item);
    setLokgeetList(updated);
    try { localStorage.setItem('pawari_lokgeet_cache', JSON.stringify(updated)); } catch (e) {}
    try { await setDoc(doc(db, 'lokgeet', item.id), item); } catch (e) { console.error(e); }

    logActivity({
      category: 'lokgeet',
      action: isNew ? 'create' : 'update',
      title: isNew ? `Added Lokgeet "${item.title_pawari}"` : `Updated Lokgeet "${item.title_pawari}"`,
      details: `Category: ${item.category}, Collector: ${item.singer_or_collector || 'N/A'}`
    }).catch(console.warn);
  };

  const deleteLokgeet = async (id: string) => {
    const itemToDelete = lokgeetList.find(l => l.id === id);
    const updated = lokgeetList.filter(l => l.id !== id);
    setLokgeetList(updated);
    try { localStorage.setItem('pawari_lokgeet_cache', JSON.stringify(updated)); } catch (e) {}
    try { await deleteDoc(doc(db, 'lokgeet', id)); } catch (e) { console.error(e); }

    logActivity({
      category: 'lokgeet',
      action: 'delete',
      title: `Deleted Lokgeet "${itemToDelete?.title_pawari || id}"`,
      details: `Removed folk song entry`
    }).catch(console.warn);
  };

  // Quiz Question CRUD
  const saveQuizQuestion = async (question: QuizQuestion) => {
    const isNew = !quizQuestions.some(q => q.id === question.id);
    const updated = quizQuestions.filter(q => q.id !== question.id);
    updated.unshift(question);
    setQuizQuestions(updated);
    try { localStorage.setItem('pawari_quiz_cache', JSON.stringify(updated)); } catch (e) {}
    try { await setDoc(doc(db, 'quiz_questions', question.id), question); } catch (e) { console.error(e); }

    logActivity({
      category: 'quiz',
      action: isNew ? 'create' : 'update',
      title: isNew ? `Added Quiz Question` : `Updated Quiz Question`,
      details: `Question: "${question.question_hindi.slice(0, 40)}..."`
    }).catch(console.warn);
  };

  const deleteQuizQuestion = async (id: string) => {
    const qToDelete = quizQuestions.find(q => q.id === id);
    const updated = quizQuestions.filter(q => q.id !== id);
    setQuizQuestions(updated);
    try { localStorage.setItem('pawari_quiz_cache', JSON.stringify(updated)); } catch (e) {}
    try { await deleteDoc(doc(db, 'quiz_questions', id)); } catch (e) { console.error(e); }

    logActivity({
      category: 'quiz',
      action: 'delete',
      title: `Deleted Quiz Question`,
      details: `Removed question "${qToDelete?.question_hindi.slice(0, 30)}..."`
    }).catch(console.warn);
  };

  // Public User Contributions
  const submitPublicContribution = async (type: 'shabdkosh' | 'paheli' | 'lokgeet' | 'blogs' | 'books', itemData: any) => {
    const id = 'contrib_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    const newItem = {
      ...itemData,
      id: itemData.id || id,
      status: 'pending' as const,
      created_at: itemData.created_at || new Date().toISOString()
    };

    if (type === 'shabdkosh') {
      const updated = [newItem as PawariShabdkoshItem, ...shabdkoshList];
      setShabdkoshList(updated);
      try { localStorage.setItem('pawari_shabdkosh_cache', JSON.stringify(updated)); } catch (e) {}
    } else if (type === 'paheli') {
      const updated = [newItem as PawariPaheliItem, ...paheliList];
      setPaheliList(updated);
      try { localStorage.setItem('pawari_paheli_cache', JSON.stringify(updated)); } catch (e) {}
    } else if (type === 'lokgeet') {
      const updated = [newItem as PawariLokgeetItem, ...lokgeetList];
      setLokgeetList(updated);
      try { localStorage.setItem('pawari_lokgeet_cache', JSON.stringify(updated)); } catch (e) {}
    } else if (type === 'blogs') {
      const updated = [newItem as BlogItem, ...blogs];
      setBlogs(updated);
      try { localStorage.setItem('local_blogs_cache', JSON.stringify(updated)); } catch (e) {}
    } else if (type === 'books') {
      const updated = [newItem as BookItem, ...books];
      setBooks(updated);
      try { localStorage.setItem('local_books_cache', JSON.stringify(updated)); } catch (e) {}
    }

    try { await setDoc(doc(db, type, newItem.id), newItem); } catch (e) { console.error(e); }

    logActivity({
      category: type === 'shabdkosh' ? 'shabdkosh' : type === 'paheli' ? 'paheli' : type === 'lokgeet' ? 'lokgeet' : type === 'blogs' ? 'blogs' : 'books',
      action: 'create',
      title: `New Public User Submission (${type.toUpperCase()})`,
      details: `Submitted by: ${itemData.contributor_name || itemData.author || itemData.authors || 'Public Reader'}`
    }).catch(console.warn);
  };

  const updateContributionStatus = async (type: 'shabdkosh' | 'paheli' | 'lokgeet' | 'blogs' | 'books' | 'submissions', id: string, status: 'approved' | 'pending' | 'rejected') => {
    if (type === 'shabdkosh') {
      const updated = shabdkoshList.map(item => item.id === id ? { ...item, status } : item);
      setShabdkoshList(updated);
      try { localStorage.setItem('pawari_shabdkosh_cache', JSON.stringify(updated)); } catch (e) {}
      try { await updateDoc(doc(db, 'shabdkosh', id), { status }); } catch (e) { console.error(e); }
    } else if (type === 'paheli') {
      const updated = paheliList.map(item => item.id === id ? { ...item, status } : item);
      setPaheliList(updated);
      try { localStorage.setItem('pawari_paheli_cache', JSON.stringify(updated)); } catch (e) {}
      try { await updateDoc(doc(db, 'paheli', id), { status }); } catch (e) { console.error(e); }
    } else if (type === 'lokgeet') {
      const updated = lokgeetList.map(item => item.id === id ? { ...item, status } : item);
      setLokgeetList(updated);
      try { localStorage.setItem('pawari_lokgeet_cache', JSON.stringify(updated)); } catch (e) {}
      try { await updateDoc(doc(db, 'lokgeet', id), { status }); } catch (e) { console.error(e); }
    } else if (type === 'blogs') {
      const updated = blogs.map(item => item.id === id ? { ...item, status } : item);
      setBlogs(updated);
      try { localStorage.setItem('local_blogs_cache', JSON.stringify(updated)); } catch (e) {}
      try { await updateDoc(doc(db, 'blogs', id), { status }); } catch (e) { console.error(e); }
    } else if (type === 'books') {
      const updated = books.map(item => item.id === id ? { ...item, status } : item);
      setBooks(updated);
      try { localStorage.setItem('local_books_cache', JSON.stringify(updated)); } catch (e) {}
      try { await updateDoc(doc(db, 'books', id), { status }); } catch (e) { console.error(e); }
    } else if (type === 'submissions') {
      const mappedStatus = status === 'approved' ? 'accepted' : status === 'rejected' ? 'rejected' : 'pending';
      const updated = submissions.map(item => item.id === id ? { ...item, status: mappedStatus as any } : item);
      setSubmissions(updated);
      try { await updateDoc(doc(db, 'submissions', id), { status: mappedStatus }); } catch (e) { console.error(e); }
    }

    logActivity({
      category: (type === 'shabdkosh' || type === 'paheli' || type === 'lokgeet' || type === 'blogs' || type === 'books') ? type : 'general',
      action: 'status_change',
      title: `Changed Submission Status to ${status.toUpperCase()} (${type.toUpperCase()})`,
      details: `Item ID: ${id}`
    }).catch(console.warn);
  };

  return (
    <CmsContext.Provider
      value={{
        lang,
        setLang,
        activeView,
        setActiveView,
        selectedArticleId,
        setSelectedArticleId,
        isNotFound,
        setIsNotFound,
        activeAdminTab,
        setActiveAdminTab,
        settings,
        articles,
        issues,
        books,
        blogs,
        shabdkoshList,
        paheliList,
        lokgeetList,
        quizQuestions,
        pages,
        editorialMembers,
        announcements,
        mediaFiles,
        contactMessages,
        submissions,
        activityLogs,
        loadingData,
        logActivity,
        clearActivityLogs,
        activePdfUrl,
        activePdfTitle,
        openPdfViewer,
        closePdfViewer,
        saveSettings,
        saveArticle,
        deleteArticle,
        saveIssue,
        deleteIssue,
        saveBook,
        deleteBook,
        saveBlog,
        deleteBlog,
        saveShabdkosh,
        deleteShabdkosh,
        savePaheli,
        deletePaheli,
        saveLokgeet,
        deleteLokgeet,
        saveQuizQuestion,
        deleteQuizQuestion,
        submitPublicContribution,
        updateContributionStatus,
        savePage,
        saveEditorialMember,
        deleteEditorialMember,
        saveAnnouncement,
        deleteAnnouncement,
        uploadFileToStorage,
        deleteFileFromStorage,
        submitContactMessage,
        incrementArticleViews,
        incrementArticleDownloads,
        addSubmission,
        saveSubmission,
        updateSubmissionStatus,
        deleteSubmission,
        seedDatabaseIfEmpty,
        fetchArticleByIdOrSlug,
        syncAllArticlesToCloud
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = () => {
  const context = useContext(CmsContext);
  if (!context) throw new Error('useCms must be used within CmsProvider');
  return context;
};
