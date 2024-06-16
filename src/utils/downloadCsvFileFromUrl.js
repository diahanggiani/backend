const fs = require('fs');
const path = require('path');
const axios = require('axios');

const downloadCsvFileFromUrl = async (url) => {
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });

    return new Promise((resolve, reject) => {
        const tempFilePath = path.join(__dirname, '..', 'temp', 'dataset.csv');
        const writer = fs.createWriteStream(tempFilePath);

        writer.on('finish', () => resolve(tempFilePath));
        writer.on('error', reject);

        response.data.pipe(writer);
    });
};

module.exports = downloadCsvFileFromUrl;
