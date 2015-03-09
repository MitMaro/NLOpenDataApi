var http = require('http');
var fs = require('fs');
var contentDisposition = require('content-disposition');
var winston = require('winston');

var OUTPUT_DIR = './data/';


var downloadFile = function(id) {
	
	if (id === 1000) {
		return;
	}

	var options = {
		method: 'GET',
		host: 'opendata.gov.nl.ca',
		port: 80,
		path: '/public/opendata/filedownload/?file-id=' + id
	};

	winston.info('Downloading path: %s', options.path);
	var req = http.request(options, function(response) {
		if (response.headers['content-disposition']) {
			var disposition = contentDisposition.parse(response.headers['content-disposition']);
		
			if (disposition.type !== 'attachment') {
				winston.warn('disposition.type was not attachment: %s', disposition.type);
			}
		
			if (!disposition.parameters.filename) {
				winston.trace('disposition.parameters.filename missing: %s');
			}
		
			var outputFilename = OUTPUT_DIR + id + '.' + disposition.parameters.filename;
		
			winston.info('Filename: %s', disposition.parameters.filename);
			winston.info('File written to: %s', outputFilename);
			response.pipe(fs.createWriteStream(outputFilename));
		}
		
		  downloadFile(id + 1);
	  }
	);
	req.end();
};

downloadFile(0);
