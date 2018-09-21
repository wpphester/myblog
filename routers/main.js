var express=require("express");
var mysql=require("mysql");

//配置数据库连接池
var pool=mysql.createPool({
    host:'127.0.0.1',           //IP地址
    port:3306,                  //端口号
    database:'myblog',          //数据库
    user:'root',                //用户名
    password:'a'
});
//加载路由
var router=express.Router();


var alltype;
router.use(function (req,res,next) {
    pool.getConnection(function (err,conn) {
        conn.query("select * from type order by tid",function (err,result) {
            conn.release();
            alltype=result;
            next();    //一定要执行next    next指继续往下执行，让程序查完sql语句之后，继续往下执行
        })
    })
})

//处理请求
router.get("/",function (req,res) {
    var page=Number(req.query.page||1);
    var mytype=Number(req.query.mytype||1);
    pool.getConnection(function (err,conn) {
        conn.query("select * from type order by tid",function (err,result) {
            if(mytype==1){
                var sql1="select c.*,t.tname,u.uname from contents c,type t,user u where c.tid=t.tid and c.uid=u.uid";
            }else{
                var sql1="select c.*,t.tname,u.uname from contents c,type t,user u where c.tid=t.tid and c.uid=u.uid and c.tid="+mytype;
            }
            conn.query(sql1,function (err2,result2) {
                var count=result2.length;
                var size=4;
                var pages=Math.ceil(count/size);
                page=Math.min(page,pages);
                page=Math.max(page,1);
                var beginSize=(page-1)*size;

                if(mytype==1){
                    var sql2="select c.*,t.tname,u.uname from contents c,type t,user u where c.tid=t.tid and c.uid=u.uid limit ?,?";
                }else{
                    var sql2="select c.*,t.tname,u.uname from contents c,type t,user u where c.tid=t.tid and c.uid=u.uid and c.tid="+mytype+" limit ?,?";
                }

                conn.query(sql2, [beginSize,size],function (err2,result2) {
                    conn.release();
                    res.render("index",{
                        types:result,
                        contents:result2,
                        page:page,
                        pages:pages,
                        size:size,
                        count:count,
                        mytype:mytype,
                        userInfo:req.session.userInfo   //取session
                    })
                })
            })
        })
    })
})

//查看文章详情
router.get("/view",function (req,res) {
    var cid=req.query.cid;
    var mytype=Number(req.query.mytype||1);
    pool.getConnection(function (err,conn) {
        conn.query("select c.*,u.uname from contents c,user u where c.uid=u.uid and c.cid=?",[cid],function (err,result) {
            if(err){
                console.log(err);
            }else{
                res.render("view",{
                    types:alltype,
                    mytype:mytype,
                    content:result[0],
                    userInfo:req.session.userInfo   //取session
                })
            }
        })
    })
})


//将这个支线模块加载到主模块里面
module.exports=router;