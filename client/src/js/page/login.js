/**
 * @file login.js
 * @desc 登陆demo 页面js
 * @author xiaoguang01
 * @date 2015/11/11
 */
zeus.page({
    initDatas: function () {},
    // 事件绑定
    initParts: function(){

    },
    bindEvent: function () {
        $('#sub').on('click', function(){
            var name = $('#name').val();
            var pass = $('#pass').val();
            $.ajax({
                url: '/adminlogin',
                type: 'GET',
                dataType: 'json',
                data: {
                    name: name,
                    pass: pass
                },
                success: function(rt){
                    if(!rt.code){
                        location.href = '/admin'
                    }
                },
                error: function(rt){
                    //alert('失败');
                }
            });
        })

    }
});
