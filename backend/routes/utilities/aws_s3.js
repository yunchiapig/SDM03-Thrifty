const { S3Client, DeleteObjectCommand}  = require("@aws-sdk/client-s3");
require('dotenv').config();

// Create an Amazon S3 service client object.
const s3Client = new S3Client({
    region: "ap-northeast-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// 刪除 S3 上的圖片
async function deleteImage(key){
  try {
    const data = await s3Client.send(new DeleteObjectCommand(
      { Bucket: process.env.AWS_BUCKET_NAME, Key: key }
    ));
    // console.log("Success. Object deleted.", data);
    return data; // For unit tests.
  } catch (err) {
    console.log("Error", err);
  }
};

module.exports =  { s3Client: s3Client, deleteImage };
