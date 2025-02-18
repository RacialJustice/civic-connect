
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { storage } from '../storage';
import { formatDate } from '../utils';

export async function generateParliamentReport(sessionId: number) {
  const session = await storage.getParliamentarySession(sessionId);
  const attendance = await storage.getSessionAttendance(sessionId);
  
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  const { width, height } = page.getSize();
  
  page.drawText(`Parliamentary Session Report: ${session.title}`, {
    x: 50,
    y: height - 50,
    size: 20,
    font,
  });

  page.drawText(`Date: ${formatDate(session.date)}`, {
    x: 50,
    y: height - 80,
    size: 12,
    font,
  });

  page.drawText(`Venue: ${session.venue}`, {
    x: 50,
    y: height - 100,
    size: 12,
    font,
  });

  let yOffset = height - 140;
  page.drawText("Attendance:", {
    x: 50,
    y: yOffset,
    size: 14,
    font,
  });

  for (const record of attendance) {
    yOffset -= 20;
    page.drawText(`${record.officialName} - ${record.status}`, {
      x: 70,
      y: yOffset,
      size: 12,
      font,
    });
  }
  
  return await pdfDoc.save();
}

export async function generateProjectReport(projectId: number) {
  const project = await storage.getDevelopmentProject(projectId);
  
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  const { width, height } = page.getSize();
  
  page.drawText(`Development Project Report: ${project.title}`, {
    x: 50,
    y: height - 50,
    size: 20,
    font,
  });

  page.drawText(`Budget: ${project.budget}`, {
    x: 50,
    y: height - 80,
    size: 12,
    font,
  });

  page.drawText(`Status: ${project.status}`, {
    x: 50,
    y: height - 100,
    size: 12,
    font,
  });

  page.drawText(`Location: ${project.location}`, {
    x: 50,
    y: height - 120,
    size: 12,
    font,
  });

  page.drawText(`Timeline: ${formatDate(project.startDate)} - ${formatDate(project.endDate)}`, {
    x: 50,
    y: height - 140,
    size: 12,
    font,
  });
  
  return await pdfDoc.save();
}

export async function generateCommunityReport(forumId: number) {
  const forum = await storage.getForum(forumId);
  const metrics = await storage.getForumMetrics(forumId);
  
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  const { width, height } = page.getSize();
  
  page.drawText(`Community Engagement Report: ${forum.name}`, {
    x: 50,
    y: height - 50,
    size: 20,
    font,
  });

  page.drawText(`Total Members: ${metrics.totalMembers}`, {
    x: 50,
    y: height - 80,
    size: 12,
    font,
  });

  page.drawText(`Active Posts: ${metrics.activePosts}`, {
    x: 50,
    y: height - 100,
    size: 12,
    font,
  });

  page.drawText(`Total Comments: ${metrics.totalComments}`, {
    x: 50,
    y: height - 120,
    size: 12,
    font,
  });
  
  return await pdfDoc.save();
}
