const path = require('node:path');

const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

// Disk-storage setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images/uploads');
    },
    filename: (req, file, cb) => {
        const uniqueFileName = uuidv4() + path.extname(file.originalname);
        cb(null, uniqueFileName);
    }
});

const upload = multer({ storage });

module.exports = upload;