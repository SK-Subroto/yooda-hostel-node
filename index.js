const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.e3jxy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('yooda-hostel');
        const foodsCollection = database.collection('foods');
        const studentsCollection = database.collection('students');
        const distributionsCollection = database.collection('distributions');
        const usersCollection = database.collection('users');

        /* -------food------ */
        // GET API
        app.get('/foods', async (req, res) => {
            const cursor = foodsCollection.find({});
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let foods = [];
            const count = await cursor.count();
            if (page) {
                foods = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                foods = await cursor.toArray();
            }
            res.send({
                count,
                foods: foods
            });
        })

        app.get('/foods/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const food = await foodsCollection.findOne(query);
            res.send(food);
        })
        // POST API
        app.post('/foods', async (req, res) => {
            const newFood = req.body;
            const result = await foodsCollection.insertOne(newFood);
            res.json(result);
        })

        // DELETE API
        app.delete('/foods/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await foodsCollection.deleteOne(query);
            res.json(result);
        })

        // UPDATE API
        app.put('/foods/:id', async (req, res) => {
            const id = req.params.id;
            const updateFood = req.body;
            const filter = { _id: ObjectId(id) };
            // const options = { upset: true };
            delete updateFood._id
            const updateDoc = {
                $set: {
                    ...updateFood
                },
            }
            const result = await foodsCollection.updateOne(filter, updateDoc);
            res.json(result);
        })

        /* -------Student------ */
        // GET API
        app.get('/students', async (req, res) => {
            const cursor = studentsCollection.find({});
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let students = [];
            const count = await cursor.count();
            if (page) {
                students = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                students = await cursor.toArray();
            }
            res.send({
                count,
                students: students
            });
        })

        app.get('/students/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const student = await studentsCollection.findOne(query);
            res.send(student);
        })

        app.get('/students-roll/:roll', async (req, res) => {
            const roll = req.params.roll;
            const query = { roll: roll };
            const student = await studentsCollection.findOne(query);
            res.send(student);
        })

        // POST API
        app.post('/students', async (req, res) => {
            const newStudent = req.body;
            const result = await studentsCollection.insertOne(newStudent);
            res.json(result);
        })



        // DELETE API
        app.delete('/students/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await studentsCollection.deleteOne(query);
            res.json(result);
        })

        // UPDATE STATUS API
        app.put('/students-status/:id', async (req, res) => {
            const id = req.params.id;
            const updateStudent = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upset: true };
            const updateDoc = {
                $set: {
                    status: updateStudent.status
                },
            }
            const result = await studentsCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })

        // UPDATE MULTI STATUS API
        app.put('/students-mutiple-status/', async (req, res) => {
            const updateDoc = {
                $set: {
                    status: true
                },
            }
            const result = await studentsCollection.updateMany({}, updateDoc);
            res.json(result);
        })

        // UPDATE API
        app.put('/students/:id', async (req, res) => {
            const id = req.params.id;
            const updateStudent = req.body;
            const filter = { _id: ObjectId(id) };
            // const options = { upset: true };
            delete updateStudent._id
            const updateDoc = {
                $set: {
                    ...updateStudent
                },
            }
            const result = await studentsCollection.updateOne(filter, updateDoc);
            res.json(result);
        })

        /* -------Distribution------ */
        // get api
        app.get('/distributions', async (req, res) => {
            const roll = req.query.roll;
            const date = req.query.date;
            const shift = req.query.shift;

            const cursor = distributionsCollection.find({ roll: roll, date: date, shift: shift });
            reviews = await cursor.toArray();
            res.json(reviews);
        })

        // post api
        app.post('/distributions', async (req, res) => {
            const newDistribution = req.body;
            const result = await distributionsCollection.insertOne(newDistribution);
            res.json(result);
        })

    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('This is home');
});

app.get('/test', (req, res) => {
    res.send('This is test');
});

app.listen(port, () => {
    console.log('server is up and running at', port);
})