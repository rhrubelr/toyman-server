const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleWare 
app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ucimkya.mongodb.net/?retryWrites=true&w=majority`;

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

        const productsCollection = client.db("assignment-11").collection('toys');
        const toysCollection = client.db("assignment-11").collection('products');
        
        // received data to database
        app.get('/products/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await toysCollection.findOne(query)
            res.send(result)
        })
        app.get('/products', async (req, res) => {
            const cursor = toysCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // json data to database 
        app.get('/toys', async (req, res) => {
            const cursor = productsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        

        // for update data 
        app.get('/toys/:id', async (req, res)=>{
            const id = id.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await productsCollection.findOne(query)
            res.send(result)
        })

        // received data to client site 
        app.post('/toys', async (req, res) => {
            const NewProduct = req.body;
            console.log(NewProduct)
            const result = await productsCollection.insertOne(NewProduct);
            res.send(result)

        })


        
       app.delete('/toys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productsCollection.deleteOne(query)
      res.send(result)
    })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('server site is running')
})

app.listen(port, () => {
    console.log(`server site port is running: ${port}`)
})


