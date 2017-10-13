/**
 * @file user.js
 * @desc 用户控制器
 * @author xiaoguang01
 * @date 2016/3/7
 */
var atcModel = require('../model/atc.js');
module.exports = {
	//展现页面
    show: function *(){
        var self = this;
        yield self.render('atc');
    },


    //展现页面
    list: function *(){
        var self = this;
        var rs = yield atcModel.list();
        yield this.api(rs);
    },


    //修改用户资料
    save: function *(){
        var data = this.query;
        var rs = yield atcModel.save(data);
        yield this.api(rs);
    },


    //删除用户
    del: function *(){
        var data = this.query;
        var rs = yield atcModel.del(data);
        yield this.api(rs);
    }
};
