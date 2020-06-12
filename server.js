const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const bodyParser=require('body-parser');
const cors = require("cors");
var fetchVideoInfo = require('youtube-info');
const ytdl = require('ytdl-core');

const port =process.env.PORT || 3000;

var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/views') );
app.set('view engine', hbs);



app.get('/', (req,res) => {
    res.render('index.hbs');
});

app.get('/show',(req,res)=>
{
   res.render('show.hbs');
   var id=req.query.video;
   console.log(id);
   res.app.set('url',id);
});
app.get('/downloadmp4',(req,res)=>
{
    
    let URL=res.app.get('url');
    let ID=extractVideoID(URL);
    console.log(ID);
    ytdl.getInfo(ID,(err,info)=>
    {
        if(err) throw err;
       const title=info.title;
       res.header('Content-Disposition', 'attachment; filename="'+title+'.mp4"');
       ytdl(URL, {
           format: 'mp4'
           }).pipe(res);
      
    })
   
});

app.get('/fetch',(req,res)=>{
    console.log("dksd");
    var id=res.app.get('url');
    var id=extractVideoID(id);
    fetchVideoInfo(id, function (err, videoInfo) {
        if (err) throw new Error(err);
        res.json(videoInfo);
      });

});
function extractVideoID(url){
    // console.log(url);
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    if ( match && match[7].length == 11 ){
        // console.log(match[7]);
        return match[7];
    }else{
        alert("Could not extract video ID.");
    }
}
app.listen(port, () => {
    console.log('Server is up at port ' + port);
});
