// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://i.youku.com/i/*/videos?page=*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';


    function parse(){
        checkAndClear();
        var rt = [];
        var mobijs = $;
        var $vds = mobijs('.videos-list .items .va');
        for(var i=0;i<$vds.length;i++){
            var $vd = mobijs($vds[i]);
            var vid = $vd.find('.v-link a').attr('href').replace(/\S*\/id_/,'').replace(/\.html?\S*/,'');
            var img = $vd.find('.v-thumb img').attr('src');
            var num = $vd.find('.v-meta-entry .v-num').html();
            var pub = $vd.find('.v-meta-entry .v-publishtime').html();
            var target = $vd.find('.v-link .v-link-tagrt i').html();
            var time = $vd.find('.v-link .v-time').html();
            var user = $('.username').html()||'';
            if(target!='频道会员'&&target){
                var name = $vd.find('.v-meta-title a').attr('title');
                name = escapeHTML(name);
                rt.push({
                    vid: vid,
                    img: img,
                    name: name,
                    pub: pub,
                    num: num,
                    target: target,
                    time: time,
                    user: user
                });
            }
        }
        if(rt.length){
            var result = JSON.stringify(rt);
            var value = '';
            if(!localStorage.getItem(UID)){
                value = result;
            }else{
                value = localStorage.getItem(UID) + ',' + result;
            }

            localStorage.setItem(UID, value);
        }
        setTimeout(next, 500);

    }


    function checkAndClear(){
        var curNum = location.href.split('videos?page=')[1]*1;
        if(curNum==1){
            localStorage.setItem(UID, '');
        }

    }

    //是否输出结果
    function ifOutPut(){
        if($('.YK-box .title span').html()=='(0)'){
            var str = localStorage.getItem(UID);
            var sqlStr = str.replace(/\],\[/g,',');
            document.write('var list = ' + sqlStr);
            not();
        }else{
            parse();
        }
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
        var current = location.href.split('videos?page=')[1];
        document.title = '(' + current + '/' + allNum +')'+'抓取中,请稍后..';
        document.body.style.display = 'none';
    }


    function escapeHTML(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/ /g,"&nbsp;").replace(/"/g,"&#34;").replace(/'/g,"&#39;");}


    function next(){
        var nextNum = location.href.split('videos?page=')[1]*1 + 1;
        var baseUrl = location.href.split('videos?page=')[0];
        var nextPage = baseUrl + 'videos?page=' + nextNum;
        location.href = nextPage;
    }

    var UID = location.href.split('com/i/')[1].split('/videos?')[0];
    hideYouKu();
    setTimeout(ifOutPut,1000);
})();