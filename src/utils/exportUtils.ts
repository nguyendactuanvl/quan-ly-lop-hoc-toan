import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToExcel = (data: any[], filename: string) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

export const exportToPDF = (headers: string[], data: any[][], filename: string, title: string) => {
  const doc = new jsPDF();
  
  // Add a simple font for Vietnamese support if needed, but standard jsPDF might have issues with full UTF-8 without custom fonts.
  // We'll use the default for now.
  
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  (doc as any).autoTable({
    startY: 30,
    head: [headers],
    body: data,
    styles: { font: 'helvetica' },
  });
  
  doc.save(`${filename}.pdf`);
};

export const exportToWord = (headers: string[], data: any[][], filename: string, title: string) => {
  const tableRows = data.map(row => 
    `<tr>${row.map(cell => `<td style="border: 1px solid black; padding: 8px;">${cell}</td>`).join('')}</tr>`
  ).join('');

  const tableHeaders = `<tr>${headers.map(h => `<th style="border: 1px solid black; padding: 8px; background-color: #f2f2f2;">${h}</th>`).join('')}</tr>`;

  const html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>${title}</title></head>
    <body>
      <h2>${title}</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <thead>${tableHeaders}</thead>
        <tbody>${tableRows}</tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
