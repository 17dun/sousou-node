/**
 * @file record.js
 * @desc 食物控制器
 * @author xiaoguang01
 * @date 2017/3/7
 */
var recordModel = require('../model/record.js');
module.exports = {

    //显示页面
    show: function *(){
        yield this.render('record');
    },

    //获取列表
    list: function *(){
        var data = this.query;
        var rs = yield recordModel.list(data);
        yield this.api(rs);

    },


    //添加食物
    save: function *(){
        var data = this.query;
        var rs = yield recordModel.save(data);
        yield this.api(rs);
    },

    //添加食物
    del: function *(){
        var data = this.query;
        var rs = yield recordModel.del(data);
        yield this.api(rs);
    }
};
