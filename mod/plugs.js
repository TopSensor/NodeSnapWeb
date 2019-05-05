const fs = require("fs");
const NPM = require("npm");
module.exports = function () {
    var plugsdir = fs.readdirSync(process.cwd() + "/plugins");
    NPM.load({ loaded: false }, function () {
        for (plugdir of plugsdir) {
            let plugdi = plugdir;
            plugdi = process.cwd() + "/plugins/" + plugdi;
            try {let me = require(plugdi)(); nswevents.emit("plugininstalled", plugdi, me);}
            catch(er){
                //console.error(er);
                console.log("Installing deps for " + plugdi);
                NPM.commands.install([plugdi], function() {let me = require(plugdi)(); nswevents.emit("plugininstalled", plugdi, me)})
        }}
    })
}