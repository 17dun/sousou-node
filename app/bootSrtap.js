/**
 * @file bootStrap.js
 * @desc 程序入口
 * @author xiaoguang01
 * @date 2015/9/25
 */
var config = require('../conf');
var koa = require('koa');
var view = require('./libs/template');
var router = require('./router.js');
var route = require('koa-router')();
var app = koa();
var fs = require('fs');
var runEnv = config.runEnv;
var bodyParser = require('koa-bodyparser');
var tclog = require('./libs/tclog.js');
var genLogid = require('./libs/logid').genLogid;
var api = require('./libs/api');

app.keys = ['tiancai', 'xiaoguang'];

app.use(function *(next) {
    if(this.url == '/favicon.ico'){
        //favicon return
    }else{
        yield next;
    }
})

// 设置模板
view(app, config.view);

// 设置api
api(app);
app.use(require('koa-static')(config.statics.staticRoute));
app.use(bodyParser());
tclog.init();
// live-reload代理中间件
if (runEnv === 'dev') {
    app.use(function *(next) {
        yield next;
        if(this.type === 'text/html') {
            this.body += yield this.toHtml('blocks/reload');
        }
    });
}




app.use(function *(next) {
    var logid = genLogid();    
    tclog.notice({logid:logid,type:'pv',method:this.req.method,url:this.url,userInfo:this.userInfo})
    yield next;
});

// 设置路由
router(app);
route.get('/',function* (){console.log(1111)});

app.use(function *error(next) {
    if (this.status === 404) {
        yield this.render('error/404',{noWrap:true});
    }else{
        yield next;
    }
});

app.listen(8000);
tclog.notice('UI Server已经启动：http://127.0.0.1:8000');
// 启动后通过IO通知watch
if (runEnv === 'dev') {
    fs.writeFile('./pid', new Date().getTime());
}