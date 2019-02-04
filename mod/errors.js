//to use: var nsw_errors = require("./errors");
const fs = require("fs");
const fsPromises = require("fs").promises;
const util = require("util");
const indices = ["index.html", "index.htm", "index.md", "default.html", "default.htm", "default.md"];
module.exports.handle = function (error, fullpath) {
  if (error.code == "EISDIR") {
    let indexdata = null;
      indices.some(function(inde){
        let x = fs.readFileSync(fullpath+"/"+inde);
        indexdata = x;
        if (indexdata === null) {
          return false;
        } else {
          if (indexdata instanceof error) return false;
          else return true;
        }
      });
    if (indexdata === null) {
      let dir = fs.readdirSync(fullpath);
      let out = "<title>Directory index</title><h1>Directory index</h1><hr /><ul>";
      dir.forEach(function(dirent){
        out += "<li><a href="+dirent+">"+dirent+"</a></li>"
      });
      out += `</ul><hr /><center>NodeSnapWeb (NSW); Running on ${process.arch} ${process.platform}; Node version ${process.version}; <br />
      Error code: EISDIR</center>`;
      return out;}
    else {
      return indexdata;
    }}
    else if (error.code == "ENOENT") {
        return `<title>404 Not Found</title><h2>404 Not Found</h2>
        The file or directory you requested could not be found. Please check the URL or try another name.
        <hr /><center>NodeSnapWeb (NSW); Running on ${process.arch} ${process.platform}; Node version ${process.version}; <br />
        Error code: ENOENT</center>`;
    }
    else if (error.code == "EPERM") {
        return `<title>401 Unauthorized</title><h2>401 Unauthorized</h2>
        You were not granted access to the page you were trying to get to.
        <hr /><center>NodeSnapWeb (NSW); Running on ${process.arch} ${process.platform}; Node version ${process.version}; <br />
        Error code: EPERM</center>`;
    }
    else {
        return `<title>500 Internal Server Error</title><h2>500 Internal Server Error</h2>
        <hr /><center>NodeSnapWeb (NSW); Running on ${process.arch} ${process.platform}; Node version ${process.version}; <br />
        Error code: ${error.code}</center>`;
    }
}
