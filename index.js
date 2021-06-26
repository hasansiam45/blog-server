const express = require('express')
const app = express()
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;

require('dotenv').config()
const cors = require('cors')


app.use(cors())
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pqklg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    console.log(err)
    const blogCollection = client.db("blog").collection("posts");


  // get blogs
  app.get('/posts',(req,res)=>{

    blogCollection.find()
      .toArray((err, result) => {
        res.send(result)
      })

  })
    



  // posting blogs
    app.post('/addPost', (req, res) => {
    
        const newPost = req.body;
        blogCollection.insertOne(newPost)
            .then((err, posts) => {
                res.send(posts);
            })
        
    
    })
    
    

  // delete blogs
    app.delete('/delete/:id',(req,res)=>{

      const id = ObjectId(req.params.id)
      blogCollection.deleteOne({
      
        _id: id

      })
        .then(result => console.log(result))
        .then(err=> console.log(err))

    })
    
    
    
    
  // perform actions on the collection object
//   client.close();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})