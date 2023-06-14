// Function to generate XML string
export function generateXML(translations) {
    let xml = '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n';
    for(let key in translations) {
        xml += `    <string name="${key}">${translations[key]}</string>\n`;
    }
    xml += '</resources>';
    return xml;
}
