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

    //获取列表
    foodList: function *(){
        var data = this.query;
        var rs = yield recordModel.foodList(data);
        yield this.api(rs);

    },

    //获取列表
    sportList: function *(){
        var data = this.query;
        var rs = yield recordModel.sportList(data);
        yield this.api(rs);

    },

    //添加食物
    save: function *(){
        var data = this.query;
        var exisRt = yield recordModel.getExsi(data);
        console.log(exisRt.code);
        if(exisRt.code){
            yield recordModel.del({id:exisRt.id});
        }
        var rs = yield recordModel.save(data);
        yield this.api(rs);
    },

    //添加食物
    updateById: function *(){
        var data = this.query;
        var rs = yield recordModel.updateById(data);
        yield this.api(rs);
    },

    //添加食物
    saveAll: function *(){
        var data = this.request.body;
        if(!data||data.length==0){
            yield this.api({
                code:1,
                data:null
            });
        }
        var rs = yield recordModel.saveAll(data);
        yield this.api(rs);
    },

    //添加食物
    getHotInfo: function *(){
        var data = this.query;
        var rs = yield recordModel.getHotInfo(data);
        yield this.api(rs);
    },

    //添加食物
    del: function *(){
        var data = this.query;
        var rs = yield recordModel.del(data);
        yield this.api(rs);
    },
    delall: function *(){
        var data = this.request.body;
        var rs = yield recordModel.delall(data);
        yield this.api(rs);
    }
};
