const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors({
  origin:'http://localhost:8080'
}))
const dbFilePath = './db.json';

const readDatabase = () => {
  const data = fs.readFileSync(dbFilePath, 'utf8');
  return JSON.parse(data);
};

const writeDatabase = (data) => {
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
};

// Endpoint to handle adding posts
app.post('/posts', (req, res) => {
  console.log(req.body)
  const { title, description, image, user } = req.body;

  const db = readDatabase();
  const newPost = {
    id: `post${db.posts.length + 1}`, // Generating a unique post ID
    title,
    description,
    image,
    user
  };
  db.posts.push(newPost);
  writeDatabase(db);
  res.json({ success: true, post: newPost });
});


app.get('/posts', (req, res) => {
  const { userId } = req.query;
  const db = readDatabase();

  if (userId) {
    const userPosts = db.posts.filter(post => post.userId === userId);
    return res.json(userPosts);
  }

  res.json(db.posts);
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
