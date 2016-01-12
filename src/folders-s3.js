var uriParse = require('url');
var path = require('path');
var fs = require('fs');
var FoldersAws = require('folders-aws');
var AWS = require('aws-sdk');

var FoldersS3 = function(prefix,options){
	console.log("FoldersS3");
	options = options || {};
	options.connectionString = options.connectionString || 'http://localhost:4568/';
	//options.silent = options.silent || true ;
	options.directory = options.directory || './dir';
	this.prefix = prefix;
	this.client = null;
	
	// this is a feature to start a embedded aws s3 server, using for test/debug
	var enableEmbeddedServer = options.enableEmbeddedServer || true;
	if (enableEmbeddedServer){
		var conn = parseConnString(options.connectionString);
		conn.silent = options.silent;
		conn.directory = options.directory;
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
		service         : "S3",
    	region         : "us-west-2",
    	bucket          : "bucket1",
	};

	self.client = new FoldersAws('prefix',config);
	//directly using aws sdk to access methods like createbucket which are not available
	// in folders.io folders-aws client
	//self.client2 = new AWS.S3(config);
};
	
FoldersS3.prototype.ls = function(path,cb){
	
	var self = this;
	self.prepare();
	self.client.ls(path,cb);
	
};

FoldersS3.prototype.cat = function(path,cb){
	var self = this;
	self.prepare();
	self.client.cat(path,cb);
   
};

FoldersS3.prototype.write = function(path,data,cb){
	var self = this;
	self.prepare();
	self.client.write(path,data,cb);
};

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