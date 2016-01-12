/*
 * This file contains code for testing aws s3 test server 
 */
var fs = require('fs')
var t = require('folders-aws');

var FoldersS3 = require('./folders-s3');

var o = new FoldersS3();

// listing a bucket from edded s3 s3rver 

		o.ls('/S3/us-west-2/bucket1/',function(err,res){
		
			if (!err)
				console.log(res);
		});
	

// downloading a file from embeddeddded s3 s3rver 

		o.cat('/S3/us-west-2/bucket1/',function(err,res){
		
			if (!err)
				console.log(res);
		});

// uploading a file to embedded s3 s3rver 

		o.write('/S3/us-west-2/bucket1/',require('fs').createReadStream('./tyu.jpg'),function(err,res){
		
			if (!err)
				console.log(res);
		});



