var uriParse = require('url');
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
		console.log(conn);
		var S3rver = require('s3rver');
		this.client = new S3rver(conn).run(function (err, host, port) {
        if(err) {
         console.log(err);
        }
         console.log("aws s3 test server running at : "+ host+":"+port);
    });
		
	}
}
	
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