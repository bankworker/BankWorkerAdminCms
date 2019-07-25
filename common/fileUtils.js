let fs = require("fs");

exports.deleteFile = function (filePath, callback) {
  // let fileName = req.query.fileName;
  // let filePath = './public/images/upload/' + fileName;

  fs.exists(filePath, function (exists) {
    if(exists){
      fs.unlink(filePath, function(err) {
        callback(err);
      });
    }
  });
};