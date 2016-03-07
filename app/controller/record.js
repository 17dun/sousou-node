/**
 * @file record.js
 * @desc 历程控制器
 * @author xiaoguang01
 * @date 2016/3/7
 */
var recordModel = require('../model/record.js');
module.exports = {
    //获取某一个用户的记录
    getList: function *(){
        var uid = this.query.uid;
        var rs = yield recordModel.getList(uid);
        yield this.api(rs);
    },
    //某一个用户添加记录
    add: function() *(){
        var data = this.query;
        var rs = yield recordModel.add(data);
        yield this.api(rs);

    }
};
