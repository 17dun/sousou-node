/**
 * @file login.js
 * @desc 登陆demo 页面js
 * @author xiaoguang01
 * @date 2015/11/11
 */
zeus.page({
    initDatas: function () {
        self.waitList = [];
    },
    // 初始化部件
    initParts: function () {
        self.parts = {};
        self.getRsList();
        self.initSocket();

    },
    // 事件绑定
    bindEvent: function () {

    },

    getRsList: function(taskId){
        $.ajax({
            url: '/workerList',
            type: 'GET',
            dataType: 'json',
            success: function(rt){
                if(rt.waitList){
                    self.waitList = rt.waitList;
                    self.currentRun = rt.currentRun;
                    self.process = rt.process;
                    if(self.waitList.length==0&&self.currentRun==null){
                        $(workList).html('无任何活动进程');
                    }else{
                        self.renderRsList();
                    }
                }else{
                    $(workList).html('抓取器进程异常,请联系管理员');
                }
                
            }
        });
    },

    initSocket: function(){
        io = io.connect('http://cp01-rdqa-dev116.cp01.baidu.com:8001');
        io.on('fresh', function(data){
            self.getRsList();
        });
        io.on('process', function(data){
            $('#process').html(data+'%');
        });
    },

    renderRsList: function(){
        var obj = {
            waitList: self.waitList,
            currentRun: self.currentRun,
            process: self.process
        }
        $('#workList').html('');
        $('#workListTemp').tmpl(obj).appendTo('#workList');
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
