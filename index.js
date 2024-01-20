const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config()
const app = express()
const port = process.env.PORT || 3000;

// middleware
app.use(express.json())
app.use(cors())

// mongodb
const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.exrbbd1.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
    // await client.connect();

    // database
    const database = client.db("news_portal")
    const newscollection = database.collection("news")

    // news
    app.get('/news', async(req,res)=>{
        let query ={}
        const paperName = req.query.individual_news
        console.log(paperName)
        // for individual newspaper
        if(paperName) {
          query.newspaperName = paperName
        }

        const result = await newscollection.find(query).toArray()
        res.send(result)
    })

    app.get('/news/:id', async (req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await newscollection.findOne(query)
      console.log(result)
      res.send(result)

    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req,res) =>{
    res.send("news portal running")
})

app.listen(port,()=>{
    console.log(`news portal app listening on port ${port}`)
})