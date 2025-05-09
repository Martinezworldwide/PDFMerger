let mergedBytesGlobal = null;

async function mergePDFs() {
  const input = document.getElementById('pdfFiles');
  const files = Array.from(input.files);

  if (files.length === 0) {
    alert("Please select at least two PDF files.");
    return;
  }

  const mergedPdf = await PDFLib.PDFDocument.create();

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const pdf = await PDFLib.PDFDocument.load(bytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach(page => mergedPdf.addPage(page));
  }

  mergedBytesGlobal = await mergedPdf.save();
  document.getElementById('options').style.display = 'block';
}

// Option 1: Direct PDF download
function downloadPDF() {
  const blob = new Blob([mergedBytesGlobal], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.getElementById('downloadLink');
  downloadLink.href = url;
  downloadLink.download = 'merged.pdf';
  downloadLink.style.display = 'inline';
  downloadLink.textContent = 'Click to Download PDF';
  downloadLink.click();
}

// Option 2: ZIP download
async function downloadAsZip() {
  const zip = new JSZip();
  zip.file('merged.pdf', mergedBytesGlobal);
  const content = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'merged_pdf.zip';
  a.click();
}

// Option 3: Open in new tab
function openInTab() {
  const blob = new Blob([mergedBytesGlobal], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}

