/**
 * @file photo.js
 * @desc 食物控制器
 * @author xiaoguang01
 * @date 2017/3/7
 */
var photoModel = require('../model/photo.js');
var genLogid = require('../libs/logid').genLogid;
var parse = require('co-busboy');
var path = require('path');
var fs = require('fs');
var gm = require('gm');
module.exports = {

    //显示页面
    show: function *(){
        yield this.render('photo');
    },

    //获取列表
    list: function *(){
        var data = this.query;
        var rs = yield photoModel.list(data);
        yield this.api(rs);
    },

    //获取详细信息
    detail: function *(){
        var id = this.query.fid;
        var rs = yield photoModel.detail(id);
        yield this.api(rs);
    },



    //获取详细信息
    addFile: function *(){
        var postBody = this.request.body;
        var fileName = genLogid();
        var parts = parse(this);
        var part = yield parts;
        var stream = fs.createWriteStream(path.join('./client/src/photo', fileName+'.jpg'));
        part.pipe(stream);

        function genBig(){
            return new Promise(function(resovel, reject){
                gm('./client/src/photo/'+fileName+'.jpg')
                    .resize(400,400)
                    .write(path.join('./client/src/photo', fileName+'-big.jpg'), function(err){
                        if(!err){
                            console.log('大图处理完毕');
                            resovel(fileName+'-big');
                        }else{
                            resovel(err);
                        }
                    });
            });
        }

        function genSm(){
            return new Promise(function(resovel, reject){
                gm('./client/src/photo/'+fileName+'.jpg')
                    .resize(50,50)
                    .write(path.join('./client/src/photo', fileName+'-sm.jpg'), function(err){
                        if(!err){
                            console.log('小图处理完毕');
                            resovel(fileName+'-sm');
                        }else{
                            resovel(err);
                        }
                    });
            });
        }

        function delSrc(){
            return new Promise(function(resovel, reject){
                try{
                    fs.unlinkSync(path.join('./client/src/photo', fileName+'.jpg'));
                    resovel('删除原图片成功');
                }catch(e){
                    resovel(e);
                }
            });
        }

        yield genBig();
        yield genSm();
        //yield delSrc();
        
        console.log('全部处理完毕');


        yield this.api({code:0,msg:'保存成功',data:{fileName:fileName}});
    },

    delFile: function *(){
        var fileName = this.query.fileName;
        try{
            fs.unlinkSync(path.join('./client/src/photo', fileName+'.jpg'));
            yield this.api({code:0,msg:'删除成功',data:{fileName:fileName}});
        }catch(e){
            yield this.api({code:1,msg:'删除失败',data:{fileName:fileName}});
        }

    },


    //添加食物
    save: function *(){
        var data = this.query;
        var exisFileRt = yield photoModel.getExsiFile(data);
        if(exisFileRt.code){
            fs.unlinkSync(path.join('./client/src/photo', exisFileRt.file+'-big.jpg'));
            yield photoModel.del({id:exisFileRt.id});
        }
        var rs = yield photoModel.save(data);
        yield this.api(rs);
    },

    //添加食物
    del: function *(){
        var data = this.query;
        var rs = yield photoModel.del(data);
        yield this.api(rs);
    },
    delall: function *(){
        var data = this.request.body;
        var rs = yield photoModel.delall(data);
        yield this.api(rs);
    }
};
