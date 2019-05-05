const fs = require("fs");
const NPM = require("npm");
module.exports = function () {
    var plugsdir = fs.readdirSync(process.cwd() + "/plugins");
    NPM.load({ loaded: false }, function () {
        for (plugdir of plugsdir) {
            plugdi = plugdir;
            plugdi = process.cwd() + "/plugins/" + plugdi;
            try {let me = require(plugdi)(); nswevents.emit("plugininstalled", plugdi, me);}
            catch(er){
                //console.error(er);
                NPM.commands.install([plugdi], function() {let me = require(plugdi)(); nswevents.emit("plugininstalled", plugdi, me)})
        }}
    })
}