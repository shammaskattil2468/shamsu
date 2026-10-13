import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Save, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Download, 
  FileUp, 
  Check, 
  AlertCircle,
  Eye,
  Camera,
  Layers,
  Code2,
  FolderGit2,
  GraduationCap,
  Award,
  Compass,
  Phone,
  Settings,
  Mail,
  Database,
  RefreshCw
} from 'lucide-react';
import { apiService } from '../services/api';

export default function EditModal({
  isOpen,
  onClose,
  portfolioData,
  onSave,
  onResetDefaults,
  isAdminUnlocked,
  onUnlockAdmin,
  onLockAdmin,
  dbStatus
}) {
  const [activeTab, setActiveTab] = useState('profile');
  const [data, setData] = useState(() => JSON.parse(JSON.stringify(portfolioData)));
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [liveDbStatus, setLiveDbStatus] = useState(dbStatus || { status: 'checking', uri: 'mongodb://localhost:27017/mubashira_portfolio' });

  // Sync state if portfolioData updates or modal opens
  useEffect(() => {
    if (isOpen) {
      setData(JSON.parse(JSON.stringify(portfolioData)));
      setPinError('');
      setSaveSuccess(false);
      if (dbStatus) setLiveDbStatus(dbStatus);
    }
  }, [isOpen, portfolioData, dbStatus]);

  const loadMessages = async () => {
    setLoadingMessages(true);
    try {
      const list = await apiService.getMessages();
      setMessages(Array.isArray(list) ? list : []);
      const status = await apiService.getStatus();
      setLiveDbStatus(status);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === 'messages') {
      loadMessages();
    }
  }, [isOpen, activeTab]);

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message from MongoDB?')) return;
    await apiService.deleteMessage(id);
    setMessages(prev => prev.filter(m => m._id !== id));
  };

  const fileInputRef = useRef(null);
  const jsonImportRef = useRef(null);

  if (!isOpen) return null;

  // Handle Admin Passcode Login
  const handlePinSubmit = (e) => {
    e.preventDefault();
    // Default PIN: "mubashira" or "mubashira2024" or "admin123"
    const validPins = ['mubashira', 'mubashira2024', '1234', 'admin'];
    if (validPins.includes(pinInput.trim().toLowerCase())) {
      onUnlockAdmin();
      setPinInput('');
      setPinError('');
    } else {
      setPinError('Invalid passcode. Default passcode is "mubashira" or "mubashira2024".');
    }
  };

  const handleProfileChange = (field, value) => {
    setData(prev => ({
      ...prev,
      profile: { ...prev.profile, [field]: value }
    }));
  };

  const handleContactChange = (field, value) => {
    setData(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  };

  // Profile Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleProfileChange('profileImage', event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Skills Editing
  const handleAddSkill = (categoryIndex) => {
    const newSkill = {
      id: `sk-${Date.now()}`,
      name: 'New Skill',
      desc: 'Description of the analytical technique or library.',
      icon: 'Code2'
    };
    const updatedSkills = [...data.skills];
    updatedSkills[categoryIndex].items.push(newSkill);
    setData(prev => ({ ...prev, skills: updatedSkills }));
  };

  const handleRemoveSkill = (catIdx, skillIdx) => {
    const updatedSkills = [...data.skills];
    updatedSkills[catIdx].items.splice(skillIdx, 1);
    setData(prev => ({ ...prev, skills: updatedSkills }));
  };

  const handleUpdateSkill = (catIdx, skillIdx, field, value) => {
    const updatedSkills = [...data.skills];
    updatedSkills[catIdx].items[skillIdx][field] = value;
    setData(prev => ({ ...prev, skills: updatedSkills }));
  };

  // Projects Editing
  const handleAddProject = () => {
    const newProj = {
      id: `proj-${Date.now()}`,
      title: 'New Project Title',
      category: 'Data Analytics',
      tools: ['Python', 'SQL'],
      status: 'In Progress',
      description: 'Summary of the dataset investigated and analytical techniques applied.',
      keyActivities: ['Cleaned raw dataset', 'Explored patterns using grouping'],
      githubUrl: '',
      liveUrl: '',
      image: null
    };
    setData(prev => ({ ...prev, projects: [newProj, ...prev.projects] }));
  };

  const handleRemoveProject = (index) => {
    const updated = [...data.projects];
    updated.splice(index, 1);
    setData(prev => ({ ...prev, projects: updated }));
  };

  const handleUpdateProject = (index, field, value) => {
    const updated = [...data.projects];
    updated[index][field] = value;
    setData(prev => ({ ...prev, projects: updated }));
  };

  // Education Editing
  const handleAddEducation = () => {
    const newEdu = {
      id: `edu-${Date.now()}`,
      degree: 'Course / Degree Name',
      institution: 'College or University Name',
      academicStatus: 'Status or Year',
      highlights: 'Core topics covered.'
    };
    setData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const handleRemoveEducation = (index) => {
    const updated = [...data.education];
    updated.splice(index, 1);
    setData(prev => ({ ...prev, education: updated }));
  };

  const handleUpdateEducation = (index, field, value) => {
    const updated = [...data.education];
    updated[index][field] = value;
    setData(prev => ({ ...prev, education: updated }));
  };

  // Certifications Editing
  const handleAddCert = () => {
    const newCert = {
      id: `cert-${Date.now()}`,
      name: 'Certification Name',
      issuer: 'Issuing Organization',
      date: 'Month Year',
      verificationUrl: '',
      image: null
    };
    setData(prev => ({ ...prev, certifications: [...prev.certifications, newCert] }));
  };

  const handleRemoveCert = (index) => {
    const updated = [...data.certifications];
    updated.splice(index, 1);
    setData(prev => ({ ...prev, certifications: updated }));
  };

  const handleUpdateCert = (index, field, value) => {
    const updated = [...data.certifications];
    updated[index][field] = value;
    setData(prev => ({ ...prev, certifications: updated }));
  };

  // Currently Learning Editing
  const handleAddLearning = () => {
    const newL = {
      id: `cl-${Date.now()}`,
      name: 'Topic Name',
      desc: 'Description of the topic and skills being acquired.',
      icon: 'Compass',
      tag: 'Learning in progress'
    };
    setData(prev => ({ ...prev, currentlyLearning: [...prev.currentlyLearning, newL] }));
  };

  const handleRemoveLearning = (index) => {
    const updated = [...data.currentlyLearning];
    updated.splice(index, 1);
    setData(prev => ({ ...prev, currentlyLearning: updated }));
  };

  const handleUpdateLearning = (index, field, value) => {
    const updated = [...data.currentlyLearning];
    updated[index][field] = value;
    setData(prev => ({ ...prev, currentlyLearning: updated }));
  };

  // Save changes
  const handleSaveChanges = () => {
    onSave(data);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  // Export & Import JSON
  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mubashira_portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          setData(parsed);
          alert('Portfolio data imported successfully! Click "Save Changes" to apply.');
        } catch (err) {
          alert('Invalid JSON file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(8px)',
        zIndex: 150,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          width: '100%',
          maxWidth: '920px',
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-hover)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div 
          style={{
            padding: '1.25rem 2rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-card)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div 
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'var(--accent-blue-light)',
                color: 'var(--accent-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Portfolio Admin & Content Manager
              </h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {isAdminUnlocked ? 'Authenticated • Edits persist in local storage' : 'Passcode Required'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isAdminUnlocked && (
              <button
                onClick={onLockAdmin}
                className="btn btn-secondary btn-sm"
                style={{ gap: '0.35rem' }}
                title="Lock editing mode"
              >
                <Lock size={14} />
                <span>Lock</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="btn btn-secondary btn-icon"
              style={{ width: '36px', height: '36px', borderRadius: '50%' }}
              aria-label="Close Admin Modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Security Gate if not unlocked */}
        {!isAdminUnlocked ? (
          <div 
            style={{
              padding: '4rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              flex: 1,
            }}
          >
            <div 
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-blue-light)',
                color: 'var(--accent-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <Lock size={32} />
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Admin Verification Required
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', maxWidth: '420px', marginBottom: '2rem' }}>
              To ensure data protection and prevent unauthorized modifications by normal visitors, enter your portfolio admin passcode.
            </p>

            <form onSubmit={handlePinSubmit} style={{ width: '100%', maxWidth: '340px' }}>
              <input
                type="password"
                placeholder="Enter Passcode (e.g. mubashira)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  fontSize: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--border-color)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  marginBottom: '0.75rem',
                  textAlign: 'center',
                  outline: 'none',
                }}
              />

              {pinError && (
                <div style={{ fontSize: '0.82rem', color: '#EF4444', marginBottom: '0.75rem' }}>
                  {pinError}
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
                <Unlock size={16} />
                <span>Unlock Portfolio Editor</span>
              </button>

              <div style={{ marginTop: '1.25rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Default Demo Passcode: <strong>mubashira</strong> or <strong>mubashira2024</strong>
              </div>
            </form>
          </div>
        ) : (
          /* Unlocked Admin Interface */
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            
            {/* Sidebar Tabs */}
            <div 
              style={{
                width: '220px',
                borderRight: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-secondary)',
                padding: '1rem 0.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                flexShrink: 0,
                overflowY: 'auto',
              }}
            >
              {[
                { id: 'profile', name: 'Profile & Bio', icon: Eye },
                { id: 'skills', name: 'Skills & Tech', icon: Code2 },
                { id: 'projects', name: 'Projects', icon: FolderGit2 },
                { id: 'education', name: 'Education', icon: GraduationCap },
                { id: 'certifications', name: 'Certifications', icon: Award },
                { id: 'learning', name: 'Currently Learning', icon: Compass },
                { id: 'contact', name: 'Contact Info', icon: Phone },
                { id: 'messages', name: 'MongoDB Messages', icon: Mail },
                { id: 'settings', name: 'Storage & Backup', icon: Settings },
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.65rem 0.85rem',
                      fontSize: '0.88rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
                      backgroundColor: isActive ? 'var(--accent-blue-light)' : 'transparent',
                      borderRadius: 'var(--radius-sm)',
                      textAlign: 'left',
                      width: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <IconComponent size={17} />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Main Editing Panels */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
              
              {/* Tab 1: Profile */}
              {activeTab === 'profile' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    Personal Profile & Headers
                  </h3>

                  {/* Profile Image Section */}
                  <div 
                    style={{
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.5rem',
                    }}
                  >
                    <div 
                      style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        backgroundColor: '#1E293B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {data.profile.profileImage ? (
                        <img src={data.profile.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ color: '#fff', fontWeight: 700 }}>{data.profile.initials || 'MP'}</span>
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                        Profile Photo Management
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                        Upload or replace photo. Valid formats: PNG, JPG, WebP.
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />
                        <button onClick={() => fileInputRef.current?.click()} className="btn btn-secondary btn-sm">
                          <Camera size={14} />
                          <span>Upload New Photo</span>
                        </button>
                        {data.profile.profileImage && (
                          <button onClick={() => handleProfileChange('profileImage', null)} className="btn btn-secondary btn-sm" style={{ color: '#EF4444' }}>
                            <Trash2 size={14} />
                            <span>Remove Photo</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Fields */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={data.profile.name}
                        onChange={(e) => handleProfileChange('name', e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                        Professional Title
                      </label>
                      <input
                        type="text"
                        value={data.profile.title}
                        onChange={(e) => handleProfileChange('title', e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                      Main Headline
                    </label>
                    <input
                      type="text"
                      value={data.profile.headline}
                      onChange={(e) => handleProfileChange('headline', e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                      Status Label (Hero Badge)
                    </label>
                    <input
                      type="text"
                      value={data.profile.statusLabel}
                      onChange={(e) => handleProfileChange('statusLabel', e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                      Hero Supporting Description
                    </label>
                    <textarea
                      rows={3}
                      value={data.profile.heroDescription}
                      onChange={(e) => handleProfileChange('heroDescription', e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                      Career Goal Statement
                    </label>
                    <textarea
                      rows={3}
                      value={data.profile.careerGoal}
                      onChange={(e) => handleProfileChange('careerGoal', e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>
              )}

              {/* Tab 2: Skills */}
              {activeTab === 'skills' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      Skills & Categories
                    </h3>
                  </div>

                  {data.skills.map((cat, catIdx) => (
                    <div 
                      key={cat.id || catIdx}
                      style={{
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                          {cat.category}
                        </div>
                        <button
                          onClick={() => handleAddSkill(catIdx)}
                          className="btn btn-secondary btn-sm"
                          style={{ gap: '0.35rem' }}
                        >
                          <Plus size={14} />
                          <span>Add Skill</span>
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {cat.items.map((skill, sIdx) => (
                          <div 
                            key={skill.id || sIdx}
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '1.5fr 2.5fr auto',
                              gap: '0.75rem',
                              alignItems: 'center',
                              backgroundColor: 'var(--bg-card)',
                              padding: '0.75rem',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-color)',
                            }}
                          >
                            <input
                              type="text"
                              value={skill.name}
                              onChange={(e) => handleUpdateSkill(catIdx, sIdx, 'name', e.target.value)}
                              placeholder="Skill Name"
                              style={inputStyle}
                            />
                            <input
                              type="text"
                              value={skill.desc}
                              onChange={(e) => handleUpdateSkill(catIdx, sIdx, 'desc', e.target.value)}
                              placeholder="Description"
                              style={inputStyle}
                            />
                            <button
                              onClick={() => handleRemoveSkill(catIdx, sIdx)}
                              className="btn btn-secondary btn-icon"
                              style={{ width: '34px', height: '34px', color: '#EF4444' }}
                              title="Delete skill"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Projects */}
              {activeTab === 'projects' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      Projects Management
                    </h3>
                    <button onClick={handleAddProject} className="btn btn-primary btn-sm" style={{ gap: '0.35rem' }}>
                      <Plus size={15} />
                      <span>Add New Project</span>
                    </button>
                  </div>

                  {data.projects.map((proj, pIdx) => (
                    <div 
                      key={proj.id || pIdx}
                      style={{
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800, color: 'var(--accent-blue)', fontSize: '0.85rem' }}>
                          PROJECT #{pIdx + 1}
                        </span>
                        <button
                          onClick={() => handleRemoveProject(pIdx)}
                          className="btn btn-secondary btn-sm"
                          style={{ color: '#EF4444', gap: '0.35rem' }}
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={labelStyle}>Project Title</label>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => handleUpdateProject(pIdx, 'title', e.target.value)}
                            style={inputStyle}
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>Status</label>
                          <select
                            value={proj.status}
                            onChange={(e) => handleUpdateProject(pIdx, 'status', e.target.value)}
                            style={inputStyle}
                          >
                            <option value="Completed">Completed</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Coming Soon">Coming Soon</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label style={labelStyle}>Description</label>
                        <textarea
                          rows={2}
                          value={proj.description}
                          onChange={(e) => handleUpdateProject(pIdx, 'description', e.target.value)}
                          style={inputStyle}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={labelStyle}>Tools (Comma-separated)</label>
                          <input
                            type="text"
                            value={proj.tools.join(', ')}
                            onChange={(e) => handleUpdateProject(pIdx, 'tools', e.target.value.split(',').map(s => s.trim()))}
                            style={inputStyle}
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>GitHub Repository URL</label>
                          <input
                            type="text"
                            placeholder="https://github.com/..."
                            value={proj.githubUrl || ''}
                            onChange={(e) => handleUpdateProject(pIdx, 'githubUrl', e.target.value)}
                            style={inputStyle}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 4: Education */}
              {activeTab === 'education' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      Education Entries
                    </h3>
                    <button onClick={handleAddEducation} className="btn btn-primary btn-sm" style={{ gap: '0.35rem' }}>
                      <Plus size={15} />
                      <span>Add Entry</span>
                    </button>
                  </div>

                  {data.education.map((edu, eIdx) => (
                    <div 
                      key={edu.id || eIdx}
                      style={{
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.85rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800, color: 'var(--accent-blue)', fontSize: '0.85rem' }}>
                          ENTRY #{eIdx + 1}
                        </span>
                        {data.education.length > 1 && (
                          <button
                            onClick={() => handleRemoveEducation(eIdx)}
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#EF4444' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={labelStyle}>Degree / Program</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => handleUpdateEducation(eIdx, 'degree', e.target.value)}
                            style={inputStyle}
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>Academic Status</label>
                          <input
                            type="text"
                            value={edu.academicStatus}
                            onChange={(e) => handleUpdateEducation(eIdx, 'academicStatus', e.target.value)}
                            style={inputStyle}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={labelStyle}>Institution Name</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => handleUpdateEducation(eIdx, 'institution', e.target.value)}
                          placeholder="e.g. University Affiliated College"
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 5: Certifications */}
              {activeTab === 'certifications' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      Certifications
                    </h3>
                    <button onClick={handleAddCert} className="btn btn-primary btn-sm" style={{ gap: '0.35rem' }}>
                      <Plus size={15} />
                      <span>Add Certification</span>
                    </button>
                  </div>

                  {data.certifications.map((cert, cIdx) => (
                    <div 
                      key={cert.id || cIdx}
                      style={{
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.85rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800, color: 'var(--accent-emerald)', fontSize: '0.85rem' }}>
                          CERTIFICATE #{cIdx + 1}
                        </span>
                        <button
                          onClick={() => handleRemoveCert(cIdx)}
                          className="btn btn-secondary btn-sm"
                          style={{ color: '#EF4444' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div>
                        <label style={labelStyle}>Certification Name</label>
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => handleUpdateCert(cIdx, 'name', e.target.value)}
                          style={inputStyle}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={labelStyle}>Issuing Organization</label>
                          <input
                            type="text"
                            value={cert.issuer || ''}
                            onChange={(e) => handleUpdateCert(cIdx, 'issuer', e.target.value)}
                            placeholder="e.g. Coursera / University / Institute"
                            style={inputStyle}
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>Completion Date</label>
                          <input
                            type="text"
                            value={cert.date || ''}
                            onChange={(e) => handleUpdateCert(cIdx, 'date', e.target.value)}
                            placeholder="e.g. August 2024"
                            style={inputStyle}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={labelStyle}>Verification URL</label>
                        <input
                          type="text"
                          value={cert.verificationUrl || ''}
                          onChange={(e) => handleUpdateCert(cIdx, 'verificationUrl', e.target.value)}
                          placeholder="https://..."
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 6: Currently Learning */}
              {activeTab === 'learning' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      Currently Learning Topics
                    </h3>
                    <button onClick={handleAddLearning} className="btn btn-primary btn-sm" style={{ gap: '0.35rem' }}>
                      <Plus size={15} />
                      <span>Add Topic</span>
                    </button>
                  </div>

                  {data.currentlyLearning.map((item, lIdx) => (
                    <div 
                      key={item.id || lIdx}
                      style={{
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        display: 'grid',
                        gridTemplateColumns: '1.2fr 2fr auto',
                        gap: '0.75rem',
                        alignItems: 'center',
                      }}
                    >
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleUpdateLearning(lIdx, 'name', e.target.value)}
                        placeholder="Topic Name"
                        style={inputStyle}
                      />
                      <input
                        type="text"
                        value={item.desc}
                        onChange={(e) => handleUpdateLearning(lIdx, 'desc', e.target.value)}
                        placeholder="Focus / Goals"
                        style={inputStyle}
                      />
                      <button
                        onClick={() => handleRemoveLearning(lIdx)}
                        className="btn btn-secondary btn-icon"
                        style={{ width: '34px', height: '34px', color: '#EF4444' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 7: Contact */}
              {activeTab === 'contact' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Contact Information
                  </h3>

                  <div>
                    <label style={labelStyle}>Email Address (Receives messages)</label>
                    <input
                      type="email"
                      value={data.contact.email}
                      onChange={(e) => handleContactChange('email', e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Phone Number</label>
                    <input
                      type="text"
                      value={data.contact.phone}
                      onChange={(e) => handleContactChange('phone', e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>LinkedIn Profile URL</label>
                    <input
                      type="text"
                      value={data.contact.linkedin}
                      onChange={(e) => handleContactChange('linkedin', e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>GitHub Profile URL</label>
                    <input
                      type="text"
                      value={data.contact.github || ''}
                      onChange={(e) => handleContactChange('github', e.target.value)}
                      placeholder="https://github.com/..."
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Location / Region</label>
                    <input
                      type="text"
                      value={data.contact.location || ''}
                      onChange={(e) => handleContactChange('location', e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>
              )}

              {/* Tab: MongoDB Messages Inbox */}
              {activeTab === 'messages' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                        Inquiries & Messages (MongoDB)
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Inquiries submitted through your website's contact form, stored directly in your MongoDB database.
                      </p>
                    </div>
                    <button 
                      onClick={loadMessages} 
                      disabled={loadingMessages} 
                      className="btn btn-secondary btn-sm"
                      style={{ gap: '0.4rem' }}
                    >
                      <RefreshCw size={14} className={loadingMessages ? 'animate-spin' : ''} />
                      <span>{loadingMessages ? 'Checking...' : 'Refresh Inbox'}</span>
                    </button>
                  </div>

                  {/* DB Connection info banner */}
                  <div
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: liveDbStatus?.status === 'connected' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                      border: `1px solid ${liveDbStatus?.status === 'connected' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Database size={20} color={liveDbStatus?.status === 'connected' ? '#10B981' : '#EF4444'} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                          Database Storage: {liveDbStatus?.status === 'connected' ? 'Connected' : 'Offline / Local Cache'}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {liveDbStatus?.uri || 'mongodb://localhost:27017/mubashira_portfolio'}
                        </div>
                      </div>
                    </div>
                    <span 
                      style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 700, 
                        color: liveDbStatus?.status === 'connected' ? '#10B981' : '#EF4444',
                        backgroundColor: liveDbStatus?.status === 'connected' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '20px'
                      }}
                    >
                      {liveDbStatus?.status === 'connected' ? 'LIVE' : 'DISCONNECTED'}
                    </span>
                  </div>

                  {/* Messages list */}
                  {messages.length === 0 ? (
                    <div
                      style={{
                        padding: '3rem 1.5rem',
                        textAlign: 'center',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px dashed var(--border-color)',
                      }}
                    >
                      <Mail size={36} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.6 }} />
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                        No messages yet
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
                        When a visitor or recruiter submits a message on your Contact form, it will automatically appear here.
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {messages.map((msg) => (
                        <div
                          key={msg._id}
                          style={{
                            padding: '1.25rem',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div>
                              <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                                {msg.name}
                              </div>
                              <a href={`mailto:${msg.email}`} style={{ fontSize: '0.82rem', color: 'var(--accent-blue)', textDecoration: 'underline' }}>
                                {msg.email}
                              </a>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ''}
                              </span>
                              <button
                                onClick={() => handleDeleteMessage(msg._id)}
                                className="btn btn-secondary btn-icon"
                                title="Delete message"
                                style={{ width: '32px', height: '32px', color: '#EF4444' }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                          <div
                            style={{
                              padding: '0.85rem',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: 'var(--bg-card)',
                              border: '1px solid var(--border-color)',
                              fontSize: '0.88rem',
                              color: 'var(--text-secondary)',
                              whiteSpace: 'pre-wrap',
                              lineHeight: 1.5,
                            }}
                          >
                            {msg.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 8: Storage, Backups & Maintenance */}
              {activeTab === 'settings' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    MongoDB Storage & Backups
                  </h3>

                  {/* MongoDB Storage Connection Card */}
                  <div 
                    style={{
                      padding: '1.5rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Database size={22} color={liveDbStatus?.status === 'connected' ? '#10B981' : '#64748B'} />
                        <div>
                          <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                            MongoDB Database Storage
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            URI: <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{liveDbStatus?.uri || 'mongodb://localhost:27017/mubashira_portfolio'}</code>
                          </div>
                        </div>
                      </div>
                      <span 
                        style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 700, 
                          color: liveDbStatus?.status === 'connected' ? '#10B981' : '#94A3B8',
                          backgroundColor: liveDbStatus?.status === 'connected' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(100, 116, 139, 0.12)',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '20px'
                        }}
                      >
                        {liveDbStatus?.status === 'connected' ? 'CONNECTED' : 'DISCONNECTED'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      All edits, projects, and skills are saved directly to your MongoDB database, and synced with local cache for offline reliability.
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={async () => {
                          const status = await apiService.getStatus();
                          setLiveDbStatus(status);
                          alert(status.status === 'connected' ? 'MongoDB connection is ACTIVE on ' + status.uri : 'Backend or MongoDB is currently unreachable. Make sure your MongoDB service and server are running.');
                        }} 
                        className="btn btn-secondary btn-sm"
                        style={{ gap: '0.4rem' }}
                      >
                        <RefreshCw size={13} />
                        <span>Test MongoDB Connection</span>
                      </button>
                    </div>
                  </div>

                  <div 
                    style={{
                      padding: '1.5rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                        Export Portfolio Data
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Download your customized portfolio settings as a JSON file backup to restore or migrate anytime.
                      </p>
                    </div>
                    <div>
                      <button onClick={handleExportJSON} className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
                        <Download size={14} />
                        <span>Export Backup (JSON)</span>
                      </button>
                    </div>
                  </div>

                  <div 
                    style={{
                      padding: '1.5rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                        Import Portfolio Data
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Restore portfolio configuration from a previously exported JSON backup.
                      </p>
                    </div>
                    <div>
                      <input type="file" ref={jsonImportRef} onChange={handleImportJSON} accept=".json" style={{ display: 'none' }} />
                      <button onClick={() => jsonImportRef.current?.click()} className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
                        <FileUp size={14} />
                        <span>Upload JSON Backup</span>
                      </button>
                    </div>
                  </div>

                  <div 
                    style={{
                      padding: '1.5rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(239, 68, 68, 0.05)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, color: '#EF4444', marginBottom: '0.25rem' }}>
                        Reset to Original Defaults
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Restore the original portfolio data provided for Mubashira PK and clear local overrides.
                      </p>
                    </div>
                    <div>
                      <button 
                        onClick={() => {
                          if (window.confirm('Are you sure you want to restore original default settings?')) {
                            onResetDefaults();
                            onClose();
                          }
                        }} 
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#EF4444', borderColor: '#EF4444', gap: '0.4rem' }}
                      >
                        <RotateCcw size={14} />
                        <span>Reset to Original Defaults</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Modal Footer with Save / Cancel Controls */}
        {isAdminUnlocked && (
          <div 
            style={{
              padding: '1.25rem 2rem',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--bg-card)',
            }}
          >
            <div>
              {saveSuccess && (
                <span style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Check size={16} /> Changes saved successfully!
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleSaveChanges} className="btn btn-primary" style={{ gap: '0.5rem' }}>
                <Save size={16} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.65rem 0.85rem',
  fontSize: '0.9rem',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-card)',
  color: 'var(--text-primary)',
  outline: 'none',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.78rem',
  fontWeight: 700,
  color: 'var(--text-muted)',
  marginBottom: '0.35rem',
  textTransform: 'uppercase',
  letterSpacing: '0.04em'
};
