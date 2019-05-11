//requires
var http = require("http");
//var https = require("https");
var fs = require("fs");
var fsPromises = require("fs").promises;
var url = require("url");
var args = require("optimist").argv;
var nsw_errors = require("./mod/errors");
var md = require("./mod/md");
var mime = require("mime-types");
var plugz = require("./mod/plugs")();
var aboutpg = require("./mod/about")
const EventEmitter = require('events');
String.prototype.replaceAll = function(search, replacement) {
	var target = this;
	return target.split(search).join(replacement);
};

//declarations
var cmd = process.argv[2];

process.on('uncaughtException', (exception, oog) => {
	console.error("%cUnhandled Exception caught in NodeSnapWeb", "color:red");
	console.error("%c"+exception.stack.toString(), "color:amber");
	debugger;
})

//config
global['cfgport'] = (args.port ? args.port : 8080);
	// fallback chain: --port > 8080
global['cfgroot'] = (args.path ? args.path : (process.env.SNAP_USER_DATA ? process.env.SNAP_USER_DATA : "/var/www/html"));
	// fallback chain: --path > snap user data folder > /var/www/html
global['nswcfg'] = {}; require("./mod/nswfile")(); //set config

// Activate event listener
global["nswevents"] = new EventEmitter();
nswevents.on('error', (exception, oog) => {
	console.error("%cUnhandled Exception caught in NodeSnapWeb during an %cEvent", "color:red", "color:blue", "%c"+exception.stack.toString(), "color:amber");
	debugger;
	stop();
})

//action checks
if (cmd == "start") {
	//runs from /var/www/html
	var server = http.createServer();
	server.listen(cfgport);
	console.info("HTTP server created successfully at port " + cfgport + " with root dir " + cfgroot);
	server.on("request", function (request, response) {
		response.setHeader("Server", "NodeSnapWeb/pre0.2");
		let rqurl = url.parse("http://"+request.headers.host+request.url);
		let fullpath = cfgroot + rqurl.pathname;
		//Object.defineProperty(fullpath, "non", {value:rqurl, readonly:true});
		console.debug('User accessed ' + rqurl.pathname + " (" + fullpath + " on the system)");
		console.debug(rqurl);
		let nswrefresh = new Promise((resolve, reject) => {require("./mod/nswfile")(true);resolve()}).then(console.log('NSW refreshed!'));
		let hiddens = ["/.nsw", "/nsw.cfg", "/nsw-iso", "/."];
		//console.debug(hiddens.filter((value) => rqurl.pathname.toString().includes(value)))
		if ((request.url.includes("/.") || request.url.startsWith("/nsw-iso")) 
			&& !request.url.startsWith("/.well-known")) { //blocks all dotfiles except .well-known in the root
			if (request.url == "/.nsw" || request.url == "/.nsw/") {
					response.setHeader("Content-Type", "text/html");
					//response.statusCode = 503;
					//response.end(/*Temporary, remove when about page implemented:*/ nsw_errors.parse({code: "NSWABOUT"},null,{code: 503, name: "Maintenance", desc: "NodeSnapWeb About page coming soon!"}))
					response.statusCode = 200;
					response.end(aboutpg.doGet({request: request}));
				} //Non-overrideable NSW about page.
				//TODO: add about page and use it above
		else {nswevents.emit("requesterror", new Error("Permission denied; dotfile or illegal user access detected").code = "EPERM", request, response); response.statusCode = 401; response.end(nsw_errors.handle({ code: "EPERM" }, fullpath));}
		} else fs.readFile(fullpath, (err, data) => {
			if (err) {
				nswevents.emit("requesterror",err,request,response);
				if (err.code == "ENOENT") { //404 Not Found
					response.statusCode = 404;
					if (fullpath.endsWith('.html')) { try { let fi = fs.readFileSync(fullpath.replace(/\.html$/, '.md')); response.end(md.amistad(fi.toString())) } catch (e) { response.end(nsw_errors.handle(e, fullpath)) } }
					else response.end(nsw_errors.handle(err, fullpath));
				} else if (err.code == "EISDIR") {
					if (rqurl.pathname.charAt(rqurl.pathname.length - 1) != "/") { response.setHeader("Location", rqurl.pathname + "/"); response.statusCode = 301; response.end() }
					else {
						response.statusCode = 200;
						response.end(nsw_errors.handle(err, fullpath));
					}
				} else if (err.code == "EPERM") {
					response.statusCode = 401;
					response.end(nsw_errors.handle(err, fullpath));
				} else {
					console.error(err);
					nswevents.emit("unhandledrequesterror",err,request,response);
				}
				response.end();
			} else {
				response.statusCode = 200;
				if (fullpath.endsWith('.md')) {
					nswevents.emit("mdrequest", request, response);
					response.setHeader('Content-Type', 'text/html');
					response.end(md.amistad(data.toString()));}
				else {
					nswevents.emit("request", request, response);
					response.setHeader('Content-Type', mime.lookup(fullpath) || "*/*");
					response.end(data);
				}
			}
		});
	})
};
if (cmd == "run") {
	include(args.file);
}