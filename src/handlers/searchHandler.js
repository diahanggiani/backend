const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const downloadCsvFileFromUrl = require('../utils/downloadCsvFileFromUrl');

let placesData = []; // Variabel untuk menyimpan data tempat dari CSV

// Fungsi untuk memuat data tempat dari CSV
const loadPlacesData = async () => {
    try {
        const datasetUrl = process.env.DATASET_URL; // Ambil URL dataset dari variabel lingkungan
        const csvFilePath = await downloadCsvFileFromUrl(datasetUrl); // Unduh file CSV dari URL

        // Baca file CSV dan simpan data tempat ke dalam array placesData
        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (row) => {
                placesData.push(row);
            })
            .on('end', () => {
                console.log('CSV file successfully processed');
            });
    } catch (error) {
        console.error('Failed to load CSV file:', error);
    }
};

// Fungsi untuk mencari tempat berdasarkan nama (Place_Name)
const searchPlaces = (req, res) => {
    const { placeName } = req.query;

    // Pastikan placeName terdefinisi sebelum digunakan
    if (!placeName) {
      return res.status(400).json({ error: 'Parameter placeName is required' });
    }

    // Filter data tempat berdasarkan nama tempat (Place_Name)
    const searchResults = placesData.filter(place => place.Place_Name.toLowerCase().includes(placeName.toLowerCase()));

    res.status(200).json({
        results: searchResults
    });
};

// Memuat data tempat saat server dimulai
loadPlacesData();

module.exports = {
    searchPlaces
};
