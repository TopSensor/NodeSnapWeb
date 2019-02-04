//requires
var http = require("http");
var https = require("https");
var fs = require("fs");
var url = require("url");
var args = require("optimist").argv;
var nsw_errors = require("./mod/errors");

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
        response.end(nsw_errors.handle(err,fullpath));
      } else if (err.code == "EISDIR") {
        if (rqurl.pathname.charAt(rqurl.pathname.length - 1) != "/") {response.setHeader("Location",rqurl.pathname+"/");response.statusCode = 301;response.end()}
        else {
        response.statusCode = 200;
        response.end(nsw_errors.handle(err,fullpath));}
      } else if (err.code == "EPERM") {
        response.statusCode = 401;
        response.end(nsw_errors.handle(err,fullpath));
      }} else {
        response.statusCode = 200;
        response.end(data);
    }});})
};
if (cmd == "run") {
  include(args.file);
}
