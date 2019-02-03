//to use: var nsw_errors = require("./errors");
var fs = require("fs");
var util = require("util");
module.exports.handle = function (error, fullpath) {
  if (error.code == "EISDIR") {
      if (!util.types.isNativeError(fs.readFileSync(fullpath+"/index.html"))) return fs.readFileSync(fullpath+"/index.html");
      else if (!util.types.isNativeError(fs.readFileSync(fullpath+"/index.htm"))) return fs.readFileSync(fullpath+"/index.htm");
      else if (!util.types.isNativeError(fs.readFileSync(fullpath+"/default.html"))) return fs.readFileSync(fullpath+"/default.html");
      else if (!util.types.isNativeError(fs.readFileSync(fullpath+"/default.htm"))) return fs.readFileSync(fullpath+"/default.htm");
      else if (!util.types.isNativeError(fs.readFileSync(fullpath+"/.index.js"))) return include("./.index.js");
      else if (!util.types.isNativeError(fs.readFileSync(fullpath+"/.index.js.js"))) return include("./.index.js.js");
      else {
      let dir = fs.readdirSync(fullpath);
      let out = "<title>Directory index</title><h1>Directory index</h1><hr /><ul>";
      dir.forEach(function(dirent){
        out += "<li><a href="+dirent+">"+dirent+"</a></li>"
      });
      out += `</ul><hr /><center>NodeSnapWeb (NSW); Running on ${process.arch} ${process.platform}; Node version ${process.version}; <br />
      Error code: EISDIR</center>`;
      return out;
    }}
    else if (error.code == "ENOENT") {
        return `<title>404 Not Found</title><h2>404 Not Found</h2><hr />
        The file or directory you requested could not be found. Please check the URL or try another name.
        <hr /><center>NodeSnapWeb (NSW); Running on ${process.arch} ${process.platform}; Node version ${process.version}; <br />
        Error code: ${error.errorCode}</center>`;
    }
    else if (error.code == "EPERM") {
        return `<title>401 Unauthorized</title><h2>401 Unauthorized</h2><hr />
        You were not granted access to the page you were trying to get to.
        <hr /><center>NodeSnapWeb (NSW); Running on ${process.arch} ${process.platform}; Node version ${process.version}; <br />
        Error code: ${error.errorCode}</center>`;
    }
}
