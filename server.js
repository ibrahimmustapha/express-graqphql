const express = require('express')
const expressGraphQL = require('express-graphql').graphqlHTTP
const {
    GraphQLSchema, 
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql') 
const app = express()

// Fake authors data
const authors = [
    { id: 1, name: 'Mustapha B. Ibrahim'},
    { id: 2, name: 'Kelvin A. Boateng'},
    { id: 3, name: 'Prince KK. Adjei'}
]

// Fake books data
const books = [
    { id: 1, name: 'Cracking the Coding Interview', authorId: 1},
    { id: 2, name: 'Book of Life', authorId: 1},
    { id: 3, name: 'Rich Dad Poor Dad', authorId: 1},
    { id: 4, name: 'Avengers Endgame', authorId: 2},
    { id: 5, name: 'Spiderman No Way Home', authorId: 2},
    { id: 6, name: 'Black Panther', authorId: 2},
    { id: 7, name: 'Captain America', authorId: 3},
    { id: 8, name: 'Ada the Snake Girl', authorId: 3},
]

// * Define a book object-type
const BookType = new GraphQLObjectType({
    name: 'Books',
    description: 'This represents a book written by an author',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLInt) },
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            }
        }
    })
})

// * Define author object-type
const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This represents an author of a books',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        books: { type: new GraphQLList(BookType), 
            resolve: (author) => {
                return books.filter(book => book.authorId === author.id)
            }
        }
    })
})

// * Create root query type 
const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        books: {
            // * List of book type
            type: new GraphQLList(BookType),
            description: 'List of all books',
            resolve: () => books
        },

        // * Single book query field
        book: {
            type: BookType,
            description: 'A Single Book',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => books.find(book => book.id === args.id)
        },

        authors: {
            // * List of book type
            type: new GraphQLList(AuthorType),
            description: 'List of all authors',
            resolve: () => authors
        },

        // * Single author query field
        author: {
            type: AuthorType,
            description: 'A single Author',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => authors.find(author => author.id === args.id)
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addBook: {
            type: BookType,
            description: 'Add a book',
            args: {
                name: { type: new GraphQLNonNull(GraphQLString)},
                authorId: { type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent, args) => {
                const book = { 
                    id: books.length + 1, 
                    name: args.name, 
                    authorId: args.authorId
                }
                books.push(book)
                return book
            }
        },
        addAuthor: {
            type: AuthorType,
            description: 'Add an author',
            args: {
                name: { type: new GraphQLNonNull(GraphQLString)},
            },
            resolve: (parent, args) => {
                const author = { 
                    id: authors.length + 1, 
                    name: args.name
                }
                authors.push(author)
                return author
            }
        }
    })
})

// * Create schema
const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})
app.use('/graphql', expressGraphQL({
    // * Call schema here
    schema: schema,

    // * Access user interface for GraphQL
    graphiql: true
}))

// * Run web server on port 5000
app.listen(5000, () => console.log('Server is Live'))