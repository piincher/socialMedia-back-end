import express from 'express';
import { createPost, uploadImage, postByUser, userPost, updatePost } from '../controllers/post';
import { canEditDeletePost, requireSignin } from '../middlewares/auth';
import formidable from 'express-formidable';
const router = express.Router();

//controllers

router.post('/create-post', requireSignin, createPost);
router.post('/image-upload', requireSignin, formidable({ maxFileSize: 1.2 * 1024 * 1024 }), uploadImage);
router.get('/user-posts', requireSignin, postByUser);
router.get('/user-post/:_id', userPost);
router.put('/update-post/:_id', requireSignin, canEditDeletePost, updatePost);

module.exports = router;
