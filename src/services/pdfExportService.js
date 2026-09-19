import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Single-Page High-Definition PDF Exporter
 * Based on the proven engine from invoice full
 */
export async function exportInvoiceToPdf(element, filename = 'Payana_Invoice.pdf') {
  if (!element) return false;

  try {
    const canvas = await html2canvas(element, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      imageTimeout: 15000,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 4; // 4mm edge margin
    const maxWidth = pdfWidth - (margin * 2);
    const maxHeight = pdfHeight - (margin * 2);

    let imgWidth = maxWidth;
    let imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Scale down to ensure 100% single page fit
    if (imgHeight > maxHeight) {
      imgHeight = maxHeight;
      imgWidth = (canvas.width * imgHeight) / canvas.height;
    }

    // Center on page
    const xPos = margin + (maxWidth - imgWidth) / 2;
    const yPos = margin + (maxHeight - imgHeight) / 2;

    pdf.addImage(imgData, 'JPEG', xPos, yPos, imgWidth, imgHeight);
    pdf.save(filename);
    return true;
  } catch (err) {
    console.error('PDF Export Error:', err);
    throw err;
  }
}
