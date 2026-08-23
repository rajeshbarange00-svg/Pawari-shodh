import fs from 'fs';
const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const url = 'https://firestore.googleapis.com/v1/projects/' + config.projectId + '/databases/(default)/documents/articles';
fetch(url).then(r => r.json()).then(data => {
  const articles = data.documents || [];
  console.log('Total articles:', articles.length);
  const statuses = {};
  const volumes = {};
  articles.forEach(a => {
    const status = a.fields.status?.stringValue;
    statuses[status] = (statuses[status] || 0) + 1;
    const vol = a.fields.volume?.integerValue || a.fields.volume?.stringValue;
    const iss = a.fields.issue?.integerValue || a.fields.issue?.stringValue;
    const volType = typeof a.fields.volume?.integerValue !== 'undefined' ? 'int' : typeof a.fields.volume?.stringValue !== 'undefined' ? 'string' : 'other';
    const issType = typeof a.fields.issue?.integerValue !== 'undefined' ? 'int' : typeof a.fields.issue?.stringValue !== 'undefined' ? 'string' : 'other';
    const key = vol + '_' + iss + ' (' + volType + '_' + issType + ')';
    volumes[key] = (volumes[key] || 0) + 1;
  });
  console.log('Statuses:', statuses);
  console.log('Volumes_Issues:', volumes);
  
  return fetch('https://firestore.googleapis.com/v1/projects/' + config.projectId + '/databases/(default)/documents/issues');
}).then(r => r.json()).then(data => {
  const issues = data.documents || [];
  console.log('Total issues:', issues.length);
  issues.forEach(i => {
    const status = i.fields.status?.stringValue;
    const vol = i.fields.volume?.integerValue || i.fields.volume?.stringValue;
    const iss = i.fields.issue_number?.integerValue || i.fields.issue_number?.stringValue;
    console.log('Issue:', vol, iss, status);
  });
});
