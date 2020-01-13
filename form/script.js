var connection;
var outerkey; //derived outer key
var keypair;//outer keypair
var auth;//one-time authentication code
//var userID;
function startsocket(words){
	connection = new WebSocket('ws://18.216.231.197:17385');
	connection.onopen = function () {
		keypair = keygen();
		};
		connection.onmessage = function (e) {
			var msg = e.data;
			console.log("MSG: \n"+msg+"\n");
			outerkey = derive(keypair[0],msg);
			send(keypair[1]+':'+encrypt(words,outerkey));
		};
		connection.onclose = function(){
		}
	}
	connection.onerror = function(error){
		gebi('connectionstatus').innerHTML = "Connection Status: Unable To Connect To Server";
	}
}
function updateconnectionstat(){
	try{
		gebi('connectionstatus').innerHTML='Connection Status: '+['Attempting To Connect','Connected','Connecting','Disconnected'][connection.readyState];
	}catch(err){
		gebi('connectionstatus').innerHTML='Connection Status: Disconnected';
	}
}
function send(mode,msg){
	console.log("Sending:\n"+mode+':'+msg);
	if(connection.readyState==1){connection.send(mode+':'+msg);}
	else{console.log('Send Error: WebSocket Starting/Closing: Readystate='+connection.readyState);}
}
function time(){
	return new Date().getTime();
}