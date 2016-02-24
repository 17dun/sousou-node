/**
 * @file index.js
 * @desc 控制器
 * @author xiaoguang01
 * @date 2015/9/25
 */
var taskModel = require('../model/task.js');
var userModel = require('../model/user.js');
module.exports = {
	//展现页面
    show: function *(){
        var self = this;
        yield self.render('task', {
            userInfo : self.userInfo||null,
            taskList : null
        });
    },

    login: function *(){
        var data = this.query;
        var rs = yield userModel.login(data);
        yield this.api(rs);
    },

    //获取用户信息
    get: function *(){
        var uid = this.query.uid;
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
