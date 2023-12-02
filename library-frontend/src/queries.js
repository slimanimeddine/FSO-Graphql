import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
    query {
      allAuthors {
        name
        bookCount
        born
        id
      }
    }
`

export const ALL_BOOKS = gql`
    query {
      allBooks {
        title
        published
        author {
          name
          born
          id
        }
        genres
        id
      }
    }
`

export const ADD_BOOK = gql`
    mutation AddBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
      addBook(title: $title, author: $author, published: $published, genres: $genres) {
        title
        published
        author {
          name
          born
          id
        }
        genres
        id
    }
  }
`

export const EDIT_BORN = gql`
  mutation EditBorn($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
      bookCount
      id
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const ME = gql`
  query Me {
    me {
      username
      favoriteGenre
      id
    }
  }
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
        title
        published
        author {
          name
          born
          id
        }
        genres
        id
    }
  }
`