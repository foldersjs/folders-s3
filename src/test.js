/*
 * This file contains code for testing aws s3 test server 
 */
var Fs = require('folders/src/fs.js');
var local = require('folders/src/folders-local');
var FoldersS3 = require('./folders-s3');
//var file = fs.createReadStream('tyi.jpg');

var t = new Fs(new local());


//console.log(t);
var o = new FoldersS3("jjjj",{fs:t});

// listing a bucket from edded s3 s3rver 

		o.listObjects('bucket','',function(err,res){
		
			if (!err)
				console.log(res);
		});
	

// downloading a file from embeddeddded s3 s3rver 
/*
		o.download('Key',function(err,res){
		
			if (err)
				console.log(res);
			res.stream.pipe(process.stdout);
		});

*/
// uploading a file to embedded s3 s3rver 
/*
o.upload('key',file,function(err,res){

	if (!err){
	
		console.log(res);
	}
});
*/

