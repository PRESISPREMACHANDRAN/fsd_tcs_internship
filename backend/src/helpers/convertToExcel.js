const XLSX = require("xlsx");

const convertJsonToExcel = (data, fileName, res) => {
  let xlsdata = Array.from(JSON.parse(JSON.stringify(data)));
  
  const workSheet = XLSX.utils.json_to_sheet(xlsdata);
  const workBook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workBook, workSheet, "sheet1");
  // Generate buffer
  const buffer = XLSX.write(workBook, { bookType: "xlsx", bookSST: false, type: "array" });

  res.writeHead(200, {
    "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "Content-Disposition": `attachment; filename=" ${fileName}.xlsx`
  });
  res.end(new Buffer.from(buffer));
}

module.exports = convertJsonToExcel;