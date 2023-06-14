// Function to generate .strings content
export function generateStrings(translations) {
    let content = '';
    for(let key in translations) {
        content += `"${key}" = "${translations[key]}";\n`;
    }
    return content;
}
