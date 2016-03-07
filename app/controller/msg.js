/**
 * @file msg.js
 * @desc 消息控制器
 * @author xiaoguang01
 * @date 2016/3/7
 */
var msgModel = require('../model/msg.js');
module.exports = {
    //获取某一个用户的消息列表
    getList: function *(){
        var uid = this.query.uid;
        var rs = yield msgModel.getList(uid);
        yield this.api(rs);
        
    },

    //新增一条信息，供内部调用。
    add: function *(){
        var rs = yield msgModel.add(data);
        yield this.api(rs);
    },

    //删除一条信息，来自用户的删除操作
    del: function *(){
        var mid = this.query.mid;
        var rs = yield msgModel.del(mid);
        yield this.api(rs);
    }
};
