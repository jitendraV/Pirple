/*
* This is main file for Hello World API
*/

//Dependencies
var http = require('http');
var url  = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

//The server should respond to all requests with a string
var server = http.createServer(function(req,res){
	
	//Get the URL and parse it
	var parsedURL = url.parse(req.url,true);

	//Get the path
	var path = parsedURL.pathname;
	var trimmedPath = path.replace(/^\/+|\/+$/g,'');

	//Get the query string as an object
	var queryStringObject = parsedURL.query;
	
	//Get the http method
	var method = req.method.toLowerCase();

	//Get the payload if any
	var decoder = new StringDecoder('utf-8');
	var buffer = '';

	req.on('data',function(data){
		buffer += decoder.write(data);
	});

	req.on('end',function(){
		buffer += decoder.end();

		//Choose the handler this request should go to. If it is not found then go to Not Found handler
		choosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
		
		data = {
			'trimmedPath' : trimmedPath,
			'queryStringObject' : queryStringObject,
			'method' : method,
			'payload' : buffer
		}

		//Route the request to the handler specified in the route
		choosenHandler(data, function(statusCode,payload){

			statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
			payload = typeof(payload) == 'object' ? payload : {};			
			
			//convert the payload to a string
			var payloadString = JSON.stringify(payload);

			//return the response
			res.setHeader('Content-Type','application/json')
			res.writeHead(statusCode);
			res.end(payloadString);

			//Log the request path
			console.log('Welcome message: ',statusCode,payloadString);
		});		

	});	
});

//Start the server, and hev it listen on port 3000
server.listen(3000,function(){
	console.log("Server is now listening to port 3000");
});

//Define the handlers
var handlers = {};

//Hello handler
handlers.hello = function(data,callback){
	callback(406,{'message' : 'This is my first assignment.'});
};

//Not found handler
handlers.notFound = function(data,callback){
	callback(404);
};

var router = {
	'hello' : handlers.hello
};