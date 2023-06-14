import * as XLSX from 'xlsx';
import * as fs from 'fs';
import {Readable} from 'stream';
import * as cpexcel from 'xlsx/dist/cpexcel.full.mjs';

import {KEY, KR, EN, ES} from "./constant.js";
import {generateXML} from "./generate-xml.js";
import {generateStrings} from "./generate-strings.js";


XLSX.set_fs(fs);
/* load 'stream' for stream support */
XLSX.stream.set_readable(Readable);
/* load the codepage support library for extended support with older formats  */
XLSX.set_cptable(cpexcel);


export function parseExcel(filename) {
    const workbook = XLSX.readFile(filename)
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, {header: 1});

    let translations = {};

// Todo: 1번째 row를 추가 하고싶다면 i를 0으로 설정
    for (let i = 1; i < rows.length; i++) {
        let row = rows[i];
        translations[row[KEY]] = {
            "korean": row[EN],
            "english": row[KR],
            "spanish": row[ES],
        }
    }

    console.log(translations);

    let translationsKR = {};
    let translationsEN = {};
    let translationsES = {};

    for (let key in translations) {
        translationsKR[key] = translations[key]["korean"];
        translationsEN[key] = translations[key]["english"];
        translationsES[key] = translations[key]["spanish"]
    }


// Ensure output directory exists
    const outputDir = './output';
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    console.log('========== CREATE JSON ==========');
    fs.writeFileSync(`${outputDir}/ko-KR.json`, JSON.stringify(translationsKR, null, 2));
    fs.writeFileSync(`${outputDir}/en.json`, JSON.stringify(translationsEN, null, 2));
    fs.writeFileSync(`${outputDir}/es.json`, JSON.stringify(translationsES, null, 2));


    console.log('========== CREATE XML ==========');
    fs.writeFileSync(`${outputDir}/strings-ko.xml`, generateXML(translationsKR));
    fs.writeFileSync(`${outputDir}/strings-en.xml`, generateXML(translationsEN));
    fs.writeFileSync(`${outputDir}/strings-es.xml`, generateXML(translationsES));


    console.log('========== CREATE STRINGS ==========');
    fs.writeFileSync(`${outputDir}/Localizable-ko.strings`, generateStrings(translationsKR));
    fs.writeFileSync(`${outputDir}/Localizable-en.strings`, generateStrings(translationsEN));
    fs.writeFileSync(`${outputDir}/Localizable-es.strings`, generateStrings(translationsES));

}
