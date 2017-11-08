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

require('./food-3.js');

//主链抓取

//根据临时文件执行图片下载任务,串行下载,下完一个再下另一个.
function downloads(){
    console.log('开始下载图片..');
    var list = global.list;
    console.log(list.length);
    function doNext(){
        var item = list.shift();
        try{
            fileName = 'small-' + item.pic.split('/').pop();
            fileNameBig =  'big-' + item.bigpic.split('/').pop();
            item.fileName = fileName;
            item.fileNameBig = fileNameBig;
            dowload.start(item.pic,'../client/src/food/'+fileName,function(){
                 dowload.start(item.bigpic,'../client/src/food/'+fileNameBig,function(){
                        if(list.length>0){
                            console.log('data left '+list.length)
                            doNext();
                        }else{
                            console.log('下载图片完成..');
                        }
                 });
            });
        }catch(e){
            console.log(e);
            if(list.length>1){
                console.log('data left '+list.length)
                doNext();
            }else{
                console.log('下载图片完成..');
                //importData();
            }
        }

    }
    doNext();
}

//导入临时文件的数据到数据库
function importData(){
    console.log('开始导入数据..');
    shell.exec('mongoimport -h 127.0.0.1 --port 27017 -d sousou -c food food2.data');
    console.log('导入成功..');
}


downloads();

