import { initManagers } from '../db/initDB';

const { postManager, userManager } = initManagers();

async function postPosts(req, res, next) {
	const refreshToken = req.cookies.refreshToken;
	const username = await userManager.findRefreshToken(refreshToken);
	let result;
	const { body: { title }, body: { body: postBody } } = req;
	if (req.body.parent) {
		const { body: { parent } } = req;
		result = await postManager.addPost(title, postBody, username, parent);
	} else {
		result = await postManager.addPost(title, postBody, username);
	}
	res.statusCode = 200;
	res.send(result);
};

async function getPosts(req, res, next) {
	let result;
	if ('number' in req.query && 'page' in req.query) {
		const { query: { number }, query: { page }, query: { sort }, query: { search } } = req;
		const filterObject: {sort?: any, search?: string} = {};
		if (sort) filterObject.sort = sort;
		if (search) filterObject.search = search;

		result = await postManager.getPostsPage(number, page, filterObject);
	} else {
		if (req.query.parent) {
			result = await postManager.getAllPosts(req.query.recursive, req.query.parent);
		} else {
			result = await postManager.getAllPosts(false);
		}
	}
	res.send(result);
}

async function getPostsId(req, res, next) {
	const result = await postManager.getPost(req.params.id);
	res.send(result);
};

async function getPostsNumber(req, res, next) {
	const result = await postManager.getNumberOfPosts();
	res.send({ result });
};

async function upvotePost(req, res, next) {
	const refreshToken = req.cookies.refreshToken;
	const username = await userManager.findRefreshToken(refreshToken);
	const result = await postManager.upvotePost(req.params.id, username, userManager);
	res.send(result);
}

async function downvotePost(req, res, next) {
	const refreshToken = req.cookies.refreshToken;
	const username = await userManager.findRefreshToken(refreshToken);
	const result = await postManager.downvotePost(req.params.id, username, userManager);
	res.send(result);
}

async function removePostReactions(req, res, next) {
	const refreshToken = req.cookies.refreshToken;
	const username = await userManager.findRefreshToken(refreshToken);
	await postManager.removeReactions(req.params.id, username, userManager);
	res.sendStatus(200);
}

export default {
	postPosts,
	getPosts,
	getPostsId,
	getPostsNumber,
	upvotePost,
	downvotePost,
	removePostReactions
};
