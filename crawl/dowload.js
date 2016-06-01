var http = require('http');
var fs = require('fs');
module.exports={
    start: function(url, filename, callback){
        var writestream = fs.createWriteStream('./'+filename);
        http.get(url, function (res) {
            res.pipe(writestream);
        });
        writestream.on('finish', function () {
            callback();
        });

    }
}