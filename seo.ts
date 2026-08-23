import { Article, JournalSettings } from '../types';
import { getCanonicalUrl, getUrlForView } from './router';

const DEFAULT_DOMAIN = 'https://pawari-shodh-patrika.vercel.app';

export function updateMetaTags(
  view: string,
  settings: JournalSettings,
  article?: Article | null,
  lang: 'hi' | 'en' = 'hi',
  isNotFound = false
) {
  if (typeof document === 'undefined') return;

  const journalTitle = lang === 'hi' 
    ? (settings.journal_title_hindi || 'पवारी शोध पत्रिका') 
    : (settings.journal_title_english || 'Pawari Shodh Patrika');
  
  const subtitle = lang === 'hi' 
    ? settings.subtitle_hindi 
    : settings.subtitle_english;

  // 1. Remove old dynamic meta & citation tags
  const existingDynamic = document.querySelectorAll('meta[data-seo="true"], link[rel="canonical"], script[type="application/ld+json"][data-seo="true"]');
  existingDynamic.forEach(el => el.remove());

  const head = document.head;

  const addMeta = (nameOrProp: string, content: string, isProperty = false) => {
    if (!content) return;
    const meta = document.createElement('meta');
    meta.setAttribute(isProperty ? 'property' : 'name', nameOrProp);
    meta.setAttribute('content', content);
    meta.setAttribute('data-seo', 'true');
    head.appendChild(meta);
  };

  const addLink = (rel: string, href: string, hreflang?: string) => {
    if (!href) return;
    const link = document.createElement('link');
    link.setAttribute('rel', rel);
    link.setAttribute('href', href);
    if (hreflang) link.setAttribute('hreflang', hreflang);
    link.setAttribute('data-seo', 'true');
    head.appendChild(link);
  };

  const addJsonLd = (data: any) => {
    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('data-seo', 'true');
    script.textContent = JSON.stringify(data);
    head.appendChild(script);
  };

  // 404 Not Found Handling
  if (isNotFound || (view === 'article_detail' && !article)) {
    const notFoundTitle = lang === 'hi' 
      ? `404 - पृष्ठ या शोध पत्र उपलब्ध नहीं है | ${journalTitle}` 
      : `404 - Page or Article Not Found | ${journalTitle}`;
    document.title = notFoundTitle;
    addMeta('robots', 'noindex, nofollow');
    addMeta('prerender-status-code', '404');
    addMeta('http-status', '404');
    addMeta('description', lang === 'hi' 
      ? 'अनुरोधित पृष्ठ या शोध पत्र उपलब्ध नहीं है। कृपया शोध पत्रिका के मुख्य पृष्ठ या आर्काइव में खोजें।' 
      : 'The requested page or research article could not be found. Please search our published archives or homepage.');
    return;
  }

  // Admin route noindex
  if (view === 'admin') {
    document.title = `CMS Admin | ${journalTitle}`;
    addMeta('robots', 'noindex, nofollow');
    return;
  }

  // Handle Article Detail Page
  if (view === 'article_detail' && article) {
    const articleTitle = lang === 'hi' ? article.title_hindi : article.title_english;
    const abstract = lang === 'hi' ? article.abstract_hindi : article.abstract_english;
    const cleanAbstract = (abstract || '').replace(/[#*`_]/g, '').slice(0, 250) + '...';
    const pageUrl = getCanonicalUrl(getUrlForView('article_detail', article.slug || article.id));
    const rawPubDate = article.date_published || `${article.year || new Date().getFullYear()}/06/01`;

    // Page Title
    document.title = `${articleTitle} | Vol. ${article.volume} Issue ${article.issue} (${article.year}) | ${journalTitle}`;

    // Standard SEO Tags
    addMeta('description', cleanAbstract);
    const keywordsList = article.keywords && article.keywords.length > 0 
      ? article.keywords.join(', ') 
      : 'पवारी शोध पत्रिका, Pawari research paper, Tapti folklore, academic journal, peer-reviewed, UGC CARE, open access';
    addMeta('keywords', keywordsList);
    addMeta('author', (article.authors || []).map(a => a.name).join(', '));
    addMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    addLink('canonical', pageUrl);
    addLink('alternate', pageUrl, 'hi');
    addLink('alternate', pageUrl, 'en');
    addLink('alternate', pageUrl, 'x-default');

    // OpenGraph
    addMeta('og:title', articleTitle, true);
    addMeta('og:description', cleanAbstract, true);
    addMeta('og:type', 'article', true);
    addMeta('og:url', pageUrl, true);
    addMeta('og:site_name', journalTitle, true);
    addMeta('og:locale', lang === 'hi' ? 'hi_IN' : 'en_US', true);
    addMeta('og:locale:alternate', lang === 'hi' ? 'en_US' : 'hi_IN', true);
    addMeta('article:published_time', rawPubDate, true);
    if (article.category) addMeta('article:section', article.category, true);
    (article.keywords || []).forEach(kw => addMeta('article:tag', kw, true));
    (article.authors || []).forEach(a => { if (a.name) addMeta('article:author', a.name, true); });

    const ogImg = settings.logo_url || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=1200';
    addMeta('og:image', ogImg, true);
    addMeta('og:image:alt', articleTitle, true);

    // Twitter
    addMeta('twitter:card', 'summary_large_image');
    addMeta('twitter:title', articleTitle);
    addMeta('twitter:description', cleanAbstract);
    addMeta('twitter:image', ogImg);

    // --- Google Scholar Highwire Press Meta Tags ---
    addMeta('citation_title', articleTitle);
    (article.authors || []).forEach(author => {
      if (author.name) {
        addMeta('citation_author', author.name);
        if (author.affiliation) {
          addMeta('citation_author_institution', author.affiliation);
        }
        if (author.email) {
          addMeta('citation_author_email', author.email);
        }
        if (author.orcid) {
          addMeta('citation_author_orcid', author.orcid);
        }
      }
    });

    const pubDateFormatted = rawPubDate.replace(/-/g, '/');
    addMeta('citation_publication_date', pubDateFormatted);
    addMeta('citation_journal_title', journalTitle);
    addMeta('citation_publisher', settings.publisher_english || 'Maa Tapti Research Institute, Multai');
    if (article.volume) addMeta('citation_volume', String(article.volume));
    if (article.issue) addMeta('citation_issue', String(article.issue));
    
    if (article.doi) {
      addMeta('citation_doi', article.doi);
    }

    const validIssn = (settings.issn_online && settings.issn_online !== 'Applied For')
      ? settings.issn_online
      : (settings.issn_print && settings.issn_print !== 'Applied For' ? settings.issn_print : null);
    if (validIssn) {
      addMeta('citation_issn', validIssn);
    }

    if (article.language) {
      addMeta('citation_language', article.language.toLowerCase().startsWith('eng') ? 'en' : 'hi');
    }

    addMeta('citation_abstract_html_url', pageUrl);
    addMeta('citation_fulltext_html_url', pageUrl);

    if (article.page_numbers) {
      const parts = article.page_numbers.split('-');
      if (parts[0] && parts[0].trim()) addMeta('citation_firstpage', parts[0].trim());
      if (parts[1] && parts[1].trim()) addMeta('citation_lastpage', parts[1].trim());
    }

    if (article.pdf_url) {
      addMeta('citation_pdf_url', article.pdf_url);
    }

    if (article.keywords && article.keywords.length > 0) {
      addMeta('citation_keywords', article.keywords.join('; '));
    }

    // --- Dublin Core (DC) Academic Library Harvester Metadata ---
    addMeta('DC.title', articleTitle);
    (article.authors || []).forEach(a => {
      if (a.name) addMeta('DC.creator', a.name);
    });
    addMeta('DC.description', cleanAbstract);
    addMeta('DC.publisher', settings.publisher_english || 'Maa Tapti Research Institute, Multai');
    addMeta('DC.date', rawPubDate);
    addMeta('DC.type', 'Text.Serial.Journal');
    addMeta('DC.format', 'text/html');
    addMeta('DC.identifier', pageUrl);
    if (article.doi) addMeta('DC.identifier.DOI', article.doi);
    if (validIssn) addMeta('DC.source.ISSN', validIssn);
    addMeta('DC.language', article.language === 'English' ? 'eng' : 'hin');
    addMeta('DC.rights', 'Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)');

    // JSON-LD ScholarlyArticle Schema
    addJsonLd({
      '@context': 'https://schema.org',
      '@type': 'ScholarlyArticle',
      'headline': articleTitle,
      'name': articleTitle,
      'abstract': cleanAbstract,
      'inLanguage': article.language === 'English' ? 'en' : 'hi',
      'datePublished': pubDateFormatted,
      'license': 'https://creativecommons.org/licenses/by-nc/4.0/',
      'keywords': article.keywords,
      'author': (article.authors || []).map(a => ({
        '@type': 'Person',
        'name': a.name,
        'email': a.email,
        'identifier': a.orcid ? `https://orcid.org/${a.orcid}` : undefined,
        'affiliation': a.affiliation ? { '@type': 'Organization', 'name': a.affiliation } : undefined
      })),
      'isPartOf': {
        '@type': 'PublicationIssue',
        'issueNumber': String(article.issue),
        'datePublished': String(article.year),
        'isPartOf': {
          '@type': 'Periodical',
          'name': journalTitle,
          'issn': [settings.issn_online, settings.issn_print].filter(i => i && i !== 'Applied For')
        }
      },
      'publisher': {
        '@type': 'Organization',
        'name': settings.publisher_english || 'Maa Tapti Research Institute, Multai',
        'logo': settings.logo_url
      },
      'mainEntityOfPage': pageUrl,
      'url': pageUrl,
      'encoding': article.pdf_url ? {
        '@type': 'MediaObject',
        'contentUrl': article.pdf_url,
        'encodingFormat': 'application/pdf'
      } : undefined
    });

    return;
  }

  // Public View Titles, Descriptions & Rich Keywords
  let pageTitle = `${journalTitle} (पवारी शोध पत्रिका) — Peer-Reviewed Research Journal`;
  let description = 'Pawari Shodh Patrika is a bilingual peer-reviewed refereed research journal centered on Pawari language, literature, history, regional dialects, folk traditions, tribal linguistics, and social heritage of Madhya Pradesh and neighboring regions.';
  let keywords = 'पवारी शोध पत्रिका, Pawari Shodh Patrika, पवारी भाषा, Pawari Language, UGC CARE Journal, Peer Reviewed, International Refereed Journal, Tapti Culture, Betul, Chhindwara';
  let path = getUrlForView(view as any);

  switch (view) {
    case 'home':
      pageTitle = `${journalTitle} (पवारी शोध पत्रिका) — International Refereed Journal`;
      description = 'Official portal of Pawari Shodh Patrika, an international peer-reviewed refereed multidisciplinary journal published by Maa Tapti Research Institute, Multai.';
      keywords = 'पवारी शोध पत्रिका, Pawari research, International refereed journal, peer reviewed journal, UGC CARE, open access, Multai, Betul, Pawari literature';
      break;
    case 'about':
      pageTitle = lang === 'hi' ? `पत्रिका परिचय एवं उद्देश्य | ${journalTitle}` : `About Journal & Scope | ${journalTitle}`;
      description = lang === 'hi' ? 'पवारी शोध पत्रिका का परिचय, उद्देश्य, विषय क्षेत्र, सम्पादकीय नीतियां एवं ओपन एक्सेस दिशा-निर्देश।' : 'Learn about Pawari Shodh Patrika, its aims, scope, indexing status, open-access publication policies, and peer-review ethics.';
      keywords = 'about pawari shodh patrika, journal scope, peer review policy, open access ethics, UGC CARE guidelines, aims and scope';
      break;
    case 'current_issue':
      pageTitle = lang === 'hi' ? `वर्तमान अंक एवं शोध पत्र | ${journalTitle}` : `Current Issue & Table of Contents | ${journalTitle}`;
      description = lang === 'hi' ? 'पवारी शोध पत्रिका का नवीनतम प्रकाशित शोध अंक, विषय-सूची एवं समीक्षित शोध पत्र।' : 'Browse the latest published volume, current issue research articles, and table of contents of Pawari Shodh Patrika.';
      keywords = 'current issue, latest research papers, published volume, table of contents, open access PDF download, Pawari journal current issue';
      break;
    case 'archive':
      pageTitle = lang === 'hi' ? `शोध संग्रह एवं पुराने अंक | ${journalTitle}` : `Journal Archives & Past Volumes | ${journalTitle}`;
      description = lang === 'hi' ? 'पवारी शोध पत्रिका के सभी प्रकाशित अंकों, वॉल्यूम और शोध पत्रों का पूर्ण डिजिटलाइज्ड आर्काइव।' : 'Explore the complete digital repository of past issues, published volumes, and peer-reviewed research papers in Pawari Shodh Patrika.';
      keywords = 'journal archives, past volumes, back issues, digitized research repository, Pawari shodh archive';
      break;
    case 'articles':
      pageTitle = lang === 'hi' ? `प्रकाशित शोध पत्र संग्रह | ${journalTitle}` : `Published Research Papers | ${journalTitle}`;
      description = lang === 'hi' ? 'पवारी शोध पत्रिका के अंतर्गत प्रकाशित सभी सहकर्मी-समीक्षित शोध पत्र एवं शोध आलेख।' : 'Search and access open-access peer-reviewed research articles published in Pawari Shodh Patrika.';
      keywords = 'research papers, peer-reviewed articles, open access research, Pawari linguistics papers, tribal history articles';
      break;
    case 'books_blogs':
      pageTitle = lang === 'hi' ? `पवारी ग्रंथालय, पुस्तकें एवं समीक्षाएं | ${journalTitle}` : `Pawari Literature & Book Reviews | ${journalTitle}`;
      description = lang === 'hi' ? 'पवारी भाषा और संस्कृति के ऐतिहासिक ग्रंथ, शोध पुस्तकें, समीक्षाएं और वैचारिक आलेख।' : 'Explore authentic research monographs, folklore books, book reviews, and academic essays on Pawari heritage.';
      keywords = 'pawari books, pawari literature, book reviews, research monographs, folklore publications';
      break;
    case 'editorial_board':
      pageTitle = lang === 'hi' ? `संपादकीय मण्डल एवं विषय विशेषज्ञ | ${journalTitle}` : `Editorial Board & Reviewers | ${journalTitle}`;
      description = lang === 'hi' ? 'पवारी शोध पत्रिका के मुख्य संरक्षक, प्रधान संपादक, संपादकीय मण्डल एवं अंतरराष्ट्रीय विशेषज्ञ समीक्षा समिति।' : 'Meet the Editor-in-Chief, advisory board, patrons, and international peer review committee of Pawari Shodh Patrika.';
      keywords = 'editorial board, chief editor, advisory board, peer reviewers, academic patrons, Pawari research committee';
      break;
    case 'author_guidelines':
      pageTitle = lang === 'hi' ? `लेखक दिशानिर्देश एवं सबमिशन नियम | ${journalTitle}` : `Author Guidelines & Submission Rules | ${journalTitle}`;
      description = lang === 'hi' ? 'शोध पत्र प्रारूपण नियम, संदर्भ शैली, साहित्यिक चोरी रोकथाम नीति एवं समकक्ष समीक्षा प्रक्रिया।' : 'Manuscript preparation rules, citation style requirements, ethical policies, and submission guidelines for Pawari Shodh Patrika.';
      keywords = 'author guidelines, manuscript preparation, submission guidelines, plagiarism policy, reference style, APA style';
      break;
    case 'submit_manuscript':
      pageTitle = lang === 'hi' ? `ऑनलाइन शोध पत्र सबमिशन | ${journalTitle}` : `Submit Manuscript Online | ${journalTitle}`;
      description = lang === 'hi' ? 'पवारी शोध पत्रिका हेतु अपना शोध पत्र ऑनलाइन प्रस्तुत करें।' : 'Online paper submission portal for authors to submit research manuscripts for peer-reviewed publication.';
      keywords = 'submit manuscript online, paper submission, call for papers, submit research paper, online journal submission';
      break;
    case 'contact':
      pageTitle = lang === 'hi' ? `संपर्क एवं शोध पीठ | ${journalTitle}` : `Contact Editorial Office | ${journalTitle}`;
      description = lang === 'hi' ? 'माँ ताप्ती शोध संस्थान, मुलताई (म.प्र.) - संपर्क सूत्र, ईमेल एवं सम्पादकीय कार्यालय विवरण।' : 'Contact details, publisher address, and editorial office location for Pawari Shodh Patrika at Maa Tapti Research Institute.';
      keywords = 'contact journal, editorial office, Multai Betul address, research institute contact, journal inquiry';
      break;
    case 'pawari_shabdkosh':
      pageTitle = `Pawari Shabdkosh (पवारी शब्दकोश एवं शब्दावली) | ${journalTitle}`;
      description = 'Explore the authentic, comprehensive Pawari dialect dictionary, pronunciation guide, and vocabulary database with Hindi meanings.';
      keywords = 'पवारी शब्दकोश, Pawari dictionary, Pawari vocabulary, Pawari Shabdkosh, Bhoyari words, dialect lexicon';
      break;
    case 'pawari_paheli':
      pageTitle = `Pawari Riddles (पवारी बुझौवल एवं पहेलियाँ) | ${journalTitle}`;
      description = 'Collection of traditional Pawari folk riddles, cultural puzzles, and intellectual heritage with answers and explanations.';
      keywords = 'पवारी पहेली, Pawari riddles, Pawari bujhawal, folklore puzzles, tribal riddles, Betul culture';
      break;
    case 'pawari_lokgeet':
      pageTitle = `Pawari Folk Songs (पवारी लोकगीत एवं पारम्परिक गायन) | ${journalTitle}`;
      description = 'Curated cultural archive of traditional Pawari folk songs, marriage ballads, devotional hymns, and cultural lyrics with Hindi translations.';
      keywords = 'पवारी लोकगीत, Pawari folk songs, Pawari lokgeet lyrics, marriage songs, Tapti cultural music, Betul Chhindwara folklore';
      break;
    case 'pawari_quiz':
      pageTitle = `Pawari Heritage & Culture Quiz (पवारी ज्ञान क्विज़) | ${journalTitle}`;
      description = 'Interactive quiz on Pawari language, culture, geography, and heritage. Earn an authentic e-certificate upon completion!';
      keywords = 'pawari quiz, culture quiz, language test, e-certificate, GK test on Pawari heritage';
      break;
    default:
      pageTitle = `${journalTitle} — ${subtitle || 'International Refereed Journal'}`;
      break;
  }

  const pageUrl = getCanonicalUrl(path);

  document.title = pageTitle;
  addMeta('description', description);
  addMeta('keywords', keywords);
  addMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  addLink('canonical', pageUrl);
  addLink('alternate', pageUrl, 'hi');
  addLink('alternate', pageUrl, 'en');
  addLink('alternate', pageUrl, 'x-default');

  // OpenGraph
  addMeta('og:title', pageTitle, true);
  addMeta('og:description', description, true);
  addMeta('og:type', 'website', true);
  addMeta('og:url', pageUrl, true);
  addMeta('og:site_name', journalTitle, true);
  addMeta('og:locale', lang === 'hi' ? 'hi_IN' : 'en_US', true);
  addMeta('og:locale:alternate', lang === 'hi' ? 'en_US' : 'hi_IN', true);
  const defaultOgImg = settings.logo_url || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=1200';
  addMeta('og:image', defaultOgImg, true);
  addMeta('og:image:alt', pageTitle, true);

  // Twitter
  addMeta('twitter:card', 'summary_large_image');
  addMeta('twitter:title', pageTitle);
  addMeta('twitter:description', description);
  addMeta('twitter:image', defaultOgImg);

  // Breadcrumb items for JSON-LD Structured Data
  const breadcrumbList = [
    {
      '@type': 'ListItem',
      'position': 1,
      'name': lang === 'hi' ? 'मुख्य पृष्ठ' : 'Home',
      'item': DEFAULT_DOMAIN
    }
  ];

  if (view !== 'home') {
    breadcrumbList.push({
      '@type': 'ListItem',
      'position': 2,
      'name': pageTitle.split('|')[0].trim(),
      'item': pageUrl
    });
  }

  // JSON-LD WebSite, Periodical & BreadcrumbList Schema
  addJsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${DEFAULT_DOMAIN}/#website`,
        'url': DEFAULT_DOMAIN,
        'name': journalTitle,
        'description': description,
        'inLanguage': ['hi', 'en'],
        'potentialAction': {
          '@type': 'SearchAction',
          'target': `${DEFAULT_DOMAIN}/articles?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        },
        'publisher': {
          '@type': 'Organization',
          'name': settings.publisher_english || 'Maa Tapti Research Institute, Multai',
          'email': settings.contact_email,
          'logo': settings.logo_url
        }
      },
      {
        '@type': 'Periodical',
        '@id': `${DEFAULT_DOMAIN}/#periodical`,
        'name': journalTitle,
        'alternateName': settings.journal_title_english,
        'issn': [settings.issn_online, settings.issn_print].filter(i => i && i !== 'Applied For'),
        'publisher': {
          '@type': 'Organization',
          'name': settings.publisher_english || 'Maa Tapti Research Institute, Multai',
          'logo': settings.logo_url
        }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        'itemListElement': breadcrumbList
      }
    ]
  });
}
