/**
 * @file food.js
 * @desc 用户模型
 * @author xiaoguang01
 * @date 2016/3/7
 */
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = require('../../conf').db;
var ObjectId =  require('mongodb').ObjectID;
module.exports = {
    list: function(data){

        var pageSize = data.pageSize*1 || 10;
        if(data.pageNum){
            from = (data.pageNum - 1) * data.pageSize;
        }else{
            from = 0;
        }

        return new Promise(function (resovel, reject) {
            MongoClient.connect(DB_CONN_STR, function(err, db){
                var collection = db.collection('sport');
                collection.find().skip(from).limit(pageSize).sort({_id:-1}).toArray(function(err, rt){
                    if(err){
                        resovel({
                            code: 1,
                            msg: '数据库查询失败',
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
    save: function(data){
        var self = this;
        return new Promise(function (resovel, reject) {
            MongoClient.connect(DB_CONN_STR, function(err, db){
                var collection = db.collection('sport');
                if(data._id){
                    //保存已有的
                    data._id = ObjectId(data._id);
                }else{
                    data.status = 0;
                    data.taskNum = 0;
                    delete data._id;
                }

                collection.save(data, function(err, rt){
                    if(err){
                        resovel({
                            code: 1,
                            msg: '失败'
                        });
                    }else{
                        resovel({
                            code: 0,
                            msg: '成功'
                        });
                    }
                });
            });
        });
    },
    del: function(data){
        return new Promise(function (resovel, reject) {
            MongoClient.connect(DB_CONN_STR, function(err, db){
                var collection = db.collection('sport');
                var whereStr = {_id:ObjectId(data.id)}
                collection.remove(whereStr, function(err, rt){
                    if(err){
                        resovel({
                            code: 1,
                            msg: '失败'
                        });
                    }else{
                        resovel({
                            code: 0,
                            msg: '成功'
                        });
                    }
                })
            });
        });
    },

    delall: function(data){
        return new Promise(function (resovel, reject) {
            MongoClient.connect(DB_CONN_STR, function(err, db){
                var collection = db.collection('sport');
                var num = 0;
                if(!data.ids||!data.ids.length){
                    resovel({
                        code: 1,
                        msg: '失败'
                    });
                    return;
                }
                data.ids.forEach(function(item){
                    var whereStr = {_id:ObjectId(item)}
                    collection.remove(whereStr, function(err, rt){
                        if(err){
                            resovel({
                                code: 1,
                                msg: '失败'
                            });
                        }else{
                            num++;
                            if(num==data.ids.length){
                                resovel({
                                    code: 0,
                                    msg: '成功'
                                });
                            }
                        }
                    });
                });
            });
        });
    },
    detail: function(fid){
        return new Promise(function (resovel, reject) {
            MongoClient.connect(DB_CONN_STR, function(err, db){
                var collection = db.collection('sport');
                var whereStr = {_id:ObjectId(fid)}
                collection.find(whereStr).toArray(function(err, rt){
                    if(err){
                        resovel({
                            code: 1,
                            msg: '数据库查询失败',
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
    }
}
