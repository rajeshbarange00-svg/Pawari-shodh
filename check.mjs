import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  projectId: "pawari-shodh-patrika",
  appId: "1:855143303712:web:67edd185cc659733d70a45",
  apiKey: "AIzaSyDfaCGKEueCZp4hGbeUNfzQ_V3bQ3MK3W8",
  authDomain: "pawari-shodh-patrika.firebaseapp.com",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  const articlesSnap = await getDocs(collection(db, "articles"));
  const issuesSnap = await getDocs(collection(db, "issues"));
  
  console.log("Total articles:", articlesSnap.docs.length);
  const articleStatuses = {};
  articlesSnap.docs.forEach(doc => {
      const data = doc.data();
      articleStatuses[data.status] = (articleStatuses[data.status] || 0) + 1;
  });
  console.log("Article statuses:", articleStatuses);

  console.log("Total issues:", issuesSnap.docs.length);
  const issueStatuses = {};
  issuesSnap.docs.forEach(doc => {
      const data = doc.data();
      issueStatuses[data.status] = (issueStatuses[data.status] || 0) + 1;
  });
  console.log("Issue statuses:", issueStatuses);
  
  process.exit(0);
}

check();
