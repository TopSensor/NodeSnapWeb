/**
 * This mod will handle .nsw config files. 
 * NodeSnapWeb's .nsw files will be YAML formatted and documented on the Wiki.
 */
const yml = require("js-yaml"); //this is a dependency of front-matter so it should be installed for that
const fs = require("fs");
const merge = require("lodash.merge");

/**
 * @description Sets the value of the NSW global `nswcfg`.
 * @param {boolean} is Is the NSW file being refreshed? If so, this function will not log its warnings about nsw.cfg.
 * Also when doing this, NSW may refresh other files in the background.
 */
module.exports = function(is) { 
	var is = is || false;
	var defaults = fs.readFileSync(process.cwd()+'/nswdefaults.yaml') + "";
	var changes = "";
	try {changes = fs.readFileSync(cfgroot+"/.nsw");}
	catch(e) {
		try{if (!is) console.warn("Using nsw.cfg exposes your website's settings to the Internet! It is recommended that you use a .nsw file if you can instead.");
			changes = fs.readFileSync(cfgroot+"/nsw.cfg");
			if (!is) console.warn("Used nsw.cfg")} //if your fs doesn't allow hidden files. nsw shows this, so use .nsw where you can
		catch(f) {changes = ""; if (!is) console.warn("No changes file " + f)}
	}

	let defyml = yml.safeLoad(defaults.toString());
	let chayml = yml.safeLoad(changes.toString().replace("\t","    "));
	//console.log(defyml);
	// for (prop in defyml) {
	// 	if (chayml.hasOwnProperty(prop)) {
	// 		nswcfg[prop] = chayml[prop];
	// 	} else {
	// 		nswcfg[prop] = defyml[prop];
	// 	}
	// };
	//global['nswcfg'] = {...global['nswcfg'], ...defyml, ...chayml};
	var defyml2 = JSON.parse(JSON.stringify(defyml));
	//console.debug(defyml2); console.debug(chayml);
	merge(defyml2,chayml);
	//console.debug(defyml2);
	global['nswcfg'] = defyml2;
}