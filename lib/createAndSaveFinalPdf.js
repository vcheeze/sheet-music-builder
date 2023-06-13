import { PDFDocument } from 'pdf-lib';
import path from 'path';
import { promises as fs } from 'fs';

export const createAndSaveFinalPdf = async (
  filePath,
  songTitles,
  finalSelection,
  dbx
) => {
  // merge and create the final document
  const mergedPdf = await PDFDocument.create();
  const basePdfContent = await fs.readFile(filePath);
  const basePdfDoc = await PDFDocument.load(basePdfContent);
  const copiedPages = await mergedPdf.copyPages(
    basePdfDoc,
    basePdfDoc.getPageIndices()
  );
  copiedPages.forEach((page) => mergedPdf.addPage(page));
  // fetch files from Dropbox
  for (const song of songTitles) {
    if (finalSelection[song]?.length > 0) {
      const fileContent = await dbx.filesDownload({
        path: finalSelection[song][0],
      });
      const pdfDoc = await PDFDocument.load(fileContent.result.fileBinary);
      const copiedPages = await mergedPdf.copyPages(
        pdfDoc,
        pdfDoc.getPageIndices()
      );
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
  }

  const mergedPdfDoc = await mergedPdf.save();
  const pathParts = path.parse(filePath);
  console.log(
    'Saving to',
    `${pathParts.dir}${path.delimiter}${pathParts.name}_final.pdf`
  );
  await fs.writeFile(
    `${pathParts.dir}${path.sep}${pathParts.name}_final.pdf`,
    mergedPdfDoc
  );
};
