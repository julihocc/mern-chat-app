// translationService.js

import Papa from 'papaparse';

export async function fetchTranslations() {
    try {
        const response = await fetch('/resources.csv');
        // console.log(response.text())
        const csvData = await response.text();
        console.log('csvData: ', csvData)

        let csvParsed = Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true
        });

        let resources = {};

        // Initialize keys
        for (let key of csvParsed.meta.fields) {
            if (key !== 'key') {
                resources[key] = {
                    translation: {}
                };
            }
        }

        // Populate translations
        for (let row of csvParsed.data) {
            let key = row['key'];
            for (let lang in row) {
                if (lang !== 'key') {
                    resources[lang].translation[key] = row[lang];
                }
            }
        }

        return resources;
    } catch (err) {
        console.error(err);
        return null;
    }
}
