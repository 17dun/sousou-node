/**
 * @file user.js
 * @desc 用户控制器
 * @author xiaoguang01
 * @date 2016/3/7
 */
module.exports = {
	//展现页面
    show: function *(){
        var self = this;
        yield self.render('index', {noWrap:true});
    }
};
