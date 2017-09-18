/**
 * @file user.js
 * @desc 用户控制器
 * @author xiaoguang01
 * @date 2016/3/7
 */
var userModel = require('../model/user.js');
module.exports = {
	//展现页面
    show: function *(){
        var self = this;
        yield self.render('user');
    },


    //展现页面
    listby: function *(){
        var self = this;
        var rs = yield userModel.listby();
        yield this.api(rs);
    },

    //展现页面
    list: function *(){
        var self = this;
        var rs = yield userModel.list();
        yield this.api(rs);
    },


    //登陆
    login: function *(){
        var data = this.query;
        var rs = yield userModel.login(data);
        yield this.api(rs);
    },

    //获取用户信息
    get: function *(){
        var uid = this.query.uid;
        console.log(uid)
        var rs = yield userModel.getUser(uid);

        yield this.api(rs);
    },

    //修改用户资料
    save: function *(){
        var data = this.query;
        var rs = yield userModel.save(data);
        yield this.api(rs);
    },


    //删除用户
    del: function *(){
        var data = this.query;
        var rs = yield userModel.del(data);
        yield this.api(rs);
    }
};
