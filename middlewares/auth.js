import Post from '../models/post';
import expressJwt from 'express-jwt';

export const requireSignin = expressJwt({
	secret: process.env.JWT_SECRET,
	algorithms: [ 'HS256' ]
});

export const canEditDeletePost = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params._id);
		if (req.user._id != post.postedBy) {
			res.sendStatus('not authorize');
		} else {
			next();
		}
	} catch (error) {
		console.log(error);
	}
};
