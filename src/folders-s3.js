var uriParse = require('url');
var path = require('path');
var local = require('folders/src/folders-local.js');
var Fs = require('folders/src/fs');
//var FoldersAws = require('folders-aws');
var AWS = require('aws-sdk');

var FoldersS3 = function(prefix,options){
	
	console.log("FoldersS3");
	options = options || {};
	options.connectionString = options.connectionString || 'http://localhost:4568/';
	//options.silent = options.silent || true ;
	options.directory = options.directory || './bucket';
	options.fs = options.fs || new Fs(new local());
	this.prefix = prefix;
	this.client = null;
	
	// this is a feature to start a embedded aws s3 server, using for test/debug
	var enableEmbeddedServer = options.enableEmbeddedServer || true;
	if (enableEmbeddedServer){
		var conn = parseConnString(options.connectionString);
		conn.silent = options.silent;
		conn.directory = options.directory;
		conn.fs = options.fs;
		var Server = require('./embedded-s3-server');
		this.server = new Server(conn);
		this.server.start(options.backend);
		
    }
	
};

module.exports = FoldersS3;

FoldersS3.prototype.features = FoldersS3.features = {
	
	cat : true,
	ls : true,
	write : true,
	server : true
	
};

FoldersS3.prototype.prepare = function(){
	var self = this;
	// FIXME: connection is available to local s3 server only 
	var config = {
  		s3ForcePathStyle: true,
  		accessKeyId: 'ACCESS_KEY_ID',
  		secretAccessKey: 'SECRET_ACCESS_KEY',
  		endpoint: new AWS.Endpoint('http://localhost:4568'),
		
	};
	self.client = new AWS.S3(config);
	//self.client = new FoldersAws('prefix',config);
	//directly using aws sdk to access methods like createbucket which are not available
	// in folders.io folders-aws client
	//self.client2 = new AWS.S3(config);
};
	
FoldersS3.prototype.listObjects = function(bucket,pathPrefix,cb){
	
	var self = this;
	self.prepare();
	var result;


    self.client.listObjects({
        Bucket: bucket,
        Prefix: pathPrefix
    }, function (err, data) {


        if (err) {
            console.log("error occured in folders-s3 listObjects() ", err);
            return cb(err, null);

        } else {
            result = data.Contents;
            return cb(null, result);

        }
    });

};
	


FoldersS3.prototype.download = function(path,cb){
	var self = this;
	self.prepare();
	var params = {
        Bucket: 'bucket',
        /* required */

        Key: 'Key' /* required */
    };
	//self.client.getObject(path,cb);
	var f = self.client.getObject(params);
			
            var file = f.createReadStream();
            
            cb(null, {
                stream: file
                //size: data.ContentLength,
                //name: path.basename(key)
            });
   
};


FoldersS3.prototype.upload = function(path,data,cb){
	var self = this;
	self.prepare();
	
	var params = {
  		Key: 'Key',
  		Bucket: 'bucket',
  		Body: data
	};

	self.client.upload(params, function uploadCallback (err, data) {
  		console.log(err, data)
	});
};

/*
FoldersS3.prototype.mkdir = function(path,cb){
	var self = this;
	self.prepare();
	self.client.mkdir(path,cb);
	
};
/*
// FIXME : bucket creation is not supported in folders-aws so using official aws sdk 
FoldersS3.prototype.createTestBucket = function(bucket,cb){
	var self = this;
	var params = {
  		Bucket: bucket, /* required 
  
	};
	self.prepare();
	self.client2.createBucket(params, function(err, data) {
  		if (err){
			cb(err, err.stack);
		}// an error occurred
  		else  {   cb(null,data) 
		}// successful response
	});
};
*/
var parseConnString = function(connectionString){
	var uri = uriParse.parse(connectionString, true);
	var conn = {
		hostname : uri.hostname || uri.host,
		port : uri.port || 21
	};
	if (uri.auth) {
		var auth = uri.auth.split(":", 2);
		conn.user = auth[0];
		if (auth.length == 2) {
			conn.pass = auth[1];
		}
	}
	
	return conn;
};	