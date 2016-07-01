/**
 * @file login.js
 * @desc 登陆demo 页面js
 * @author xiaoguang01
 * @date 2015/11/11
 */
document.write('<script src="/js/libs/jquery.upload.js"></script>');
zeus.page({
    initDatas: function () {
        self.list = [];
    },
    // 初始化部件
    initParts: function () {
        var self = this;
        self.parts = {
            $form: $('#queryBox'),
            $table: $('#listBox')
        };
        self.getList();

    },
    // 事件绑定
    bindEvent: function () {
        var self = this;
        var $queryBtn = self.parts.$form.find('.query-btn');
        $queryBtn.on('click', function(){
            self.getList();
        })

        var $addBtn = self.parts.$form.find('.add-btn');
        $addBtn.on('click', function(){
            self.add();
        })

        $('#listBody').on('click', '.edit-btn', function(){
            self.edit(this);
        });

        $('#listBody').on('click', '.del-btn', function(){
            var id = $(this).parent().parent().data('itemid');
            self.del(id);
        });
        $('#dictFile').on('click', function(){
            self.save();
        });
    },

    getList: function(){
        var self = this;
        var data = self.parts.$form.serialize();
        $.ajax({
            url: '/photo/list',
            type: 'GET',
            dataType: 'json',
            data: data,
            success: function(rt){
                self.list = rt.data;
                self.renderList();
            },
            error: function(rt){
                //alert('失败');
            }
        });
    },

    renderList: function(){
        $("#listBody").empty();
        $('#listTemp').tmpl(self.list).appendTo('#listBody');
    },

    add: function(){
        var self = this;
        self.edit();
    },

    renderEdit: function(data){
        $("#editBox").empty();
        $('#editFormTemp').tmpl(data).appendTo('#editBox');
    },

    edit: function(btn){
        var self = this;
        if(!btn){
            var taskData = {}
        }else{
            var index = $('.edit-btn').index(btn);
            var data = self.list[index];
        }
        self.renderEdit(data);
        $('#dictFile').on('click', function(){
            self.save();
        });
        $('#editBox').dialog({
            title:'编辑',
            modal:true,
            width:300,
            buttons: [
                {
                    text: "保存", 
                    click: function(){
                        var box = this;
                        self.save(function(){
                            self.getList();
                            self.msg(1);
                            $(box).dialog("close");
                        });
                    }
                }
            ]
        })
    },

    save: function(callback){
        var self = this;
        var data = $('#editform').serialize();
        var date = $('#date').val();
        var file = $('#file').val();
        $.upload({
            // 上传地址
            url: '/photo/save',
            // 文件域名字
            fileName: 'file',
            // 其他表单数据
            params: {date: date},
            // 上传完成后, 返回json, text
            dataType: 'json',
            // 上传之前回调,return true表示可继续上传
            onSend: function() {
                return true;
            },
            // 上传之后回调
            onComplate: function(data) {
                if(data.code==0){
                    callback();
                }
            }
        });

    },

    del: function(id){
        var self = this;
        $('#delBox').dialog({
            title:'警告',
            modal:true,
            width:300,
            buttons: [
                {
                    text: "确定", 
                    click: function(){
                        $.ajax({
                            url: '/photo/del?id='+id,
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
