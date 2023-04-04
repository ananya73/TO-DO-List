const express=require("express");
const app=express();
let mysql = require('mysql');
const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({ extended: false}))
app.use(express.static("Public"))
let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"todo"
  });
  con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.set('view engine', 'ejs');

app.get('/', (req,res)=>{
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let today  = new Date();
    let day = today.toLocaleDateString("en-US", options);
    let show = 'select * from lists';
    con.query(show,(error, data)=>{
        if (error) throw error
        console.log(data)
        res.render("list", {PresentDay: day, newListItems: data});
    })
    
});

app.post('/update', (req,res)=>{
    let update = req.body.update;
    console.log(update)
    res.render('update', {change:update})
})

app.post('/updated', (req,res)=>{
    let update = req.body.edit;
    let value = req.body.update;
    let query = 'update lists set task = "'+value+'" where id = ' +update
    con.query(query,(error, data)=>{
        if (error) throw error
        console.log(data)
    res.redirect('/');
})    
})

app.post('/add', (req,res) =>{
     let newItem = req.body.newItem;
     let add = 'INSERT INTO `lists`(`task`) VALUES (?)'
     con.query(add,newItem,(error, data)=>{
        if (error) throw error
        console.log(data)
    res.redirect('/');
})})


app.post('/remove', (req,res) =>{
    let remObj = req.body.remove;
    let remove = 'delete from lists where id = ?'
    con.query(remove,remObj,(error, data)=>{
        if (error) throw error
        console.log(data)
    res.redirect('/');
})})


app.listen(3050);