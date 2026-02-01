import * as pdfjs from "pdfjs-dist";
import type { CandidateFormValues } from "@/pages/recruitment/components/candidates/CandidateForm";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export interface ParsedResumeData {
  name?: string;
  email?: string;
  phone?: string;
}

/**
 * Extract text content from a PDF file
 */
async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

  const textParts: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    textParts.push(pageText);
  }

  return textParts.join("\n");
}

/**
 * Extract email from text using regex
 */
function extractEmail(text: string): string | undefined {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
  const matches = text.match(emailRegex);
  return matches?.[0];
}

/**
 * Extract phone number from text using regex
 * Supports various formats: +86 xxx, 1xx-xxxx-xxxx, (xxx) xxx-xxxx, etc.
 */
function extractPhone(text: string): string | undefined {
  const phonePatterns = [
    // Chinese mobile: 1xx xxxx xxxx or 1xx-xxxx-xxxx
    /1[3-9]\d[\s-]?\d{4}[\s-]?\d{4}/g,
    // International format: +xx xxx xxx xxxx
    /\+\d{1,3}[\s-]?\d{2,4}[\s-]?\d{3,4}[\s-]?\d{4}/g,
    // US/General format: (xxx) xxx-xxxx or xxx-xxx-xxxx
    /\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g,
    // Generic: 10+ digit number with optional separators
    /\d[\d\s.-]{9,14}\d/g,
  ];

  for (const pattern of phonePatterns) {
    const matches = text.match(pattern);
    if (matches?.[0]) {
      // Clean up and return
      return matches[0].replace(/[\s.-]/g, "").replace(/^\+/, "+");
    }
  }
  return undefined;
}

/**
 * Extract name from resume text using heuristics
 * Looks for common patterns like "Name: xxx" or assumes first meaningful line
 */
function extractName(text: string): string | undefined {
  // Try to find explicit name labels (Chinese and English)
  const namePatterns = [
    /(?:姓\s*名|Name)\s*[:：]\s*([^\n\r,，]{2,20})/i,
    /(?:^|\n)\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})\s*(?:\n|$)/m, // "John Doe" pattern
  ];

  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      return match[1].trim();
    }
  }

  // Fallback: try first non-empty line that looks like a name (2-4 Chinese chars or 2-3 words)
  const lines = text
    .split(/[\n\r]+/)
    .map((l) => l.trim())
    .filter(Boolean);
  for (const line of lines.slice(0, 5)) {
    // Chinese name: 2-4 characters
    if (/^[\u4e00-\u9fa5]{2,4}$/.test(line)) {
      return line;
    }
    // English name: 2-3 capitalized words
    if (/^[A-Z][a-z]+(\s+[A-Z][a-z]+){1,2}$/.test(line)) {
      return line;
    }
  }

  return undefined;
}

/**
 * Parse a resume PDF file and extract candidate information
 */
export async function parseResume(
  file: File,
): Promise<Partial<CandidateFormValues>> {
  try {
    const text = await extractTextFromPdf(file);

    const parsed: ParsedResumeData = {
      name: extractName(text),
      email: extractEmail(text),
      phone: extractPhone(text),
    };

    // Return only defined values
    const result: Partial<CandidateFormValues> = {};
    if (parsed.name) result.name = parsed.name;
    if (parsed.email) result.email = parsed.email;
    if (parsed.phone) result.phone = parsed.phone;

    return result;
  } catch (error) {
    console.error("Failed to parse resume:", error);
    return {};
  }
}
