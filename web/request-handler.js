var path = require('path');
var archive = require('../helpers/archive-helpers');
var static = require('node-static');
var client = new(static.Server)('./web/public');
var sites = new(static.Server)('./archives')
var fs = require('fs');
// require more modules/folders here!

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': 'text/html'
};

var requests = {
  'GET': function(req, res) {
    if(req.url === '/') {
      res.writeHead(200, defaultCorsHeaders);
    }

    req.addListener('end', function() {
      console.log(req.url);
      if (req.url === '/' || req.url === '/index.html') {
        client.serve(req, res);  
      } else {
        sites.serve(req, res);
      }
    }).resume();


    // res.end();
  },
  'POST': function(req, res) {
    requests.POST.buffer = '';
    req.on('data', function(data){
      requests.POST.buffer += data;
    });

    req.on('end', function(){
      // var bufferLength = requests.POST.buffer.length;
      // var url = requests.POST.buffer.slice(4)

      // if(archive.isUrlInList(url)) {
      //   if(archive.isUrlArchived(url)) {
      //     // res.setHeader('location', 'sites/' + url);
      //   } else {
      //     // res.setHeader('location', 'loading.html');
      //   }
      // } else {
      //   console.log('adding '+url+'to url list');
      //   archive.addUrlToList(url);
      //   // res.setHeader('location', 'loading.html');
      // }

      // //fileContents += '\n' + requests.POST.buffer.slice(4);
      // //fs.writeFile('../archives/sites.txt', fileContents, 'utf8');

      // // defaultCorsHeaders['Content-Length'] = '' + bufferLength;
      // res.writeHead(200, defaultCorsHeaders);
      res.writeHead(302, {location: '/loading.html'});
      // delete defaultCorsHeaders['Content-Length'];
      res.end();
    });



    // archive.addUrlToList();


  },
  'OPTIONS': function(req, res) {
    res.writeHead(200, defaultCorsHeaders);
    res.end();
  }
};



exports.handleRequest = function (req, res) {

  console.log("Serving request type " + req.method + " for url " + req.url);
  requests[req.method](req, res);
  //res.end(archive.paths.list);
};
