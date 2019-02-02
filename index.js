//requires
var http = require("http");
var https = require("https");
var fs = require("fs");
var url = require("url");

//declarations
var args = process.argv;
var cmd = process.argv[2];

//config
var cfgport = 80;
var cfgroot = "/var/www/html"

//action checks
if (args[2] == "start") {
  //runs from /var/www/html
  var server = http.createServer();
  console.info("HTTP server created successfully at port "+cfgport+" with root dir "+cfgroot);
  server.on("request",function(request,response){
    let rqurl = url.parse(request.url);
    let fullpath = cfgroot + rqurl.pathname;
    console.log('User accessed ' + rqurl.pathname + "(" + fullpath + " on the system)");
    fs.readFile(fullpath, (err, data) => {
      if (err) {console.error(err);
      if (err.code == "ENOENT") { //404 Not Found
        response.statusCode = 404; 
        response.end("404 Not Found")
      } else {
        response.statusCode = 500;
        response.end("500 Internal Service Error (" + err.code + ')')
      } else {
        response.statusCode = 200;
        response.end(data);
    }});
  }
}
