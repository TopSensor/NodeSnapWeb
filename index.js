//requires
var http = require("http");
var https = require("https");
var fs = require("fs");
var url = require("url");
var args = require("optimist").argv;

//declarations
var cmd = process.argv[2];

//config
var cfgport = (args.port ? args.port : 8080);
var cfgroot = (args.path ? args.path : "/var/www/html");

//action checks
if (cmd == "start") {
  //runs from /var/www/html
  var server = http.createServer();
  server.listen(cfgport);
  console.info("HTTP server created successfully at port "+cfgport+" with root dir "+cfgroot);
  server.on("request",function(request,response){
    let rqurl = url.parse(request.url);
    let fullpath = cfgroot + rqurl.pathname;
    console.log('User accessed ' + rqurl.pathname + "(" + fullpath + " on the system)");
    fs.readFile(fullpath, (err, data) => {
      if (err) {console.error(err);
      if (err.code == "ENOENT") { //404 Not Found
        response.statusCode = 404; 
        response.end("404 Not Found");
      } else {
        response.statusCode = 500;
        response.end("500 Internal Service Error (" + err.code + ')');
      }} else {
        response.statusCode = 200;
        response.end(data);
    }});})
};
if (cmd == "run") {
  include(args.file);
}
