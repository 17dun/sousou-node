/**
 * @file user.js
 * @desc 用户模型
 * @author xiaoguang01
 * @date 2015/9/27
 */
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/owl';
var ObjectId =  require('mongodb').ObjectID;
var spawn = require('child_process').spawn;
module.exports = {
    //插入数据
    saveTask: function(data){
        return new Promise(function (resovel, reject) {
            MongoClient.connect(DB_CONN_STR, function(err, db){
                var collection = db.collection('task');
                //设置默认状态值、最后执行时间,创建人
                data.lastRunTime = 0;
                data.createrName = 'xiaoguang01';
                data.taskState = 0;
                if(data._id){
                    data._id = ObjectId(data._id);
                }
                collection.save(data, function(err, rt){
                    var result = {
                        code: 0,
                        msg: '',
                        data: null
                    };
                    if(err){
                        reject(err);
                    }
                    if(rt.result.ok){
                        result.msg = '写入成功';
                    }else{
                        result.msg = '写入失败';
                        result.code = 1;
                    }
                    resovel(result);
                });
            });
        });
    },

    getList: function(queryData){
        return new Promise(function (resovel, reject) {
            MongoClient.connect(DB_CONN_STR, function(err, db){
                var collection = db.collection('task');
                var whereStr = {}
                if(queryData.taskName2!=''){
                    whereStr.taskName = new RegExp(queryData.taskName2);
                }
                if(queryData.createrName!=''){
                    whereStr.createrName = new RegExp(queryData.createrName);
                }
                if(queryData.taskState!=''){
                    whereStr.taskState = queryData.taskState*1;
                }
                console.log(whereStr);
                collection.find(whereStr).toArray(function(err, rt){
                    var result = {
                        code: 0,
                        msg: '',
                        data: null
                    };
                    if(err){
                        reject(err);
                    }else{
                        result.data = rt;
                        resovel(result);
                    }
                });
            });
        });
    },

    delTask: function(data){
        return new Promise(function (resovel, reject) {
            MongoClient.connect(DB_CONN_STR, function(err, db){
                var collection = db.collection('task');
                var whereStr = {_id:ObjectId(data.taskId)}
                collection.remove(whereStr, function(err, rt){
                    var result = {
                        code: 0,
                        msg: '',
                        data: null
                    };
                    if(err){
                        reject(err);
                    }else{
                        result.msg = '删除成功';
                        resovel(result);
                    }
                })
            });
        });
    },
    runTask: function(data){
        return new Promise(function (resovel, reject) {
            console.log(__dirname);
            var worker = spawn('phantomjs', [__dirname+'/../task.js']);
            worker.stdout.on('data', function (data) {
                console.log('有数据！');
                console.log(data.toString());
            });
            worker.stderr.on('data', function (data) {
                console.log('error!!!');
                console.log(data+'');
                reject(data+'');
            });
            worker.on('close', function (code) {
                resovel({msg:'执行完毕'});
            });
        });
    }
}
