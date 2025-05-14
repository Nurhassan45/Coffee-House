const express = require('express');
const cors=require('cors');
const app=express();
app.use(cors());
app.use(express.json());
const port=process.env.PORT||3000;
app.get('/',(req,res)=>{
    res.send("Coffe Server Running");
})
app.listen(port,()=>{
    console.log(`Coffe server running on :${port}`)
})