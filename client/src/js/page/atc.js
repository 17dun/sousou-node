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

        $('#listBody').on('click', '.show-btn', function(){
            self.openShow(this);
        });

        $('#listBody').on('click', '.del-btn', function(){
            var userid = $(this).parent().parent().data('id');
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

    openShow: function(btn){
        var index = $('.show-btn').index(btn);
        console.log(index);
        var data = self.list[index];
        self.renderShow(data);
        self.show();
    },


    renderEdit: function(data){
        $("#editBox").html('');
        $("#editBox").html($('#editFormTemp').tmpl(data));
        $('#dictFile').on('click', function(){
            self.addFile();
        });
    },

    renderShow: function(data){
        $('#showTitle').html(data.title);
        $('#showImg').attr('src', '/toutu/' + data.img + '.jpg');
        $('#showType').html(data.type);
        $('#showContent').html(data.contents)
        
    },

    addFile: function(){
        var self = this;
        $.upload({
            // 上传地址
            url: '/atc/addTT',
            // 文件域名字
            fileName: 'file',
            // 上传完成后, 返回json, text
            dataType: 'json',
            // 上传之后回调
            onComplate: function(data) {
                if(data.code==0){
                    $('#displayImg').attr('src', '/toutu/' + data.data.fileName + '.jpg');
                    $('#imgInput').val(data.data.fileName);
                    $('#displayBox').show();
                }
            }
        });
    },

   
    show: function(){
        $('#showP').dialog({
            title:'查看文章',
            modal:true,
            width:600,
            buttons: [
                {
                    text: "关闭", 
                    click: function(){
                        $(this).dialog("close");
                    }
                }
            ]
        })
    },


    getList: function(){
        var data = $('#query').serialize();
        $.ajax({
            url: '/atc/list',
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
        $('#editP').dialog({
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
        var data = {
            _id: $('#ids').val(),
            title: $('#title').val(),
            type: $('#type').val(),
            img: $('#imgInput').val(),
            contents: editor.txt.html()
        };
        $.ajax({
            url: '/atc/save',
            type: 'POST',
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
                            url: '/atc/del?id='+id,
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
