import Post from '../models/post';
import cloudinary from 'cloudinary';

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET
});
const createPost = async (req, res) => {
	const { content, image } = req.body;
	if (!content.length) {
		return res.json({ error: 'content should be provide' });
	}

	try {
		const post = new Post({ content, image, postedBy: req.user._id });
		post.save();
		res.json(post);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const uploadImage = async (req, res) => {
	//console.log(req.files);

	try {
		const result = await cloudinary.uploader.upload(req.files.image.path);

		//console.log('upload image ', result);

		res.json({
			url: result.secure_url,
			public_id: result.public_id
		});
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const postByUser = async (req, res) => {
	try {
		const posts = await Post.find()
			//Post.find({ postedBy: req.user._id })

			.populate('postedBy', '_id name image ')
			.sort({ createdAt: -1 })
			.limit(10);

		res.json(posts);
	} catch (error) {}
};

const userPost = async (req, res) => {
	try {
		const post = await Post.findById(req.params._id);

		res.json(post);
	} catch (error) {
		console.log(error);
		res.sendStatus('try again');
	}
};
const updatePost = async (req, res) => {
	try {
		const post = await Post.findByIdAndUpdate(req.params._id, req.body, {
			new: true
		});

		res.json(post);
	} catch (error) {}
};
export { createPost, uploadImage, postByUser, userPost, updatePost };
