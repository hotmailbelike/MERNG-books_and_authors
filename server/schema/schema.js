const graphql = require('graphql');
const _ = require('lodash');

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLSchema,
	GraphQLID,
	GraphQLInt,
	GraphQLList,
} = graphql;

//dummy data
var books = [
	{ name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '1' },
	{ name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2' },
	{ name: 'The Hero of Ages', genre: 'Fantasy', id: '4', authorId: '2' },
	{ name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3' },
	{ name: 'The Colour of Magic', genre: 'Fantasy', id: '5', authorId: '3' },
	{ name: 'The Light Fantastic', genre: 'Fantasy', id: '6', authorId: '3' },
];

var authors = [
	{ name: 'Patrick Rothfuss', age: 44, id: '1' },
	{ name: 'Brandon Sanderson', age: 42, id: '2' },
	{ name: 'Terry Pratchett', age: 66, id: '3' },
];

const BookType = new GraphQLObjectType({
	name: 'Book',
	description: 'This represents a book written by an author',
	fields: () => ({
		id: {
			type: GraphQLID,
		},
		name: {
			type: GraphQLString,
		},
		genre: {
			type: GraphQLString,
		},
		author: {
			type: AuthorType,
			resolve: (book) => _.find(authors, { id: book.authorId }),
		},
	}),
});

const AuthorType = new GraphQLObjectType({
	name: 'Author',
	description: 'This represents an author of a book',
	fields: () => ({
		id: {
			type: GraphQLID,
		},
		name: {
			type: GraphQLString,
		},
		age: {
			type: GraphQLInt,
		},
		books: {
			type: GraphQLList(BookType),
			resolve: (author) => _.filter(books, { authorId: author.id }),
		},
	}),
});

const RootQuery = new GraphQLObjectType({
	name: 'Root',
	description: 'Root Query',
	fields: {
		book: {
			type: BookType,
			description: 'Get a single Book',
			args: {
				id: {
					type: GraphQLID,
				},
			},
			resolve: (book, args) => _.find(books, { id: args.id }),
		},
		author: {
			type: AuthorType,
			description: 'Get a single Author',
			args: {
				id: {
					type: GraphQLID,
				},
			},
			resolve: (author, args) => _.find(authors, { id: args.id }),
		},
		books: {
			type: GraphQLList(BookType),
			description: 'List Books',
			resolve: (book, args) => books,
		},
		authors: {
			type: GraphQLList(AuthorType),
			description: 'List Authors',
			resolve: (author, args) => authors,
		},
	},
});

module.exports = new GraphQLSchema({
	query: RootQuery,
});
