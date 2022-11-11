// npm init
// npm install ejs express mongodb 
// npm install express-session passport passport-local
// npm install multer moment moment-timezone

// 설치한것을 불러들여 그 안의 함수 명령어들을 쓰기위해 변수로 세팅
const express = require("express");
// 데이터베이스의 데이터 입력, 출력을 위한 함수명령어 불러들이는 작업
const MongoClient = require("mongodb").MongoClient;
// 시간 관련된 데이터 받아오기위한 moment라이브러리 사용(함수)
const moment = require("moment");
// 로그인 관련 데이터 받아오기위한 작업
// 로그인 검증을 위해 passport 라이브러리 불러들임
const passport = require('passport');
// Strategy(전략) → 로그인 검증을 하기 위한 방법을 쓰기 위해 함수를 불러들이는 작업
const LocalStrategy = require('passport-local').Strategy;
// 사용자의 로그인 데이터 관리를 위한 세션 생성에 관련된 함수 명령어 사용
const session = require('express-session');
// 게시글, 댓글 작성시 시간 한국시간으로 설정해서 넣는 함수 명령어 
const momentTimezone = require("moment-timezone");
// 파일업로드 라이브러리 multer
const multer  = require('multer')

const app = express();

// 포트번호 변수로 세팅
const port = process.env.PORT || 8000;
// const port = 8080;


// ejs 태그를 사용하기 위한 세팅
app.set("view engine","ejs");
// 사용자가 입력한 데이터값을 주소로 통해서 전달되는 것을 변환(parsing)
app.use(express.urlencoded({extended: true}));
// css나 img, js와 같은 정적인 파일 사용하려면 ↓ 하단의 코드를 작성해야한다.
app.use(express.static('public'));


// 로그인 관련 작언을 하기 위한 세팅
// 로그인 관련 작업시 세션을 생성하고 데이터를 기록할 때 세션 이름의 접두사 / 세션 변경시 자동저장 유무 설정
app.use(session({secret : '비밀코드', resave : true, saveUninitialized: false}));
// passport라이브러리 실행
app.use(passport.initialize());
// 로그인 검증시 세션데이터를 이용해서 검증하겠다.
app.use(passport.session());


// Mongodb 데이터 베이스 연결작업
// 데이터베이스 연결을 위한 변수 세팅 (변수의 이름은 자유롭게 지어도 ok)
let db;
// Mongodb에서 데이터베이스를 만들고 데이터베이스 클릭 → connect → Connect your application → 주소 복사, password에는 데이터베이스 만들때 썼었던 비밀번호를 입력해 준다.
MongoClient.connect("mongodb+srv://admin:qwer1234@testdb.g2xxxrk.mongodb.net/?retryWrites=true&w=majority",function(err,result){
    // 에러가 발생했을 경우 메세지 출력 (선택사항임. 안쓴다고 해서 문제가 되지는 않는다.)
    if(err){ return console.log(err);}

    // 위에서 만든 db변수에 최종적으로 연결 / ()안에는 mongodb atlas에서 생성한 데이터 베이스 이름 집어넣기
    db = result.db("portfolio02");

    // db연결이 제대로 되었다면 서버 실행
    app.listen(port,function(){
        console.log("서버연결 성공");
    });
});

// 메인화면 get 요청
app.get("/",(req,res) => {
    res.render("index.ejs");
});


// 로그인 기능 수행 작업
// 로그인 화면으로 요청
app.get("/admin",function(req,res){
    res.render("admin_login");
});

// 로그인 페이지에서 입력한 아이디, 비밀번호 검증처리 요청
// app.post("/경로",여기 사이에 ↓ 입력,function(req,res){});
// passport.authenticate('local', {failureRedirect : '/fail'})
app.post("/login",passport.authenticate('local', {failureRedirect : '/fail'}),function(req,res){
    //                                                   ↑ 실패시 위의 경로로 요청
    // ↓ 로그인 성공시 메인페이지로 이동
    res.redirect("/admin/prdList")
    // res.send("로그인 성공");
});

// 로그인 실패시 fail 경로
app.get("/fail",(req,res) => {
    res.send("로그인 실패");
});

// /login 경로 요청시 passport.autenticate() 함수 구간이 아이디, 비밀번호 로그인 검증 구간
passport.use(new LocalStrategy({
    usernameField: 'adminId',    // login.ejs에서 입력한 아이디의 name값
    passwordField: 'adminPass',    // login.ejs에서 입력한 비밀번호의 name값
    session: true,      // 세션을 이용할것인지에 대한 여부
    passReqToCallback: false,   // 아이디와 비밀번호 말고도 다른 항목들을 더 검사할것인가에 대한 여부
  }, function (id, pass, done) {
    db.collection('user').findOne({ adminId: id }, function (err, result) {
      if (err) return done(err)
    // 아래의 message는 필요에 따라 뻴수도 있다. 
      if (!result) return done(null, false, { message: '존재하지않는 아이디 입니다' })
      if (pass == result.adminPass) {
        return done(null, result)
      } else {
        return done(null, false, { message: '비번이 틀렸습니다' })
      }
    })
}));


// 최초의 로그인시 한번 실행
// serializeUser    →   처음 로그인 했을 시 해당 사용자의 아이디를 기반으로 세션을 생성함
// ↓ 여기서 생성된 매게변수 user로 req.user~~를 쓸 수 있다.
passport.serializeUser(function (user, done) {
     // ↓ 서버에는 세션을 만들고 / 사용자 웹 브라우저에는 쿠키를 만들어준다. 
    done(null, user.adminId)
});

// 로그인 할 때마다 실행
// deserializeUser  →   로그인을 한 후 다른 페이지들을 접근할 시 생성된 세션에 담겨있는 회원정보 데이터를 보내주는 처리
passport.deserializeUser(function (adminId, done) {
    db.collection("user").findOne({adminId:adminId},function(err,result){
        done(null,result)
    });
});

// 로그아웃 기능 작업
app.get("/logout",function(req,res){
    // 서버의 세션을 삭제하고, 본인 웹브라우저의 쿠키를 삭제한다.
    req.session.destroy(function(err,result){
        // 지워줄 쿠키를 선택한다. / 콘솔 로그의 application → cookies에 가면 name에서 확인할 수 있다.
        res.clearCookie("connect.sid")
        // 로그아웃 후 다시 메인페이지로 돌아가기
        res.redirect("/admin");
    });
});


// 파일 첨부시 필요한 필수 코드
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload')
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8'))
      }
})
const upload = multer({ storage: storage })

// 관리자 상품 추가 페이지
app.get("/admin/prdlist",(req,res) => {
    db.collection("prdlist").find({}).toArray((err,result) => {
        res.render("admin_product_list",{prdData:result, userData:req.user})
    });
});

// 상품을 새롭게 추가하면 db에 데이터가 추가되는 것
app.post("/add/prdlist",upload.single('thumbnail'),(req,res) => {
    if (req.file) {
        fileInfo = req.file.originalname;
    }
    else {
        fileInfo = null;
    }
    db.collection("count").findOne({name:"상품등록"},(err,result1) => {
        db.collection("prdlist").insertOne ({
            num:result1.prdCount + 1,
            name:req.body.name,
            thumbnail:fileInfo,
            category:req.body.category
        },(err,result) => {
            db.collection("count").updateOne({name:"상품등록"},{$inc:{prdCount:1}},(err,result) => {
                res.redirect("/admin/prdlist")
                console.log(req.body)
            });
        });
    });
});

// 상품 정보 수정하기
// 1. 기존의컬렉션의 데이터값을 가져와서 데이터를 수정할 페이지.ejs에 넣어준다.  
// 2. 데이터를 수정할 페이지.ejs에서 가져온 기존의 값을 컬렉션에.update({변경될 값의 페이지 넘버 찾기},{$set:{변경될 값}},function(req,res){})해서 수정해준다.
// 3. 수정해준 값이 화면에 보여지는지 확인한다.
app.post("/prdUpdate",upload.single('thumbnailUp'),function(req,res){
    if (req.file) {
        fileInfo = req.file.originalname;
    }
    else {
        fileInfo = null;
    }
    // 해당 게시글 번호에 맞는 게시글 수정 처리
    // req.body.~~ 경로의 정보를 받아오지 못하는 문제가 있음 / 해결, 수정시에도 파일 업로드 기능을 사용하기 위해 ,upload.single('thumbnailUp'), 코드를 쓰는것으로 해결
    db.collection("prdlist").updateOne({num:Number(req.body.hiddenNo)},{$set:{
        name:req.body.nameUp,
        thumbnail:fileInfo,
        category:req.body.categoryUp
    }},function(err,result){
        // 상품 상세페이지로 다시 이동
        res.redirect("/admin/prdlist");
    });
});

// 상품정보 삭제 요청
app.get ("/prdDelete/:no",function(req,res){
    db.collection("prdlist").deleteOne({num:Number(req.params.no)},function(err,result){
        res.redirect("/admin/prdlist");
    })
});

// 관리자 매장 등록 페이지
app.get("/admin/storeList",(req,res) => {
    db.collection("prdlist").find({}).toArray((err,result) => {
        res.render("admin_store_list",{storeData:result, userData:req.user})
    });
});





// 사용자가 보는 메뉴 페이지
app.get("/menu/doughnut",(req,res) => {
    db.collection("prdlist").find({category:"도넛"}).toArray((err,result) => {
        res.render("menu_list",{prdData:result});
    });
});
app.get("/menu/jam",(req,res) => {
    db.collection("prdlist").find({category:"잼"}).toArray((err,result) => {
        res.render("menu_list",{prdData:result});
    });
});
app.get("/menu/coffee",(req,res) => {
    db.collection("prdlist").find({category:"커피"}).toArray((err,result) => {
        res.render("menu_list",{prdData:result});
    });
});
app.get("/menu/latte",(req,res) => {
    db.collection("prdlist").find({category:"라떼"}).toArray((err,result) => {
        res.render("menu_list",{prdData:result});
    });
});
app.get("/menu/tea",(req,res) => {
    db.collection("prdlist").find({category:"티"}).toArray((err,result) => {
        res.render("menu_list",{prdData:result});
    });
});
app.get("/menu/ade",(req,res) => {
    db.collection("prdlist").find({category:"에이드"}).toArray((err,result) => {
        res.render("menu_list",{prdData:result});
    });
});

// 회사소개 페이지
app.get("/about",(req,res) => {
    res.render("about_company");
});

// 창업소개 페이지
app.get("/franchise",(req,res) => {
    res.render("franchise");
});


// 검색기능 추가하기
// 1. db에서 search를 만들어주고 server.js에 다음의 코드를 기입해준다.
// app.get("/search",function(req,res){
//     let search = [
//                     {
//                         '$search': {
//                             'index': '검색할 컬렉션 이름',
//                             'text': {
//                                 query: req.query.검색메뉴가 있는 ejs파일에서 검색어가 들어갈 input 태그의 name값,
//                                 path: req.query.검색메뉴가 있는 ejs파일에서 검색어의 종류를 선택할 select태그의 name값
//                             }
//                         }
//                     },{
//                         $sort:{brdid:-1}
//                     }
//                 ]
//     db.collection("검색할 컬렉션 이름").aggregate(search(바로 위에서 작성한 변수의 이름)).toArray(function(err,result){
//         res.render("brd_list",{brdinfo:result,userData:req.user});
//     });
// });




// 댓글 관련 기능 코드
// //게시글 상세화면 get 요청  /:변수명  작명가능
// //db안에 해당 게시글번호에 맞는 데이터만 꺼내오고 ejs파일로 응답
// app.get("/brddetail/:no",function(req,res){
//     db.collection("ex12_board").findOne({brdid:Number(req.params.no)},function(err,result1){
//         // 게시글 가져와서 → 해당 게시글 번호에 맞는 댓글들만 가져오기
//         db.collection("ex12_comment").find({comPrd:result1.brdid}).toArray(function(err,result2){
//             // 사용자에게 응답 / ejs 파일로 데이터 넘겨주기
//             // 게시글에 관련된 데이터 / 로그인한 유저정보 / 댓글에 관련된 데이터
//             res.render("brddetail",{brdData:result1, userData:req.user, commentData:result2})
//         });
        
//         // res.render("brddetail",{brdData:result,userData:req.user});
//     });
// });

// // 댓글 작성 후 db에 추가하는 post 요청
// app.post("/addcomment",function(req,res){
//     // 몇번 댓글인지 번호 부여하기 위한 작업
//     db.collection("ex12_count").findOne({name:"댓글"},function(err,result1){
//         // 해당 게시글의 번호값도 함께 부여해줘야 한다.
//         db.collection("ex12_board").findOne({brdid:Number(req.body.prdid)},function(err,result2){
//             // ex12_comment 에 댓글을 집어넣기
//             db.collection("ex12_comment").insertOne({
//                 comNo:result1.commentCount + 1,
//                 comPrd:result2.brdid,
//                 comContext:req.body.comment_text,
//                 comAuther:req.user.joinnick,
//                 comDate:moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss")
//             },function(err,result){
//                 db.collection("ex12_count").updateOne({name:"댓글"},{$inc:{commentCount:1}},function(err,result){
//                     // 상세페이지에서 댓글 입력시 보내준 게시글 번호로 → 상세페이지 이동하도록 요청
//                     // res.redirect("/brddetail/" + result2.brdid);
//                     res.redirect("/brddetail/" + req.body.prdid);
//                 })
//             });
//         });
//     });
// });


// // 댓글 삭제 요청
// app.get("/deletecomment/:no",function(req,res){
//     // 해당 댓글의 게시글(부모) 번호값을 찾아온 후 댓글을 삭제하고
//     db.collection("ex12_comment").findOne({comNo:Number(req.params.no)},function(err,result1){
//         db.collection("ex12_comment").deleteOne({comNo:Number(req.params.no)},function(err,result2){
//             // 그 다음 해당 상세페이지로 다시 이동 (게시글 번호 값)!
//             // 댓 삭제 후 findOne으로 찾아온 comPrd ← 게시글(부모)의 번호
//             res.redirect("/brddetail/" + result1.comPrd);
//         });
//     });
// });


// 파일 업로드 하는 방법
// 1. db의 collection에 업로드한 파일명을 저장할 컬렉션을 하나 만들어준다.

// 2. ejs 파일에 form태그를 만들어주고 그 안에 enctype="multipart/form-data"를 입력해준다.
// ex. <form action="/upload" method="post" enctype="multipart/form-data">

// 3. server.js에서 get 요청으로 특정 경로에 들어가면 파일 업로드 기능이 담긴 ejs파일을 열어주도록 한다.

// 4. 다음의 코드를 server.js에서 입력해준다

  
// 5. post 요청으로 db의 컬렉션 안에 업로드 파일의 정보를 insertOne 해준다.
// “/경로”와 function 사이에 꼭 upload.single('fileUpload')를 넣어줘야 한다!!
// app.post("/add",upload.single('fileUpload'),function(req,res){
//     db.collection("ex13_board").insertOne({
//         fileName:req.file.originalname
//     },function(err,result){
//         res.redirect("/brdlist");
//     });
// });

// 6. 업로드한 파일을 볼 상세페이지 ejs파일에서 a태그에 href=”/업로드한 파일이 들어있는 경로/<%- db의 컬렉션에 올라간 파일 정보 %>” download="" 를 써줘서 a태그 클릭시 해당 파일을 다운로드 할 수 있도록 해준다.
// <a href=”/upload/<%- brdData.fileName” download="">다운로드</a>

// 업로드한 파일 수정 방법
// 1. 수정 파일 ejs를 get 요청
// app.get("/edit/:no",function(req,res){
//     db.collection("ex13_board").findOne({brdid:Number(req.params.no)},function(err,result){
//         res.render("edit",{brdData:result,userData:req.user});
//     });
// });

// 2. ejs파일로 수정할 페이지를 만들고 input hidden으로 value값으로 게시글의 번호값을 가진 태그를 만든다.

// 3. post 요청으로 다음과 같이 요청해준다.
// app.post("/edit",upload.single('fileUpload'),function(req,res){
//     db.collection("ex13_board").updateOne({brdid:Number(req.body.id)},{$set:{
//         brdtitle:req.body.title,
//         brdcontext:req.body.context,
//         fileName:req.file.originalname
//     }},function(err,result){
//         res.redirect("/brddetail/" + req.body.id);
//     });
// });