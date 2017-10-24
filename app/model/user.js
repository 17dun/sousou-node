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

        function getBaseHot(data){
            var age = 28;
            var result = 0;
            if(data&&data.sex){
                if(data.sex == 1){
                    //男生
                    result = 66 + data.initWeight * 13.7 + 5*175 - 6.8*age;
                }else{
                    //女生
                    result = 655 + data.initWeight * 9.6 + 1.7*155 - 4.7*age;
                }
            }
            return Math.floor(result);
        }

        return new Promise(function (resovel, reject) {
            if(!name){
                resovel({
                    code: 0,
                    msg: '',
                    data: null
                })
                return;
            }
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
                        var baseHot = getBaseHot(rt[0]);
                        result.data = rt;
                        result.data[0].baseHot = baseHot;
                        console.log(baseHot);
                        resovel(result);
                    }
                });
            });
        });
    },

    fgtPass: function(data){
        return new Promise(function (resovel, reject) {
            MongoClient.connect(DB_CONN_STR, function(err, db){
                var collection = db.collection('user');
                collection.find({username:data.name,email:data.email}).toArray(function(err, rt){
                    var result = {
                        code: 0,
                        msg: '',
                        data: null
                    };
                    if(err){
                        reject(err);
                    }else{
                        if(rt.length){
                            result.data = rt;
                        }else{
                            result.code = 1;
                        }
                        resovel(result);
                    }
                });
            });
        });
    },


    reg: function(data){
        return new Promise(function (resovel, reject) {
            MongoClient.connect(DB_CONN_STR, function(err, db){
                var collection = db.collection('user');
                
                collection.find({username:data.account}).toArray(function(err, rt){
                    var result = {
                        code: 0,
                        msg: '',
                        data: null
                    };
                    if(rt.length > 0){
                        result.code = 1;
                        result.msg = '用户名已存在';
                        resovel(result);
                    }else{
                        var whereStr = {username:data.account,pass:data.password,email:data.email};
                        collection.save(whereStr, function(err, rt){
                            if(err){
                                console.log(err);
                                reject(err);
                            }else{
                                result.data = rt;
                                resovel(result);
                            }
                        });
                    }
                });
                
            });
        });
    },

    login: function(data){
        return new Promise(function (resovel, reject) {
            MongoClient.connect(DB_CONN_STR, function(err, db){
                var collection = db.collection('user');
                var whereStr = {username:data.account,pass:data.password}
                collection.find(whereStr).toArray(function(err, rt){
                    console.log(rt);
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
