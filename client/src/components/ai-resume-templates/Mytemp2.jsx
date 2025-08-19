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

  const theme = {
    header: "bg-blue-600",
    text: "text-blue-900",
    button: "bg-blue-600 hover:bg-blue-700",
    accent: "bg-blue-50",
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

  const addSkill = () => {
    setLocalData((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), ""],
    }));
  };

  const removeSkill = (index) => {
    setLocalData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
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
          accomplishment: [],
        },
      ],
    }));
  };

  const removeExperience = (index) => {
    setLocalData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const addEducation = () => {
    setLocalData((prev) => ({
      ...prev,
      education: [
        ...(prev.education || []),
        {
          degree: "",
          institution: "",
          duration: "",
          location: "",
        },
      ],
    }));
  };

  const removeEducation = (index) => {
    setLocalData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar resumeRef={resumeRef} />
        <div className="flex-1 p-8">
          <div className="flex justify-center">
            <div
              ref={resumeRef}
              className="w-[900px] bg-white shadow-lg border-2 border-gray-300 font-sans"
              style={{ width: "900px", minHeight: "600px" }}
            >
              {/* Header */}
              <div className={`${theme.header} p-6 text-white`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex flex-col space-y-2 w-full md:w-auto">
                    {editMode ? (
                      <>
                        <input
                          type="text"
                          value={localData.name}
                          onChange={(e) => handleFieldChange("name", e.target.value)}
                          className="text-3xl font-bold bg-transparent placeholder-white w-full mb-1 border-b border-white"
                          placeholder="Your Name"
                        />
                        <input
                          type="text"
                          value={localData.role}
                          onChange={(e) => handleFieldChange("role", e.target.value)}
                          className="text-lg bg-transparent placeholder-white w-full border-b border-white"
                          placeholder="Your Title"
                        />
                      </>
                    ) : (
                      <>
                        <h1 className="text-3xl font-bold mb-1">{resumeData.name}</h1>
                        <p className="text-lg">{resumeData.role}</p>
                      </>
                    )}
                  </div>

                  <div className="flex flex-col md:items-end space-y-1 mt-4 md:mt-0 text-right text-sm">
                    {["location", "phone", "email", "linkedin"].map((field) =>
                      editMode ? (
                        <input
                          key={field}
                          type="text"
                          value={localData[field] || ""}
                          onChange={(e) => handleFieldChange(field, e.target.value)}
                          className="bg-transparent border-b border-white placeholder-white mb-1"
                          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        />
                      ) : field === "linkedin" ? (
                        <a
                          key={field}
                          href={resumeData.linkedin}
                          className="underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {resumeData.linkedin}
                        </a>
                      ) : (
                        <span key={field}>{resumeData[field]}</span>
                      )
                    )}
                  </div>
                </div>
              </div>
              {/* Main Content */}
              <div className="p-8 space-y-8">
                {/* Skills Section */}
                <section>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg">Skills</h3>
                    {editMode && (
                      <button
                        onClick={addSkill}
                        className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        + Add Skill
                      </button>
                    )}
                  </div>
                  {editMode ? (
                    <>
                      {localData.skills?.map((skill, idx) => (
                        <div key={idx} className="flex gap-2 mb-2 items-center">
                          <input
                            type="text"
                            value={skill}
                            onChange={(e) =>
                              handleArrayFieldChange("skills", idx, e.target.value)
                            }
                            className="flex-grow p-2 border rounded"
                            placeholder="Skill"
                          />
                          <button
                            onClick={() => removeSkill(idx)}
                            className="text-red-600 font-bold px-2"
                            aria-label="Remove skill"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </>
                  ) : (
                    <ul className="list-disc list-inside">
                      {resumeData.skills?.map((skill, idx) => (
                        <li key={idx}>{skill}</li>
                      ))}
                    </ul>
                  )}
                </section>
                {/* Summary Section */}
                <section>
                  <h3 className="font-bold text-lg mb-2">Summary</h3>
                  {editMode ? (
                    <textarea
                      value={localData.summary || ""}
                      onChange={(e) => handleFieldChange("summary", e.target.value)}
                      rows={4}
                      className="w-full p-2 border rounded resize-none"
                      placeholder="Enter your professional summary..."
                    />
                  ) : (
                    <p>{resumeData.summary}</p>
                  )}
                </section>
                {/* Experience Section */}
                <section>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg">Experience</h3>
                    {editMode && (
                      <button
                        onClick={addExperience}
                        className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        + Add Experience
                      </button>
                    )}
                  </div>
                  {editMode ? (
                    <>
                      {localData.experience?.map((exp, idx) => (
                        <div key={idx} className="mb-4 p-4 border rounded space-y-2">
                          <input
                            type="text"
                            value={exp.title || ""}
                            onChange={(e) => {
                              const updated = [...localData.experience];
                              updated[idx].title = e.target.value;
                              handleFieldChange("experience", updated);
                            }}
                            className="w-full p-2 border rounded"
                            placeholder="Job Title"
                          />
                          <input
                            type="text"
                            value={exp.companyName || ""}
                            onChange={(e) => {
                              const updated = [...localData.experience];
                              updated[idx].companyName = e.target.value;
                              handleFieldChange("experience", updated);
                            }}
                            className="w-full p-2 border rounded"
                            placeholder="Company Name"
                          />
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={exp.date || ""}
                              onChange={(e) => {
                                const updated = [...localData.experience];
                                updated[idx].date = e.target.value;
                                handleFieldChange("experience", updated);
                              }}
                              className="flex-1 p-2 border rounded"
                              placeholder="Date"
                            />
                            <input
                              type="text"
                              value={exp.companyLocation || ""}
                              onChange={(e) => {
                                const updated = [...localData.experience];
                                updated[idx].companyLocation = e.target.value;
                                handleFieldChange("experience", updated);
                              }}
                              className="flex-1 p-2 border rounded"
                              placeholder="Location"
                            />
                          </div>
                          <textarea
                            rows={3}
                            value={(exp.accomplishment || []).join("\n")}
                            onChange={(e) => {
                              const updated = [...localData.experience];
                              updated[idx].accomplishment = e.target.value
                                .split("\n")
                                .filter(Boolean);
                              handleFieldChange("experience", updated);
                            }}
                            className="w-full p-2 border rounded resize-none"
                            placeholder="Accomplishments (one per line)"
                          />
                          <button
                            onClick={() => removeExperience(idx)}
                            className="text-red-600 hover:text-red-800 font-bold"
                          >
                            Remove Experience
                          </button>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      {resumeData.experience?.map((exp, idx) => (
                        <div key={idx} className="mb-4">
                          <div className="font-bold">
                            {exp.title} at {exp.companyName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {exp.date} | {exp.companyLocation}
                          </div>
                          <ul className="list-disc list-inside">
                            {exp.accomplishment?.map((a, i) => (
                              <li key={i}>{a}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </>
                  )}
                </section>
                {/* Education Section */}
                <section>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg">Education</h3>
                    {editMode && (
                      <button
                        onClick={addEducation}
                        className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        + Add Education
                      </button>
                    )}
                  </div>
                  {editMode ? (
                    <>
                      {localData.education?.map((edu, idx) => (
                        <div key={idx} className="mb-4 p-4 border rounded space-y-2">
                          <input
                            type="text"
                            value={edu.degree || ""}
                            onChange={(e) => {
                              const updated = [...localData.education];
                              updated[idx].degree = e.target.value;
                              handleFieldChange("education", updated);
                            }}
                            className="w-full p-2 border rounded"
                            placeholder="Degree"
                          />
                          <input
                            type="text"
                            value={edu.institution || ""}
                            onChange={(e) => {
                              const updated = [...localData.education];
                              updated[idx].institution = e.target.value;
                              handleFieldChange("education", updated);
                            }}
                            className="w-full p-2 border rounded"
                            placeholder="Institution"
                          />
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={edu.duration || ""}
                              onChange={(e) => {
                                const updated = [...localData.education];
                                updated[idx].duration = e.target.value;
                                handleFieldChange("education", updated);
                              }}
                              className="flex-1 p-2 border rounded"
                              placeholder="Duration"
                            />
                            <input
                              type="text"
                              value={edu.location || ""}
                              onChange={(e) => {
                                const updated = [...localData.education];
                                updated[idx].location = e.target.value;
                                handleFieldChange("education", updated);
                              }}
                              className="flex-1 p-2 border rounded"
                              placeholder="Location"
                            />
                          </div>
                          <button
                            onClick={() => removeEducation(idx)}
                            className="text-red-600 hover:text-red-800 font-bold"
                          >
                            Remove Education
                          </button>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      {resumeData.education?.map((edu, idx) => (
                        <div key={idx} className="mb-4">
                          <div className="font-bold">{edu.degree}</div>
                          <div>{edu.institution} ({edu.duration})</div>
                          <div className="text-sm text-gray-600">{edu.location}</div>
                        </div>
                      ))}
                    </>
                  )}
                </section>
              </div>

              {/* Action Buttons */}
              <div className="w-full flex justify-center my-8">
                {editMode ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="px-6 py-3 rounded-lg text-white font-medium transition-all bg-blue-600 hover:bg-blue-700 mx-2"
                    >
                      💾 Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-6 py-3 rounded-lg bg-gray-500 text-white font-medium hover:bg-gray-600 mx-2"
                    >
                      ❌ Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-6 py-3 rounded-lg text-white font-medium transition-all bg-blue-600 hover:bg-blue-700"
                  >
                    ✏️ Edit Resume
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTemplate1;
