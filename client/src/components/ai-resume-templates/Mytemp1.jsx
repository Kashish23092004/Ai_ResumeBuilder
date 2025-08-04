import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { useResume } from "../../context/ResumeContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function MyTemplate1() {
  const resumeRef = useRef(null);
  const { resumeData, setResumeData } = useResume();
  const [editMode, setEditMode] = useState(false);
  const [localData, setLocalData] = useState(resumeData);
  const [currentTheme, setCurrentTheme] = useState("gradient-purple");
  const [currentFont, setCurrentFont] = useState("font-sans");
  const [customColors, setCustomColors] = useState({
    primary: "#8b5cf6",
    secondary: "#6366f1",
    accent: "#f3e8ff",
    text: "#581c87"
  });

  useEffect(() => {
    setLocalData(resumeData);
  }, [resumeData]);

  const themes = {
    "gradient-purple": {
      primary: "from-purple-500 to-indigo-600",
      secondary: "from-violet-400 to-purple-500",
      accent: "bg-purple-100",
      text: "text-purple-800",
      border: "border-purple-300",
      button: "bg-gradient-to-r from-purple-500 to-indigo-600",
      card: "bg-gradient-to-br from-purple-50 to-indigo-50",
    },
    "gradient-teal": {
      primary: "from-teal-500 to-cyan-600",
      secondary: "from-cyan-400 to-teal-500",
      accent: "bg-teal-100",
      text: "text-teal-800",
      border: "border-teal-300",
      button: "bg-gradient-to-r from-teal-500 to-cyan-600",
      card: "bg-gradient-to-br from-teal-50 to-cyan-50",
    },
    "gradient-amber": {
      primary: "from-amber-500 to-orange-600",
      secondary: "from-orange-400 to-amber-500",
      accent: "bg-amber-100",
      text: "text-amber-800",
      border: "border-amber-300",
      button: "bg-gradient-to-r from-amber-500 to-orange-600",
      card: "bg-gradient-to-br from-amber-50 to-orange-50",
    },
    "gradient-emerald": {
      primary: "from-emerald-500 to-green-600",
      secondary: "from-green-400 to-emerald-500",
      accent: "bg-emerald-100",
      text: "text-emerald-800",
      border: "border-emerald-300",
      button: "bg-gradient-to-r from-emerald-500 to-green-600",
      card: "bg-gradient-to-br from-emerald-50 to-green-50",
    },
  };

  const fonts = [
    { name: "Sans Serif", class: "font-sans" },
    { name: "Serif", class: "font-serif" },
    { name: "Monospace", class: "font-mono" },
    { name: "Display", class: "font-display" },
  ];

  const theme = themes[currentTheme];

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

  const handleSave = () => {
    setResumeData(localData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setLocalData(resumeData);
    setEditMode(false);
  };

  const handleDownload = async () => {
    try {
      setEditMode(false);
      
      // Wait a bit for the DOM to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const element = resumeRef.current;
      if (!element) throw new Error('Resume element not found');
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 595,
        height: 842,
        logging: false,
        allowTaint: true,
        foreignObjectRendering: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('resume.pdf');
    } catch (error) {
      console.error('PDF generation error:', error);
      alert(`Failed to generate PDF: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          {/* Customization Panel */}
          <div className="mb-6 flex justify-center gap-4 flex-wrap">
            {/* Theme Selector */}
            <div className="flex gap-2">
              {Object.keys(themes).map((themeKey) => (
                <button
                  key={themeKey}
                  onClick={() => setCurrentTheme(themeKey)}
                  className={`px-4 py-2 rounded-lg text-white font-medium transition-all ${
                    currentTheme === themeKey
                      ? 'ring-2 ring-offset-2 ring-purple-500'
                      : 'opacity-70 hover:opacity-100'
                  } ${themes[themeKey].button}`}
                >
                  {themeKey.replace('gradient-', '').charAt(0).toUpperCase() + 
                   themeKey.replace('gradient-', '').slice(1)}
                </button>
              ))}
            </div>

            {/* Font Selector */}
            <div className="flex gap-2">
              <select
                value={currentFont}
                onChange={(e) => setCurrentFont(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
              >
                {fonts.map((font) => (
                  <option key={font.class} value={font.class}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Color Customization */}
            <div className="flex gap-2">
              <input
                type="color"
                value={customColors.primary}
                onChange={(e) => setCustomColors(prev => ({ ...prev, primary: e.target.value }))}
                className="w-12 h-10 rounded border border-gray-300"
                title="Primary Color"
              />
              <input
                type="color"
                value={customColors.secondary}
                onChange={(e) => setCustomColors(prev => ({ ...prev, secondary: e.target.value }))}
                className="w-12 h-10 rounded border border-gray-300"
                title="Secondary Color"
              />
              <input
                type="color"
                value={customColors.accent}
                onChange={(e) => setCustomColors(prev => ({ ...prev, accent: e.target.value }))}
                className="w-12 h-10 rounded border border-gray-300"
                title="Accent Color"
              />
            </div>
          </div>

          {/* Resume Container */}
          <div className="flex justify-center">
            <div
              ref={resumeRef}
              className={`w-[595pt] h-[842pt] bg-white shadow-2xl rounded-lg overflow-hidden border-4 border-gray-200 ${currentFont}`}
              style={{ width: "595pt", height: "842pt" }}
            >
              {/* Creative Header with Shapes */}
              <div className={`bg-gradient-to-r ${theme.primary} p-8 text-white relative overflow-hidden`}>
                {/* Decorative Shapes */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
                <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white opacity-10 rounded-full"></div>
                <div className="absolute bottom-1/4 left-1/3 w-12 h-12 bg-white opacity-10 rounded-full"></div>
                
                <div className="relative z-10 text-center">
                  {editMode ? (
                    <>
                      <input
                        type="text"
                        value={localData.name}
                        onChange={(e) => handleFieldChange("name", e.target.value)}
                        className="text-4xl font-bold bg-transparent text-white placeholder-white placeholder-opacity-80 w-full mb-2 text-center border-b-2 border-white border-opacity-30 focus:border-opacity-100 transition-all"
                        placeholder="Your Name"
                      />
                      <input
                        type="text"
                        value={localData.role}
                        onChange={(e) => handleFieldChange("role", e.target.value)}
                        className="text-xl bg-transparent text-white placeholder-white placeholder-opacity-80 w-full text-center border-b-2 border-white border-opacity-30 focus:border-opacity-100 transition-all"
                        placeholder="Your Title"
                      />
                    </>
                  ) : (
                    <>
                      <h1 className="text-4xl font-bold mb-2">{resumeData.name}</h1>
                      <p className="text-xl opacity-90">{resumeData.role}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Contact Info with Icons */}
              <div className={`bg-gradient-to-r ${theme.secondary} p-4 text-white`}>
                <div className="flex flex-wrap justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2 hover:scale-105 transition-transform">
                    <span className="text-lg">📍</span>
                    {editMode ? (
                      <input
                        type="text"
                        value={localData.location}
                        onChange={(e) => handleFieldChange("location", e.target.value)}
                        className="bg-transparent text-white placeholder-white placeholder-opacity-80 border-b border-white border-opacity-30 focus:border-opacity-100"
                        placeholder="Location"
                      />
                    ) : (
                      <span>{resumeData.location}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 hover:scale-105 transition-transform">
                    <span className="text-lg">📞</span>
                    {editMode ? (
                      <input
                        type="text"
                        value={localData.phone}
                        onChange={(e) => handleFieldChange("phone", e.target.value)}
                        className="bg-transparent text-white placeholder-white placeholder-opacity-80 border-b border-white border-opacity-30 focus:border-opacity-100"
                        placeholder="Phone"
                      />
                    ) : (
                      <span>{resumeData.phone}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 hover:scale-105 transition-transform">
                    <span className="text-lg">✉️</span>
                    {editMode ? (
                      <input
                        type="text"
                        value={localData.email}
                        onChange={(e) => handleFieldChange("email", e.target.value)}
                        className="bg-transparent text-white placeholder-white placeholder-opacity-80 border-b border-white border-opacity-30 focus:border-opacity-100"
                        placeholder="Email"
                      />
                    ) : (
                      <span>{resumeData.email}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 hover:scale-105 transition-transform">
                    <span className="text-lg">🔗</span>
                    {editMode ? (
                      <input
                        type="text"
                        value={localData.linkedin}
                        onChange={(e) => handleFieldChange("linkedin", e.target.value)}
                        className="bg-transparent text-white placeholder-white placeholder-opacity-80 border-b border-white border-opacity-30 focus:border-opacity-100"
                        placeholder="LinkedIn"
                      />
                    ) : (
                      <span>{resumeData.linkedin}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex h-[calc(842pt-200pt)]">
                {/* Left Sidebar */}
                <div className="w-1/3 p-6 bg-gray-50">
                  {/* Skills Section */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-xl font-bold ${theme.text} flex items-center gap-2`}>
                        <span className="text-2xl">🛠️</span>
                        Skills
                      </h3>
                      {editMode && (
                        <button
                          onClick={addSkill}
                          className="text-sm bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        >
                          +
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {resumeData.skills?.map((skill, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          {editMode ? (
                            <>
                              <input
                                type="text"
                                value={localData.skills[idx] || ""}
                                onChange={(e) => handleArrayFieldChange("skills", idx, e.target.value)}
                                className={`flex-1 px-3 py-2 rounded-lg ${theme.accent} ${theme.text} font-medium text-sm border border-transparent focus:border-purple-300`}
                                placeholder="Skill"
                              />
                              <button
                                onClick={() => removeSkill(idx)}
                                className="text-red-500 hover:text-red-700 text-sm"
                              >
                                ×
                              </button>
                            </>
                          ) : (
                            <div className={`px-3 py-2 rounded-lg ${theme.accent} ${theme.text} font-medium text-sm hover:scale-105 transition-transform cursor-pointer`}>
                              {skill}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education Section */}
                  <div className="mb-8">
                    <h3 className={`text-xl font-bold mb-4 ${theme.text} flex items-center gap-2`}>
                      <span className="text-2xl">🎓</span>
                      Education
                    </h3>
                    <div className="space-y-4">
                      {resumeData.education.map((edu, idx) => (
                        <div key={idx} className={`p-4 rounded-lg ${theme.card} border ${theme.border} hover:shadow-md transition-shadow`}>
                          <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                          <p className="text-sm text-gray-600">{edu.institution}</p>
                          <p className="text-xs text-gray-500">{edu.duration}</p>
                          {edu.location && (
                            <p className="text-xs text-gray-500">{edu.location}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Languages Section */}
                  {resumeData.languages && (
                    <div className="mb-8">
                      <h3 className={`text-xl font-bold mb-4 ${theme.text} flex items-center gap-2`}>
                        <span className="text-2xl">🌍</span>
                        Languages
                      </h3>
                      <div className="space-y-2">
                        {resumeData.languages.map((lang, idx) => (
                          <div
                            key={idx}
                            className={`px-3 py-2 rounded-lg ${theme.accent} ${theme.text} text-sm hover:scale-105 transition-transform`}
                          >
                            <span className="font-medium">{lang}</span>
                            {lang.proficiency && (
                              <span className="text-xs opacity-75 ml-2">({lang.proficiency})</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interests Section */}
                  {resumeData.interests && (
                    <div>
                      <h3 className={`text-xl font-bold mb-4 ${theme.text} flex items-center gap-2`}>
                        <span className="text-2xl">❤️</span>
                        Interests
                      </h3>
                      <div className="space-y-2">
                        {resumeData.interests.map((interest, idx) => (
                          <div
                            key={idx}
                            className={`px-3 py-2 rounded-lg ${theme.accent} ${theme.text} text-sm hover:scale-105 transition-transform`}
                          >
                            {interest}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Content */}
                <div className="w-2/3 p-6">
                  {/* Summary Section */}
                  <div className="mb-8">
                    <h3 className={`text-xl font-bold mb-4 ${theme.text} flex items-center gap-2`}>
                      <span className="text-2xl">📝</span>
                      Summary
                    </h3>
                    {editMode ? (
                      <textarea
                        value={localData.summary}
                        onChange={(e) => handleFieldChange("summary", e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={4}
                        placeholder="Enter your professional summary..."
                      />
                    ) : (
                      <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
                    )}
                  </div>

                  {/* Experience Section */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className={`text-xl font-bold ${theme.text} flex items-center gap-2`}>
                        <span className="text-2xl">💼</span>
                        Experience
                      </h3>
                      {editMode && (
                        <button
                          onClick={addExperience}
                          className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          + Add Experience
                        </button>
                      )}
                    </div>
                    <div className="space-y-6">
                      {resumeData.experience.map((exp, idx) => (
                        <div key={idx} className="relative">
                          <div className={`absolute left-0 top-0 w-3 h-3 rounded-full ${theme.button} border-2 border-white`}></div>
                          <div className={`absolute left-1.5 top-3 h-full w-0.5 ${theme.accent}`}></div>
                          <div className="pl-8">
                            {editMode ? (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-bold text-gray-900">Experience #{idx + 1}</h4>
                                  <button
                                    onClick={() => removeExperience(idx)}
                                    className="text-red-500 hover:text-red-700 text-sm"
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
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                                  placeholder="Job Title"
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
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                                  placeholder="Company Name"
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
                                    className="w-1/2 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
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
                                    className="w-1/2 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
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
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                                  rows={3}
                                  placeholder="Enter accomplishments (one per line)"
                                />
                              </div>
                            ) : (
                              <>
                                <h4 className="font-bold text-gray-900 text-lg">{exp.title}</h4>
                                <p className="text-gray-600 font-medium">{exp.companyName}</p>
                                <p className="text-sm text-gray-500">{exp.date} • {exp.companyLocation}</p>
                                <ul className="mt-3 space-y-1">
                                  {exp.accomplishment?.map((item, i) => (
                                    <li key={i} className="text-gray-700 text-sm flex items-start gap-2">
                                      <span className="text-purple-500 mt-1">•</span>
                                      <span>{item}</span>
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

                  {/* Projects Section */}
                  {resumeData.projects && (
                    <div>
                      <h3 className={`text-xl font-bold mb-6 ${theme.text} flex items-center gap-2`}>
                        <span className="text-2xl">🚀</span>
                        Projects
                      </h3>
                      <div className="space-y-4">
                        {resumeData.projects.map((proj, idx) => (
                          <div key={idx} className={`p-4 rounded-lg ${theme.card} border ${theme.border} hover:shadow-md transition-shadow`}>
                            {editMode ? (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  value={localData.projects[idx]?.name || ""}
                                  onChange={(e) => {
                                    const updated = [...localData.projects];
                                    if (updated[idx]) {
                                      updated[idx].name = e.target.value;
                                      handleFieldChange("projects", updated);
                                    }
                                  }}
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                                  placeholder="Project Name"
                                />
                                <textarea
                                  value={localData.projects[idx]?.description || ""}
                                  onChange={(e) => {
                                    const updated = [...localData.projects];
                                    if (updated[idx]) {
                                      updated[idx].description = e.target.value;
                                      handleFieldChange("projects", updated);
                                    }
                                  }}
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                                  rows={2}
                                  placeholder="Project Description"
                                />
                                <input
                                  type="text"
                                  value={localData.projects[idx]?.link || ""}
                                  onChange={(e) => {
                                    const updated = [...localData.projects];
                                    if (updated[idx]) {
                                      updated[idx].link = e.target.value;
                                      handleFieldChange("projects", updated);
                                    }
                                  }}
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                                  placeholder="Project Link (optional)"
                                />
                              </div>
                            ) : (
                              <>
                                <h4 className="font-bold text-gray-900">{proj.name}</h4>
                                <p className="text-gray-700 text-sm mt-2">{proj.description}</p>
                                {proj.link && (
                                  <a
                                    href={proj.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-block mt-2 text-sm ${theme.text} hover:underline`}
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
                  className={`px-6 py-3 rounded-lg text-white font-medium transition-all ${theme.button} hover:shadow-lg`}
                >
                  💾 Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 rounded-lg bg-gray-500 text-white font-medium hover:bg-gray-600 transition-all"
                >
                  ❌ Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditMode(true)}
                  className={`px-6 py-3 rounded-lg text-white font-medium transition-all ${theme.button} hover:shadow-lg`}
                >
                  ✏️ Edit Resume
                </button>
                <button
                  onClick={handleDownload}
                  className="px-6 py-3 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-all"
                >
                  📄 Download PDF
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}