import { Blob } from 'buffer'

const pdf = require('pdfjs');
const fs = require('fs');
// const Blob = require('buffer');

// create the PDF document
const doc = new pdf.Document({
    // width: default 595.296, the page width
    // height: default 841.896, the page height
    // padding: 10, // the page padding, default 20 
     font: require('pdfjs/font/Helvetica') // (required) - expects an pdf.Font object being either a AFM font or a OTF font
    // fontSize: , // (default: 11) - the font size
    // color: , // (default: black) - the font color as hex number (e.g. 0x000000)
    // lineHeight: , // (default: 1.15) - the line height
    // properties: { // document properties - see below
        // title: , // (string) - the document's title
        // author: , // (string) - the name of the person who created the document
        // subject: , // (string) - the subject of the document 
        // keywords: , // (string) - keywords associated with the document
        // creator: , // (string) - if the document was converted to PDF from another format, the name of the conforming product that created the original document from which it was converted
        // producer: , (string, default: pdfjs v1.3 (github.com/rkusa/pdfjs)) - if the document was converted to PDF from another format, the name of the conforming product that converted it to PDF
        // creationDate: , // (date, default: new Date()) - the date and time the document was created
        // modDate:  // (date) - the date and time the document was most recently modified
    // }

  })

// doc.pipe(fs.createWriteStream('output.pdf'))
  
// render something onto the document
async function render() {
    // create header
    const header = doc.header()
    header.text('songName')

    // create a table
    const table = doc.table({
        widths: [80, 80, 80, 80, 80, 80, 80],
        borderHorizontalWidth: 10
    })

    const row1 = table.row()
    row1.cell('sectionName/description')
    row1.cell('Time Sig')
    row1.cell('Tempo')
    row1.cell('Bars')
    row1.cell('Start Bar Pos.')
    row1.cell('End Bar Pos.')
    row1.cell('Gradual Tempo Transition?')

    // const row2 = table.row()
    // row2.cell('blah1')
    // row2.cell('4/4')
    // row2.cell('180')
    // row2.cell('16')
    // row2.cell('1.1.00')
    // row2.cell('17.1.00')
    // row2.cell('No')

    const buf = await doc.asBuffer();
    const blob = new Blob([buf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const previewEl = document.getElementById('preview');
    previewEl.data = url;
}

render().catch((err) => {
    throw err;
});

// await doc.end()