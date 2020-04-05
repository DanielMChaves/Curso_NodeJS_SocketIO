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
//               Inicializar Socket.oi
// **********************************************************************

const io = socketIo.listen(server);

io.on('connect', function(socket){
	
	if(log == "si") console.log(FgGreen + "[SERVER INFO]" + Reset + " New connection ID: " + socket.id);
	if(log == "si") console.log(print);

	// Socket del Login
	socket.on('login_user', function(data){
		if(log == "si") console.log(FgGreen + "[SERVER INFO]" + Reset + " New user connection: " + data.user);
		if(log == "si") console.log(print);
		io.emit('login_user_response', {user: data.user})
	});

	// Socket de Enviar Mensaje
	socket.on('send_message', function(data){
		if(log == "si") console.log(FgGreen + "[SERVER INFO]" + Reset + " " + data.user + " ha enviado un mensaje");
		if(log == "si") console.log(print);
		io.emit('send_message_response', {message: data.message, user: data.user})
	});

});
