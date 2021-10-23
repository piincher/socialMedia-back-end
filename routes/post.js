import express from 'express';
import { createPost } from '../controllers/post';
import { requireSignin } from '../middlewares/auth';
const router = express.Router();

//controllers

router.post('/create-post', requireSignin, createPost);

module.exports = router;
