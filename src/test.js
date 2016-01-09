/*
 * This file contains code for testing aws s3 test server 
 */
var fs = require('fs')
var AWS = require('aws-sdk')

var config = {
  s3ForcePathStyle: true,
  accessKeyId: 'ACCESS_KEY_ID',
  secretAccessKey: 'SECRET_ACCESS_KEY',
  endpoint: new AWS.Endpoint('http://localhost:4568')
}

var client = new AWS.S3(config)

var params = {
  Key: 'Key',
  Bucket: 'Bucket',
  Body: fs.createReadStream('./tyu.jpg')
}

client.upload(params, function uploadCallback (err, data) {
  console.log(err, data)
})