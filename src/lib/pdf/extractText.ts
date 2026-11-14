import * as mammoth from "mammoth";
import type { SourceSegment } from "@/types/contractAnalysis";

export interface DocumentExtraction {
  text: string;
  segments: SourceSegment[];
}

export class DocumentExtractor {
  static async extractDocument(buffer: Buffer, mimeType: string): Promise<DocumentExtraction> {
    switch (mimeType) {
      case "application/pdf": return this.extractPDFDocument(buffer);
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      case "application/msword": return this.extractDOCXDocument(buffer);
      case "text/plain": {
        const text = this.cleanText(buffer.toString("utf-8"));
        return { text, segments: this.segmentText(text, "Texte brut") };
      }
      default: throw new Error(`Type de fichier non supporté: ${mimeType}`);
    }
  }

  static async extractText(buffer: Buffer, mimeType: string): Promise<string> {
    return (await this.extractDocument(buffer, mimeType)).text;
  }

  private static async extractPDFDocument(buffer: Buffer): Promise<DocumentExtraction> {
    if (!buffer || buffer.length < 5 || !buffer.slice(0, 5).toString("ascii").startsWith("%PDF")) throw new Error("Le fichier n'est pas un PDF valide");
    const pages = await new Promise<string[]>((resolve, reject) => {
      import("pdf2json").then((module: any) => {
        const PDFParser = module.default || module;
        const parser = new PDFParser();
        parser.on("pdfParser_dataError", (data: any) => reject(new Error(data?.parserError || "Erreur de parsing PDF")));
        parser.on("pdfParser_dataReady", (data: any) => {
          try {
            resolve((data.Pages || []).map((page: any) => this.cleanText((page.Texts || []).flatMap((item: any) => (item.R || []).map((run: any) => { try { return decodeURIComponent(run.T || ""); } catch { return run.T || ""; } })).join(" "))));
          } catch (error) { reject(error); }
        });
        parser.parseBuffer(buffer);
      }).catch(reject);
    });
    const segments: SourceSegment[] = [];
    let text = "";
    pages.forEach((pageText, index) => {
      if (!pageText) return;
      if (text) text += "\n";
      const start = text.length;
      text += pageText;
      segments.push({ id: `page-${index + 1}`, text: pageText, page: index + 1, start, end: text.length });
    });
    if (!this.isTextValidForAnalysis(text).valid) throw new Error("Le PDF ne contient pas assez de texte pour être analysé");
    return { text, segments: this.splitLongSegments(segments) };
  }

  private static async extractDOCXDocument(buffer: Buffer): Promise<DocumentExtraction> {
    const result = await mammoth.extractRawText({ buffer });
    const text = this.cleanText(result.value);
    if (!text) throw new Error("Le fichier DOCX semble vide");
    return { text, segments: this.segmentText(text, "Document Word") };
  }

  private static segmentText(text: string, section: string): SourceSegment[] {
    const parts = text.split(/(?<=[.!?])\s+|\n+/).map((part) => part.trim()).filter(Boolean);
    const segments: SourceSegment[] = [];
    let cursor = 0;
    let group = "";
    let groupStart = 0;
    let index = 0;
    for (const part of parts) {
      const position = text.indexOf(part, cursor);
      if (group && group.length + part.length + 1 > 4500) {
        const value = group.trim();
        segments.push({ id: `segment-${index++}`, text: value, section, start: groupStart, end: groupStart + value.length });
        group = "";
      }
      if (!group) groupStart = position >= 0 ? position : cursor;
      group += `${part} `;
      cursor = position >= 0 ? position + part.length : cursor + part.length;
    }
    if (group.trim()) { const value = group.trim(); segments.push({ id: `segment-${index}`, text: value, section, start: groupStart, end: groupStart + value.length }); }
    return segments;
  }

  private static splitLongSegments(segments: SourceSegment[]): SourceSegment[] {
    return segments.flatMap((segment) => segment.text.length <= 4500 ? [segment] : this.segmentText(segment.text, segment.page ? `Page ${segment.page}` : segment.section || "Document").map((part) => ({ ...part, page: segment.page, id: `${segment.id}-${part.id}` })));
  }

  static cleanText(text: string): string { return (text || "").replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/\s+/g, " ").trim(); }
  static estimateTokenCount(text: string): number { return Math.ceil(text.length / 4); }
  static isTextValidForAnalysis(text: string): { valid: boolean; reason?: string } {
    if (!text?.trim()) return { valid: false, reason: "Le texte est vide" };
    if (text.length < 50) return { valid: false, reason: "Le texte est trop court pour être analysé (min 50 caractères)" };
    if (text.length > 50000) return { valid: false, reason: "Le texte est trop long (max 50,000 caractères)" };
    if (text.split(/\s+/).filter((word) => word.length > 1).length < 10) return { valid: false, reason: "Pas assez de contenu textuel (min 10 mots)" };
    return { valid: true };
  }
}
