import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

export interface ResumeData {
  name: string;
  email: string;
  photo: string;

  marks10: string;
  marks12: string;
  graduationMarks: string;

  stream: string;
  experience: string;

  skill: string;
  skillType: string;
}

// Generate resume and return as Blob
export const generateResumeBlob = async (data: ResumeData): Promise<Blob> => {
  const res = await fetch("/templates/resume-template.docx");
  const content = await res.arrayBuffer();

  const zip = new PizZip(content);

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true
  });

  doc.setData({
    name: data.name,
    email: data.email,
    photo: data.photo,

    marks10: data.marks10,
    marks12: data.marks12,
    graduationMarks: data.graduationMarks,

    stream: data.stream,
    experience: data.experience,

    skill: data.skill,
    skillType: data.skillType
  });

  doc.render();

  const blob = doc.getZip().generate({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  });

  return blob;
};

// Original download function
import { saveAs } from "file-saver";
export const generateResume = async (data: ResumeData) => {
  const blob = await generateResumeBlob(data);
  saveAs(blob, "resume.docx");
};

