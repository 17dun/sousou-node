/**
 * @file login.js
 * @desc 登陆demo 页面js
 * @author xiaoguang01
 * @date 2015/11/11
 */
var taskEval = [
    {
        name: 'Apple iphone 4',
        ua: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_2_1 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8C148 Safari/6533.18.5',
        width: 320,
        height: 480
    },
    {
        name: 'Apple iphone 5',
        ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X; en-us) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53',
        width: 400,
        height: 568
    },
    {
        name: 'Google Nexus 4',
        ua: 'Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 4 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19',
        width: 384,
        height: 640
    },
    {
        name: 'Google Nexus S',
        ua: 'Mozilla/5.0 (Linux; U; Android 2.3.4; en-us; Nexus S Build/GRJ22) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1',
        width: 320,
        height: 533
    },
    {
            name: 'iphone6-手百',
            ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_1_2 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Mobile/12B440 baiduboxapp/0_1.0.7.6_enohpi_4331_057/2.1.8_2C2%257enohPi/1099a/92D8C0C6B13F1EFF671F1275F7DF9A7A2A1F6355FFRDNPHGEDC/1',
            width: 375,
            height: 667
        }
];

var dutyList= {
    resourcesErr: '网络请求错误',
    pageErr: 'JS报错',
    noHttps: '没有使用HTTPS',
    resourcesTimeout: '网络请求超时',
    alertMsg: 'alert弹窗'
}

zeus.page({
    initDatas: function () {
        self.rsList = [];
        self.keys = null;
    },
    // 初始化部件
    initParts: function () {
        self.parts = {
            $form: $('#dutyForm'),
            $table: $('#dutyListBody')
        };
        self.getRsList();
        //self.renderPager(11);
    },
    // 事件绑定
    bindEvent: function () {

        var $queryBtn = self.parts.$form.find('.query-btn');
        $queryBtn.on('click', function(){
            self.getRsList();
        })
        $('.pagination').on('click','a',function(e){
            e.preventDefault();
            //判断是否是首页或者尾页的
            var pageNo = $(e.target).data('no')*1;
            if(pageNo>0){
                self.freshPager(e.target);
                self.setCurrentPage(pageNo);
                var all = $('.pagination .next a').data('all')*1;
                //第一页
                if(pageNo==1){
                    $('.pagination .prev').addClass('disabled');
                }else{
                    $('.pagination .prev').removeClass('disabled');
                }

                if(pageNo==all){
                    $('.pagination .next').addClass('disabled');
                }else{
                    $('.pagination .next').removeClass('disabled');
                }


                self.getRsList(pageNo);
            }else{
                if($(e.target).parent().hasClass('disabled')){
                    console.log('disabled')
                    return;
                }else{
                    self.jumpPage(pageNo);
                }
                
            }
        })

    },

    turnPage: function(num){


    },

    setCurrentPage: function(num){
        $('.pagination li').each(function(i,item){
            $(item).removeClass('active');
        });
        $($('.pagination li')[num]).addClass('active');
    },

    jumpPage: function(pageNo){
        if(pageNo==-1){
            self.setCurrentPage(1);
            $('.pagination .prev').addClass('disabled');
        }else{
            console.log(pageNo);
            var all = $('.pagination .next a').data('all')*1;
            self.setCurrentPage(all);
            $('.pagination .next').addClass('disabled');
        }

    },

    getRsList: function(pageNo){
        var data = self.parts.$form.serialize();
        var pageNo = pageNo||0;
        data = data + '&pageNo='+pageNo;
        $.ajax({
            url: '/dutyList',
            type: 'GET',
            dataType: 'json',
            data: data,
            success: function(rt){
                self.dutyList = self.preData(rt.data);
                self.renderDutyList();
                if(!pageNo){
                    self.renderPager(rt.all);
                }
            },
            error: function(rt){
                //alert('失败');
            }
        });
    },

    //预处理数据
    preData: function(data){
        //return data;
        for(var i=0; i<data.length; i++){
            data[i]['pn'] = '第'+(data[i]['pn']/10+1)+'页';
            data[i]['uaIndex'] = taskEval[data[i]['uaIndex']].name;
            data[i]['dutyKey'] = dutyList[data[i]['dutyKey']]
        }
        return data;
    },

    renderPager: function(pageNum){
        var pages = [];
        for(var i=0; i<pageNum; i++){
            pages.push(i+1);
        }
        var obj = {
            all: pageNum,
            pages: pages
        }
        $(".pagination").html($('#pagerTemp').tmpl(obj));
    },

    //切换页面的状态
    freshPager: function(pageItem){

        if($(pageItem).parent().next().css('display')=='none'){
            var curNum = $(pageItem).data('no');
            $('.pagination li').each(function(i,item){
                if(i<curNum&&i>0){
                    $(item).css({display:'none'});
                }
                if(i>curNum&&i<curNum+20){
                    $(item).css({display:''});
                }
            })
        }else{
            if($(pageItem).parent().prev().css('display')=='none'){

                var curNum = $(pageItem).data('no');
                $('.pagination li').each(function(i,item){
                    if(i<curNum&&i>curNum-20){
                        $(item).css({display:''});
                    }
                    if(i>curNum&&i<curNum+20&&i<$('.pagination li').length-1){
                        $(item).css({display:'none'});
                    }
                })
            }
        }
        
    },


    renderDutyList: function(){
        $('#dutyListBody').html($('#dutyListTemp').tmpl(self.dutyList))
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
