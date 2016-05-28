/**
 * @file login.js
 * @desc 登陆demo 页面js
 * @author xiaoguang01
 * @date 2015/11/11
 */
zeus.page({
    initDatas: function () {
        self.taskList = [];
    },
    // 初始化部件
    initParts: function () {
        self.parts = {
            $form: $('#taskQuery'),
            $table: $('#taskList')
        };
        self.getTaskList();

    },
    // 事件绑定
    bindEvent: function () {

        var $queryBtn = self.parts.$form.find('.query-btn');
        $queryBtn.on('click', function(){
            self.getTaskList();
        })

        var $addBtn = self.parts.$form.find('.add-btn');
        $addBtn.on('click', function(){
            self.addTask();
        })


        var $clearBtn = self.parts.$form.find('.clear-btn');
        $clearBtn.on('click', function(){
            self.clearData();
        })

        $('#taskListBody').on('click', '.run-btn', function(){
            var taskId = $(this).parent().parent().data('taskid');
            var taskName = $(this).parent().parent().data('taskname');
            self.runTask(taskId,taskName,this);
        });

        $('#taskListBody').on('click', '.edit-btn', function(){
            self.editTask(this);
        });


        $('#taskListBody').on('click', '.reset-btn', function(){
            var taskId = $(this).parent().parent().data('taskid');
            self.resetTask(taskId);
        });

        $('#taskListBody').on('click', '.del-btn', function(){
            var taskId = $(this).parent().parent().data('taskid');
            self.delTask(taskId);
        });
    },

   
    initSocket: function(mc,taskId){
        if(!self['socket_'+mc]){
            self['socket_'+mc] = io.connect(mc);
            self['socket_'+mc].on('process', function(data){
                if(data.process==100){
                    setTimeout(function(){self.getTaskList()},1000);
                }else{
                    $('#'+data.taskId).html(data.process+'%');

                }
            });
        }
    },

    getTaskList: function(){
        console.log('fresh');
        var data = self.parts.$form.serialize();
        $.ajax({
            url: '/taskList',
            type: 'GET',
            dataType: 'json',
            data: data,
            success: function(rt){
                self.taskList = rt.data;
                self.renderTaskList();
            },
            error: function(rt){
                //alert('失败');
            }
        });
    },

    renderTaskList: function(){
        $("#taskListBody").empty();
        $('#taskListTemp').tmpl(self.taskList).appendTo('#taskListBody');
    },

    addTask: function(){
        self.editTask();
    },

    renderEdit: function(data){
        $("#editBox").empty();
        $('#editFormTemp').tmpl(data).appendTo('#editBox');
    },

    editTask: function(btn){
        if(!btn){
            var taskData = {}
        }else{
            var index = $('.edit-btn').index(btn);
            var taskData = self.taskList[index];
        }
        console.log(taskData)
        self.renderEdit(taskData);
        $("#fileName").autoComplete({
           source: function(term, response){
                $.getJSON('/dictSuggest', {chars: term }, function(data){ response(data.data); });
            },
            minChars: 1
        });

        $('.task-type').on('click',function(){
            $('.task-type-label').removeClass('active');
            $('.task-type').attr('checked',false);
            this.checked = true;
            $(this).parent().addClass('active');
        })

        $('.run-type').on('click',function(){
            $('.run-type-label').removeClass('active');
            $('.run-type').attr('checked',false);
            this.checked = true;
            $(this).parent().addClass('active');
        })


       // self.setCodeBox();

        $('#editBox').dialog({
            title:'编辑任务',
            modal:true,
            width:1200,
            buttons: [
                {
                    text: "保存", 
                    click: function(){
                        var box = this;
                        self.saveTask(function(){
                            self.getTaskList();
                            self.msg(1);
                            $(box).dialog("close");
                        });
                    }
                }
            ]
        })
    },

    //更改引擎状态切换
    changeRun: function(runType){
        if(runType==1){
            //$('.dash-box').html('');
            $('.dash-box').hide();
            $('#runScript').css({height:'150px'})
        }else{
            $('.dash-box').show();
             $('#runScript').css({height:'auto'})
        }
    },

    saveTask: function(callback){
       // $('#runScript').val(self.editor.getValue());
        var data = $('#editform').serialize();
        console.log(data);
        $.ajax({
            url: '/saveTask',
            type: 'GET',
            dataType: 'json',
            data: data,
            success: function(rt){
                callback();
            },
            error: function(rt){
                self.msg(0,'保存失败')
            }
        });

    },

    delTask: function(taskId){
        $('#delBox').dialog({
            title:'警告',
            modal:true,
            width:300,
            buttons: [
                {
                    text: "确定", 
                    click: function(){
                        $.ajax({
                            url: '/delTask?taskId='+taskId,
                            type: 'GET',
                            dataType: 'json',
                            success: function(rt){
                                self.msg(1);
                                self.getTaskList();
                            },
                            error: function(rt){
                                self.msg(0);
                            }
                        });
                        $(this).dialog("close");
                    }
                },
                {
                    text: "取消",
                    click: function(){
                        $(this).dialog("close");
                    }
                }
            ]
        })
    },
    runTask: function(taskId,taskName,btn){
        $.ajax({
            url: '/runTask?taskId='+taskId+'&taskName='+taskName,
            type: 'GET',
            dataType: 'json',
            success: function(rt){
                console.log(rt);
                if(!rt.code){
                    self.msg(1,rt.msg);
                    self.getTaskList();
                    self.initSocket(rt.mc,taskId,btn);
                    
                }else{
                    self.msg(0,rt.msg);
                }
            },
            error: function(rt){
                self.msg(0);
            }
        });
    },

    //清空所有数据，先挂在这里，后续通过管理员的账号分权来实现
    clearData: function(){
        $('#clearBox').dialog({
            title:'严重警告',
            modal:true,
            width:400,
            buttons: [
                {
                    text: "确定", 
                    click: function(){
                        $.ajax({
                            url: '/clearData',
                            type: 'GET',
                            dataType: 'json',
                            success: function(rt){
                                if(rt.code){
                                    self.msg(0,rt.msg);
                                }else{
                                    self.msg(1);
                                    self.getTaskList();
                                }
                            },
                            error: function(rt){
                                self.msg(0);
                            }
                        });
                        $(this).dialog("close");
                    }
                },
                {
                    text: "取消",
                    click: function(){
                        $(this).dialog("close");
                    }
                }
            ]
        });
        
    },

    resetTask: function(taskId){
        $.ajax({
            url: '/resetTask?taskId='+taskId,
            type: 'GET',
            dataType: 'json',
            success: function(rt){
                if(rt.code){
                    self.msg(0,rt.msg);
                }else{
                    self.msg(1);
                    self.getTaskList();
                }
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
