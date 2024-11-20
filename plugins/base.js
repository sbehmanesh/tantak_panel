var XLSX = require("xlsx");
import { jsPDF } from "jspdf";
import "jspdf-autotable";
export default ({ redirect, $toast }, inject) => {
  inject("exportCSV", (headers, desserts, name) => {
    try {
      let items = [];
      for (let i = 0; i < desserts.length; i++) {
        let element = {};
        const dessert = desserts[i];
        if (Boolean(dessert)) {
          for (let j = 0; j < headers.length; j++) {
            const header = headers[j];
            let value = "";

            if (typeof header.value == "function") {
              // value = header.filterCol
              value = header.value(dessert);
            } else {
              value = dessert[header.value];
            }
            if (Boolean(value)) {

              element[header.text] = value;
            }
          }
          items.push(element);
        }
      }
      let fileName = "export.xlsx";
      if (name) {
        fileName = `${name}.xlsx`;
      }
      let wb = XLSX.utils.book_new();
      let ws = XLSX.utils.json_to_sheet(items);
      XLSX.utils.book_append_sheet(wb, ws, "all");
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.log("ErrorExportCSV =>", error);

      $toast.error("خطا در دریافت طلاعات");
    }
  });
  inject("exportPDF", (headers, desserts) => {
    try {
      let head = [];
      let items = [];
      headers.forEach((header) => {
        head.push(header.text);
      });

      for (let i = 0; i < desserts.length; i++) {
        let element = {};
        const dessert = desserts[i];
        for (let j = 0; j < headers.length; j++) {
          const header = headers[j];
          let value = "";
          if (typeof header.value == "function") {
            // value = header.filterCol
            value = header.value(dessert);
          } else {
            value = dessert[header.value];
          }
          element[header.text] = value;
        }
        items.push(element);
      }
      let rowExport = [];
      items.forEach((element) => {
        let hd = [];
        head.forEach((element2) => {
          hd.push(element[element2]);
        });
        rowExport.push(hd);
        hd = [];
      });

      let pdfName = "table";
      const doc = new jsPDF("p", "pt", "a4");
      doc.autoTable({
        head: [head],
        headStyles: {
          fillColor: "#bde4d1",
          textColor: "#333333",
          fontStyle: "Amiri",
          font: "helvetica",
          // font-family: tahoma  |'times'|'courier' = 'helvetica'
        },
        body: rowExport,
        startY: 10,
        theme: "plain",
      });
      doc.save(pdfName + ".pdf");
    } catch (error) {
      $toast.error("خطا در دریافت  طلاعات");
    }
  });
};
