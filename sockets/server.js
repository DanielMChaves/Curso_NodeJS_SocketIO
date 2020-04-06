// **********************************************************************
//               Frameworks
// **********************************************************************

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// **********************************************************************
//               Variables Globales
// **********************************************************************

var log = "si";
var log_error = "si";

var port_server = 8080;
var print = "-----------------------------------------------";

// **********************************************************************
//               Colores
// **********************************************************************

var Reset = "\x1b[0m";
var Bright = "\x1b[1m";
var Dim = "\x1b[2m";
var Underscore = "\x1b[4m";
var Blink = "\x1b[5m";
var Reverse = "\x1b[7m";
var Hidden = "\x1b[8m";

// Fuente
var FgBlack = "\x1b[30m";
var FgRed = "\x1b[31m";
var FgGreen = "\x1b[32m";
var FgYellow = "\x1b[33m";
var FgBlue = "\x1b[34m";
var FgMagenta = "\x1b[35m";
var FgCyan = "\x1b[36m";
var FgWhite = "\x1b[37m";

// Background
var BgBlack = "\x1b[40m";
var BgRed = "\x1b[41m";
var BgGreen = "\x1b[42m";
var BgYellow = "\x1b[43m";
var BgBlue = "\x1b[44m";
var BgMagenta = "\x1b[45m";
var BgCyan = "\x1b[46m";

// **********************************************************************
//               Inicializar Servidor
// **********************************************************************

if(log == "si") console.log(print);
if(log == "si") console.log(FgGreen + "[SERVER INFO]" + Reset + " Run ChatLive");
if(log == "si") console.log(print);

const app = express();

const server = http.createServer(app);

server.listen(port_server);

if(log == "si") console.log(FgGreen + "[SERVER INFO]" + Reset + " Listening in " + port_server + " Port");
if(log == "si") console.log(print);

// **********************************************************************
//               Folders
// **********************************************************************

app.use(express.static('public'));

// **********************************************************************
//               Base de Datos del Servidor
// **********************************************************************

// socketID = userID
var UsersOnSocket = new Array();
// userID = {socketID1, socketID2}
var SocketsOnUser = new Array();

// **********************************************************************
//               Inicializar Socket.oi
// **********************************************************************

const io = socketIo.listen(server);

io.on('connect', function(socket){
	
	if(log == "si") console.log(FgGreen + "[SERVER INFO]" + Reset + " New connection ID: " + socket.id);
	if(log == "si") console.log(print);

	// Socket del Login
	socket.on('login_user', function(data){
		
		// Obtenemos los datos
		socketId = socket.id;
		userId = data.user;

		// Guardamos el valor data.user en la clave socket.id
		UsersOnSocket[socketId] = userId;

		if(SocketsOnUser[userId] == null){
			SocketsOnUser[userId] = new Array();
		}

		SocketsOnUser[userId].push(socketId);

		// Prints de Control
		if(log == "si") console.log(FgGreen + "[SERVER INFO]" + Reset + " New user connection: " + userId);
		if(log == "si") console.log(print);

		if(log == "si") console.log(FgGreen + "[SERVER INFO]" + Reset + " Users by Socket:");
		if(log == "si") console.log(UsersOnSocket);
		if(log == "si") console.log(print);

		if(log == "si") console.log(FgGreen + "[SERVER INFO]" + Reset + " Sockets by User:");
		if(log == "si") console.log(SocketsOnUser);
		if(log == "si") console.log(print);

		if(log == "si") console.log(FgGreen + "[SERVER INFO]" + Reset + " Total users:");
		if(log == "si") console.log(Object.keys(SocketsOnUser).length);
		if(log == "si") console.log(print);

		io.emit('login_user_response', {user: data.user})
	});

	// Socket de Enviar Mensaje
	socket.on('send_message', function(data){

		if(log == "si") console.log(FgGreen + "[SERVER INFO]" + Reset + " " + data.user + " ha enviado un mensaje");
		if(log == "si") console.log(print);

		toSend = data.toSend;

		if(toSend == null){
			io.emit('send_message_response', {message: data.message, user: data.user})
		}
		else{
			socketsUser = SocketsOnUser[toSend];

			// Enviamos el mensaje a todos sus sockets
			for(var i = 0; i < socketsUser.length; i++){
				io.to(socketsUser[i]).emit('send_message_response', {message: data.message, user: data.user})
			}

			io.to(socket.id).emit('send_message_response', {message: data.message, user: data.user})
		}
		
	});

	// Desconexion
	socket.on('disconnect', function(){

		// Obtenemos los datos
		socketId = socket.id;

		if(UsersOnSocket[socketId]){
			// Obtenemos el userId a traves del socketId
			userId = UsersOnSocket[socketId];

			// Borramos el registro de dicho socketId
			delete UsersOnSocket[socketId];
			
			// Borramos el socketId dentro de las conexiones del userId
			arrayIds = SocketsOnUser[userId];

			for(var i = 0; i < arrayIds.length; i++){
				if(arrayIds[i] == socketId)
					idToDelete = i;
			}

			SocketsOnUser[userId].splice(idToDelete,1);

			// Si no tiene más sockets, lo borramos
			if(SocketsOnUser[userId].length < 1)
				delete SocketsOnUser[userId];

			if(log == "si") console.log(FgGreen + "[SERVER INFO]" + Reset + " Lost user connection: " + userId);
			if(log == "si") console.log(print);
		}		

	});

});
