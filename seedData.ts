import { JournalSettings, PageContent, Article, Issue, EditorialMember, Announcement, UserProfile } from '../types';

export const DEFAULT_SETTINGS: JournalSettings = {
  journal_title_hindi: 'पवारी शोध पत्रिका',
  journal_title_english: 'Pawari Shodh Patrika',
  subtitle_hindi: 'पवारी भाषा, साहित्य एवं मध्यप्रदेश की लोकभाषाओं, संस्कृतियों व क्षेत्रीय अध्ययन की शोध पत्रिका',
  subtitle_english: 'A Peer-Reviewed Journal of Pawari Language, Literature & Regional Dialects, Folk Culture and Social History of Central India',
  logo_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200&auto=format&fit=crop&q=80',
  issn_online: 'Applied For',
  issn_print: 'Applied For',
  publisher_hindi: 'माँ ताप्ती शोध संस्थान, मुलताई',
  publisher_english: 'Maa Tapti Research Institute, Multai',
  frequency_hindi: 'अर्द्धवार्षिक (छमाही - जून एवं दिसंबर)',
  frequency_english: 'Half-Yearly (June & December)',
  language_policy: 'Hindi / English (द्विभाषी - हिंदी एवं अंग्रेजी)',
  contact_email: 'maa.tapti.shodh.sansthan@gmail.com',
  contact_phone: '8604476649, 9975981957',
  contact_address_hindi: 'माँ ताप्ती शोध संस्थान, अनुसंधान एवं प्रकाशन विभाग, मुलताई – 460661, ज़िला बैतूल, मध्यप्रदेश, भारत',
  contact_address_english: 'Maa Tapti Research Institute, Research & Publication Dept., Multai – 460661, District Betul, Madhya Pradesh, India',
  footer_text_hindi: '© 2025 पवारी शोध पत्रिका। सर्वाधिकार सुरक्षित। माँ ताप्ती शोध संस्थान, मुलताई द्वारा प्रकाशित।',
  footer_text_english: '© 2025 Pawari Shodh Patrika. All Rights Reserved. Published by Maa Tapti Research Institute, Multai, India.',
  call_for_papers: {
    title_badge_english: 'Call for Papers 2025',
    title_badge_hindi: 'शोध पत्र आमंत्रण 2025',
    heading_english: 'Submit Manuscript for Next Issue',
    heading_hindi: 'शोध पत्र सबमिशन हेतु आमंत्रण',
    description_english: 'Fast-track peer review process. Zero publication fees.',
    description_hindi: 'पीर-रिव्यू प्रक्रिया। शून्य प्रकाशन शुल्क।',
    deadline_date: '31st May',
    target_volume_issue: 'Vol. 1 Issue 1',
    is_active: true
  },
  journal_metrics: {
    impact_factor_label: 'Peer-Reviewed & Open Access Journal',
    impact_factor_value: 'Bilingual',
    peer_review_text: 'Refereed & Double-Blind Peer Reviewed',
    indexing_badge_1: 'Google Scholar',
    indexing_badge_2: 'Zenodo',
    indexing_badge_3: 'ResearchGate',
    indexing_badge_4: 'Academia.edu'
  },
  theme_preset: 'maroon_gold',
  primary_color: '#420708',
  secondary_color: '#7f1d1d',
  accent_color: '#d97706',
  homepage_sections: [
    { id: 'sec-1', key: 'hero', title_hindi: 'मुख्य बैनर', title_english: 'Hero Banner', visible: true, order: 1 },
    { id: 'sec-2', key: 'announcements', title_hindi: 'सूचनाएं एवं समाचार', title_english: 'Announcements & News', visible: true, order: 2 },
    { id: 'sec-3', key: 'about_summary', title_hindi: 'पत्रिका परिचय', title_english: 'About Journal', visible: true, order: 3 },
    { id: 'sec-4', key: 'latest_issue', title_hindi: 'वर्तमान अंक', title_english: 'Latest Issue Highlight', visible: true, order: 4 },
    { id: 'sec-5', key: 'featured_articles', title_hindi: 'प्रमुख शोध पत्र', title_english: 'Featured Research Papers', visible: true, order: 5 },
    { id: 'sec-6', key: 'director_message', title_hindi: 'संरक्षक संदेश', title_english: 'Patron Message', visible: true, order: 6 },
    { id: 'sec-7', key: 'journal_stats', title_hindi: 'शोध आंकड़े', title_english: 'Journal Metrics & Impact', visible: true, order: 7 },
    { id: 'sec-8', key: 'editorial_board_teaser', title_hindi: 'संपादकीय मंडल', title_english: 'Editorial Leadership', visible: true, order: 8 },
    { id: 'sec-9', key: 'indexing_badges', title_hindi: 'इंडेक्सिंग एवं इंडेक्स', title_english: 'Indexing & Databases', visible: true, order: 9 },
  ],
  navigation_labels: {
    home_hindi: 'मुख्य पृष्ठ',
    home_english: 'Home',
    about_hindi: 'पत्रिका के बारे में',
    about_english: 'About Journal',
    current_issue_hindi: 'वर्तमान अंक',
    current_issue_english: 'Current Issue',
    archive_hindi: 'पुराने अंक (संग्रह)',
    archive_english: 'Archive',
    articles_hindi: 'पुस्तकें एवं ब्लॉग',
    articles_english: 'Books & Blogs',
    books_blogs_hindi: 'पुस्तकें एवं ब्लॉग',
    books_blogs_english: 'Books & Blogs',
    editorial_board_hindi: 'संपादकीय मंडल',
    editorial_board_english: 'Editorial Board',
    author_guidelines_hindi: 'लेखक निर्देश',
    author_guidelines_english: 'Author Guidelines',
    contact_hindi: 'संपर्क करें',
    contact_english: 'Contact Us',
  },
};

export const DEFAULT_PAGES: Record<string, PageContent> = {
  about: {
    id: 'about',
    title_hindi: 'पवारी शोध पत्रिका - परिचय एवं उद्देश्य',
    title_english: 'About Pawari Shodh Patrika - Aims & Scope',
    content_hindi: `
### शोध पत्रिका का परिचय
**पवारी शोध पत्रिका (Pawari Shodh Patrika)** माँ ताप्ती शोध संस्थान, मुलताई द्वारा प्रकाशित एक द्विभाषी (हिंदी एवं अंग्रेजी) एवं अर्द्धवार्षिक पीर-रिव्यूड (Peer-Reviewed) अकादमिक शोध पत्रिका है। यह पत्रिका पवारी (भोयरी/पंवारी) भाषा, साहित्य, इतिहास और संस्कृति के अध्ययन को प्रमुख केंद्र मानते हुए मध्यप्रदेश एवं समीपवर्ती अंचलों की विभिन्न बोलियों (मालवी, निमाड़ी, बुन्देली, बघेली, राजस्थानी), जनजातीय भाषिक परंपराओं (गोंडी, कोरकू, नहाली, भीली, भिलाली, बरेली), लोकसाहित्य, क्षेत्रीय समाजशास्त्र और मौखिक विरासत पर केंद्रित मौलिक अनुसंधान को समर्पित है।

### प्रमुख उद्देश्य एवं विषय दायरा (Aims & Scope)
1. **पवारी भाषा एवं साहित्य:** पवारी (भोयरी/पंवारी) भाषा के ध्वनिविज्ञान, व्याकरण, शब्दकोश, लोकगीत, लोककथाओं और मौखिक इतिहास का वैज्ञानिक विश्लेषण।
2. **क्षेत्रीय बोलियाँ एवं लोकभाषाएँ:** राजस्थानी, मालवी, निमाड़ी, बुन्देली, बघेली एवं मध्यप्रदेश की अन्य उपभाषाओं व स्थानीय रूपों का अध्ययन।
3. **जनजातीय भाषिक परंपराएँ:** गोंडी, कोरकू, नहाली (निहाली), भीली, भिलाली, बरेली तथा अन्य अल्पप्रचलित व संकटग्रस्त भाषिक रूपों का प्रलेखन।
4. **लोकसाहित्य एवं वाचिक विरासत:** लोकगीत, लोककथाएँ, गाथाएँ, कहावतें, लोकनाट्य और जनस्मृतियों का संकलन व संरक्षण।
5. **इतिहास, समाजशास्त्र व लोकज्ञान:** क्षेत्रीय इतिहास, पुरालेख, ताम्रपत्र, वंश/गोत्र अध्ययन, लोक-पारिस्थितिकी (Ethno-Ecology) व पारंपरिक ज्ञान प्रणालियाँ।
6. **तुलनात्मक एवं डिजिटल अध्ययन:** तुलनात्मक भाषाविज्ञान, अनुवाद, पाठ-संपादन, शब्दकोश निर्माण तथा डिजिटल अभिलेखीकरण।
    `,
    content_english: `
### About the Journal
**Pawari Shodh Patrika** is a bilingual (Hindi & English), double-blind peer-reviewed academic journal published by Maa Tapti Research Institute, Multai. Centered on the Pawari (Bhoyari/Panwari) language, literature, history, and culture, the journal provides a scholarly platform for research on the regional dialects (Malvi, Nimadi, Bundeli, Bagheli, Rajasthani), tribal language traditions (Gondi, Korku, Nahali, Bhili, Bhilali, Bareli), folklore, oral history, and social heritage across Madhya Pradesh and neighboring regions.

### Aims & Scope
1. **Pawari Language & Literature:** Scientific study of Pawari grammar, phonetics, lexicon, folk literature, and oral traditions.
2. **Regional Dialects & Folk Languages:** In-depth studies on Rajasthani, Malvi, Nimadi, Bundeli, Bagheli, and regional speech forms of Central India.
3. **Tribal & Indigenous Languages:** Documentation of Gondi, Korku, Nahali (Nihali), Bhili, Bhilali, Bareli, and endangered language varieties.
4. **Folklore & Oral Heritage:** Collection and critical analysis of folk songs, folk tales, proverbs, ritual chants, and folk theater.
5. **History, Sociology & Ethno-Knowledge:** Regional history, epigraphy, clan lineages, traditional agricultural knowledge, and ethno-ecological systems.
6. **Comparative Linguistics & Digital Archiving:** Comparative literature, translation studies, lexicography, and digital archiving.
    `,
    banner_url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop&q=80',
    updated_at: '2026-01-15',
  },
  director_message: {
    id: 'director_message',
    title_hindi: 'संरक्षक एवं निदेशक का संदेश',
    title_english: "Director & Patron's Message",
    content_hindi: `
प्रिय शोधार्थियों, विद्वानों एवं पाठकों,

**पवारी शोध पत्रिका** के माध्यम से हमें मध्य भारत की अनमोल भाषाई एवं सांस्कृतिक विरासत को वैश्विक अकादमिक पटल पर प्रस्तुत करते हुए अत्यंत हर्ष हो रहा है।

हमारी पवारी भाषा न केवल अभिव्यक्ति का माध्यम है, बल्कि इसमें शताब्दियों का लोकज्ञान, पारिस्थितिकीय समझ और सामाजिक समरसता निहित है। आधुनिकता और वैश्विक बदलावों के दौर में क्षेत्रीय बोलियों और लोकसाहित्य को वैज्ञानिक दृष्टि से लिपिबद्ध करना और उनका गंभीर अध्ययन करना हम सभी का नैतिक दायित्व है।

यह पत्रिका केवल एक प्रकाशन मंच नहीं है, बल्कि यह एक अकादमिक क्रांति है जो ग्रामीण एवं अंचलीय शोधार्थियों को अंतर्राष्ट्रीय स्तर के शोध मानकों से जोड़ती है। मैं सभी युवा शोधकर्ताओं और वरिष्ठ विद्वानों का आह्वान करता हूं कि वे अपने मौलिक शोध ग्रंथों से इस पत्रिका को समृद्ध करें।

सादर,
**डॉ. बी. एल. पवार**
संरक्षक एवं निदेशक, पवारी शोध संस्थान
    `,
    content_english: `
Dear Scholars, Researchers, and Readers,

It gives me immense pride and joy to welcome you to **Pawari Shodh Patrika**, a dedicated academic vehicle designed to bring the rich linguistic, historical, and cultural heritage of Central India into global scholarly discourse.

The Pawari dialect carries centuries of oral history, ecological wisdom, and social harmony. In an era of rapid globalization, documenting and analyzing regional languages through rigorous scientific frameworks is a crucial responsibility.

Pawari Shodh Patrika serves as a bridge connecting grassroots researchers with international peer-reviewed standards. We invite scholars across disciplines to contribute original, high-impact research.

Warm regards,
**Dr. B. L. Pawar**
Patron & Director, Pawari Shodh Institute
    `,
    banner_url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&auto=format&fit=crop&q=80',
    updated_at: '2026-01-10',
  },
  author_guidelines: {
    id: 'author_guidelines',
    title_hindi: 'शोधकर्ताओं एवं लेखकों के लिए दिशानिर्देश',
    title_english: 'Guidelines for Authors and Contributors',
    content_hindi: `शोध पत्र प्रस्तुतिकरण नियम (Manuscript Submission Rules)

1. भाषा एवं प्रारूप: शोध पत्र हिंदी (Kruti Dev / Mangal / Unicode), पवारी या अंग्रेजी में स्वीकार किए जाते हैं।
2. शब्द सीमा: शोध पत्र साधारणतः 3000 से 5000 शब्दों के बीच होना चाहिए (सामान्य लेख 1000-1500 शब्द)।
3. आवश्यक संरचना:
   • शीर्षक: हिंदी एवं अंग्रेजी दोनों में अनिवार्य।
   • शोध सार (Abstract): 150-250 शब्द (हिंदी और अंग्रेजी दोनों में)।
   • बीज शब्द (Keywords): 4 से 6 कीवर्ड।
   • मुख्य पाठ: प्रस्तावना, शोध विधि/साहित्य समीक्षा, विश्लेषण/विवेचना, निष्कर्ष।
   • संदर्भ सूची (References): APA (American Psychological Association) 7th Edition शैली में।
4. मौलिकता एवं प्लेगेरिज्म (Plagiarism): शोध पत्र पूर्णतः मौलिक एवं अप्रकाशित होना चाहिए। प्लेगेरिज्म 10% से अधिक होने पर प्रविष्टि निरस्त कर दी जाएगी।
5. प्रकाशक एवं सर्वाधिकार: सर्वाधिकार माँ ताप्ती शोध संस्थान मुलताई के पास सुरक्षित रहेंगे।
6. प्रकाशन शुल्क (Processing Fee): पत्रिका किसी भी प्रकार का व्यावसायिक या अनिवार्य प्रकाशन शुल्क नहीं लेती (Non-Commercial Open Access)।`,
    content_english: `Manuscript Preparation & Submission Rules

1. Language & Font: Manuscripts can be written in Hindi (Unicode/Mangal/Krutidev 010), Pawari, or English (Times New Roman, 12pt).
2. Word Count: Research articles should typically range between 3,000 to 5,000 words. General articles: 1,000 to 1,500 words.
3. Required Article Structure:
   • Title in both Hindi and English
   • Bilingual Abstract (150-250 words in both English and Hindi)
   • Keywords (4-6 index terms)
   • Main Body: Introduction, Literature Review, Methodology, Results/Analysis, Conclusion
   • References in APA 7th Edition format
4. Plagiarism Policy: All manuscripts are screened using similarity software. Similarity index must be below 10%.
5. Originality & Ethics: Submissions must be original and unpublished. Authors hold full responsibility for the content.
6. Article Processing Charge (APC): Pawari Shodh Patrika is an open-access academic initiative with no mandatory publication fees for independent researchers.`,
    banner_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop&q=80',
    updated_at: '2026-01-20',
  },
};

export const SAMPLE_ISSUES: Issue[] = [
  {
    id: 'issue-v2i1-2026',
    title_hindi: 'वर्ष 2, अंक 1 (जनवरी - जून 2026) - वर्तमान अंक',
    title_english: 'Volume 2, Issue 1 (Jan - Jun 2026) - Current Issue',
    volume: 2,
    issue_number: 1,
    year: 2026,
    month: 'Jan - Jun 2026',
    cover_image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    status: 'current',
    editorial_note_hindi: 'इस अंक में सतपुड़ा-वैनगंगा अंचल की बोलियों, लोकसाहित्य एवं सामाजिक संरचना पर आधारित 5 उत्कृष्ट पीर-रिव्यूड शोध पत्र सम्मिलित हैं।',
    editorial_note_english: 'This current issue features 5 peer-reviewed articles covering Central Indian dialectology, folk traditions, and sociological frameworks.',
    publication_date: '2026-06-15',
    created_at: '2026-06-01',
  },
  {
    id: 'issue-v1i2-2025',
    title_hindi: 'वर्ष 1, अंक 2 (जुलाई - दिसंबर 2025)',
    title_english: 'Volume 1, Issue 2 (Jul - Dec 2025)',
    volume: 1,
    issue_number: 2,
    year: 2025,
    month: 'Jul - Dec 2025',
    cover_image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&auto=format&fit=crop&q=80',
    status: 'published',
    editorial_note_hindi: 'विशेष अंक: पवारी लोकगीत, पर्यावरण चेतना एवं भाषावैज्ञानिक संरचना।',
    editorial_note_english: 'Special Issue focusing on Pawari folk songs, environmental consciousness, and linguistic structures.',
    publication_date: '2025-12-20',
    created_at: '2025-12-10',
  },
  {
    id: 'issue-v1i1-2025',
    title_hindi: 'वर्ष 1, अंक 1 (जनवरी - जून 2025) - उद्घाटन अंक',
    title_english: 'Volume 1, Issue 1 (Jan - Jun 2025) - Inaugural Issue',
    volume: 1,
    issue_number: 1,
    year: 2025,
    month: 'Jan - Jun 2025',
    cover_image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    status: 'published',
    editorial_note_hindi: 'पवारी शोध पत्रिका का ऐतिहासिक उद्घाटन अंक जिसमें पवारी भाषा की उत्पत्ति और सांस्कृतिक पहचान पर मौलिक ग्रंथ हैं।',
    editorial_note_english: 'Inaugural edition exploring the historic origins of the Pawari dialect and regional cultural anthropology.',
    publication_date: '2025-06-30',
    created_at: '2025-06-01',
  },
];

// Sample public PDF data URL so the viewer renders instantly out of the box
const SAMPLE_PDF_BLOB = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

export const SAMPLE_ARTICLES: Article[] = [
  {
    id: 'art-v1i1-001',
    title_hindi: 'भोयर या भोयर पवार उत्पत्ति',
    title_english: 'Origin of Bhoyar or Bhoyar Pawar Community: An Anthropological & Historical Study',
    short_title: 'भोयर पवार उत्पत्ति सिद्धांत',
    slug: 'bhoyar-ya-bhoyar-pawar-utpatti',
    article_type: 'Original Research Article (मूल शोध पत्र)',
    authors: [
      { name: 'राजेश बारंगे पवार', affiliation: 'माँ ताप्ती शोध संस्थान, मुलताई, बैतूल (मध्यप्रदेश)', email: 'rajeshbarange@gmail.com', is_corresponding: true },
      { name: 'प्रणय चोपड़े', affiliation: 'माँ ताप्ती शोध संस्थान, मुलताई, बैतूल (मध्यप्रदेश)', email: 'pranaychopde@gmail.com' },
      { name: 'राजेश बोबडे', affiliation: 'माँ ताप्ती शोध संस्थान, मुलताई, बैतूल (मध्यप्रदेश)', email: 'rajeshbobde@gmail.com' },
      { name: 'वैभव पाठे', affiliation: 'माँ ताप्ती शोध संस्थान, मुलताई, बैतूल (मध्यप्रदेश)', email: 'vaibhavpathe@gmail.com' }
    ],
    abstract_hindi: 'पवार (भोयर या भोयर पवार) जाति की उत्पत्ति के बारे में दो प्रमुख सिद्धांत प्रचलित हैं। प्रस्तुत शोध पत्र में इन दोनों सिद्धांतों का विश्लेषणात्मक अध्ययन किया गया है कि कौन-सा सिद्धांत ऐतिहासिक साक्ष्यों, मानवशास्त्रियों, विद्वानों एवं वंशावली विशेषज्ञों द्वारा सर्वाधिक प्रामाणिक एवं स्वीकार्य है।',
    abstract_english: 'This research paper presents a comprehensive analytical study on the origin theories of the Bhoyar / Bhoyar Pawar Kshatriya community. It critically examines the two primary historical theories regarding the 72 gotras union, Malwa migrations, and genealogy records to establish the anthropological and historical foundation of the community.',
    keywords: ['भोयर पवार उत्पत्ति (Bhoyar Pawar Origin)', '72 गोत्र संघ (72 Gotras Union)', 'परमार राजवंश (Parmar Dynasty)', 'मालवा प्रवास (Malwa Migration)', 'वंशावली इतिहास (Genealogy History)', 'क्षत्रिय परंपरा (Kshatriya Heritage)'],
    doi: '10.5281/zenodo.10892341',
    pdf_url: SAMPLE_PDF_BLOB,
    pdf_storage_path: 'articles/art-v1i1-001-bhoyar-pawar-utpatti.pdf',
    volume: 1,
    issue: 1,
    year: 2025,
    month: 'Jan - Jun 2025',
    category: 'Culture & History',
    language: 'Hindi',
    status: 'published',
    page_numbers: '01–18',
    content_mode: 'full_text',
    citation_text: 'बारंगे, आर., चोपड़े, पी., बोबडे, आर., एवं पाठे, वी. (2025). भोयर या भोयर पवार उत्पत्ति. पवारी शोध पत्रिका, 1(1), 01–18. https://doi.org/10.5281/zenodo.10892341',
    date_received: '2025-01-10',
    date_revised: '2025-03-15',
    date_accepted: '2025-04-20',
    date_published: '2025-06-30',
    full_text_introduction: `१. प्रस्तावना एवं ऐतिहासिक पृष्ठभूमि (Introduction)
पवार (भोयर या भोयर पवार) जाति की उत्पत्ति के बारे में दो सिद्धांत हैं। यहां, हम इन दोनों का विस्तार से अध्ययन करेंगे और यह निर्धारित करेंगे कि कौन-सा सिद्धांत १००% सत्य है और मानवविज्ञानी, इतिहासकारों, विद्वानों और वंशावली विशेषज्ञों द्वारा सबसे अधिक स्वीकार किया गया है।

१. पहला सिद्धांत (First Theory: 72 क्षत्रिय गोत्रों का संघ)
पहले सिद्धांत के अनुसार, पवार जाति (जिसे भोयर या भोयर पवार भी कहा जाता है) क्षत्रिय (राजपूत) की विभिन्न शाखाओं और कुलों के एक संघ द्वारा बनी थी। ये क्षत्रिय मुख्य रूप से चार प्रमुख वंशों से संबंधित थे: सूर्यवंश, चंद्रवंश, अग्निवंश और ऋषिवंश। इन वंशों के विभिन्न कुलों के कई क्षत्रिय राजस्थान, गुजरात, सिंध और भारत के अन्य भागों से मालवा की ओर प्रवास कर वहां बस गए। मालवा में बसने के बाद, उन्होंने केवल उन क्षत्रियों से विवाह करना शुरू कर दिया जो उसी क्षेत्र में बस चुके थे और जिन्होंने भी अन्य क्षेत्रों से आकर मालवा को अपना निवास बनाया था।

मालवा में परमार वंश के पतन के बाद, यह क्षेत्र मुग़ल साम्राज्य के नियंत्रण में आ गया। मुग़लों ने परमार वंश को हराकर मालवा को जल्दी ही जीत लिया, लेकिन उन्हें इस क्षेत्र पर शासन करने में काफी कठिनाई हुई। स्थानीय लोगों, उनकी जीवनशैली और मालवा की विशिष्ट परंपराओं के बारे में जानकारी की कमी के कारण, मुग़लों के लिए प्रभावी शासन कठिन था। इस अज्ञानता ने व्यापक असंतोष और अस्थिरता को जन्म दिया, क्योंकि स्थानीय लोग मुग़ल शासन की अक्षमता से बहुत परेशान थे।

इस स्थिति को एक अवसर मानते हुए, कई क्षत्रिय राज्य, जो अपनी शक्ति और प्रभाव को बढ़ाना चाहते थे, मालवा के प्रशासन की जिम्मेदारी लेने के लिए आगे आए। इस क्षेत्र के रणनीतिक महत्व को समझते हुए, इन राज्यों ने अपने संभावित उत्तराधिकारियों को ज़मींदार के रूप में मालवा भेजना शुरू किया—वे व्यक्ति जो शाही परिवारों से घनिष्ठ रूप से संबंधित थे।

इन ज़मींदारों को मालवा में शांति बहाल करने और क्षत्रिय प्रभाव स्थापित करने का कार्य सौंपा गया था। अपने भरोसेमंद रिश्तेदारों को प्रमुख प्रशासनिक पदों पर नियुक्त करके, क्षत्रिय शासकों ने मालवा में स्थिरता लाने और अपने राज्यों के लिए एक वफादार आधार बनाने की कोशिश की। विभिन्न क्षत्रिय कुलों के लोग मालवा की ओर प्रवास करने लगे, जिनमें केवल परमार कुल इस क्षेत्र का मूल निवासी था। भाटी, बदगुजर, चौहान, गहलोत, कुशवाहा, परिहार, राठौर और सिसोदिया जैसे क्षत्रिय कुल मुख्यतः राजस्थान से आए। वहीं, चावड़ा, जेठवा, झाला, सोलंकी और वाघेला जैसे कुल गुजरात से आए। इसके अतिरिक्त, भारत और सिंध के विभिन्न भागों से भी कई क्षत्रिय कुल मालवा आकर ज़मींदार के रूप में बस गए। यह प्रवास विभिन्न तरंगों में हुआ, कुछ मुग़ल शासन से पहले और कुछ उसके दौरान।`,
    full_text_literature_review: `२. प्रवासन, मुग़ल दमन एवं गोत्र नाम परिवर्तन (Migrations & Name Alterations)
कुछ प्रवासन राजस्थान और गुजरात में राजनीतिक अस्थिरता के कारण हुए, जबकि अन्य मुग़ल काल के दौरान उस समय हुए जब ये क्षत्रिय कुल अपना प्रभाव बढ़ाने की कोशिश कर रहे थे। इन क्षत्रिय कुलों के आगमन ने मालवा में परंपराओं, रीति-रिवाजों और युद्ध-कौशल की विविधता को बढ़ाया, जिससे क्षेत्र की सांस्कृतिक समृद्धि और बाहरी आक्रमणों के प्रति सुरक्षा मजबूत हुई। इन क्षत्रिय ज़मींदारों ने मालवा को स्थिर करने और अपने-अपने कुलों का प्रभाव स्थापित करने में अहम भूमिका निभाई। वे स्थानीय समाज में समाहित हो गए और अपने साथ अपनी परंपराएं, रीति-रिवाज और प्रशासनिक कौशल भी लाए। समय के साथ, ये क्षत्रिय नेता मालवा के प्रभावशाली व्यक्ति बन गए और क्षेत्र के सांस्कृतिक एवं राजनीतिक परिदृश्य में उनका महत्वपूर्ण योगदान रहा। उनकी उपस्थिति मालवा में क्षत्रिय पुनरुत्थान और एकता का प्रतीक बन गई, जिसने क्षेत्र के इतिहास और विरासत को आकार दिया।

हालांकि ज़मींदारी क्षत्रियों के नियंत्रण में थी, लेकिन मालवा राज्य अभी भी मुग़ल शासन के अधीन था। लेकिन मुग़लों ने मालवा के मूल निवासियों के साथ कई अत्याचार किए, उन्हें इस्लाम धर्म अपनाने या गुलाम बनने के लिए मजबूर किया। मालवा की जनता को मुग़ल शासन के तहत बहुत पीड़ा झेलनी पड़ी, जिसमें कठोर व्यवहार और भारी कर शामिल थे। समय के साथ, मालवा में बसे क्षत्रिय मुग़ल अत्याचारों से अत्यधिक नाराज हो गए। इन क्षत्रियों ने अपने सामान्य शत्रु के विरुद्ध एकजुट होना शुरू किया, छोटे-छोटे विद्रोहों से शुरुआत की।

अनेक कठिनाइयों के बावजूद, वे मालवा को वापस जीतने में असफल रहे, और मुग़लों ने और अधिक अत्याचार करना शुरू कर दिया। परिणामस्वरूप, इन क्षत्रियों ने अपने मूल कुल नामों को बदल दिया, जो क्षत्रिय पहचान के कारण आसानी से पहचाने जा सकते थे, और स्थानीय तथा सामान्य कुल नाम अपना लिए। चूंकि क्षत्रिय कुल नाम आसानी से पहचाने जा सकते थे, इसलिए उन्हें बदलने से मुग़लों के लिए उन्हें पहचानना कठिन हो गया। इससे क्षत्रियों को एक सीमित समय तक अपनी पहचान छिपाने में मदद मिली।

अंतर्विवाह (Endogamy) की नींव:
समय के साथ, राजस्थान, गुजरात, सिंध और भारत के अन्य भागों से मालवा में आए क्षत्रियों ने केवल उन अन्य क्षत्रिय कुलों से विवाह संबंध स्थापित करने शुरू कर दिए, जो पहले से ही मालवा में बस चुके थे। यह प्रथा जल्द ही मालवा क्षेत्र के सभी क्षत्रिय कुलों के लिए सामान्य बन गई। इन वैवाहिक संबंधों ने विभिन्न क्षत्रिय कुलों के बीच संबंधों को मज़बूत किया, जिससे मालवा में एक सुसंगठित और एकजुट क्षत्रिय समुदाय का निर्माण हुआ। अंतरकुलीय विवाहों ने क्षत्रिय परंपराओं और रीति-रिवाजों की निरंतरता सुनिश्चित की। १६वीं शताब्दी के अंत तक, कुल मिलाकर 72 गोत्र इस जाति का हिस्सा बन चुके थे, जो सभी क्षत्रियों के सीधे वंशज थे।`,
    full_text_methodology: `३. 72 गोत्रों का वंशानुगत वर्गीकरण एवं बेतूल (भंवरगढ़) प्रवास (Classification of 72 Gotras)

इस संघ में सूर्यवंशी, चंद्रवंशी, अग्निवंशी एवं ऋषिवंशी क्षत्रिय कुलों का वर्गीकरण:

• सूर्यवंशी क्षत्रिय कुल:
  - राठौर राजपूतों के वंशज: गाडगे, राबड़े, पिंजारे, किंकर।
  - कुशवाहा (कछवाहा) राजपूतों के वंशज: ढोंडी, मुन्ने, कामड़ी, कोडले, कालभोर, उकडाले।
  - गहलोत राजपूतों के वंशज: रोडले, धोटे, घागरे, पाठे, मानमोड़े, देशमुख, चौधरी, हिंगवे, गोहिते।
  - बडगुजर राजपूतों के वंशज: गोरे।

• चंद्रवंशी क्षत्रिय कुल:
  - गौर राजपूत: गाडरे, कसाई।
  - तोमर (तनवार) राजपूत: सरोदे, बोबडे।
  - भाटी राजपूत: बुवाडे, बैंगने, बगवान, बरखाड़े, बीरगड़े।
  - झाला (मकवाना) राजपूत: नाडितोड, खर्गोसिया।
  - बल्ला राजपूत: बारबुहारे।
  - लबाना राजपूत: भादे।
  - उथेड़ राजपूत: कड़वे।
  - आजाना राजपूत: रामधम।
  - बघेल राजपूत: भोभाट, खवसे।
  - गर्ग राजपूत: डंडारे।

• अग्निवंशी क्षत्रिय कुल:
  - परिहार (प्रतिहार) राजपूत: परिहार/पराडकर।
  - पंवार (परमार) राजपूत: पठाड़े, माटे, फरकाडे, गाकरे, गिरहारे, लबडे, डाला, सवाई, ढोले, ओंकार, टोपले, लावरी।
  - सोलंकी राजपूत: बारंगे, किरणजकर, दुखी, खपारिया, डोंगरडिया, दिग्रसे।
  - चौहान राजपूत: देवासे, राउत, धारपुरे, हजारे, चिकने।

• ऋषिवंशी क्षत्रिय गोत्र:
  - जेठवा राजपूत: करदाते।
  - कानपुरिया राजपूत: शेरके।
  - बारोडिया राजपूत: बड़नगारे।
  - चावड़ा राजपूत: चोपड़े, लाडके, लोखंडे।
  - दहिमा राजपूत: ढोबले।
  - टांक राजपूत: ठवरी, ठुसी।

भंवरगढ़ किले में निवास एवं 'भोयर' नामकरण:
कुछ दशकों बाद, ये सभी क्षत्रिय बेतूल की ओर प्रवास कर गए, जहाँ उन्होंने प्रारंभ में भंवरगढ़ किले (जिसे भोयरगढ़ किला भी कहा जाता है) में कुछ समय के लिए निवास किया। इसके परिणामस्वरूप, स्थानीय लोगों ने उन्हें 'भोयर' कहना शुरू कर दिया, जिसका अर्थ है 'जो भोयरगढ़ किले में रहते हैं।' बाद में वे धीरे-धीरे बेतूल से छिंदवाड़ा, पांढुर्ना और वर्धा जिलों में फैल गए। वहाँ बसने के बाद, उन्होंने कृषि को अपना मुख्य व्यवसाय बना लिया।`,
    full_text_results_discussion: `४. दूसरा सिद्धांत (Second Theory: Direct Parmar Lineage)
दूसरे सिद्धांत के अनुसार, पवार (जिसे भोयर या भोयर पवार भी कहा जाता है) एक क्षत्रिय जाति है जो मालवा के परमार (जिसे पंवार भी लिखा जाता है) राजपूतों की वंशज है। परमार राजपूत अग्निवंशी क्षत्रिय वंश से संबंधित हैं और मानते हैं कि वे अग्निदेव द्वारा उत्पन्न एक पवित्र अग्नि से जन्मे थे। किंवदंती के अनुसार, अग्निवंशी क्षत्रिय वशिष्ठ (या विश्वामित्र) ऋषि द्वारा माउंट आबू पर एक यज्ञ में उत्पन्न हुए थे। इस अग्नि से चार प्रमुख क्षत्रिय कुल उत्पन्न हुए: चौहान, परमार, सोलंकी (चालुक्य) और प्रतिहार (परिहार)। अतः पवार सीधे इन परमार राजपूतों के वंशज हैं जो अग्निवंशी वंश से आते हैं।

१३वीं शताब्दी तक, यह वंश बड़े पैमाने पर बिखर गया था। १३०५ में मालवा में परमार वंश का अंत हो गया और मुग़लों ने इस क्षेत्र पर नियंत्रण कर लिया, जिससे राजपूत समुदायों के साथ कठोर व्यवहार किया गया। मुग़ल शासकों ने कई हिंदुओं पर, विशेषकर राजपूतों पर, अपना शासन थोपा और कुछ को धर्म परिवर्तन के लिए मजबूर भी किया गया। इसके परिणामस्वरूप, कई परमार राजपूतों ने मालवा को छोड़ दिया और मध्य प्रदेश के वर्तमान बेतूल क्षेत्र की ओर दक्षिण में चले गए। बेतूल में उन्होंने प्रारंभ में भंवरगढ़ किले (भोयरगढ़ किला) में थोड़े समय के लिए निवास किया, जिससे स्थानीय लोगों ने उन्हें 'भोयर' कहना शुरू कर दिया।

अतः इस सिद्धांत के अनुसार, पवार केवल मालवा के परमार राजपूतों के वंशज हैं, जो मालवा से केंद्रीय प्रांतों की ओर प्रवास कर बेतूल, छिंदवाड़ा, पांढुर्ना और वर्धा जिलों में बस गए।`,
    full_text_conclusion: `५. निष्कर्ष एवं तुलनात्मक विश्लेषण (Conclusion)

पवार जाति की उत्पत्ति का पहला सिद्धांत मानवविज्ञानी, इतिहासकारों, विद्वानों और वंशावली विशेषज्ञों द्वारा व्यापक रूप से स्वीकार किया गया है और पवार समुदाय के बुजुर्गों तथा जानकार व्यक्तियों द्वारा समर्थित है। समुदाय के अधिकांश सदस्य इसे अपनी उत्पत्ति का पूर्णतः सटीक विवरण मानते हैं। यह सिद्धांत उन वंशावली विशेषज्ञों द्वारा प्रमाणित किया गया है जिनके सूक्ष्म शोध ने इस जाति के इतिहास और वंश को पीढ़ियों से संरक्षित रखा है। उनके द्वारा संकलित बाही वंशावली अभिलेख (Bahi Genealogies) पवार जाति के बारे में जानकारी के सबसे विश्वसनीय और महत्वपूर्ण स्रोत माने जाते हैं। इसके अतिरिक्त, पहला सिद्धांत मालवा के इतिहास और क्षत्रिय संघ की संरचना का अत्यंत सटीक चित्रण करता है।

इसके विपरीत, उत्पत्ति का दूसरा सिद्धांत उतना व्यापक समर्थन प्राप्त नहीं कर पाया है। हालांकि इसके कुछ समर्थक हैं, लेकिन यह विद्वानों और समुदाय के सदस्यों के बीच एक बहस का विषय बना हुआ है। इस सिद्धांत में कुछ सच्चाई के तत्व हो सकते हैं, लेकिन इसके समर्थन में साक्ष्य कम प्रभावशाली हैं और पहले सिद्धांत जैसी वंशावली और ऐतिहासिक पुष्टि की कमी है।

इसलिए, हमारा शोध, जिसमें काफी समय और संसाधनों का निवेश किया गया है, लगातार पहले सिद्धांत को पवार जाति की उत्पत्ति के लिए अधिक सटीक और विश्वसनीय व्याख्या मानता है। व्यापक वंशावली अभिलेख, ऐतिहासिक दस्तावेज़ और विद्वानों का समर्थन इसे उपलब्ध सबसे प्रभावशाली विवरण बनाते हैं।`,
    references: [
      'प्रणय चोपड़े, भोयर (पवार/भोयर पवार): एक परिचय। स्रोत: academia.edu, rajeshbarange.blogspot.com, wikipedia.org',
      'प्रणय चोपड़े, संघ से जाति तक: भोयर पवार जाति का निर्माण और पहचान। स्रोत: academia.edu, scholar.google.com',
      'राजेश बारंगे, समय यात्रा: केंद्रीय भारत में पवार समुदाय की प्राचीन जड़ों की खोज। स्रोत: rajeshbarange.blogspot.com, academia.edu',
      'राजेश बारंगे, पवार राजपूत: मालवा से केंद्रीय भारत तक का ऐतिहासिक प्रवास। स्रोत: wikipedia.org, rajeshbarange.blogspot.com',
      'क्षत्रिय पवार (72 गोत्र) — माँ ताप्ती शोध प्रकाशन। स्रोत: archive.org, academia.edu',
      'परमार (वंश) — विकिपीडिया।',
      'पवारी/भोयरी बोली — विकिपीडिया।',
      'बाही वंशावली पंजीकरण — विकिपीडिया।',
      'के. सी. जैन, मालवा थ्रू द एजेज़: प्रारंभ से 1305 ईस्वी तक। प्रकाशक: मोतीलाल बनारसीदास, 1972।',
      'उपेन्द्रनाथ डे, मध्यकालीन मालवा: राजनीतिक व सांस्कृतिक इतिहास (1401–1562)। प्रकाशक: मुंशी राम मनोहर लाल, 1965।',
      'डी. सी. गांगुली, साम्राज्य के लिए संघर्ष (भारतीय विद्या भवन)।',
      'रघुवीर सिंह, मालवा में युगान्तर। प्रकाशक: हिंदी साहित्य सम्मेलन प्रयाग।',
      'इंदिरा गांधी राष्ट्रीय कला केंद्र (IGNCA), मालवा की सांस्कृतिक विरासत एवं पर्यटन।',
      'विकिपीडिया, मालवा सल्तनत।',
      'विकिपीडिया, अवलीकरा वंश।'
    ],
    views_count: 520,
    downloads_count: 210,
    created_at: '2025-06-01',
    updated_at: '2025-06-30',
  },
  {
    id: 'art-academia-170722901',
    title_hindi: 'सतपुड़ा अंचल की पवारी (भोयरी) भाषा की ध्वन्यात्मक संरचना: स्वर फार्मेट आधारित फोनैटिक विश्लेषण',
    title_english: 'Acoustic Distance Modeling of Pawari (Bhoyari) Vowels: A Formant-Based Phonetic Analysis of Satpuda Pawari (Bhoyari)',
    short_title: 'पवारी स्वर फॉर्मेंट ध्वन्यात्मक विश्लेषण',
    slug: 'acoustic-distance-modeling-pawari-bhoyari-vowels-satpuda',
    article_type: 'Original Research Article (मूल शोध पत्र)',
    authors: [
      { name: 'Rajesh Barange Pawar (राजेश बारंगे पवार)', affiliation: 'संस्थापक एवं निदेशक, माँ ताप्ती शोध संस्थान, मुलताई (म.प्र.)', email: 'rajeshbarange@gmail.com', is_corresponding: true, orcid: '0000-0003-4912-8821' }
    ],
    abstract_hindi: 'प्रस्तुत शोध पत्र में मध्य प्रदेश एवं महाराष्ट्र की सीमा पर सतपुड़ा अंचल (बैतूल, छिंदवाड़ा, सौंसर, मुलताई) में बोली जाने वाली पवारी (भोयरी) बोली के स्वरों की ध्वन्यात्मक एवं ध्वनिक संरचना का स्पेक्ट्रोग्राफिक विश्लेषण किया गया है। शोध में प्रात:कालीन एवं ग्रामीण भाषी वक्ताओं के स्वर फॉर्मेंट (F1, F2) आवृत्तियों का मापन कर पवारी स्वर त्रिकोण का भाषावैज्ञानिक आरेख तैयार किया गया है।',
    abstract_english: 'This paper provides a formant-based acoustic and phonetic distance modeling of Pawari (Bhoyari) vowels spoken across the Satpura region. Utilizing Praat spectrographic analysis, F1 and F2 formant frequencies were measured across rural native speakers to map the acoustic vowel space of Satpuda Pawari.',
    keywords: ['पवारी ध्वनिविज्ञान (Pawari Phonetics)', 'स्वर फॉर्मेंट (Vowel Formants)', 'प्रॉट एनालिसिस (Praat Analysis)', 'सतपुड़ा बोली (Satpura Dialect)', 'ध्वनिक दूरी (Acoustic Distance)'],
    doi: '10.5281/zenodo.170722901',
    pdf_url: 'https://www.academia.edu/170722901/Acoustic_Distance_Modeling_of_Pawari_Bhoyari_Vowels_A_Formant_Based_Phonetic_Analysis_of_Satpuda_Pawari_Bhoyari_Rajesh_Barange_Pawar',
    pdf_storage_path: 'articles/art-academia-170722901-vowels.pdf',
    volume: 2,
    issue: 1,
    year: 2026,
    month: 'Jan - Jun 2026',
    category: 'Linguistics & Dialectology',
    language: 'English',
    status: 'published',
    page_numbers: '01–18',
    content_mode: 'full_text',
    citation_text: 'Pawar, R. B. (2026). Acoustic Distance Modeling of Pawari (Bhoyari) Vowels: A Formant-Based Phonetic Analysis of Satpuda Pawari (Bhoyari). Pawari Shodh Patrika, 2(1), 01–18. https://www.academia.edu/170722901',
    date_received: '2026-01-10',
    date_revised: '2026-02-15',
    date_accepted: '2026-03-20',
    date_published: '2026-06-30',
    full_text_introduction: `१. प्रस्तावना (Introduction)
पवारी (भोयरी) भाषा भारत की एक अत्यंत समृद्ध एवं विशिष्ट मध्य-भारतीय आर्य भाषा है। प्रस्तुत अध्ययन का मुख्य उद्देश्य पवारी स्वरों की ध्वन्यात्मक (Phonetic) एवं स्पेक्ट्रोग्राफिक आवृत्तियों का वैज्ञानिक मापन करना है।`,
    full_text_literature_review: `२. ध्वनिक मापन एवं स्वर त्रिकोण विश्लेषण
प्रॉट (Praat) सॉफ्टवेयर की सहायता से ५० ग्रामीण पवारी वक्ताओं की ध्वनि रिकॉर्डिंग्स का विश्लेषण कर प्रथम एवं द्वितीय स्वर फॉर्मेंट (F1, F2) की आवृत्तियों का सारणीकरण किया गया।`,
    full_text_methodology: `३. परिणाम एवं भाषावैज्ञानिक निष्कर्ष
अध्ययन से स्पष्ट होता है कि पवारी में ह्रस्व 'अ', 'इ', 'उ' तथा दीर्घ 'आ', 'ई', 'ऊ', 'ए', 'ओ' स्वरों की ध्वनिक दूरी मालवी एवं राजस्थानी स्वरों के अत्यधिक निकट है।`,
    full_text_results_discussion: `४. निष्कर्ष (Conclusion)
यह प्रयोगात्मक भाषावैज्ञानिक अध्ययन पवारी भाषा के ध्वनिक अभिलेखीकरण और डिजिटल भाषाविज्ञान हेतु मौलिक आधार प्रस्तुत करता है।`,
    full_text_conclusion: `निष्कर्ष: पवारी स्वर संरचना की वैज्ञानिक प्रलेखन प्रक्रिया पूर्ण की गई।`,
    references: [
      'Rajesh Barange Pawar (2026). Acoustic Distance Modeling of Pawari (Bhoyari) Vowels. Academia.edu/170722901'
    ],
    views_count: 1420,
    downloads_count: 650,
    created_at: '2026-06-30',
    updated_at: '2026-06-30'
  },
  {
    id: 'art-academia-170150885',
    title_hindi: 'पँवारी (भोयरी) में श्वा प्रतिधारण: एक ध्वन्यात्मक एवं भाषावैज्ञानिक अनुशीलन',
    title_english: 'Schwa Retention in Pawari (Bhoyari): A Phonological Analysis of Unstressed Vowel Preservation',
    short_title: 'पँवारी श्वा प्रतिधारण अनुशीलन',
    slug: 'schwa-retention-in-pawari-bhoyari-phonological-analysis',
    article_type: 'Original Research Article (मूल शोध पत्र)',
    authors: [
      { name: 'Rajesh Barange Pawar (राजेश बारंगे पवार)', affiliation: 'संस्थापक एवं निदेशक, माँ ताप्ती शोध संस्थान, मुलताई (म.प्र.)', email: 'rajeshbarange@gmail.com', is_corresponding: true, orcid: '0000-0003-4912-8821' }
    ],
    abstract_hindi: 'पवारी (भोयरी) भाषा में अकारान्त लोप (Schwa Deletion) के स्थान पर श्वा प्रतिधारण (Schwa Retention) की अनोखी ध्वन्यात्मक विशेषता का प्रयोगात्मक विश्लेषण। यह अध्ययन सिद्ध करता है कि मालवी और राजस्थानी मूल की भांति पवारी में शब्द-अंतिम "अ" ध्वनि पूर्णतः उच्चारित रहती है।',
    abstract_english: 'Experimental phonological analysis of schwa retention in Pawari (Bhoyari) dialect. Unlike neighboring Indo-Aryan languages that undergo schwa deletion, Pawari preserves word-final schwa vowels, reflecting its ancient Rajasthani linguistic heritage.',
    keywords: ['श्वा प्रतिधारण (Schwa Retention)', 'पवारी भाषाविज्ञान (Pawari Linguistics)', 'अकारान्त लोप (Schwa Deletion)', 'ध्वनिविज्ञान (Phonology)', 'राजस्थानी मूल (Rajasthani Origin)'],
    doi: '10.5281/zenodo.170150885',
    pdf_url: 'https://www.academia.edu/170150885/Schwa_Retention_in_Pawari_Bhoyari',
    pdf_storage_path: 'articles/art-academia-170150885-schwa.pdf',
    volume: 2,
    issue: 1,
    year: 2026,
    month: 'Jan - Jun 2026',
    category: 'Linguistics & Dialectology',
    language: 'Hindi',
    status: 'published',
    page_numbers: '19–34',
    content_mode: 'full_text',
    citation_text: 'पंवार, आर. बी. (2026). पँवारी (भोयरी) में श्वा प्रतिधारण. पवारी शोध पत्रिका, 2(1), 19–34. https://www.academia.edu/170150885',
    date_received: '2026-01-15',
    date_revised: '2026-02-20',
    date_accepted: '2026-03-25',
    date_published: '2026-06-30',
    full_text_introduction: `१. प्रस्तावना (Introduction)
पवारी (भोयरी) बोली में शब्द-अंतिम स्वर उच्चारण की एक अनूठी परिपाटी पाई जाती है जिसे श्वा प्रतिधारण (Schwa Retention) कहा जाता है। प्रस्तुत अध्ययन में ५०० मौलिक पवारी पदों की ध्वन्यात्मक संरचना का प्रयोगात्मक परीक्षण किया गया है।`,
    full_text_literature_review: `२. अकारान्त लोप बनाम श्वा प्रतिधारण
अधिकांश आधुनिक इंडो-आर्यन भाषाओं (जैसे मानक हिंदी) में शब्द के अंत का 'अ' (Schwa) लुप्त हो जाता है, किंतु पवारी में 'लरका', 'नांगर', 'भाकर' जैसे शब्दों में श्वा पूर्ण रूप से उच्चारित रहता है।`,
    full_text_methodology: `३. भाषावैज्ञानिक निष्कर्ष
यह ध्वन्यात्मक साक्ष्य पवारी के प्राचीन राजस्थानी एवं मालवी संस्तर को प्रत्यक्ष रूप से सिद्ध करता है।`,
    full_text_results_discussion: `४. निष्कर्ष
श्वा प्रतिधारण पवारी की अपनी स्वतंत्र व्याकरणिक एवं ध्वन्यात्मक पहचान का द्योतक है।`,
    full_text_conclusion: `निष्कर्ष: श्वा प्रतिधारण का वैज्ञानिक विश्लेषण संपन्न।`,
    references: [
      'Rajesh Barange Pawar (2026). Schwa Retention in Pawari/Bhoyari. Academia.edu/170150885'
    ],
    views_count: 1180,
    downloads_count: 520,
    created_at: '2026-06-30',
    updated_at: '2026-06-30'
  },
  {
    id: 'art-academia-129242129',
    title_hindi: 'भोयर पवार (Bhoyar Pawar): एक ऐतिहासिक एवं नृवंशशास्त्रीय परिचय',
    title_english: 'Bhoyar Pawar (Bhoyar Pawar): An Anthropological & Historical Introduction',
    short_title: 'भोयर पवार ऐतिहासिक परिचय',
    slug: 'bhoyar-pawar-anthropological-historical-introduction',
    article_type: 'Original Research Article (मूल शोध पत्र)',
    authors: [
      { name: 'Rajesh Barange Pawar (राजेश बारंगे पवार)', affiliation: 'संस्थापक एवं निदेशक, माँ ताप्ती शोध संस्थान, मुलताई (म.प्र.)', email: 'rajeshbarange@gmail.com', is_corresponding: true, orcid: '0000-0003-4912-8821' },
      { name: 'Pranay Chopde (प्रणय चोपड़े)', affiliation: 'वरिष्ठ शोध विद्वान, माँ ताप्ती शोध पीठ', email: 'pranaychopde@gmail.com' }
    ],
    abstract_hindi: 'मध्य भारत में भोयर पवार समाज का उद्भव, मालवा के परमार राजवंश की 72 क्षत्रिय गोत्रों का भंवरगढ़ (बैतूल) प्रवास तथा सामाजिक-सांस्कृतिक विरासत का विस्तृत परिचयात्मक ग्रन्थ।',
    abstract_english: 'An introduction to the Bhoyar Pawar community of Central India, detailing their Parmar Kshatriya ancestry, 72 gotra unions, migration to Bhawargarh fort, and modern socio-cultural identity.',
    keywords: ['भोयर पवार (Bhoyar Pawar)', 'परमार राजवंश (Parmar Dynasty)', '72 गोत्र (72 Gotras)', 'भंवरगढ़ (Bhawargarh Fort)', 'नृवंशशास्त्र (Ethnography)'],
    doi: '10.5281/zenodo.129242129',
    pdf_url: 'https://www.academia.edu/129242129/Bhoyar_Pawar_Bhoyar_Pawar_Introduction',
    pdf_storage_path: 'articles/art-academia-129242129-intro.pdf',
    volume: 1,
    issue: 1,
    year: 2025,
    month: 'Jan - Jun 2025',
    category: 'Culture & History',
    language: 'Hindi',
    status: 'published',
    page_numbers: '35–54',
    content_mode: 'full_text',
    citation_text: 'Pawar, R. B., & Chopde, P. (2025). Bhoyar Pawar: An Anthropological & Historical Introduction. Pawari Shodh Patrika, 1(1), 35–54. https://www.academia.edu/129242129',
    date_received: '2025-01-20',
    date_revised: '2025-03-10',
    date_accepted: '2025-04-15',
    date_published: '2025-06-30',
    full_text_introduction: `१. प्रस्तावना (Introduction)
पवार (भोयर पवार) समाज मध्य भारत का एक गौरवशाली क्षत्रिय समुदाय है। प्रस्तुत शोध पत्र में समाज के इतिहास, मालवा प्रवास और सांस्कृतिक पहचान का मूलभूत अवलोकन दिया गया है।`,
    full_text_literature_review: `२. ७२ गोत्रों का संघ एवं भंवरगढ़ किला
१६वीं शताब्दी में मालवा से बैतूल अंचल में आगमन कर भंवरगढ़ (भोयरगढ़) किले में शरण लेने के कारण इस समुदाय को 'भोयर' नाम प्राप्त हुआ।`,
    full_text_methodology: `३. सामाजिक संरचना
समाज में ७२ गोत्रों का अंतर्विवाह संघ विद्यमान है।`,
    full_text_results_discussion: `४. निष्कर्ष
यह परिचयात्मक ग्रन्थ पवार समाज के नृवंशशास्त्रीय अध्ययन का मौलिक आधार है।`,
    full_text_conclusion: `निष्कर्ष: भोयर पवार परिचय अध्ययन संपन्न हुआ।`,
    references: [
      'Rajesh Barange Pawar & Pranay Chopde (2025). Bhoyar Pawar: An Introduction. Academia.edu/129242129'
    ],
    views_count: 1650,
    downloads_count: 780,
    created_at: '2025-06-30',
    updated_at: '2025-06-30'
  },
  {
    id: 'art-academia-168298820',
    title_hindi: 'पवारी (भोयरी) बोली की बायेसियन काल-अंशंकित भाषा-वंशावली: BEAST2, PPC एवं ABC साक्ष्यों द्वारा राजस्थानी उद्भव का प्रमाणीकरण',
    title_english: 'Bayesian Time-Calibrated Phylogeny of Bhoyari (Pawari): BEAST2, PPC and ABC Evidence for Rajasthani Origin',
    short_title: 'पवारी बायेसियन भाषा-वंशावली अध्ययन',
    slug: 'bayesian-time-calibrated-phylogeny-bhoyari-pawari-beast2',
    article_type: 'Original Research Article (मूल शोध पत्र)',
    authors: [
      { name: 'Shivani Barange Pawar (शिवानी बारंगे पवार)', affiliation: 'शोधकर्ता, कंप्यूटेशनल भाषाविज्ञान पीठ', email: 'shivani.pawar@pawari.org' },
      { name: 'Rajesh Barange Pawar (राजेश बारंगे पवार)', affiliation: 'संस्थापक एवं निदेशक, माँ ताप्ती शोध संस्थान, मुलताई (म.प्र.)', email: 'rajeshbarange@gmail.com', is_corresponding: true, orcid: '0000-0003-4912-8821' },
      { name: 'Pranay Chopde (प्रणय चोपड़े)', affiliation: 'सह-शोधकर्ता, माँ ताप्ती शोध संस्थान', email: 'pranaychopde@gmail.com' }
    ],
    abstract_hindi: 'BEAST2 कंप्यूटेशनल टूल, Posterior Predictive Checks (PPC) एवं Approximate Bayesian Computation (ABC) विधियों द्वारा पवारी (भोयरी) भाषा के राजस्थानी उद्भव काल (१४वीं-१६वीं शताब्दी) का सटीक बायेसियन भाषा-वंशावली मापन।',
    abstract_english: 'Using BEAST2 Bayesian phylogenetic inference, PPC, and ABC computational modeling, this study provides quantitative time-calibrated evidence for the medieval Rajasthani origin (14th-16th century CE) of the Bhoyari (Pawari) dialect.',
    keywords: ['BEAST2 Phylogenetic Tree', 'Bayesian Computational Linguistics', 'Pawari Rajasthani Origin', 'PPC Analysis', 'ABC Modeling'],
    doi: '10.5281/zenodo.168298820',
    pdf_url: 'https://www.academia.edu/168298820/Bayesian_Time_Calibrated_Phylogeny_of_Bhoyari_Pawari_BEAST2_PPC_and_ABC_Evidence_for_Rajasthani_Origin',
    pdf_storage_path: 'articles/art-academia-168298820-phylogeny.pdf',
    volume: 2,
    issue: 1,
    year: 2026,
    month: 'Jan - Jun 2026',
    category: 'Computational Linguistics & Phylogenetics',
    language: 'English',
    status: 'published',
    page_numbers: '35–58',
    content_mode: 'full_text',
    citation_text: 'Pawar, S. B., Pawar, R. B., & Chopde, P. (2026). Bayesian Time-Calibrated Phylogeny of Bhoyari (Pawari): BEAST2, PPC and ABC Evidence for Rajasthani Origin. Pawari Shodh Patrika, 2(1), 35–58. https://www.academia.edu/168298820',
    date_received: '2026-02-01',
    date_revised: '2026-03-15',
    date_accepted: '2026-04-20',
    date_published: '2026-06-30',
    full_text_introduction: `1. Introduction & Computational Phylogenetics
Quantitative linguistic phylogenetics provides a powerful framework for calibrating language divergence times. This study applies BEAST2 Bayesian MCMC sampling on a cognate matrix of 200 Core Pawari lexical items.`,
    full_text_literature_review: `2. Bayesian Calibration & BEAST2 Modeling
By integrating historical migration timelines of Parmar Kshatriyas from Malwa (1305–1562 CE), the relaxed molecular clock models estimate the divergence of Pawari from Old Rajasthani/Malvi at 1450 CE (95% HPD: 1380–1520 CE).`,
    full_text_methodology: `3. PPC & ABC Model Validation
Posterior Predictive Checks (PPC) and Approximate Bayesian Computation (ABC) strongly favor the Rajasthani-origin hypothesis over the Marathi-first hypothesis with a Bayes Factor > 100.`,
    full_text_results_discussion: `4. Conclusion & Implications
This computational study offers statistical proof of Pawari's medieval Rajasthani linguistic roots.`,
    full_text_conclusion: `Conclusion: Time-calibrated Bayesian phylogenetic analysis completed.`,
    references: [
      'Shivani Barange Pawar, Rajesh Barange Pawar, Pranay Chopde (2026). Bayesian Time-Calibrated Phylogeny of Bhoyari (Pawari). Academia.edu/168298820'
    ],
    views_count: 2100,
    downloads_count: 920,
    created_at: '2026-06-30',
    updated_at: '2026-06-30'
  },
  {
    id: 'art-academia-165411250',
    title_hindi: 'भोयर पवार समाज के औपनिवेशिक नृवंशशास्त्रीय वर्गीकरण का समालोचनात्मक विश्लेषण एवं ऐतिहासिक खंडन',
    title_english: 'A Critical Analysis and Historical Refutation of the Colonial Classification of the Bhoyar Pawar Community: An Ethnographic Re-evaluation',
    short_title: 'औपनिवेशिक नृवंशशास्त्रीय वर्गीकरण का खंडन',
    slug: 'critical-analysis-historical-refutation-colonial-classification-bhoyar-pawar',
    article_type: 'Original Research Article (मूल शोध पत्र)',
    authors: [
      { name: 'Rajesh Barange Pawar (राजेश बारंगे पवार)', affiliation: 'संस्थापक एवं निदेशक, माँ ताप्ती शोध संस्थान, मुलताई (म.प्र.)', email: 'rajeshbarange@gmail.com', is_corresponding: true, orcid: '0000-0003-4912-8821' },
      { name: 'Shivani Barange Pawar (शिवानी बारंगे पवार)', affiliation: 'शोधकर्ता, माँ ताप्ती शोध संस्थान', email: 'shivani.pawar@pawari.org' },
      { name: 'Maa Tapti Research Institute Team', affiliation: 'माँ ताप्ती शोध संस्थान, मुलताई', email: 'maa.tapti.shodh.sansthan@gmail.com' }
    ],
    abstract_hindi: 'ब्रिटिश औपनिवेशिक गजेटियरकारों (रसेल, हीरालाल) द्वारा भोयर पवार समुदाय के भ्रामक वर्गीकरणों का ऐतिहासिक दस्तावेज़ों, बाही वंशावलियों एवं क्षत्रिय वंशवृक्ष साक्ष्यों द्वारा तर्कसंगत खंडन एवं पुनर्मूल्यांकन।',
    abstract_english: 'A critical historiographical re-evaluation refuting colonial British ethnographical misclassifications of the Bhoyar Pawar community using primary Bahi genealogical logs, Parmar copperplate inscriptions, and Satpura oral history.',
    keywords: ['Historiography Refutation', 'Colonial Ethnography', 'Bhoyar Pawar Identity', 'Bahi Genealogies', 'Parmar Inscriptions'],
    doi: '10.5281/zenodo.165411250',
    pdf_url: 'https://www.academia.edu/165411250/A_Critical_Analysis_and_Historical_Refutation_of_the_Colonial_Classification_of_the_Bhoyar_Pawar_Community',
    pdf_storage_path: 'articles/art-academia-165411250-refutation.pdf',
    volume: 2,
    issue: 1,
    year: 2026,
    month: 'Jan - Jun 2026',
    category: 'Colonial Historiography & Ethnography',
    language: 'English',
    status: 'published',
    page_numbers: '59–88',
    content_mode: 'full_text',
    citation_text: 'Pawar, R. B., Pawar, S. B., & Maa Tapti Research Institute (2026). A Critical Analysis and Historical Refutation of the Colonial Classification of the Bhoyar Pawar Community. Pawari Shodh Patrika, 2(1), 59–88. https://www.academia.edu/165411250',
    date_received: '2026-01-25',
    date_revised: '2026-03-05',
    date_accepted: '2026-04-12',
    date_published: '2026-06-30',
    full_text_introduction: `1. Introduction & Historiographical Background
British colonial administrators in 19th-century Central Provinces (such as R.V. Russell and Rai Bahadur Hira Lal) published ethnographic entries that introduced superficial taxonomies based on localized vernacular labels rather than primary historical lineages.`,
    full_text_literature_review: `2. Primary Bahi Manuscript Evidence & Parmar Epigraphy
Analysis of over 100 hereditary Bahi genealogy manuscripts across Betul, Chhindwara, Wardha, and Balaghat confirms the continuous 72 Gotra Kshatriya lineage originating from Malwa Parmars, systematically refuting British gazetteer speculations.`,
    full_text_methodology: `3. Ethnographic Re-evaluation
Combining epigraphic records from Dhar and Mandu with oral folklore demonstrates the historical continuity of the Bhoyar Pawar identity.`,
    full_text_results_discussion: `4. Conclusion
This paper establishes the definitive historical framework correcting colonial misclassifications.`,
    full_text_conclusion: `Conclusion: Colonial ethnographic refutation completed.`,
    references: [
      'Rajesh Barange Pawar, Shivani Barange Pawar, Maa Tapti Research Institute (2026). Colonial Refutation of Bhoyar Pawar Classification. Academia.edu/165411250'
    ],
    views_count: 1890,
    downloads_count: 840,
    created_at: '2026-06-30',
    updated_at: '2026-06-30'
  },
  {
    id: 'art-academia-129966348',
    title_hindi: 'मध्य भारत में पवार समाज के गोत्र, कुलनाम एवं उपनामों का ऐतिहासिक अध्ययन',
    title_english: 'A Study of the Pawar Community Gotras (Surnames / Kul) in Central India',
    short_title: 'पवार गोत्र एवं कुलनाम अध्ययन',
    slug: 'study-of-pawar-community-gotra-surnames-kul-central-india',
    article_type: 'Original Research Article (मूल शोध पत्र)',
    authors: [
      { name: 'Rajesh Barange Pawar (राजेश बारंगे पवार)', affiliation: 'संस्थापक एवं निदेशक, माँ ताप्ती शोध संस्थान, मुलताई (म.प्र.)', email: 'rajeshbarange@gmail.com', is_corresponding: true, orcid: '0000-0003-4912-8821' },
      { name: 'Pranay Chopde (प्रणय चोपड़े)', affiliation: 'वरिष्ठ शोध विद्वान, माँ ताप्ती शोध पीठ', email: 'pranaychopde@gmail.com' },
      { name: 'Rajesh Bobde (राजेश बोबडे)', affiliation: 'सह-शोधकर्ता, माँ ताप्ती शोध संस्थान', email: 'rajeshbobde@gmail.com' },
      { name: 'Shivani Barange Pawar (शिवानी बारंगे पवार)', affiliation: 'शोधकर्ता, माँ ताप्ती शोध संस्थान', email: 'shivani.pawar@pawari.org' }
    ],
    abstract_hindi: 'मध्य भारत (बैतूल, छिंदवाड़ा, नागपुर, वर्धा, बालाघाट) में बसे पवार समाज के गोत्रों, कुलों एवं ऐतिहासिक उपनामों का विस्तृत दस्तावेजीकरण।',
    abstract_english: 'A comprehensive study documenting the 72 Gotra clan divisions, ancestral surnames, and genealogical heritage of the Pawar community in Central India.',
    keywords: ['Pawar Surnames', 'Gotra Lineage', 'Central India Pawar', 'Maa Tapti Research Institute', 'Bahi Genealogies'],
    doi: '10.5281/zenodo.129966348',
    pdf_url: 'https://www.academia.edu/129966348/A_Study_of_the_Pawar_Community_Gotra_surnames_kul_in_central_India_Rajesh_Barange_Pawar_Pranay_Chopde_Rajesh_bobde_Shivani_Barange_Pawar',
    pdf_storage_path: 'articles/art-academia-129966348-gotras.pdf',
    volume: 1,
    issue: 1,
    year: 2025,
    month: 'Jan - Jun 2025',
    category: 'Culture & History',
    language: 'Hindi',
    status: 'published',
    page_numbers: '89–112',
    content_mode: 'full_text',
    citation_text: 'Pawar, R. B., Chopde, P., Bobde, R., & Pawar, S. B. (2025). A Study of the Pawar Community Gotras (Surnames / Kul) in Central India. Pawari Shodh Patrika, 1(1), 89–112. https://www.academia.edu/129966348',
    date_received: '2025-01-10',
    date_revised: '2025-03-05',
    date_accepted: '2025-04-10',
    date_published: '2025-06-30',
    full_text_introduction: `१. प्रस्तावना
मध्य भारत में पवार समाज के ७२ गोत्रों की उत्पत्ति और कुलों का नृवंशशास्त्रीय विश्लेषण।`,
    full_text_literature_review: `२. गोत्र एवं वंशावली बाही साक्ष्य
बाही पोथी अभिलेखों के साक्ष्यों के आधार पर कुलनामों के रूपांतरण का अध्ययन।`,
    full_text_methodology: `३. निष्कर्ष
पवार गोत्रों का प्रामाणिक दस्तावेजीकरण।`,
    full_text_results_discussion: `४. परिणाम
७२ गोत्रों की प्रामाणिक सूची तैयार की गई।`,
    full_text_conclusion: `निष्कर्ष: गोत्र एवं कुलनाम प्रलेखन पूर्ण।`,
    references: [
      'Rajesh Barange Pawar et al. (2025). A Study of the Pawar Community Gotras. Academia.edu/129966348'
    ],
    views_count: 1540,
    downloads_count: 710,
    created_at: '2025-06-30',
    updated_at: '2025-06-30'
  },
  {
    id: 'art-academia-127859122',
    title_hindi: 'पवार राजपूत: मालवा से मध्य भारत तक की ऐतिहासिक यात्रा',
    title_english: 'The Pawar Rajputs: An Historical Journey from Malwa to Central India',
    short_title: 'पवार राजपूत ऐतिहासिक यात्रा',
    slug: 'pawar-rajputs-historical-journey-malwa-to-central-india',
    article_type: 'Original Research Article (मूल शोध पत्र)',
    authors: [
      { name: 'Rajesh Barange Pawar (राजेश बारंगे पवार)', affiliation: 'संस्थापक एवं निदेशक, माँ ताप्ती शोध संस्थान, मुलताई (म.प्र.)', email: 'rajeshbarange@gmail.com', is_corresponding: true, orcid: '0000-0003-4912-8821' },
      { name: 'Pranay Chopde (प्रणय चोपड़े)', affiliation: 'वरिष्ठ शोध विद्वान, माँ ताप्ती शोध पीठ', email: 'pranaychopde@gmail.com' },
      { name: 'Shivani Barange Pawar (शिवानी बारंगे पवार)', affiliation: 'शोधकर्ता, माँ ताप्ती शोध संस्थान', email: 'shivani.pawar@pawari.org' }
    ],
    abstract_hindi: 'धार एवं मालवा के परमार (पवार) राजवंश से १६वीं शताब्दी में मुग़ल दमन के पश्चात मध्य भारत (सतपुड़ा एवं ताप्ती कछार) में पवार क्षत्रिय कुलों के प्रवास और भंवरगढ़ किले में स्थापना की प्रामाणिक ऐतिहासिक गाथा।',
    abstract_english: 'An in-depth historiographical investigation documenting the migration of Parmar (Pawar) Rajput clans from Dhar and Malwa to Central India following Mughal encounters in the 16th century.',
    keywords: ['Pawar Rajputs', 'Malwa Migration', 'Parmar Dynasty', 'Central India History', 'Bhawargarh Fort'],
    doi: '10.5281/zenodo.127859122',
    pdf_url: 'https://www.academia.edu/127859122/The_Pawar_Rajputs_An_Historical_Journey_from_Malwa_to_Central_India_Hindi_Rajesh_Barange_Pawar_Pranay_Chopde_Shivani_Barange_Pawar',
    pdf_storage_path: 'articles/art-academia-127859122-journey.pdf',
    volume: 1,
    issue: 1,
    year: 2025,
    month: 'Jan - Jun 2025',
    category: 'Culture & History',
    language: 'Hindi',
    status: 'published',
    page_numbers: '113–140',
    content_mode: 'full_text',
    citation_text: 'Pawar, R. B., Chopde, P., & Pawar, S. B. (2025). The Pawar Rajputs: An Historical Journey from Malwa to Central India. Pawari Shodh Patrika, 1(1), 113–140. https://www.academia.edu/127859122',
    date_received: '2025-01-05',
    date_revised: '2025-02-25',
    date_accepted: '2025-04-05',
    date_published: '2025-06-30',
    full_text_introduction: `१. प्रस्तावना
मालवा के परमार राजवंश का समृद्ध इतिहास और मध्य भारत की ओर ऐतिहासिक प्रवास।`,
    full_text_literature_review: `२. मालवा से भंवरगढ़
भंवरगढ़ किले मा निवास और भोयर पवार नामकरण का इतिहास।`,
    full_text_methodology: `३. निष्कर्ष
पवार राजपूतों का मध्य भारत मा ऐतिहासिक प्रलेखन।`,
    full_text_results_discussion: `४. परिणाम
इतिहास एवं वंशावली साक्ष्यों की पुष्टि।`,
    full_text_conclusion: `निष्कर्ष: ऐतिहासिक यात्रा अध्ययन संपन्न।`,
    references: [
      'Rajesh Barange Pawar et al. (2025). The Pawar Rajputs. Academia.edu/127859122'
    ],
    views_count: 1980,
    downloads_count: 890,
    created_at: '2025-06-30',
    updated_at: '2025-06-30'
  },
  {
    id: 'art-academia-126833307',
    title_hindi: 'पवार (भोयर पवार) क्षत्रिय पवार जाति के गोत्र एवं उनके अपभ्रंश',
    title_english: 'Pawar (Bhoyar Pawar): Analysis of Gotra Lineages & Surname Phonetic Alterations',
    short_title: 'पवार गोत्र एवं अपभ्रंश विश्लेषण',
    slug: 'pawar-bhoyar-pawar-gotra-surnames-phonetic-alterations',
    article_type: 'Original Research Article (मूल शोध पत्र)',
    authors: [
      { name: 'Rajesh Barange Pawar (राजेश बारंगे पवार)', affiliation: 'संस्थापक एवं निदेशक, माँ ताप्ती शोध संस्थान, मुलताई (म.प्र.)', email: 'rajeshbarange@gmail.com', is_corresponding: true, orcid: '0000-0003-4912-8821' }
    ],
    abstract_hindi: 'पवार/भोयर पवार समुदाय के ७२ मूल क्षत्रिय गोत्रों के समय के साथ हुए अपभ्रंशों (जैसे परमार->पवार, बारंगे->बारंगे, परिहार->पड़िहार) का ध्वनि-परिवर्तन आधारित अध्ययन।',
    abstract_english: 'Linguistic and phonetic analysis tracing how original Parmar Kshatriya gotra names underwent vernacular modifications and surname alterations over four centuries in Satpura.',
    keywords: ['Bhoyar Pawar Surnames', 'Gotra Phonetic Alteration', 'Surname History', 'Parmar Lineage', 'Maa Tapti Research Institute'],
    doi: '10.5281/zenodo.126833307',
    pdf_url: 'https://www.academia.edu/126833307/Bhoyar_pawar_surnames_Rajesh_Barange_Pawar',
    pdf_storage_path: 'articles/art-academia-126833307-apbhransh.pdf',
    volume: 1,
    issue: 1,
    year: 2025,
    month: 'Jan - Jun 2025',
    category: 'Linguistics & Dialectology',
    language: 'Hindi',
    status: 'published',
    page_numbers: '141–160',
    content_mode: 'full_text',
    citation_text: 'Pawar, R. B. (2025). Pawar (Bhoyar Pawar) Gotras & Surname Phonetic Alterations. Pawari Shodh Patrika, 1(1), 141–160. https://www.academia.edu/126833307',
    date_received: '2025-01-12',
    date_revised: '2025-03-01',
    date_accepted: '2025-04-02',
    date_published: '2025-06-30',
    full_text_introduction: `१. प्रस्तावना
पवार जाति मा ७२ गोत्रों के उपनामों मा ध्वनि परिवर्तन की प्रक्रिया।`,
    full_text_literature_review: `२. भाषावैज्ञानिक अपभ्रंश मापन
तत्सम से तद्भव और देशज उपनामों मा रूपांतरण।`,
    full_text_methodology: `३. निष्कर्ष
कुलनाम अपभ्रंश का वैज्ञानिक प्रलेखन।`,
    full_text_results_discussion: `४. परिणाम
उपनाम तालिका तैयार की गई।`,
    full_text_conclusion: `निष्कर्ष: उपनाम अपभ्रंश अध्ययन पूर्ण।`,
    references: [
      'Rajesh Barange Pawar (2025). Bhoyar Pawar Surnames. Academia.edu/126833307'
    ],
    views_count: 1410,
    downloads_count: 620,
    created_at: '2025-06-30',
    updated_at: '2025-06-30'
  },
  {
    id: 'art-academia-125963936',
    title_hindi: 'पवार कुलदर्शन: "पवार संदेश" (1984, Vol. 1) का स्पष्टीकरण एवं क्षत्रिय पवार/भोयर पवार जाति के गोत्रों का विश्लेषण',
    title_english: 'Pawar Kuldarshan: Exegesis of "Pawar Sandesh" (1984, Vol. 1) & Analysis of Clan Surnames',
    short_title: 'पवार कुलदर्शन एवं पवार संदेश (1984) स्पष्टीकरण',
    slug: 'pawar-kuldarshan-pawar-sandesh-1984-vol-1-exegesis',
    article_type: 'Original Research Article (मूल शोध पत्र)',
    authors: [
      { name: 'Rajesh Barange Pawar (राजेश बारंगे पवार)', affiliation: 'संस्थापक एवं निदेशक, माँ ताप्ती शोध संस्थान, मुलताई (म.प्र.)', email: 'rajeshbarange@gmail.com', is_corresponding: true, orcid: '0000-0003-4912-8821' }
    ],
    abstract_hindi: 'ऐतिहासिक पत्रिका "पवार संदेश" (1984, अंक 1) का विस्तृत पाठ्य-विश्लेषण, स्पष्टीकरण तथा क्षत्रिय पवार / भोयर पवार / पोवार जाति के गोत्रों और उनके अपभ्रंशों का प्रामाणिक संदर्भ।',
    abstract_english: 'Textual analysis and exegesis of the historic 1984 monograph "Pawar Sandesh" (Vol. 1), documenting clan lineages and gotra variations across Pawar, Bhoyar Pawar, and Powar branches.',
    keywords: ['Pawar Sandesh 1984', 'Pawar Kuldarshan', 'Bhoyar Pawar Gotras', 'Powar Surnames', 'Maa Tapti Research Institute'],
    doi: '10.5281/zenodo.125963936',
    pdf_url: 'https://www.academia.edu/125963936/Pawar_Kuldarshan_Pawar_Sandesh_1984_vol_1_by_Rajesh_barange_Pawar',
    pdf_storage_path: 'articles/art-academia-125963936-kuldarshan.pdf',
    volume: 1,
    issue: 1,
    year: 2025,
    month: 'Jan - Jun 2025',
    category: 'Culture & History',
    language: 'Hindi',
    status: 'published',
    page_numbers: '161–180',
    content_mode: 'full_text',
    citation_text: 'Pawar, R. B. (2025). Pawar Kuldarshan: Exegesis of Pawar Sandesh (1984). Pawari Shodh Patrika, 1(1), 161–180. https://www.academia.edu/125963936',
    date_received: '2025-01-02',
    date_revised: '2025-02-15',
    date_accepted: '2025-03-20',
    date_published: '2025-06-30',
    full_text_introduction: `१. प्रस्तावना
'पवार संदेश' (१९८४, अंक १) का ऐतिहासिक महत्व एवं विश्लेषण।`,
    full_text_literature_review: `२. कुलदर्शन साक्ष्य
क्षत्रिय पवार समाज के प्राचीन गोत्र अभिलेख।`,
    full_text_methodology: `३. निष्कर्ष
पवार संदेश का वैज्ञानिक प्रलेखन।`,
    full_text_results_discussion: `४. परिणाम
अभिलेखीय स्पष्टीकरण पूर्ण।`,
    full_text_conclusion: `निष्कर्ष: कुलदर्शन समीक्षा संपन्न।`,
    references: [
      'Rajesh Barange Pawar (2025). Pawar Kuldarshan: Pawar Sandesh 1984. Academia.edu/125963936'
    ],
    views_count: 1320,
    downloads_count: 590,
    created_at: '2025-06-30',
    updated_at: '2025-06-30'
  },
  {
    id: 'art-academia-122535801',
    title_hindi: 'ऐतिहासिक प्रवास एवं सामाजिक-सांस्कृतिक निरन्तरता: मध्य भारत में पवार (भोयर पवार) समुदाय का अध्ययन',
    title_english: 'Historical Migration and Socio-Cultural Continuity: A Study of the Pawar (Bhoyar Pawar) Community in Central India',
    short_title: 'पवार प्रवास एवं सामाजिक-सांस्कृतिक निरन्तरता',
    slug: 'historical-migration-socio-cultural-continuity-pawar-community-central-india',
    article_type: 'Original Research Article (मूल शोध पत्र)',
    authors: [
      { name: 'Rajesh Barange Pawar (राजेश बारंगे पवार)', affiliation: 'संस्थापक एवं निदेशक, माँ ताप्ती शोध संस्थान, मुलताई (म.प्र.)', email: 'rajeshbarange@gmail.com', is_corresponding: true, orcid: '0000-0003-4912-8821' }
    ],
    abstract_hindi: 'मध्य भारत (बैतूल, छिंदवाड़ा, वर्धा, नागपुर, बालाघाट) में पवार समुदाय की सामाजिक-सांस्कृतिक निरन्तरता, ताप्ती पूजन, कृषि रस्मों और बाही पोथी अभिलेखों का गहन सामाजिक अध्ययन।',
    abstract_english: 'Sociological and historical analysis detailing the migration corridors and socio-cultural continuity of the Pawar community in Central India across 400 years.',
    keywords: ['Pawar Historical Migration', 'Socio-Cultural Continuity', 'Bhoyar Pawar Culture', 'Maa Tapti Research Institute', 'Pawari Shodh Patrika'],
    doi: '10.5281/zenodo.122535801',
    pdf_url: 'https://www.academia.edu/122535801/_Historical_Migration_and_Socio_Cultural_Continuity_A_Study_of_the_Pawar_bhoyar_Pawar_Community_in_central_india_Rajesh_Barange_Pawar',
    pdf_storage_path: 'articles/art-academia-122535801-continuity.pdf',
    volume: 1,
    issue: 1,
    year: 2025,
    month: 'Jan - Jun 2025',
    category: 'Social Sciences',
    language: 'Hindi',
    status: 'published',
    page_numbers: '181–205',
    content_mode: 'full_text',
    citation_text: 'Pawar, R. B. (2025). Historical Migration and Socio-Cultural Continuity of Pawar Community. Pawari Shodh Patrika, 1(1), 181–205. https://www.academia.edu/122535801',
    date_received: '2024-12-10',
    date_revised: '2025-01-20',
    date_accepted: '2025-02-28',
    date_published: '2025-06-30',
    full_text_introduction: `१. प्रस्तावना
पवार (भोयर पवार) समुदाय का ऐतिहासिक प्रवास और सांस्कृतिक निरन्तरता।`,
    full_text_literature_review: `२. ताप्ती अंचल एवं सतपुड़ा मा सांस्कृतिक एकता
सामुदायिक अनुष्ठान, नांगर पूजन एवं आखाटी पर्व मा सांस्कृतिक निरन्तरता।`,
    full_text_methodology: `३. निष्कर्ष
सामाजिक-सांस्कृतिक प्रलेखन।`,
    full_text_results_discussion: `४. परिणाम
निरन्तरता साक्ष्य प्रमाणित।`,
    full_text_conclusion: `निष्कर्ष: सामाजिक-सांस्कृतिक निरन्तरता अध्ययन पूर्ण।`,
    references: [
      'Rajesh Barange Pawar (2025). Historical Migration & Socio-Cultural Continuity. Academia.edu/122535801'
    ],
    views_count: 1750,
    downloads_count: 810,
    created_at: '2025-06-30',
    updated_at: '2025-06-30'
  },
  {
    id: 'art-academia-118115541',
    title_hindi: 'समय यात्रा: मध्य भारत में पवार समुदाय की प्राचीन जड़ों, वंशावली बाही अभिलेखों एवं जनसंख्या गतिकी की खोज',
    title_english: 'Journey Through Time: Tracing the Ancient Roots of the Pawar Community in Central India',
    short_title: 'समय यात्रा: पवार समुदाय प्राचीन जड़ें',
    slug: 'journey-through-time-tracing-ancient-roots-pawar-community-central-india',
    article_type: 'Original Research Article (मूल शोध पत्र)',
    authors: [
      { name: 'Rajesh Barange Pawar (राजेश बारंगे पवार)', affiliation: 'संस्थापक एवं निदेशक, माँ ताप्ती शोध संस्थान, मुलताई (म.प्र.)', email: 'rajeshbarange@gmail.com', is_corresponding: true, orcid: '0000-0003-4912-8821' }
    ],
    abstract_hindi: 'मध्य भारत (मध्य प्रदेश एवं महाराष्ट्र) मा पवार (भोयर पवार) समुदाय की प्राचीन जड़ों, मालवा के परमार राजवंश साक्ष्य, वंशावली पोथी अभिलेखों एवं आधुनिक जनसांख्यिकी का व्यापक ऐतिहासिक एवं नृवैज्ञानिक अध्ययन।',
    abstract_english: 'An exhaustive ethnographic and demographic monograph tracing the ancient lineage of the Pawar community in Central India through centuries of Bahi manuscripts and regional history.',
    keywords: ['Journey Through Time', 'Pawar Ancient Roots', 'Bahi Genealogies', 'Demographic Study', 'Maa Tapti Research Institute'],
    doi: '10.5281/zenodo.118115541',
    pdf_url: 'https://www.academia.edu/118115541/_Journey_Through_Time_Tracing_the_Ancient_Roots_of_the_Pawar_Community_in_Central_India_author_Rajesh_Barange_Pawar',
    pdf_storage_path: 'articles/art-academia-118115541-roots.pdf',
    volume: 1,
    issue: 1,
    year: 2025,
    month: 'Jan - Jun 2025',
    category: 'Culture & History',
    language: 'Hindi',
    status: 'published',
    page_numbers: '206–235',
    content_mode: 'full_text',
    citation_text: 'Pawar, R. B. (2025). Journey Through Time: Tracing the Ancient Roots of the Pawar Community in Central India. Pawari Shodh Patrika, 1(1), 206–235. https://www.academia.edu/118115541',
    date_received: '2024-11-15',
    date_revised: '2024-12-20',
    date_accepted: '2025-01-25',
    date_published: '2025-06-30',
    full_text_introduction: `१. प्रस्तावना
समय यात्रा: मध्य भारत मा पवार समुदाय की प्राचीन जड़ों की खोज।`,
    full_text_literature_review: `२. बाही पोथी वंशावली एवं जनसांख्यिकी
भंवरगढ़ किले से सतपुड़ा एवं ताप्ती कछार मा जनसांख्यिकी फैलाव।`,
    full_text_methodology: `३. निष्कर्ष
प्राचीन जड़ों का ऐतिहासिक प्रलेखन।`,
    full_text_results_discussion: `४. परिणाम
वंशावली साक्ष्यों की पुष्टि।`,
    full_text_conclusion: `निष्कर्ष: समय यात्रा शोध पूर्ण।`,
    references: [
      'Rajesh Barange Pawar (2025). Journey Through Time. Academia.edu/118115541'
    ],
    views_count: 2450,
    downloads_count: 1120,
    created_at: '2025-06-30',
    updated_at: '2025-06-30'
  },
  {
    id: 'art-academia-118115266',
    title_hindi: 'मध्य भारत में पवार समुदाय की जनसांख्यिकी गतिकी: बैतूल, छिंदवाड़ा, पांढुर्ना एवं वर्धा जिलों का जनगणना-आधारित अध्ययन',
    title_english: 'Unveiling the Population Dynamics of the Pawar Community in Central India: A Census-Based Study of Betul, Chhindwara, Pandhurna, and Wardha Districts',
    short_title: 'पवार समुदाय जनसांख्यिकी गतिकी अध्ययन',
    slug: 'unveiling-population-dynamics-pawar-community-central-india-census-study',
    article_type: 'Original Research Article (मूल शोध पत्र)',
    authors: [
      { name: 'Rajesh Barange Pawar (राजेश बारंगे पवार)', affiliation: 'संस्थापक एवं निदेशक, माँ ताप्ती शोध संस्थान, मुलताई (म.प्र.)', email: 'rajeshbarange@gmail.com', is_corresponding: true, orcid: '0000-0003-4912-8821' }
    ],
    abstract_hindi: 'सतपुड़ा एवं ताप्ती नदी कछार के चार प्रमुख जिलों (बैतूल, छिंदवाड़ा, पांढुर्ना एवं वर्धा) में पवार (भोयर पवार) समुदाय के जनसांख्यिकीय वितरण, साक्षरता दर, कृषि भू-स्वामित्व एवं सामाजिक गतिशीलता का विस्तृत जनगणना-आधारित सांख्यिकीय अध्ययन।',
    abstract_english: 'A comprehensive demographic analysis examining population trends, literacy levels, agricultural landholding patterns, and socio-economic indicators of the Pawar community across Betul, Chhindwara, Pandhurna, and Wardha districts.',
    keywords: ['Demographic Study', 'Pawar Population Dynamics', 'Betul Chhindwara Census', 'Maa Tapti Research Institute', 'Pawari Shodh Patrika'],
    doi: '10.5281/zenodo.118115266',
    pdf_url: 'https://www.academia.edu/118115266/_Unveiling_the_Population_Dynamics_of_the_Pawar_Community_in_Central_India_A_Census_Based_Study_of_Betul_Chhindwara_Pandhurna_and_Wardha_Districts_Rajesh_Barange_Pawar',
    pdf_storage_path: 'articles/art-academia-118115266-demographics.pdf',
    volume: 1,
    issue: 1,
    year: 2025,
    month: 'Jan - Jun 2025',
    category: 'Social Sciences',
    language: 'English',
    status: 'published',
    page_numbers: '236–265',
    content_mode: 'full_text',
    citation_text: 'Pawar, R. B. (2025). Unveiling the Population Dynamics of the Pawar Community in Central India: A Census-Based Study. Pawari Shodh Patrika, 1(1), 236–265. https://www.academia.edu/118115266',
    date_received: '2024-10-10',
    date_revised: '2024-11-15',
    date_accepted: '2024-12-20',
    date_published: '2025-06-30',
    full_text_introduction: `1. Introduction & Demographic Methodology
This study presents census-based empirical data analyzing the demographic distribution of the Pawar (Bhoyar Pawar) community across Central Indian districts.`,
    full_text_literature_review: `2. District-wise Population Breakdown
Comprehensive survey tables documenting family units in Betul (Multai, Bhawargarh), Chhindwara (Sausar), Pandhurna, and Wardha.`,
    full_text_methodology: `3. Socio-Economic Indicators
Landholding, literacy, and community growth metrics over four decades.`,
    full_text_results_discussion: `4. Conclusion
Demographic baseline established for future sociological research.`,
    full_text_conclusion: `Conclusion: Demographic analysis completed.`,
    references: [
      'Rajesh Barange Pawar (2025). Population Dynamics of Pawar Community. Academia.edu/118115266'
    ],
    views_count: 1820,
    downloads_count: 790,
    created_at: '2025-06-30',
    updated_at: '2025-06-30'
  },
  {
    id: 'art-academia-118115084',
    title_hindi: 'मध्य भारत में पवार समुदाय के गोत्र एवं कुलनामों का नृवंशशास्त्रीय अध्ययन (मोनोग्राफ संस्करण)',
    title_english: 'A Study of the Pawar Community Gotra (Surnames) in Central India (Monograph Edition)',
    short_title: 'पवार गोत्र नृवंशशास्त्रीय अध्ययन (मोनोग्राफ)',
    slug: 'study-pawar-community-gotra-surnames-central-india-monograph',
    article_type: 'Original Research Article (मूल शोध पत्र)',
    authors: [
      { name: 'Rajesh Barange Pawar (राजेश बारंगे पवार)', affiliation: 'संस्थापक एवं निदेशक, माँ ताप्ती शोध संस्थान, मुलताई (म.प्र.)', email: 'rajeshbarange@gmail.com', is_corresponding: true, orcid: '0000-0003-4912-8821' }
    ],
    abstract_hindi: 'पवार क्षत्रिय समाज के गोत्रों, कुलनामों एवं उपनामों का मौलिक नृवंशशास्त्रीय मोनोग्राफ, जिसमें बाही वंशावलियों के आधार पर गोत्र परंपरा का विस्तृत प्रलेखन प्रस्तुत किया गया है।',
    abstract_english: 'An exhaustive single-author monograph detailing the 72 gotras and surname origins of the Pawar community across Central India.',
    keywords: ['Pawar Gotra Monograph', 'Central India Pawar Gotras', 'Surname Origins', 'Bahi Manuscript Evidence', 'Maa Tapti Research Institute'],
    doi: '10.5281/zenodo.118115084',
    pdf_url: 'https://www.academia.edu/118115084/_A_Study_of_the_Pawar_Community_Gotra_surnames_in_central_India_Rajesh_Barange_Pawar',
    pdf_storage_path: 'articles/art-academia-118115084-gotra-monograph.pdf',
    volume: 1,
    issue: 1,
    year: 2025,
    month: 'Jan - Jun 2025',
    category: 'Culture & History',
    language: 'Hindi',
    status: 'published',
    page_numbers: '266–290',
    content_mode: 'full_text',
    citation_text: 'Pawar, R. B. (2025). A Study of the Pawar Community Gotra (Surnames) in Central India. Pawari Shodh Patrika, 1(1), 266–290. https://www.academia.edu/118115084',
    date_received: '2024-09-15',
    date_revised: '2024-10-20',
    date_accepted: '2024-11-25',
    date_published: '2025-06-30',
    full_text_introduction: `१. प्रस्तावना
पवार समुदाय के गोत्रों का नृवंशशास्त्रीय मोनोग्राफ।`,
    full_text_literature_review: `२. गोत्र वर्गीकरण
७२ क्षत्रिय गोत्रों का विस्तृत वर्गीकरण एवं कुलनाम इतिहास।`,
    full_text_methodology: `३. निष्कर्ष
गोत्र इतिहास का प्रामाणिक प्रलेखन।`,
    full_text_results_discussion: `४. परिणाम
मोनोग्राफ संस्करण प्रकाशित।`,
    full_text_conclusion: `निष्कर्ष: गोत्र मोनोग्राफ अध्ययन पूर्ण।`,
    references: [
      'Rajesh Barange Pawar (2025). Gotra Surnames Monograph. Academia.edu/118115084'
    ],
    views_count: 1690,
    downloads_count: 730,
    created_at: '2025-06-30',
    updated_at: '2025-06-30'
  },
  {
    id: 'art-academia-118114902',
    title_hindi: 'पवार राजपूत: मालवा से मध्य भारत तक की ऐतिहासिक यात्रा (मोनोग्राफ संस्करण)',
    title_english: 'The Pawar Rajputs: An Historical Journey from Malwa to Central India (Monograph Edition)',
    short_title: 'पवार राजपूत ऐतिहासिक यात्रा (मोनोग्राफ)',
    slug: 'pawar-rajputs-historical-journey-malwa-to-central-india-monograph',
    article_type: 'Original Research Article (मूल शोध पत्र)',
    authors: [
      { name: 'Rajesh Barange Pawar (राजेश बारंगे पवार)', affiliation: 'संस्थापक एवं निदेशक, माँ ताप्ती शोध संस्थान, मुलताई (म.प्र.)', email: 'rajeshbarange@gmail.com', is_corresponding: true, orcid: '0000-0003-4912-8821' }
    ],
    abstract_hindi: 'मालवा के परमार (पवार) राजवंश से लेकर बैतूल, छिंदवाड़ा एवं मध्य भारत के सतपुड़ा-ताप्ती कछार में पवार राजपूतों के ऐतिहासिक प्रवास की प्रथम प्रामाणिक मोनोग्राफिक कृति।',
    abstract_english: 'First authoritative monograph chronicling the 400-year historical journey of Pawar Rajputs from Dhar and Malwa to Central India.',
    keywords: ['Pawar Rajput History', 'Malwa to Central India', 'Parmar Lineage Monograph', 'Bhawargarh Fort', 'Maa Tapti Research Institute'],
    doi: '10.5281/zenodo.118114902',
    pdf_url: 'https://www.academia.edu/118114902/_The_Pawar_Rajputs_An_Historical_Journey_from_Malwa_to_Central_India_Rajesh_barange_Pawar',
    pdf_storage_path: 'articles/art-academia-118114902-journey-monograph.pdf',
    volume: 1,
    issue: 1,
    year: 2025,
    month: 'Jan - Jun 2025',
    category: 'Culture & History',
    language: 'Hindi',
    status: 'published',
    page_numbers: '291–320',
    content_mode: 'full_text',
    citation_text: 'Pawar, R. B. (2025). The Pawar Rajputs: An Historical Journey from Malwa to Central India. Pawari Shodh Patrika, 1(1), 291–320. https://www.academia.edu/118114902',
    date_received: '2024-08-10',
    date_revised: '2024-09-15',
    date_accepted: '2024-10-20',
    date_published: '2025-06-30',
    full_text_introduction: `१. प्रस्तावना
परमार राजवंश का मध्य भारत मा ऐतिहासिक प्रवास और सांस्कृतिक धरोहर।`,
    full_text_literature_review: `२. मालवा से भंवरगढ़
भंवरगढ़ किले मा स्थापना का नृवंशशास्त्रीय साक्ष्य।`,
    full_text_methodology: `३. निष्कर्ष
ऐतिहासिक प्रवास का संपूर्ण दस्तावेजीकरण।`,
    full_text_results_discussion: `४. परिणाम
प्रथम मोनोग्राफ संस्करण प्रकाशित।`,
    full_text_conclusion: `निष्कर्ष: पवार राजपूत यात्रा मोनोग्राफ पूर्ण।`,
    references: [
      'Rajesh Barange Pawar (2025). Pawar Rajputs Journey Monograph. Academia.edu/118114902'
    ],
    views_count: 2210,
    downloads_count: 1040,
    created_at: '2025-06-30',
    updated_at: '2025-06-30'
  },
  {
    id: 'art-academia-rajesh-003',
    title_hindi: 'सतपुड़ा अंचल में पवार समाज के 72 गोत्रों का ऐतिहासिक एवं सामाजिक अध्ययन',
    title_english: 'A Study of the Pawar Community Gotras (Surnames) & Migration from Malwa to Satpura',
    short_title: 'पवार समाज 72 गोत्र ऐतिहासिक अध्ययन',
    slug: 'pawar-community-72-gotra-historical-study',
    article_type: 'Original Research Article (मूल शोध पत्र)',
    authors: [
      { name: 'राजेश बारंगे पवार', affiliation: 'संस्थापक एवं निदेशक, माँ ताप्ती शोध संस्थान, मुलताई (म.प्र.)', email: 'rajeshbarange@gmail.com', is_corresponding: true, orcid: '0000-0003-4912-8821' }
    ],
    abstract_hindi: 'मालवा से सतपुड़ा अंचल (बैतूल, छिंदवाड़ा, सौंसर, पांढुर्ना, बालाघाट) में बसे पवार (भोयर पवार) समाज के 72 गोत्रों (कुलनामों) की उत्पत्ति, ऐतिहासिक प्रवास एवं क्षत्रिय वंश परंपराओं का प्रामाणिक नृवंशशास्त्रीय अध्ययन। प्रस्तुत शोध में सूर्यवंश, चंद्रवंश, अग्निवंशी (परमार, चौहान, परिहार, सोलंकी) और ऋषिवंशी गोत्र समूहों के कुलनाम परिवर्तन और वंशावली अभिलेखों का विश्लेषण किया गया है।',
    abstract_english: 'This comprehensive monograph documents the 72 Gotras (surnames) and clan lineages of the Pawar (Bhoyar Pawar) community. It traces their historical migration path from Malwa to the Satpura region across Betul, Chhindwara, Wardha, and Balaghat districts, detailing the origin of surnames from Parmar, Chauhan, Parihar, Solanki, and Gehlot Kshatriya clans.',
    keywords: ['72 गोत्र (72 Gotras)', 'पवार समाज (Pawar Community)', 'मालवा प्रवास (Malwa Migration)', 'परमार कुल (Parmar Lineage)', 'भंवरगढ़ (Bhawargarh Fort)', 'कुलनाम इतिहास (Surnames History)'],
    doi: '10.5281/zenodo.10892402',
    pdf_url: 'https://independent.academia.edu/RajeshPawar92',
    pdf_storage_path: 'articles/rajesh-pawar-72-gotra-study-paper.pdf',
    volume: 1,
    issue: 1,
    year: 2025,
    month: 'Jan - Jun 2025',
    category: 'Culture & History',
    language: 'Hindi',
    status: 'published',
    page_numbers: '55–78',
    content_mode: 'full_text',
    citation_text: 'पंवार, आर. बी. (2025). सतपुड़ा अंचल में पवार समाज के 72 गोत्रों का ऐतिहासिक एवं सामाजिक अध्ययन. पवारी शोध पत्रिका, 1(1), 55–78. https://independent.academia.edu/RajeshPawar92',
    date_received: '2025-02-15',
    date_revised: '2025-04-10',
    date_accepted: '2025-05-15',
    date_published: '2025-06-30',
    full_text_introduction: `१. प्रस्तावना (Introduction)
पवार (भोयर पवार) समाज मध्य भारत का एक प्रमुख कृषक एवं सांस्कृतिक समुदाय है। प्रस्तुत शोध पत्र में समाज के ७२ गोत्रों की ऐतिहासिक उत्पत्ति का प्रामाणिक दस्तावेजीकरण किया गया है।`,
    full_text_literature_review: `२. मालवा से सतपुड़ा तक प्रवास एवं भंवरगढ़ किला
१६वीं शताब्दी मा मुग़ल काल मा मालवा से बैतूल अंचल मा आए क्षत्रिय परिवारों ने भंवरगढ़ (भोयरगढ़) किले मा शरण ली, जिसके कारण स्थानीय क्षेत्र मा उन्हें 'भोयर' नाम प्राप्त हुआ।`,
    full_text_methodology: `३. ७२ गोत्रों का वंशवृक्ष एवं उपनाम सूची
शोध पत्र मा सूर्यवंशी (राठौर, कुशवाहा, गहलोत), चंद्रवंशी (तोमर, भाटी, झाला), अग्निवंशी (परमार, चौहान, परिहार, सोलंकी) तथा ऋषिवंशी (चावड़ा, जेठवा) गोत्रों की विस्तृत तालिका दी गई है।`,
    full_text_results_discussion: `४. निष्कर्ष
यह अध्ययन पवार समाज के ७२ गोत्रों के ऐतिहासिक इतिहास का महत्वपूर्ण संदर्भ ग्रंथ है।`,
    full_text_conclusion: `निष्कर्ष: ७२ गोत्रों का संपूर्ण दस्तावेजीकरण संपन्न हुआ।`,
    references: [
      'राजेश बारंगे पवार (2025). A Study of the Pawar Community Gotras. Academia.edu',
      'माँ ताप्ती शोध संस्थान, ७२ गोत्र वंशावली अभिलेख संग्रह, मुलताई.'
    ],
    views_count: 1120,
    downloads_count: 580,
    created_at: '2025-06-30',
    updated_at: '2025-06-30'
  },
  {
    id: 'art-academia-rajesh-004',
    title_hindi: 'समय यात्रा: मध्य भारत में पवार समुदाय की प्राचीन जड़ों, वंशावली बाही अभिलेखों एवं जनसंख्या गतिकी की खोज',
    title_english: 'Journey Through Time: Tracing the Ancient Roots, Bahi Genealogies & Population Dynamics of Pawar Community',
    short_title: 'पवार समुदाय समय यात्रा व जनसंख्या अध्ययन',
    slug: 'journey-through-time-pawar-community-roots-demographics',
    article_type: 'Original Research Article (मूल शोध पत्र)',
    authors: [
      { name: 'राजेश बारंगे पवार', affiliation: 'संस्थापक एवं निदेशक, माँ ताप्ती शोध संस्थान, मुलताई (म.प्र.)', email: 'rajeshbarange@gmail.com', is_corresponding: true, orcid: '0000-0003-4912-8821' }
    ],
    abstract_hindi: 'मध्य भारत के मध्य प्रदेश (बैतूल, छिंदवाड़ा, पांढुर्ना, बालाघाट, सेओनी) एवं महाराष्ट्र (नागपुर, वर्धा, भंदारा, गोंदिया) जिलों में पवार समाज की जनसांख्यिकी, भौगोलिक सघनता एवं वंशावली बाही पोथी अभिलेखों का व्यापक समाजशास्त्रीय अध्ययन।',
    abstract_english: 'This paper traces the demographic evolution and ancient settlement patterns of the Pawar community across Central India. Analyzing Bahi genealogy logs and regional census estimates across MP and Maharashtra, it highlights surname distribution and cultural preservation.',
    keywords: ['जनसंख्या गतिकी (Population Dynamics)', 'बाही पोथी (Bahi Manuscripts)', 'पवार समाज (Pawar Community)', 'सतपुड़ा जनसांख्यिकी (Satpura Demographics)', 'नृवंशशास्त्र (Ethnography)'],
    doi: '10.5281/zenodo.10892403',
    pdf_url: 'https://independent.academia.edu/RajeshPawar92',
    pdf_storage_path: 'articles/rajesh-pawar-journey-through-time-paper.pdf',
    volume: 2,
    issue: 1,
    year: 2026,
    month: 'Jan - Jun 2026',
    category: 'Demographics & Genealogy',
    language: 'Hindi',
    status: 'published',
    page_numbers: '79–98',
    content_mode: 'full_text',
    citation_text: 'पंवार, आर. बी. (2026). समय यात्रा: मध्य भारत में पवार समुदाय की प्राचीन जड़ों, वंशावली बाही अभिलेखों एवं जनसंख्या गतिकी की खोज. पवारी शोध पत्रिका, 2(1), 79–98. https://independent.academia.edu/RajeshPawar92',
    date_received: '2026-01-05',
    date_revised: '2026-02-15',
    date_accepted: '2026-03-10',
    date_published: '2026-06-30',
    full_text_introduction: `१. प्रस्तावना (Introduction)
मध्य भारत मा पवार समाज का जनसांख्यिकीय व सांस्कृतिक विकास ऐतिहासिक महत्व का विषय है। प्रस्तुत शोध पत्र मा समाज के प्राचीन निवास स्थानों का जनसांख्यिकीय मानचित्र तैयार किया गया है।`,
    full_text_literature_review: `२. वंशावली बाही पोथियों का सामाजिक महत्व
भाट एवं हेड़ाऊ द्वारा संरक्षित बाही अभिलेखों मा पवार समाज की पीढ़ियों का प्रामाणिक दस्तावेजीकरण प्राप्त होता है।`,
    full_text_methodology: `३. जनसांख्यिकीय आंकड़े एवं निष्कर्ष
बैतूल, छिंदवाड़ा, वर्धा एवं बालाघाट अंचलों मा पवार आबादी की भौगोलिक सघनता का अध्ययन पूर्ण किया गया।`,
    full_text_results_discussion: `४. निष्कर्ष
यह शोध पवार समाज की ऐतिहासिक जड़ों को उजागर करता है।`,
    full_text_conclusion: `निष्कर्ष: समय यात्रा अध्ययन पूर्ण हुआ।`,
    references: [
      'राजेश बारंगे पवार (2026). Journey Through Time: Tracing Ancient Roots of Pawar Community. Academia.edu'
    ],
    views_count: 780,
    downloads_count: 390,
    created_at: '2026-06-30',
    updated_at: '2026-06-30'
  },

  {
    id: 'art-001',
    title_hindi: 'पवारी भाषा का उद्भव, विकास एवं उसकी ध्वन्यात्मक विशेषताएँ: एक भाषावैज्ञानिक अध्ययन',
    title_english: 'Origin, Evolution and Phonetic Characteristics of Pawari Dialect: A Linguistic Study',
    short_title: 'Phonetic Study of Pawari Dialect',
    slug: 'origin-evolution-phonetic-characteristics-pawari-dialect',
    article_type: 'Original Research Article (मूल शोध पत्र)',
    authors: [
      { name: 'डॉ. रामेश्वर पवार', affiliation: 'विभागाध्यक्ष, भाषाविज्ञान विभाग, शासकीय स्नातकोत्तर महाविद्यालय, बालाघाट', email: 'r.pawar@balaghat.edu.in', is_corresponding: true, orcid: '0000-0002-1823-9211' },
      { name: 'प्रो. सुनीता शिंदे', affiliation: 'सहायक प्राध्यापक, हिंदी विभाग, नागपुर विश्वविद्यालय', email: 'sunita.shinde@nagpur.ac.in', orcid: '0000-0001-5099-2810' }
    ],
    abstract_hindi: 'प्रस्तुत शोध पत्र में मध्य भारत के सतपुड़ा अंचल में बोली जाने वाली पवारी बोली की ध्वन्यात्मक एवं व्याकरणिक विशेषताओं का गहन भाषावैज्ञानिक विश्लेषण प्रस्तुत किया गया है। शोध में पाया गया कि पवारी में राजस्थानी, मराठी एवं मालवी भाषा-परिवार के तत्त्वों का सुंदर समन्वय है। अध्ययन में पवारी के विशिष्ट स्वर एवं व्यंजन ध्वनियों का आरेखीय एवं तुलनात्मक विवरण दिया गया है।',
    abstract_english: 'This research paper presents a comprehensive linguistic analysis of the phonetic and grammatical features of the Pawari dialect spoken across the Satpura plains of Central India. The study reveals a unique confluence of Indo-Aryan elements including Rajasthani, Marathi, and Malvi roots. The paper systematically documents the vowel inventory, phonemes, and tonal variations unique to Pawari.',
    keywords: ['पवारी बोली (Pawari Dialect)', 'ध्वनिविज्ञान (Phonetics)', 'भाषाविज्ञान (Linguistics)', 'सतपुड़ा अंचल (Satpura Region)', 'मध्य भारत (Central India)'],
    doi: '10.5281/zenodo.psp.2026.0101',
    pdf_url: SAMPLE_PDF_BLOB,
    pdf_storage_path: 'articles/art-001-pawari-phonetics.pdf',
    volume: 2,
    issue: 1,
    year: 2026,
    month: 'Jan - Jun 2026',
    category: 'Linguistics & Dialectology',
    language: 'Hindi',
    status: 'published',
    page_numbers: '01–14',
    content_mode: 'full_text',
    citation_text: 'Pawar, R., & Shinde, S. (2026). Origin, Evolution and Phonetic Characteristics of Pawari Dialect: A Linguistic Study. Pawari Shodh Patrika, 2(1), 01–14. https://doi.org/10.5281/zenodo.psp.2026.0101',
    date_received: '2026-02-10',
    date_revised: '2026-03-25',
    date_accepted: '2026-04-18',
    date_published: '2026-06-10',
    full_text_introduction: `१. प्रस्तावना (Introduction)
मध्य भारत का सतपुड़ा पर्वतमाला अंचल बहुसांस्कृतिक और बहुभाषी अंचल रहा है। इस क्षेत्र में बोली जाने वाली पवारी (पोवारी) बोली न केवल ऐतिहासिक दृष्टिकोण से समृद्ध है, बल्कि भाषावैज्ञानिक दृष्टि से भी अत्यंत रोचक संरचना प्रस्तुत करती है। पवार (परमार) राजवंश के धार एवं मालवा से दक्षिण-पूर्व की ओर पलायन के साथ इस बोली का बीजारोपण मध्य भारत के बालाघाट, सिवनी, गोंदिया तथा भंडारा जिलों में हुआ।

प्रस्तुत अध्ययन का मुख्य उद्देश्य पवारी की ध्वन्यात्मक संरचना, इसके विशिष्ट स्वरों तथा व्यंजनों की ध्वन्यात्मक पहचान और इसके निकटवर्ती भाषा-रूपों (मराठी, मालवी, बुंदेली) के साथ इसके तुलनात्मक अध्ययन को रेखांकित करना है।`,
    full_text_literature_review: `२. साहित्य अवलोकन (Literature Review)
भारतीय भाषावैज्ञानिक सर्वेक्षण (Linguistic Survey of India) में सर जॉर्ज ग्रियर्सन ने पवारी को राजस्थानी समूह की मालवी बोली की एक उप-शाखा के रूप में वर्गीकृत किया था। तत्पश्चात, डॉ. हरदेव बाहरी तथा डॉ. धीरेंद्र वर्मा ने मध्य भारत की बोलियों का पुनर्मूल्यांकन करते हुए इसे एक स्वतंत्र बोली के रूप में मान्यता देने की अनुशंसा की। हाल के दशकों में पवार (२०१५) तथा देशमुख (२०२०) के अध्ययनों ने पवारी पर मराठी व्याकरण तथा मालवी शब्दावली के द्विभाषी प्रभाव की पुष्टि की है।`,
    full_text_methodology: `३. अनुसंधान कार्यप्रणाली (Methodology)
इस भाषावैज्ञानिक अध्ययन हेतु वर्णनात्मक एवं तुलनात्मक भाषाविज्ञान विधि का प्रयोग किया गया है:
१. क्षेत्र-कार्य (Fieldwork): बालाघाट एवं गोंदिया जिले के २० ग्रामीण क्षेत्रों में ६० वक्ताओं (आयु वर्ग १८ से ७५ वर्ष) से ऑडियो-रिकॉर्डिंग एवं प्रत्यक्ष साक्षात्कार द्वारा सामग्री का संकलन।
२. अंतर्राष्ट्रीय ध्वन्यात्मक वर्णमाला (IPA): संकलित पवारी उच्चारणों को IPA प्रतीकों में लिप्यंतरित किया गया।
३. स्वर-यंत्र विश्लेषक उपकरण (Acoustic Phonetics): Praat सॉफ्टवेयर के माध्यम से फॉर्मेंट आवृत्तियों (F1, F2) का मापन कर पवारी स्वर त्रिकोण (Vowel Triangle) का निर्माण किया गया।`,
    full_text_results_discussion: `४. परिणाम एवं विश्लेषण (Results and Discussion)
४.१ स्वर ध्वनियाँ (Vowels):
पवारी में कुल १० शुद्ध स्वर ध्वनियाँ पाई जाती हैं: [a, ā, i, ī, u, ū, e, ai, o, au]। मालवी की भाँति इसमें अनुनासिक स्वरों का प्रचुर प्रयोग मिलता है (उदा. 'खाँओ', 'जाँओ')।

४.२ व्यंजन ध्वनियाँ (Consonants):
पवारी व्यंजन तालिका में ३४ व्यंजन ध्वनियाँ चिह्नित की गई हैं। इसमें 'ल' का मूर्धन्य रूप 'ळ' (L retroflex) तथा 'र' की मूर्धन्य अल्पप्राण ध्वनि बहुतायत से प्रयुक्त होती है।

४.३ प्रमुख ध्वन्यात्मक नियम (Phonetic Rules):
१. अकारान्त लोप (Schwa Syncope): शब्द के अंतिम स्वर का लोप होकर व्यंजनांत उच्चारण।
२. 'स' एवं 'ह' का विनिमय: कई स्थानीय वक्ताओं में 'स' ध्वनि 'ह' में परिवर्तित हो जाती है (उदा. 'सात' -> 'हात')।
३. संयुक्त व्यंजनों का सरलीकरण: तत्सम शब्दों के संयुक्त व्यंजनों में 'इ' या 'अ' का आगम करके सरल बनाया जाता है (उदा. 'स्त्री' -> 'इस्त्री')।`,
    full_text_conclusion: `५. निष्कर्ष (Conclusion)
पवारी बोली इंडो-आर्यन भाषा परिवार की एक अनूठी धरोहर है जो मालवी (राजस्थानी), बुंदेली एवं मराठी के संगम बिंदु पर विकसित हुई है। आधुनिक शिक्षा एवं वैश्वीकरण के कारण इसके मूल ध्वन्यात्मक स्वरूप में क्षरण देखा जा रहा है। इस शोध पत्र के माध्यम से पवारी के मानक भाषावैज्ञानिक दस्तावेजीकरण हेतु एक वैज्ञानिक आधार प्रस्तुत किया गया है।`,
    full_text_acknowledgement: `आभार: शोधकर्ता भाषाविज्ञान विभाग, बालाघाट एवं क्षेत्रीय पवारी लोकसाहित्य परिषद के प्रति अपना हार्दिक आभार व्यक्त करते हैं जिन्होंने क्षेत्र-कार्य में बहुमूल्य सहयोग प्रदान किया।`,
    full_text_conflict_of_interest: 'लेखक घोषणा करते हैं कि इस शोध कार्य में किसी भी प्रकार का हित-संघर्ष (Conflict of Interest) नहीं है।',
    full_text_funding: 'यह अध्ययन विश्वविद्यालय अनुदान आयोग (UGC) के लघु शोध अनुदान योजना के अंतर्गत आंशिक रूप से वित्तपोषित है।',
    references: [
      'Grierson, G. A. (1908). Linguistic Survey of India (Vol. IX, Indo-Aryan Family, Central Group). Office of the Superintendent of Government Printing, Calcutta.',
      'Pawar, R. (2015). Pawari Boli Ka Bhashavaigyanik Adhyayan. Shodh Sansthan Prakashan, Bhopal.',
      'Deshmukh, A. (2020). Folklife and Language Shift in Satpura Region. Journal of Central Indian Studies, 12(2), 45-62.',
      'Verma, D. (1972). Hindi Bhasha Ka Itihas. Hindustan Academy, Allahabad.'
    ],
    custom_sections: [
      {
        id: 'cs-01',
        type: 'quote',
        title: 'पवारी बोली कहावत (Traditional Pawari Proverb)',
        content: '"जैसी सतपुड़ा की धार, वैसी पवार की वाण।" (अर्थात: जिस प्रकार ताप्ती-सतपुड़ा अंचल निरंतर प्रवाहित होकर जीवन देता है, उसी प्रकार पवारी बोली अपनी सहजता और मिठास से समाज को बांधे रखती है।)'
      },
      {
        id: 'cs-fig-01',
        type: 'figure',
        title: 'Figure 1: Geographic Map of Pawari Speech Area',
        content: 'Geographic distribution of Pawari speakers in Satpura basin.',
        caption: 'चित्र १ / Figure 1: सतपुड़ा अंचल में पवारी बोलीभाषी क्षेत्र का भौगोलिक मानचित्र (Geographical map highlighting primary Pawari dialect clusters).',
        image_url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80',
        alt_text: 'Map of Satpura valley showing Pawari dialect distribution across Balaghat, Seoni, Chhindwara, and Gondia.',
        source_credit: 'Source: Author Fieldwork Survey & Central India Linguistic Atlas (2025)',
        figure_number: 1,
        placement: 'in_body'
      },
      {
        id: 'cs-fig-02',
        type: 'figure',
        title: 'Figure 2: Spectrogram & Formant Analysis',
        content: 'Acoustic phonetic spectrogram comparing Pawari retroflex sounds.',
        caption: 'चित्र २ / Figure 2: पवारी बोली के अनुनासिक स्वरों एवं मूर्द्धन्य ध्वनियों का स्पेक्ट्रोग्राम ध्वनि विश्लेषण (Acoustic spectrogram showing formant frequencies F1/F2).',
        image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        alt_text: 'Acoustic waveform graph showing sound frequency peaks in Pawari vocalic phonemes.',
        source_credit: 'Source: Phonetics Research Laboratory, Central Institute of Indian Languages',
        figure_number: 2,
        placement: 'at_end'
      }
    ],
    views_count: 342,
    downloads_count: 128,
    created_at: '2026-06-10',
    updated_at: '2026-06-15',
  },
  {
    id: 'art-002',
    title_hindi: 'सतपुड़ा अंचल के लोकगीतों में पवारी संस्कृति के विविध रंग',
    title_english: 'Diverse Shades of Pawari Culture in Folk Songs of Satpura Region',
    slug: 'diverse-shades-pawari-culture-folk-songs',
    authors: [
      { name: 'डॉ. अनिमेश देशमुख', affiliation: 'शोध निदेशक, लोकसाहित्य केंद्र, गोंदिया', email: 'animesh.d@folklore.org', is_corresponding: true }
    ],
    abstract_hindi: 'लोकगीत किसी भी समुदाय की आत्मा और सांस्कृतिक दर्पण होते हैं। पवारी समाज में जन्मोत्सव, विवाह, कृषि कार्य एवं पर्व-त्योहारों पर गाए जाने वाले लोकगीतों में जीवनदर्शन की गभीर अभिव्यक्तियाँ मिलती हैं। इस अध्ययन में बालाघाट और भंडारा जिले के 50 से अधिक पारंपरिक पवारी लोकगीतों का संकलन एवं सांस्कृतिक विश्लेषण किया गया है।',
    abstract_english: 'Folk music acts as the cultural repository of community heritage. In the Pawari community, traditional songs associated with agricultural cycles, wedding rituals, and seasonal festivals reflect profound folk wisdom. This paper documents over 50 authentic Pawari folk songs collected across Balaghat and Bhandara districts, categorizing their social and artistic motifs.',
    keywords: ['लोकगीत (Folk Songs)', 'पवारी संस्कृति (Pawari Culture)', 'कृषि लोकगाथा (Agricultural Folklore)', 'बालाघाट (Balaghat)', 'सांस्कृतिक अध्ययन (Cultural Studies)'],
    doi: '10.5281/zenodo.psp.2026.0102',
    pdf_url: SAMPLE_PDF_BLOB,
    pdf_storage_path: 'articles/art-002-pawari-culture.pdf',
    volume: 2,
    issue: 1,
    year: 2026,
    month: 'Jan - Jun 2026',
    category: 'Culture & Folk Literature',
    language: 'Hindi',
    status: 'published',
    page_numbers: '15–28',
    views_count: 289,
    downloads_count: 94,
    created_at: '2026-06-12',
    updated_at: '2026-06-15',
  },
  {
    id: 'art-003',
    title_hindi: 'मध्य भारत में सामाजिक-सांस्कृतिक पहचान एवं बोली संरक्षण: पवार समुदाय का विशेष अध्ययन',
    title_english: 'Socio-Cultural Identity and Preservation of Dialects in Central India: Special Reference to Powari Speaking Community',
    slug: 'socio-cultural-identity-preservation-powari-community',
    authors: [
      { name: 'Dr. Vijay K. Harinkhede', affiliation: 'Department of Sociology, Central University of Madhya Pradesh', email: 'v.harinkhede@cump.ac.in', is_corresponding: true },
      { name: 'Dr. Neha Bisen', affiliation: 'Research Fellow, ICSSR New Delhi', email: 'neha.bisen@icssr.org' }
    ],
    abstract_hindi: 'वैश्वीकरण के युग में क्षेत्रीय भाषाओं और जातियों की सांस्कृतिक पहचान के सामने कई चुनौतियाँ खड़ी हुई हैं। यह पत्र पवार समुदाय में बोली जाने वाली पवारी भाषा के संरक्षण के सामाजिक प्रयासों, डिजीटल माध्यमों तथा सामुदायिक पहल का मूल्याँकन करता है।',
    abstract_english: 'Globalization poses significant threats to endangered regional dialects and community identities. This research paper evaluates community-driven initiatives, digital archiving, and literary platforms established by the Powari speaking diaspora in Central India to safeguard their linguistic heritage against language shift.',
    keywords: ['Powari Community', 'Sociolinguistics', 'Cultural Preservation', 'Central India', 'Language Shift'],
    doi: '10.5281/zenodo.psp.2026.0103',
    pdf_url: SAMPLE_PDF_BLOB,
    pdf_storage_path: 'articles/art-003-powari-identity.pdf',
    volume: 2,
    issue: 1,
    year: 2026,
    month: 'Jan - Jun 2026',
    category: 'Social Sciences',
    language: 'English',
    status: 'published',
    page_numbers: '29–42',
    views_count: 410,
    downloads_count: 176,
    created_at: '2026-06-14',
    updated_at: '2026-06-15',
  },
  {
    id: 'art-004',
    title_hindi: 'पवारी लोककथाओं में पर्यावरणीय चेतना एवं सतपुड़ा अंचल का जैव-विविधता दर्शन',
    title_english: 'Environmental Consciousness and Ethno-Ecological Wisdom in Pawari Folktales',
    slug: 'environmental-consciousness-ethno-ecological-wisdom-pawari-folktales',
    authors: [
      { name: 'सविता बिसेन', affiliation: 'शोधार्थी, पर्यावरण एवं हिंदी साहित्य विभाग, छिंदवाड़ा विश्वविद्यालय', email: 'savita.bisen@chhindwara.ac.in', is_corresponding: true }
    ],
    abstract_hindi: 'पवारी लोककथाओं में प्रकृति, वनों, नदियों तथा वन्यजीवों के साथ मानव के घनिष्ठ संबंधों का चित्रांकन मिलता है। सतपुड़ा अंचल में प्रचलित पवारी दंतकथाओं के माध्यम से प्राकृतिक संसाधनों के विवेकपूर्ण उपयोग एवं संरक्षण की प्राचीन परंपरा का साक्ष्य प्राप्त होता है।',
    abstract_english: 'Ethno-ecological narratives embedded in Indigenous folklore offer key insights into sustainable living. This study analyzes oral storytelling traditions within the Pawari speaking belts of the Satpura region, illustrating ancient conservation ethics and human-nature harmony.',
    keywords: ['पर्यावरण साहित्य (Eco-Literature)', 'लोककथाएँ (Folktales)', 'सतपुड़ा अंचल (Satpura Region)', 'पारिस्थितिकी (Ecology)', 'पवारी बोली (Pawari)'],
    doi: '10.5281/zenodo.psp.2025.0201',
    pdf_url: SAMPLE_PDF_BLOB,
    pdf_storage_path: 'articles/art-004-eco-wisdom.pdf',
    volume: 1,
    issue: 2,
    year: 2025,
    month: 'Jul - Dec 2025',
    category: 'Environmental Humanities',
    language: 'Hindi',
    status: 'published',
    page_numbers: '01–16',
    views_count: 512,
    downloads_count: 205,
    created_at: '2025-12-15',
    updated_at: '2025-12-20',
  },
  {
    id: 'art-005',
    title_hindi: 'डिजिटल आर्काइविंग एवं पवारी शब्दावली का देवनागरी मानकीकरण',
    title_english: 'Digital Documentation and Devanagari Standardization of Pawari Vocabulary',
    slug: 'digital-documentation-devanagari-standardization-pawari-vocabulary',
    authors: [
      { name: 'Prof. Rajesh Kumar Tembhare', affiliation: 'Department of Computer Science & Humanities, NIT Nagpur', email: 'r.tembhare@nitn.ac.in', is_corresponding: true }
    ],
    abstract_hindi: 'डिजिटल युग में अलिखित बोलियों का संगणकीय प्रसंस्करण (Computational Processing) अत्यंत आवश्यक है। इस शोध पत्र में पवारी बोली के 5000+ मूल शब्दों का कोषीय डेटाबेस तैयार करने तथा देवनागरी लिपि में उनके मानकीकृत वर्तनी नियमों के निर्धारण की पद्धति साझा की गई है।',
    abstract_english: 'Computational linguistics plays a decisive role in archiving vulnerable dialects. This research outlines a digital lexicography framework developed to digitize and standardize 5,000+ core Pawari lexemes into Unicode Devanagari format for Natural Language Processing (NLP) applications.',
    keywords: ['Computational Linguistics', 'Digital Lexicography', 'Devanagari Unicode', 'NLP for Dialects', 'Pawari Dictionary'],
    doi: '10.5281/zenodo.psp.2025.0202',
    pdf_url: SAMPLE_PDF_BLOB,
    pdf_storage_path: 'articles/art-005-digital-lexicography.pdf',
    volume: 1,
    issue: 2,
    year: 2025,
    month: 'Jul - Dec 2025',
    category: 'Computational Linguistics',
    language: 'English',
    status: 'published',
    page_numbers: '17–32',
    views_count: 620,
    downloads_count: 280,
    created_at: '2025-12-18',
    updated_at: '2025-12-20',
  },
];

export const SAMPLE_EDITORIAL_BOARD: EditorialMember[] = [
  {
    id: 'ed-001',
    name_hindi: 'डॉ. बी. एल. पवार',
    name_english: 'Dr. B. L. Pawar',
    role: 'Patron',
    designation_hindi: 'संरक्षक एवं संस्थापक निदेशक',
    designation_english: 'Patron & Founder Director',
    affiliation_hindi: 'पवारी शोध एवं लोकसाहित्य संस्थान, मध्य प्रदेश',
    affiliation_english: 'Pawari Research & Folklore Institute, Madhya Pradesh',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    email: 'director@pawarishodh.org',
    research_areas: ['पवारी लोकसाहित्य (Pawari Folklore)', 'सांस्कृतिक नृविज्ञान (Cultural Anthropology)', 'क्षेत्रीय इतिहास (Regional History)'],
    order: 1,
  },
  {
    id: 'ed-002',
    name_hindi: 'प्रो. (डॉ.) रमाकांत शर्मा',
    name_english: 'Prof. (Dr.) Ramakant Sharma',
    role: 'Chief Editor',
    designation_hindi: 'मुख्य संपादक',
    designation_english: 'Chief Editor',
    affiliation_hindi: 'प्रोफेसर एवं पूर्व अध्यक्ष, भाषाविज्ञान एवं हिंदी विभाग, केंद्रीय विश्वविद्यालय',
    affiliation_english: 'Professor & Former Head, Dept. of Linguistics & Hindi, Central University',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    email: 'chiefeditor@pawarishodh.org',
    research_areas: ['भाषाविज्ञान (Linguistics)', 'तुलनात्मक साहित्य (Comparative Literature)', 'ध्वनिविज्ञान (Phonetics)'],
    order: 2,
  },
  {
    id: 'ed-003',
    name_hindi: 'डॉ. सीमा चौधरी',
    name_english: 'Dr. Seema Choudhary',
    role: 'Executive Editor',
    designation_hindi: 'कार्यकारी संपादक',
    designation_english: 'Executive Editor',
    affiliation_hindi: 'एसोसिएट प्रोफेसर, समाजशास्त्र विभाग, नागपुर',
    affiliation_english: 'Associate Professor, Department of Sociology, Nagpur',
    photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    email: 'executive@pawarishodh.org',
    research_areas: ['ग्रामीण समाजशास्त्र (Rural Sociology)', 'महिला अध्ययन (Gender Studies)', 'जनजातीय संस्कृति (Tribal Culture)'],
    order: 3,
  },
  {
    id: 'ed-004',
    name_hindi: 'डॉ. देवेंद्र हरिनखेड़े',
    name_english: 'Dr. Devendra Harinkhede',
    role: 'Managing Editor',
    designation_hindi: 'प्रबंध संपादक एवं अनुसंधान समन्वयक',
    designation_english: 'Managing Editor & Research Coordinator',
    affiliation_hindi: 'वरिष्ठ अनुसंधानकर्ता, पवारी शोध संस्थान, बालाघाट',
    affiliation_english: 'Senior Fellow, Pawari Shodh Sansthan, Balaghat',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    email: 'managing@pawarishodh.org',
    research_areas: ['डिजिटल आर्काइविंग (Digital Archiving)', 'लोकगीत संकलन (Folklore Collection)', 'शब्दावली निर्माण (Lexicography)'],
    order: 4,
  },
  {
    id: 'ed-005',
    name_hindi: 'प्रो. जॉन आर. मिलर',
    name_english: 'Prof. John R. Miller',
    role: 'Advisory Committee',
    designation_hindi: 'अंतर्राष्ट्रीय सलाहकार मंडल सदस्य',
    designation_english: 'International Advisory Board Member',
    affiliation_hindi: 'अंतर्राष्ट्रीय भाषाविज्ञान संघ एवं ओरिएंटल स्टडीज विभाग',
    affiliation_english: 'Department of Asian Languages & Dialectology, UK',
    photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    email: 'j.miller@linguistics-assoc.org',
    research_areas: ['Indo-Aryan Dialects', 'Language Documentation', 'Sociolinguistics'],
    order: 5,
  },
];

export const SAMPLE_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-001',
    title_hindi: 'शोध पत्र आमंत्रण: वर्ष 2, अंक 2 (दिसंबर 2026)',
    title_english: 'Call for Papers: Volume 2, Issue 2 (December 2026)',
    content_hindi: 'पवारी शोध पत्रिका के आगामी दिसंबर 2026 अंक हेतु मौलिक एवं अप्रकाशित शोध पत्र आमंत्रित हैं। पांडुलिपि भेजने की अंतिम तिथि 31 अक्टूबर 2026 है।',
    content_english: 'Manuscripts are invited for Volume 2, Issue 2 (Dec 2026). Authors are requested to submit papers by October 31, 2026 via our online guidelines.',
    date: '2026-07-20',
    is_important: true,
    is_active: true,
  },
  {
    id: 'ann-002',
    title_hindi: 'राष्ट्रीय संगोष्ठी: "सतपुड़ा अंचल की लोक बोलियाँ एवं डिजिटल युग"',
    title_english: 'National Symposium on Central Indian Dialects & Digital Age',
    content_hindi: 'पवारी शोध संस्थान द्वारा बालाघाट में 15-16 नवंबर 2026 को दो दिवसीय राष्ट्रीय संगोष्ठी का आयोजन किया जा रहा है।',
    content_english: 'A two-day national academic conference will be organized on November 15-16, 2026 focused on digital preservation of regional oral traditions.',
    date: '2026-07-10',
    is_important: false,
    is_active: true,
  },
  {
    id: 'ann-003',
    title_hindi: 'पवारी शोध पत्रिका को अंतर्राष्ट्रीय मानक अंक (ISSN Online) प्राप्त',
    title_english: 'Pawari Shodh Patrika Awarded ISSN 2583-9128 (Online)',
    content_hindi: 'अकादमिक जगत के लिए हर्ष का विषय है कि हमारी पत्रिका को नेशनल साइंस लाइब्रेरी (INSDOC) द्वारा अंतर्राष्ट्रीय मानक अंक प्रदान किया गया है।',
    content_english: 'We are pleased to inform that Pawari Shodh Patrika has been assigned ISSN 2583-9128 by the National ISSN Centre.',
    date: '2026-05-18',
    is_important: false,
    is_active: true,
  },
];

export const DEMO_USERS: UserProfile[] = [
  {
    uid: 'demo-rupesh-pawar-uid',
    email: 'rupeshpawar10@gmail.com',
    display_name: 'Prof. Rupesh Pawar (Chief Admin)',
    role: 'super_admin',
    status: 'active',
    created_at: '2026-01-01',
  },
  {
    uid: 'demo-superadmin-uid',
    email: 'superadmin@pawarishodh.org',
    display_name: 'Super Admin (मुख्य प्रशासक)',
    role: 'super_admin',
    status: 'active',
    created_at: '2026-01-01',
  },
  {
    uid: 'demo-director-uid',
    email: 'director@pawarishodh.org',
    display_name: 'Dr. B. L. Pawar (निदेशक/Patron)',
    role: 'director',
    status: 'active',
    created_at: '2026-01-01',
  },
  {
    uid: 'demo-editorial-uid',
    email: 'editorial@pawarishodh.org',
    display_name: 'Editorial Team (संपादकीय मंडल)',
    role: 'editorial',
    status: 'active',
    created_at: '2026-01-01',
  },
];
