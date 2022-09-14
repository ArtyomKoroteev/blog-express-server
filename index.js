import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import { registrationValidation } from './validation/auth.js';
import { loginValidation } from './validation/login.js';
import { postCreateValidation } from './validation/post.js';
import * as User from './controllers/User.js';
import * as Post from './controllers/Post.js';
import checkAuth from './utils/checkAuth.js';

mongoose.
connect('mongodb+srv://Admin:wwwwww@cluster0.qai7e.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => console.log('DB okay'))
  .catch((err) => console.log('DB error', err))

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null, 'uploads');
  },
  filename: (req, file, cb) =>{
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.post('/auth/register', registrationValidation, User.register);

app.post('/auth/login', loginValidation, User.login);

app.get('/auth/session', checkAuth, User.session);

app.post('/posts', checkAuth, postCreateValidation, Post.createPost);

app.get('/posts', Post.getPosts);

app.get('/posts/:id', Post.getPost);

app.delete('/posts/:id', checkAuth, Post.deletePost);

app.patch('/posts/:id', checkAuth, postCreateValidation, Post.updatePost);

app.listen(4444, (err) => {
  if (err) {
    console.log('Server error', err);
  }

  console.log('Server OK');
});
