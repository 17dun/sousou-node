// ==UserScript==
// @name         薄荷食物抓取
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.boohee.com/food/view_group/*?page=*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';


    function parse(){
        checkAndClear();
        var rt = [];
        var mobijs = $;
        var $fds = mobijs('.food-list li');
        for(var i=0;i<$fds.length;i++){
            var fd = $($fds[i]);
            var name = fd.find('h4 a').html();
            var link = fd.find('h4 a').attr('href');
            var detail = fd.find('.text-box p').html();
            var hot = detail.split('热量：')[1].split(' 大卡')[0];
            var unit = detail.split('每100')[1].split(')')[0];
            var pic = fd.find('.img-box img').attr('src');
            if(pic.indexOf('/small/')!=-1){
                var bigpic = pic.replace('/small/','/big/');
            }else{
                var bigpic = pic.replace('small.','mid.');
            }
            rt.push({
                name: name,
                link: link,
                hot: hot,
                unit: unit,
                pic: pic,
                bigpic: bigpic
            });
        }
        var result = JSON.stringify(rt);
        var value = '';
        if(!localStorage.getItem(UID)){
            value = result;
        }else{
            value = localStorage.getItem(UID) + ',' + result;
        }

        localStorage.setItem(UID, value);
        
        setTimeout(next, 2000);

    }

    function checkAndClear(){
        var curNum = location.href.split('view_group/')[1].split('?page')[0]*1;
        if(curNum==1){
            localStorage.setItem(UID, '');
        }

    }

    //是否输出结果
    function ifOutPut(){
        if($('.food-list').children().length==0){
            nextGp();
        }else{
            parse();
        }
    }

    //下一个group
    function nextGp(){
        var nextNum = location.href.split('view_group/')[1].split('?page')[0]*1 + 1;
        if(nextNum>30){
            closeAll();
            return;
        }
        var baseUrl = location.href.split('view_group/')[0];
        var nextPage = baseUrl + 'view_group/' + nextNum + '?page=1';
        location.href = nextPage;
    }


    function closeAll(){
        var str = localStorage.getItem(UID);
        var sqlStr = str.replace(/\],\[/g,',');
        document.write('var list = ' + sqlStr);
        not();
    }

    //通知
    function not(){
        document.title = '抓取完成!';
        var options = {
            body:'抓取完成,请获取',
            dir:'rtl',
            icon:'https://www.google.com.hk/images/branding/product/ico/googleg_lodp.ico'
        };
        Notification.requestPermission(function(permission){
            if(permission ==='granted'){
                var not = new Notification('抓取完成',options);
                not.onclick = function(){
                    window.focus();
                    not.close();
                };
            }
        });
    }


    function hideYouKu(){
        var allNum = $('.next').prev().find('a').html();
        var current = location.href.split('?page=')[1];
        document.title = '(' + current + '/' + allNum +')'+'抓取中,请稍后..';
        document.body.style.display = 'none';
    }


    function escapeHTML(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/ /g,"&nbsp;").replace(/"/g,"&#34;").replace(/'/g,"&#39;");}


    function next(){
        var nextNum = location.href.split('?page=')[1]*1 + 1;
        if(nextNum>10){
            nextGp();
            return;
        }
        var baseUrl = location.href.split('?page=')[0];
        var nextPage = baseUrl + '?page=' + nextNum;
        location.href = nextPage;
    }

    var UID = 'bohe';
    //hideYouKu();
    setTimeout(ifOutPut,1000);
})();