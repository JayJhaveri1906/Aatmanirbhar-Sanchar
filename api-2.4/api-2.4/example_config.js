// Definitions

var webserver = {};
var api = {};

webserver.port = 3478;
webserver.host = '192.168.32.70';
webserver.splash = 'http://aatmanirbhar-sanchar.live'

api.fileUpload = true;
//api.maxSize = 15e6;
api.maxSize = 1e8;
// Module Exports
module.exports.webserver = webserver;
module.exports.api = api;
