//Dependencies
const multer = require('multer');

//Storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/'); //callback
  },
  filename: function( req, file, cb){
    cb(null, new Date().toISOString()
      .replace(/:|\./g,'') + '-' + file.originalname);
  }
});

//Filters
const fileFilter = (req, file, cb) => {
  if(file.mimetype === "image/jpeg" || 
     file.mimetype ==='image/png'){
    cb(null, true);   //accept file
  } else {
    //Will need to display this later on in the front end
    cb(new Error('Not accepted file type'), false); //reject file
  }
}

//Use storage with multer
exports.upload = multer({
  storage: storage,
  limits: {
    filesize: 1024 * 1024 * 6 //only takes <6gb images
  },
  fileFilter: fileFilter
});
