const express = require('express');
const adminController = require('../controllers/admin-controller');
const imageUploadMiddleware = require('../middlewares/image-upload');

const router = express.Router();

// /admin is added in front of these routes url
router.get('/products', adminController.viewAllProducts); // leads to /admin/products

router.get('/products/:id', adminController.viewSingleProduct);

router.get('/products/:id/edit', adminController.getModifyProduct);

router.post('/products/:id/edit', imageUploadMiddleware, adminController.submitModifiedProduct);

router.get('/products/new', adminController.createNewProduct);

// imageUploadMiddleware ensures uploaded file shld be extracted and stored
router.post('/products/new', imageUploadMiddleware, adminController.submitNewProduct);

// Route is active for incoming delete requests
router.delete('/products/:id', adminController.deleteProduct);


module.exports = router;