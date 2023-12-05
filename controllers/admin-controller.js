const Product = require('../models/product');

async function viewAllProducts(req, res, next) {
    try {
        const products = await Product.getAllProducts();
        res.render('admin/products/all-products', { products: products });
    } catch(error) {
        next(error);
        return;
    }
};

function createNewProduct(req, res) {
    res.render('admin/products/add-product');
};

async function submitNewProduct(req, res, next) {
    const product = new Product({
        ...req.body,
        image: req.file.filename
    });

    try {
        await product.addProduct();
    } catch (error) {
        next(error);
        return;
    }
    res.redirect('/admin/products');
};

async function viewSingleProduct(req, res) {
    const productId = req.params.id;
    const product = await Product.getSingleProduct(productId);
    res.render('admin/products/product-detail', { product: product });
};

async function getModifyProduct(req, res) {
    const productId = req.params.id;
    const product = await Product.getSingleProduct(productId);
    console.log(product)
    res.render('admin/products/modify-product', { product: product });
};

async function submitModifiedProduct(req, res, next) {
    const product = new Product({
        ...req.body,
        // Needs to be _id as _id is parameter looked for in productData in product model
        _id: req.params.id
    });

    if (req.file) {
        // Update old image data with new image data
        await product.updateImageData(req.file.filename);
    }

    try {
        await product.updateProduct();
    } catch(error) {
        next(error);
        return;
    }
    res.redirect('/admin/products');
};

// Delete product in the database done with AJAX
async function deleteProduct(req, res, next) {
    let product;
    const productId = String(req.params.id);
    try {
        product = await Product.getSingleProduct(productId);
        await product.deleteProduct();
    } catch(error) {
        next(error);
        return;
    }

    // Don't redirect to new page, to stay on current page with AJAX requests
    res.json({ message: 'Deleted product!' });
};

module.exports = {
    viewAllProducts: viewAllProducts,
    createNewProduct: createNewProduct,
    submitNewProduct: submitNewProduct,
    viewSingleProduct: viewSingleProduct,
    getModifyProduct: getModifyProduct,
    submitModifiedProduct: submitModifiedProduct,
    deleteProduct: deleteProduct
};