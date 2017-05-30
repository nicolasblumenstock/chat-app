// console.log("sanity check")

var http = require("http");
var fs = require("fs");
var server = http.createServer((req,res)=>{
	console.log('someone connected via http')
})

server.listen(8080);
console.log("listening on 8080");