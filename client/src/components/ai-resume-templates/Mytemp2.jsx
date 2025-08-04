import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { useResume } from "../../context/ResumeContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const MyTemplate2 = () => {
  const resumeRef = useRef(null);
  const { resumeData, setResumeData } = useResume();
  const [editMode, setEditMode] = useState(false);
  const [localData, setLocalData] = useState(resumeData);
  const [currentTheme, setCurrentTheme] = useState("professional-blue");

  useEffect(() => {
    setLocalData(resumeData);
  }, [resumeData]);

  const themes = {
    "professional-blue": {
      primary: "from-blue-600 to-blue-800",
      secondary: "from-gray-700 to-gray-900",
      accent: "bg-blue-50",
      text: "text-blue-900",
      border: "border-blue-200",
      button: "bg-blue-600 hover:bg-blue-700",
      card: "bg-white",
      header: "bg-blue-600",
    },
    "professional-gray": {
      primary: "from-gray-600 to-gray-800",
      secondary: "from-gray-700 to-gray-900",
      accent: "bg-gray-50",
      text: "text-gray-900",
      border: "border-gray-200",
      button: "bg-gray-600 hover:bg-gray-700",
      card: "bg-white",
      header: "bg-gray-600",
    },
    "professional-green": {
      primary: "from-green-600 to-green-800",
      secondary: "from-gray-700 to-gray-900",
      accent: "bg-green-50",
      text: "text-green-900",
      border: "border-green-200",
      button: "bg-green-600 hover:bg-green-700",
      card: "bg-white",
      header: "bg-green-600",
    },
    "professional-navy": {
      primary: "from-slate-700 to-slate-900",
      secondary: "from-gray-700 to-gray-900",
      accent: "bg-slate-50",
      text: "text-slate-900",
      border: "border-slate-200",
      button: "bg-slate-700 hover:bg-slate-800",
      card: "bg-white",
      header: "bg-slate-700",
    },
  };

  const theme = themes[currentTheme];

  const handleFieldChange = (field, value) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
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
      const element = resumeRef.current;
      if (!element) throw new Error('Resume element not found');
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 595,
        height: 842,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [595, 842],
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, 595, 842);
      pdf.save('resume.pdf');
    } catch (error) {
      alert(`Failed to generate PDF: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          {/* Theme Selector */}
          <div className="mb-6 flex justify-center gap-4">
            {Object.keys(themes).map((themeKey) => (
              <button
                key={themeKey}
                onClick={() => setCurrentTheme(themeKey)}
                className={`px-4 py-2 rounded-lg text-white font-medium transition-all ${
                  currentTheme === themeKey
                    ? 'ring-2 ring-offset-2 ring-blue-500'
                    : 'opacity-70 hover:opacity-100'
                } ${themes[themeKey].button}`}
              >
                {themeKey.replace('professional-', '').charAt(0).toUpperCase() + 
                 themeKey.replace('professional-', '').slice(1)}
              </button>
            ))}
          </div>

          {/* Resume Container */}
          <div className="flex justify-center">
            <div
              ref={resumeRef}
              className="w-[595pt] h-[842pt] bg-white shadow-lg border-2 border-gray-300"
              style={{ width: "595pt", height: "842pt" }}
            >
              {/* Professional Header */}
              <div className={`${theme.header} p-6 text-white`}>
                <div className="text-center">
                  {editMode ? (
                    <>
                      <input
                        type="text"
                        value={localData.name}
                        onChange={(e) => handleFieldChange("name", e.target.value)}
                        className="text-3xl font-bold bg-transparent text-white placeholder-white placeholder-opacity-80 w-full mb-2 text-center border-b border-white border-opacity-30 focus:border-opacity-100"
                        placeholder="Your Name"
                      />
                      <input
                        type="text"
                        value={localData.role}
                        onChange={(e) => handleFieldChange("role", e.target.value)}
                        className="text-lg bg-transparent text-white placeholder-white placeholder-opacity-80 w-full text-center border-b border-white border-opacity-30 focus:border-opacity-100"
                        placeholder="Your Title"
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
              <div className="bg-gray-100 p-4 border-b border-gray-200">
                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">📍</span>
                    <span>{resumeData.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">📞</span>
                    <span>{resumeData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">✉️</span>
                    <span>{resumeData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">🔗</span>
                    <span>{resumeData.linkedin}</span>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex h-[calc(842pt-200pt)]">
                {/* Left Sidebar */}
                <div className="w-1/3 p-6 bg-gray-50 border-r border-gray-200">
                  {/* Skills Section */}
                  <div className="mb-8">
                    <h3 className={`text-lg font-bold mb-4 ${theme.text} border-b ${theme.border} pb-2`}>
                      Skills
                    </h3>
                    <div className="space-y-2">
                      {resumeData.skills?.map((skill, idx) => (
                        <div
                          key={idx}
                          className={`px-3 py-2 rounded ${theme.accent} ${theme.text} font-medium text-sm`}
                        >
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education Section */}
                  <div className="mb-8">
                    <h3 className={`text-lg font-bold mb-4 ${theme.text} border-b ${theme.border} pb-2`}>
                      Education
                    </h3>
                    <div className="space-y-4">
                      {resumeData.education.map((edu, idx) => (
                        <div key={idx} className={`p-4 rounded ${theme.card} border ${theme.border} shadow-sm`}>
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
                      <h3 className={`text-lg font-bold mb-4 ${theme.text} border-b ${theme.border} pb-2`}>
                        Languages
                      </h3>
                      <div className="space-y-2">
                        {resumeData.languages.map((lang, idx) => (
                          <div
                            key={idx}
                            className={`px-3 py-2 rounded ${theme.accent} ${theme.text} text-sm`}
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
                      <h3 className={`text-lg font-bold mb-4 ${theme.text} border-b ${theme.border} pb-2`}>
                        Interests
                      </h3>
                      <div className="space-y-2">
                        {resumeData.interests.map((interest, idx) => (
                          <div
                            key={idx}
                            className={`px-3 py-2 rounded ${theme.accent} ${theme.text} text-sm`}
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
                    <h3 className={`text-lg font-bold mb-4 ${theme.text} border-b ${theme.border} pb-2`}>
                      Summary
                    </h3>
                    {editMode ? (
                      <textarea
                        value={localData.summary}
                        onChange={(e) => handleFieldChange("summary", e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={4}
                        placeholder="Enter your professional summary..."
                      />
                    ) : (
                      <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
                    )}
                  </div>

                  {/* Experience Section */}
                  <div className="mb-8">
                    <h3 className={`text-lg font-bold mb-6 ${theme.text} border-b ${theme.border} pb-2`}>
                      Experience
                    </h3>
                    <div className="space-y-6">
                      {resumeData.experience.map((exp, idx) => (
                        <div key={idx} className="relative">
                          <div className={`absolute left-0 top-0 w-2 h-2 rounded-full ${theme.button}`}></div>
                          <div className={`absolute left-0.5 top-2 h-full w-0.5 ${theme.accent}`}></div>
                          <div className="pl-6">
                            {editMode ? (
                              <div className="space-y-3">
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
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
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
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
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
                                    className="w-1/2 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
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
                                    className="w-1/2 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
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
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
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
                                      <span className="text-blue-600 mt-1">•</span>
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
                      <h3 className={`text-lg font-bold mb-6 ${theme.text} border-b ${theme.border} pb-2`}>
                        Projects
                      </h3>
                      <div className="space-y-4">
                        {resumeData.projects.map((proj, idx) => (
                          <div key={idx} className={`p-4 rounded ${theme.card} border ${theme.border} shadow-sm`}>
                            {editMode ? (
                              <div className="space-y-3">
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
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
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
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
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
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
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
                  className={`px-6 py-3 rounded-lg text-white font-medium transition-all ${theme.button}`}
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
                  className={`px-6 py-3 rounded-lg text-white font-medium transition-all ${theme.button}`}
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
};

export default MyTemplate2;
