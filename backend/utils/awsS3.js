

// const {accessKeyId, secretAccessKey, region} = require(
//   './awsCredentials.json')


const AWS = require("aws-sdk");
const multer = require("multer");
// name of your bucket here
const NAME_OF_BUCKET = "aa-j1-project-bucket";
const s3 = new AWS.S3({ apiVersion: "2006-03-01"});


// AWS.config.update({region,
//                   credentials: {
//                     // awsAccessKeyId: accessKeyId,
//                     // awsSecretAccessKey: secretAccessKey
//                     awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
//                     awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
//                   }});

// AWS.config.loadFromPath('./awsCredentials.json');

//console.log("fun", AWS.config)



// console.log('process.env', process.env.AWS_ACCESS_KEY_ID)
// console.log('process.env', process.env.SCHEMA)

// //trying direct from AWS website
// //https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-creating-buckets.html

//console.log("post-fun", AWS.config)

// const NAME_OF_BUCKET = "aws-s3-pern-demo";


//  make sure to set environment variables in production for:
//  AWS_ACCESS_KEY_ID
//  AWS_SECRET_ACCESS_KEY
//  and aws will automatically use those environment variables


//
// AWS.config.getCredentials(function(err) {
//   if (err) console.log('credentials error', err.stack);
//   // credentials not loaded
//   else {
//     console.log("Access key:", AWS.config.credentials.accessKeyId);
//   }
// });


// --------------------------- Public UPLOAD ------------------------

const singlePublicFileUpload = async (file) => {
  // const { originalname, mimetype, buffer } = await file;
  // const path = require("path"); doesn't work in webpack 5??? workaround for everything
  // name of the file in your S3 bucket will be the date in ms plus the extension name
  // const originalname = file.name;

  const { originalname, mimetype, buffer } = await file;
  const path = require("path");


  console.log("originalname?", originalname);
  console.log("file?", file)

  // const extension = originalname.substring(originalname.lastIndexOf('.'));

  //console.log("extension", extension)
  // const Key = new Date().getTime().toString() + originalname.substring(originalname.lastIndexOf('.'));
  const Key = new Date().getTime().toString() + path.extname(originalname);

  console.log("key", Key)


  const uploadParams = {

    // AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    // AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,

    Bucket: NAME_OF_BUCKET,
    Key,
    // Body: file,
    Body: buffer,
    ACL: "public-read",
  };
  const result = await s3.upload(uploadParams).promise();

  // save the name of the file in your bucket as the key in your database to retrieve for later
  return result.Location;
};

const multiplePublicFileUpload = async (files) => {
  return await Promise.all(
    files.map((file) => {
      return singlePublicFileUpload(file);
    })
  );
};

// --------------------------- Prviate UPLOAD ------------------------

const singlePrivateFileUpload = async (file) => {
  const { originalname, mimetype, buffer } = await file;
  // const path = require("path");
  // name of the file in your S3 bucket will be the date in ms plus the extension name
  // const Key = new Date().getTime().toString() + path.extname(originalname);
  const Key = new Date().getTime().toString() + originalname.substring(originalname.lastIndexOf('.'));


  const uploadParams = {
    Bucket: NAME_OF_BUCKET,
    Key,
    Body: buffer,
  };
  const result = await s3.upload(uploadParams).promise();

  // save the name of the file in your bucket as the key in your database to retrieve for later
  return result.Key;
};

const multiplePrivateFileUpload = async (files) => {
  return await Promise.all(
    files.map((file) => {
      return singlePrivateFileUpload(file);
    })
  );
};

const retrievePrivateFile = (key) => {
  let fileUrl;
  if (key) {
    fileUrl = s3.getSignedUrl("getObject", {
      Bucket: NAME_OF_BUCKET,
      Key: key,
    });
  }
  return fileUrl || key;
};

// --------------------------- Storage ------------------------

const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, "");
  },
});

const singleMulterUpload = (nameOfKey) =>
  multer({ storage: storage }).single(nameOfKey);
const multipleMulterUpload = (nameOfKey) =>
  multer({ storage: storage }).array(nameOfKey);

module.exports = {
  s3,
  singlePublicFileUpload,
  multiplePublicFileUpload,
  singlePrivateFileUpload,
  multiplePrivateFileUpload,
  retrievePrivateFile,
  singleMulterUpload,
  multipleMulterUpload,
};
