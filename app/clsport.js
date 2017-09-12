/**
 * @file food.js
 * @desc 用户模型
 * @author xiaoguang01
 * @date 2016/3/7
 */
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = require('../conf').db;
var ObjectId =  require('mongodb').ObjectID;

MongoClient.connect(DB_CONN_STR, function(err, db){
    var collection = db.collection('sport');
    collection.find().toArray(function(err, rt){
        if(err){
            resovel({
                code: 1,
                msg: '数据库查询失败',
                data: err
            });
        }else{

            for(var i=0; i<rt.length; i++){
                if(rt[i].hot.indexOf('大卡')!=-1){
                    var newHot = rt[i].hot.replace('大卡','');
                    var name = rt[i].name;
                    console.log(newHot);
                    collection.update({name:name},
                        {$set: {hot:newHot}
                        }
                    )
                }
            }
        }
    });
});