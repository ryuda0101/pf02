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
    db.collection("board").find({}).toArray((err,result_brd) => {
        db.collection("prdlist").find({category:"도넛"}).toArray((err,result) => {
            res.render("index.ejs",{prdData:result, brdData:result_brd});
        });
    })
});

// 관리자 메인화면 get 요청
app.get("/admin/home",(req,res) => {
    res.render("admin_index",{userData:req.user});
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
    res.redirect("/admin/home")
    // res.send("로그인 성공");
});

// 로그인 실패시 fail 경로
app.get("/fail",(req,res) => {
    res.send("<script>alert('로그인 실패'); location.href = '/admin'</script>");
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
        return done(null, false, { message: '비밀번호가 틀렸습니다' })
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
            category:req.body.category,
            taste:req.body.taste,
            price:req.body.price,
            calorie:req.body.calorie,
            nutrition:req.body.nutrition,
            allergy:req.body.allergy
        },(err,result) => {
            db.collection("count").updateOne({name:"상품등록"},{$inc:{prdCount:1}},(err,result) => {
                res.redirect("/admin/prdlist")
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
        category:req.body.categoryUp,
        taste:req.body.tasteUp,
        price:req.body.priceUp,
        calorie:req.body.calorieUp,
        nutrition:req.body.nutritionUp,
        allergy:req.body.allergyUp
    }},function(err,result){
        // 상품 상세페이지로 다시 이동
        res.redirect("/admin/prdlist");
    });
});

// 상품정보 삭제 요청
app.get ("/prdDelete/:no",function(req,res){
    db.collection("prdlist").deleteOne({num:Number(req.params.no)},function(err,result){
        // res.send("<script>let check = confirm('삭제하시겠습니까?'); if(!check) {event.preventDefault();} else {location.href = '/admin/prdlist';}</script>");
        res.redirect("/admin/prdlist");
    })
});

// 관리자 매장 등록 페이지
app.get("/admin/storeList",(req,res) => {
    db.collection("storelist").find({}).toArray((err,result) => {
        res.render("admin_store_list",{storeData:result, userData:req.user})
    });
});

// 매장 등록 페이지에서 전송한 값 db에 넣어주기
app.post("/add/storelist",(req,res) => {
    db.collection("count").findOne({name:"매장등록"},(err,result1) => {
        db.collection("storelist").insertOne ({
            num:result1.storeCount + 1,
            name:req.body.name,
            sido:req.body.sido,
            sigugun:req.body.gugun,
            address:req.body.detail,
            phone:req.body.phone
        },(err,result) => {
            db.collection("count").updateOne({name:"매장등록"},{$inc:{storeCount:1}},(err,result) => {
                res.redirect("/admin/storelist")
            });
        });
    });
});

// 매장정보 수정
app.post("/storeUpdate",(req,res) => {
    // 해당 게시글 번호에 맞는 게시글 수정 처리
    // req.body.~~ 경로의 정보를 받아오지 못하는 문제가 있음 / 해결, 수정시에도 파일 업로드 기능을 사용하기 위해 ,upload.single('thumbnailUp'), 코드를 쓰는것으로 해결
    db.collection("storelist").updateOne({num:Number(req.body.hiddenNo)},{$set:{
        name:req.body.name,
        sido:req.body.sido,
        sigugun:req.body.gugun,
        address:req.body.detail,
        phone:req.body.phone
    }},function(err,result){
        // 상품 상세페이지로 다시 이동
        res.redirect("/admin/storelist");
    });
});

// 매장정보 삭제 요청
app.get ("/storeDelete/:no",function(req,res){
    db.collection("storelist").deleteOne({num:Number(req.params.no)},function(err,result){
        res.redirect("/admin/storelist");
    })
});

// 관리자 게시판 페이지
app.get("/admin/board",(req,res) => {
    db.collection("board").find({}).toArray((err,result) => {
        res.render("admin_brd_list",{brdData:result, userData:req.user});
    });
});

// 관리자 게시글 작성 페이지
app.get("/admin/board_insert",(req,res) => {
    res.render("admin_brd_insert",{userData:req.user});
});

app.post("/add/board",upload.single('file'),(req,res) => {
    if (req.file) {
        fileInfo = req.file.originalname;
    }
    else {
        fileInfo = null;
    }
    db.collection("count").findOne({name:"게시글"},(err,result) => {
        db.collection("board").insertOne ({
            num:result.brdCount + 1,
            title:req.body.title,
            date:req.body.date,
            classification:req.body.classification,
            file:fileInfo,
            context:req.body.context
        },(err,result) => {
            db.collection("count").updateOne({name:"게시글"},{$inc:{brdCount:1}},(err,result) => {
                res.redirect("/admin/board")
            });
        });
    });
});

// 관리자 게시글 상세 페이지
app.get("/admin/detail/:no",(req,res) => {
    db.collection("board").find({num:Number(req.params.no)}).toArray((err,result) => {
        res.render("admin_brd_detail",{brdData:result, userData:req.user});
    });
});

// 관리자 게시글 수정 페이지
app.get("/edit/:no",(req,res) => {
    db.collection("board").find({num:Number(req.params.no)}).toArray((err,result) => {
        res.render("admin_brd_edit",{brdData:result, userData:req.user});
    });
});

app.post("/update/board",upload.single('file'),(req,res) => {
    if (req.file) {
        fileInfo = req.file.originalname;
    }
    else {
        fileInfo = req.body.originFile;
    }
    db.collection("board").updateOne({num:Number(req.body.num)},{$set:{
        title:req.body.title,
        date:req.body.date,
        classification:req.body.classification,
        file:fileInfo,
        context:req.body.context
    }},(err,result) => {
        res.redirect("/admin/board");
    });
});

// 게시글 삭제 기능
app.get("/delete/:no",(req,res) => {
    db.collection("board").deleteOne({num:Number(req.params.no)},(err,result) => {
        res.redirect("/admin/board");
    });
});






// 사용자가 보는 메뉴 페이지
app.get("/menu/doughnut",(req,res) => {
    db.collection("prdlist").find({category:"도넛"}).toArray((err,result) => {
        res.render("menu_list",{prdData:result});
    });
});
app.get("/menu/coffee",(req,res) => {
    db.collection("prdlist").find({category:"커피"}).toArray((err,result) => {
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

// 도넛 상세 페이지
app.get("/doughnut/:no",(req,res) => {
    db.collection("prdlist").find({num:Number(req.params.no)}).toArray((err,result) => {
        res.render("doughnut_detail",{prdData:result});
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

// 사용자가 보는 매장 페이지
app.get("/storelist",(req,res) => {
    db.collection("storelist").find({}).toArray((err,result) => {
        res.render("store_list",{storeData:result});
    });
});

// input 태그로 검색시
app.get("/search/storename",(req,res) => {
    let storeSearch = [
        {
          $search: {
            index: 'store_search',
            text: {
              query: req.query.name,
              path: "name"
            }
          }
        }
      ]
      if (req.query.name !== "") {
        db.collection("storelist").aggregate(storeSearch).toArray((err,result) => {
            res.render("store_list",{storeData:result});
        });
      }
      else {
        res.redirect("/storelist");
      }
});

// select 태그로 검색시
// 매장 지역검색 경과화면 페이지
app.get("/search/local",(req,res) => {
    // 시/도 선택시
    // form태그에서 post로 썼을 때 →  req.body.name   /   form태그에서 get으로 썼을 때 →  req.query.name
    if(req.query.sido !== "" && req.query.gugun === ""){
      db.collection("storelist").find({sido:req.query.sido}).toArray((err,result) => {
        res.render("store_list",{storeData:result});
      });
    }
    // 시/도 구/군 선택시
    else if (req.query.sido !== "" && req.query.gugun !== ""){
      db.collection("storelist").find({sido:req.query.sido, sigugun:req.query.gugun}).toArray((err,result) => {
        res.render("store_list",{storeData:result});
      });
    }
    // 아무것도 선택하지 않았을때
    else {
      res.redirect("/storelist");
    }
  });

// 사용자가 보는 게시판 페이지
// 새로운 소식
app.get("/board/news", (req,res) => {
    db.collection("board").find({classification:"news"}).toArray((err,result) => {
        res.render("board_news_list",{brdData:result});
    });
});
// 공지사항
app.get("/board/notice", (req,res) => {
    db.collection("board").find({classification:"notice"}).toArray((err,result) => {
        res.render("board_notice_list",{brdData:result});
    });
});
// 게시글 상세 페이지
app.get("/detail/:no",(req,res) => {
    db.collection("board").find({num:Number(req.params.no)}).toArray((err,result) => {
        res.render("board_detail",{brdData:result});
    });
});