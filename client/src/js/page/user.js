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
        $('.query-btn').on('click', function(){
            self.getList();
        });

        $('.add-btn').on('click', function(){
            self.openEdit();
        })

        $('#listBody').on('click', '.edit-btn', function(){
            var userid = $(this).parent().parent().data('userid');
            self.openEdit(this);
        });

        $('#listBody').on('click', '.del-btn', function(){
            var userid = $(this).parent().parent().data('userid');
            self.del(userid);
        });

    },

    openEdit: function(btn){
        if(!btn){
            var data = null
        }else{
            var index = $('.edit-btn').index(btn);
            var data = self.list[index];
        }

        self.renderEdit(data);
        self.add();

    },

    renderEdit: function(data){
        $("#editBox").html('');
        $("#editBox").html($('#editFormTemp').tmpl(data));
    },

    edit: function(){
        $.ajax({
            url: '/machineList',
            type: 'GET',
            dataType: 'json',
            data: data,
            success: function(rt){
                self.list = rt.data;
                self.renderList();
            },
            error: function(rt){
                self.msg(0);
            }
        });
    },


    getList: function(){
        var data = $('#query').serialize();
        $.ajax({
            url: '/userList',
            type: 'GET',
            dataType: 'json',
            data: data,
            success: function(rt){
                self.list = rt.data;
                self.renderList();
            },
            error: function(rt){
                self.msg(0);
            }
        });
    },

    renderList: function(){
        $("#listBody").html($('#listTemp').tmpl(self.list))
    },

    add: function(){
        $('#editBox').dialog({
            title:'新建词典',
            modal:true,
            width:600,
            buttons: [
                {
                    text: "保存", 
                    click: function(){
                        var box = this;
                        self.save(function(){
                            self.getList();
                            self.hasSave = true;
                            self.msg(1);
                            $(box).dialog("close");
                        });
                    }
                }
            ]
        })
    },

    save: function(callback){
        var data = $('#editform').serialize();
        $.ajax({
            url: '/saveUser',
            type: 'GET',
            dataType: 'json',
            data: data,
            success: function(rt){
                callback();
            },
            error: function(rt){
                self.msg(0);
            }
        });
    },

    del: function(id){
        $('#delBox').dialog({
            title:'警告',
            modal:true,
            width:300,
            buttons: [
                {
                    text: "确定", 
                    click: function(){
                        $.ajax({
                            url: '/delUser?id='+id,
                            type: 'GET',
                            dataType: 'json',
                            success: function(rt){
                                self.msg(1);
                                self.getList();
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
