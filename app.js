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

const addHeader = (doc) => {
  const logoWidth = 80;
  const logoHeight = 60;
  const companyNameX = 50;
  const companyNameY = 20;
  const headerMarginTop = 10;
  const headerLogoPath = path.join(__dirname, "images", "logo.jpeg");

  const headerText = "KDM ENGINEERS (INDIA) PRIVATE LIMITED";
  const tagLine = "Complete Civil Engineering solutions";

  doc
    .image(headerLogoPath, doc.page.width - logoWidth - 50, 15, {
      width: logoWidth,
      height: logoHeight,
    })
    .fontSize(20)
    .fillColor("#2596be")
    .font(playfairRegularPath)
    .text(headerText, companyNameX, companyNameY + headerMarginTop, {
      bold: true,
    })
    .fontSize(10)
    .fillColor("red")
    .text(tagLine, {
      align: "right",
      width: doc.page.width - companyNameX - 160,
    })
    .fillColor("black");
  doc.moveDown();
};

const addFooter = (doc, pageNumber, totalPages) => {
  const footerHeight = doc.page.height * 0.1;
  const footerText =
    "Plot No. 401, Sri Ramana Colony, Karmanghat, Saroornagar (M), Hyderabad-500079, Telangana.\n" +
    "Mobile: 9985122283, Email: info@kdmengineers.com, Website: www.kdmengineers.com";
  doc
    .fontSize(10)
    .font(playfairRegularPath)
    .text(footerText, 50, doc.page.height - footerHeight - 10, {
      width: doc.page.width - 100,
      align: "center",
    })
    .text(
      `Page ${pageNumber} of ${totalPages}`,
      doc.page.width - 150,
      doc.page.height - 10,
      {
        align: "right",
      }
    );
};

const addWatermark = (doc) => {
  const watermarkLogoPath = path.join(__dirname, "images", "logo.jpeg");

  const watermarkLogoWidth = 400;
  doc.save();
  doc.opacity(0.1);
  doc.image(
    watermarkLogoPath,
    doc.page.width / 2 - watermarkLogoWidth / 2,
    doc.page.height / 2 - 100,
    {
      fit: [watermarkLogoWidth, watermarkLogoWidth],
      align: "center",
      valign: "center",
    }
  );
  doc.restore();
};

const addAddressAndDateSection = (doc) => {
  const leftMargin = 50;
  const rightMargin = doc.page.width - 50;
  const contentWidth = rightMargin - leftMargin;

  const leftContent = `
REF: KDMEI/02-036/Quote/2024
To,
Hallmark Hampton Projects,
Phone: +91 7989571595
`;

  const rightContent = `
Date: ${new Date().toLocaleDateString()}
Day: ${new Date().toLocaleDateString("en-US", { weekday: "long" })}
`;

  doc
    .fontSize(12)
    .font(robotoRegularPath)
    .text(leftContent, leftMargin, doc.y + 10, { width: contentWidth });

  doc.text(
    rightContent,
    rightMargin - doc.widthOfString(rightContent),
    doc.y + 10,
    { width: contentWidth }
  );

  doc.moveDown();
};

const renderRandomContent = (doc) => {
  const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut ex a ante consequat bibendum in sed diam. Nunc et risus vitae elit dictum feugiat ut sed elit. Cras vehicula velit ac metus volutpat, nec sodales erat viverra. Donec lobortis, sem at euismod scelerisque, urna dui feugiat ipsum, nec dictum mi ex ut nulla. Ut id dui nec elit congue viverra. In venenatis sagittis purus eget scelerisque. Sed eu metus erat. Vestibulum non dapibus enim. Mauris nec odio tellus. Phasellus interdum vehicula velit ac tincidunt. Integer semper posuere odio, at tempus dolor rhoncus vel. Nulla id sem scelerisque, rhoncus elit et, pellentesque nisi. Ut aliquam in justo eu cursus.`;

  for (let i = 0; i < 20; i++) {
    doc.text(loremIpsum);
  }
};

app.get("/view-pdf", (req, res) => {
  const doc = new PDFDocument({ margin: 50 });

  let filename = "document_with_header_footer.pdf";
  res.setHeader("Content-disposition", 'inline; filename="' + filename + '"');
  res.setHeader("Content-type", "application/pdf");

  doc.pipe(res);

  const headerText = "KDM ENGINEERS (INDIA) PRIVATE LIMITED";
  const tagLine = "Complete Civil Engineering solutions";
  const footerText =
    "Plot No. 401, Sri Ramana Colony, Karmanghat, Saroornagar (M), Hyderabad-500079, Telangana.\n" +
    "Mobile: 9985122283, Email: info@kdmengineers.com, Website: www.kdmengineers.com";

  const headerLogoPath = path.join(__dirname, "images", "logo.jpeg");
  const watermarkLogoPath = path.join(__dirname, "images", "logo.jpeg");

  const totalPages = 5; // Simulate total number of pages

  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
    if (pageNumber > 1) {
      doc.addPage();
    }
    addWatermark(doc);
    addHeader(doc);
    addAddressAndDateSection(doc);
    renderRandomContent(doc);
    addFooter(doc, pageNumber, totalPages);
  }

  doc.end();
});

const port = 4000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/view-pdf`);
});
