import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
const uri = process.env.MONGO_URI
const app = express();
const port = process.env.PORT || 5000;
//middlewares
app.use(cors());
app.use(express.json());

//mongo client
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

const run = async () => {
    try{
        await client.connect();

        const taskCollection = client.db('taskDB').collection('taskCollection');

        app.get('/',async(req,res)=>{
            await res.send('Server Running....!')
        })

        app.post('/tasks',async(req,res)=>{
            const task = req.body;
            const result = await taskCollection.insertOne(task)
            res.send(result)

        })

        app.get('/tasks',async(req,res)=>{
            const cursor = taskCollection.find()
            const tasks = await cursor.toArray()
            res.send(tasks)
        })

        app.get('tasks/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}

            const result = await taskCollection.findOne(query)
            res.send(result)
        })

        app.delete('/tasks/:id',async (req,res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await taskCollection.deleteOne(query);
            res.send(result)

        })

        app.patch('/tasks/:id',async(req,res)=>{
            const id = req.params.id;
            const task = req.body;
            const filter = {_id: new ObjectId(id)};
            const options = {upsert:true};
            const updatedTask = {
                $set:{
                    task: task.task
                }
            }
            const result = await taskCollection.updateOne(filter,updatedTask,options)
            res.send(result)
        })

        app.put('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const task = req.body;
            const filter = {_id: new ObjectId(id)};
            const options = {upsert:true};
            const updatedTask = {
                $set:{
                    status: task.status,
                }
            }
            const result = await taskCollection.updateOne(filter,updatedTask,options)
            res.send(result)
          });
          

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally{

    }
}

run().catch(error => console.log)

app.listen(port,()=>console.log('Server Running on port',port))