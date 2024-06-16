const tf = require('@tensorflow/tfjs-node');
const { v4: uuidv4 } = require("uuid");
const db = require('../firebase');

let model;

const loadModel = async () => {
  const modelUrl = process.env.MODEL_URL;
  model = await tf.loadGraphModel(modelUrl);
};

const getRecommendation = async (req, res) => {
  if (!model) {
    return res.status(500).json({ message: "Model is not loaded yet" });
  }

  const { category, description } = req.body;
  const userId = req.user.userId;

  console.log("Request Body:", req.body);

  if (category === undefined || !Array.isArray(description) || description.length !== 65) {
    return res.status(400).json({
      message: "Invalid input: category and description are required. Description must be an array of length 65.",
    });
  }

  try {
    // Mengonversi category menjadi tensor 2D dengan bentuk [1, 1]
    const categoryTensor = tf.tensor2d([[category]], [1, 1]);
    // Mengonversi description menjadi tensor dengan bentuk [1, 65]
    const descriptionTensor = tf.tensor(description, [1, 65]);

    // Memprediksi berdasarkan categoryTensor dan descriptionTensor
    const similarityMatrix = model.predict({ category_input: categoryTensor, description_input: descriptionTensor }).arraySync();

    const recommendationId = uuidv4();
    await db.collection("recommendations").doc(recommendationId).set({
      userId: userId,
      recommendations: similarityMatrix,
      createdAt: new Date().toISOString(),
    });

    res.status(200).json({
      message: "Recommendations retrieved successfully",
      recommendations: similarityMatrix,
      recommendationId: recommendationId,
    });
  } catch (error) {
    console.error("Error getting recommendation:", error);
    res.status(500).json({ message: "Error getting recommendation", error: error.message });
  }
};

module.exports = {
  loadModel,
  getRecommendation,
};


// =============================================================================================================================================

// const tf = require('@tensorflow/tfjs-node');
// const db = require('../firebase');
// let model;

// const loadModel = async () => {
//     const modelUrl = process.env.MODEL_URL;
//     model = await tf.loadGraphModel(modelUrl);
// };

// // Fungsi untuk menghasilkan rekomendasi destinasi
// const getRecommendation = async (req, res) => {
//     try {
//         const { category, description } = req.body;

//         // Validasi input kategori
//         const validCategories = ['Agrowisata', 'Alam', 'Belanja', 'Budaya', 'Cagar Alam', 'Pantai', 'Rekreasi', 'Religius'];
//         if (!validCategories.includes(category)) {
//             return res.status(400).json({ message: 'Invalid category' });
//         }

//         // Validasi input deskripsi (optional)
//         let inputDescription;
//         if (description) {
//             // Jika deskripsi diberikan, pastikan panjangnya sesuai dengan yang diharapkan (65)
//             if (description.length !== 65) {
//                 return res.status(400).json({ message: 'Description length must be 65' });
//             }
//             inputDescription = description;
//         } else {
//             // Jika tidak ada deskripsi, isi dengan array dummy (0s)
//             inputDescription = Array(65).fill(0);
//         }

//         // Menggunakan model untuk menghasilkan rekomendasi
//         const inputTensor = tf.tensor2d([[category, ...inputDescription]]);
//         const prediction = model.predict(inputTensor);

//         // Proses hasil prediksi menjadi format yang diinginkan
//         const recommendedDestinations = await processPrediction(prediction);

//         // Simpan rekomendasi ke Firestore
//         await saveRecommendation(req.user.userId, recommendedDestinations);

//         res.status(200).json({ recommendedDestinations });
//     } catch (error) {
//         res.status(500).json({ message: 'Error generating recommendation', error });
//     }
// };

// // Fungsi untuk memproses hasil prediksi
// const processPrediction = async (prediction) => {
//     // Proses hasil prediksi menjadi format yang diinginkan (contoh: array of destination IDs)
//     const recommendedDestinations = prediction.arraySync()[0];
//     return recommendedDestinations;
// };

// // Fungsi untuk menyimpan rekomendasi ke Firestore
// const saveRecommendation = async (userId, recommendations) => {
//     const recommendation = {
//         userId,
//         recommendations,
//         createdAt: new Date().toISOString(),
//     };
//     await db.collection('recommendations').add(recommendation);
// };

// module.exports = {
//     loadModel,
//     getRecommendation,
// };
