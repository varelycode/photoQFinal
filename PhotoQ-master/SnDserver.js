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
    	//console.log(URL.split('?')[1].split('=')[0]);
    	
    	var imgNum = Number(URL.split('?')[1].split('=')[1]);
    	if(imgNum < 0 || imgNum > 989) {
    		console.log("Error: image " + imgNum + " out of bound.");
    		response.writeHead(400, {"Content-Type": "text/plain"});
    		response.write("Bad Request\n");
    		response.end();
    	} else {
    		console.log("Client requests image num: " + imgNum);
    		response.writeHead(200, {"Content-Type": "text/plain"});
    		response.write("http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/" + imgList[imgNum]);
    		response.end();
    		console.log("ImageURL=http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/" + imgList[imgNum] +" sent" );
    	}
    }
    // show files in /public
    else {
        console.log("Request file: " + pathname);
        fs.exists("./public" + pathname, function (exist) {
            if(exist && pathname != "/") {
    	        file.serve(request, response);
                console.log("File ./public" + pathname + "served.");
            }

            else {
                response.writeHead(404, {"Content-Type": "text/html"});
                var data = fs.readFileSync("not-found.html","utf-8");
                response.write(data.toString());
                //response.write("<p>404 PAGE NOT FOUND.<p>");
                response.end();
                console.log("File ./public" + pathname + " not found.");
            }
        });
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

