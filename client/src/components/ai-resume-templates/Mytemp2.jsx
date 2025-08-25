import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { useResume } from "../../context/ResumeContext";

const MyTemplate2 = () => {
  const resumeRef = useRef(null);
  const { resumeData, setResumeData } = useResume();
  const [editMode, setEditMode] = useState(false);
  const [localData, setLocalData] = useState(resumeData);

  useEffect(() => {
    setLocalData(resumeData);
  }, [resumeData]);

  // Use hex colors instead of Tailwind classes for PDF compatibility
  const theme = {
    header: "#2563eb", // blue-600
    headerHover: "#1d4ed8", // blue-700
    text: "#1e3a8a", // blue-900
    accent: "#eff6ff", // blue-50
    success: "#059669", // green-600
    successHover: "#047857", // green-700
    danger: "#dc2626", // red-600
    dangerHover: "#b91c1c", // red-700
    gray: "#6b7280", // gray-500
    grayHover: "#4b5563", // gray-600
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
    const currentSkills = localData.skills || [];
    const hasEmptySkill = currentSkills.some(skill => !skill?.trim());
    
    if (hasEmptySkill) {
      alert("Please fill in all existing skills before adding a new one.");
      return;
    }
    
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
    const currentEducation = localData.education || [];
    const hasEmptyEducation = currentEducation.some(edu => 
      !edu.degree?.trim() || !edu.institution?.trim()
    );
    
    if (hasEmptyEducation) {
      alert("Please fill in the degree and institution for existing education entries before adding a new one.");
      return;
    }
    
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
    const errors = [];
    
    if (!localData.name?.trim()) errors.push("Name is required");
    if (!localData.role?.trim()) errors.push("Role/Title is required");
    
    const experiences = localData.experience || [];
    experiences.forEach((exp, index) => {
      if ((exp.title?.trim() || exp.companyName?.trim()) && (!exp.title?.trim() || !exp.companyName?.trim())) {
        errors.push(`Experience ${index + 1}: Both job title and company name are required`);
      }
    });
    
    const education = localData.education || [];
    education.forEach((edu, index) => {
      if ((edu.degree?.trim() || edu.institution?.trim()) && (!edu.degree?.trim() || !edu.institution?.trim())) {
        errors.push(`Education ${index + 1}: Both degree and institution are required`);
      }
    });
    
    const skills = localData.skills || [];
    const emptySkillsCount = skills.filter(s => !s?.trim()).length;
    if (emptySkillsCount > 0) {
      errors.push(`Please fill in all ${emptySkillsCount} empty skill(s) or remove them`);
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
      education: (localData.education || []).filter(edu => edu.degree?.trim() && edu.institution?.trim()),
    });
    setEditMode(false);
  };

  const handleCancel = () => {
    setLocalData(resumeData);
    setEditMode(false);
  };

  // Inline styles for PDF compatibility
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb'
    },
    resumeContainer: {
      width: '900px',
      backgroundColor: 'white',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      border: '2px solid #d1d5db',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      minHeight: '600px'
    },
    header: {
      backgroundColor: theme.header,
      padding: '1.5rem',
      color: 'white'
    },
    headerInput: {
      backgroundColor: 'transparent',
      color: 'white',
      border: 'none',
      borderBottom: '1px solid white',
      outline: 'none',
      width: '100%'
    },
    headerInputError: {
      backgroundColor: 'transparent',
      color: 'white',
      border: 'none',
      borderBottom: '1px solid #fca5a5',
      outline: 'none',
      width: '100%'
    },
    mainContent: {
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    },
    sectionTitle: {
      fontWeight: 'bold',
      fontSize: '1.125rem',
      marginBottom: '0.5rem'
    },
    addButton: {
      padding: '0.25rem 1rem',
      backgroundColor: theme.success,
      color: 'white',
      border: 'none',
      borderRadius: '0.25rem',
      cursor: 'pointer',
      fontSize: '0.875rem'
    },
    input: {
      padding: '0.5rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.25rem',
      width: '100%'
    },
    inputError: {
      padding: '0.5rem',
      border: '1px solid #fca5a5',
      borderRadius: '0.25rem',
      backgroundColor: '#fef2f2',
      width: '100%'
    },
    textarea: {
      padding: '0.5rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.25rem',
      width: '100%',
      resize: 'none'
    },
    removeButton: {
      color: theme.danger,
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 'bold'
    },
    saveButton: {
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      color: 'white',
      backgroundColor: theme.header,
      border: 'none',
      cursor: 'pointer',
      fontWeight: '500',
      margin: '0 0.5rem'
    },
    cancelButton: {
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      color: 'white',
      backgroundColor: theme.gray,
      border: 'none',
      cursor: 'pointer',
      fontWeight: '500',
      margin: '0 0.5rem'
    },
    editButton: {
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      color: 'white',
      backgroundColor: theme.header,
      border: 'none',
      cursor: 'pointer',
      fontWeight: '500'
    }
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar resumeRef={resumeRef} />
        <div style={{ flex: 1, padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div ref={resumeRef} style={styles.resumeContainer}>
              {/* Header */}
              <div style={styles.header}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                    {editMode ? (
                      <>
                        <input
                          type="text"
                          value={localData.name}
                          onChange={(e) => handleFieldChange("name", e.target.value)}
                          style={{
                            ...(!localData.name?.trim() ? styles.headerInputError : styles.headerInput),
                            fontSize: '1.875rem',
                            fontWeight: 'bold',
                            marginBottom: '0.25rem'
                          }}
                          placeholder="Your Name *"
                        />
                        <input
                          type="text"
                          value={localData.role}
                          onChange={(e) => handleFieldChange("role", e.target.value)}
                          style={{
                            ...(!localData.role?.trim() ? styles.headerInputError : styles.headerInput),
                            fontSize: '1.125rem'
                          }}
                          placeholder="Your Title *"
                        />
                      </>
                    ) : (
                      <>
                        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: '0 0 0.25rem 0' }}>
                          {resumeData.name}
                        </h1>
                        <p style={{ fontSize: '1.125rem', margin: 0 }}>{resumeData.role}</p>
                      </>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem', fontSize: '0.875rem' }}>
                    {["location", "phone", "email", "linkedin"].map((field) =>
                      editMode ? (
                        <input
                          key={field}
                          type="text"
                          value={localData[field] || ""}
                          onChange={(e) => handleFieldChange(field, e.target.value)}
                          style={{
                            ...styles.headerInput,
                            textAlign: 'right',
                            marginBottom: '0.25rem'
                          }}
                          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        />
                      ) : field === "linkedin" ? (
                        <a
                          key={field}
                          href={resumeData.linkedin}
                          style={{ color: 'white', textDecoration: 'underline' }}
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
              <div style={styles.mainContent}>
                {/* Skills Section */}
                <section>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={styles.sectionTitle}>Skills</h3>
                    {editMode && (
                      <button onClick={addSkill} style={styles.addButton}>
                        + Add Skill
                      </button>
                    )}
                  </div>
                  {editMode ? (
                    <>
                      {localData.skills?.map((skill, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                          <input
                            type="text"
                            value={skill}
                            onChange={(e) => handleArrayFieldChange("skills", idx, e.target.value)}
                            style={!skill?.trim() ? styles.inputError : styles.input}
                            placeholder="Skill *"
                          />
                          <button
                            onClick={() => removeSkill(idx)}
                            style={styles.removeButton}
                            aria-label="Remove skill"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </>
                  ) : (
                    <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem' }}>
                      {resumeData.skills?.map((skill, idx) => (
                        <li key={idx}>{skill}</li>
                      ))}
                    </ul>
                  )}
                </section>

                {/* Summary Section */}
                <section>
                  <h3 style={styles.sectionTitle}>Summary</h3>
                  {editMode ? (
                    <textarea
                      value={localData.summary || ""}
                      onChange={(e) => handleFieldChange("summary", e.target.value)}
                      rows={4}
                      style={styles.textarea}
                      placeholder="Enter your professional summary..."
                    />
                  ) : (
                    <p>{resumeData.summary}</p>
                  )}
                </section>

                {/* Experience Section */}
                <section>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={styles.sectionTitle}>Experience</h3>
                    {editMode && (
                      <button onClick={addExperience} style={styles.addButton}>
                        + Add Experience
                      </button>
                    )}
                  </div>
                  {editMode ? (
                    <>
                      {localData.experience?.map((exp, idx) => (
                        <div key={idx} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <input
                              type="text"
                              value={exp.title || ""}
                              onChange={(e) => {
                                const updated = [...localData.experience];
                                updated[idx].title = e.target.value;
                                handleFieldChange("experience", updated);
                              }}
                              style={!exp.title?.trim() ? styles.inputError : styles.input}
                              placeholder="Job Title *"
                            />
                            <input
                              type="text"
                              value={exp.companyName || ""}
                              onChange={(e) => {
                                const updated = [...localData.experience];
                                updated[idx].companyName = e.target.value;
                                handleFieldChange("experience", updated);
                              }}
                              style={!exp.companyName?.trim() ? styles.inputError : styles.input}
                              placeholder="Company Name *"
                            />
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <input
                                type="text"
                                value={exp.date || ""}
                                onChange={(e) => {
                                  const updated = [...localData.experience];
                                  updated[idx].date = e.target.value;
                                  handleFieldChange("experience", updated);
                                }}
                                style={{ ...styles.input, flex: 1 }}
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
                                style={{ ...styles.input, flex: 1 }}
                                placeholder="Location"
                              />
                            </div>
                            <textarea
                              rows={3}
                              value={(exp.accomplishment || []).join("\n")}
                              onChange={(e) => {
                                const updated = [...localData.experience];
                                updated[idx].accomplishment = e.target.value.split("\n").filter(Boolean);
                                handleFieldChange("experience", updated);
                              }}
                              style={styles.textarea}
                              placeholder="Accomplishments (one per line)"
                            />
                            <button onClick={() => removeExperience(idx)} style={styles.removeButton}>
                              Remove Experience
                            </button>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      {resumeData.experience?.map((exp, idx) => (
                        <div key={idx} style={{ marginBottom: '1rem' }}>
                          <div style={{ fontWeight: 'bold' }}>
                            {exp.title} at {exp.companyName}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                            {exp.date} | {exp.companyLocation}
                          </div>
                          <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem' }}>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={styles.sectionTitle}>Education</h3>
                    {editMode && (
                      <button onClick={addEducation} style={styles.addButton}>
                        + Add Education
                      </button>
                    )}
                  </div>
                  {editMode ? (
                    <>
                      {localData.education?.map((edu, idx) => (
                        <div key={idx} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <input
                              type="text"
                              value={edu.degree || ""}
                              onChange={(e) => {
                                const updated = [...localData.education];
                                updated[idx].degree = e.target.value;
                                handleFieldChange("education", updated);
                              }}
                              style={!edu.degree?.trim() ? styles.inputError : styles.input}
                              placeholder="Degree *"
                            />
                            <input
                              type="text"
                              value={edu.institution || ""}
                              onChange={(e) => {
                                const updated = [...localData.education];
                                updated[idx].institution = e.target.value;
                                handleFieldChange("education", updated);
                              }}
                              style={!edu.institution?.trim() ? styles.inputError : styles.input}
                              placeholder="Institution *"
                            />
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <input
                                type="text"
                                value={edu.duration || ""}
                                onChange={(e) => {
                                  const updated = [...localData.education];
                                  updated[idx].duration = e.target.value;
                                  handleFieldChange("education", updated);
                                }}
                                style={{ ...styles.input, flex: 1 }}
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
                                style={{ ...styles.input, flex: 1 }}
                                placeholder="Location"
                              />
                            </div>
                            <button onClick={() => removeEducation(idx)} style={styles.removeButton}>
                              Remove Education
                            </button>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      {resumeData.education?.map((edu, idx) => (
                        <div key={idx} style={{ marginBottom: '1rem' }}>
                          <div style={{ fontWeight: 'bold' }}>{edu.degree}</div>
                          <div>{edu.institution} ({edu.duration})</div>
                          <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>{edu.location}</div>
                        </div>
                      ))}
                    </>
                  )}
                </section>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
            {editMode ? (
              <>
                <button onClick={handleSave} style={styles.saveButton}>
                  💾 Save Changes
                </button>
                <button onClick={handleCancel} style={styles.cancelButton}>
                  ❌ Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setEditMode(true)} style={styles.editButton}>
                ✏️ Edit Resume
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTemplate2;