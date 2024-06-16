require('dotenv').config();
const app = require('./express');
const appRoutes = require('./routes/appRoutes');
const { loadModel } = require('./handlers/destinationHandler');

// Middleware untuk menangani permintaan koneksi
app.use('/', (req, res, next) => {
  if (req.method === 'GET' && req.url === '/') {
    return res.status(200).json({ message: 'Connection to API successful' });
  }
  next();
});

// Setup routing
app.use(appRoutes);

const PORT = 8080;

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// Definisikan fungsi async untuk menjalankan loadModel
const startServer = async () => {
  try {
    await loadModel();
    console.log('Model successfully loaded');
    
    // Setelah model terload, jalankan server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    
  } catch (error) {
    console.error('Failed to load model:', error);
  }
};

// Panggil fungsi startServer untuk memulai server
startServer();
