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
                var collection = db.collection('atc');
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


    del: function(data){
        return new Promise(function (resovel, reject) {
            MongoClient.connect(DB_CONN_STR, function(err, db){
                var collection = db.collection('atc');
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
                var collection = db.collection('atc');
                collection.find({}).toArray(function(err, rt){
                    console.log()
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
    }

}
