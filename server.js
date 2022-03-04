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

const authors = [
    { id: 1, name: 'Mustapha B. Ibrahim'},
    { id: 2, name: 'Kelvin A. Boateng'},
    { id: 3, name: 'Prince KK. Adjei'}
]

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

// * Define a booktype
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

// * Define authortype
const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This represents an author of a books',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
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
        authors: {
            // * List of book type
            type: new GraphQLList(AuthorType),
            description: 'List of all authors',
            resolve: () => authors
        }
    })
})

// * Create schema
const schema = new GraphQLSchema({
    query: RootQueryType
})
app.use('/graphql', expressGraphQL({
    // * Call schema here
    schema: schema,

    // * Access user interface for GraphQL
    graphiql: true
}))

// * Run web server on port 5000
app.listen(5000, () => console.log('Server is Live'))