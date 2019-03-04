// "Hello world" server

// like include
var http  = require('http');
var static = require('node-static');
var url = require('url');
var fs = require('fs');

var file = new static.Server('./public');
var server = null;
var no = 0;
var imgList = [];

// like a callback
function handler (request, response) {
    var URL = request.url;

    var pathname = url.parse(request.url).pathname;

    console.log("New request " + URL + " from " + request.connection.remoteAddress);

    // request query
    if(/^\/query/.test(pathname)) {
    	URL = URL.replace("/","");
    	console.log(URL.split('?')[1].split('=')[0]);
    	console.log(URL.split('?')[1].split('=')[1]);
    	var imgNum = Number(URL.split('?')[1].split('=')[1]);
    	response.writeHead(200, {"Content-Type": "text/html"});
    	response.write("<h1>Hello!</h1>");
    	response.write("<p>You asked for <code>" + URL + "</code></p>");
    	response.write("<p>Path: " + pathname + "</p>");
    	response.write("<p>ImgURL: " + imgList[imgNum] + "</p>");
    	response.end();
    } else {
    	file.serve(request, response);
    }
}

function loadImageList() {
	var data = fs.readFileSync('photoList.json');
	if(!data) {
		console.log("cannot read photoList.json");
	} else {
		listObj = JSON.parse(data);
		imgList = listObj.photoURLs;
		console.log("photoList.json loaded");
	}
}

var server = http.createServer(handler);

loadImageList();


// fill in YOUR port number!
server.listen(59462);
console.log("Listening port: 59462");

