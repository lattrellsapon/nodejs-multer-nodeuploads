const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const { runInNewContext } = require('vm');

// Set storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

// Check file
const checkFileType = (file, cb) => {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  //   Check the Extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  //   Check mime type
  const mimetpye = filetypes.test(file.mimetype);

  if (mimetpye && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only');
  }
};

// Init Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single('myImage');

// Init app
const app = express();

// EJS
app.set('view engine', 'ejs');

// Public folder
app.use(express.static('./public'));

app.get('/', (req, res) => res.render('index'));

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.render('index', { msg: err });
    } else {
      if (req.file === undefined) {
        res.render('index', { msg: 'Error: No File Selected' });
      } else {
        res.render('index', {
          msg: 'File uploaded',
          file: `uploads/${req.file.filename}`,
        });
      }
    }
  });
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
