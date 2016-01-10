var uriParse = require('url');
var AWS = require('aws-sdk');
var path = require('path');
var fs = require('fs');

var FoldersS3 = function(prefix,options){
	console.log("FoldersS3");
	options = options || {};
	options.connectionString = options.connectionString || 'http://localhost:4568/';
	options.silent = options.silent || true ;
	options.directory = options.directory || '/tmp/s3rver_test_directory';
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
  		endpoint: new AWS.Endpoint('http://localhost:4568')
	};

	self.client = new AWS.S3(config);
};
	
FoldersS3.prototype.ls = function(path,cb){

	var result;
	var self = this;
	self.prepare();
    self.client.listObjects({
        Bucket: 'some bucket',
        Prefix: 'some prefix'
    }, function (err, data) {


        if (err) {
            console.log("error occured in folders-aws lsBucket() ", err);
            return cb(err, null);

        } else {
            result = data.Contents;
            return cb(null, result);

        }
    });
	
};

FoldersS3.prototype.cat = function(path,cb){
	var self = this;
	self.prepare();
	var params = {
        Bucket: 'some bucket',
        /* required */

        Key: 'some key' /* required */
    };
	
    // FIXME: See if we can get some info on the remote file, esp. length.
    // headObject / listObjects  works well enough usually.

	var f = self.client.getObject(params);
			
    var file = f.createReadStream();
            
    cb(null, {
                stream: file,
                size: 'some size',
                name: path.basename(key)
    });

         // successful response
   
	
};

FoldersS3.prototype.write = function(path,data,cb){
	var self = this;
	self.prepare();
	// for now uploading stub data only .path data will be ignored 
	var params = {
  		Key: 'Key',
 		Bucket: 'Bucket',
  		Body: fs.createReadStream('./tyu.jpg')
	};

	self.client.upload(params, function uploadCallback (err, data) {
  		console.log(err, data)
	});
};

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