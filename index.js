const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
//username=studentCrud
//pass: sGRC3AtBnTkXnm4Y
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mdofc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const studentCollection = client.db("studentCrud").collection("students");
        app.get('/students', async (req, res) => {
            const query = {};
            const cursor = studentCollection.find(query);
            const students = await cursor.toArray();
            res.send({ message: 'successfully get all information', result: students })
        })
        app.post('/student', async (req, res) => {
            const student = req.body;
            const result = await studentCollection.insertOne(student);
            console.log('inserted')
            res.send({ message: 'successfully inserted' })
        })
        app.put('/student/:id', async (req, res) => {
            const id = req.params.id;
            const updatedStudent = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: updatedStudent
            };
            const result = await studentCollection.updateOne(filter, updateDoc, options);

            res.send(result)
        })
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/home', (req, res) => {
    res.send('running')
})

app.listen(port, () => {
    console.log('port is connected');
});