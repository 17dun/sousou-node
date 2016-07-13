/**
 * @file sport.js
 * @desc 运动控制器
 * @author xiaoguang01
 * @date 2017/3/7
 */
var sportModel = require('../model/sport.js');
module.exports = {

    //显示页面
    show: function *(){
        yield this.render('sport');
        
    },

    //获取列表
    list: function *(){
        var data = this.query;
        var rs = yield sportModel.list(data);
        yield this.api(rs);
        
    },

    //获取详细信息
    detail: function *(){
        var id = this.query.fid;
        var rs = yield sportModel.detail(id);
        yield this.api(rs);
    },

    //添加食物
    save: function *(){
        var data = this.query;
        var rs = yield sportModel.save(data);
        yield this.api(rs);
    },
    //添加食物
    del: function *(){
        var data = this.query;
        var rs = yield sportModel.del(data);
        yield this.api(rs);
    },
    delall: function *(){
        var data = this.request.body;
        var rs = yield sportModel.delall(data);
        yield this.api(rs);
    }
};
