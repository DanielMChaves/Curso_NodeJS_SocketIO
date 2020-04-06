// Conexion con el servidor
const socket = io.connect();

// Recibimos una respuesta del servidor
socket.on('login_user_response', function(data){
	alert("New user connection: " + data.user);
});

socket.on('send_message_response', function(data){
	$('#chat').append('<p><strong>' + data.user + ': </strong><br>' + data.message + '</p>');
});

// **********************************************************************
//               Funciones Auxiliares
// **********************************************************************

function login_socket(user, password){
	socket.emit('login_user', {user: user, password: password});
}

function send_message_socket(message, user, toSend = null){
	socket.emit('send_message', {message: message, user: user, toSend: toSend});
}