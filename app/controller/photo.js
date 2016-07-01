/**
 * @file photo.js
 * @desc 食物控制器
 * @author xiaoguang01
 * @date 2017/3/7
 */
var photoModel = require('../model/photo.js');
module.exports = {

    //显示页面
    show: function *(){
        yield this.render('photo');
        
    },

    //获取列表
    list: function *(){
        var data = this.query;
        var rs = yield photoModel.list(data);
        yield this.api(rs);
        
    },

    //获取详细信息
    detail: function *(){
        var id = this.query.fid;
        var rs = yield photoModel.detail(id);
        yield this.api(rs);
    },

    //添加食物
    save: function *(){
        var data = this.query;
        var rs = yield photoModel.save(data);
        yield this.api(rs);
    },
    //添加食物
    del: function *(){
        var data = this.query;
        var rs = yield photoModel.del(data);
        yield this.api(rs);
    }
};
