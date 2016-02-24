/**
 * @file index.js
 * @desc 控制器
 * @author xiaoguang01
 * @date 2015/9/25
 */
module.exports = {
	//展现页面
    show: function *(){
        var self = this;
        yield self.render('report', {
            userInfo : self.userInfo||null
        });
    }
};
