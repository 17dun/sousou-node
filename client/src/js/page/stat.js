/**
 * @file login.js
 * @desc 登陆demo 页面js
 * @author xiaoguang01
 * @date 2015/11/11
 */
zeus.page({
    initDatas: function () {
        self.statList = [];
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
        $.ajax({
            url: '/statList?taskId='+taskId,
            type: 'GET',
            dataType: 'json',
            success: function(rt){
                self.statList = rt.data;
                self.renderStatList();
            },
            error: function(rt){
                self.msg(0);
            }
        });
    },

    renderStatList: function(){
        $("#statListBody").empty();
        $('#statListTemp').tmpl(self.statList).appendTo('#statListBody');
        $('.log-btn').on('click',function(){
            var ids = $(this).data('ids');
            $.ajax({
                url: '/logs?'+ids,
                type: 'GET',
                dataType: 'json',
                success: function(rt){
                    $('#logBox').html(rt.logs.join('<br/>'));
                    $('#logBox').dialog({
                        title:'编辑任务',
                        modal:true,
                        width:1200,
                        height:500
                    });
                },
                error: function(rt){
                    self.msg(0);
                }
            });
        })
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
