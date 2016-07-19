/**
 * @file record.js
 * @desc 历程模型
 * @author xiaoguang01
 * @date 2016/3/7
 */
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = require('../../conf').db;
var ObjectId =  require('mongodb').ObjectID;
module.exports = {
    list: function(data){

        var pageSize = data.pageSize*1 || 100;
        if(data.pageNum){
            from = (data.pageNum - 1) * data.pageSize;
        }else{
            from = 0;
        }

        return new Promise(function (resovel, reject) {
            MongoClient.connect(DB_CONN_STR, function(err, db){
                var collection = db.collection('record');
                collection.find().skip(from).limit(pageSize).toArray(function(err, rt){
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

    getHotInfo: function(data){
        return new Promise(function (resovel, reject) {
            MongoClient.connect(DB_CONN_STR, function(err, db){
                var collection = db.collection('record');
                var obj = {
                    user: data.user,
                    date: data.date
                }
                console.log(obj)
                collection.find(obj).toArray(function(err, rt){
                    if(err){
                        resovel({
                            code: 1,
                            msg: '数据库查询失败',
                            data: err
                        });
                    }else{

                        var hasHot = 0;
                        var speedHot = 0;
                        rt.forEach(function(item){
                            if(item.type=="food"){
                                hasHot += item.hot*1;
                            }else if(item.type=='sport'){
                                speedHot += item.hot*1;
                            }
                        });
                        resovel({
                            code: 0,
                            msg: '查询成功',
                            data: {
                                hasHot: hasHot,
                                speedHot: speedHot,
                                sportHot: 1000,
                                foodHot: 1000
                            }
                        });
                    }
                });
            });
        });
    },

    foodList: function(data){
        return new Promise(function (resovel, reject) {
            MongoClient.connect(DB_CONN_STR, function(err, db){
                var collection = db.collection('record');
                var obj = {
                    user: data.user,
                    date: data.date,
                    type: 'food'
                }
                collection.find(obj).toArray(function(err, rt){
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

    sportList: function(data){
        return new Promise(function (resovel, reject) {
            MongoClient.connect(DB_CONN_STR, function(err, db){
                var collection = db.collection('record');
                var obj = {
                    user: data.user,
                    date: data.date,
                    type: 'sport'
                }
                collection.find(obj).toArray(function(err, rt){
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
                var collection = db.collection('record');
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

    updateById: function(data){
        var self = this;
        return new Promise(function (resovel, reject) {
            MongoClient.connect(DB_CONN_STR, function(err, db){
                var collection = db.collection('record');
                console.log(data);
                var _id = ObjectId(data.recordId);
                var hot = data['hot'];
                var weight = data['weight'];
                collection.update({_id:_id},{$set:{value:weight,hot:hot}}, function(err, rt){
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

    //仅仅征对食物和运动的类型插入多条
    saveAll: function(data){
        return new Promise(function(resovel, reject){
            MongoClient.connect(DB_CONN_STR, function(err, db){
                var collection = db.collection('record');
                data.recordList.forEach(function(item){
                    console.log(item);
                    var obj = {
                        type: data.type,
                        date: data.date,
                        user: data.user,
                        unitHot: item.unitHot,
                        name: item.name,
                        value: item.weight,
                        file: item.file,
                        hot: item.hot
                    }
                    collection.save(obj, function(err,rt){
                        if(err){
                        resovel({
                            code: 1,
                            msg: '失败'
                        });
                    }else{
                        resovel({
                            code: 0,
                            msg: '成功'
                      
                        })
                    }
                })
            });
        });
        });
    },

    del: function(data){
        return new Promise(function (resovel, reject) {
            MongoClient.connect(DB_CONN_STR, function(err, db){
                var collection = db.collection('record');
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
                var collection = db.collection('record');
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

    //查询是否存在相同日期相同的图片
    getExsi: function(data){
        return new Promise(function (resovel, reject) {
            MongoClient.connect(DB_CONN_STR, function(err, db) {
                var collection = db.collection('record');
                collection.find({user:data.user,date:data.date}).toArray(function(err, rt){
                    if(err||rt.length<1){
                        resovel({code:0});
                    }else{
                        resovel({code:1,id:rt[0]._id});
                    }
                })
            });
        });
    },
}
