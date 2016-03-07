/**
 * @file sport.js
 * @desc 运动控制器
 * @author xiaoguang01
 * @date 2016/3/7
 */
var sportModel = require('../model/sport.js');
module.exports = {
	//获取列表
    getList: function *(){
        var rs = yield sportModel.getList(data);
        yield this.api(rs);
        
    },

    //获取详细信息
    getSport: function *(){
        var sid = this.query.sid;
        var rs = yield sportModel.getSport(sid);
        yield this.api(rs);
    }
};
