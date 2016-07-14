/**
 * @file index.js
 * @desc router配置
 * @author xiaoguang01
 * @date 2015/9/25
 */
var router = require('koa-router')();
var ctrs = [];
function getC(app) {
    return new Promise(function (resovel, reject) {
        try {
            ctrs = require('./libs/ctrs.js').getCtrs();
            resovel(ctrs);
        }
        catch (e) {
            reject(e);
        }
    });
}

function set(app) {
    app.use(router.routes());
    getC(app).then(function (ctrs) {
        setMap(ctrs);
    }).catch(function (e) {
        console.log(e);
    });
}

function setMap(ctrs) {
    router.get('/', ctrs.food.show);

    //食物管理
    router.get('/food', ctrs.food.show);
    router.get('/food/list', ctrs.food.list);
    router.get('/food/save', ctrs.food.save);
    router.get('/food/del', ctrs.food.del);
    router.post('/food/delall', ctrs.food.delall);


    //运动管理
    router.get('/sport', ctrs.sport.show);
    router.get('/sport/list', ctrs.sport.list);
    router.get('/sport/save', ctrs.sport.save);
    router.get('/sport/del', ctrs.sport.del);
    router.post('/sport/delall', ctrs.sport.delall);


    //用户管理
    router.get('/user', ctrs.user.show);
    // //获取用户星系
    // router.get('/getUser', ctrs.user.get);

    // router.get('/login', ctrs.user.login);

    // //保存用户，编辑和新注册
    // router.get('/saveUser', ctrs.user.save);
    // router.post('/saveUser', ctrs.user.save);
    // //删除用户
    // router.get('/delUser', ctrs.user.del);

    //记录管理
    router.get('/record', ctrs.record.show);
    router.get('/record/list', ctrs.record.list);
    router.get('/record/foodList', ctrs.record.foodList);
    router.get('/record/sportList', ctrs.record.sportList);
    router.get('/record/save', ctrs.record.save);
    router.post('/record/saveAll', ctrs.record.saveAll);
    router.get('/record/del', ctrs.record.del);
    router.post('/record/delall', ctrs.record.delall);
    router.get('/record/updateById', ctrs.record.updateById);
    router.get('/record/getHotInfo', ctrs.record.getHotInfo);



    //照片管理
    router.get('/photo', ctrs.photo.show);
    router.post('/photo/addFile', ctrs.photo.addFile);
    router.get('/photo/delFile', ctrs.photo.delFile);
    router.get('/photo/list', ctrs.photo.list);
    router.get('/photo/save', ctrs.photo.save);
    router.get('/photo/del', ctrs.photo.del);
    router.post('/photo/delall', ctrs.photo.delall);
}
module.exports = set;
