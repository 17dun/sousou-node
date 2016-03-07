/**
 * @file msg.js
 * @desc 信息模型
 * @author xiaoguang01
 * @date 2016/3/7
 */
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = require('../../conf').db;
var ObjectId =  require('mongodb').ObjectID;
module.exports = {
    //返回某一个用户收到的信息
    getList: function(uid){
        return new Promise(function (resovel, reject) {
            MongoClient.connect(DB_CONN_STR, function(err, db){
                var collection = db.collection('msg');
                collection.find({uid:uid}).toArray(function(err, rt){
                    if(err){
                        resovel({
                            code: 1,
                            msg: '查询失败',
                            data: err
                        });
                    }else{
                        resovel({
                            code: 0,
                            msg: '查询成功',
                            data: rt
                        });
                    }
                });
            });
        });
    },
    //新增消息
    add: function(data){
        return new Promise(function (resovel, reject) {
            MongoClient.connect(DB_CONN_STR, function(err, db){
                var collection = db.collection('msg');
                data.time = new Date();
                collection.save(data, function(err, rt){
                    if(err){
                        resovel({
                            code: 1,
                            msg: '操作失败',
                            data: err
                        });
                    }else{
                        resovel({
                            code: 0,
                            msg: '操作成功',
                            data: rt
                        });
                    }
                });
            });
        });
    },
    //删除消息
    del: function(mid){
        return new Promise(function (resovel, reject) {
            MongoClient.connect(DB_CONN_STR, function(err, db){
                var collection = db.collection('msg');
                collection.remove({_id:ObjectId(mid)}, function(err, rt){
                    if(err){
                        resovel({
                            code: 1,
                            msg: '操作失败'
                        });
                    }else{
                        resovel({
                            code: 0,
                            msg: '操作成功'
                        });
                    }
                });
            });
        });
    }

}
