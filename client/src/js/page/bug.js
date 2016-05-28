/**
 * @file login.js
 * @desc 登陆demo 页面js
 * @author xiaoguang01
 * @date 2015/11/11
 */
zeus.page({
    initDatas: function () {
        self.rsList = [];
        self.allCount = null;
        self.taskId = '';
        self.keys = [];
        self.displays = [];
    },
    // 初始化部件
    initParts: function () {
        self.parts = {
        };
        var taskId = $('#taskIdInput').val();
        self.getRsList(taskId);

    },
    // 事件绑定
    bindEvent: function () {

    },


    getRsList: function(taskId){
        $.ajax({
            url: '/bugList',
            type: 'GET',
            data: {
                taskId: taskId
            },
            dataType: 'json',
            success: function(rt){
                self.rsList = rt.data;
                self.allCount = rt.allCount;
                self.taskId = rt.taskId;
                self.renderRsList();
            },
            error: function(rt){
                //alert('失败');
            }
        });
    },

    renderLastBugs: function(){
        var obj = {
            keys: self.keys,
            datas: self.allCount,
            displays: self.displays,
            taskId: self.taskId
        };
        $('#lastBugTemp').tmpl(obj).appendTo('#lastBugBox');
        
    },

    renderCharts: function(){
        for(var i = 0; i < self.rsList.length; i++){
            var rsItem = self.rsList[i];
            self.keys.push(rsItem.key);
            self.displays.push(rsItem.display);
            var lineChart = echarts.init($('.chart-box')[i]);
            lineChart.setOption({
                title : {
                    text: rsItem.display + '监控趋势',
                    subtext: '单位：总个数'
                },
                legend: {
                    data:['体重','净消耗']
                },
                itemStyle: {
                    normal:{
                        lineStyle:{
                            color:'#eee'
                        }
                    }
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer: {
                        lineStyle:{
                            color:'#eee'
                        }
                    }
                },
                xAxis : [
                    {
                        type : 'category',
                        axisLine: {
                            lineStyle:{
                                color:'#eee'
                            }
                        },
                        data : rsItem.times
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        axisLine: {
                            lineStyle:{
                                color:'#eee'
                            }
                        },
                        
                    }
                ],
                series : [
                {
                    name:'结果',
                    type:'line',
                    itemStyle:{
                        normal:{
                            lineStyle:{
                                color:'skyblue'
                            }
                        }
                    },
                    data: rsItem.values
                }
            ]
            })
        }
    },

    renderRsList: function(){
        $('#bugListTemp').tmpl(self.rsList).appendTo('#bugBox');
        self.renderCharts();
        self.renderLastBugs();
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
