const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const { 
  UserInputError,
  AuthenticationError,
} = require('apollo-server')
const jwt = require('jsonwebtoken')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(), 
    authorCount: async () => Author.collection.countDocuments(), 
    allBooks: async (root, args) => {
        if (!args.author && !args.genre) {
            return Book.find({}).populate('author')
        }

        else if (!args.author && args.genre) {
            return Book.find({ genres: { $in: [args.genre] } }).populate('author')
        }

        else if (args.author && !args.genre) {
            const author = await Author.find({ name: args.name })
            return Book.find({ author: { $in: [author.id] } }).populate('author')
        }
        
        else {
            const author = await Author.find({ name: args.name })
            return Book.find(
              { genres: { $in: [args.genre] } },
              { author: { $in: [author.id] } }
            ).populate('author')
        }
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      let author = await Author.findOne({ name: args.author }) 

      if (!author) {
        author = new Author({
          name: args.author,
          born: null,
          bookCount: 1
        })

        try {
          await author.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args
          })  
        }
      }

      const book = new Book({
        ...args,
        author
      })

      try {
        await book.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })  
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book })
    
      return book
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }

      author.born = args.setBornTo

      try {
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })  
      }
    
      return author
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre
      })

      return user.save()
        .catch(err => {
          throw new UserInputError(err.message, {
            invalidArgs: args
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if ( !user || args.password !== 'secret' ) {
        throw new UserInputError('wrong credentials')
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
}

module.exports = resolvers