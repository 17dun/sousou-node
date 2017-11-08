print('=========开始导入==========');
var db = connect('sousou');
var importNum = 0;
var allNum = 0;
var fileNum = 0;
    try{
        load( './food-3.js');
        fileNum++;
        var list = list;
        print(list.length);
        var importTime = new Date().getTime();
        for(var i=0; i<list.length; i++){
            allNum++;
            var res=db.food.find({vid:list[i].name});
            if(!res.length()){
                var obj = {
                    foodName: list[i].name,
                    foodHot: list[i].hot,
                    fileName: 'small-' + list[i].pic.split('/').pop(),
                    fileNameBig: 'big-' + list[i].bigpic.split('/').pop(),
                    unit: list[i].unit,
                    link: list[i].link
                }
                
                db.food.save(obj);
                print(allNum + 'ok');
                importNum++;
            }else{
                print(allNum + 'pass');
            }
        }
    }catch(e){
        print(e);
        print('忽略');
    }

print('=========导入完成==========');
print('处理文件:'+fileNum+'个');
print('共有数据:'+allNum+'条');
print('成功导入:'+importNum+'条');
