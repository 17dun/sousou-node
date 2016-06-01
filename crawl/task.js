var system = require('system');
var fs = require("fs");
var webpage = require('webpage');


var page = webpage.create();
var url = system.args[1];

page.open(url, function(status){
    if(status !== 'success' && status !=='fail'){
        phantom.exit();
    }else{
        setTimeout(function(){
            if (page.injectJs('clientCore.js')) {
                var evalResult = page.evaluate(function(){
                    var rt = [];
                    var $foods = mobijs('.food-list .item');
                    console.log($foods.length);
                    for(var i=0;i<$foods.length;i++){
                        var $food = mobijs($foods[i]);
                        var link = $food.find('.img-box a').attr('href');
                        var img = $food.find('.img-box img').attr('src');
                        var name = $food.find('.text-box a').html();
                        var hot = $food.find('.text-box p').html();
                        rt.push({
                            foodName:name,
                            link:link,
                            img:img,
                            foodHot:hot
                        })
                    }
                    return rt;
                });
                console.log(JSON.stringify(evalResult));
            }
            phantom.exit();
        },1000);
    }
	
	setTimeout(function(){
		phantom.exit();
	},3000)
	
})
