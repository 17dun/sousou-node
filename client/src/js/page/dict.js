/**
 * @file login.js
 * @desc 登陆demo 页面js
 * @author xiaoguang01
 * @date 2015/11/11
 */
 document.write('<script src="/js/libs/jquery.upload.js"></script>');
zeus.page({
    initDatas: function () {
        self.dictList = [];
        self.hasSave = true;
    },
    // 初始化部件
    initParts: function () {
        self.parts = {
            $form: $('#dictQuery'),
            $table: $('#dictList')
        };
        self.getDictList();

    },
    // 事件绑定
    bindEvent: function () {
        var $queryBtn = self.parts.$form.find('.query-btn');
        $queryBtn.on('click', function(){
            self.getDictList();
        });

        var $addBtn = self.parts.$form.find('.add-btn');
        $addBtn.on('click', function(){
            self.addDict();
        })

        $('#dictListBody').on('click', '.del-btn', function(){
            var dictId = $(this).parent().parent().data('dictid');
            self.delDict(dictId);
        });

        $('#dictFile').on('click', function(){
            self.addFile();
        })

        $('#displayBox').on('click', '.close', function(){
            
            self.delFile(function(){
                $('#dictFile').show();
                $('#displayBox').hide();
            });
        })

    },

    addFile: function(){
        $.upload({
            // 上传地址
            url: '/addFile', 
            // 文件域名字
            fileName: 'dictFile',
            // 其他表单数据
            params: {name: 'pxblog'},
            // 上传完成后, 返回json, text
            dataType: 'json',
            // 上传之前回调,return true表示可继续上传
            onSend: function() {
                return true;
            },
            // 上传之后回调
            onComplate: function(data) {
                if(data.code==0){
                    $('#dictFile').hide();
                    $('#displayName').html(data.data.dictName);
                    $('#displayBox').show();
                    self.hasSave = false;
                }
            }
        });
    },

    delFile: function(callback){
        var fileId = $('#displayName').html();
        $.ajax({
            url: '/delFile',
            type: 'GET',
            dataType: 'json',
            data: {
                fileId: fileId
            },
            success: function(rt){
                callback();
            },
            error: function(rt){
                self.msg(0);
            }
        });
    },

    getDictList: function(){
        var data = self.parts.$form.serialize();
        $.ajax({
            url: '/dictList',
            type: 'GET',
            dataType: 'json',
            data: data,
            success: function(rt){
                self.dictList = rt.data;
                self.renderDictList();
            },
            error: function(rt){
                self.msg(0);
            }
        });
    },

    renderDictList: function(){
        $("#dictListBody").empty();
        $('#dictListTemp').tmpl(self.dictList).appendTo('#dictListBody');
    },

    addDict: function(){
        $('#editform')[0].reset();
        $('#editBox').dialog({
            title:'新建词典',
            modal:true,
            width:600,
            buttons: [
                {
                    text: "保存", 
                    click: function(){
                        var box = this;
                        self.saveDict(function(){
                            self.getDictList();
                            self.hasSave = true;
                            self.msg(1);
                            $(box).dialog("close");
                        });
                        //$('#editform')[0].submit();
                    }
                }
            ],
            close: function(){
                if(!self.hasSave){
                    self.delFile(function(){
                        $('#dictFile').show();
                        $('#displayBox').hide();
                    });
                }
            }
        })
    },

    saveDict: function(callback){
        var fileId = $('#displayName').html();
        var fileName = $('#dictName').val();
        $.get('/saveDict', {
            fileId: fileId,
            fileName: fileName
        }, function(){
            callback();
        });
    },

    delDict: function(dictId){
        $('#delBox').dialog({
            title:'警告',
            modal:true,
            width:300,
            buttons: [
                {
                    text: "确定", 
                    click: function(){
                        $.ajax({
                            url: '/delDict?dictId='+dictId,
                            type: 'GET',
                            dataType: 'json',
                            success: function(rt){
                                self.msg(1);
                                self.getDictList();
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
