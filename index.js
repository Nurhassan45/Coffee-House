const express = require('express');
const cors=require('cors');
const app=express();
const cors = require("cors");
app.use(cors({
  origin: "http://localhost:5174", // Allow only your frontend
  credentials: true, // If using cookies/auth
}));
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
let pass=process.env.DB_PASS;
let user=process.env.DB_USER
const uri = `mongodb+srv://CoffeHouse:jiEGnESvvogzvAJh@cls2database.fgzfrak.mongodb.net/?retryWrites=true&w=majority&appName=cls2DataBase`;

app.use(cors());
app.use(express.json());
const port=process.env.PORT||3000;

app.get('/',(req,res)=>{
    res.send("Coffe Server Running");
})
app.listen(port,()=>{
    console.log(`Coffe server running on :${port}`)
})
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    let coffesCollection=client.db("coffebd").collection('coffees');
    let userCollection=client.db("coffebd").collection('users')
    app.post('/coffees',async(req,res)=>{
        let newCoffee=req.body;
        const result=await coffesCollection.insertOne(newCoffee);
        res.send(result);
    })
    app.delete('/coffees/:id',async(req,res)=>{
        let id=req.params.id;
        let quary={_id:new ObjectId(id)}
        let result=await coffesCollection.deleteOne(quary)
        res.send(result);
    })
    app.get('/coffees',async(req,res)=>{
        const result=await coffesCollection.find().toArray();
        res.send(result);
    })
    app.get('/coffees/:id',async(req,res)=>{
        let id =req.params.id;
        let quary={_id:new ObjectId(id)}
        let result=await coffesCollection.findOne(quary);
        res.send(result);
    })
    app.put('/coffees/:id',async(req,res)=>{
      let id=req.params.id;
      let quary={_id:new ObjectId(id)};
      let upCoffeeData=req.body;
      let upDateDoc={
        $set:upCoffeeData
      }
      let result=await coffesCollection.updateOne(quary,upDateDoc);
      res.send(result);
    })
    //For User Section

    app.post('/users',async(req,res)=>{
      let userData=req.body;
      let result=await userCollection.insertOne(userData)
      res.send(result);
    })
    app.get('/users',async(req,res)=>{
      let result=await userCollection.find().toArray();
      res.send(result);
    })
    app.patch('/users',async(req,res)=>{
      let {email,LoginTime}=req.body;
      let filter={email:email};
      let updateDoc={
        $set:{
          lastSignInTime:LoginTime
        }
      }
      let result=await userCollection.updateOne(filter,updateDoc);
      res.send(result);
    })
    app.delete('/users/:id',async(req,res)=>{
      let id=req.params.id;
      let quary={_id:new ObjectId(id)}
      let result=await userCollection.deleteOne(quary);
      res.send(result);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");
  } finally {
  
  }
}
run().catch(console.dir);

