import uuidv4 from 'uuid/v4';
const Mutation = {
	createUser(parent, args, { db }, info) {
		const emailTaken = db.users.some((user) => {
			return user.email === args.data.email;
		});

		if (emailTaken) {
			throw new Error('Email taken.');
		}

		const user = {
			id: uuidv4(),
			...args.data
		};

		db.users.push(user);
		return user;
	},
	deleteUser(parent, args, { db }, info) {
		const userIndex = db.users.findIndex((user) => {
			return user.id === args.id;
		});

		if (userIndex === -1) {
			throw new Error('User not found');
		}

		const deleteUser = db.users.splice(userIndex, 1);
		db.posts = db.posts.filter((post) => {
			const match = post.author === args.id;
			if (match) {
				db.comments = db.comments.filter((comment) => {
					return comment.post !== post.id;
				});
			}
			return !match;
		});

		db.comments = db.comments.filter((comment) => comment.author !== args.id);

		return deleteUser[0];
	},
	updateUser(parent, args, { db }, info) {
		const { id, data } = args;
		const user = db.users.find((user) => user.id === id);
		if (!user) {
			throw new Error('No User Found');
		}

		if (typeof data.email === 'string') {
			const emailTaken = db.users.some((user) => user.email.data.email);
			if (emailTaken) {
				throw new Error('Email Taken');
			}

			user.email = data.email;
		}

		if (typeof data.name === 'string') {
			user.name = data.name;
		}

		if (typeof data.age !== 'undefined') {
			user.age = data.age;
		}

		return user;
	},
	createPost(parent, args, { db, pubsub }, info) {
		const userExists = db.users.some((user) => user.id === args.data.author);

		if (!userExists) {
			throw new Error('User not Found');
		}

		const post = {
			id: uuidv4(),
			...args.data
		};
		db.posts.push(post);
		if (args.data.publish) {
			pubsub.publish('post', {
				post: {
					mutation: 'CREATED',
					data: post
				}
			});
		}
		return post;
	},
	deletePost(parent, args, { db, pubsub }, info) {
		const postIndex = db.posts.findIndex((post) => post.id === args.id);

		if (postIndex === -1) {
			throw new Error('No Post Found');
		}
		const [ post ] = db.posts.splice(postIndex, 1);
		db.comments = db.comments.filter((comment) => comment.post !== args.id);

		if (post.publish) {
			pubsub.publish('post', {
				post: 'DELETED',
				data: post
			});
		}

		return post;
	},
	updatePost(parent, args, { db, pubsub }, info) {
		const { id, data } = args;

		const post = db.posts.find((post) => post.id === id);
		const originalPost = { ...post };
		if (!post) {
			throw new Error('No post found');
		}

		if (typeof data.title === 'string') {
			post.title = data.title;
		}
		if (typeof data.body === 'string') {
			post.body = data.body;
		}

		if (typeof data.published === 'boolean') {
			post.published = data.published;

			if (originalPost.published && !post.published) {
				//deleted
				pubsub.publish('post', {
					post: {
						mutation: 'DELETED',
						data: originalPost
					}
				});
			} else if (!originalPost.published && post.published) {
				//created
				pubsub.publish('post', {
					post: {
						mutation: 'CREATED',
						data: post
					}
				});
			} else if (post.published) {
				//updated
				pubsub.publish('post', {
					post: {
						mutation: 'UPDATED',
						data: post
					}
				});
			}
		}

		return post;
	},
	updateComment(parent, args, { db, pubsub }, info) {
		const { id, data } = args;
		const comment = db.comments.find((comment) => comment.id === id);

		if (!comment) {
			throw new Error('No Comment found');
		}
		if (typeof data.text === 'string') {
			comment.text = data.text;
		}
		pubsub.publish(`comment ${comment.post}`, {
			comment: {
				mutation: 'UPDATED',
				data: comment
			}
		});
		return comment;
	},
	createComment(parent, args, { db, pubsub }, info) {
		const userExists = db.users.some((user) => {
			return user.id === args.data.author;
		});
		const postExists = db.posts.some((post) => {
			return post.id === args.data.post && post.published;
		});
		if (!userExists || !postExists) {
			throw new Error('Unable to find user and post');
		}

		const comment = {
			id: uuidv4(),
			...args.data
		};

		db.comments.push(comment);
		pubsub.publish(`comment ${args.data.post}`, {
			comment: {
				mutation: 'CREATED',
				data: comment
			}
		});
		return comment;
	},
	deleteComment(parent, args, { db, pubsub }, info) {
		const commentIndex = db.comments.findIndex((comment) => comment.id === args.id);

		if (commentIndex === -1) {
			throw new Error('NO Comment Found');
		}

		const [ deletedComment ] = db.comments.splice(commentIndex, 1);
		pubsub.publish(`comment ${deletedComment.post}`, {
			comment: {
				mutation: 'DELETED',
				data: deletedComment
			}
		});

		return deletedComment;
	}
};

export default Mutation;
