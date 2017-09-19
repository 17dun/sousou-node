/**
 * @file user.js
 * @desc 用户模型
 * @author xiaoguang01
 * @date 2016/3/7
 */
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = require('../../conf').db;
var ObjectId =  require('mongodb').ObjectID;
module.exports = {
        //插入数据
    save: function(data){
        return new Promise(function (resovel, reject) {
            MongoClient.connect(DB_CONN_STR, function(err, db){
                var collection = db.collection('user');
                if(data._id){
                    data._id = ObjectId(data._id);
                }else{
                    delete data._id;
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


    updateInfo: function(name,set){
        return new Promise(function (resovel, reject) {
            MongoClient.connect(DB_CONN_STR, function(err, db){
                var collection = db.collection('user');
                console.log([{username:name},{$set:set}])
                collection.updateOne({username:name},{$set:set},function(err, rt){
                    console.log('okokokokokok')
                    var result = {
                        code: 0,
                        msg: '',
                        data: null
                    };
                    if(err){
                        reject(err);
                    }else{
                        resovel(result);
                    }
                });
            });
        });

    },

    del: function(data){
        return new Promise(function (resovel, reject) {
            MongoClient.connect(DB_CONN_STR, function(err, db){
                var collection = db.collection('user');
                console.log(data);
                var whereStr = {
                    _id : ObjectId(data.id)
                }
                collection.remove(whereStr, function(err, rt){
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

    list: function(){
        return new Promise(function (resovel, reject) {
            MongoClient.connect(DB_CONN_STR, function(err, db){
                var collection = db.collection('user');
                collection.find({}).toArray(function(err, rt){
                    var result = {
                        code: 0,
                        msg: '',
                        data: null
                    };
                    if(err){
                        console.log(err);
                        reject(err);
                    }else{
                         rt.forEach(function(item, i){
                            if(!item.currentWeight){
                                rt[i].currentWeight = rt[i].initWeight;
                            }
                        });
                        result.data = rt;
                        resovel(result);
                    }
                });
            });
        });
    },


    listby: function(){
        return new Promise(function (resovel, reject) {
            MongoClient.connect(DB_CONN_STR, function(err, db){
                var collection = db.collection('user');
                collection.find({}).toArray(function(err, rt){
                    var result = {
                        code: 0,
                        msg: '',
                        data: null
                    };
                    if(err){
                        console.log(err);
                        reject(err);
                    }else{
                        rt.forEach(function(item, i){
                            if(!item.currentWeight){
                                rt[i].currentWeight = rt[i].initWeight;
                            }
                        });
                        result.data = rt;
                        resovel(result);
                    }
                });
            });
        });
    },

    getUser: function(uid){
        return new Promise(function (resovel, reject) {
            MongoClient.connect(DB_CONN_STR, function(err, db){
                var collection = db.collection('user');
                var whereStr = {_id:ObjectId(uid)}
                collection.find(whereStr).toArray(function(err, rt){
                    var result = {
                        code: 0,
                        msg: '',
                        data: null
                    };
                    if(err){
                        console.log(err);
                        reject(err);
                    }else{
                        result.data = rt;
                        resovel(result);
                    }
                });
            });
        });
    },

    getByName: function(name){
        return new Promise(function (resovel, reject) {
            MongoClient.connect(DB_CONN_STR, function(err, db){
                var collection = db.collection('user');
                var whereStr = {username:name}
                collection.find(whereStr).toArray(function(err, rt){
                    var result = {
                        code: 0,
                        msg: '',
                        data: null
                    };
                    if(err){
                        reject(err);
                    }else{
                        rt.forEach(function(item,i){
                            delete rt[i].pass;
                        })
                        result.data = rt;
                        resovel(result);
                    }
                });
            });
        });
    },

    login: function(data){
        return new Promise(function (resovel, reject) {
            MongoClient.connect(DB_CONN_STR, function(err, db){
                var collection = db.collection('user');
                var whereStr = {account:data.account,password:data.password}
                collection.find(whereStr).toArray(function(err, rt){
                    var result = {
                        code: 0,
                        msg: '',
                        data: null
                    };
                    if(err){
                        console.log(err);
                        reject(err);
                    }else{
                        result.data = rt;
                        resovel(result);
                    }
                });
            });
        });
    }

}
