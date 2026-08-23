const fs = require('fs');
const content = fs.readFileSync('./src/data/pawariCulturalData.ts', 'utf8');
const match = content.match(/export const SAMPLE_PAHELI: PawariPaheliItem\[\] = (\[[\s\S]*?\]);\n\nexport const SAMPLE_LOKGEET/);
const list = eval(match[1]);

console.log("Auditing total:", list.length);

// Let us inspect every single item for potential issues or doubts:
const issues = [];

list.forEach((item, index) => {
  const r = item.riddle_pawari.trim();
  const ah = item.answer_hindi.trim();
  const ap = item.answer_pawari.trim();
  
  // Checking specific known folk riddles:
  // 1. "कारो बाप, हरी महतारी, ओकी बेटी परम पियारी / खाय भी पहनय भी।" -> Answer: कपास / बिनौला (Cotton) or आचार/चिरौंजी/कपास
  // 2. "एक चीज का नाम बताए, हर धरम के लोग खाए।" -> Answer: कसम
  // 3. "घाम म् जिंदो छाय म् मर जाय..." -> Answer: पसीना
  // 4. "दरवाजा प खड़ो घोड़ा, आता-जाता पेट मरोड़ा।" -> Answer: ताला
  // 5. "हय छोटो पर बड़ा कहाऊं, डूब दही म् मू नहाऊं।" -> Answer: दही बड़ा
  // 6. "कटोरा म् कटोरा, बेटा बाप सी भी गोरा।" -> Answer: नारियल
  // 7. "देखो एक अनोखी नारी, पाय सी वा पेय पानी।" -> Answer: दीया बत्ती / पेड़
  // 8. "एक नार, सींग हजार, साफ करय घूम बजार।" -> Answer: खरेटा / झाड़ू
  // 9. "नान्हो सो वीर, गाना गा ख् मारय तीर।" -> Answer: मच्छर
  // 10. "जरा सी चुहिया, गज भर चुटिया।" -> Answer: सुई-डोरा
  
  // Let us check if any answer contains suspicious values or mismatches:
  if (r.includes("सतपुड़ा की पवारी बोली") || r.includes("घर-घर गूंजे पवारी बाणी")) {
    issues.push({ index, id: item.id, reason: "Meta / non-traditional riddle (slogan)", r, ah });
  }
});

console.log("Issues / Meta items found:", issues.length);
issues.forEach(i => console.log(`[${i.id}] ${i.reason}: "${i.r}" -> ${i.ah}`));
