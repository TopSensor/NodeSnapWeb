//This mod will handle .nsw config files.
//NodeSnapWeb's .nsw files will be YAML formatted and documented on the Wiki.
const yml = require("js-yaml"); //this is a dependency of front-matter so it should be installed for that
const fs = require("fs");

module.exports = function() {
	let defaults = fs.readFileSync(process.cwd()+'/nswdefaults.yaml') + "";
	let changes = "";
	try {changes = fs.readFileSync(cfgroot+"/.nsw");}
	catch(e) {
		try{changes = fs.readFileSync(cfgroot+"/nsw.cfg");} //if your fs doesn't allow hidden files
		catch(f) {changes = "";}
	}

	let defyml = yml.safeLoad(defaults.toString());
	let chayml = yml.safeLoad(changes.toString());
	for (var prop of defyml) {
		if (chayml.hasOwnProperty(prop)) {
			nswcfg[prop] = chayml[prop];
		} else {
			nswcfg[prop] = defyml[prop];
		}
	};
}