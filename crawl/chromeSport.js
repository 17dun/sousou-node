// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.boohee.com/assessment/calory
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    window.zhuaqu = function(){
        var record = $($('.record-body')[6]).find('tr');
        var list = [];
        var sourceList = $('#md_activity .item-name');
        for(var i=0;i<record.length;i++){
             var name = $(record[i]).find('.name').find('.limit').html();
             var unit = $(record[i]).find('.unit').find('.limit').html();
             var cal = $(record[i]).find('.cal').find('.limit').html();
             for(var j=0; j<sourceList.length; j++){
                if($.trim($(sourceList[j]).html()) == name){
                    var pic = $(sourceList[j]).parent().parent().parent().parent().find('img').attr('src');
                    break;
                }
             }
             list.push(JSON.stringify({
                 name:$.trim(name),
                 unit:$.trim(unit),
                 hot:$.trim(cal),
                 pic:pic
             }));
        }
        var str = list.join('\n');
        localStorage.setItem('zhuaqulist',str);
        console.log(str);
    };
    // Your code here...
})();