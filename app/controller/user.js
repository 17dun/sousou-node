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
        if(!this.session.adminKey){
            return this.redirect('/login');
        }
        yield self.render('user',{adminName:this.session.adminName});
    },

    //显示登陆页
    showLogin: function *(){
        var self = this;
        yield self.render('login', {adminName:'', isLogin: true});
    },

    //执行登陆操作
    adminlogin: function *(){
        var data = this.query;
        var rs = yield userModel.adminlogin(data);
        if(!rs.code){
            this.session.adminKey = rs.data[0]._id;
            this.session.adminName = rs.data[0].name;
        }
        yield this.api(rs);
    },

    //执行登出
    adminlogout: function *(){
        this.session = null;
        return this.redirect('/loginxiaoguang');
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

    //登陆
    reg: function *(){
        var data = this.query;
        var rs = yield userModel.reg(data);
        yield this.api(rs);
    },

    //获取用户信息
    get: function *(){
        var uid = this.query.uid;
        var rs = yield userModel.getUser(uid);

        yield this.api(rs);
    },

    //获取用户信息
    getByName: function *(){
        var name = this.query.name;
        var rs = yield userModel.getByName(name);

        yield this.api(rs);
    },

    //修改用户资料
    save: function *(){
        var data = this.query;
        var rs = yield userModel.save(data);
        yield this.api(rs);
    },

    updateInfo: function *(){
        var name = this.query.name;
        console.log(this.query.set);
        var arr = this.query.set.split(':');
        var set = {};
        for(var i = 0; i<arr.length; i++){
            var keyArr = arr[i].split('-')
            set[keyArr[0]] = keyArr[1];
        }
        console.log(set);
        var rs = yield userModel.updateInfo(name, set);
        yield this.api(rs);
    },

    //删除用户
    del: function *(){
        var data = this.query;
        var rs = yield userModel.del(data);
        yield this.api(rs);
    },

    //删除用户
    fgtPass: function *(){
        var data = this.query;
        var rs = yield userModel.fgtPass(data);
        if(!rs.code){
            //修改密码，同时发邮件
        }
        yield this.api(rs);
        
    }
};
