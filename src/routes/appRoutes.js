const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const authHandler = require('../handlers/authHandler');
const userHandler = require('../handlers/userHandler');
const searchHandler = require('../handlers/searchHandler');
const destinationHandler = require('../handlers/destinationHandler');

const router = express.Router();

// Auth route
router.post('/auth/signup', authHandler.signup);
router.post('/auth/login', authHandler.login);
router.post('/auth/logout', authHandler.logout);

// User route
router.get('/user/profile', authMiddleware, userHandler.getUserProfile);
router.put('/user/profile', authMiddleware, userHandler.updateUserProfile);
router.delete('/user/profile', authMiddleware, userHandler.deleteUserAccount);

// Search route
router.get('/search', searchHandler.searchPlaces);

// Recommendation route
router.post('/recommendation', authMiddleware, destinationHandler.getRecommendation);

module.exports = router;
