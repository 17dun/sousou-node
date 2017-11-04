/**
 * @file user.js
 * @desc 用户控制器
 * @author xiaoguang01
 * @date 2016/3/7
 */
var atcModel = require('../model/atc.js');
var genLogid = require('../libs/logid').genLogid;
var parse = require('co-busboy');
var path = require('path');
var fs = require('fs');
module.exports = {
	//展现页面
    show: function *(){
        var self = this;
        if(!this.session.adminKey){
            return this.redirect('/login');
        }
        yield self.render('atc', {adminName: this.session.adminName});
    },

    //展现页面
    view: function *(){
        var self = this;
        yield self.render('atcview');
    },

     //展现页面
    detail: function *(){
        var self = this;
        var data = this.query;
        var rs = yield atcModel.detail(data);
        yield this.api(rs);
    },


    //展现页面
    list: function *(){
        var self = this;
        var rs = yield atcModel.list();
        yield this.api(rs);
    },

    //获取详细信息
    addTT: function *(){
        var postBody = this.request.body;
        var fileName = genLogid();
        var parts = parse(this);
        var part = yield parts;
        var stream = fs.createWriteStream(path.join('./client/src/toutu', fileName+'.jpg'));
        part.pipe(stream);
        yield this.api({code:0,msg:'保存成功',data:{fileName:fileName}});
    },

    //修改用户资料
    save: function *(){
        var data = this.request.body;
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
