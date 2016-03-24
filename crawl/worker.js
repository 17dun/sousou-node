/**
 * @file user.js
 * @desc 用户模型
 * @author xiaoguang01
 * @date 2015/9/27
 */
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/owl';
var ObjectId =  require('mongodb').ObjectID;
var fs = require('fs');
var http = require('http');
var spawn = require('child_process').spawn;

var dowload = require('./dowload');

var mongoStr = 'mongodb://localhost:27017/sousou';
//主链抓取
function run(option){
    var baseurl = 'http://www.boohee.com/food/group/'
    var urls = [];
    for(var i=1;i<11;i++){
        for(var j=0;j<11;j++){
            var url = baseurl+i+'?page='+j;
            urls.push(url);
        }
    }

    for(var i=0; i<5; i++){
        startNew();
    }
    function startNew(){
        if(urls.length){
            var url = urls.shift();
            console.log(url);
            var worker = spawn('phantomjs', [__dirname+'/task.js', url]);
            worker.stdout.on('data', function (data) {
                parserPage(data.toString());
            });
            worker.on('close', function (code) {
                startNew();
            });
        }else{
            console.log('执行完毕');
        }
    }
}

//处理单个页面结果
function parserPage(data){
    var list = JSON.parse(data);
    list.forEach(function(item, i){
        var fileName = genId();
        dowload.start(item.img,'images/'+fileName+'.jpg');
        getDetail('http://www.boohee.com'+item.link);
        item.fileName = fileName;
        addItem(item);
    });
}

function genId(){
    return (new Date()).getTime()+Math.floor(Math.random()*100000);
}

//子链抓取
function getDetail(){

}

//单条数据入库
function addItem(){
    // MongoClient.connect(url, function(err, db) {
    //     var collection = db.collection('food');
    //     collection.insert(obj,function(err,rt){
    //         console.log('入库成功');
    //     })
    // });
}

//单条数据详情入库,可以以对象方式插入到同一个文档中
function addItemDetail(){

}




run();

