import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { useResume } from "../../context/ResumeContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const MyTemplate1 = () => {
  const resumeRef = useRef(null);
  const { resumeData, setResumeData } = useResume();
  const [editMode, setEditMode] = useState(false);
  const [localData, setLocalData] = useState(resumeData);
  // Removed theme and font customization options as requested

  useEffect(() => {
    setLocalData(resumeData);
  }, [resumeData]);

  // Fixed theme for consistent design
  const theme = {
    primary: "from-blue-600 to-blue-800",
    secondary: "from-gray-700 to-gray-900",
    accent: "bg-blue-50",
    text: "text-blue-900",
    border: "border-blue-200",
    button: "bg-blue-600 hover:bg-blue-700",
    card: "bg-white",
    header: "bg-blue-600",
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
const addLanguage = () => {
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
  setResumeData({
    ...localData,
    skills: (localData.skills || []).filter(s => s && s.trim()),
    languages: (localData.languages || []).filter(l => l && l.trim()),
    interests: (localData.interests || []).filter(i => i && i.trim()),
  });
  setEditMode(false);
};


  const handleCancel = () => {
    setLocalData(resumeData);
    setEditMode(false);
  };

  // Download functionality moved to Sidebar component

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar resumeRef={resumeRef} />
        <div className="flex-1 p-8">
          {/* Customization panel removed as requested */}

          {/* Resume Container */}
          <div className="flex justify-center">
            <div
              ref={resumeRef}
              className="w-[595pt] bg-white shadow-lg border-2 border-gray-300 font-sans"
              style={{ width: "595pt", minHeight: "842pt" }}
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
                    {editMode ? (
                      <input
                        type="text"
                        value={localData.location}
                        onChange={(e) => handleFieldChange("location", e.target.value)}
                        className="bg-transparent text-gray-700 placeholder-gray-500 border-b border-gray-300 focus:border-blue-500"
                        placeholder="Location"
                      />
                    ) : (
                      <span>{resumeData.location}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">📞</span>
                    {editMode ? (
                      <input
                        type="text"
                        value={localData.phone}
                        onChange={(e) => handleFieldChange("phone", e.target.value)}
                        className="bg-transparent text-gray-700 placeholder-gray-500 border-b border-gray-300 focus:border-blue-500"
                        placeholder="Phone"
                      />
                    ) : (
                      <span>{resumeData.phone}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">✉️</span>
                    {editMode ? (
                      <input
                        type="text"
                        value={localData.email}
                        onChange={(e) => handleFieldChange("email", e.target.value)}
                        className="bg-transparent text-gray-700 placeholder-gray-500 border-b border-gray-300 focus:border-blue-500"
                        placeholder="Email"
                      />
                    ) : (
                      <span>{resumeData.email}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">🔗</span>
                    {editMode ? (
                      <input
                        type="text"
                        value={localData.linkedin}
                        onChange={(e) => handleFieldChange("linkedin", e.target.value)}
                        className="bg-transparent text-gray-700 placeholder-gray-500 border-b border-gray-300 focus:border-blue-500"
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
                <div className="w-1/3 p-6 bg-gray-50 border-r border-gray-200 overflow-y-auto">
                  {/* Skills Section */}
                  {(localData.skills?.length > 0 || editMode) && (
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-lg font-bold ${theme.text} border-b ${theme.border} pb-2`}>
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
                        {localData.skills?.map((skill, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            {editMode ? (
                              <>
                                <input
                                  type="text"
                                  value={skill || ""}
                                  onChange={(e) => handleArrayFieldChange("skills", idx, e.target.value)}
                                  className={`flex-1 px-3 py-2 rounded ${theme.accent} ${theme.text} font-medium text-sm border border-transparent focus:border-blue-300`}
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
                              <div className={`px-3 py-2 rounded ${theme.accent} ${theme.text} font-medium text-sm break-words`}>
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
                      <h3 className={`text-lg font-bold mb-4 ${theme.text} border-b ${theme.border} pb-2`}>
                        Education
                      </h3>
                      <div className="space-y-4">
                        {resumeData.education.map((edu, idx) => (
                          <div key={idx} className={`p-4 rounded ${theme.card} border ${theme.border} shadow-sm`}>
                            <h4 className="font-bold text-gray-900 break-words">{edu.degree}</h4>
                            <p className="text-sm text-gray-600 break-words">{edu.institution}</p>
                            <p className="text-xs text-gray-500">{edu.duration}</p>
                            {edu.location && (
                              <p className="text-xs text-gray-500 break-words">{edu.location}</p>
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
      <h3 className={`text-lg font-bold mb-4 ${theme.text} border-b ${theme.border} pb-2`}>
        Languages
      </h3>
      {editMode && (
        <button
          onClick={addLanguage}
          className="text-sm bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
        >
          +
        </button>
      )}
    </div>
    <div className="space-y-2">
      {(editMode ? localData.languages : (localData.languages || []).filter(l => !!l.trim())).map((lang, idx) => (
        <div
          key={idx}
          className={`flex items-center gap-2 px-3 py-2 rounded ${theme.accent} ${theme.text} text-sm break-words`}
        >
          {editMode ? (
            <>
              <input
                type="text"
                value={lang || ""}
                onChange={(e) => handleArrayFieldChange("languages", idx, e.target.value)}
                className={`flex-1 px-3 py-2 rounded ${theme.accent} ${theme.text} font-medium text-sm border border-transparent focus:border-blue-300`}
                placeholder="Language"
              />
              <button
                onClick={() => removeLanguage(idx)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                ×
              </button>
            </>
          ) : (
            <>
              <span className="font-medium">{lang}</span>
            </>
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
      <h3 className={`text-lg font-bold mb-4 ${theme.text} border-b ${theme.border} pb-2`}>
        Interests
      </h3>
      {editMode && (
        <button
          onClick={addInterest}
          className="text-sm bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
        >
          +
        </button>
      )}
    </div>
    <div className="space-y-2">
      {(editMode ? localData.interests : (localData.interests || []).filter(i => !!i.trim())).map((interest, idx) => (
        <div
          key={idx}
          className={`flex items-center gap-2 px-3 py-2 rounded ${theme.accent} ${theme.text} text-sm break-words`}
        >
          {editMode ? (
            <>
              <input
                type="text"
                value={interest || ""}
                onChange={(e) => handleArrayFieldChange("interests", idx, e.target.value)}
                className={`flex-1 px-3 py-2 rounded ${theme.accent} ${theme.text} font-medium text-sm border border-transparent focus:border-blue-300`}
                placeholder="Interest"
              />
              <button
                onClick={() => removeInterest(idx)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                ×
              </button>
            </>
          ) : (
            <>
              {interest}
            </>
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
                      <h3 className={`text-lg font-bold mb-4 ${theme.text} border-b ${theme.border} pb-2`}>
                        Summary
                      </h3>
                      {editMode ? (
                        <textarea
                          value={localData.summary}
                          onChange={(e) => handleFieldChange("summary", e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={4}
                          placeholder="Enter your professional summary..."
                        />
                      ) : (
                        <p className="text-gray-700 leading-relaxed break-words">{resumeData.summary}</p>
                      )}
                    </div>
                  )}

                  {/* Experience Section */}
                  {(localData.experience?.length > 0 || editMode) && (
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className={`text-lg font-bold ${theme.text} border-b ${theme.border} pb-2`}>
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
                        {localData.experience?.map((exp, idx) => (
                          <div key={idx} className="relative">
                            <div className={`absolute left-0 top-0 w-2 h-2 rounded-full ${theme.button}`}></div>
                            <div className={`absolute left-0.5 top-2 h-full w-0.5 ${theme.accent}`}></div>
                            <div className="pl-6">
                              {editMode ? (
                                <div className="space-y-3 max-h-96 overflow-y-auto">
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
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 resize-none"
                                    rows={3}
                                    placeholder="Enter accomplishments (one per line)"
                                  />
                                </div>
                              ) : (
                                <>
                                  <h4 className="font-bold text-gray-900 text-lg break-words">{exp.title}</h4>
                                  <p className="text-gray-600 font-medium break-words">{exp.companyName}</p>
                                  <p className="text-sm text-gray-500 break-words">{exp.date} • {exp.companyLocation}</p>
                                  <ul className="mt-3 space-y-1">
                                    {exp.accomplishment?.map((item, i) => (
                                      <li key={i} className="text-gray-700 text-sm flex items-start gap-2">
                                        <span className="text-blue-600 mt-1 flex-shrink-0">•</span>
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
                      <h3 className={`text-lg font-bold mb-6 ${theme.text} border-b ${theme.border} pb-2`}>
                        Projects
                      </h3>
                      <div className="space-y-4">
                        {localData.projects.map((proj, idx) => (
                          <div key={idx} className={`p-4 rounded ${theme.card} border ${theme.border} shadow-sm`}>
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
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
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
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 resize-none"
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
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                  placeholder="Project Link (optional)"
                                />
                              </div>
                            ) : (
                              <>
                                <h4 className="font-bold text-gray-900 break-words">{proj.name}</h4>
                                <p className="text-gray-700 text-sm mt-2 break-words">{proj.description}</p>
                                {proj.link && (
                                  <a
                                    href={proj.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-block mt-2 text-sm ${theme.text} hover:underline break-all`}
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
              <button
                onClick={() => setEditMode(true)}
                className={`px-6 py-3 rounded-lg text-white font-medium transition-all ${theme.button}`}
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
