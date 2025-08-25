import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { useResume } from "../../context/ResumeContext";

const MyTemplate1 = () => {
  const resumeRef = useRef(null);
  const { resumeData, setResumeData } = useResume();
  const [editMode, setEditMode] = useState(false);
  const [localData, setLocalData] = useState(resumeData);

  useEffect(() => {
    setLocalData(resumeData);
  }, [resumeData]);

  // Fixed theme with RGB/hex colors instead of oklch
  const theme = {
    primary: "rgb(37, 99, 235)", // blue-600
    secondary: "rgb(55, 65, 81)", // gray-700
    accent: "rgb(239, 246, 255)", // blue-50
    text: "rgb(30, 58, 138)", // blue-900
    border: "rgb(191, 219, 254)", // blue-200
    button: "rgb(37, 99, 235)", // blue-600
    buttonHover: "rgb(29, 78, 216)", // blue-700
    card: "rgb(255, 255, 255)",
    header: "rgb(37, 99, 235)", // blue-600
    gray50: "rgb(249, 250, 251)",
    gray100: "rgb(243, 244, 246)",
    gray200: "rgb(229, 231, 235)",
    gray300: "rgb(209, 213, 219)",
    gray500: "rgb(107, 114, 128)",
    gray600: "rgb(75, 85, 99)",
    gray700: "rgb(55, 65, 81)",
    gray900: "rgb(17, 24, 39)",
    red300: "rgb(252, 165, 165)",
    red400: "rgb(248, 113, 113)",
    red500: "rgb(239, 68, 68)",
    red700: "rgb(185, 28, 28)",
    red900: "rgb(127, 29, 29)",
    green500: "rgb(34, 197, 94)",
    green600: "rgb(22, 163, 74)"
  };

  const handleFieldChange = (field, value) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayFieldChange = (field, index, value) => {
    setLocalData((prev) => {
      const updated = [...(prev[field] || [])];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  const addExperience = () => {
    const currentExperiences = localData.experience || [];
    const hasEmptyExperience = currentExperiences.some(exp => 
      !exp.title?.trim() || !exp.companyName?.trim()
    );
    
    if (hasEmptyExperience) {
      alert("Please fill in the job title and company name for existing experiences before adding a new one.");
      return;
    }
    
    setLocalData((prev) => ({
      ...prev,
      experience: [
        ...(prev.experience || []),
        {
          title: "",
          companyName: "",
          date: "",
          companyLocation: "",
          accomplishment: []
        }
      ]
    }));
  };

  const removeExperience = (index) => {
    setLocalData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    const currentSkills = localData.skills || [];
    const hasEmptySkill = currentSkills.some(skill => !skill?.trim());
    
    if (hasEmptySkill) {
      alert("Please fill in all existing skills before adding a new one.");
      return;
    }
    
    setLocalData((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), ""]
    }));
  };

  const removeSkill = (index) => {
    setLocalData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addLanguage = () => {
    const currentLanguages = localData.languages || [];
    const hasEmptyLanguage = currentLanguages.some(lang => !lang?.trim());
    
    if (hasEmptyLanguage) {
      alert("Please fill in all existing languages before adding a new one.");
      return;
    }
    
    setLocalData((prev) => ({
      ...prev,
      languages: [...(prev.languages || []), ""],
    }));
  };

  const removeLanguage = (index) => {
    setLocalData((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }));
  };

  const addInterest = () => {
    const currentInterests = localData.interests || [];
    const hasEmptyInterest = currentInterests.some(interest => !interest?.trim());
    
    if (hasEmptyInterest) {
      alert("Please fill in all existing interests before adding a new one.");
      return;
    }
    
    setLocalData((prev) => ({
      ...prev,
      interests: [...(prev.interests || []), ""],
    }));
  };

  const removeInterest = (index) => {
    setLocalData((prev) => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    const errors = [];
    
    if (!localData.name?.trim()) errors.push("Name is required");
    if (!localData.role?.trim()) errors.push("Role/Title is required");
    
    const experiences = localData.experience || [];
    experiences.forEach((exp, index) => {
      if ((exp.title?.trim() || exp.companyName?.trim()) && (!exp.title?.trim() || !exp.companyName?.trim())) {
        errors.push(`Experience ${index + 1}: Both job title and company name are required`);
      }
    });
    
    const skills = localData.skills || [];
    const emptySkillsCount = skills.filter(s => !s?.trim()).length;
    if (emptySkillsCount > 0) {
      errors.push(`Please fill in all ${emptySkillsCount} empty skill(s) or remove them`);
    }
    
    const languages = localData.languages || [];
    const emptyLanguagesCount = languages.filter(l => !l?.trim()).length;
    if (emptyLanguagesCount > 0) {
      errors.push(`Please fill in all ${emptyLanguagesCount} empty language(s) or remove them`);
    }
    
    const interests = localData.interests || [];
    const emptyInterestsCount = interests.filter(i => !i?.trim()).length;
    if (emptyInterestsCount > 0) {
      errors.push(`Please fill in all ${emptyInterestsCount} empty interest(s) or remove them`);
    }
    
    if (errors.length > 0) {
      alert("Please fix the following issues:\n\n" + errors.join("\n"));
      return;
    }
    
    setResumeData({
      ...localData,
      skills: (localData.skills || []).filter(s => s && s.trim()),
      languages: (localData.languages || []).filter(l => l && l.trim()),
      interests: (localData.interests || []).filter(i => i && i.trim()),
      experience: (localData.experience || []).filter(exp => exp.title?.trim() && exp.companyName?.trim()),
    });
    setEditMode(false);
  };

  const handleCancel = () => {
    setLocalData(resumeData);
    setEditMode(false);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.gray50 }}>
      <Navbar />
      <div className="flex">
        <Sidebar resumeRef={resumeRef} />
        <div className="flex-1 p-8">
          <div className="flex justify-center">
            <div
              ref={resumeRef}
              className="shadow-lg border-2 font-sans"
              style={{ 
                width: "595pt", 
                minHeight: "842pt",
                backgroundColor: theme.card,
                borderColor: theme.gray300
              }}
            >
              {/* Professional Header */}
              <div className="p-6 text-white" style={{ backgroundColor: theme.header }}>
                <div className="text-center">
                  {editMode ? (
                    <>
                      <input
                        type="text"
                        value={localData.name}
                        onChange={(e) => handleFieldChange("name", e.target.value)}
                        className="text-3xl font-bold bg-transparent text-white placeholder-white placeholder-opacity-80 w-full mb-2 text-center border-b focus:border-opacity-100"
                        style={{ 
                          borderColor: !localData.name?.trim() ? theme.red400 : 'rgba(255, 255, 255, 0.3)'
                        }}
                        placeholder="Your Name *"
                      />
                      <input
                        type="text"
                        value={localData.role}
                        onChange={(e) => handleFieldChange("role", e.target.value)}
                        className="text-lg bg-transparent text-white placeholder-white placeholder-opacity-80 w-full text-center border-b focus:border-opacity-100"
                        style={{ 
                          borderColor: !localData.role?.trim() ? theme.red400 : 'rgba(255, 255, 255, 0.3)'
                        }}
                        placeholder="Your Title *"
                      />
                    </>
                  ) : (
                    <>
                      <h1 className="text-3xl font-bold mb-2">{resumeData.name}</h1>
                      <p className="text-lg opacity-90">{resumeData.role}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="p-4 border-b" style={{ backgroundColor: theme.gray100, borderColor: theme.gray200 }}>
                <div className="flex flex-wrap justify-center gap-6 text-sm" style={{ color: theme.gray700 }}>
                  <div className="flex items-center gap-2">
                    <span style={{ color: theme.gray500 }}>📍</span>
                    {editMode ? (
                      <input
                        type="text"
                        value={localData.location}
                        onChange={(e) => handleFieldChange("location", e.target.value)}
                        className="bg-transparent border-b focus:outline-none"
                        style={{ 
                          color: theme.gray700,
                          borderColor: theme.gray300
                        }}
                        placeholder="Location"
                      />
                    ) : (
                      <span>{resumeData.location}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{ color: theme.gray500 }}>📞</span>
                    {editMode ? (
                      <input
                        type="text"
                        value={localData.phone}
                        onChange={(e) => handleFieldChange("phone", e.target.value)}
                        className="bg-transparent border-b focus:outline-none"
                        style={{ 
                          color: theme.gray700,
                          borderColor: theme.gray300
                        }}
                        placeholder="Phone"
                      />
                    ) : (
                      <span>{resumeData.phone}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{ color: theme.gray500 }}>✉️</span>
                    {editMode ? (
                      <input
                        type="text"
                        value={localData.email}
                        onChange={(e) => handleFieldChange("email", e.target.value)}
                        className="bg-transparent border-b focus:outline-none"
                        style={{ 
                          color: theme.gray700,
                          borderColor: theme.gray300
                        }}
                        placeholder="Email"
                      />
                    ) : (
                      <span>{resumeData.email}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{ color: theme.gray500 }}>🔗</span>
                    {editMode ? (
                      <input
                        type="text"
                        value={localData.linkedin}
                        onChange={(e) => handleFieldChange("linkedin", e.target.value)}
                        className="bg-transparent border-b focus:outline-none"
                        style={{ 
                          color: theme.gray700,
                          borderColor: theme.gray300
                        }}
                        placeholder="LinkedIn"
                      />
                    ) : (
                      <span>{resumeData.linkedin}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex min-h-[calc(842pt-200pt)]">
                {/* Left Sidebar */}
                <div className="w-1/3 p-6 border-r overflow-y-auto" style={{ backgroundColor: theme.gray50, borderColor: theme.gray200 }}>
                  {/* Skills Section */}
                  {(localData.skills?.length > 0 || editMode) && (
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold border-b pb-2" style={{ color: theme.text, borderColor: theme.border }}>
                          Skills
                        </h3>
                        {editMode && (
                          <button
                            onClick={addSkill}
                            className="text-sm text-white px-2 py-1 rounded"
                            style={{ backgroundColor: theme.green500 }}
                          >
                            +
                          </button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {localData.skills?.map((skill, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            {editMode ? (
                              <>
                                <input
                                  type="text"
                                  value={skill || ""}
                                  onChange={(e) => handleArrayFieldChange("skills", idx, e.target.value)}
                                  className="flex-1 px-3 py-2 rounded font-medium text-sm border focus:outline-none"
                                  style={{
                                    backgroundColor: !skill?.trim() ? theme.red50 : theme.accent,
                                    color: !skill?.trim() ? theme.red900 : theme.text,
                                    borderColor: !skill?.trim() ? theme.red300 : 'transparent'
                                  }}
                                  placeholder="Skill *"
                                />
                                <button
                                  onClick={() => removeSkill(idx)}
                                  className="text-sm hover:opacity-70"
                                  style={{ color: theme.red500 }}
                                >
                                  ×
                                </button>
                              </>
                            ) : (
                              <div className="px-3 py-2 rounded font-medium text-sm break-words" style={{ backgroundColor: theme.accent, color: theme.text }}>
                                {skill}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education Section */}
                  {resumeData.education?.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-bold mb-4 border-b pb-2" style={{ color: theme.text, borderColor: theme.border }}>
                        Education
                      </h3>
                      <div className="space-y-4">
                        {resumeData.education.map((edu, idx) => (
                          <div key={idx} className="p-4 rounded border shadow-sm" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
                            <h4 className="font-bold break-words" style={{ color: theme.gray900 }}>{edu.degree}</h4>
                            <p className="text-sm break-words" style={{ color: theme.gray600 }}>{edu.institution}</p>
                            <p className="text-xs" style={{ color: theme.gray500 }}>{edu.duration}</p>
                            {edu.location && (
                              <p className="text-xs break-words" style={{ color: theme.gray500 }}>{edu.location}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Languages Section */}
                  {(localData.languages?.length > 0 || editMode) && (
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold border-b pb-2" style={{ color: theme.text, borderColor: theme.border }}>
                          Languages
                        </h3>
                        {editMode && (
                          <button
                            onClick={addLanguage}
                            className="text-sm text-white px-2 py-1 rounded"
                            style={{ backgroundColor: theme.green500 }}
                          >
                            +
                          </button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {(editMode ? localData.languages : (localData.languages || []).filter(l => !!l.trim())).map((lang, idx) => (
                          <div key={idx} className="flex items-center gap-2 px-3 py-2 rounded text-sm break-words" style={{ backgroundColor: theme.accent, color: theme.text }}>
                            {editMode ? (
                              <>
                                <input
                                  type="text"
                                  value={lang || ""}
                                  onChange={(e) => handleArrayFieldChange("languages", idx, e.target.value)}
                                  className="flex-1 px-3 py-2 rounded font-medium text-sm border focus:outline-none"
                                  style={{
                                    backgroundColor: !lang?.trim() ? theme.red50 : theme.accent,
                                    color: !lang?.trim() ? theme.red900 : theme.text,
                                    borderColor: !lang?.trim() ? theme.red300 : 'transparent'
                                  }}
                                  placeholder="Language *"
                                />
                                <button
                                  onClick={() => removeLanguage(idx)}
                                  className="text-sm hover:opacity-70"
                                  style={{ color: theme.red500 }}
                                >
                                  ×
                                </button>
                              </>
                            ) : (
                              <span className="font-medium">{lang}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interests Section */}
                  {(localData.interests?.length > 0 || editMode) && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold border-b pb-2" style={{ color: theme.text, borderColor: theme.border }}>
                          Interests
                        </h3>
                        {editMode && (
                          <button
                            onClick={addInterest}
                            className="text-sm text-white px-2 py-1 rounded"
                            style={{ backgroundColor: theme.green500 }}
                          >
                            +
                          </button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {(editMode ? localData.interests : (localData.interests || []).filter(i => !!i.trim())).map((interest, idx) => (
                          <div key={idx} className="flex items-center gap-2 px-3 py-2 rounded text-sm break-words" style={{ backgroundColor: theme.accent, color: theme.text }}>
                            {editMode ? (
                              <>
                                <input
                                  type="text"
                                  value={interest || ""}
                                  onChange={(e) => handleArrayFieldChange("interests", idx, e.target.value)}
                                  className="flex-1 px-3 py-2 rounded font-medium text-sm border focus:outline-none"
                                  style={{
                                    backgroundColor: !interest?.trim() ? theme.red50 : theme.accent,
                                    color: !interest?.trim() ? theme.red900 : theme.text,
                                    borderColor: !interest?.trim() ? theme.red300 : 'transparent'
                                  }}
                                  placeholder="Interest *"
                                />
                                <button
                                  onClick={() => removeInterest(idx)}
                                  className="text-sm hover:opacity-70"
                                  style={{ color: theme.red500 }}
                                >
                                  ×
                                </button>
                              </>
                            ) : (
                              <>{interest}</>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Content */}
                <div className="w-2/3 p-6 overflow-y-auto max-h-full">
                  {/* Summary Section */}
                  {(resumeData.summary || editMode) && (
                    <div className="mb-8">
                      <h3 className="text-lg font-bold mb-4 border-b pb-2" style={{ color: theme.text, borderColor: theme.border }}>
                        Summary
                      </h3>
                      {editMode ? (
                        <textarea
                          value={localData.summary}
                          onChange={(e) => handleFieldChange("summary", e.target.value)}
                          className="w-full p-3 border rounded focus:outline-none resize-none"
                          style={{ borderColor: theme.gray300 }}
                          rows={4}
                          placeholder="Enter your professional summary..."
                        />
                      ) : (
                        <p className="leading-relaxed break-words" style={{ color: theme.gray700 }}>{resumeData.summary}</p>
                      )}
                    </div>
                  )}

                  {/* Experience Section */}
                  {(localData.experience?.length > 0 || editMode) && (
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold border-b pb-2" style={{ color: theme.text, borderColor: theme.border }}>
                          Experience
                        </h3>
                        {editMode && (
                          <button
                            onClick={addExperience}
                            className="text-sm text-white px-3 py-1 rounded"
                            style={{ backgroundColor: theme.green500 }}
                          >
                            + Add Experience
                          </button>
                        )}
                      </div>
                      <div className="space-y-6">
                        {localData.experience?.map((exp, idx) => (
                          <div key={idx} className="relative">
                            <div className="absolute left-0 top-0 w-2 h-2 rounded-full" style={{ backgroundColor: theme.button }}></div>
                            <div className="absolute left-0.5 top-2 h-full w-0.5" style={{ backgroundColor: theme.accent }}></div>
                            <div className="pl-6">
                              {editMode ? (
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-bold" style={{ color: theme.gray900 }}>Experience #{idx + 1}</h4>
                                    <button
                                      onClick={() => removeExperience(idx)}
                                      className="text-sm hover:opacity-70"
                                      style={{ color: theme.red500 }}
                                    >
                                      Remove
                                    </button>
                                  </div>
                                  <input
                                    type="text"
                                    value={localData.experience[idx]?.title || ""}
                                    onChange={(e) => {
                                      const updated = [...localData.experience];
                                      if (updated[idx]) {
                                        updated[idx].title = e.target.value;
                                        handleFieldChange("experience", updated);
                                      }
                                    }}
                                    className="w-full p-2 border rounded focus:outline-none"
                                    style={{
                                      borderColor: !localData.experience[idx]?.title?.trim() ? theme.red300 : theme.gray300,
                                      backgroundColor: !localData.experience[idx]?.title?.trim() ? 'rgb(254, 242, 242)' : 'white'
                                    }}
                                    placeholder="Job Title *"
                                  />
                                  <input
                                    type="text"
                                    value={localData.experience[idx]?.companyName || ""}
                                    onChange={(e) => {
                                      const updated = [...localData.experience];
                                      if (updated[idx]) {
                                        updated[idx].companyName = e.target.value;
                                        handleFieldChange("experience", updated);
                                      }
                                    }}
                                    className="w-full p-2 border rounded focus:outline-none"
                                    style={{
                                      borderColor: !localData.experience[idx]?.companyName?.trim() ? theme.red300 : theme.gray300,
                                      backgroundColor: !localData.experience[idx]?.companyName?.trim() ? 'rgb(254, 242, 242)' : 'white'
                                    }}
                                    placeholder="Company Name *"
                                  />
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={localData.experience[idx]?.date || ""}
                                      onChange={(e) => {
                                        const updated = [...localData.experience];
                                        if (updated[idx]) {
                                          updated[idx].date = e.target.value;
                                          handleFieldChange("experience", updated);
                                        }
                                      }}
                                      className="w-1/2 p-2 border rounded focus:outline-none"
                                      style={{ borderColor: theme.gray300 }}
                                      placeholder="Duration"
                                    />
                                    <input
                                      type="text"
                                      value={localData.experience[idx]?.companyLocation || ""}
                                      onChange={(e) => {
                                        const updated = [...localData.experience];
                                        if (updated[idx]) {
                                          updated[idx].companyLocation = e.target.value;
                                          handleFieldChange("experience", updated);
                                        }
                                      }}
                                      className="w-1/2 p-2 border rounded focus:outline-none"
                                      style={{ borderColor: theme.gray300 }}
                                      placeholder="Location"
                                    />
                                  </div>
                                  <textarea
                                    value={localData.experience[idx]?.accomplishment?.join("\n") || ""}
                                    onChange={(e) => {
                                      const updated = [...localData.experience];
                                      if (updated[idx]) {
                                        updated[idx].accomplishment = e.target.value.split("\n").filter(Boolean);
                                        handleFieldChange("experience", updated);
                                      }
                                    }}
                                    className="w-full p-2 border rounded focus:outline-none resize-none"
                                    style={{ borderColor: theme.gray300 }}
                                    rows={3}
                                    placeholder="Enter accomplishments (one per line)"
                                  />
                                </div>
                              ) : (
                                <>
                                  <h4 className="font-bold text-lg break-words" style={{ color: theme.gray900 }}>{exp.title}</h4>
                                  <p className="font-medium break-words" style={{ color: theme.gray600 }}>{exp.companyName}</p>
                                  <p className="text-sm break-words" style={{ color: theme.gray500 }}>{exp.date} • {exp.companyLocation}</p>
                                  <ul className="mt-3 space-y-1">
                                    {exp.accomplishment?.map((item, i) => (
                                      <li key={i} className="text-sm flex items-start gap-2" style={{ color: theme.gray700 }}>
                                        <span className="mt-1 flex-shrink-0" style={{ color: theme.primary }}>•</span>
                                        <span className="break-words">{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects Section */}
                  {localData.projects?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold mb-6 border-b pb-2" style={{ color: theme.text, borderColor: theme.border }}>
                        Projects
                      </h3>
                      <div className="space-y-4">
                        {localData.projects.map((proj, idx) => (
                          <div key={idx} className="p-4 rounded border shadow-sm" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
                            {editMode ? (
                              <div className="space-y-3">
                                <input
                                  type="text"
                                  value={proj.name || ""}
                                  onChange={(e) => {
                                    const updated = [...localData.projects];
                                    if (updated[idx]) {
                                      updated[idx].name = e.target.value;
                                      handleFieldChange("projects", updated);
                                    }
                                  }}
                                  className="w-full p-2 border rounded focus:outline-none"
                                  style={{ borderColor: theme.gray300 }}
                                  placeholder="Project Name"
                                />
                                <textarea
                                  value={proj.description || ""}
                                  onChange={(e) => {
                                    const updated = [...localData.projects];
                                    if (updated[idx]) {
                                      updated[idx].description = e.target.value;
                                      handleFieldChange("projects", updated);
                                    }
                                  }}
                                  className="w-full p-2 border rounded focus:outline-none resize-none"
                                  style={{ borderColor: theme.gray300 }}
                                  rows={2}
                                  placeholder="Project Description"
                                />
                                <input
                                  type="text"
                                  value={proj.link || ""}
                                  onChange={(e) => {
                                    const updated = [...localData.projects];
                                    if (updated[idx]) {
                                      updated[idx].link = e.target.value;
                                      handleFieldChange("projects", updated);
                                    }
                                  }}
                                  className="w-full p-2 border rounded focus:outline-none"
                                  style={{ borderColor: theme.gray300 }}
                                  placeholder="Project Link (optional)"
                                />
                              </div>
                            ) : (
                              <>
                                <h4 className="font-bold break-words" style={{ color: theme.gray900 }}>{proj.name}</h4>
                                <p className="text-sm mt-2 break-words" style={{ color: theme.gray700 }}>{proj.description}</p>
                                {proj.link && (
                                  <a
                                    href={proj.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-2 text-sm hover:underline break-all"
                                    style={{ color: theme.text }}
                                  >
                                    🔗 View Project
                                  </a>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center gap-4">
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 rounded-lg text-white font-medium transition-all"
                  style={{ backgroundColor: theme.button }}
                >
                  💾 Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 rounded-lg text-white font-medium transition-all"
                  style={{ backgroundColor: theme.gray500 }}
                >
                  ❌ Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="px-6 py-3 rounded-lg text-white font-medium transition-all"
                style={{ backgroundColor: theme.button }}
              >
                ✏️ Edit Resume
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTemplate1;