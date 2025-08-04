import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { useResume } from "../../context/ResumeContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Template2 = () => {
  const resumeRef = useRef(null);
  const { resumeData, setResumeData } = useResume();
  const [editMode, setEditMode] = useState(false);
  const [localData, setLocalData] = useState(resumeData);

  useEffect(() => {
    setLocalData(resumeData);
  }, [resumeData]);

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
        backgroundColor: '#fff',
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
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{
          flexGrow: 1,
          padding: "2.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
          <div
            ref={resumeRef}
            style={{
              backgroundColor: "#fff",
              color: "#1f2937",
              maxWidth: "72rem",
              width: "100%",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              padding: "2.5rem",
              border: "2px solid #e5e7eb",
              minHeight: "842px",
              maxHeight: "842px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Header */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #e5e7eb",
              paddingBottom: "1rem",
            }}>
              <div>
                {editMode ? (
                  <>
                    <input
                      type="text"
                      value={localData.name}
                      onChange={e => handleFieldChange("name", e.target.value)}
                      style={{ fontSize: "1.875rem", fontWeight: "bold", marginBottom: "0.25rem" }}
                    />
                    <input
                      type="text"
                      value={localData.role}
                      onChange={e => handleFieldChange("role", e.target.value)}
                      style={{ fontSize: "1rem", color: "#4b5563" }}
                    />
                  </>
                ) : (
                  <>
                    <h1 style={{ fontSize: "1.875rem", fontWeight: "bold" }}>{resumeData.name}</h1>
                    <h2 style={{ fontSize: "1rem", color: "#4b5563" }}>{resumeData.role}</h2>
                  </>
                )}
              </div>
              <div style={{ fontSize: "0.875rem", textAlign: "right", lineHeight: "1.5" }}>
                <p>📍 {resumeData.location}</p>
                <p>📞 {resumeData.phone}</p>
                <p>✉️ {resumeData.email}</p>
                <p>🔗 {resumeData.linkedin}</p>
              </div>
            </div>
            {/* Body */}
            <div style={{ marginTop: "1.5rem", display: "flex", gap: "1.5rem" }}>
              {/* Left column */}
              <div style={{ width: "33.33%" }}>
                <h3 style={{ fontWeight: "bold", fontSize: "1.125rem", borderBottom: "1px solid #e5e7eb" }}>Skills</h3>
                <ul style={{ marginTop: "0.5rem", paddingLeft: "1rem" }}>
                  {resumeData.skills?.map((skill, idx) => (
                    <li key={idx}>{skill}</li>
                  ))}
                </ul>
                <h3 style={{ fontWeight: "bold", fontSize: "1.125rem", borderBottom: "1px solid #e5e7eb", marginTop: "1.5rem" }}>Education</h3>
                {resumeData.education.map((edu, idx) => (
                  <div key={idx} style={{ marginTop: "0.5rem" }}>
                    <p style={{ fontWeight: "600" }}>{edu.degree}</p>
                    <p>{edu.institution} ({edu.duration})</p>
                    <p style={{ fontSize: "0.875rem", color: "#4b5563" }}>{edu.location}</p>
                  </div>
                ))}
              </div>
              {/* Right column */}
              <div style={{ width: "66.66%" }}>
                <h3 style={{ fontWeight: "bold", fontSize: "1.125rem", borderBottom: "1px solid #e5e7eb" }}>Summary</h3>
                <p style={{ marginTop: "0.5rem" }}>{resumeData.summary}</p>
                <h3 style={{ fontWeight: "bold", fontSize: "1.125rem", borderBottom: "1px solid #e5e7eb", marginTop: "1.5rem" }}>Experience</h3>
                {resumeData.experience.map((exp, idx) => (
                  <div key={idx} style={{ marginTop: "0.5rem" }}>
                    <p style={{ fontWeight: "600" }}>{exp.title} at {exp.companyName}</p>
                    <p style={{ fontSize: "0.875rem", color: "#4b5563" }}>{exp.date} | {exp.companyLocation}</p>
                    <ul style={{ paddingLeft: "1rem" }}>
                      {exp.accomplishment.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Buttons */}
          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            {editMode ? (
              <>
                <button onClick={handleSave} style={{ backgroundColor: "#16a34a", color: "#fff", padding: "0.5rem 1rem", borderRadius: "0.375rem", margin: "0 0.5rem" }}>Save</button>
                <button onClick={handleCancel} style={{ backgroundColor: "#9ca3af", color: "#fff", padding: "0.5rem 1rem", borderRadius: "0.375rem", margin: "0 0.5rem" }}>Cancel</button>
              </>
            ) : (
              <>
                <button onClick={() => setEditMode(true)} style={{ backgroundColor: "#2563eb", color: "#fff", padding: "0.5rem 1rem", borderRadius: "0.375rem", margin: "0 0.5rem" }}>Edit</button>
                <button onClick={handleDownload} style={{ backgroundColor: "#dc2626", color: "#fff", padding: "0.5rem 1rem", borderRadius: "0.375rem", margin: "0 0.5rem" }}>Download PDF</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template2;
