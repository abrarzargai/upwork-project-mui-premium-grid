const fs = require('fs');
const csv = require('csv-parser');

function csvToJson(csvFilePath, jsonFilePath) {
    const jsonArray = [];

    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
            jsonArray.push(row);
        })
        .on('end', () => {
            fs.writeFileSync(jsonFilePath, JSON.stringify(jsonArray, null, 2));
            console.log('Conversion completed successfully!');
        })
        .on('error', (error) => {
            console.error('Error occurred while converting CSV to JSON:', error);
        });
}

// Example usage:
const csvFilePath = 'master-data.csv';
const jsonFilePath = 'output.json';
csvToJson(csvFilePath, jsonFilePath);
