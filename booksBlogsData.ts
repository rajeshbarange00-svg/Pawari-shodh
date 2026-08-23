export interface BookItem {
  id: string;
  title_hindi: string;
  title_english: string;
  authors: string;
  editor?: string;
  category: string;
  publisher: string;
  publication_year: number | string;
  pages: number;
  isbn: string;
  cover_image: string;
  price?: string;
  synopsis_hindi: string;
  synopsis_english: string;
  table_of_contents_hindi?: string[];
  sample_pdf_url?: string;
  is_featured?: boolean;
}

export interface BlogItem {
  id: string;
  title_hindi: string;
  title_english: string;
  author: string;
  author_role?: string;
  author_avatar?: string;
  date: string;
  read_time: string;
  category: string;
  cover_image: string;
  pdf_url?: string;
  excerpt_hindi: string;
  excerpt_english: string;
  content_hindi: string;
  content_english: string;
  tags: string[];
  likes_count?: number;
}

export const SAMPLE_BOOKS: BookItem[] = [
  {
    id: 'book-1',
    title_hindi: 'पवारी बोली एवं लोकसाहित्य का प्रामाणिक इतिहास',
    title_english: 'An Authentic History of Pawari Dialect & Folklore',
    authors: 'डॉ. कैलाश पवार एवं प्रो. रामेश्वर शर्मा',
    category: 'भाषाविज्ञान एवं लोकसाहित्य',
    publisher: 'माँ ताप्ती शोध संस्थान, मुलताई',
    publication_year: 2025,
    pages: 384,
    isbn: '978-81-954321-0-1',
    cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    price: '₹ 450 (Free Open PDF)',
    is_featured: true,
    synopsis_hindi: 'बैतूल, छिंदवाड़ा, सिवनी एवं वर्धा-नागपुर सीमावर्ती अंचल में बोली जाने वाली पवारी बोली के उद्भव, विकास, ध्वनिविज्ञान, व्याकरण तथा समृद्ध मौखिक लोकपरंपराओं का विस्तृत प्रामाणिक इतिहास। इसमें पवारी के ऐतिहासिक ग्रंथों तथा मौखिक लोककथाओं का वैज्ञानिक विश्लेषण प्रस्तुत किया गया है।',
    synopsis_english: 'A comprehensive authentic history of the origin, development, phonology, grammar, and oral traditions of the Pawari dialect spoken across Betul, Chhindwara, Seoni, and Nagpur regions.',
    table_of_contents_hindi: [
      'अध्याय 1: पवारी बोली का ऐतिहासिक एवं भौगोलिक परिचय',
      'अध्याय 2: पवारी का ध्वनिविज्ञान एवं पद-संरचना',
      'अध्याय 3: पवारी लोकगीत: प्रकार एवं सामाजिक चेतना',
      'अध्याय 4: पवारी लोककथाएं एवं मौखिक परंपराएं',
      'अध्याय 5: पवारी शब्दावली एवं अन्य बोलियों से संबंध'
    ]
  },
  {
    id: 'book-2',
    title_hindi: 'मध्य भारत की लोकसंस्कृति और ताप्ती अंचल',
    title_english: 'Folklore & Culture of Central India & Tapti Region',
    authors: 'डॉ. अनिता मालवीय एवं प्रो. संतराम चौधरी',
    category: 'संस्कृति एवं मानविकी',
    publisher: 'माँ ताप्ती शोध संस्थान, मुलताई',
    publication_year: 2024,
    pages: 290,
    isbn: '978-81-954321-1-8',
    cover_image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    price: '₹ 380',
    is_featured: true,
    synopsis_hindi: 'ताप्ती नदी घाटी सभ्यता, पवारी लोकगीत, लोकनृत्य, पर्व-त्योहारों तथा जनजातीय-लोक चेतना का समाजशास्त्रीय अध्ययन। ताप्ती के उद्गम स्थल मुलताई से लेकर सीमावर्ती अंचलों की सांस्कृतिक धरोहर का सचित्र प्रामाणिक संकलन।',
    synopsis_english: 'A sociological study of Tapti river valley civilization, Pawari folk songs, folk dances, festivals, and tribal-folk consciousness in Central India.',
    table_of_contents_hindi: [
      'अध्याय 1: ताप्ती घाटी सभ्यता एवं लोक जीवन',
      'अध्याय 2: मुलताई अंचल के प्रमुख लोक पर्व एवं मेले',
      'अध्याय 3: लोकवाद्य, लोकनृत्य एवं नाट्य परंपराएं',
      'अध्याय 4: जनजातीय संस्कृति एवं पवारी लोक समन्वय'
    ]
  },
  {
    id: 'book-3',
    title_hindi: 'पवारी - हिंदी - अंग्रेजी बृहत् त्रिभाषीय शब्दकोश',
    title_english: 'Comprehensive Pawari-Hindi-English Dictionary',
    authors: 'मुख्य संपादक: डॉ. बी. एल. पवार, सह-संपादक: डॉ. रेखा मुदगल',
    category: 'कोष ग्रंथ (Lexicography)',
    publisher: 'माँ ताप्ती शोध संस्थान',
    publication_year: 2025,
    pages: 520,
    isbn: '978-81-954321-2-5',
    cover_image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
    price: '₹ 650',
    is_featured: false,
    synopsis_hindi: '15,000 से अधिक पवारी शब्दों का प्रामाणिक अर्थ, व्युत्पत्ति, मुहावरे, कहावतें एवं उनका हिंदी तथा अंग्रेजी में सटीक अनुवाद। भाषाविदों, शोधार्थियों एवं विद्यार्थियों के लिए अमूल्य संदर्भ ग्रंथ।',
    synopsis_english: 'A landmark dictionary featuring over 15,000 Pawari entries with authentic meanings, etymology, idioms, and precise translations in Hindi and English.',
    table_of_contents_hindi: [
      'भाग 1: पवारी वर्णमाला एवं उच्चारण निर्देश',
      'भाग 2: शब्दकोश (पवारी से हिंदी एवं अंग्रेजी)',
      'भाग 3: पवारी मुहावरे एवं कहावतें',
      'भाग 4: पारिभाषिक लोक-शब्दावली'
    ]
  },
  {
    id: 'book-4',
    title_hindi: 'पवारी लोकगाथाएं और मौखिक परंपरा',
    title_english: 'Pawari Folk Ballads & Oral Traditions',
    authors: 'रामनाथ पवार "सरस"',
    category: 'मौखिक साहित्य',
    publisher: 'माँ ताप्ती शोध संस्थान',
    publication_year: 2023,
    pages: 240,
    isbn: '978-81-954321-3-2',
    cover_image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80',
    price: '₹ 300',
    is_featured: false,
    synopsis_hindi: 'सदियों से मौखिक रूप से गाई जाने वाली पवारी लोकगाथाओं, भरथरी, आल्हा एवं लोकगीतों का वैज्ञानिक संकलन। इसमें लोकगाथाओं का पवारी मूल पाठ एवं हिंदी भावार्थ संगृहीत है।',
    synopsis_english: 'Scientific compilation of traditional oral Pawari folk ballads, epic songs, and narratives preserved over centuries in Central India.',
    table_of_contents_hindi: [
      'अध्याय 1: लोकगाथा का स्वरूप और वर्गीकरण',
      'अध्याय 2: पवारी आल्हा एवं बीरगाथाएं',
      'अध्याय 3: भक्ति एवं सामाजिक लोकगाथाएं'
    ]
  },
  {
    id: 'book-rajesh-001',
    title_hindi: 'क्षत्रिय पवार (72 गोत्र): मालवा से सतपुड़ा तक की ऐतिहासिक यात्रा',
    title_english: 'Kshatriya Pawar (72 Clan): Journey from Malwa to Satpura',
    authors: 'राजेश बारंगे पवार',
    category: 'इतिहास एवं वंशावली',
    publisher: 'माँ ताप्ती शोध संस्थान, मुलताई',
    publication_year: 2025,
    pages: 320,
    isbn: '978-93-88214-01-5',
    cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    price: 'Open Access / निःशुल्क PDF',
    is_featured: true,
    synopsis_hindi: 'पवार (भोयर पवार) समुदाय के मालवा से सतपुड़ा अंचल (बैतूल, छिंदवाड़ा, सौंसर, पांढुर्ना, बालाघाट) तक के प्रवास, भंवरगढ़ किले के इतिहास और 72 क्षत्रिय गोत्रों के उत्पत्ति इतिहास का संपूर्ण नृवंशशास्त्रीय एवं ऐतिहासिक ग्रंथ।',
    synopsis_english: 'Comprehensive monograph documenting the migration of the Pawar community from Malwa to the Satpura region and the history of the 72 gotras.',
    table_of_contents_hindi: [
      'अध्याय 1: मालवा मा परमार राजवंश एवं प्रवास',
      'अध्याय 2: भंवरगढ़ (भोयरगढ़) किला एवं भोयर नामकरण',
      'अध्याय 3: 72 क्षत्रिय गोत्रों का वर्गीकरण (सूर्यवंश, चंद्रवंश, अग्निवंश, ऋषिवंश)',
      'अध्याय 4: बाही वंशावली पोथी साक्ष्य',
      'अध्याय 5: बैतूल, छिंदवाड़ा, सौंसर एवं वर्धा कछार विस्तार'
    ]
  },
  {
    id: 'book-rajesh-002',
    title_hindi: 'पवारी (भोयरी) भाषा एवं पहेली लोकसाहित्य का महत्व',
    title_english: 'Importance of Pawari Language & Traditional Riddle Folklore',
    authors: 'राजेश बारंगे पवार',
    category: 'भाषाविज्ञान एवं लोकसाहित्य',
    publisher: 'माँ ताप्ती शोध संस्थान, मुलताई',
    publication_year: 2025,
    pages: 260,
    isbn: '978-93-88214-02-2',
    cover_image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    price: 'Open Access / निःशुल्क PDF',
    is_featured: true,
    synopsis_hindi: 'सतपुड़ा अंचल की पवारी (भोयरी) भाषा की व्याकरणिक बनावट, पारम्परिक बुझौवलों (पहेलियों) और लोक कहावतों का भाषावैज्ञानिक प्रलेखन।',
    synopsis_english: 'Linguistic documentation of Pawari dialect grammar, traditional riddles (paheli), and oral proverb folklore.',
    table_of_contents_hindi: [
      'अध्याय 1: पवारी भाषा की व्याकरणिक संरचना',
      'अध्याय 2: पवारी बुझौवल (पहेली) का सामाजिक महत्व',
      'अध्याय 3: लोकगीत एवं मौखिक साहित्य'
    ]
  },
  {
    id: 'book-classic-001',
    title_hindi: 'पवार कुल दर्शन (1984, भाग 1)',
    title_english: 'Pawar Kul Darshan (1984, Vol. 1)',
    authors: 'कृष्णराव बालाजी पवार (ठाणे-गांव)',
    category: 'ऐतिहासिक वंशावली एवं कुलदर्शन',
    publisher: 'पवार कुलदर्शन समिति, ठाणे-गांव / बैतूल',
    publication_year: 1984,
    pages: 340,
    isbn: 'HIST-1984-PKD-01',
    cover_image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80',
    price: 'संरक्षित ऐतिहासिक ग्रन्थ / Archive.org PDF',
    is_featured: true,
    synopsis_hindi: 'सन् 1984 का सुप्रसिद्ध ऐतिहासिक संदर्भ ग्रन्थ जिसमें पवार/भोयर पवार समाज के 72 गोत्रों, मालवा के परमार राजवंश से संबंध, और बैतूल-छिंदवाड़ा अंचल में वंशावली पोथी साक्ष्यों का प्रथम प्रामाणिक संकलन किया गया था।',
    synopsis_english: 'Historic 1984 landmark monograph providing the foundational documentation of the 72 Gotras and Parmar Kshatriya ancestry of the Pawar community.',
    table_of_contents_hindi: [
      'भाग 1: परमार राजवंश एवं भंवरगढ़ किला प्रवास',
      'भाग 2: 72 गोत्रों एवं कुलनामों का प्रामाणिक विवरण',
      'भाग 3: बैतूल-छिंदवाड़ा-नागपुर क्षेत्र में वंशावली पोथी साक्ष्य'
    ]
  },
  {
    id: 'book-classic-002',
    title_hindi: 'भोयर पवार का इतिहास',
    title_english: 'History of the Bhoyar Pawar Community',
    authors: 'पन्नालाल जी टेंभरे',
    category: 'इतिहास एवं नृवंशशास्त्र',
    publisher: 'लोक इतिहास परिषद, वर्धा / बैतूल',
    publication_year: 1996,
    pages: 280,
    isbn: 'HIST-1996-BPI-02',
    cover_image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80',
    price: 'संरक्षित ऐतिहासिक ग्रन्थ / Archive.org PDF',
    is_featured: false,
    synopsis_hindi: 'पवार (भोयर पवार) समुदाय के मालवा से मध्य भारत (बैतूल, छिंदवाड़ा, वर्धा) प्रवास, कृषि संस्कृति, और सामाजिक संगठन का प्रामाणिक ऐतिहासिक एवं नृवंशशास्त्रीय अध्ययन।',
    synopsis_english: 'Classic historical work exploring the heritage, agricultural traditions, and genealogical logs of the Bhoyar Pawar community in Central India.',
    table_of_contents_hindi: [
      'अध्याय 1: मालवा से सतपुड़ा प्रवास मार्ग',
      'अध्याय 2: कृषक समाज एवं 72 गोत्र संगठन',
      'अध्याय 3: वर्धा-ताप्ती कछार में सामाजिक संरचना'
    ]
  },
  {
    id: 'book-classic-003',
    title_hindi: 'पवारी ज्ञानदीप: पवारी (भोयरी) भाषा एवं लोकसाहित्य कोश',
    title_english: 'Pawari Gyandeep: Pawari Dialect & Folklore Dictionary',
    authors: 'डी. बी. टेंभरे',
    category: 'भाषाविज्ञान एवं लोककोश',
    publisher: 'झाड़ीपट्टी पवारी शोध परिषद, भंडारा / बैतूल',
    publication_year: 2004,
    pages: 310,
    isbn: 'HIST-2004-PGD-03',
    cover_image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
    price: 'संरक्षित ऐतिहासिक ग्रन्थ / Archive.org PDF',
    is_featured: false,
    synopsis_hindi: 'झाड़ीपट्टी एवं सतपुड़ा अंचल की पवारी (भोयरी) भाषा के 2000+ शब्दों, लोक कहावतों, और पारंपरिक पहेलियों (बुझौवलों) का वृहद लोक साहित्य ग्रन्थ।',
    synopsis_english: 'Comprehensive vocabulary and folklore lexicon documenting over 2000 Pawari dialect words, traditional proverbs, and folk riddles.',
    table_of_contents_hindi: [
      'अध्याय 1: पवारी व्याकरण एवं शब्दकोश',
      'अध्याय 2: पवारी कहावतें (लोकगाथा)',
      'अध्याय 3: पवारी बुझौवल (पहेलियाँ) एवं लोकगीत'
    ]
  }
];

export const SAMPLE_BLOGS: BlogItem[] = [
  {
    id: 'blog-1',
    title_hindi: 'पवारी बोली का उद्भव और मध्य प्रदेश के सीमावर्ती क्षेत्रों में इसका ऐतिहासिक प्रसार',
    title_english: 'Origin of Pawari Dialect and its Historical Spread in Border Regions of MP',
    author: 'डॉ. कैलाश पवार',
    author_role: 'वरिष्ठ भाषाविद् एवं शोध निदेशक',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    date: '15 जनवरी 2026',
    read_time: '6 मिनट',
    category: 'भाषाविज्ञान',
    cover_image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80',
    excerpt_hindi: 'पवारी बोली मालवी, बुंदेली और मराठी के संगम स्थल पर विकसित एक समृद्ध बोली है। मध्य प्रदेश के बैतूल, छिंदवाड़ा तथा महाराष्ट्र के नागपुर, गोंदिया, वर्धा जिलों में फैली इस बोली का अपना विशिष्ट व्याकरण और शब्दावली है।',
    excerpt_english: 'Pawari dialect developed at the confluence of Malvi, Bundeli, and Marathi. Spanning Betul, Chhindwara, Nagpur, and Gondia, it possesses unique grammar and vocabulary.',
    content_hindi: `
### पवारी बोली की ऐतिहासिक पृष्ठभूमि
पवारी बोली केवल एक अभिव्यक्ति का माध्यम नहीं, बल्कि मध्य भारत के एक बड़े अंचल की सांस्कृतिक पहचान है। ऐतिहासिक दृष्टि से पवार (पवार/परमार) राजपूतों के मालवा से दक्षिण-पूर्व की ओर पलायन के साथ इस बोली का प्रसार हुआ।

### ध्वन्यात्मक एवं व्याकरणिक विशेषताएं
1. **स्वर एवं व्यञ्जन:** पवारी में मालवी की भांति स्वरों में संवृत्तता पाई जाती है, जबकि मराठी के संपर्क से इसमें लिंग भेद एवं क्रिया रूप में विशेष लचीलापन दिखता है।
2. **कारक चिह्न:** पवारी में कारक चिह्नों का प्रयोग अत्यंत रोचक है। जैसे 'को' के लिए 'ले' या 'का' के लिए 'ना/नी' का प्रयोग।
3. **क्रिया पद:** क्रिया पदों में काल एवं पुरुष के अनुसार स्पष्ट प्रत्यय जुड़ते हैं।

### वर्तमान में संरक्षण के प्रयास
आज के डिजिटल युग में पवारी शोध पत्रिका तथा माँ ताप्ती शोध संस्थान द्वारा पवारी शब्दावली के संकलन और डिजिटलीकरण का कार्य तीव्र गति से किया जा रहा है।
    `,
    content_english: `
### Historical Background of Pawari
Pawari dialect represents the cultural identity of a vast belt in Central India. Historically, as Parmar/Pawar communities migrated from Malwa towards South-East MP and Vidarbha, Pawari naturally integrated features of Malvi, Bundeli, and Marathi.
    `,
    tags: ['पवारी बोली', 'भाषाविज्ञान', 'मालवी-मराठी संगम', 'बैतूल-छिंदवाड़ा'],
    likes_count: 42
  },
  {
    id: 'blog-2',
    title_hindi: 'ताप्ती नदी तट की लोक परंपराएं एवं भाद्रपद मास के लोक उत्सव',
    title_english: 'Folk Traditions Along Tapti River & Bhadrapada Festivals',
    author: 'डॉ. अनिता मालवीय',
    author_role: 'लोकसंस्कृति अध्येता',
    author_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    date: '28 दिसंबर 2025',
    read_time: '8 मिनट',
    category: 'लोकसंस्कृति',
    cover_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    excerpt_hindi: 'मुलताई (मूलताप्ती) से प्रस्फुटित होने वाली पवित्र ताप्ती नदी केवल एक जलधारा नहीं, अपितु लोकजीवन की सांस्कृतिक चेतना है। भाद्रपद मास में मनाए जाने वाले भुजरिया उत्सव और पवारी लोक नृत्यों की ऐतिहासिकता।',
    excerpt_english: 'Originating from Multai, River Tapti is the lifeline of cultural consciousness. Exploring the Bhujariya festival and Pawari folk traditions during Bhadrapada month.',
    content_hindi: `
### माँ ताप्ती और लोक चेतना
मुलताई स्थित ताप्ती सरोवर से सूर्यपुत्री ताप्ती का उद्गम होता है। इस अंचल के पवारी समाज में ताप्ती को माँ का दर्जा प्राप्त है। प्रत्येक मांगलिक अवसर पर ताप्ती मां की स्तुति एवं लोकगीत गाए जाते हैं।

### भुजरिया एवं लोक पर्व
भाद्रपद मास में भुजरिया (गेहूं के अंकुर) विसर्जन का पर्व सद्भाव और भाईचारे का प्रतीक है। इस अवसर पर पवारी बोली में बधाई एवं फाग शैली के गीत गाए जाते हैं।
    `,
    content_english: `
### Mother Tapti and Folk Consciousness
River Tapti originates at Multai. In the Pawari society of this region, Tapti holds the revered status of Mother. During Bhadrapada festivals, Wheat sprouts (Bhujariya) are immersed with devotional Pawari folk songs.
    `,
    tags: ['ताप्ती नदी', 'मुलताई', 'लोक उत्सव', 'भुजरिया', 'पवारी संस्कृति'],
    likes_count: 38
  },
  {
    id: 'blog-3',
    title_hindi: 'डिजिटल युग में मौखिक लोकसाहित्य का संरक्षण: चुनौतियां और अवसर',
    title_english: 'Preserving Oral Folklore in Digital Era: Challenges & Opportunities',
    author: 'प्रो. रामेश्वर शर्मा',
    author_role: 'संपादक, पवारी शोध पत्रिका',
    author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    date: '10 नवंबर 2025',
    read_time: '5 मिनट',
    category: 'डिजिटल मानविकी',
    cover_image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&auto=format&fit=crop&q=80',
    excerpt_hindi: 'वर्तमान तीव्र गति से बदलते परिवेश में ग्रामीण अंचलों के वयोवृद्ध लोकगायकों एवं कथावाचकों की मौखिक परंपराओं को डिजिटल प्लेटफॉर्म्स और ऑडियो-वीडियो अभिलेखागार में सहेजना समय की महती आवश्यकता है।',
    excerpt_english: 'In today’s rapidly changing environment, archiving oral folk songs and stories from veteran rural bards into digital audio-video repositories is urgent.',
    content_hindi: `
### मौखिक साहित्य के विलुप्त होने का खतरा
ग्रामीण क्षेत्रों में शहरीकरण और डिजिटल मीडिया के प्रसार से नई पीढ़ी मौखिक गाथाओं से दूर हो रही है। कई प्राचीन पवारी लोकगीत केवल वरिष्ठ बुजुर्गों की स्मृति में जीवित हैं।

### डिजिटल मानविकी की भूमिका
1. **ऑडियो रिकॉर्डिंग एवं डिजिटल आर्काइविंग:** गांवों में जाकर लोक गायकों की रिकॉर्डिंग।
2. **अंतर्राष्ट्रीय इंडेक्सिंग:** पवारी लोकसाहित्य को अंतर्राष्ट्रीय डिजिटल प्लेटफार्मों पर उपलब्ध कराना।
    `,
    content_english: `
### Role of Digital Humanities
Creating open-access audio archives and publishing annotated folk manuscripts ensures that regional dialects like Pawari reach researchers worldwide.
    `,
    tags: ['डिजिटल मानविकी', 'लोक साहित्य', 'संरक्षण', 'ऑडियो रिकॉर्डिंग'],
    likes_count: 51
  },
  {
    id: 'blog-4',
    title_hindi: 'पुस्तक समीक्षा: "सतपुड़ा के लोकदेवता और अनुष्ठान" (लेखक: सुरेश देशमुख)',
    title_english: 'Book Review: "Folk Deities & Rituals of Satpura" by Suresh Deshmukh',
    author: 'डॉ. अरविंद जोशी',
    author_role: 'समीक्षक एवं शोध विद्वान',
    author_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    date: '02 फरवरी 2026',
    read_time: '4 मिनट',
    category: 'पुस्तक समीक्षा',
    cover_image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&auto=format&fit=crop&q=80',
    excerpt_hindi: 'यह पुस्तक मध्य भारत की जनजातीय एवं लोकदेवता परंपरा पर एक अत्यंत गंभीर और दस्तावेजी कार्य है। लेखक ने सतपुड़ा की घाटियों में प्रचलित लोकदेवता मेघनाथ, मुठवा तथा खण्डोबा अनुष्ठानों का सूक्ष्म अध्ययन किया है।',
    excerpt_english: 'This book is an in-depth documented work on tribal and folk deity traditions in Central India, capturing Meghnath, Muthwa, and Khandoba rituals.',
    content_hindi: `
### पुस्तक समीक्षा निष्कर्ष
सुरेश देशमुख जी की यह कृति पवारी एवं सतपुड़ा अंचल की लोक मान्यता-अनुष्ठानों को समझने के लिए अनिवार्य ग्रन्थ है। पुस्तक में प्रचुर मात्रा में दुर्लभ रेखाचित्र और चित्र शामिल हैं।
    `,
    content_english: `
### Review Conclusion
Suresh Deshmukh’s work provides an indispensable guide for understanding Pawari and Satpura folk rituals. Highly recommended for researchers of mythology and anthropology.
    `,
    tags: ['पुस्तक समीक्षा', 'सतपुड़ा लोकदेवता', 'अनुष्ठान', 'संस्कृति'],
    likes_count: 29
  },
  {
    id: 'blog-rajesh-001',
    title_hindi: 'पवार/भोयर पवार जाति के 72 गोत्रों एवं उनके कुलनाम अपभ्रंश का इतिहास',
    title_english: 'History of the 72 Gotras and Surname Alterations of the Pawar Community',
    author: 'राजेश बारंगे पवार',
    author_role: 'संस्थापक एवं निदेशक, माँ ताप्ती शोध संस्थान',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    date: '12 फरवरी 2026',
    read_time: '7 मिनट',
    category: 'संस्कृति व परंपरा',
    cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    excerpt_hindi: 'मालवा में मुग़ल काल के दौरान परमार, चौहान, सोलंकी, परिहार और गहलोत क्षत्रिय कुलों के मालवा से बैतूल अंचल में प्रवास और भंवरगढ़ किले में "भोयर" नामकरण का प्रामाणिक इतिहास।',
    excerpt_english: 'Tracing the migration of Parmar, Chauhan, Solanki, and Parihar Kshatriya clans from Malwa to Bhawargarh Fort in Betul and the 72 gotra origin.',
    content_hindi: `
### मालवा से सतपुड़ा अंचल तक प्रवास
पवार (भोयर पवार) समुदाय का इतिहास मालवा के परमार राजवंश एवं १६वीं शताब्दी के प्रवास से जुड़ा है। मुग़लकाल में मालवा से बैतूल अंचल में आगमन कर भंवरगढ़ (भोयरगढ़) किले में निवास करने से इस समुदाय को स्थानीय रूप से 'भोयर' नाम मिला।

### ७२ गोत्रों का वर्गीकरण
इस संघ में सूर्यवंशी (राठौर, कुशवाहा, गहलोत), चंद्रवंशी (तोमर, भाटी), अग्निवंशी (परमार, चौहान, सोलंकी, परिहार) तथा ऋषिवंशी (चावड़ा, जेठवा) कुल शामिल हैं। बाही पोथी वंशावली अभिलेखों में इन सभी गोत्रों का सूक्ष्म विवरण सुरक्षित है।
    `,
    content_english: `
### Migration from Malwa to Satpura
The Pawar (Bhoyar Pawar) history is tied to Parmar Kshatriya lineage. Moving from Malwa to Bhawargarh fort in Betul during Mughal rule led to the 'Bhoyar' denomination.
    `,
    tags: ['72 गोत्र', 'पवार समाज', 'मालवा प्रवास', 'भंवरगढ़', 'वंशावली'],
    likes_count: 67
  }
];
