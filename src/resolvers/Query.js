const Query = {
	users(parent, args, { db }, info) {
		if (!args.query) {
			return db.users;
		}
		return users.filter((user) => {
			return user.name.toLowerCase().includes(args.query.toLowerCase());
		});
	},
	posts(parent, args, { db }, info) {
		if (!args.query) {
			return db.posts;
		}
		return db.posts.filter((post) => {
			const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
			const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());

			return isBodyMatch || isTitleMatch;
		});
	},
	comments(parent, args, ctx, info) {
		return ctx.db.comments;
	},
	me() {
		return {
			id: 'jfdfjklj',
			name: 'Tikaram Mardi',
			email: 'tk@gmail.com',
			age: 26
		};
	},
	post() {
		return {
			id: 'dfjkdf',
			title: 'New Course',
			body: 'this is my first post',
			published: true
		};
	}
};

export default Query;
