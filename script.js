async function mergePDFs() {
  const input = document.getElementById('pdfFiles');
  const files = Array.from(input.files);

  const mergedPdf = await PDFLib.PDFDocument.create();

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const pdf = await PDFLib.PDFDocument.load(bytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const mergedBytes = await mergedPdf.save();
  const blob = new Blob([mergedBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.getElementById('downloadLink');
  downloadLink.href = url;
  downloadLink.download = 'merged.pdf';
  downloadLink.style.display = 'inline';
  downloadLink.textContent = 'Download Merged PDF';
}
