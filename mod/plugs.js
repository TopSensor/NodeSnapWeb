const fs = require("fs");
const NPM = require("npm");
module.exports = function () {
    NPM.load({ loaded: false }, function () {
    var plugsdir = fs.readdirSync(process.cwd() + "/plugins");
        for (plugdir of plugsdir) {
            let plugdi = plugdir;
            plugdi = process.cwd() + "/plugins/" + plugdi;
            try {let me = require(plugdi)(); nswevents.emit("plugininstalled", plugdi, me);}
            catch(er){
                //console.error(er);
                console.log("Installing deps for " + plugdi);
                try {
                    NPM.commands.install([plugdi], function() {let me = require(plugdi)(); nswevents.emit("plugininstalled", plugdi, me)})
                } catch(ex) {
                    console.error("Unhandled Exception caught in Plugins module of NodeSnapWeb", ex)
                }
        }}
    })
}