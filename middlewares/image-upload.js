const multer = require('multer');
const uuid = require('uuid').v4;

const upload = multer({

    storage: multer.diskStorage({

        // Configure where image files are stored
        destination: 'product-data/images',

        // Changes filename using callback function
        filename: function(req, file, cb) {

            // First value is potential error that may be faced, null if none
            // uuid generates unique id string
            cb(null, uuid() + '-' + file.originalname);
        }
    })
});

// Extract single file by 'image' fieldname from incoming request
// returns actual middleware function
const configuredMulterMiddleware = upload.single('image');

module.exports = configuredMulterMiddleware;