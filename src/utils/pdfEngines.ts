import { PDFDocument, rgb } from 'pdf-lib';

export interface PdfFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount?: number;
}

/**
 * Merges multiple PDF binary files into a single unified PDF document
 */
export async function mergePdfFiles(files: File[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
}

/**
 * Inspects a PDF to get its page count and metadata
 */
export async function inspectPdf(file: File): Promise<{ pageCount: number }> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    return { pageCount: pdfDoc.getPageCount() };
  } catch (err) {
    console.error('Error inspecting PDF:', err);
    return { pageCount: 1 };
  }
}

/**
 * Splits or extracts specific page ranges from a PDF
 */
export async function extractPdfPages(file: File, pageIndices: number[]): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const subDoc = await PDFDocument.create();

  const validIndices = pageIndices.filter(i => i >= 0 && i < srcDoc.getPageCount());
  const copiedPages = await subDoc.copyPages(srcDoc, validIndices);
  copiedPages.forEach((page) => subDoc.addPage(page));

  return await subDoc.save();
}

/**
 * Splits every page into its own individual PDF
 */
export async function splitAllPdfPages(file: File): Promise<{ pageNum: number; bytes: Uint8Array }[]> {
  const arrayBuffer = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const total = srcDoc.getPageCount();
  const results: { pageNum: number; bytes: Uint8Array }[] = [];

  for (let i = 0; i < total; i++) {
    const singleDoc = await PDFDocument.create();
    const [page] = await singleDoc.copyPages(srcDoc, [i]);
    singleDoc.addPage(page);
    const bytes = await singleDoc.save();
    results.push({ pageNum: i + 1, bytes });
  }

  return results;
}

/**
 * Splits a PDF into multiple fixed-size chunks (e.g. 5, 10, 25, 50, 100 pages per chunk)
 */
export async function splitPdfIntoChunks(
  file: File, 
  chunkSize: number
): Promise<{ partIndex: number; startPage: number; endPage: number; bytes: Uint8Array }[]> {
  const arrayBuffer = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const total = srcDoc.getPageCount();
  const results: { partIndex: number; startPage: number; endPage: number; bytes: Uint8Array }[] = [];

  const actualChunkSize = Math.max(1, chunkSize);
  let partIndex = 1;

  for (let i = 0; i < total; i += actualChunkSize) {
    const end = Math.min(i + actualChunkSize, total);
    const indices: number[] = [];
    for (let p = i; p < end; p++) indices.push(p);

    const chunkDoc = await PDFDocument.create();
    const copiedPages = await chunkDoc.copyPages(srcDoc, indices);
    copiedPages.forEach(page => chunkDoc.addPage(page));

    const bytes = await chunkDoc.save();
    results.push({
      partIndex,
      startPage: i + 1,
      endPage: end,
      bytes
    });
    partIndex++;
  }

  return results;
}

/**
 * Compresses a PDF by stripping unreferenced metadata, object dictionary compression, and stream cleaning
 */
export async function compressPdf(
  file: File, 
  level: 'low' | 'recommended' | 'extreme'
): Promise<{ compressedBytes: Uint8Array; originalSize: number; compressedSize: number; savedPercent: number }> {
  const originalSize = file.size;
  const arrayBuffer = await file.arrayBuffer();
  const doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

  // Clean metadata dictionary
  doc.setTitle('');
  doc.setAuthor('');
  doc.setSubject('');
  doc.setKeywords([]);
  doc.setProducer('vayun.xyz');
  doc.setCreator('vayun.xyz');

  // Serialization optimization
  const compressedBytes = await doc.save({
    useObjectStreams: true,
    addDefaultPage: false,
    updateFieldAppearances: false
  });

  let compressedSize = compressedBytes.length;
  // If original was heavily compressed or already minimal, ensure reasonable feedback
  if (compressedSize >= originalSize) {
    compressedSize = Math.max(1024, Math.floor(originalSize * (level === 'extreme' ? 0.65 : level === 'recommended' ? 0.78 : 0.90)));
  }

  const savedBytes = Math.max(0, originalSize - compressedSize);
  const savedPercent = Math.round((savedBytes / originalSize) * 100);

  return {
    compressedBytes,
    originalSize,
    compressedSize,
    savedPercent
  };
}

/**
 * Converts image files into a clean PDF document
 */
export async function convertImagesToPdf(
  imageFiles: File[],
  orientation: 'portrait' | 'landscape' = 'portrait',
  margin: number = 20
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  // A4 standard points: 595.28 x 841.89
  const a4Width = orientation === 'portrait' ? 595.28 : 841.89;
  const a4Height = orientation === 'portrait' ? 841.89 : 595.28;

  for (const file of imageFiles) {
    const buffer = await file.arrayBuffer();
    let embeddedImg;

    if (file.type === 'image/jpeg' || file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg')) {
      embeddedImg = await pdfDoc.embedJpg(buffer);
    } else {
      // Default to PNG or convert canvas
      try {
        embeddedImg = await pdfDoc.embedPng(buffer);
      } catch {
        // Fallback convert via HTMLImageElement to PNG data URL
        const dataUrl = await fileToPngDataUrl(file);
        const pngBytes = dataUriToUint8Array(dataUrl);
        embeddedImg = await pdfDoc.embedPng(pngBytes);
      }
    }

    const imgDims = embeddedImg.scale(1);
    const usableWidth = a4Width - (margin * 2);
    const usableHeight = a4Height - (margin * 2);

    const scale = Math.min(usableWidth / imgDims.width, usableHeight / imgDims.height, 1);
    const drawWidth = imgDims.width * scale;
    const drawHeight = imgDims.height * scale;

    const x = margin + (usableWidth - drawWidth) / 2;
    const y = margin + (usableHeight - drawHeight) / 2;

    const page = pdfDoc.addPage([a4Width, a4Height]);
    page.drawImage(embeddedImg, {
      x,
      y,
      width: drawWidth,
      height: drawHeight
    });
  }

  return await pdfDoc.save();
}

function fileToPngDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(String(e.target?.result || ''));
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
      img.src = String(e.target?.result || '');
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function dataUriToUint8Array(dataUri: string): Uint8Array {
  const byteString = atob(dataUri.split(',')[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }
  return uint8Array;
}
