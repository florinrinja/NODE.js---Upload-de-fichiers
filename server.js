const app = require('express')();
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.listen(8080, () => {
  console.log('server running on 8080');
})

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

var upload = multer({ storage: storage });

app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
  const file = req.file;
  if (file.size > 3145728) {
    const error = new Error('your file is too large, please upload a file smaller than 3 Mo')
    error.httpStatusCode = 400
    return next(error)
  }
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  res.send(file)
})

app.post('/uploadmultiple', upload.array('myFiles', 12), (req, res, next) => {
  const files = req.files;
  if (files.map(x => x.size).reduce((a, b) => a + b, 0) > 3145728) {
    const error = new Error('your file is too large, please upload a file smaller than 3 Mo')
    error.httpStatusCode = 400
    return next(error)
  }
  if (!files) {
    const error = new Error('Please choose files')
    error.httpStatusCode = 400
    return next(error)
  }
  res.send(files)
})