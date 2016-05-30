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


    router.get('/food', ctrs.food.show);
    router.get('/food/list', ctrs.food.list);
    router.get('/food/save', ctrs.food.save);
    router.get('/food/del', ctrs.food.del)

    router.get('/sport', ctrs.sport.show);
    router.get('/sport/list', ctrs.sport.list);
    router.get('/sport/save', ctrs.sport.save);
    router.get('/sport/del', ctrs.sport.del);



    router.get('/user', ctrs.user.show);
    // //获取用户星系
    // router.get('/getUser', ctrs.user.get);

    // router.get('/login', ctrs.user.login);

    // //保存用户，编辑和新注册
    // router.get('/saveUser', ctrs.user.save);
    // router.post('/saveUser', ctrs.user.save);
    // //删除用户
    // router.get('/delUser', ctrs.user.del);

    router.get('/record', ctrs.record.show);
}
module.exports = set;
