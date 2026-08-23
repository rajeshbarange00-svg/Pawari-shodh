import React, { useMemo, useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { SafeImage } from './SafeImage';
import { DEFAULT_PAWARI_MEMBER_AVATAR } from '../../data/seedData';
import { EditorialMember } from '../../types';
import { 
  Sparkles, 
  Users, 
  Globe, 
  Award, 
  BookOpen, 
  BookMarked, 
  Mail, 
  Search, 
  GraduationCap, 
  Building, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export interface EditorialBoardDisplayProps {
  variant?: 'full' | 'compact' | 'minimal';
  maxItems?: number;
  showSearch?: boolean;
  showCategories?: boolean;
  filterRole?: 'all' | 'chief' | 'managing' | 'associate' | 'members' | 'advisory';
  className?: string;
  onMemberClick?: (member: EditorialMember) => void;
}

export const getMemberRoleCategory = (member: EditorialMember): 'chief' | 'managing' | 'associate' | 'members' | 'advisory' | 'specialist' => {
  const r = (member.role || member.designation_english || member.designation_hindi || '').toLowerCase();

  // 1. Patrons & Chief Editors
  if (
    r.includes('chief') || 
    r.includes('patron') || 
    r.includes('director') || 
    r.includes('founder') || 
    r.includes('संरक्षक') || 
    r.includes('संस्थापक') || 
    r.includes('मुख्य') || 
    r.includes('अध्यक्ष') || 
    r.includes('निदेशक')
  ) {
    return 'chief';
  }

  // 2. Managing & Executive Editors
  if (
    r.includes('executive') || 
    r.includes('managing') || 
    r.includes('कार्यकारी') || 
    r.includes('प्रबंध')
  ) {
    return 'managing';
  }

  // 3. Associate & Co-Editors
  if (
    r.includes('associate') || 
    r.includes('co-editor') || 
    r.includes('section') || 
    r.includes('सह-संपादक') || 
    r.includes('सह संपादक')
  ) {
    return 'associate';
  }

  // 4. Board Members
  if (
    r.includes('board member') || 
    r.includes('editorial member') || 
    r.includes('member') || 
    r.includes('मंडल सदस्य') || 
    r.includes('सदस्य')
  ) {
    return 'members';
  }

  // 5. Reviewers & Advisory
  if (
    r.includes('advisor') || 
    r.includes('advisory') || 
    r.includes('reviewer') || 
    r.includes('consultant') || 
    r.includes('परामर्श') || 
    r.includes('सलाहकार') || 
    r.includes('समीक्षक')
  ) {
    return 'advisory';
  }

  if (r.includes('editor') || r.includes('संपादक')) {
    return 'associate';
  }

  return 'specialist';
};

export const EditorialBoardDisplay: React.FC<EditorialBoardDisplayProps> = ({
  variant = 'full',
  maxItems,
  showSearch = true,
  showCategories = true,
  filterRole = 'all',
  className = '',
  onMemberClick
}) => {
  const { lang, editorialMembers, setActiveView } = useCms();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(filterRole);

  const sortedMembers = useMemo(() => {
    return [...(editorialMembers || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [editorialMembers]);

  const filteredMembers = useMemo(() => {
    return sortedMembers.filter(m => {
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch = !q || (
        (m.name_hindi && m.name_hindi.toLowerCase().includes(q)) ||
        (m.name_english && m.name_english.toLowerCase().includes(q)) ||
        (m.role && m.role.toLowerCase().includes(q)) ||
        (m.designation_hindi && m.designation_hindi.toLowerCase().includes(q)) ||
        (m.designation_english && m.designation_english.toLowerCase().includes(q)) ||
        (m.affiliation_hindi && m.affiliation_hindi.toLowerCase().includes(q)) ||
        (m.affiliation_english && m.affiliation_english.toLowerCase().includes(q)) ||
        (m.email && m.email.toLowerCase().includes(q)) ||
        (m.research_areas && m.research_areas.some(a => a.toLowerCase().includes(q))) ||
        (m.subject_areas && m.subject_areas.some(a => a.toLowerCase().includes(q)))
      );

      if (!matchesSearch) return false;
      if (selectedCategory === 'all') return true;
      return getMemberRoleCategory(m) === selectedCategory;
    });
  }, [sortedMembers, searchTerm, selectedCategory]);

  const displayList = useMemo(() => {
    if (maxItems && maxItems > 0) {
      return filteredMembers.slice(0, maxItems);
    }
    return filteredMembers;
  }, [filteredMembers, maxItems]);

  const groupedSections = useMemo(() => {
    const chief = sortedMembers.filter(m => getMemberRoleCategory(m) === 'chief');
    const managing = sortedMembers.filter(m => getMemberRoleCategory(m) === 'managing');
    const associate = sortedMembers.filter(m => getMemberRoleCategory(m) === 'associate');
    const members = sortedMembers.filter(m => getMemberRoleCategory(m) === 'members');
    const advisory = sortedMembers.filter(m => getMemberRoleCategory(m) === 'advisory');
    const specialist = sortedMembers.filter(m => getMemberRoleCategory(m) === 'specialist');

    const sections = [];

    if (chief.length > 0) {
      sections.push({
        id: 'chief',
        titleHi: 'संरक्षक एवं मुख्य संपादन मंडल',
        titleEn: 'Patrons & Chief Editorial Board',
        icon: Sparkles,
        iconColor: 'text-amber-600',
        members: chief
      });
    }

    if (managing.length > 0) {
      sections.push({
        id: 'managing',
        titleHi: 'प्रबंध एवं कार्यकारी संपादक',
        titleEn: 'Executive & Managing Editors',
        icon: BookMarked,
        iconColor: 'text-red-800',
        members: managing
      });
    }

    if (associate.length > 0) {
      sections.push({
        id: 'associate',
        titleHi: 'सह-संपादक एवं खंड संपादन मंडल',
        titleEn: 'Associate & Section Editors',
        icon: BookOpen,
        iconColor: 'text-amber-700',
        members: associate
      });
    }

    if (members.length > 0) {
      sections.push({
        id: 'members',
        titleHi: 'संपादकीय मंडल सदस्य',
        titleEn: 'Editorial Board Members',
        icon: Users,
        iconColor: 'text-indigo-700',
        members: members
      });
    }

    if (advisory.length > 0) {
      sections.push({
        id: 'advisory',
        titleHi: 'अंतर्राष्ट्रीय अकादमिक परामर्शदाता एवं समीक्षा परिषद',
        titleEn: 'Editorial Advisory Board & Peer Reviewers',
        icon: Globe,
        iconColor: 'text-sky-700',
        members: advisory
      });
    }

    if (specialist.length > 0) {
      sections.push({
        id: 'specialist',
        titleHi: 'विद्वत विशेषज्ञ एवं विशिष्ट पद',
        titleEn: 'Specialist Advisors & Honorary Roles',
        icon: Award,
        iconColor: 'text-emerald-700',
        members: specialist
      });
    }

    return sections;
  }, [sortedMembers]);

  // Render Compact / Minimal Variant
  if (variant === 'compact' || variant === 'minimal') {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayList.map((member) => (
            <div 
              key={member.id}
              onClick={() => onMemberClick ? onMemberClick(member) : undefined}
              className="gloss-3d-card p-4 rounded-2xl space-y-3 flex flex-col items-center text-center group transition duration-200"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-amber-400/80 shadow-md bg-stone-900 shrink-0 group-hover:scale-105 transition duration-200">
                <SafeImage
                  src={member.photo_url || DEFAULT_PAWARI_MEMBER_AVATAR}
                  alt={member.name_english || member.name_hindi || 'Editorial Board Member'}
                  className="w-full h-full object-cover"
                  fallbackSrc={DEFAULT_PAWARI_MEMBER_AVATAR}
                  showFallbackIconOnFail={true}
                />
              </div>

              <div className="space-y-1 w-full">
                <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold border border-amber-200 inline-block truncate max-w-full">
                  {member.role || 'Board Member'}
                </span>
                <h4 className="font-serif font-bold text-stone-900 text-sm mt-1 line-clamp-1">
                  {lang === 'hi' ? member.name_hindi : member.name_english}
                </h4>
                <p className="text-[11px] text-stone-600 line-clamp-2 leading-tight">
                  {lang === 'hi' ? member.designation_hindi : member.designation_english}
                </p>
                <p className="text-[10px] text-stone-500 line-clamp-1">
                  {lang === 'hi' ? member.affiliation_hindi : member.affiliation_english}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render Member Card for Full Variant
  const renderCard = (member: EditorialMember) => (
    <div 
      key={member.id}
      onClick={() => onMemberClick ? onMemberClick(member) : undefined}
      className="bg-white border border-amber-900/15 hover:border-amber-400/80 rounded-3xl p-5 sm:p-6 shadow-2xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-950 via-amber-500 to-amber-700 opacity-80" />

      <div className="space-y-4">
        <div className="flex items-start space-x-3.5 sm:space-x-4">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-md flex-shrink-0 bg-amber-50 group-hover:scale-105 transition transform duration-200">
            <SafeImage 
              src={member.photo_url || DEFAULT_PAWARI_MEMBER_AVATAR} 
              alt={member.name_english || member.name_hindi || 'Editorial Board Member'} 
              loading="lazy"
              decoding="async"
              width={80}
              height={80}
              className="w-full h-full object-cover"
              fallbackSrc={DEFAULT_PAWARI_MEMBER_AVATAR}
            />
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold uppercase bg-amber-500/20 text-red-950 px-2.5 py-0.5 rounded-full inline-block border border-amber-400/40 truncate max-w-full">
                {member.role || 'Editorial Member'}
              </span>
              {typeof member.order === 'number' && (
                <span className="text-[10px] font-mono text-slate-400 font-bold">
                  #{member.order}
                </span>
              )}
            </div>

            <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900 group-hover:text-red-950 transition leading-snug">
              {lang === 'hi' ? member.name_hindi : member.name_english}
            </h3>

            <p className="text-xs text-amber-900 font-semibold flex items-center space-x-1.5 leading-snug">
              <GraduationCap className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>{lang === 'hi' ? member.designation_hindi : member.designation_english}</span>
            </p>
          </div>
        </div>

        {/* Affiliation & Department */}
        <div className="space-y-1.5 text-xs text-slate-600 bg-amber-50/50 p-3 rounded-2xl border border-amber-900/10">
          <div className="flex items-start space-x-2">
            <Building className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
            <span className="leading-tight text-slate-800 font-medium">
              {lang === 'hi' ? member.affiliation_hindi : member.affiliation_english}
            </span>
          </div>

          {member.email && (
            <div className="flex items-center space-x-2 pt-1 border-t border-amber-900/10">
              <Mail className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <a 
                href={`mailto:${member.email}`}
                className="font-mono text-red-900 hover:underline truncate text-[11px]"
              >
                {member.email}
              </a>
            </div>
          )}
        </div>

        {/* Research / Subject Areas Tags */}
        {((member.research_areas && member.research_areas.length > 0) || (member.subject_areas && member.subject_areas.length > 0)) && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">
              {lang === 'hi' ? 'विशेषज्ञता क्षेत्र (Specialization):' : 'Specialization & Expertise:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[...(member.research_areas || []), ...(member.subject_areas || [])].slice(0, 4).map((area, idx) => (
                <span 
                  key={idx} 
                  className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 font-medium"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Verified Seal */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center space-x-1 text-emerald-700 font-medium font-sans">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{lang === 'hi' ? 'मान्यता प्राप्त विद्वान' : 'Peer-Review Certified'}</span>
        </span>
        <span className="text-[10px] font-mono text-slate-400">
          Pawari Shodh Patrika
        </span>
      </div>
    </div>
  );

  return (
    <div className={`space-y-8 ${className}`}>
      
      {/* Search & Categories Toolbar */}
      {(showSearch || showCategories) && (
        <div className="gloss-3d-card rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {showSearch && (
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={lang === 'hi' ? 'नाम, पद, संस्था या विषय से खोजें...' : 'Search by name, role, institution...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/95 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-amber-500 shadow-inner"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-stone-700"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}

            {showCategories && (
              <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
                {[
                  { id: 'all', labelHi: 'समस्त', labelEn: 'All' },
                  { id: 'chief', labelHi: 'संरक्षक व मुख्य संपादक', labelEn: 'Chief & Patrons' },
                  { id: 'managing', labelHi: 'कार्यकारी संपादक', labelEn: 'Managing' },
                  { id: 'associate', labelHi: 'सह-संपादक', labelEn: 'Associate' },
                  { id: 'members', labelHi: 'मंडल सदस्य', labelEn: 'Members' },
                  { id: 'advisory', labelHi: 'परामर्शदाता', labelEn: 'Advisory' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'gloss-3d-btn-maroon'
                        : 'gloss-3d-btn-secondary text-stone-700'
                    }`}
                  >
                    {lang === 'hi' ? cat.labelHi : cat.labelEn}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grid or Section Layout */}
      {selectedCategory === 'all' && !searchTerm.trim() ? (
        <div className="space-y-10">
          {groupedSections.map(section => (
            <div key={section.id} className="space-y-4">
              <div className="flex items-center space-x-2 border-b-2 border-red-950/20 pb-2">
                <section.icon className={`w-5 h-5 ${section.iconColor}`} />
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-red-950">
                  {lang === 'hi' ? section.titleHi : section.titleEn}
                </h3>
                <span className="text-xs font-mono font-bold bg-amber-500/20 text-red-950 px-2.5 py-0.5 rounded-full ml-auto">
                  {section.members.length}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.members.map(renderCard)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-600 font-mono pb-2 border-b border-stone-200">
            <span>
              {lang === 'hi' ? 'खोज परिणाम' : 'Displaying'}: <strong className="text-red-950">{filteredMembers.length}</strong> {lang === 'hi' ? 'विद्वान सदस्य' : 'editorial scholars'}
            </span>
          </div>

          {filteredMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map(renderCard)}
            </div>
          ) : (
            <div className="gloss-3d-card p-12 rounded-3xl text-center space-y-3">
              <p className="text-sm font-bold text-stone-700">
                {lang === 'hi' ? 'कोई संपादकीय सदस्य नहीं मिला।' : 'No editorial board members matched your search.'}
              </p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                className="gloss-3d-btn-primary px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                {lang === 'hi' ? 'फ़िल्टर हटाएं' : 'Clear Filters'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
