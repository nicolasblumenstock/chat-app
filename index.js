// console.log("sanity check")

var http = require("http");
var fs = require("fs");

// include socket.io which was installed by npm. not part of core.

var socketio = require("socket.io");

var usersArray = [];
function userDel(name){
	var toDel = usersArray.indexOf(name);
	if (toDel >= 0){
		usersArray.slice(toDel,1);
	}
}




var server = http.createServer((req,res)=>{
	console.log('someone connected via http')
	if(req.url == '/'){
		fs.readFile('index.html', 'utf-8', (error,data)=>{
			// console.log(data);
			// console.log(error);
			if(error){
				res.writeHead(500,{'content-type':'text/html'});
				res.end('Internal Server Error');
			}else{
				res.writeHead(200,{'content-type':'text/html'});
				res.end(data);
			}
		});
	}else if(req.url == '/styles.css'){
		fs.readFile('styles.css', 'utf-8', (error,data)=>{
			// console.log(data);
			// console.log(error);
			if(error){
				res.writeHead(500,{'content-type':'text/html'});
				res.end('Internal Server Error');
			}else{
				res.writeHead(200,{'content-type':'text/css'});
				res.end(data);
			}
		});
	}else if(req.url == '/config.js'){
		fs.readFile('config.js', 'utf-8', (error,data)=>{
			// console.log(data);
			// console.log(error);
			if(error){
				res.writeHead(500,{'content-type':'text/html'});
				res.end('Internal Server Error');
			}else{
				res.writeHead(200,{'content-type':'application/javascript'});
				res.end(data);
			}
		});
	}

});

var io = socketio.listen(server);
// handle socket connections
io.sockets.on('connect', (socket)=>{
	console.log('someone connected via socket');
	socket.on('nameToServer', (data)=>{
		// console.log(name + ' just joined')
		var clientInfo = new Object();
		clientInfo.name = data;
		clientInfo.id = socket.id;
		usersArray.push(clientInfo);
		console.log(usersArray)
		io.sockets.emit('usersArray', usersArray);
	});
	socket.on('sendMessage', ()=>{
		console.log('someone clicked the button');
	});
	socket.on('messageToServer', (messageObject)=>{
		io.sockets.emit('messageToClient',`<b>${messageObject.name}</b> (${messageObject.day}):&nbsp;&nbsp;${messageObject.newMessage}`);
	});
	socket.on('disconnect', (data)=>{
		// console.log(data);
		for (let i = 0; i < usersArray.length; i++){
			var currentUser = usersArray[i];
			if (currentUser.id == socket.id){
				usersArray.pop(currentUser);
				break;
			}
		}
		console.log(usersArray)
		io.sockets.emit('userDisconnect',usersArray);
	})
});

server.listen(8080);
console.log("listening on 8080");