/**
 * @file login.js
 * @desc 登陆demo 页面js
 * @author xiaoguang01
 * @date 2015/11/11
 */
zeus.page({
    initDatas: function () {
        self.rsList = [];
        self.keys = null;
    },
    // 初始化部件
    initParts: function () {
        self.parts = {
            $form: $('#taskQuery'),
            $table: $('#taskList')
        };
        self.getRsList();

    },
    // 事件绑定
    bindEvent: function () {
        var $queryBtn = self.parts.$form.find('.query-btn');
        $queryBtn.on('click', function () {
            self.getRsList();
        });
    },

    getRsList: function () {
        var data = self.parts.$form.serialize();
        $.ajax({
            url: '/badcaseList',
            type: 'GET',
            dataType: 'json',
            data: data,
            success: function (rt) {
                self.rsList = rt.data;
                self.keys = rt.keys;
                self.renderRsList();
            },
            error: function (rt) {
                // alert('失败');
            }
        });
    },

    renderRsList: function () {
        $('#taskListBody').empty();
        var obj = {
            rsList: self.rsList
        };

        $('#taskListTemp').tmpl(obj).appendTo('#taskListBody');
    },
    // 飘红渐变提示
    msg: function (type, msg) {
        var $msgBox = $('#bgMsg');
        if (type) {
            $msgBox.addClass('alert-success');
            $msgBox.removeClass('alert-danger');
            $msgBox.html('操作成功');
        }
        else {
            $msgBox.addClass('alert-danger');
            $msgBox.removeClass('alert-success');
            $msgBox.html('操作失败');
        }
        if (msg) {
            $msgBox.html(msg);
        }

        $msgBox.animate({
            opacity: 1
        });
        $msgBox.animate({
            opacity: 0
        }, 800);
    }
});
