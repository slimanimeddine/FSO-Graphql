import { useQuery } from "@apollo/client"
import { useEffect, useState } from "react"
import { ALL_BOOKS } from '../queries'
import BooksTable from './BooksTable'

const BookFilter = ({ genres, setFilterGenre }) => {
  return (
    <div>
      {genres.map(genre => (
        <button
          key={genre}
          onClick={() => setFilterGenre(genre)}
        >
          {genre}
        </button>
      ))}
    </div>
  )
}

const Books = ({ show }) => {
  const { data } = useQuery(ALL_BOOKS)
  const [genres, setGenres] = useState(new Set())
  const [filterGenre, setFilterGenre] = useState('all genres')

  useEffect(() => {
    if (data?.allBooks) {
      setGenres(new Set((data?.allBooks?.flatMap(book => book.genres))))
    }
  }, [data])

  const filteredBooks = filterGenre !== 'all genres' ? data?.allBooks.filter(book => book.genres.includes(filterGenre)) : data?.allBooks

  if (!show) {
    return null
  }

  return (
    <div>
      <h2>books</h2>
      <p>in genre <strong>{filterGenre}</strong></p>
      <BooksTable books={filteredBooks} />
      <BookFilter genres={[...genres, 'all genres']} setFilterGenre={setFilterGenre} />
    </div>
  )
}

export default Books
