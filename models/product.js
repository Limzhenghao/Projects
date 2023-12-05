const { ObjectId } = require('mongodb');
const db = require('../data/database');

class Product {
    constructor(productData) {
        this.name = productData.name;
        this.summary = productData.summary;
        this.price = +productData.price; // + converts price from string to number
        this.description = productData.description;
        this.image = productData.image; // Name of image file

        // Following 3 properties created dynamically using image file name
        this.updateImageData(this.image);
        if (productData._id) {
            this.id = productData._id.toString(); // converts id to pure string(no ObjectId included at the front)
        }
    }

    static async getAllProducts() {

        // Get back array of product objects
        const products = await db.getDb().collection('products').find().toArray();

        // Executed for every index in arrays (each product object)
        return products.map(function(productDocument) {

            // Transform each productDocument into objects based on Product class blueprint
            // Creates image path and image url and product id conversion for all products dynamically
            return new Product(productDocument);
        })
    }

    static async getSingleProduct(productId) {
        console.log(productId)
        const convertedProductId = new ObjectId(productId);
        console.log(convertedProductId)
        const product = await db.getDb().collection('products').findOne({ _id: convertedProductId });

        // Creates image path and image url and product id conversion for this product
        return new Product(product);
    }
    
    async updateProduct() {
        const productData = {
            name: this.name,
            summary: this.summary,
            price: this.price,
            description: this.description,
            image: this.image
        }

        const productId = new ObjectId(this.id);

            if (!this.image) {
                // Deletes image: this.image in productData so image value wont be undefined
                delete productData.image;
            }
    
            await db.getDb().collection('products').updateOne({ _id: productId }, {
                $set: productData
            });
    }

    async addProduct() {
        const productData = {
            name: this.name,
            summary: this.summary,
            price: this.price,
            description: this.description,

            // Not storing image path and url as it can be obtained dynamically
            image: this.image
        }

        await db.getDb().collection('products').insertOne(productData);
    }

    deleteProduct() {
        const productId = new ObjectId(this.id);
        // Remove product ourselves with promise given
        return db.getDb().collection('products').deleteOne({ _id: productId });
    }

    async updateImageData(imageFilename) {
        this.image = imageFilename;
        this.imagePath = `product-data/images/${this.image}`; // Image path
        this.imageUrl = `/products/assets/images/${this.image}`; // URL used in HTML code for requesting the image
    }
}

module.exports = Product;