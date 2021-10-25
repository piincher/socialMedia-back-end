import express from 'express';
import { createPost, uploadImage, postByUser } from '../controllers/post';
import { requireSignin } from '../middlewares/auth';
import formidable from 'express-formidable';
const router = express.Router();

//controllers

router.post('/create-post', requireSignin, createPost);
router.post('/image-upload', requireSignin, formidable({ maxFileSize: 1.2 * 1024 * 1024 }), uploadImage);
router.get('/user-posts', requireSignin, postByUser);

module.exports = router;
