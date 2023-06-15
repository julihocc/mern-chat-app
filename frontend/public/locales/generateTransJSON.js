const fs = require('fs');
const csv = require('csv-parser');

let data = [];

fs.createReadStream('translations.csv')
    .pipe(csv())
    .on('data', (row) => {
        data.push(row);
    })
    .on('end', () => {
        let languages = Object.keys(data[0]);
        for(let lang of languages) {
            // Check if the directory exists, create it if it doesn't
            if (!fs.existsSync(lang)){
                fs.mkdirSync(lang);
            }

            let translation = {};
            for(let row of data) {
                translation[row.key] = row[lang];
            }
            // This will create the file if it does not exist and overwrite it if it does
            fs.writeFileSync(`${lang}/translations.json`, JSON.stringify(translation, null, 2));
        }
        console.log('CSV file successfully processed');
    });
