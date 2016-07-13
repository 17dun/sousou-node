/**
 * @file food.js
 * @desc 食物控制器
 * @author xiaoguang01
 * @date 2017/3/7
 */
var foodModel = require('../model/food.js');
module.exports = {

    //显示页面
    show: function *(){
        yield this.render('food');
        
    },

    //获取列表
    list: function *(){
        var data = this.query;
        var rs = yield foodModel.list(data);
        yield this.api(rs);
        
    },

    //获取详细信息
    detail: function *(){
        var id = this.query.fid;
        var rs = yield foodModel.detail(id);
        yield this.api(rs);
    },

    //添加食物
    save: function *(){
        var data = this.query;
        var rs = yield foodModel.save(data);
        yield this.api(rs);
    },
    //添加食物
    del: function *(){
        var data = this.query;
        var rs = yield foodModel.del(data);
        yield this.api(rs);
    },
    
    //添加食物
    delall: function *(){
        var data = this.request.body;
        var rs = yield foodModel.delall(data);
        yield this.api(rs);
    }
};
