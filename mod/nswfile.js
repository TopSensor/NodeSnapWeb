//This mod will handle .nsw config files.
//NodeSnapWeb's .nsw files will be YAML formatted and documented on the Wiki.
const yml = require("js-yaml"); //this is a dependency of front-matter so it should be installed for that
const fs = require("fs");

module.exports = function() {
	let defaults =
	`site:
		name: null
	md:
		style: github
	listing: on
	indexes: on
	`
	let changes = "";
	try {changes = fs.readFileSync(cfgroot+"/.nsw");}
	catch(e) {
		try{changes = fs.readFileSync(cfgroot+"/nsw.cfg");} //if your fs doesn't allow hidden files
		catch(f) {changes = "";}
	}

	nswcfg = yml.safeLoad(defaults + changes);
}