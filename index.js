const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

const Object = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wr73bj1.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// console.log(uri);

app.use(cors())

app.use(express.json())

async function run() {
    try {
        await client.connect();
        const database = client.db("geniusCarMechanic");
        const servicesCollection = database.collection("services");

        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});

            const services = await cursor.toArray();
            res.send(services)
        })

        // GET Single Service 

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;

            console.log('Getting specific service');
            const query = { _id: Object(id) };

            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        app.get('/hello', (req, res) => {
            res.send('Hello updated')
        })

        //POST API
        app.post('/services', async (req, res) => {


            const service = req.body
            console.log('Hit the post API', service)
            const result = await servicesCollection.insertOne(service);

            console.log(result);

            res.json(result)
        });

        //Delete api
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: Object(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })



    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Genius server');

})

app.listen(port, () => {
    console.log('Runing genius server on Port', port);
})


/*
One Time
1. heroku account opening
2. Heroku software installation

Every Project
1. git init
2. .gitignore (node_module,.env)
3. push everything to git
4. make sure yo have this script: "start": "node index.js",
5. Make sure: put process.env.PORT in front of your port numeral
6. heroku login
7. heroku create (only one time a projects)
8. command : git push heroku main

----------------------------------------------------------------

update:
1. git add. , git commit -m" ", git push
2. git push heroku main

*/