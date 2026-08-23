import { QuizQuestion, QuizCategoryType, PawariShabdkoshItem, PawariPaheliItem } from '../types';

export interface QuizCategoryMeta {
  id: QuizCategoryType;
  title_hindi: string;
  title_english: string;
  description_hindi: string;
  description_english: string;
  icon: string;
  color: string;
  bg_gradient: string;
  default_count: number;
}

export const QUIZ_CATEGORIES: Record<string, QuizCategoryMeta> = {
  shabdkosh: {
    id: 'shabdkosh',
    title_hindi: 'पवारी शब्दकोश व मुहावरे',
    title_english: 'Pawari Shabdkosh & Idioms',
    description_hindi: 'पारंपरिक पवारी शब्दावली, पर्यायवाची, मुहावरे एवं कहावतें',
    description_english: 'Traditional Pawari lexicon, synonyms, proverbs, and colloquial idioms',
    icon: 'BookOpen',
    color: 'text-amber-700',
    bg_gradient: 'from-amber-500/10 to-amber-500/5',
    default_count: 3
  },
  paheli: {
    id: 'paheli',
    title_hindi: 'पवारी पारम्परिक पहेलियाँ',
    title_english: 'Pawari Riddles (Paheli)',
    description_hindi: 'लोक पहेलियाँ, बुझौवल, आलंकारिक बिंब एवं लोक प्रतीक',
    description_english: 'Traditional folklore riddles, metaphors, and cultural wordplays',
    icon: 'HelpCircle',
    color: 'text-emerald-700',
    bg_gradient: 'from-emerald-500/10 to-emerald-500/5',
    default_count: 2
  },
  lokgeet: {
    id: 'lokgeet',
    title_hindi: 'पवारी लोकगीत व लोकगाथाएं',
    title_english: 'Pawari Lokgeet & Oral Ballads',
    description_hindi: 'मांगलिक विवाह गीत, भुजरिया, फाग, बधावा एवं ताप्ती महिमा',
    description_english: 'Traditional wedding songs, Bhujariya, seasonal Fag, and devotional folklore',
    icon: 'Music',
    color: 'text-rose-700',
    bg_gradient: 'from-rose-500/10 to-rose-500/5',
    default_count: 2
  },
  books: {
    id: 'books',
    title_hindi: 'पवारी ग्रन्थ व साहित्य',
    title_english: 'Pawari Books & Publications',
    description_hindi: 'शोध ग्रन्थ, पवारी इतिहास, व्याकरण, कोश ग्रन्थ व रचनाएं',
    description_english: 'Research treatises, Pawari history, grammar, and literature archives',
    icon: 'Library',
    color: 'text-blue-700',
    bg_gradient: 'from-blue-500/10 to-blue-500/5',
    default_count: 1
  },
  reviews: {
    id: 'reviews',
    title_hindi: 'शोध समालोचना व समीक्षाएं',
    title_english: 'Research Reviews & Critical Analysis',
    description_hindi: 'भाषाशास्त्रीय विश्लेषण, डिजिटल संरक्षण, शोध आलेख व समीक्षा',
    description_english: 'Linguistic discourse, digital humanities, and peer research critiques',
    icon: 'FileText',
    color: 'text-indigo-700',
    bg_gradient: 'from-indigo-500/10 to-indigo-500/5',
    default_count: 1
  },
  general: {
    id: 'general',
    title_hindi: 'पवारी भोयरी संस्कृति व धरोहर',
    title_english: 'General Cultural Heritage & Geography',
    description_hindi: 'ताप्ती उद्गम मुलताई, सतपुड़ा अंचल, रीति-रिवाज, लोकपर्व व इतिहास',
    description_english: 'Tapti origin Multai, Satpura geography, traditional customs, and festivals',
    icon: 'Sparkles',
    color: 'text-purple-700',
    bg_gradient: 'from-purple-500/10 to-purple-500/5',
    default_count: 1
  }
};

export const MASTER_QUESTION_BANK: QuizQuestion[] = [
  // ==================== 1. SHABDKOSH (पवारी शब्दकोश व मुहावरे) ====================
  {
    id: 'sbk-1',
    section_type: 'shabdkosh',
    question_pawari: 'पवारी बोली मा "डोरा" शब्द का सही अर्थ का होत है?',
    question_hindi: 'पवारी बोली में "डोरा" शब्द का सही अर्थ क्या होता है?',
    options: ['आंख / नेत्र (Eye)', 'सिलाई का धागा (Thread)', 'घर का दरवाजा (Door)', 'हाथ की उंगली (Finger)'],
    correct_option_index: 0,
    explanation: 'पवारी बोली में "डोरा" आंख (Eye) को कहा जाता है। उदाहरण: "डोरा मा कछु गिर गयो।"',
    cultural_notes: 'पवारी शब्दकोश (अध्याय: अंग-प्रत्यंग शब्दावली)'
  },
  {
    id: 'sbk-2',
    section_type: 'shabdkosh',
    question_pawari: 'पवारी बोली मा माता जी / माँ के ले कौन सो आदरसूचक शब्द प्रयोग करल जात है?',
    question_hindi: 'पवारी भाषा में माता जी (Mother) के लिए कौन सा आदरसूचक शब्द प्रयुक्त होता है?',
    options: ['आवो / माय (Mother)', 'काकी (Aunt)', 'जीजी (Elder Sister)', 'मामी (Maternal Aunt)'],
    correct_option_index: 0,
    explanation: 'पवारी बोली में माता को अत्यधिक आदर से "आवो" या "माय" संबोधित किया जाता है।',
    cultural_notes: 'पवारी पारिवारिक संबंध शब्दावली'
  },
  {
    id: 'sbk-3',
    section_type: 'shabdkosh',
    question_pawari: 'पवारी बोली मा ज्वार या गेहूं की पारंपरिक रोटी को का कहल जात है?',
    question_hindi: 'पवारी बोली में अनाज की पारंपरिक रोटी को सामान्यतः क्या कहा जाता है?',
    options: ['भाकर / रोटी (Flatbread / Roti)', 'चावल (Rice)', 'लापसी (Lapsi Sweet)', 'खीर (Pudding)'],
    correct_option_index: 0,
    explanation: 'पवारी अंचल में चूल्हे पर सिकी मोटी स्वादिष्ट रोटी को "भाकर" कहा जाता है।',
    cultural_notes: 'पवारी खान-पान एवं रसोई शब्दावली'
  },
  {
    id: 'sbk-4',
    section_type: 'shabdkosh',
    question_pawari: 'पवारी बोली मा "धुपला" शब्द का प्रयोग किस वस्तु ले होत है?',
    question_hindi: 'पवारी में "धुपला" शब्द का क्या अर्थ है?',
    options: ['धूपदान / अगरबत्ती पात्र (Incense Burner)', 'धूप का चश्मा (Sunglasses)', 'गर्म कंबल (Warm Blanket)', 'सफेद वस्त्र (White Cloth)'],
    correct_option_index: 0,
    explanation: 'पूजा-अनुष्ठान में गूगल या धूप सुलगाने वाले मिट्टी/धातु के पात्र को "धुपला" कहा जाता है।',
    cultural_notes: 'पवारी पूजा-अनुष्ठान शब्दावली'
  },
  {
    id: 'sbk-5',
    section_type: 'shabdkosh',
    question_pawari: 'पवारी बोली मा "घोंगड़ी" किस पारंपरिक परिधान को कहा जाता है?',
    question_hindi: 'पवारी में "घोंगड़ी" किस वस्त्र को कहा जाता है?',
    options: ['ऊन का बना पारंपरिक कंबल / शॉल (Traditional Woolen Blanket)', 'रेशमी पगड़ी (Turban)', 'धोती (Dhoti)', 'कुर्ता (Kurta)'],
    correct_option_index: 0,
    explanation: 'भेड़ के काले-सफेद ऊन से बुने वर्षा व शीत से बचाने वाले पारंपरिक कंबल को "घोंगड़ी" कहा जाता है।',
    cultural_notes: 'पवारी वस्त्र एवं ग्रामीण जीवन'
  },
  {
    id: 'sbk-6',
    section_type: 'shabdkosh',
    question_pawari: 'पवारी मुहावरा "डोरा तरेरना" का सही अर्थ का है?',
    question_hindi: 'पवारी मुहावरे "डोरा तरेरना" का क्या भावार्थ है?',
    options: ['क्रोध से आंखें दिखाना / घूरना (To Stare Angrily)', 'नींद में सोना (To Sleep)', 'रोने लगना (To Weep)', 'आंखों की जांच करना (Eye Checkup)'],
    correct_option_index: 0,
    explanation: 'पवारी में "डोरा तरेरना" का अर्थ आंखें तरेरना अथवा क्रोध व्यक्त करना होता है।',
    cultural_notes: 'पवारी मुहावरे एवं लोकोक्तियां'
  },
  {
    id: 'sbk-7',
    section_type: 'shabdkosh',
    question_pawari: 'पवारी भाषा मा "कुढ़िया" शब्द का प्रयोग किसके लिए किया जाता है?',
    question_hindi: 'पवारी बोली में "कुढ़िया" का क्या अर्थ है?',
    options: ['छोटा मिट्टी का कच्चा घर / झोपड़ी (Hut / Small Cottage)', 'कुआं (Well)', 'बगीचा (Garden)', 'खेत की बाड़ (Fence)'],
    correct_option_index: 0,
    explanation: 'पवारी में खेत अथवा गांव में बने मिट्टी-घास के छोटे घर को "कुढ़िया" कहते हैं।',
    cultural_notes: 'पवारी स्थापत्य एवं ग्रामीण आवास शब्दावली'
  },
  {
    id: 'sbk-8',
    section_type: 'shabdkosh',
    question_pawari: 'पवारी बोली मा "चेलुआ" किसे कहा जाता है?',
    question_hindi: 'पवारी बोली में "चेलुआ" का क्या अर्थ है?',
    options: ['छोटा बालक / बच्चा (Young Child / Boy)', 'बुजुर्ग व्यक्ति (Elderly Man)', 'पशु (Animal)', 'मित्र (Friend)'],
    correct_option_index: 0,
    explanation: 'पवारी में छोटे बालक को स्नेह से "चेलुआ" या "छोरा" कहा जाता है।',
    cultural_notes: 'पवारी पारिवारिक एवं स्नेहपरक संबोधन'
  },
  {
    id: 'sbk-9',
    section_type: 'shabdkosh',
    question_pawari: 'पवारी भाषा मा दही मथने वाले पारंपरिक उपकरण को का कहा जाता है?',
    question_hindi: 'दही मथकर मक्खन निकालने वाली मथानी को पवारी में क्या कहते हैं?',
    options: ['मथानी / रई / दुर्गा (Butter Churner)', 'बेलन (Rolling Pin)', 'चिमटा (Tongs)', 'तवा (Pan)'],
    correct_option_index: 0,
    explanation: 'दही बिलोने की पारंपरिक लकड़ी की फिरकी को पवारी लोक में "मथानी" या "रई" कहा जाता है।',
    cultural_notes: 'पवारी रसोई उपकरण'
  },
  {
    id: 'sbk-10',
    section_type: 'shabdkosh',
    question_pawari: 'पवारी बोली मा महुआ के फल से प्राप्त होने वाले बीज/गुठली को क्या कहा जाता है?',
    question_hindi: 'पवारी अंचल में महुआ के फल के अंदर के बीज को क्या कहते हैं?',
    options: ['टोरी / गुल्ली (Tori / Mahua Seed)', 'बादाम (Almond)', 'चिरौंजी (Chironji)', 'सुपारी (Betel Nut)'],
    correct_option_index: 0,
    explanation: 'महुआ के फल (डोंडे) के भीतर के बीज को पवारी में "टोरी" कहते हैं जिससे पारंपरिक खाद्य तेल निकाला जाता है।',
    cultural_notes: 'पवारी वनौषधि एवं कृषि शब्दावली'
  },

  // ==================== 2. PAHELI (पवारी पारम्परिक पहेलियाँ) ====================
  {
    id: 'phl-1',
    section_type: 'paheli',
    question_pawari: '"एक थार मा मोती भरा, सब का सिर पर औंधा धरा" - या पवारी पहेली का सही उत्तर का है?',
    question_hindi: 'उपरोक्त प्रसिद्ध पवारी लोक पहेली का सही उत्तर क्या है?',
    options: ['आकाश और तारे (Sky & Stars)', 'थाली और मोती (Plate & Pearls)', 'पेड़ और फल (Tree & Fruits)', 'बादल और वर्षा (Clouds & Rain)'],
    correct_option_index: 0,
    explanation: 'आकाश रूपी विशाल थाली में रात के चमकते हुए तारों का यह प्रसिद्ध पवारी काव्यात्मक रूपक है।',
    cultural_notes: 'पवारी लोक पहेलियाँ (चिहनन की काहयनी)'
  },
  {
    id: 'phl-2',
    section_type: 'paheli',
    question_pawari: '"एक हाथ की ककड़ी, नौ हाथ का बीज" - या पवारी पहेली का सही उत्तर का है?',
    question_hindi: '"एक हाथ की ककड़ी, नौ हाथ का बीज" पहेली किस सिलाई उपकरण की है?',
    options: ['सुई और धागा (Needle & Thread)', 'धनुष और बाण (Bow & Arrow)', 'पेड़ और जड़ (Tree & Root)', 'हल और रस्सी (Plough & Rope)'],
    correct_option_index: 0,
    explanation: 'छोटी सी सुई (ककड़ी) और उसमें पिरोया हुआ लंबा धागा (बीज) सिलाई का सजीव बिंब है।',
    cultural_notes: 'पवारी पहेली संग्रह'
  },
  {
    id: 'phl-3',
    section_type: 'paheli',
    question_pawari: '"काली गाय, कलेजा खाय, छूटय बछरू लंका जाय" - या पवारी पहेली का सही उत्तर का है?',
    question_hindi: 'यह पवारी पहेली किस आग्नेयास्त्र और गोली का वर्णन करती है?',
    options: ['बंदूक और गोली (Gun & Bullet)', 'तोप और गोला (Cannon & Ball)', 'धनुष और बाण (Bow & Arrow)', 'दीपक और लौ (Lamp & Flame)'],
    correct_option_index: 0,
    explanation: 'काली बंदूक और उससे तेज गति से छूटने वाली गोली (बछरू) का यह पवारी आलंकारिक बुझौवल है।',
    cultural_notes: 'पवारी वीर रस लोक पहेली'
  },
  {
    id: 'phl-4',
    section_type: 'paheli',
    question_pawari: '"कटोरी मा कटोरी, बेटा बाप से भी गोरा" - या पहेली का सही जवाब का है?',
    question_hindi: 'नारियल के भूरे आवरण और भीतर के धवल खोपरे की पहेली का उत्तर क्या है?',
    options: ['नारियल (Coconut)', 'अंडा (Egg)', 'दूध-मलाई (Milk Cream)', 'सफेद बेर (White Ber)'],
    correct_option_index: 0,
    explanation: 'नारियल के भूरे बाहरी छिलके के भीतर से निकलने वाले दूधिया सफेद खोपरे की पहेली।',
    cultural_notes: 'पवारी वनस्पति पहेलियाँ'
  },
  {
    id: 'phl-5',
    section_type: 'paheli',
    question_pawari: '"धूप मा जन्मे, छांव मा मुरझावे" - यह पहेली पवारी किसान व मजदूर के किस अमूल्य जल की प्रतीक है?',
    question_hindi: 'धूप में बहने वाले और छांव मिलते ही सूख जाने वाले श्रम तत्व का नाम क्या है?',
    options: ['पसीना (Sweat / Labor)', 'छाछ (Buttermilk)', 'वर्षा जल (Rain)', 'ओस (Dew)'],
    correct_option_index: 0,
    explanation: 'कठिन परिश्रम में निकलने वाला पसीना धूप में बहता है और विश्राम की छांव में विलीन हो जाता है।',
    cultural_notes: 'पवारी श्रमजीवी लोक चेतना'
  },
  {
    id: 'phl-6',
    section_type: 'paheli',
    question_pawari: '"खुली रात म जन्म लेत, हरी घास प सोती" - यह पवारी पहेली किसकी है?',
    question_hindi: 'हरी घास पर प्रातःकाल मोती जैसी चमकने वाली बूंद की पहेली का उत्तर क्या है?',
    options: ['ओस की बूँद (Dew Drop)', 'वर्षा बूँद (Rain Drop)', 'ओला (Hailstone)', 'मोती (Pearl)'],
    correct_option_index: 0,
    explanation: 'रात्रि के शीत में हरी पत्तियों पर जमने वाली पारदर्शी ओस (पवारी में हिंव/ओस) का प्राकृतिक सौंदर्य।',
    cultural_notes: 'पवारी ऋतु पहेलियाँ'
  },
  {
    id: 'phl-7',
    section_type: 'paheli',
    question_pawari: '"काला घोड़ा, सफेद सवारी, एक के बाद एक की बारी" - यह पवारी रसोई पहेली का सही उत्तर का है?',
    question_hindi: 'काले लोहे के तवे पर पकती सफेद रोटी के सजीव दृश्य की पहेली का उत्तर क्या है?',
    options: ['तवा और रोटी (Tawa & Roti)', 'कढ़ाई और पूड़ी (Kadhai & Poori)', 'चूल्हा और आग (Stove & Fire)', 'थाली और कटोरी (Plate & Bowl)'],
    correct_option_index: 0,
    explanation: 'काले तवे (घोड़ा) पर श्वेत रोटियों (सवारी) के एक के बाद एक पकने का पवारी घरेलू हास्य चित्रण।',
    cultural_notes: 'पवारी रसोई लोक बिंब'
  },
  {
    id: 'phl-8',
    section_type: 'paheli',
    question_pawari: '"सिर म् कलगी, पंख म् चंदा। गरजय बादर, नाचय बंदा" - यह किस सुंदर पक्षी की पहेली है?',
    question_hindi: 'मेघ गर्जन पर पंख फैलाकर नाचने वाले राष्ट्रीय पक्षी की पवारी पहेली का उत्तर क्या है?',
    options: ['मोर (Peacock)', 'तोता (Parrot)', 'कोयल (Cuckoo)', 'हंस (Swan)'],
    correct_option_index: 0,
    explanation: 'वर्षा काल में बादलों की गड़गड़ाहट सुनकर पंख खोलकर नाचने वाले मोर की पवारी स्तुति।',
    cultural_notes: 'पवारी पक्षी लोक वर्णन'
  },

  // ==================== 3. LOKGEET (पवारी लोकगीत व लोकगाथाएं) ====================
  {
    id: 'lkg-1',
    section_type: 'lokgeet',
    question_pawari: 'पवारी लोक संस्कृति मा "भुजरिया" (गेहूं के अंकुर) विसर्जन उत्सव किस पावन नदी के तट पर विशेष श्रद्धा से मनाया जाता है?',
    question_hindi: 'पवारी संस्कृति में भुजरिया पर्व किस पावन नदी के उद्गम व तट पर प्रसिद्ध है?',
    options: ['ताप्ती नदी / मुलताई सरोवर (Tapti River / Multai)', 'नर्मदा नदी (Narmada River)', 'गंगा नदी (Ganga River)', 'गोदावरी नदी (Godavari River)'],
    correct_option_index: 0,
    explanation: 'मुलताई (बैतूल) स्थित माँ ताप्ती के पावन सरोवर तट पर भुजरिया पर्व पर पवारी लोकगीत एवं मिलन समारोह आयोजित होता है।',
    cultural_notes: 'पवारी लोकपर्व एवं ताप्ती महात्म्य'
  },
  {
    id: 'lkg-2',
    section_type: 'lokgeet',
    question_pawari: 'पवारी विवाह परंपरा में वर-वधू के लिए गाया जाने वाला प्रमुख मंगल गीत कौन सा है?',
    question_hindi: 'पवारी विवाह में मांगलिक अवसर पर कौन सा पारंपरिक गीत गाया जाता है?',
    options: ['बन्ना-बन्नी, हल्दी व भांवर गीत (Banna-Banni & Wedding Songs)', 'कव्वाली (Qawwali)', 'मराठी लावणी (Lavani)', 'गजल (Ghazal)'],
    correct_option_index: 0,
    explanation: 'पवारी विवाह में मंडप, हल्दी, मांडो, बन्ना-बन्नी और सात फेरों के समय अत्यंत मधुर मंगल गीत गाए जाते हैं।',
    cultural_notes: 'पवारी विवाह संस्कार लोकगीत'
  },
  {
    id: 'lkg-3',
    section_type: 'lokgeet',
    question_pawari: 'पवारी लोकगीत मा जन्मोत्सव एवं शुभ मांगलिक अवसरों पर बधाई के रूप में कौन सा गीत गाया जाता है?',
    question_hindi: 'पवारी में संतान जन्म व शुभ अवसरों पर गाया जाने वाला मंगल गीत क्या कहलाता है?',
    options: ['बधावा / सोहर गीत (Badhava / Sohar)', 'शोक गीत (Elegies)', 'युद्ध गीत (War Song)', 'केवल ऋतु गीत (Seasonal Song)'],
    correct_option_index: 0,
    explanation: 'संतान के जन्मोत्सव तथा मांगलिक कार्यों में घर-आंगन में गाया जाने वाला मंगल गीत "बधावा" कहलाता है।',
    cultural_notes: 'पवारी संस्कार गीत'
  },
  {
    id: 'lkg-4',
    section_type: 'lokgeet',
    question_pawari: 'होली के पावन पर्व पर पवारी अंचल में ढप और मंजीरे के साथ गाए जाने वाले लोकगीतों को क्या कहते हैं?',
    question_hindi: 'वसंत ऋतु एवं होली के अवसर पर गाए जाने वाले पवारी गीतों को क्या कहा जाता है?',
    options: ['फाग गीत (Fag / Holi Songs)', 'कजरी (Kajri)', 'चैती (Chaiti)', 'आल्हा (Alha)'],
    correct_option_index: 0,
    explanation: 'फाल्गुन मास में होली पर पवारी ढप, ढोलक और मंजीरों की थाप पर फाग गीतों की धूम रहती है।',
    cultural_notes: 'पवारी ऋतु एवं फाल्गुनी लोक परंपरा'
  },
  {
    id: 'lkg-5',
    section_type: 'lokgeet',
    question_pawari: 'गोपीनाथ कालभोर द्वारा संकलित पवारी लोकगीतों में किस देवी की स्तुति मुख्य रूप से मिलती है?',
    question_hindi: 'पवारी लोकगीत संकलन में सूर्यपुत्री किस पावन देवी की वंदना मिलती है?',
    options: ['माँ ताप्ती (Mother Tapti)', 'माँ शारदा (Goddess Saraswati)', 'माँ विंध्यवासिनी (Vindhyavasini)', 'माँ वैष्णो देवी (Vaishno Devi)'],
    correct_option_index: 0,
    explanation: 'पवारी लोकगीतों का मंगलाचरण सदैव मुलताई की पावन सूर्यपुत्री माँ ताप्ती की वंदना से होता है।',
    cultural_notes: 'पवारी भक्ति लोकगीत'
  },
  {
    id: 'lkg-6',
    section_type: 'lokgeet',
    question_pawari: 'पवारी विवाह में द्वार पर स्थापित तोरण पर छड़ी से स्पर्श करने की मांगलिक रस्म को क्या कहते हैं?',
    question_hindi: 'पवारी विवाह में द्वार पर आयोजित तोरण रस्म को क्या कहा जाता है?',
    options: ['तोरण मारना (Toran Striking Ritual)', 'वरमाला (Garland)', 'कंगन खोलना (Kangan)', 'विदाई (Farewell)'],
    correct_option_index: 0,
    explanation: 'पवारी संस्कृति में बारात आगमन पर वर द्वारा द्वार पर नीम/आम के तोरण को छड़ी से छूकर प्रवेश की परंपरा है।',
    cultural_notes: 'पवारी विवाह रस्में'
  },

  // ==================== 4. BOOKS (पवारी ग्रन्थ व साहित्य) ====================
  {
    id: 'bks-1',
    section_type: 'books',
    question_pawari: '384 पृष्ठों के ऐतिहासिक ग्रन्थ "पवारी बोली एवं लोकसाहित्य का प्रामाणिक इतिहास" के प्रमुख लेखक कौन हैं?',
    question_hindi: '"पवारी बोली एवं लोकसाहित्य का प्रामाणिक इतिहास" ग्रन्थ के लेखक कौन हैं?',
    options: ['डॉ. कैलाश पवार एवं प्रो. रामेश्वर शर्मा (Dr. Kailash Pawar & Prof. Rameshwar Sharma)', 'मुंशी प्रेमचंद (Premchand)', 'महादेवी वर्मा (Mahadevi Varma)', 'रामचंद्र शुक्ल (Ramchandra Shukla)'],
    correct_option_index: 0,
    explanation: 'माँ ताप्ती शोध संस्थान, मुलताई द्वारा प्रकाशित यह ग्रंथ पवारी भाषाविज्ञान और इतिहास का आधिकारिक संदर्भ ग्रंथ है।',
    cultural_notes: 'पवारी संदर्भ साहित्य एवं शोध ग्रंथ'
  },
  {
    id: 'bks-2',
    section_type: 'books',
    question_pawari: '15,000 से अधिक प्रविष्टियों वाले "पवारी-हिंदी-अंग्रेजी बृहत् त्रिभाषीय शब्दकोश" के मुख्य संपादक कौन हैं?',
    question_hindi: '"पवारी-हिंदी-अंग्रेजी बृहत् त्रिभाषीय शब्दकोश" के मुख्य संपादक कौन हैं?',
    options: ['डॉ. बी. एल. पवार (Dr. B. L. Pawar)', 'डॉ. हरिवंश राय बच्चन', 'डॉ. नामवर सिंह', 'प्रो. अमर्त्य सेन'],
    correct_option_index: 0,
    explanation: 'डॉ. बी. एल. पवार के प्रधान संपादन में 15,000 पवारी शब्दों का प्रामाणिक त्रिभाषीय शब्दकोश संकलित हुआ है।',
    cultural_notes: 'पवारी कोश ग्रन्थ'
  },
  {
    id: 'bks-3',
    section_type: 'books',
    question_pawari: '"मध्य भारत की लोकसंस्कृति और ताप्ती अंचल" ग्रन्थ की लेखिका कौन हैं?',
    question_hindi: '"मध्य भारत की लोकसंस्कृति और ताप्ती अंचल" पुस्तक की रचना किसने की है?',
    options: ['डॉ. अनिता मालवीय एवं प्रो. संतराम चौधरी (Dr. Anita Malviya)', 'श्रीमती सुभद्रा कुमारी चौहान', 'श्रीमती आशापूर्णा देवी', 'श्रीमती अमृता प्रीतम'],
    correct_option_index: 0,
    explanation: 'डॉ. अनिता मालवीय ने ताप्ती घाटी सभ्यता, पवारी लोकगीत एवं पर्वों का समाजशास्त्रीय अध्ययन प्रस्तुत किया है।',
    cultural_notes: 'पवारी संस्कृति ग्रन्थ'
  },
  {
    id: 'bks-4',
    section_type: 'books',
    question_pawari: 'पवारी मौखिक लोकगाथाओं, आल्हा एवं भरथरी गीतों का संकलन "पवारी लोकगाथाएं और मौखिक परंपरा" किसने किया है?',
    question_hindi: '"पवारी लोकगाथाएं और मौखिक परंपरा" पुस्तक के संकलनकर्ता कौन हैं?',
    options: ['रामनाथ पवार "सरस" (Ramnath Pawar Saras)', 'मैथिलीशरण गुप्त', 'फणीश्वर नाथ रेणु', 'हजारी प्रसाद द्विवेदी'],
    correct_option_index: 0,
    explanation: 'रामनाथ पवार "सरस" द्वारा सदियों से मौखिक रूप से गाई जाने वाली पवारी लोकगाथाओं का प्रामाणिक संकलन किया गया है।',
    cultural_notes: 'पवारी मौखिक साहित्य'
  },

  // ==================== 5. REVIEWS (शोध समालोचना व समीक्षाएं) ====================
  {
    id: 'rev-1',
    section_type: 'reviews',
    question_pawari: 'भाषाशास्त्रीय शोध समीक्षाओं के अनुसार, पवारी बोली किन तीन प्रमुख भाषाई धाराओं के संगम पर विकसित हुई है?',
    question_hindi: 'शोध समीक्षाओं के अनुसार, पवारी बोली किन भाषा-शैलियों का समृद्ध संगम है?',
    options: ['मालवी, बुंदेली और मराठी (Malvi, Bundeli & Marathi)', 'पंजाबी, सिंधी और कश्मीरी', 'तमिल, तेलुगु और कन्नड़', 'बांग्ला, असमिया और ओड़िया'],
    correct_option_index: 0,
    explanation: 'पवारी बोली मालवा से परमारों के प्रवास के उपरांत बुंदेली और मराठी के संपर्क से एक स्वतंत्र समृद्ध बोली के रूप में विकसित हुई।',
    cultural_notes: 'पवारी भाषाविज्ञान एवं तुलनात्मक समीक्षा'
  },
  {
    id: 'rev-2',
    section_type: 'reviews',
    question_pawari: 'शोध आलेख "डिजिटल युग में मौखिक लोकसाहित्य का संरक्षण" में लोकगीतों के संरक्षण हेतु किस तकनीक पर बल दिया गया है?',
    question_hindi: 'मौखिक लोकसाहित्य के संरक्षण हेतु शोध आलेखों में किस उपाय को सर्वोच्च प्राथमिकता दी गई है?',
    options: ['डिजिटल ऑडियो-वीडियो आर्काइविंग एवं ओपन एक्सेस रिपोजिटरी (Digital Archiving & Open Access)', 'केवल मुद्रण बंद करना', 'केवल मौखिक सुनना', 'साहित्य पर प्रतिबंध लगाना'],
    correct_option_index: 0,
    explanation: 'प्रो. रामेश्वर शर्मा के शोध आलेख अनुसार ग्रामीण बुजुर्ग लोकगायकों की ऑडियो रिकॉर्डिंग एवं डिजिटल आर्काइविंग अनिवार्य है।',
    cultural_notes: 'डिजिटल मानविकी शोध'
  },
  {
    id: 'rev-3',
    section_type: 'reviews',
    question_pawari: 'पुस्तक समीक्षा "सतपुड़ा के लोकदेवता और अनुष्ठान" में सतपुड़ा अंचल के किन पारंपरिक लोकदेवताओं का विवेचन है?',
    question_hindi: 'सतपुड़ा लोकदेवता समीक्षा में किन देवों के अनुष्ठान का उल्लेख है?',
    options: ['मेघनाथ, मुठवा एवं खण्डोबा (Meghnath, Muthwa & Khandoba)', 'केवल ग्रीक देवता', 'रोमन देवता', 'मिस्र के देवता'],
    correct_option_index: 0,
    explanation: 'सुरेश देशमुख की पुस्तक की समीक्षा में मध्य भारत के लोकदेवता मेघनाथ खंभ, मुठवा एवं खण्डोबा परंपरा का दस्तावेजीकरण रेखांकित है।',
    cultural_notes: 'पवारी लोकदेवता एवं मानवशास्त्र'
  },

  // ==================== 6. GENERAL CULTURE & HERITAGE (पवारी संस्कृति व धरोहर) ====================
  {
    id: 'gen-1',
    section_type: 'general',
    question_pawari: 'सूर्यपुत्री माँ ताप्ती का पावन उद्गम स्थल मध्य प्रदेश के किस जिले के मुलताई नगर में स्थित है?',
    question_hindi: 'पवित्र ताप्ती नदी का उद्गम स्थल किस जिले में है?',
    options: ['बैतूल जिला (Betul District, M.P.)', 'भोपाल जिला (Bhopal)', 'इंदौर जिला (Indore)', 'जबलपुर जिला (Jabalpur)'],
    correct_option_index: 0,
    explanation: 'माँ ताप्ती का पवित्र उद्गम स्थल मुलताई (मूलताप्ती), जिला बैतूल (म.प्र.) में स्थित है, जो पवारी संस्कृति का केंद्रीय तीर्थ है।',
    cultural_notes: 'पवारी भूगोल एवं तीर्थ धरोहर'
  },
  {
    id: 'gen-2',
    section_type: 'general',
    question_pawari: 'पवारी बोली मुख्य रूप से मध्य प्रदेश और महाराष्ट्र के किन जिलों के अंचल में बोली जाती है?',
    question_hindi: 'पवारी बोली का प्रमुख भौगोलिक क्षेत्र कौन सा है?',
    options: ['बैतूल, छिंदवाड़ा, सिवनी, वर्धा, नागपुर व बालाघाट (Betul, Chhindwara, Seoni & Vidarbha)', 'जयपुर, जोधपुर व बीकानेर', 'पटना, गया व मुजफ्फरपुर', 'शिमला, कुल्लू व मनाली'],
    correct_option_index: 0,
    explanation: 'पवारी (भोयरी) भाषा सतपुड़ा पर्वतमाला के बैतूल, छिंदवाड़ा, सिवनी, बालाघाट एवं सीमावर्ती विदर्भ अंचल में बोली जाती है।',
    cultural_notes: 'पवारी भौगोलिक विस्तार'
  },
  {
    id: 'gen-3',
    section_type: 'general',
    question_pawari: 'माँ ताप्ती पवारी शोध संस्थान का केंद्रीय मुख्यालय कहाँ स्थापित है?',
    question_hindi: 'माँ ताप्ती पवारी शोध संस्थान का मुख्य कार्यालय कहाँ स्थित है?',
    options: ['मुलताई, जिला बैतूल (Multai, Betul, M.P.)', 'ग्वालियर', 'उज्जैन', 'रीवा'],
    correct_option_index: 0,
    explanation: 'माँ ताप्ती पवारी शोध संस्थान का मुख्यालय मुलताई (बैतूल) में है, जहाँ से पवारी शोध पत्रिका का प्रकाशन होता है।',
    cultural_notes: 'पवारी शोध संस्थान परिचय'
  },
  {
    id: 'gen-4',
    section_type: 'general',
    question_pawari: 'पवारी भोयरी संस्कृति में कृषि कार्यों की शुरुआत पर मनाया जाने वाला पारंपरिक हल पूजा पर्व कौन सा है?',
    question_hindi: 'पवारी संस्कृति में बैलों एवं हल का पूजन किस पर्व पर विशेष रूप से किया जाता है?',
    options: ['पोला पर्व / बेंदूर (Pola Festival)', 'क्रिसमस (Christmas)', 'ईद (Eid)', 'ओणम (Onam)'],
    correct_option_index: 0,
    explanation: 'भाद्रपद मास की अमावस्या को पोला पर्व पर पवारी किसान बैलों को सजाकर पूजा करते हैं और आभार व्यक्त करते हैं।',
    cultural_notes: 'पवारी कृषि पर्व एवं लोक चेतना'
  }
];

export interface QuizConfig {
  totalQuestions?: number;
  distribution?: Partial<Record<QuizCategoryType, number>>;
}

export const DEFAULT_QUIZ_CONFIG: Required<QuizConfig> = {
  totalQuestions: 10,
  distribution: {
    shabdkosh: 3,
    paheli: 2,
    lokgeet: 2,
    books: 1,
    reviews: 1,
    general: 1,
    writers: 0,
    articles: 0
  }
};

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Shuffles options of a question while preserving correct answer index
 */
export function shuffleSingleQuestion(q: QuizQuestion): QuizQuestion {
  const originalCorrectOption = q.options[q.correct_option_index];
  const shuffledOptions = shuffleArray(q.options);
  const newCorrectIndex = shuffledOptions.indexOf(originalCorrectOption);

  return {
    ...q,
    options: shuffledOptions,
    correct_option_index: newCorrectIndex !== -1 ? newCorrectIndex : 0
  };
}

/**
 * Generates a balanced, randomized set of questions according to specified category counts
 */
export function generateBalancedQuizQuestions(
  customConfig?: QuizConfig,
  existingPool: QuizQuestion[] = MASTER_QUESTION_BANK
): QuizQuestion[] {
  const config = {
    ...DEFAULT_QUIZ_CONFIG,
    ...customConfig,
    distribution: {
      ...DEFAULT_QUIZ_CONFIG.distribution,
      ...(customConfig?.distribution || {})
    }
  };

  // Group master pool by section_type
  const grouped: Record<string, QuizQuestion[]> = {};
  existingPool.forEach(q => {
    const cat = q.section_type || 'general';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(q);
  });

  const selectedQuestions: QuizQuestion[] = [];
  const targetCategories: QuizCategoryType[] = ['shabdkosh', 'paheli', 'lokgeet', 'books', 'reviews', 'general'];

  // 1. Pick required number from each category
  targetCategories.forEach(cat => {
    const count = config.distribution[cat] || 0;
    const catPool = grouped[cat] || [];
    if (catPool.length > 0 && count > 0) {
      const shuffledCat = shuffleArray(catPool);
      const picked = shuffledCat.slice(0, Math.min(count, shuffledCat.length));
      selectedQuestions.push(...picked);
    }
  });

  // 2. If we still need more questions to reach totalQuestions, fill from remaining pool
  const selectedIds = new Set(selectedQuestions.map(q => q.id));
  if (selectedQuestions.length < config.totalQuestions) {
    const remaining = existingPool.filter(q => !selectedIds.has(q.id));
    const shuffledRemaining = shuffleArray(remaining);
    const needed = config.totalQuestions - selectedQuestions.length;
    selectedQuestions.push(...shuffledRemaining.slice(0, needed));
  }

  // 3. Shuffle all picked questions and shuffle their internal options
  const finalOrdered = shuffleArray(selectedQuestions).slice(0, config.totalQuestions);
  return finalOrdered.map(q => shuffleSingleQuestion(q));
}

/**
 * Calculate grade / honor tier based on percentage
 */
export function getQuizPerformanceGrade(percentage: number): {
  gradeHindi: string;
  gradeEnglish: string;
  badgeColor: string;
  badgeBg: string;
  passed: boolean;
  statusHindi: string;
} {
  if (percentage >= 90) {
    return {
      gradeHindi: 'स्वर्ण पदक विशिष्ट योग्यता (Gold Honor)',
      gradeEnglish: 'Distinction with Gold Honor (90-100%)',
      badgeColor: 'text-amber-800 border-amber-500/50',
      badgeBg: 'bg-gradient-to-r from-amber-200 via-amber-300 to-amber-100',
      passed: true,
      statusHindi: 'उत्कृष्ट सफलता ★★★'
    };
  } else if (percentage >= 75) {
    return {
      gradeHindi: 'रजत प्रवीणता सम्मान (Silver Merit)',
      gradeEnglish: 'First Class with Silver Merit (75-89%)',
      badgeColor: 'text-slate-800 border-slate-400',
      badgeBg: 'bg-gradient-to-r from-slate-200 via-stone-200 to-amber-100',
      passed: true,
      statusHindi: 'सराहनीय प्रदर्शन ★★'
    };
  } else if (percentage >= 50) {
    return {
      gradeHindi: 'कांस्य योग्यता (Certified Scholar)',
      gradeEnglish: 'Certified Scholar (50-74%)',
      badgeColor: 'text-amber-900 border-amber-700/40',
      badgeBg: 'bg-gradient-to-r from-amber-100 to-stone-100',
      passed: true,
      statusHindi: 'उत्तीर्ण एवं प्रमाणित ★'
    };
  } else {
    return {
      gradeHindi: 'प्रयास सराहनीय (Participant)',
      gradeEnglish: 'Participant (Below 50%)',
      badgeColor: 'text-stone-700 border-stone-300',
      badgeBg: 'bg-stone-100',
      passed: false,
      statusHindi: 'पुनः प्रयास अनुशंसित'
    };
  }
}

// Fallback diverse distractors for Shabdkosh meanings
const DEFAULT_SHABDKOSH_DISTRACTORS: string[] = [
  'आंख / नेत्र (Eye)',
  'ज्वार या गेहूं की रोटी (Traditional Flatbread)',
  'झाड़ू (Broom)',
  'माता / माँ (Mother)',
  'पशु / मवेशी (Cattle / Livestock)',
  'अक्षय तृतीया का लोक पर्व (Akshaya Tritiya)',
  'घर का मुख्य दरवाजा (Front Door)',
  'खेत का गहरा कुआं (Deep Well)',
  'विवाह का मांगलिक मंडप (Wedding Altar)',
  'ताजा मक्खन / माखन (Fresh Butter)',
  'सुबह का सूर्योदय (Sunrise)',
  'वर्षा की पहली फुहार (First Rain)',
  'सिर की पगड़ी / फेंटा (Traditional Turban)',
  'मिट्टी का पारंपरिक मटका (Clay Pot)',
  'गाँव का सार्वजनिक चौराहा (Village Square)',
  'ताप्ती नदी का पावन तट (Holy River Bank)',
  'कमर की पारंपरिक करधनी (Waistband Ornament)',
  'सतपुड़ा का सघन वन क्षेत्र (Dense Forest)',
  'बैलगाड़ी का पहिया (Cart Wheel)',
  'लोकगीत गायन की धुन (Folksong Melody)'
];

// Fallback diverse distractors for Paheli answers
const DEFAULT_PAHELI_DISTRACTORS: string[] = [
  'दीपक / दीया (Oil Lamp)',
  'बंदूक और गोली (Gun & Bullet)',
  'जूं (Louse)',
  'माखन और मट्ठा (Butter & Buttermilk)',
  'घड़ी (Clock)',
  'सूरज और चाँद (Sun & Moon)',
  'कुआं और रस्सी (Well & Rope)',
  'मटका और पानी (Clay Pot & Water)',
  'आँखें और पलकें (Eyes & Eyelids)',
  'जूता / चप्पल (Footwear)',
  'सुई और धागा (Needle & Thread)',
  'ताला और चाबी (Lock & Key)',
  'आईना / दर्पण (Mirror)',
  'छाता / छतरी (Umbrella)',
  'हुक्का / चिलम (Traditional Pipe)',
  'चक्की / जांता (Flour Mill Stone)',
  'हल और बैल (Plough & Oxen)',
  'धुआं और आग (Smoke & Fire)',
  'कपास / रुई (Cotton Plant)',
  'आसमान और तारे (Sky & Stars)'
];

/**
 * Dynamically converts any list of Shabdkosh items (present and newly added) into high-quality Quiz Questions
 */
export function generateQuestionsFromShabdkosh(shabdkoshList: PawariShabdkoshItem[] = []): QuizQuestion[] {
  if (!shabdkoshList || shabdkoshList.length === 0) return [];

  // Filter valid items with a word and meaning
  const validItems = shabdkoshList.filter(item => item && item.word_pawari && item.meaning_hindi);
  const allMeanings = Array.from(new Set(validItems.map(item => item.meaning_hindi.trim())));

  return validItems.map((item, idx) => {
    const correctAnswer = item.meaning_hindi.trim();
    
    // Pick 3 distractors from other shabdkosh entries first
    let availableDistractors = allMeanings.filter(m => m !== correctAnswer);
    
    // If not enough from shabdkosh list, supplement with curated default distractors
    if (availableDistractors.length < 3) {
      const extra = DEFAULT_SHABDKOSH_DISTRACTORS.filter(d => d !== correctAnswer && !availableDistractors.includes(d));
      availableDistractors = [...availableDistractors, ...extra];
    }

    const pickedDistractors = shuffleArray(availableDistractors).slice(0, 3);
    const options = shuffleArray([correctAnswer, ...pickedDistractors]);
    const correctOptionIndex = options.indexOf(correctAnswer);

    const cleanWord = item.word_pawari.replace(/\s*\([^)]*\)/g, '').trim();

    return {
      id: `dyn_shabd_${item.id || `word_${idx}`}`,
      section_type: 'shabdkosh',
      question_pawari: `पवारी शब्द "${item.word_pawari}" का सही हिंदी अर्थ क्या होता है?`,
      question_hindi: `पवारी शब्द "${item.word_pawari}" का प्रामाणिक अर्थ क्या है?`,
      options,
      correct_option_index: correctOptionIndex !== -1 ? correctOptionIndex : 0,
      explanation: `पवारी शब्द '${cleanWord}' का सही अर्थ '${item.meaning_hindi}' है।${item.example_pawari ? ` उदाहरण: "${item.example_pawari}"` : ''}`,
      cultural_notes: `पवारी शब्दकोश व मुहावरे (${item.category || 'पारम्परिक शब्दावली'})`
    };
  });
}

/**
 * Dynamically converts any list of Paheli items into high-quality Quiz Questions
 */
export function generateQuestionsFromPaheli(paheliList: PawariPaheliItem[] = []): QuizQuestion[] {
  if (!paheliList || paheliList.length === 0) return [];

  const validItems = paheliList.filter(item => item && item.riddle_pawari && item.answer_hindi);
  const allAnswers = Array.from(new Set(validItems.map(item => item.answer_hindi.trim())));

  return validItems.map((item, idx) => {
    const correctAnswer = item.answer_hindi.trim();

    // Pick 3 distractors from other paheli answers first
    let availableDistractors = allAnswers.filter(a => a !== correctAnswer);

    // If not enough, supplement with curated default distractors
    if (availableDistractors.length < 3) {
      const extra = DEFAULT_PAHELI_DISTRACTORS.filter(d => d !== correctAnswer && !availableDistractors.includes(d));
      availableDistractors = [...availableDistractors, ...extra];
    }

    const pickedDistractors = shuffleArray(availableDistractors).slice(0, 3);
    const options = shuffleArray([correctAnswer, ...pickedDistractors]);
    const correctOptionIndex = options.indexOf(correctAnswer);

    return {
      id: `dyn_pah_${item.id || `paheli_${idx}`}`,
      section_type: 'paheli',
      question_pawari: `पवारी पारम्परिक पहेली: "${item.riddle_pawari}" का सही उत्तर क्या है?`,
      question_hindi: `पवारी लोक-पहेली: "${item.riddle_pawari}" का सही उत्तर क्या है?`,
      options,
      correct_option_index: correctOptionIndex !== -1 ? correctOptionIndex : 0,
      explanation: `इस पवारी पहेली का सही उत्तर '${item.answer_hindi}' है।${item.hint_hindi ? ` (संकेत: ${item.hint_hindi})` : ''}`,
      cultural_notes: `पवारी पारम्परिक पहेलियाँ (${item.category || 'लोक बुझौवल'})`
    };
  });
}

/**
 * Builds a unified, master dynamic question pool merging:
 * 1. All Shabdkosh words (present & future real-time added words)
 * 2. All Paheli riddles (complete collection)
 * 3. Base MASTER_QUESTION_BANK (covering lokgeet, books, reviews, general heritage)
 * 4. Custom CMS / Firestore questions
 */
export function buildMasterQuizQuestionPool(params: {
  shabdkoshList?: PawariShabdkoshItem[];
  paheliList?: PawariPaheliItem[];
  cmsQuestions?: QuizQuestion[];
}): QuizQuestion[] {
  const { shabdkoshList = [], paheliList = [], cmsQuestions = [] } = params;

  // Generate dynamic questions from full shabdkosh and paheli collections
  const dynamicShabdkoshQuestions = generateQuestionsFromShabdkosh(shabdkoshList);
  const dynamicPaheliQuestions = generateQuestionsFromPaheli(paheliList);

  // Combine custom CMS questions with master static bank
  const customIds = new Set(cmsQuestions.map(q => q.id));
  const basePool = [...cmsQuestions, ...MASTER_QUESTION_BANK.filter(q => !customIds.has(q.id))];

  // Merge everything into one comprehensive pool with unique IDs
  const seenIds = new Set<string>();
  const combinedPool: QuizQuestion[] = [];

  // Add custom and base questions first
  basePool.forEach(q => {
    if (!seenIds.has(q.id)) {
      seenIds.add(q.id);
      combinedPool.push(q);
    }
  });

  // Add all dynamic shabdkosh questions (both current and future ones)
  dynamicShabdkoshQuestions.forEach(q => {
    if (!seenIds.has(q.id)) {
      seenIds.add(q.id);
      combinedPool.push(q);
    }
  });

  // Add all dynamic paheli questions
  dynamicPaheliQuestions.forEach(q => {
    if (!seenIds.has(q.id)) {
      seenIds.add(q.id);
      combinedPool.push(q);
    }
  });

  return combinedPool;
}

