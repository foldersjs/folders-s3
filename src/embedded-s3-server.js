var S3rver = require('s3rver');

/*
 * consturctor with the ssh credentials @param credentials ,example { host :
 * "localhost", port : 3333, user : "test", pass : "123456" }; @param debug, the
 * debug function, example console.log('dEbug', a);
 * 
 */
var Server = function ( conn, debug ) {
  this.S3Conn = conn;
  this.debug = debug || true;
  this.s3Server = null;	
  console.log( "[S3 Server] : inin the S3 Server,");
};

module.exports = Server ;

// close the server
Server.prototype.close = function () {
  if ( this.s3Server != null ) {
    // no function provided to close the s3erver
  }
};

Server.prototype.start = function(backend){
	var self = this;
	this.s3Server = new S3rver(self.S3Conn).run(function (err, host, port) {
        if(err) {
         console.log(err);
        }
         console.log("aws s3 test server running at : "+ host+":"+port);
    });
};
