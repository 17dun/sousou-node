/**
 * @file login.js
 * @desc 登陆demo 页面js
 * @author xiaoguang01
 * @date 2015/11/11
 */
zeus.page({
    initDatas: function () {
        self.list = [];
    },
    // 初始化部件
    initParts: function () {
        self.getList();
    },
    // 事件绑定
    bindEvent: function () {

    },


    getList: function(){
        var id = window.location.search.split('?id=')[1];
        $.ajax({
            url: '/atc/detail?id='+id,
            type: 'GET',
            dataType: 'json',
            success: function(rt){
                $('#contentBox').html(rt.data[0].contents);
            },
            error: function(rt){
                self.msg(0);
            }
        });
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
