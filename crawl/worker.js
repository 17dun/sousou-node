/**
 * @file user.js
 * @desc 用户模型
 * @author xiaoguang01
 * @date 2015/9/27
 */
var MongoClient = require('mongodb').MongoClient;
var ObjectId =  require('mongodb').ObjectID;
var fs = require('fs');
var http = require('http');
var spawn = require('child_process').spawn;
var shell = require('shelljs');

var dowload = require('./dowload');

var mongoStr = 'mongodb://localhost:27017/sousou';

var num = 0;

var taskId = 0;

var hasStop = 1;

//主链抓取
function run(option){
    taskId = genId();
    hasStop = 0;
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
            var worker = spawn('phantomjs', [__dirname+'/task.js', url]);
            worker.stdout.on('data', function (data) {
                parserPage(data.toString());
            });
            worker.on('close', function (code) {
                num++;
                console.log('has'+num);
                console.log('left'+urls.length);
                setTimeout(function(){startNew();},1000)
            });
        }else{
            if(!hasStop){
                hasStop = 1;
                console.log('执行完毕');
                download();

            }

        }
    }
}

//处理单个页面结果
function parserPage(data){
    var list = JSON.parse(data);
    list.forEach(function(item, i){
        var fileName = genId();
        //dowload.start(item.img,'images/'+fileName+'.jpg');
        item.fileName = fileName;
        addItem(item);
    });
}

function genId(){
    return (new Date()).getTime()+Math.floor(Math.random()*100000);
}


//单条数据写入临时文件
function addItem(obj){
    var wtData = JSON.stringify(obj) + '\n';
    fs.appendFileSync(taskId+'.data', wtData);
}

//根据临时文件执行图片下载任务,串行下载,下完一个再下另一个.
function download(){
    console.log('开始下载图片..');
    var data = fs.readFileSync(taskId+'.data')+'';
    var list = data.split('\n');
    function doNext(){
        var item =  JSON.parse(list.shift());
        dowload.start(item.img,'../client/src/images/'+item.fileName+'.jpg',function(){
            if(list.length>1){
                console.log('img left '+list.length)
                doNext();
            }else{
                console.log('下载图片完成..');
                importData();
            }
        });
    }
    doNext();
}

//导入临时文件的数据到数据库
function importData(){
    console.log('开始导入数据..');
    shell.exec('mongoimport -h 127.0.0.1 --port 27017 -d sousou -c food '+taskId+'.data');
    console.log('导入成功..');
}


run();

