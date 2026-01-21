// src/lib/pdf/extractText.ts - Version avec seulement pdf2json
import * as mammoth from 'mammoth';

export class DocumentExtractor {
  static async extractText(fileBuffer: Buffer, mimeType: string): Promise<string> {
    try {
      console.log(`Extraction de texte pour type: ${mimeType}`);
      
      switch (mimeType) {
        case 'application/pdf':
          return await this.extractFromPDF(fileBuffer);
        
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'application/msword':
          return await this.extractFromDOCX(fileBuffer);
        
        case 'text/plain':
          return fileBuffer.toString('utf-8');
        
        default:
          throw new Error(`Type de fichier non supporté: ${mimeType}`);
      }
    } catch (error: any) {
      console.error('Erreur d\'extraction de texte:', error);
      throw new Error(`Échec de l'extraction du texte: ${error?.message || 'Erreur inconnue'}`);
    }
  }

  static async extractFromPDF(buffer: Buffer): Promise<string> {
    console.log('Début de l\'extraction PDF avec pdf2json...');
    
    // Validation basique
    if (!buffer || buffer.length === 0) {
      throw new Error('Buffer PDF vide');
    }
    
    if (buffer.length < 5) {
      throw new Error('Fichier trop petit pour être un PDF valide');
    }
    
    const header = buffer.slice(0, 5).toString('ascii');
    if (!header.startsWith('%PDF')) {
      throw new Error(`Le fichier n'est pas un PDF valide. En-tête: "${header}"`);
    }
    
    console.log(`PDF valide détecté: ${buffer.length} bytes, en-tête: ${header}`);
    
    return new Promise((resolve, reject) => {
      import('pdf2json').then((PDFParserModule: any) => {
        try {
          // pdf2json peut être exporté de différentes manières
          const PDFParser = PDFParserModule.default || PDFParserModule;
          
          if (typeof PDFParser !== 'function') {
            reject(new Error('pdf2json non chargé correctement'));
            return;
          }
          
          const pdfParser = new PDFParser();
          
          pdfParser.on('pdfParser_dataError', (errData: any) => {
            const errorMsg = errData?.parserError || 'Erreur de parsing PDF';
            console.error('Erreur pdf2json:', errorMsg);
            reject(new Error(`Erreur de parsing PDF: ${errorMsg}`));
          });
          
          pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
            try {
              console.log('pdf2json parsing terminé, traitement du texte...');
              
              let extractedText = '';
              
              if (pdfData.Pages && Array.isArray(pdfData.Pages)) {
                console.log(`Nombre de pages: ${pdfData.Pages.length}`);
                
                pdfData.Pages.forEach((page: any, pageIndex: number) => {
                  if (page.Texts && Array.isArray(page.Texts)) {
                    page.Texts.forEach((textObj: any) => {
                      if (textObj.R && Array.isArray(textObj.R)) {
                        textObj.R.forEach((r: any) => {
                          if (r.T) {
                            extractedText += decodeURIComponent(r.T) + ' ';
                          }
                        });
                      }
                    });
                  }
                  
                  // Ajouter un saut de ligne entre les pages
                  if (pageIndex < pdfData.Pages.length - 1) {
                    extractedText += '\n';
                  }
                });
              }
              
              const cleanedText = this.cleanText(extractedText);
              
              console.log(`Texte extrait brut: ${extractedText.length} caractères`);
              console.log(`Texte nettoyé: ${cleanedText.length} caractères`);
              
              if (!cleanedText || cleanedText.trim().length < 50) {
                reject(new Error(`Le PDF ne contient pas assez de texte pour être analysé (${cleanedText?.length || 0} caractères)`));
                return;
              }
              
              // Aperçu du texte pour débogage
              console.log(`Aperçu du texte (premiers 200 caractères): ${cleanedText.substring(0, 200)}...`);
              
              resolve(cleanedText);
            } catch (innerError: any) {
              console.error('Erreur lors du traitement du texte:', innerError);
              reject(new Error(`Erreur lors du traitement du texte PDF: ${innerError?.message || innerError}`));
            }
          });
          
          // Démarrer le parsing
          console.log('Démarrage du parsing pdf2json...');
          pdfParser.parseBuffer(buffer);
          
        } catch (initError: any) {
          console.error('Erreur d\'initialisation pdf2json:', initError);
          reject(new Error(`Erreur d'initialisation du parser PDF: ${initError?.message || initError}`));
        }
      }).catch((importError: any) => {
        console.error('Erreur d\'import pdf2json:', importError);
        reject(new Error(`Impossible de charger pdf2json: ${importError?.message || importError}`));
      });
    });
  }

  static async extractFromDOCX(buffer: Buffer): Promise<string> {
    try {
      console.log('Début de l\'extraction DOCX avec mammoth...');
      const result = await mammoth.extractRawText({ buffer });
      const text = this.cleanText(result.value);
      
      if (!text || text.trim().length === 0) {
        throw new Error('Le fichier DOCX semble vide');
      }
      
      console.log(`DOCX texte extrait: ${text.length} caractères`);
      return text;
    } catch (error: any) {
      console.error('DOCX extraction error:', error);
      throw new Error(`Échec de l'extraction du DOCX: ${error?.message || 'Format DOCX invalide'}`);
    }
  }

  static cleanText(text: string): string {
    if (!text) return '';
    
    return text
      .replace(/\s+/g, ' ')
      .replace(/\r?\n|\r/g, ' ')
      .replace(/[^\S\r\n]+/g, ' ')
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .trim();
  }

  static estimateTokenCount(text: string): number {
    return Math.ceil(text.length / 4);
  }

  static isTextValidForAnalysis(text: string): { valid: boolean; reason?: string } {
    if (!text || text.trim().length === 0) {
      return { valid: false, reason: 'Le texte est vide' };
    }

    if (text.length < 50) {
      return { valid: false, reason: 'Le texte est trop court pour être analysé (min 50 caractères)' };
    }

    if (text.length > 50000) {
      return { valid: false, reason: 'Le texte est trop long (max 50,000 caractères)' };
    }

    const wordCount = text.split(/\s+/).filter(word => word.length > 1).length;
    if (wordCount < 10) {
      return { valid: false, reason: 'Pas assez de contenu textuel (min 10 mots)' };
    }

    return { valid: true };
  }
}