//requires
var http = require("http");
var https = require("https");
var fs = require("fs");
var fsPromises = require("fs").promises;
var url = require("url");
var args = require("optimist").argv;
var nsw_errors = require("./mod/errors");
var _md = require("remarkable");
var mdfm = require("front-matter");
var mdx = [];

//declarations
var cmd = process.argv[2];

//markdown parser
var md = new _md();
var mdi;
for (mdi = 0; mdi < mdx.length; mdi++) {
  md.use(mdi[i]);
};


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
        if (fullpath.endsWith('.html')) {try {let fi = fs.readFileSync(fullpath.replace(/\.html$/,'.md'));response.end(amistad(fi.toString()))} catch(e) {response.end(nsw_errors.handle(e,fullpath))}}
        else response.end(nsw_errors.handle(err,fullpath));
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
        if (fullpath.endsWith('.md')) response.end(amistad(data.toString()));
        else response.end(data);
    }});})
};
if (cmd == "run") {
  include(args.file);
}

function amistad(data) {
  let out; let ssl = `<link rel='stylesheet' href="https://gistcdn.githack.com/bleonard252/3165615ff3d3c8275b33e5eed1841b0b/raw/9dfcafeb5f2373fdb38eef16a32e0d50d6524183/github.css" from-fm-default>`;
  // toc // let datus = mdx.toc.insert(data);
  let front = mdfm(data);
  data = data.replace(/^---[\s\S]*?---/g,'');
  let datae = md.render(data);
  if (front.attributes.style != undefined) ssl = `<link rel='stylesheet' href="https://gistcdn.githack.com/bleonard252/3165615ff3d3c8275b33e5eed1841b0b/raw/9dfcafeb5f2373fdb38eef16a32e0d50d6524183/${front.attributes.style}.css" from-fm-default>`;
  if (front.attributes.stylesheet != undefined) ssl = `<link rel='stylesheet' href="${front.attributes.stylesheet}" from-front-matter>`;
  out = datae;
  return `<!DOCTYPE HTML><head><link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.14.2/styles/default.min.css"><script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.14.2/highlight.min.js"></script><script>hljs.initHighlightingOnLoad();</script>
  <meta content="width=device-width,maximum-scale=1.0,initial-scale=1.0,minimum-scale=1.0,user-scalable=no" name="viewport"><title>${front.attributes.title || "Untitled"}</title>${ssl}</head><body>` + datae + `</body>`
}
module.exports.amistad = amistad;