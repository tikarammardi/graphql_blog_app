//demo user data
const users = [
	{
		id: '1',
		name: 'Tikaram',
		email: 'tk@gmail.com',
		age: 26
	},
	{
		id: '2',
		name: 'Kushi',
		email: 'km@gmail.com'
	},
	{
		id: '3',
		name: 'Lovely Dular',
		email: 'rm@gmail.com'
	}
];

const posts = [
	{
		id: '11',
		title: 'NodeJs',
		body: 'This is nodejs course',
		published: true,
		author: '1'
	},
	{
		id: '12',
		title: 'React',
		body: 'This is react course',
		published: false,
		author: '1'
	},
	{
		id: '13',
		title: 'Javascript',
		body: 'This is js course',
		published: true,
		author: '2'
	}
];

const comments = [
	{
		id: '22',
		text: 'First Comment',
		author: '1',
		post: '11'
	},
	{
		id: '23',
		text: 'Second Comment',
		author: '1',
		post: '11'
	},
	{
		id: '24',
		text: 'Third Comment',
		author: '2',
		post: '12'
	},
	{
		id: '25',
		text: 'Fourth Comment',
		author: '2',
		post: '13'
	}
];

const db = {
	users,
	posts,
	comments
};

export { db as default };
