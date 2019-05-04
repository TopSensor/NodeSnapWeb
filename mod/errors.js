//to use: var nsw_errors = require("./mod/errors");
const fs = require("fs");
const md = require("./md.js");
const indices = ["index.html", "index.htm", "README.md", "readme.html", "readme.htm", "index.md", "default.html", "default.htm", "default.md"];
module.exports.handle = function (error, fullpath) {
  if (error.code == "EISDIR") {
    var indexdata = null;
    indices.some(function (inde) {
      try {
        let x = fs.readFileSync(fullpath + inde);
        if (inde.endsWith(".md")) { indexdata = md.amistad(x + ''); } else { indexdata = x; }
      } catch (e) { return false; }
    });
    if (indexdata === null) {
      let dir = fs.readdirSync(fullpath);
      let out = "<title>Directory index</title><h1>Directory index</h1><hr /><ul>";
      dir.forEach(function (dirent) {
        out += "<li><a href=" + dirent + ">" + dirent + "</a></li>"
      });
      out += `</ul><hr /><center>NodeSnapWeb (NSW); Running on ${process.arch} ${process.platform}; Node version ${process.version}; <br />
      Error code: 200/EISDIR</center>`;
      return out;
    }
    else {
      return indexdata;
    }
  }
  else if (error.code == "ENOENT") {
    /*return `<title>404 Not Found</title><h2>404 Not Found</h2>
        The file or directory you requested could not be found. Please check the URL or try another name.
        <hr /><center>NodeSnapWeb (NSW); Running on ${process.arch} ${process.platform}; Node version ${process.version}; <br />
        Error code: 404/ENOENT</center>`;*/
    return module.exports.parse(error,fullpath,{code: 404, name: "Not Found", desc: "The file or directory you requested could not be found. Please check the URL or try another name."})
  }
  else if (error.code == "EPERM") {
    /*return `<title>401 Unauthorized</title><h2>401 Unauthorized</h2>
        You were not granted access to the page you were trying to get to.
        <hr /><center>NodeSnapWeb (NSW); Running on ${process.arch} ${process.platform}; Node version ${process.version}; <br />
        Error code: 401/EPERM</center>`;*/
    return module.exports.parse(error,fullpath,{code: 401, name: "Unauthorized", desc: "You were not granted access to the page you were trying to get to."})
  }
  else {
    /*return `<title>500 Internal Server Error</title><h2>500 Internal Server Error</h2>
        <hr /><center>NodeSnapWeb (NSW); Running on ${process.arch} ${process.platform}; Node version ${process.version}; <br />
        Error code: 500/${error.code}</center>`;*/
    return module.exports.parse(error,fullpath,{code: 500, name: "Internal Server Error"})
  }
};

module.exports.parse = (error, fullpath, objerr) => {
  let datat = "";
  if (nswcfg.errors && nswcfg.errors[error.code]) {
    if (nswcfg.errors[error.code].startsWith("/")) datat = fs.readFileSync(nswcfg.errors[error.code]);
    else if ((error.code == "ENOENT") && (nswcfg.errors["404"]) && (nswcfg.errors["404"].startsWith("/"))) datat = fs.readFileSync(cfgroot + nswcfg.errors["404"]);
    else if ((error.code == "ENOENT") && (nswcfg.errors["404"])) datat = nswcfg.errors["404"];
    else if ((error.code == "EPERM") && (nswcfg.errors["401"]) && (nswcfg.errors["401"].startsWith("/"))) datat = fs.readFileSync(cfgroot + nswcfg.errors["401"]);
    else if ((error.code == "EPERM") && (nswcfg.errors["401"])) datat = nswcfg.errors["401"];
    else datat = nswcfg.errors[error.code];
    datat = datat.replaceAll("<!--%code-->",objerr.code.toString());
    datat = datat.replaceAll("<!--%name-->",objerr.name.toString());
    datat = datat.replaceAll("<!--%desc-->",objerr.desc.toString() || "");
    datat = datat.replaceAll("<!--%arch-->",process.arch.toString());
    datat = datat.replaceAll("<!--%plat-->",process.platform.toString());
    datat = datat.replaceAll("<!--%nver-->",process.version.toString());
    datat = datat.replaceAll("<!--%errc-->",error.code.toString());
    if (nswcfg.errors[error.code].endsWith(".md")
    || (error.code == "ENOENT" && nswcfg.errors["404"].endsWith(".md"))
    || (error.code == "EPERM" && nswcfg.errors["401"].endsWith(".md"))) datat = md.amistad(datat);
    return datat;
  } else if (nswcfg.errors && nswcfg.errors["base"]) {
    if (nswcfg.errors["base"].startsWith("/")) datat = fs.readFileSync(cfgroot + nswcfg.errors["base"]).toString();
    else datat = nswcfg.errors["base"];
    datat = datat.replaceAll("<!--%code-->",objerr.code.toString());
    datat = datat.replaceAll("<!--%name-->",objerr.name.toString());
    datat = datat.replaceAll("<!--%desc-->",objerr.desc.toString() || "");
    datat = datat.replaceAll("<!--%arch-->",process.arch.toString());
    datat = datat.replaceAll("<!--%plat-->",process.platform.toString());
    datat = datat.replaceAll("<!--%nver-->",process.version.toString());
    datat = datat.replaceAll("<!--%errc-->",error.code.toString());
    if (nswcfg.errors["base"].endsWith(".md")) datat = md.amistad(datat);
    return datat;
  } else {
    return `<title>${objerr.code} ${objerr.name}</title><h2>${objerr.code} ${objerr.name}</h2>
    ${objerr.desc || ""}
    <hr /><center>NodeSnapWeb (NSW); Running on ${process.arch} ${process.platform}; Node version ${process.version}; <br />
    Error code: ${objerr.code}/${error.code}</center>`
  }
}