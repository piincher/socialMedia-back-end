import Post from '../models/post';
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
	console.log(req.files);
};
export { createPost, uploadImage };
