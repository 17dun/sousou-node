/**
 * @file admin.js
 * @desc 用户控制器
 * @author xiaoguang01
 * @date 2016/3/7
 */
var userModel = require('../model/admin.js');
module.exports = {
	//展现页面
    show: function *(){
        var self = this;
        yield self.render('task', {
            userInfo : self.userInfo||null,
            taskList : null
        });
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
        var rs = yield userModel.saveUser(data);
        yield this.api(rs);
    },


    //删除用户
    del: function *(){
        var data = this.query;
        var rs = yield userModel.delUser(data);
        yield this.api(rs);
    }
};
