/*
 * This file contains code for testing aws s3 test server 
 */
var fs = require('fs')

var FoldersS3 = require('./folders-s3');

var o = new FoldersS3();

o.write('/path','some',function(err,res){
	
	if(err){
	
		console.log(err);
	}
	console.log(res);
});