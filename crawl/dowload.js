var http = require('http');
var fs = require('fs');
module.exports={
    start: function(url, filename){
        var writestream = fs.createWriteStream('./'+filename);
        http.get(url, function (res) {
            res.pipe(writestream);
        });
        writestream.on('finish', function () {
            console.log('ok');
        });

    }
}