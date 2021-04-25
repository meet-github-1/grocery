const express=require('express');
const bodyparser=require('body-parser');
const app=express();
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
const MongoClient=require('mongodb').MongoClient;
const url='mongodb://localhost:27017/grocery';
var res;
var db;
MongoClient.connect(url,(err,result)=>{
    if(err) return console.log(err);
    db=result.db('grocery');
    console.log("connected to grocery");
    app.listen(3000,()=>{
        console.log("listening to port no 3000");
    })
})
app.get('/homepage',(req,res)=>{
    var tb1;
    db.collection('products').find().toArray((err,result)=>{
        if(err) console.log(err);
        else{
            tb1=result;
            console.log(tb1);
            db.collection('brands').find().toArray((err,result)=>{
                if(err) console.log(err);
                else{
                    console.log(result);
                    res.render('homepage.ejs',{data:{data1:tb1,data2:result}});
                }
            })
        } 
    })
})
app.get('/updatecategory',(req,res)=>{
    //console.log(req.query.Product_id+" "+"hello");
    res.render('updatecategory.ejs',{data:{"Product_id":req.query.Product_id,"category":req.query.category,"starting_price":req.query.starting_price,"ending_price":req.query.ending_price}});
})
app.get('/deletecategory',(req,res)=>{
    db.collection('products').deleteOne({'Product_id':req.query.Product_id},(err,result)=>{
        if(err) console.log(err);
        res.redirect('/homepage');
    })
})
app.get('/deletebrand',(req,res)=>{
    db.collection('brands').deleteOne({'brand_id':req.query.brand_id},(err,result)=>{
        if(err) console.log(err);
        res.redirect('/homepage');
    })
})
app.get('/groceryadminlogin',(req,res)=>{
    res.render('adminlogin.ejs');
})
app.get('/addcategory',(req,res)=>{
    res.render('addcategory.ejs');
})
app.get('/addbrand',(req,res)=>{
    res.render('addbrand.ejs');
})
app.get('/salesdetails',(req,res)=>{
    db.collection('purchase').find().toArray((err,result)=>{
        if(err) console.log(err);
        res.render('salesdetails.ejs',{data:result});
    })
})
app.get('/updatebrand',(req,res)=>{
    db.collection('brands').findOne({'brand_id':req.query.brand_id},(err,result)=>{
        if(err) console.log(err);
        res.render('updatebrand.ejs',{data:result});
    })
})
app.post('/validadmin',(req,res)=>{
    db.collection('adminlogin').findOne({'Username':req.body.Username,'Password':req.body.Password},(err,result)=>{
        if(err) console.log(err);
        if(result===null){
            console.log(req.body.Username,req.body.Password);
            console.log(result);
            res.render('unsuccesfullogin.ejs');
        }
        else res.redirect('/homepage');
    });
    
})
app.post('/insertcategory',(req,res)=>{
    db.collection('products').insertOne(req.body,(err,result)=>{
        if(err) console.log(err);
        res.redirect('/homepage');
    })
})
app.post('/insertbrand',(req,res)=>{
    db.collection('brands').insertOne(req.body,(err,result)=>{
        if(err) console.log(err);
        res.redirect('/homepage');
    })
})
app.post('/updcategory',(req,res)=>{
    db.collection('products').updateOne({'Product_id':req.body.Product_id},{$set:{'category':req.body.category,'starting_price':req.body.starting_price,'ending_price':req.body.ending_price}},(err,result)=>{
        if(err) console.log(err);
        else{
            res.redirect('/homepage');
        }
    })
})
app.post('/updbrand',(req,res)=>{
    db.collection('brands').updateOne({'brand_id':req.body.brand_id},{$set:{'name':req.body.name,'quantity':req.body.quantity,'stock':req.body.stock,'price':req.body.price}},(err,result)=>{
        if(err) console.log(err);
        res.redirect('/homepage');
    })
})