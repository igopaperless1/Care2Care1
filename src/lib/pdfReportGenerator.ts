import { jsPDF } from "jspdf";
import { Patient } from "../types";

export function generatePatientPDFReport(patient: Patient) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 15;

  // Header Banner
  doc.setFillColor(16, 185, 129); // Emerald green
  doc.rect(0, 0, pageWidth, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Care2Care Medical & Vitals Report", 14, 14);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);
  doc.text("Confidential Health Record", pageWidth - 14, 22, { align: "right" });

  y = 36;

  // Patient Info Box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, pageWidth - 28, 38, 3, 3, "FD");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(patient.name, 20, y + 10);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(`Age: ${patient.age} yrs  |  Category: ${patient.category}  |  Status: ${patient.status}`, 20, y + 17);
  doc.text(`Mood: ${patient.mood}  |  Sleep: ${patient.sleepHours} hrs  |  Hydration: ${patient.waterCurrentMl}/${patient.waterGoalMl} mL`, 20, y + 24);
  doc.text(`Emergency Contact: ${patient.emergencyContact?.name || 'N/A'} (${patient.emergencyContact?.phone || 'N/A'}) - ${patient.emergencyContact?.relation || 'Contact'}`, 20, y + 31);

  y += 46;

  // Section 1: Vital Signs Log Table
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("Recent Vital Signs History", 14, y);
  y += 6;

  // Table Headers
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, pageWidth - 28, 7, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(51, 65, 85);

  doc.text("Date & Time", 18, y + 5);
  doc.text("Blood Pressure", 60, y + 5);
  doc.text("Heart Rate", 105, y + 5);
  doc.text("SpO2", 135, y + 5);
  doc.text("Temp (°F)", 155, y + 5);
  doc.text("Glucose", 180, y + 5);

  y += 7;

  doc.setFont("helvetica", "normal");
  const vitals = patient.vitals || [];

  if (vitals.length === 0) {
    doc.text("No vital signs logged yet.", 18, y + 6);
    y += 10;
  } else {
    vitals.slice(0, 10).forEach((v, index) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      if (index % 2 === 1) {
        doc.setFillColor(248, 250, 252);
        doc.rect(14, y, pageWidth - 28, 6.5, "F");
      }
      const timeStr = v.dateStr || new Date(v.timestamp || Date.now()).toLocaleDateString();
      doc.text(timeStr, 18, y + 4.5);
      doc.text(`${v.bloodPressureSystolic}/${v.bloodPressureDiastolic} mmHg`, 60, y + 4.5);
      doc.text(`${v.heartRateBpm} bpm`, 105, y + 4.5);
      doc.text(`${v.spO2Percent}%`, 135, y + 4.5);
      doc.text(`${v.temperatureF}°F`, 155, y + 4.5);
      doc.text(`${v.bloodSugarMgDl} mg/dL`, 180, y + 4.5);
      y += 6.5;
    });
  }

  y += 8;

  // Section 2: Active Medications
  if (y > 240) {
    doc.addPage();
    y = 20;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("Active Medications & Schedule", 14, y);
  y += 6;

  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, pageWidth - 28, 7, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(51, 65, 85);

  doc.text("Medication Name", 18, y + 5);
  doc.text("Dosage", 75, y + 5);
  doc.text("Frequency / Time", 115, y + 5);
  doc.text("Today's Status", 170, y + 5);

  y += 7;

  doc.setFont("helvetica", "normal");
  const meds = patient.medications || [];

  if (meds.length === 0) {
    doc.text("No active medications listed.", 18, y + 6);
    y += 10;
  } else {
    meds.forEach((m, index) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      if (index % 2 === 1) {
        doc.setFillColor(248, 250, 252);
        doc.rect(14, y, pageWidth - 28, 6.5, "F");
      }
      doc.text(m.name, 18, y + 4.5);
      doc.text(m.dosage, 75, y + 4.5);
      doc.text(`${m.frequency} (${m.time})`, 115, y + 4.5);

      if (m.takenToday) {
        doc.setTextColor(16, 185, 129); // Green
        doc.text("Taken", 170, y + 4.5);
      } else {
        doc.setTextColor(225, 29, 72); // Red
        doc.text("Pending", 170, y + 4.5);
      }
      doc.setTextColor(71, 85, 105);
      y += 6.5;
    });
  }

  y += 8;

  // Section 3: Caregiver Notes & Summary
  if (y > 230) {
    doc.addPage();
    y = 20;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("Caregiver Observations & Special Instructions", 14, y);
  y += 6;

  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(14, y, pageWidth - 28, 24, 2, 2, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const notesText = patient.caregiverNotes || "No specific observations recorded for this reporting period.";
  const splitNotes = doc.splitTextToSize(notesText, pageWidth - 36);
  doc.text(splitNotes, 18, y + 6);

  y += 32;

  // Signature Block & Disclaimer Footer
  if (y > 250) {
    doc.addPage();
    y = 20;
  }

  doc.setDrawColor(203, 213, 225);
  doc.line(14, y, 90, y);
  doc.line(pageWidth - 90, y, pageWidth - 14, y);

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Primary Caregiver Signature", 14, y + 5);
  doc.text("Attending Physician / Supervisor", pageWidth - 90, y + 5);

  doc.setFontSize(7);
  doc.text("This report is generated by Care2Care Integrated Health Suite. Keep secure.", pageWidth / 2, y + 15, { align: "center" });

  // Save the document
  const fileName = `${patient.name.replace(/[^a-zA-Z0-9]/g, "_")}_Vitals_Report.pdf`;
  doc.save(fileName);
}
