var connection;
var outerkey; //derived outer key
var keypair;//outer keypair
var auth;//one-time authentication code, currently unused
var words;//To be sent
hideerror();
function submit(){
  if(gebi('message').value.length==0){
    error1();
  }else{
    words=b64enc(gebi('message').value)+':'+b64enc(gebi('name').value)+':';
    words+=b64enc(gebi('email').value)+':'+b64enc(richtime());
    sendmessage();
  }
}
function sendmessage(){
	connection = new WebSocket('wss://18.216.231.197:17385');
}
connection.onopen = function () {
  keypair = keygen();
};
connection.onmessage = function (e) {
  var msg = e.data;
  console.log("MSG: \n"+msg+"\n");
  outerkey = derive(keypair[0],msg);
  send(b64dec(keypair[1]+':'+encrypt(words,outerkey)));
};
connection.onclose = function(){
  console.log("")
}
connection.onerror = function(error){
  console.log("Connection Status: Unable To Connect To Server");
  error2();
}
function send(msg){
	console.log("Sending:\n"+mode+':'+msg);
	if(connection.readyState==1){connection.send(mode+':'+msg);}
	else{console.log('Send Error: WebSocket Starting/Closing: Readystate='+connection.readyState);error2();}
}
function time(){
	return new Date().getTime();
}
function richtime(){
  return (new Date().toString());
}
function gebi(id){
	return document.getElementById(id);
}
function error1(){
	gebi("error").style.display = 'block';
  gebi("error").innerHTML = 'Unable To Submit Message: No Message Was Typed';
}
function error2(){
	gebi("error").style.display = 'block';
  gebi("error").innerHTML = 'Unable To Submit Message Due To Server Error';
}
function hideerror(){
	gebi("error").style.display = 'none';
}
function submit(){
  gebi("submitted").innerHTML = "Submitted";
}