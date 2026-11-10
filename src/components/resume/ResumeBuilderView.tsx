import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  Upload, 
  Trash2, 
  Plus, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  FileText, 
  Check, 
  User, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  FolderGit2, 
  ChevronDown, 
  ChevronUp,
  FileDown,
  FileUp,
  Sparkles,
  Layout,
  Mail,
  Phone,
  MapPin,
  Globe,
  Building2,
  Calendar,
  Award,
  BookOpen,
  Code2,
  Layers,
  FileArchive
} from 'lucide-react';
import { ResumeData, ResumeExperience, ResumeEducation, ResumeProject, ToolId } from '../../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const LinkedinIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

interface ResumeBuilderViewProps {
  onBack: () => void;
  onNavigateToTool?: (toolId: ToolId) => void;
  theme?: 'dark' | 'light';
}

const SAMPLE_PHOTO = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23111111'/%3E%3Ccircle cx='100' cy='75' r='38' fill='%23e5e5e5'/%3E%3Cpath d='M35 175 C 40 120, 160 120, 165 175 Z' fill='%23e5e5e5'/%3E%3C/svg%3E";

const INITIAL_RESUME_DATA: ResumeData = {
  personal: {
    fullName: 'Alexander Vance',
    title: 'Senior Systems Architect & Product Engineer',
    email: 'alexander.vance@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    website: 'https://alexvance.dev',
    linkedin: 'linkedin.com/in/alexandervance',
    github: 'github.com/alexvance',
    photoUrl: SAMPLE_PHOTO,
    showPhoto: true,
    photoShape: 'circle'
  },
  summary: 'Senior Architect with 8+ years leading distributed systems engineering and client-side infrastructure. Specialist in high-performance web applications, zero-trust security architecture, and developer platforms. Proven record of cutting infrastructure latency by 45% and scaling products to 2M+ active users.',
  experience: [
    {
      id: 'exp-1',
      company: 'Aether Systems Labs',
      role: 'Staff Architect & Team Lead',
      location: 'San Francisco, CA',
      startDate: '2022',
      endDate: 'Present',
      current: true,
      bullets: [
        'Architected end-to-end client-side document engine processing 500k+ daily operations with zero server roundtrips.',
        'Mentored 12 senior and mid-level engineers across distributed micro-frontends and core platforms.',
        'Reduced enterprise P99 pipeline latency from 1.2s to 180ms via WebAssembly offloading.'
      ]
    },
    {
      id: 'exp-2',
      company: 'Veloce Data Infrastructure',
      role: 'Senior Software Engineer',
      location: 'New York, NY',
      startDate: '2019',
      endDate: '2022',
      current: false,
      bullets: [
        'Designed real-time streaming ETL pipeline handling 40,000 events/sec with fault-tolerant checkpointing.',
        'Led migration of monolith billing microservices to event-driven serverless architecture.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'University of California, Berkeley',
      degree: 'B.S. in Computer Science & Applied Mathematics',
      location: 'Berkeley, CA',
      startDate: '2015',
      endDate: '2019',
      gpaOrHonors: 'Summa Cum Laude, Dean\'s Honors List'
    }
  ],
  skills: [
    {
      category: 'Languages & Core',
      items: ['TypeScript', 'Rust', 'Python', 'Go', 'SQL']
    },
    {
      category: 'Frameworks & Platforms',
      items: ['React', 'Node.js', 'Next.js', 'Tailwind CSS', 'Docker', 'PostgreSQL']
    },
    {
      category: 'Architectural Focus',
      items: ['Zero-Knowledge Architecture', 'Distributed Systems', 'Client-Side WASM', 'CI/CD']
    }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Vayun Client Engine',
      link: 'github.com/alexvance/vayun-engine',
      date: '2024',
      description: 'Open-source zero-upload document and PDF stream manipulation utility built with TypeScript and WASM.'
    }
  ],
  template: 'classic'
};

const BLANK_RESUME_DATA: ResumeData = {
  personal: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    photoUrl: '',
    showPhoto: false,
    photoShape: 'circle'
  },
  summary: '',
  experience: [],
  education: [],
  skills: [
    { category: 'Skills', items: [] }
  ],
  projects: [],
  template: 'classic'
};

export const ResumeBuilderView: React.FC<ResumeBuilderViewProps> = ({
  onBack,
  onNavigateToTool,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  const [data, setData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem('vayun_resume_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_RESUME_DATA;
      }
    }
    return INITIAL_RESUME_DATA;
  });

  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'settings'>('personal');
  const [mobileViewMode, setMobileViewMode] = useState<'editor' | 'preview'>('editor');
  const [isExporting, setIsExporting] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const resumePreviewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonImportRef = useRef<HTMLInputElement>(null);

  // Auto-save to LocalStorage
  const updateData = (updater: (prev: ResumeData) => ResumeData) => {
    setData(prev => {
      const updated = updater(prev);
      localStorage.setItem('vayun_resume_data', JSON.stringify(updated));
      return updated;
    });
  };

  // Image Upload Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, or WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      updateData(prev => ({
        ...prev,
        personal: {
          ...prev.personal,
          photoUrl: result,
          showPhoto: true
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    updateData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        photoUrl: '',
        showPhoto: false
      }
    }));
  };

  // Add / Edit / Remove Experience
  const handleAddExperience = () => {
    const newExp: ResumeExperience = {
      id: `exp-${Date.now()}`,
      company: 'Company Name',
      role: 'Job Title',
      location: 'Location',
      startDate: '2023',
      endDate: 'Present',
      current: true,
      bullets: ['Describe your core accomplishment, metric, or project deliverable.']
    };
    updateData(prev => ({
      ...prev,
      experience: [newExp, ...prev.experience]
    }));
  };

  const handleUpdateExperience = (id: string, field: keyof ResumeExperience, value: any) => {
    updateData(prev => ({
      ...prev,
      experience: prev.experience.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const handleRemoveExperience = (id: string) => {
    updateData(prev => ({
      ...prev,
      experience: prev.experience.filter(item => item.id !== id)
    }));
  };

  const handleAddBullet = (expId: string) => {
    updateData(prev => ({
      ...prev,
      experience: prev.experience.map(item => {
        if (item.id === expId) {
          return { ...item, bullets: [...item.bullets, 'New measurable impact or key achievement.'] };
        }
        return item;
      })
    }));
  };

  const handleUpdateBullet = (expId: string, index: number, text: string) => {
    updateData(prev => ({
      ...prev,
      experience: prev.experience.map(item => {
        if (item.id === expId) {
          const newBullets = [...item.bullets];
          newBullets[index] = text;
          return { ...item, bullets: newBullets };
        }
        return item;
      })
    }));
  };

  const handleRemoveBullet = (expId: string, index: number) => {
    updateData(prev => ({
      ...prev,
      experience: prev.experience.map(item => {
        if (item.id === expId) {
          return { ...item, bullets: item.bullets.filter((_, i) => i !== index) };
        }
        return item;
      })
    }));
  };

  // Add / Edit / Remove Education
  const handleAddEducation = () => {
    const newEdu: ResumeEducation = {
      id: `edu-${Date.now()}`,
      institution: 'University or College',
      degree: 'Degree and Major',
      location: 'City, State',
      startDate: '2019',
      endDate: '2023',
      gpaOrHonors: ''
    };
    updateData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const handleUpdateEducation = (id: string, field: keyof ResumeEducation, value: any) => {
    updateData(prev => ({
      ...prev,
      education: prev.education.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const handleRemoveEducation = (id: string) => {
    updateData(prev => ({
      ...prev,
      education: prev.education.filter(item => item.id !== id)
    }));
  };

  // Skills
  const handleAddSkillCategory = () => {
    updateData(prev => ({
      ...prev,
      skills: [...prev.skills, { category: 'Category', items: ['Skill 1', 'Skill 2'] }]
    }));
  };

  const handleUpdateSkillCategoryName = (index: number, name: string) => {
    updateData(prev => {
      const nextSkills = [...prev.skills];
      nextSkills[index] = { ...nextSkills[index], category: name };
      return { ...prev, skills: nextSkills };
    });
  };

  const handleUpdateSkillItems = (index: number, commaSeparated: string) => {
    const items = commaSeparated.split(',').map(s => s.trim()).filter(Boolean);
    updateData(prev => {
      const nextSkills = [...prev.skills];
      nextSkills[index] = { ...nextSkills[index], items };
      return { ...prev, skills: nextSkills };
    });
  };

  const handleRemoveSkillCategory = (index: number) => {
    updateData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  // Projects
  const handleAddProject = () => {
    const newProj: ResumeProject = {
      id: `proj-${Date.now()}`,
      name: 'Project Name',
      link: 'github.com/user/project',
      date: '2024',
      description: 'Brief description of system architecture, technology stack, and outcome.'
    };
    updateData(prev => ({
      ...prev,
      projects: [...prev.projects, newProj]
    }));
  };

  const handleUpdateProject = (id: string, field: keyof ResumeProject, value: any) => {
    updateData(prev => ({
      ...prev,
      projects: prev.projects.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const handleRemoveProject = (id: string) => {
    updateData(prev => ({
      ...prev,
      projects: prev.projects.filter(item => item.id !== id)
    }));
  };

  // Download PDF via html2canvas & jsPDF
  const handleDownloadPdf = async () => {
    if (!resumePreviewRef.current) return;
    setIsExporting(true);

    try {
      const element = resumePreviewRef.current;
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const safeName = (data.personal.fullName || 'Resume').replace(/[^a-zA-Z0-9_-]/g, '_');
      pdf.save(`${safeName}_Resume.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('Unable to export PDF. You can also use the Print button to Save as PDF directly.');
    } finally {
      setIsExporting(false);
    }
  };

  // Print directly (Vector Print)
  const handlePrint = () => {
    window.print();
  };

  // Export JSON
  const handleExportJson = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(data.personal.fullName || 'resume').toLowerCase().replace(/\s+/g, '_')}_profile.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.personal && parsed.experience) {
          setData(parsed);
          localStorage.setItem('vayun_resume_data', JSON.stringify(parsed));
        } else {
          alert('Invalid resume JSON format.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800 no-print">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className={`p-1.5 rounded-md border transition-colors ${
              isLight
                ? 'border-neutral-200 text-neutral-600 hover:text-black hover:bg-neutral-100'
                : 'border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className={`text-xl font-serif font-medium tracking-tight ${isLight ? 'text-black' : 'text-white'}`}>
              Resume Builder
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              100% in-browser generation with photo support and instant PDF export.
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => updateData(() => INITIAL_RESUME_DATA)}
            className={`px-3 py-1.5 rounded text-xs font-mono border transition-colors flex items-center gap-1.5 ${
              isLight ? 'border-neutral-200 text-neutral-600 hover:bg-neutral-100' : 'border-neutral-800 text-neutral-400 hover:bg-neutral-900'
            }`}
            title="Load sample executive profile"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Sample Profile
          </button>

          <button
            onClick={() => updateData(() => BLANK_RESUME_DATA)}
            className={`px-3 py-1.5 rounded text-xs font-mono border transition-colors flex items-center gap-1.5 ${
              isLight ? 'border-neutral-200 text-neutral-600 hover:bg-neutral-100' : 'border-neutral-800 text-neutral-400 hover:bg-neutral-900'
            }`}
            title="Clear all fields"
          >
            Clear
          </button>

          <button
            onClick={handleExportJson}
            className={`px-3 py-1.5 rounded text-xs font-mono border transition-colors flex items-center gap-1.5 ${
              isLight ? 'border-neutral-200 text-neutral-600 hover:bg-neutral-100' : 'border-neutral-800 text-neutral-400 hover:bg-neutral-900'
            }`}
            title="Export JSON backup"
          >
            <FileDown className="w-3.5 h-3.5" />
            Backup
          </button>

          <label
            className={`px-3 py-1.5 rounded text-xs font-mono border transition-colors flex items-center gap-1.5 cursor-pointer ${
              isLight ? 'border-neutral-200 text-neutral-600 hover:bg-neutral-100' : 'border-neutral-800 text-neutral-400 hover:bg-neutral-900'
            }`}
            title="Restore from JSON"
          >
            <FileUp className="w-3.5 h-3.5" />
            Restore
            <input
              ref={jsonImportRef}
              type="file"
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />
          </label>

          <button
            onClick={handlePrint}
            className={`px-3 py-1.5 rounded text-xs font-mono border transition-colors flex items-center gap-1.5 ${
              isLight ? 'border-neutral-200 text-neutral-600 hover:bg-neutral-100' : 'border-neutral-800 text-neutral-400 hover:bg-neutral-900'
            }`}
            title="Vector Print or Browser Save-to-PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className={`px-4 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-2 ${
              isLight
                ? 'bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-300'
                : 'bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-800'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            {isExporting ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* Choice of 6 Professional Resume Formats */}
      <div className={`p-3 rounded-xl border mt-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 no-print ${
        isLight ? 'bg-neutral-50/80 border-neutral-200' : 'bg-neutral-950 border-neutral-800'
      }`}>
        <div className="flex items-center gap-2 shrink-0">
          <Layout className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider">
            Resume Format (6 Styles):
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
          {[
            { id: 'classic', label: 'Classic Executive' },
            { id: 'modern', label: 'Modern Tech' },
            { id: 'two-column', label: 'Two-Column Split' },
            { id: 'minimal', label: 'Minimalist Swiss' },
            { id: 'technical', label: 'Engineering ATS' },
            { id: 'academic', label: 'Academic CV' }
          ].map(tmpl => (
            <button
              key={tmpl.id}
              onClick={() => updateData(prev => ({ ...prev, template: tmpl.id as any }))}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 active:scale-95 ${
                data.template === tmpl.id
                  ? isLight
                    ? 'bg-black text-white font-semibold shadow-xs'
                    : 'bg-white text-black font-semibold shadow-xs'
                  : isLight
                    ? 'border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700'
                    : 'border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              <span>{tmpl.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Screen Segmented Switcher (Editor vs Preview) */}
      <div className={`flex lg:hidden items-center p-1 rounded-lg border mt-4 mb-2 w-full text-xs font-mono no-print ${
        isLight ? 'bg-neutral-100 border-neutral-200' : 'bg-neutral-950 border-neutral-800'
      }`}>
        <button
          onClick={() => setMobileViewMode('editor')}
          className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors ${
            mobileViewMode === 'editor'
              ? isLight ? 'bg-black text-white font-medium shadow-sm' : 'bg-white text-black font-medium shadow-sm'
              : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Edit Details
        </button>
        <button
          onClick={() => setMobileViewMode('preview')}
          className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors ${
            mobileViewMode === 'preview'
              ? isLight ? 'bg-black text-white font-medium shadow-sm' : 'bg-white text-black font-medium shadow-sm'
              : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          Preview Document
        </button>
      </div>

      {/* Main Split Grid: Left Editor | Right Live A4 Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
        {/* Left Column: Form Controls (5 cols) */}
        <div className={`lg:col-span-5 space-y-4 no-print ${
          mobileViewMode === 'editor' ? 'block' : 'hidden lg:block'
        }`}>
          {/* Section Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-neutral-800 text-xs">
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-3 py-1.5 rounded-t font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'personal'
                  ? isLight ? 'bg-neutral-100 text-black border-b-2 border-black' : 'bg-neutral-900 text-white border-b-2 border-white'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Personal
            </button>
            <button
              onClick={() => setActiveTab('experience')}
              className={`px-3 py-1.5 rounded-t font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'experience'
                  ? isLight ? 'bg-neutral-100 text-black border-b-2 border-black' : 'bg-neutral-900 text-white border-b-2 border-white'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Experience ({data.experience.length})
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`px-3 py-1.5 rounded-t font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'education'
                  ? isLight ? 'bg-neutral-100 text-black border-b-2 border-black' : 'bg-neutral-900 text-white border-b-2 border-white'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Education
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`px-3 py-1.5 rounded-t font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'skills'
                  ? isLight ? 'bg-neutral-100 text-black border-b-2 border-black' : 'bg-neutral-900 text-white border-b-2 border-white'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Skills
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-3 py-1.5 rounded-t font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'projects'
                  ? isLight ? 'bg-neutral-100 text-black border-b-2 border-black' : 'bg-neutral-900 text-white border-b-2 border-white'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              Projects
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1.5 rounded-t font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'settings'
                  ? isLight ? 'bg-neutral-100 text-black border-b-2 border-black' : 'bg-neutral-900 text-white border-b-2 border-white'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              Layout
            </button>
          </div>

          {/* Tab 1: Personal Details & Photo */}
          {activeTab === 'personal' && (
            <div className={`p-4 rounded-lg border space-y-4 ${
              isLight ? 'bg-neutral-50/70 border-neutral-200' : 'bg-neutral-950 border-neutral-900'
            }`}>
              {/* Photo Upload Section */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 block">
                  Profile Photo
                </label>
                <div className="flex items-center gap-4">
                  {data.personal.photoUrl ? (
                    <div className="relative group">
                      <img
                        src={data.personal.photoUrl}
                        alt="Profile preview"
                        className={`w-16 h-16 object-cover border ${
                          data.personal.photoShape === 'circle' ? 'rounded-full' :
                          data.personal.photoShape === 'rounded' ? 'rounded-lg' : 'rounded-none'
                        } ${isLight ? 'border-neutral-300' : 'border-neutral-700'}`}
                      />
                      <button
                        onClick={handleRemovePhoto}
                        className="absolute -top-1 -right-1 p-1 rounded-full bg-neutral-900 text-white hover:bg-neutral-700 border border-neutral-700"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className={`w-16 h-16 rounded-full border border-dashed flex items-center justify-center ${
                      isLight ? 'border-neutral-300 bg-neutral-100 text-neutral-400' : 'border-neutral-800 bg-neutral-900 text-neutral-600'
                    }`}>
                      <User className="w-6 h-6 stroke-[1.5]" />
                    </div>
                  )}

                  <div className="space-y-1.5 text-xs flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`px-3 py-1 rounded border text-xs font-mono transition-colors ${
                          isLight ? 'border-neutral-300 hover:bg-neutral-200' : 'border-neutral-700 hover:bg-neutral-800'
                        }`}
                      >
                        {data.personal.photoUrl ? 'Change Photo' : 'Upload Photo'}
                      </button>

                      {data.personal.photoUrl && (
                        <button
                          type="button"
                          onClick={() => updateData(prev => ({
                            ...prev,
                            personal: { ...prev.personal, showPhoto: !prev.personal.showPhoto }
                          }))}
                          className={`px-2.5 py-1 rounded border text-xs font-mono flex items-center gap-1 transition-colors ${
                            data.personal.showPhoto
                              ? isLight ? 'bg-black text-white border-black' : 'bg-white text-black border-white'
                              : isLight ? 'border-neutral-300 text-neutral-500' : 'border-neutral-800 text-neutral-500'
                          }`}
                        >
                          {data.personal.showPhoto ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {data.personal.showPhoto ? 'Visible' : 'Hidden'}
                        </button>
                      )}
                    </div>

                    {data.personal.photoUrl && (
                      <div className="flex items-center gap-1 text-[11px] text-neutral-400 pt-1">
                        <span>Shape:</span>
                        {(['circle', 'rounded', 'square'] as const).map(shape => (
                          <button
                            key={shape}
                            onClick={() => updateData(prev => ({
                              ...prev,
                              personal: { ...prev.personal, photoShape: shape }
                            }))}
                            className={`px-2 py-0.5 rounded capitalize ${
                              data.personal.photoShape === shape
                                ? isLight ? 'bg-neutral-200 text-black font-medium' : 'bg-neutral-800 text-white font-medium'
                                : 'text-neutral-500 hover:text-neutral-300'
                            }`}
                          >
                            {shape}
                          </button>
                        ))}
                      </div>
                    )}
                    <p className="text-[10px] text-neutral-500">
                      Recommended: High-resolution headshot. Zero server upload.
                    </p>
                  </div>
                </div>
              </div>

              {/* Text Fields */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-[11px] font-mono uppercase text-neutral-400 flex items-center gap-1.5 mb-1">
                    <User className="w-3 h-3 text-neutral-400" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={data.personal.fullName}
                    onChange={e => updateData(prev => ({
                      ...prev,
                      personal: { ...prev.personal, fullName: e.target.value }
                    }))}
                    placeholder="e.g. Alexander Vance"
                    className={`w-full px-3 py-1.5 rounded text-xs focus:outline-none transition-colors ${
                      isLight ? 'bg-white border border-neutral-300 text-black focus:border-black' : 'bg-black border border-neutral-800 text-white focus:border-neutral-500'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-neutral-400 flex items-center gap-1.5 mb-1">
                    <Briefcase className="w-3 h-3 text-neutral-400" />
                    Professional Headline / Title *
                  </label>
                  <input
                    type="text"
                    value={data.personal.title}
                    onChange={e => updateData(prev => ({
                      ...prev,
                      personal: { ...prev.personal, title: e.target.value }
                    }))}
                    placeholder="e.g. Senior Software Architect"
                    className={`w-full px-3 py-1.5 rounded text-xs focus:outline-none transition-colors ${
                      isLight ? 'bg-white border border-neutral-300 text-black focus:border-black' : 'bg-black border border-neutral-800 text-white focus:border-neutral-500'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono uppercase text-neutral-400 flex items-center gap-1.5 mb-1">
                      <Mail className="w-3 h-3 text-neutral-400" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={data.personal.email}
                      onChange={e => updateData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, email: e.target.value }
                      }))}
                      placeholder="alex@domain.com"
                      className={`w-full px-3 py-1.5 rounded text-xs focus:outline-none transition-colors ${
                        isLight ? 'bg-white border border-neutral-300 text-black focus:border-black' : 'bg-black border border-neutral-800 text-white focus:border-neutral-500'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono uppercase text-neutral-400 flex items-center gap-1.5 mb-1">
                      <Phone className="w-3 h-3 text-neutral-400" />
                      Phone
                    </label>
                    <input
                      type="text"
                      value={data.personal.phone}
                      onChange={e => updateData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, phone: e.target.value }
                      }))}
                      placeholder="+1 (555) 000-0000"
                      className={`w-full px-3 py-1.5 rounded text-xs focus:outline-none transition-colors ${
                        isLight ? 'bg-white border border-neutral-300 text-black focus:border-black' : 'bg-black border border-neutral-800 text-white focus:border-neutral-500'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono uppercase text-neutral-400 flex items-center gap-1.5 mb-1">
                      <MapPin className="w-3 h-3 text-neutral-400" />
                      Location
                    </label>
                    <input
                      type="text"
                      value={data.personal.location}
                      onChange={e => updateData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, location: e.target.value }
                      }))}
                      placeholder="City, Country"
                      className={`w-full px-3 py-1.5 rounded text-xs focus:outline-none transition-colors ${
                        isLight ? 'bg-white border border-neutral-300 text-black focus:border-black' : 'bg-black border border-neutral-800 text-white focus:border-neutral-500'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono uppercase text-neutral-400 flex items-center gap-1.5 mb-1">
                      <Globe className="w-3 h-3 text-neutral-400" />
                      Website / Portfolio
                    </label>
                    <input
                      type="text"
                      value={data.personal.website}
                      onChange={e => updateData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, website: e.target.value }
                      }))}
                      placeholder="alex.dev"
                      className={`w-full px-3 py-1.5 rounded text-xs focus:outline-none transition-colors ${
                        isLight ? 'bg-white border border-neutral-300 text-black focus:border-black' : 'bg-black border border-neutral-800 text-white focus:border-neutral-500'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono uppercase text-neutral-400 flex items-center gap-1.5 mb-1">
                      <LinkedinIcon className="w-3 h-3 text-neutral-400" />
                      LinkedIn
                    </label>
                    <input
                      type="text"
                      value={data.personal.linkedin}
                      onChange={e => updateData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, linkedin: e.target.value }
                      }))}
                      placeholder="linkedin.com/in/username"
                      className={`w-full px-3 py-1.5 rounded text-xs focus:outline-none transition-colors ${
                        isLight ? 'bg-white border border-neutral-300 text-black focus:border-black' : 'bg-black border border-neutral-800 text-white focus:border-neutral-500'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono uppercase text-neutral-400 flex items-center gap-1.5 mb-1">
                      <GithubIcon className="w-3 h-3 text-neutral-400" />
                      GitHub
                    </label>
                    <input
                      type="text"
                      value={data.personal.github}
                      onChange={e => updateData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, github: e.target.value }
                      }))}
                      placeholder="github.com/username"
                      className={`w-full px-3 py-1.5 rounded text-xs focus:outline-none transition-colors ${
                        isLight ? 'bg-white border border-neutral-300 text-black focus:border-black' : 'bg-black border border-neutral-800 text-white focus:border-neutral-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Professional Summary */}
                <div className="pt-2">
                  <label className="text-[11px] font-mono uppercase text-neutral-400 flex items-center gap-1.5 mb-1">
                    <FileText className="w-3 h-3 text-neutral-400" />
                    Executive Summary / Bio
                  </label>
                  <textarea
                    rows={4}
                    value={data.summary}
                    onChange={e => updateData(prev => ({ ...prev, summary: e.target.value }))}
                    placeholder="Highlight your years of experience, core technical pillars, and major achievements..."
                    className={`w-full p-2.5 rounded text-xs leading-relaxed focus:outline-none transition-colors ${
                      isLight ? 'bg-white border border-neutral-300 text-black focus:border-black' : 'bg-black border border-neutral-800 text-white focus:border-neutral-500'
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Experience */}
          {activeTab === 'experience' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400 font-mono">Work History</span>
                <button
                  onClick={handleAddExperience}
                  className={`px-2.5 py-1 rounded border text-xs font-mono flex items-center gap-1 transition-colors ${
                    isLight ? 'border-neutral-300 hover:bg-neutral-200' : 'border-neutral-700 hover:bg-neutral-800'
                  }`}
                >
                  <Plus className="w-3 h-3" />
                  Add Position
                </button>
              </div>

              {data.experience.map((exp, idx) => (
                <div
                  key={exp.id}
                  className={`p-3.5 rounded-lg border space-y-3 ${
                    isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-950 border-neutral-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-neutral-500">Position #{idx + 1}</span>
                    <button
                      onClick={() => handleRemoveExperience(exp.id)}
                      className="text-neutral-500 hover:text-red-400 p-1 transition-colors"
                      title="Delete Position"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-0.5">Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={e => handleUpdateExperience(exp.id, 'company', e.target.value)}
                        className={`w-full px-2.5 py-1 rounded text-xs focus:outline-none ${
                          isLight ? 'bg-white border border-neutral-300 text-black' : 'bg-black border border-neutral-800 text-white'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-0.5">Role / Title</label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={e => handleUpdateExperience(exp.id, 'role', e.target.value)}
                        className={`w-full px-2.5 py-1 rounded text-xs focus:outline-none ${
                          isLight ? 'bg-white border border-neutral-300 text-black' : 'bg-black border border-neutral-800 text-white'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-0.5">Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={e => handleUpdateExperience(exp.id, 'startDate', e.target.value)}
                        placeholder="2021"
                        className={`w-full px-2 py-1 rounded text-xs focus:outline-none ${
                          isLight ? 'bg-white border border-neutral-300 text-black' : 'bg-black border border-neutral-800 text-white'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-0.5">End Date</label>
                      <input
                        type="text"
                        value={exp.endDate}
                        onChange={e => handleUpdateExperience(exp.id, 'endDate', e.target.value)}
                        placeholder="Present"
                        className={`w-full px-2 py-1 rounded text-xs focus:outline-none ${
                          isLight ? 'bg-white border border-neutral-300 text-black' : 'bg-black border border-neutral-800 text-white'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-0.5">Location</label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={e => handleUpdateExperience(exp.id, 'location', e.target.value)}
                        placeholder="Remote / NY"
                        className={`w-full px-2 py-1 rounded text-xs focus:outline-none ${
                          isLight ? 'bg-white border border-neutral-300 text-black' : 'bg-black border border-neutral-800 text-white'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Bullet points */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-neutral-400">Accomplishments</span>
                      <button
                        onClick={() => handleAddBullet(exp.id)}
                        className="text-[10px] font-mono text-neutral-400 hover:text-white flex items-center gap-1"
                      >
                        <Plus className="w-2.5 h-2.5" /> Bullet
                      </button>
                    </div>

                    {exp.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-1.5">
                        <span className="text-neutral-500 text-xs mt-1">•</span>
                        <input
                          type="text"
                          value={bullet}
                          onChange={e => handleUpdateBullet(exp.id, bIdx, e.target.value)}
                          className={`flex-1 px-2 py-1 rounded text-xs focus:outline-none ${
                            isLight ? 'bg-white border border-neutral-300 text-black' : 'bg-black border border-neutral-800 text-white'
                          }`}
                        />
                        <button
                          onClick={() => handleRemoveBullet(exp.id, bIdx)}
                          className="p-1 text-neutral-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Education */}
          {activeTab === 'education' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400 font-mono">Academic Degrees</span>
                <button
                  onClick={handleAddEducation}
                  className={`px-2.5 py-1 rounded border text-xs font-mono flex items-center gap-1 transition-colors ${
                    isLight ? 'border-neutral-300 hover:bg-neutral-200' : 'border-neutral-700 hover:bg-neutral-800'
                  }`}
                >
                  <Plus className="w-3 h-3" />
                  Add Degree
                </button>
              </div>

              {data.education.map((edu, idx) => (
                <div
                  key={edu.id}
                  className={`p-3.5 rounded-lg border space-y-3 ${
                    isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-950 border-neutral-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-neutral-500">Degree #{idx + 1}</span>
                    <button
                      onClick={() => handleRemoveEducation(edu.id)}
                      className="text-neutral-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-0.5">Institution</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={e => handleUpdateEducation(edu.id, 'institution', e.target.value)}
                      placeholder="e.g. Stanford University"
                      className={`w-full px-2.5 py-1 rounded text-xs focus:outline-none ${
                        isLight ? 'bg-white border border-neutral-300 text-black' : 'bg-black border border-neutral-800 text-white'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-0.5">Degree / Major</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={e => handleUpdateEducation(edu.id, 'degree', e.target.value)}
                      placeholder="e.g. B.S. in Computer Science"
                      className={`w-full px-2.5 py-1 rounded text-xs focus:outline-none ${
                        isLight ? 'bg-white border border-neutral-300 text-black' : 'bg-black border border-neutral-800 text-white'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-0.5">Years / Date</label>
                      <input
                        type="text"
                        value={edu.startDate ? `${edu.startDate} - ${edu.endDate}` : edu.endDate}
                        onChange={e => handleUpdateEducation(edu.id, 'endDate', e.target.value)}
                        placeholder="2016 - 2020"
                        className={`w-full px-2.5 py-1 rounded text-xs focus:outline-none ${
                          isLight ? 'bg-white border border-neutral-300 text-black' : 'bg-black border border-neutral-800 text-white'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-0.5">Honors / GPA</label>
                      <input
                        type="text"
                        value={edu.gpaOrHonors || ''}
                        onChange={e => handleUpdateEducation(edu.id, 'gpaOrHonors', e.target.value)}
                        placeholder="e.g. Magna Cum Laude"
                        className={`w-full px-2.5 py-1 rounded text-xs focus:outline-none ${
                          isLight ? 'bg-white border border-neutral-300 text-black' : 'bg-black border border-neutral-800 text-white'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Skills */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400 font-mono">Categorized Skills</span>
                <button
                  onClick={handleAddSkillCategory}
                  className={`px-2.5 py-1 rounded border text-xs font-mono flex items-center gap-1 transition-colors ${
                    isLight ? 'border-neutral-300 hover:bg-neutral-200' : 'border-neutral-700 hover:bg-neutral-800'
                  }`}
                >
                  <Plus className="w-3 h-3" />
                  Add Category
                </button>
              </div>

              {data.skills.map((skillGroup, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-lg border space-y-2 ${
                    isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-950 border-neutral-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={skillGroup.category}
                      onChange={e => handleUpdateSkillCategoryName(idx, e.target.value)}
                      placeholder="Category Name"
                      className={`font-mono text-xs font-medium px-2 py-0.5 rounded focus:outline-none ${
                        isLight ? 'bg-white border border-neutral-300 text-black' : 'bg-black border border-neutral-800 text-white'
                      }`}
                    />
                    <button
                      onClick={() => handleRemoveSkillCategory(idx)}
                      className="text-neutral-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 block mb-1">
                      Skills (comma-separated):
                    </label>
                    <input
                      type="text"
                      value={skillGroup.items.join(', ')}
                      onChange={e => handleUpdateSkillItems(idx, e.target.value)}
                      placeholder="Python, Rust, Docker, Kubernetes"
                      className={`w-full px-2.5 py-1 rounded text-xs focus:outline-none ${
                        isLight ? 'bg-white border border-neutral-300 text-black' : 'bg-black border border-neutral-800 text-white'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 5: Projects */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400 font-mono">Key Projects & Certs</span>
                <button
                  onClick={handleAddProject}
                  className={`px-2.5 py-1 rounded border text-xs font-mono flex items-center gap-1 transition-colors ${
                    isLight ? 'border-neutral-300 hover:bg-neutral-200' : 'border-neutral-700 hover:bg-neutral-800'
                  }`}
                >
                  <Plus className="w-3 h-3" />
                  Add Project
                </button>
              </div>

              {data.projects.map((proj, idx) => (
                <div
                  key={proj.id}
                  className={`p-3.5 rounded-lg border space-y-3 ${
                    isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-950 border-neutral-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-neutral-500">Project #{idx + 1}</span>
                    <button
                      onClick={() => handleRemoveProject(proj.id)}
                      className="text-neutral-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-0.5">Project Name</label>
                      <input
                        type="text"
                        value={proj.name}
                        onChange={e => handleUpdateProject(proj.id, 'name', e.target.value)}
                        className={`w-full px-2.5 py-1 rounded text-xs focus:outline-none ${
                          isLight ? 'bg-white border border-neutral-300 text-black' : 'bg-black border border-neutral-800 text-white'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-0.5">Link / Code</label>
                      <input
                        type="text"
                        value={proj.link || ''}
                        onChange={e => handleUpdateProject(proj.id, 'link', e.target.value)}
                        placeholder="github.com/..."
                        className={`w-full px-2.5 py-1 rounded text-xs focus:outline-none ${
                          isLight ? 'bg-white border border-neutral-300 text-black' : 'bg-black border border-neutral-800 text-white'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-0.5">Description</label>
                    <textarea
                      rows={2}
                      value={proj.description}
                      onChange={e => handleUpdateProject(proj.id, 'description', e.target.value)}
                      className={`w-full px-2.5 py-1 rounded text-xs focus:outline-none ${
                        isLight ? 'bg-white border border-neutral-300 text-black' : 'bg-black border border-neutral-800 text-white'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 6: Template / Layout Settings */}
          {activeTab === 'settings' && (
            <div className={`p-4 rounded-lg border space-y-4 ${
              isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-950 border-neutral-900'
            }`}>
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-2">
                  Typographic Style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'classic', name: 'Classic Executive', desc: 'Editorial serif headers with clean rule dividers; corporate & legal' },
                    { id: 'modern', name: 'Modern Tech', desc: 'Crisp sans-serif with metadata chips; startups & product' },
                    { id: 'two-column', name: 'Two-Column Split', desc: 'Structured left sidebar with contact & skills; spacious experience' },
                    { id: 'minimal', name: 'Minimalist Swiss', desc: 'High-density focus on content, generous whitespace, stark monochrome' },
                    { id: 'technical', name: 'Engineering ATS', desc: 'Terminal-inspired monospace headers, skill matrix & ATS-optimized structure' },
                    { id: 'academic', name: 'Academic CV', desc: 'LaTeX-inspired typography with institutional sections & research emphasis' }
                  ].map(tmpl => (
                    <button
                      key={tmpl.id}
                      onClick={() => updateData(prev => ({ ...prev, template: tmpl.id as any }))}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        data.template === tmpl.id
                          ? isLight ? 'border-black bg-neutral-200' : 'border-white bg-neutral-900'
                          : isLight ? 'border-neutral-200 hover:border-neutral-400' : 'border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="text-xs font-semibold">{tmpl.name}</div>
                      <div className="text-[10px] text-neutral-500 mt-0.5">{tmpl.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-800 space-y-2">
                <span className="text-xs font-mono text-neutral-400 block">Print & ATS Guidelines</span>
                <ul className="text-[11px] text-neutral-500 space-y-1 list-disc pl-4">
                  <li>For US corporate and tech positions, consider toggling off the photo in Personal tab for standard ATS parsing.</li>
                  <li>Single-page fit is guaranteed by keeping bullet points concise (2-3 bullets per position).</li>
                  <li>Use "Print" button to save directly via Chrome/Safari print dialog with native vector fonts.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live A4 Resume Canvas (7 cols) */}
        <div className={`lg:col-span-7 flex flex-col items-center w-full ${
          mobileViewMode === 'preview' ? 'block' : 'hidden lg:flex'
        }`}>
          <div className="w-full flex items-center justify-between pb-2 text-xs font-mono text-neutral-500 no-print">
            <span>A4 Document Preview (210mm × 297mm)</span>
            <span className="hidden sm:inline">Scale: 100% Client-Side Render</span>
          </div>

          {/* Paper Canvas Container (always white paper for realistic representation) */}
          <div className="w-full overflow-x-auto p-2 sm:p-4 bg-neutral-900/60 rounded-xl border border-neutral-800 flex justify-center shadow-inner print:p-0 print:border-none print:bg-white print:shadow-none">
            <div
              ref={resumePreviewRef}
              id="resume-printable-document"
              className="bg-white text-black p-5 sm:p-8 md:p-10 shadow-2xl transition-all"
              style={{
                width: '100%',
                minWidth: '320px',
                maxWidth: '794px', // A4 pixel width at 96 DPI
                minHeight: '1123px', // A4 pixel height at 96 DPI
                fontFamily: data.template === 'classic' || data.template === 'academic' 
                  ? 'Newsreader, Georgia, "Times New Roman", serif' 
                  : data.template === 'technical'
                  ? 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
                  : 'system-ui, -apple-system, sans-serif',
                boxSizing: 'border-box'
              }}
            >
              {/* LAYOUT 1: CLASSIC EXECUTIVE (Default) */}
              {data.template === 'classic' && (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-6 border-b-2 border-black pb-5">
                    <div className="space-y-1 flex-1">
                      <h1 className="text-3xl font-serif font-bold tracking-tight text-black uppercase">
                        {data.personal.fullName || 'Full Name'}
                      </h1>
                      <div className="text-sm font-sans font-medium text-neutral-700 tracking-wide">
                        {data.personal.title || 'Professional Title'}
                      </div>
                      {/* Contact metadata */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-sans text-neutral-600 pt-1">
                        {data.personal.email && (
                          <span className="inline-flex items-center gap-1">
                            <Mail className="w-3 h-3 text-neutral-500 stroke-[1.75]" />
                            {data.personal.email}
                          </span>
                        )}
                        {data.personal.phone && (
                          <span className="inline-flex items-center gap-1">
                            <Phone className="w-3 h-3 text-neutral-500 stroke-[1.75]" />
                            {data.personal.phone}
                          </span>
                        )}
                        {data.personal.location && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-neutral-500 stroke-[1.75]" />
                            {data.personal.location}
                          </span>
                        )}
                        {data.personal.website && (
                          <span className="inline-flex items-center gap-1">
                            <Globe className="w-3 h-3 text-neutral-500 stroke-[1.75]" />
                            {data.personal.website}
                          </span>
                        )}
                        {data.personal.linkedin && (
                          <span className="inline-flex items-center gap-1">
                            <LinkedinIcon className="w-3 h-3 text-neutral-500 stroke-[1.75]" />
                            {data.personal.linkedin}
                          </span>
                        )}
                        {data.personal.github && (
                          <span className="inline-flex items-center gap-1">
                            <GithubIcon className="w-3 h-3 text-neutral-500 stroke-[1.75]" />
                            {data.personal.github}
                          </span>
                        )}
                      </div>
                    </div>

                    {data.personal.showPhoto && data.personal.photoUrl && (
                      <div className="shrink-0">
                        <img
                          src={data.personal.photoUrl}
                          alt="Resume portrait"
                          className={`w-20 h-20 object-cover border border-neutral-300 shadow-sm ${
                            data.personal.photoShape === 'circle' ? 'rounded-full' :
                            data.personal.photoShape === 'rounded' ? 'rounded-md' : 'rounded-none'
                          }`}
                        />
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  {data.summary && (
                    <div className="space-y-1.5">
                      <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-black border-b border-neutral-300 pb-0.5 flex items-center gap-1.5">
                        <User className="w-3 h-3 stroke-[2]" />
                        Professional Summary
                      </h2>
                      <p className="text-xs font-sans text-neutral-800 leading-relaxed text-justify">
                        {data.summary}
                      </p>
                    </div>
                  )}

                  {/* Experience */}
                  {data.experience.length > 0 && (
                    <div className="space-y-3">
                      <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-black border-b border-neutral-300 pb-0.5 flex items-center gap-1.5">
                        <Briefcase className="w-3 h-3 stroke-[2]" />
                        Professional Experience
                      </h2>
                      <div className="space-y-4">
                        {data.experience.map(exp => (
                          <div key={exp.id} className="space-y-1">
                            <div className="flex items-baseline justify-between">
                              <span className="text-xs font-sans font-bold text-black flex items-center gap-1">
                                {exp.role} <span className="font-normal text-neutral-600">at</span> {exp.company}
                              </span>
                              <span className="text-[11px] font-sans text-neutral-600">
                                {exp.startDate} – {exp.endDate} {exp.location ? `| ${exp.location}` : ''}
                              </span>
                            </div>
                            <ul className="list-disc list-outside pl-4 space-y-1 text-xs font-sans text-neutral-800">
                              {exp.bullets.map((bullet, idx) => (
                                <li key={idx} className="leading-relaxed">
                                  {bullet}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {data.education.length > 0 && (
                    <div className="space-y-2">
                      <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-black border-b border-neutral-300 pb-0.5 flex items-center gap-1.5">
                        <GraduationCap className="w-3 h-3 stroke-[2]" />
                        Education
                      </h2>
                      <div className="space-y-2">
                        {data.education.map(edu => (
                          <div key={edu.id} className="flex items-baseline justify-between text-xs font-sans">
                            <div>
                              <span className="font-bold text-black">{edu.institution}</span>
                              <div className="text-neutral-700">{edu.degree}</div>
                              {edu.gpaOrHonors && (
                                <div className="text-[11px] text-neutral-500 italic">{edu.gpaOrHonors}</div>
                              )}
                            </div>
                            <span className="text-[11px] text-neutral-600">
                              {edu.endDate} {edu.location ? `| ${edu.location}` : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {data.skills.length > 0 && (
                    <div className="space-y-2">
                      <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-black border-b border-neutral-300 pb-0.5 flex items-center gap-1.5">
                        <Code2 className="w-3 h-3 stroke-[2]" />
                        Core Competencies & Skills
                      </h2>
                      <div className="space-y-1 text-xs font-sans">
                        {data.skills.map((group, idx) => (
                          <div key={idx} className="flex items-baseline gap-2">
                            <span className="font-bold text-neutral-900 shrink-0">{group.category}:</span>
                            <span className="text-neutral-700">{group.items.join(', ')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {data.projects.length > 0 && (
                    <div className="space-y-2">
                      <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-black border-b border-neutral-300 pb-0.5 flex items-center gap-1.5">
                        <FolderGit2 className="w-3 h-3 stroke-[2]" />
                        Key Projects & Open Source
                      </h2>
                      <div className="space-y-2 text-xs font-sans">
                        {data.projects.map(proj => (
                          <div key={proj.id} className="space-y-0.5">
                            <div className="flex items-baseline justify-between">
                              <span className="font-bold text-black">
                                {proj.name} {proj.link && <span className="font-normal text-neutral-500 font-mono text-[10px]">({proj.link})</span>}
                              </span>
                              {proj.date && <span className="text-[11px] text-neutral-600">{proj.date}</span>}
                            </div>
                            <p className="text-neutral-700 leading-relaxed">{proj.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* LAYOUT 2: MODERN MINIMAL */}
              {data.template === 'modern' && (
                <div className="space-y-6 font-sans">
                  {/* Modern Header */}
                  <div className="flex items-center justify-between gap-6 pb-6 border-b border-neutral-200">
                    <div className="space-y-1 flex-1">
                      <h1 className="text-3xl font-extrabold tracking-tight text-black">
                        {data.personal.fullName || 'Full Name'}
                      </h1>
                      <div className="text-sm font-medium text-neutral-600">
                        {data.personal.title || 'Professional Title'}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-neutral-500 pt-2">
                        {data.personal.email && (
                          <span className="bg-neutral-100 px-2 py-0.5 rounded flex items-center gap-1">
                            <Mail className="w-3 h-3 text-neutral-600" />
                            {data.personal.email}
                          </span>
                        )}
                        {data.personal.phone && (
                          <span className="bg-neutral-100 px-2 py-0.5 rounded flex items-center gap-1">
                            <Phone className="w-3 h-3 text-neutral-600" />
                            {data.personal.phone}
                          </span>
                        )}
                        {data.personal.location && (
                          <span className="bg-neutral-100 px-2 py-0.5 rounded flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-neutral-600" />
                            {data.personal.location}
                          </span>
                        )}
                        {data.personal.website && (
                          <span className="bg-neutral-100 px-2 py-0.5 rounded flex items-center gap-1">
                            <Globe className="w-3 h-3 text-neutral-600" />
                            {data.personal.website}
                          </span>
                        )}
                        {data.personal.linkedin && (
                          <span className="bg-neutral-100 px-2 py-0.5 rounded flex items-center gap-1">
                            <LinkedinIcon className="w-3 h-3 text-neutral-600" />
                            {data.personal.linkedin}
                          </span>
                        )}
                        {data.personal.github && (
                          <span className="bg-neutral-100 px-2 py-0.5 rounded flex items-center gap-1">
                            <GithubIcon className="w-3 h-3 text-neutral-600" />
                            {data.personal.github}
                          </span>
                        )}
                      </div>
                    </div>

                    {data.personal.showPhoto && data.personal.photoUrl && (
                      <img
                        src={data.personal.photoUrl}
                        alt="Profile avatar"
                        className={`w-20 h-20 object-cover shadow ${
                          data.personal.photoShape === 'circle' ? 'rounded-full' :
                          data.personal.photoShape === 'rounded' ? 'rounded-xl' : 'rounded-none'
                        }`}
                      />
                    )}
                  </div>

                  {/* Summary */}
                  {data.summary && (
                    <div className="space-y-1">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                        <User className="w-3 h-3 text-neutral-500" />
                        About
                      </div>
                      <p className="text-xs text-neutral-800 leading-relaxed">{data.summary}</p>
                    </div>
                  )}

                  {/* Experience */}
                  {data.experience.length > 0 && (
                    <div className="space-y-3">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                        <Briefcase className="w-3 h-3 text-neutral-500" />
                        Experience
                      </div>
                      <div className="space-y-4">
                        {data.experience.map(exp => (
                          <div key={exp.id} className="border-l-2 border-black pl-3 space-y-1">
                            <div className="flex items-baseline justify-between">
                              <span className="text-xs font-bold text-black">{exp.role} · {exp.company}</span>
                              <span className="text-[10px] font-mono text-neutral-500">{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <ul className="space-y-1 text-xs text-neutral-700">
                              {exp.bullets.map((bullet, idx) => (
                                <li key={idx} className="leading-relaxed">
                                  — {bullet}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education & Skills Grid */}
                  <div className="grid grid-cols-2 gap-6 pt-2">
                    {data.education.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                          <GraduationCap className="w-3 h-3 text-neutral-500" />
                          Education
                        </div>
                        {data.education.map(edu => (
                          <div key={edu.id} className="text-xs">
                            <div className="font-bold text-black">{edu.institution}</div>
                            <div className="text-neutral-600">{edu.degree}</div>
                            <div className="text-[10px] font-mono text-neutral-400">{edu.endDate}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {data.skills.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                          <Code2 className="w-3 h-3 text-neutral-500" />
                          Skills
                        </div>
                        <div className="space-y-1.5 text-xs">
                          {data.skills.map((grp, idx) => (
                            <div key={idx}>
                              <span className="font-semibold text-black">{grp.category}: </span>
                              <span className="text-neutral-700">{grp.items.join(', ')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* LAYOUT 3: TWO COLUMN */}
              {data.template === 'two-column' && (
                <div className="grid grid-cols-12 gap-8 font-sans">
                  {/* Sidebar (4 cols) */}
                  <div className="col-span-4 border-r border-neutral-200 pr-6 space-y-6">
                    {data.personal.showPhoto && data.personal.photoUrl && (
                      <div className="flex justify-center">
                        <img
                          src={data.personal.photoUrl}
                          alt="Profile"
                          className={`w-28 h-28 object-cover border border-neutral-200 shadow-sm ${
                            data.personal.photoShape === 'circle' ? 'rounded-full' :
                            data.personal.photoShape === 'rounded' ? 'rounded-lg' : 'rounded-none'
                          }`}
                        />
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 border-b pb-0.5 flex items-center gap-1">
                        <User className="w-2.5 h-2.5" />
                        Contact
                      </div>
                      <div className="text-[11px] text-neutral-700 space-y-1 pt-1 break-all">
                        {data.personal.email && (
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-neutral-500 shrink-0" />
                            {data.personal.email}
                          </div>
                        )}
                        {data.personal.phone && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-neutral-500 shrink-0" />
                            {data.personal.phone}
                          </div>
                        )}
                        {data.personal.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-neutral-500 shrink-0" />
                            {data.personal.location}
                          </div>
                        )}
                        {data.personal.website && (
                          <div className="flex items-center gap-1.5">
                            <Globe className="w-3 h-3 text-neutral-500 shrink-0" />
                            {data.personal.website}
                          </div>
                        )}
                        {data.personal.linkedin && (
                          <div className="flex items-center gap-1.5">
                            <LinkedinIcon className="w-3 h-3 text-neutral-500 shrink-0" />
                            {data.personal.linkedin}
                          </div>
                        )}
                        {data.personal.github && (
                          <div className="flex items-center gap-1.5">
                            <GithubIcon className="w-3 h-3 text-neutral-500 shrink-0" />
                            {data.personal.github}
                          </div>
                        )}
                      </div>
                    </div>

                    {data.skills.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 border-b pb-0.5 flex items-center gap-1">
                          <Code2 className="w-2.5 h-2.5" />
                          Skills
                        </div>
                        <div className="space-y-2 text-xs">
                          {data.skills.map((s, idx) => (
                            <div key={idx} className="space-y-0.5">
                              <div className="font-semibold text-[11px] text-black">{s.category}</div>
                              <div className="text-[10px] text-neutral-600 leading-snug">{s.items.join(' • ')}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {data.education.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 border-b pb-0.5 flex items-center gap-1">
                          <GraduationCap className="w-2.5 h-2.5" />
                          Education
                        </div>
                        <div className="space-y-2 text-xs">
                          {data.education.map(edu => (
                            <div key={edu.id} className="space-y-0.5">
                              <div className="font-bold text-[11px] text-black">{edu.institution}</div>
                              <div className="text-[10px] text-neutral-700">{edu.degree}</div>
                              <div className="text-[10px] font-mono text-neutral-400">{edu.endDate}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Main Content (8 cols) */}
                  <div className="col-span-8 space-y-6">
                    <div className="space-y-1">
                      <h1 className="text-2xl font-bold tracking-tight text-black">
                        {data.personal.fullName || 'Full Name'}
                      </h1>
                      <div className="text-sm font-medium text-neutral-600">
                        {data.personal.title || 'Professional Title'}
                      </div>
                    </div>

                    {data.summary && (
                      <div className="space-y-1">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 border-b pb-0.5 flex items-center gap-1">
                          <User className="w-2.5 h-2.5" />
                          Executive Summary
                        </div>
                        <p className="text-xs text-neutral-800 leading-relaxed pt-1 text-justify">{data.summary}</p>
                      </div>
                    )}

                    {data.experience.length > 0 && (
                      <div className="space-y-3">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 border-b pb-0.5 flex items-center gap-1">
                          <Briefcase className="w-2.5 h-2.5" />
                          Experience
                        </div>
                        <div className="space-y-4">
                          {data.experience.map(exp => (
                            <div key={exp.id} className="space-y-1">
                              <div className="flex items-baseline justify-between text-xs font-bold text-black">
                                <span>{exp.role} — {exp.company}</span>
                                <span className="font-normal font-mono text-[10px] text-neutral-500">{exp.startDate} - {exp.endDate}</span>
                              </div>
                              <ul className="list-disc pl-4 space-y-1 text-xs text-neutral-700">
                                {exp.bullets.map((b, idx) => (
                                  <li key={idx} className="leading-relaxed">{b}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {data.projects.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 border-b pb-0.5 flex items-center gap-1">
                          <FolderGit2 className="w-2.5 h-2.5" />
                          Projects
                        </div>
                        <div className="space-y-2 text-xs">
                          {data.projects.map(p => (
                            <div key={p.id} className="space-y-0.5">
                              <div className="font-bold text-black">{p.name}</div>
                              <p className="text-neutral-700">{p.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* LAYOUT 4: MINIMAL */}
              {data.template === 'minimal' && (
                <div className="space-y-6 font-sans">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-light tracking-widest uppercase text-black">
                        {data.personal.fullName || 'Full Name'}
                      </h1>
                      <div className="text-xs tracking-wider text-neutral-600 uppercase mt-0.5">
                        {data.personal.title || 'Professional Title'}
                      </div>
                    </div>
                    {data.personal.showPhoto && data.personal.photoUrl && (
                      <img
                        src={data.personal.photoUrl}
                        alt="Avatar"
                        className={`w-16 h-16 object-cover ${
                          data.personal.photoShape === 'circle' ? 'rounded-full' : 'rounded-none'
                        }`}
                      />
                    )}
                  </div>

                  <div className="text-[11px] font-mono text-neutral-500 flex flex-wrap gap-x-4">
                    {data.personal.email && <span>{data.personal.email}</span>}
                    {data.personal.phone && <span>{data.personal.phone}</span>}
                    {data.personal.location && <span>{data.personal.location}</span>}
                  </div>

                  {data.summary && (
                    <p className="text-xs text-neutral-700 leading-relaxed font-serif text-justify border-t border-b border-neutral-100 py-3">
                      {data.summary}
                    </p>
                  )}

                  {data.experience.length > 0 && (
                    <div className="space-y-4">
                      {data.experience.map(exp => (
                        <div key={exp.id} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-bold">{exp.role}, {exp.company}</span>
                            <span className="text-neutral-500 font-mono text-[10px]">{exp.startDate} - {exp.endDate}</span>
                          </div>
                          <ul className="list-disc pl-4 text-xs text-neutral-700 space-y-0.5">
                            {exp.bullets.map((b, i) => (
                              <li key={i}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {data.education.length > 0 && (
                    <div className="pt-2 border-t border-neutral-100 text-xs space-y-1">
                      {data.education.map(edu => (
                        <div key={edu.id} className="flex justify-between">
                          <span><strong>{edu.institution}</strong> — {edu.degree}</span>
                          <span className="text-neutral-500 font-mono text-[10px]">{edu.endDate}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* LAYOUT 5: ENGINEERING & SYSTEMS ATS */}
              {data.template === 'technical' && (
                <div className="space-y-5 text-neutral-900 font-mono">
                  {/* Terminal-inspired ATS Header */}
                  <div className="border-b-2 border-black pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h1 className="text-2xl font-bold tracking-tight text-black font-sans uppercase">
                          {data.personal.fullName || 'Full Name'}
                        </h1>
                        <div className="text-xs text-neutral-800 font-mono font-medium mt-0.5">
                          &gt; {data.personal.title || 'Software Engineer / Architect'}
                        </div>
                      </div>
                      {data.personal.showPhoto && data.personal.photoUrl && (
                        <img
                          src={data.personal.photoUrl}
                          alt="Portrait"
                          className="w-16 h-16 object-cover border border-black shadow-sm"
                        />
                      )}
                    </div>

                    {/* Contact Line */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono text-neutral-700 pt-2 border-t border-dashed border-neutral-300 mt-2">
                      {data.personal.email && <span>email: {data.personal.email}</span>}
                      {data.personal.phone && <span>tel: {data.personal.phone}</span>}
                      {data.personal.location && <span>loc: {data.personal.location}</span>}
                      {data.personal.github && <span>git: {data.personal.github}</span>}
                      {data.personal.website && <span>web: {data.personal.website}</span>}
                      {data.personal.linkedin && <span>in: {data.personal.linkedin}</span>}
                    </div>
                  </div>

                  {/* Section 01: Architecture & Technical Summary */}
                  {data.summary && (
                    <div className="space-y-1.5 font-sans">
                      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-black border-b border-neutral-300 pb-0.5">
                        // 01. TECHNICAL PROFILE & SUMMARY
                      </div>
                      <p className="text-xs text-neutral-800 leading-relaxed text-justify">
                        {data.summary}
                      </p>
                    </div>
                  )}

                  {/* Section 02: Skills Matrix */}
                  {data.skills.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-black border-b border-neutral-300 pb-0.5">
                        // 02. TECHNICAL PROFICIENCIES & STACK
                      </div>
                      <div className="grid grid-cols-1 gap-1.5 text-xs">
                        {data.skills.map((cat, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="font-semibold text-black min-w-[140px] text-[11px] shrink-0 font-mono">
                              {cat.category}:
                            </span>
                            <div className="flex flex-wrap gap-1 font-mono text-[11px]">
                              {cat.items.map((item, j) => (
                                <span key={j} className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-300 text-neutral-900">
                                  [{item}]
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Section 03: Engineering Experience */}
                  {data.experience.length > 0 && (
                    <div className="space-y-3 font-sans">
                      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-black border-b border-neutral-300 pb-0.5">
                        // 03. PROFESSIONAL EXPERIENCE
                      </div>
                      <div className="space-y-3.5">
                        {data.experience.map(exp => (
                          <div key={exp.id} className="space-y-1">
                            <div className="flex justify-between items-baseline text-xs font-mono">
                              <div>
                                <span className="font-bold text-black font-sans">{exp.role}</span>
                                <span className="text-neutral-600"> @ {exp.company}</span>
                                {exp.location && <span className="text-neutral-500 text-[10px]"> ({exp.location})</span>}
                              </div>
                              <span className="text-neutral-600 text-[10px] shrink-0">
                                {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                              </span>
                            </div>
                            <ul className="list-disc pl-4 text-xs text-neutral-800 space-y-1 font-sans">
                              {exp.bullets.map((b, idx) => (
                                <li key={idx} className="leading-snug">{b}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Section 04: Projects & Open Source */}
                  {data.projects.length > 0 && (
                    <div className="space-y-2 font-sans">
                      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-black border-b border-neutral-300 pb-0.5">
                        // 04. SYSTEMS & PROJECTS
                      </div>
                      <div className="grid grid-cols-1 gap-2 text-xs">
                        {data.projects.map(p => (
                          <div key={p.id} className="p-2 rounded border border-neutral-200 bg-neutral-50/50 space-y-0.5">
                            <div className="flex justify-between items-baseline font-mono text-[11px]">
                              <span className="font-bold text-black font-sans">{p.name}</span>
                              {p.date && <span className="text-neutral-500 text-[10px]">{p.date}</span>}
                            </div>
                            {p.link && (
                              <div className="text-[10px] font-mono text-neutral-600 truncate">{p.link}</div>
                            )}
                            <p className="text-neutral-800 text-xs font-sans leading-snug">{p.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Section 05: Education */}
                  {data.education.length > 0 && (
                    <div className="space-y-1.5 font-sans">
                      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-black border-b border-neutral-300 pb-0.5">
                        // 05. EDUCATION & CREDENTIALS
                      </div>
                      <div className="space-y-1.5">
                        {data.education.map(edu => (
                          <div key={edu.id} className="flex justify-between items-baseline text-xs">
                            <div>
                              <span className="font-bold text-black">{edu.institution}</span>
                              <span className="text-neutral-700"> — {edu.degree}</span>
                              {edu.gpaOrHonors && (
                                <span className="text-[11px] text-neutral-600 block">{edu.gpaOrHonors}</span>
                              )}
                            </div>
                            <span className="text-neutral-600 font-mono text-[10px] shrink-0">
                              {edu.startDate ? `${edu.startDate} - ${edu.endDate}` : edu.endDate}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* LAYOUT 6: ACADEMIC & RESEARCH CV */}
              {data.template === 'academic' && (
                <div className="space-y-6 text-neutral-900 font-serif">
                  {/* Classical University / Paper Header */}
                  <div className="text-center space-y-1.5 pb-4 border-b-2 border-black">
                    <h1 className="text-2xl font-bold tracking-normal uppercase text-black font-serif">
                      {data.personal.fullName || 'Full Name'}
                    </h1>
                    <div className="text-xs font-medium text-neutral-800 tracking-wide font-serif italic">
                      {data.personal.title || 'Curriculum Vitae'}
                    </div>
                    
                    {/* Centered Academic Metadata */}
                    <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-0.5 text-xs text-neutral-700 pt-1 font-serif">
                      {data.personal.location && <span>{data.personal.location}</span>}
                      {data.personal.email && <span>• {data.personal.email}</span>}
                      {data.personal.phone && <span>• {data.personal.phone}</span>}
                      {data.personal.website && <span>• {data.personal.website}</span>}
                      {data.personal.github && <span>• {data.personal.github}</span>}
                      {data.personal.linkedin && <span>• {data.personal.linkedin}</span>}
                    </div>
                  </div>

                  {/* Summary / Research Statement */}
                  {data.summary && (
                    <div className="space-y-1.5">
                      <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-black pb-0.5">
                        Research Statement & Abstract
                      </h2>
                      <p className="text-xs leading-relaxed text-neutral-800 text-justify">
                        {data.summary}
                      </p>
                    </div>
                  )}

                  {/* Education First (Standard in Academic CVs) */}
                  {data.education.length > 0 && (
                    <div className="space-y-2">
                      <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-black pb-0.5">
                        Education
                      </h2>
                      <div className="space-y-2 text-xs">
                        {data.education.map(edu => (
                          <div key={edu.id} className="space-y-0.5">
                            <div className="flex justify-between font-bold text-black">
                              <span>{edu.institution}</span>
                              <span className="font-normal text-neutral-600 text-[11px] font-sans">
                                {edu.startDate ? `${edu.startDate} — ${edu.endDate}` : edu.endDate}
                              </span>
                            </div>
                            <div className="italic text-neutral-800 text-[11px]">
                              {edu.degree}
                            </div>
                            {edu.gpaOrHonors && (
                              <div className="text-[11px] text-neutral-700 pl-3">
                                Honors: {edu.gpaOrHonors}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Academic Appointments & Research Experience */}
                  {data.experience.length > 0 && (
                    <div className="space-y-3">
                      <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-black pb-0.5">
                        Research & Academic Appointments
                      </h2>
                      <div className="space-y-3">
                        {data.experience.map(exp => (
                          <div key={exp.id} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <div>
                                <span className="font-bold text-black">{exp.role}</span>
                                <span className="italic text-neutral-800">, {exp.company}</span>
                                {exp.location && <span className="text-neutral-600 text-[11px]"> ({exp.location})</span>}
                              </div>
                              <span className="text-neutral-600 text-[11px] font-sans">
                                {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                              </span>
                            </div>
                            <ul className="list-disc pl-5 text-xs text-neutral-800 space-y-0.5 leading-snug">
                              {exp.bullets.map((b, i) => (
                                <li key={i}>{b}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Publications & Project Contributions */}
                  {data.projects.length > 0 && (
                    <div className="space-y-2">
                      <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-black pb-0.5">
                        Selected Projects & Publications
                      </h2>
                      <div className="space-y-2 text-xs">
                        {data.projects.map(p => (
                          <div key={p.id} className="space-y-0.5 pl-3 border-l border-neutral-300">
                            <div className="flex justify-between font-bold text-black">
                              <span>{p.name}</span>
                              {p.date && <span className="font-normal text-neutral-600 text-[11px] font-sans">{p.date}</span>}
                            </div>
                            {p.link && (
                              <div className="text-[10px] text-neutral-600 font-mono">{p.link}</div>
                            )}
                            <p className="text-neutral-800 text-xs leading-snug">{p.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills & Methods */}
                  {data.skills.length > 0 && (
                    <div className="space-y-1.5">
                      <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-black pb-0.5">
                        Methodologies & Technical Proficiencies
                      </h2>
                      <div className="space-y-1 text-xs">
                        {data.skills.map((cat, i) => (
                          <div key={i} className="flex items-baseline gap-2">
                            <span className="font-bold text-black min-w-[130px] shrink-0 text-[11px]">
                              {cat.category}:
                            </span>
                            <span className="text-neutral-800 leading-snug">
                              {cat.items.join(', ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Continuity Pipeline */}
      {onNavigateToTool && (
        <div className={`mt-8 p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs no-print ${
          isLight ? 'bg-neutral-50/80 border-neutral-200' : 'bg-neutral-950 border-neutral-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${
              isLight ? 'bg-white border-neutral-200 text-black' : 'bg-black border-neutral-800 text-white'
            }`}>
              <Sparkles className="w-4 h-4 stroke-[1.75]" />
            </div>
            <div>
              <div className="font-semibold text-xs">Workstation Pipeline Hand-off</div>
              <div className="text-[11px] text-neutral-500">Need to meet job portal size limits or attach a cover letter?</div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onNavigateToTool('compress-pdf')}
              className={`px-3 py-1.5 rounded-md border text-xs font-mono transition-colors flex items-center gap-1.5 ${
                isLight ? 'bg-white border-neutral-300 hover:bg-neutral-100 text-black' : 'bg-black border-neutral-700 hover:bg-neutral-900 text-white'
              }`}
            >
              <FileArchive className="w-3.5 h-3.5" />
              <span>Compress Resume (&lt;500KB)</span>
            </button>

            <button
              onClick={() => onNavigateToTool('merge-pdf')}
              className={`px-3 py-1.5 rounded-md border text-xs font-mono transition-colors flex items-center gap-1.5 ${
                isLight ? 'bg-white border-neutral-300 hover:bg-neutral-100 text-black' : 'bg-black border-neutral-700 hover:bg-neutral-900 text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Merge with Cover Letter</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
