import Post from '../models/post';
import cloudinary from 'cloudinary';

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET
});
const createPost = async (req, res) => {
	const { content } = req.body;
	if (!content.length) {
		return res.json({ error: 'content should be provide' });
	}

	try {
		const post = new Post({ content, postedBy: req.user._id });
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

		console.log('upload image ', result);

		res.json({
			url: result.secure_url,
			public_id: result.public_id
		});
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};
export { createPost, uploadImage };
