const express = require("express");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const app = express();

const robotoRegularPath = path.join(__dirname, "fonts", "Roboto-Regular.ttf");
const playfairRegularPath = path.join(
  __dirname,
  "fonts",
  "PlayfairDisplay-Regular.ttf"
);

const logoPath = path.join(__dirname, "images", "logo.jpeg");

function generateID() {
  const now = new Date();
  const pad = (num, size) => {
    let s = "000" + num;
    return s.substr(s.length - size);
  };
  const dd = pad(now.getDate(), 2);
  const mm = pad(now.getMonth() + 1, 2);
  const yyyy = now.getFullYear();
  const hh = pad(now.getHours(), 2);
  const min = pad(now.getMinutes(), 2);
  const ss = pad(now.getSeconds(), 2);
  return `${dd}${mm}${yyyy}${hh}${min}${ss}`;
}

const addHeader = (doc) => {
  const logoWidth = 80;
  const logoHeight = 60;
  const headerText = "KDM ENGINEERS (INDIA) PRIVATE LIMITED";
  const tagLine = "Complete Civil Engineering solutions";
  const textStartX = logoWidth + 60;
  const textWidth = doc.page.width - textStartX - 50;
  doc.image(logoPath, 50, 15, {
    width: logoWidth,
    height: logoHeight,
  });
  doc
    .fontSize(20)
    .fillColor("#2596be")
    .font(playfairRegularPath)
    .text(headerText, textStartX, 20, {
      bold: true,
      width: textWidth,
      align: "left",
    })
    .fontSize(10)
    .fillColor("red")
    .text(tagLine, {
      width: 200,
    })
    .fillColor("black");

  doc.moveDown();
};

const addAddressAndDateSection = (doc) => {
  const leftMargin = 50;
  const rightMargin = doc.page.width - 50;
  const contentWidth = rightMargin - leftMargin;

  const leftContent = `
REF: KDMEI/Quote/${generateID()}
To,
Hallmark Hampton Projects,
Phone: +91 7989571595
`;

  const rightContent = `
Date: ${new Date().toLocaleDateString()}
Day: ${new Date().toLocaleDateString("en-US", { weekday: "long" })}
`;
  const startY = doc.y;
  doc
    .fontSize(12)
    .text(leftContent, leftMargin, startY, { width: contentWidth })
    .font(playfairRegularPath);

  doc.text(
    rightContent,
    rightMargin - doc.widthOfString(rightContent) + 60,
    startY,
    {
      width: contentWidth,
    }
  );

  console.log(doc.y, startY, doc.y === startY);

  doc.moveDown();
};

app.get("/view-pdf", (req, res) => {
  const doc = new PDFDocument({ margin: 50 });
  let filename = "Quotation.pdf";
  res.setHeader("Content-disposition", 'inline; filename="' + filename + '"');
  res.setHeader("Content-type", "application/pdf");
  doc.pipe(res);
  addHeader(doc);
  addAddressAndDateSection(doc);
  aboutLetter(doc);
  doc.end();
});

const port = 4000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/view-pdf`);
});
