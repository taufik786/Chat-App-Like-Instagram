const express = require('express');
const router = express.Router();

const ImageController = require('../controllers/images');
const AuthHelper = require('../helpers/authHelper');

router.post('/upload-image', AuthHelper.VerifyToken, ImageController.UploadImage);

module.exports = router;