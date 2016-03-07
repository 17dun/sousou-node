/**
 * @file food.js
 * @desc 食物控制器
 * @author xiaoguang01
 * @date 2017/3/7
 */
var foodModel = require('../model/food.js');
module.exports = {
    //获取列表
    getList: function *(){
        var rs = yield foodModel.getList(data);
        yield this.api(rs);
        
    },

    //获取详细信息
    getFood: function *(){
        var id = this.query.fid;
        var rs = yield foodModel.getFood(id);
        yield this.api(rs);
    }
};
