var system = require('system');
var fs = require("fs");
var webpage = require('webpage');


var address = system.args[1];

var resultData = {
    code: -1,
    url: address,
    speed: 1,
    disturb: 1,
    flash: 1,
    vague: 1,
    jsErr: 1,
    hotmap: 1
};

var page = webpage.create();
page.settings['userAgent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4';
page.viewportSize = {
    width: 320,
    height: 480
};

page.onInitialized = function () {
    page.evaluate(function () {
        (function () {
            window.screen = {
                width: 320,
                height: 480
            };
        })();
    });
};

page.open(address, function(status){
    if(status !== 'success' && status !=='fail'){
        phantom.exit();
    }else{
        setTimeout(function(){
            var content = fs.read('app/test.js');
            if (page.injectJs('clientCore.js')) {
                var a = page.evaluateJavaScript(content);
            }
            page.render('haha.png');
            console.log(JSON.stringify(resultData));
            phantom.exit();
        },1000);
    }
})
