/**
 * @file login.js
 * @desc 登陆demo 页面js
 * @author xiaoguang01
 * @date 2015/11/11
 */
zeus.page({
    initDatas: function () {
        self.captureList = [];
    },
    // 初始化部件
    initParts: function () {
        self.getStatList();

    },
    // 事件绑定
    bindEvent: function () {
        

    },
    getStatList: function(){
        var taskId = $('#taskId').val();
        var statId = $('#statId').val();
        $.ajax({
            url: '/captureList?taskId='+taskId+'&statId='+statId,
            type: 'GET',
            dataType: 'json',
            success: function(rt){
                self.captureList = rt.data;
                self.renderStatList();
            },
            error: function(rt){
                self.msg(0);
            }
        });
    },

    renderStatList: function(){
        $("#statListBody").empty();
        $('#statListTemp').tmpl(self.captureList).appendTo('#statListBody');
    },

    //飘红渐变提示
    msg: function(type,msg){
        var $msgBox = $('#bgMsg')
        if(type){
            $msgBox.addClass('alert-success');
            $msgBox.removeClass('alert-danger');
            $msgBox.html('操作成功')
        }else{
            $msgBox.addClass('alert-danger');
            $msgBox.removeClass('alert-success');
            $msgBox.html('操作失败')
        }
        if(msg){
            $msgBox.html(msg);
        }
        $msgBox.animate({opacity:1});
        $msgBox.animate({opacity:0},800)
    }
    
});
