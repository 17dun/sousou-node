/**
 * @file record.js
 * @desc 历程模型
 * @author xiaoguang01
 * @date 2016/3/7
 */
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = require('../../conf').db;
var ObjectId =  require('mongodb').ObjectID;
var photoModel = require('./photo');
var userModel = require('./user');
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
                collection.find(data).skip(from).limit(pageSize).sort({_id:-1}).toArray(function(err, rt){
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
        function getBaseHot(data){
            var age = 28;
            var result = 0;
            if(data.sex == 1){
                //男生
                result = 66 + data.initWeight * 13.7 + 5*175 - 6.8*age;
            }else{
                //女生
                result = 655 + data.initWeight * 9.6 + 1.7*155 - 4.7*age;
            }
            return Math.floor(result);
        }

        return new Promise(function (resovel, reject) {
            MongoClient.connect(DB_CONN_STR, function(err, db){
                var collection = db.collection('record');
                var obj = {
                    user: data.user,
                    date: data.date
                }
                photoModel.getByDate(obj).then(function(photos){
                    userModel.getByName(data.user).then(function(user){
                        collection.find(obj).toArray(function(err, rt){
                            if(err){
                                resovel({
                                    code: 1,
                                    msg: '数据库查询失败',
                                    data: err
                                });
                            }else{
                                var weight = 0;
                                var hasHot = 0;
                                var speedHot = 0;
                                var photofile = (photos&&photos.file) || '';
                                rt.forEach(function(item){
                                    if(item.type=="food"){
                                        hasHot += item.hot*1;
                                    }else if(item.type=='sport'){
                                        speedHot += item.hot*1;
                                    }else if(item.type=='weight'){
                                        weight = item.value;
                                    }
                                });
                                resovel({
                                    code: 0,
                                    msg: '查询成功',
                                    data: {
                                        hasHot: hasHot,
                                        speedHot: speedHot,
                                        sportHot: 0,
                                        foodHot: user.data[0].baseHot,
                                        weight: weight,
                                        photofile: photofile
                                    }
                                });
                            }
                        });



                    });

                    





                });


            });
        });
    },
    getByDate: function(data){
        return new Promise(function (resovel, reject) {
            MongoClient.connect(DB_CONN_STR, function(err, db){
                var collection = db.collection('record');
                var obj = {
                    user: data.user||'',
                    date: data.date||''
                };
                photoModel.getByDate(obj).then(function(){
                collection.find(obj).toArray(function(err, rt){
                        if(err){
                            resovel({
                                code: 1,
                                msg: '数据库查询失败',
                                data: err
                            });
                        }else{

                            var inHot = 0;
                            var outHot = 0;
                            var weight = 0;
                            rt.forEach(function(item){
                                if(item.type=="food"){
                                    inHot += item.hot*1;
                                }else if(item.type=='sport'){
                                    outHot += item.hot*1;
                                }else{
                                    weight = item.hot;
                                }
                            });
                            resovel({
                                code: 0,
                                msg: '查询成功',
                                data: {
                                    inHot: inHot,
                                    outHot: outHot,
                                    weight: weight
                                }
                            });
                        }
                    });
                
                    
                });
            });
        });
    },

    getByUser: function(data){
        return new Promise(function (resovel, reject) {
            MongoClient.connect(DB_CONN_STR, function(err, db){
                var collection = db.collection('record');
                var obj = {
                    user: data.user||''
                };
                photoModel.getByUser(obj).then(function(photos){
                collection.find(obj).toArray(function(err, rt){
                        if(err){
                            resovel({
                                code: 1,
                                msg: '数据库查询失败',
                                data: err
                            });
                        }else{
                            var rsArr = rt.concat(photos);
                            var rtObj = {};
                            //两次循环，第一次循环没有photo，第二次处理photo。
                            var dateArr = [];
                            var weightArr = [];
                            var hotArr = [];
                            var photoArr = [];
                            //先归到一起
                            rsArr.forEach(function(item){
                                var dateSplit = item.date.split('-');
                                var key = dateSplit[0]*30*12 + dateSplit[1]*12 + dateSplit[2];

                                //如果存在，就追加，如果不存在就定义，对于日期存在，但是字段不存在也一样再判断一次
                                if(rtObj[key]){
                                    if(item.type=="weight"){
                                        rtObj[key]['weight'] = item.value;
                                    }
                                    if(item.type=="food"){
                                        
                                        rtObj[key]['hot'] += item.hot*1;
                                    }
                                    if(item.type=="sport"){
                                        rtObj[key]['hot'] -= item.hot*1;
                                    }
                                    if(!item.type){
                                        rtObj[key]['photo'] = item.file;
                                    }
                                }else{
                                    rtObj[key] = {date:item.date, hot:0};
                                    rtObj[key]['photo'] = '';
                                    rtObj[key]['weight'] = 0;
                                    if(item.type=="weight"){
                                        rtObj[key]['weight'] = item.value;
                                    }
                                    if(item.type=="food"){
                                        rtObj[key]['hot'] += item.hot*1;
                                    }
                                    if(item.type=="sport"){
                                        rtObj[key]['hot'] -= item.hot*1;
                                    }
                                    if(!item.type){
                                        rtObj[key]['photo'] = item.file;
                                    }
                                }
                            });
                            for(rtItem in rtObj){
                                    //时间排序
                                    dateArr.push(rtObj[rtItem].date);
                                    weightArr.push(rtObj[rtItem].weight);
                                    var perHot =  2500 - rtObj[rtItem].hot;
                                    if(perHot<0){
                                        perHot = 0;
                                    }
                                    var resultHot = (perHot/2500)*10;
                                    if(resultHot>10){
                                        resultHot = 10;
                                    }

                                    hotArr.push(Math.floor(resultHot));
                                    photoArr.push(rtObj[rtItem].photo);
                            }
                            weightArr.forEach(function(weightItem, i){
                                if(weightItem==0&&i>0){
                                    weightArr[i] = weightArr[i-1];
                                } 
                            });
                            resovel({
                                code: 0,
                                msg: '查询成功',
                                data: {
                                    rtObj: rtObj,
                                    dateArr: dateArr,
                                    weightArr: weightArr,
                                    hotArr: hotArr,
                                    photoArr: photoArr
                                }
                            });
                        }
                    });
                
                    
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
                    data._id = ObjectId(data._id);
                }else{
                    data.status = 0;
                    data.taskNum = 0;
                }

                collection.findOneAndUpdate({user: data.user, type: 'weight', date: data.date},data,{upsert:true}, function(){
                    
                    resovel({
                            code: 0,
                            msg: 'ok'
                        });
                });
            });
        });
    },

    updateUserInfo: function(user){
        var self = this;
        return new Promise(function (resovel, reject) {
            MongoClient.connect(DB_CONN_STR, function(err, db){
                var collection = db.collection('record');
                var obj = {
                    user: user
                };
                collection.find(obj).toArray(function(err, rt){
                    var date = rt[0].date
                    var weight = 0;
                    for(var i = rt.length-1; i>0; i--){
                        if(rt[i].type=="weight"){
                            weight = rt[i].value;
                            break;
                        }
                    }
                    userModel.updateInfo(user,{currentWeight:weight,date:date});
                })
            });
        });


    },


    updateById: function(data){
        var self = this;
        return new Promise(function (resovel, reject) {
            MongoClient.connect(DB_CONN_STR, function(err, db){
                var collection = db.collection('record');
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
                    collection.insertOne(obj, function(err,rt){
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
