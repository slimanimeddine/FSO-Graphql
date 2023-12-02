import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'
import BooksTable from './BooksTable'

const Recommend = ({ show }) => {
    const result = useQuery(ME)
    const { data } = useQuery(ALL_BOOKS)
    const favoriteGenre = result?.data?.me?.favoriteGenre
    const favoriteBooks = data?.allBooks?.filter(book => book.genres.includes(favoriteGenre))

    if (!show) {
        return null
    }

    return (
        <div>
            <h2>recommendations</h2>
            <p>books in your favorite genre <strong>{favoriteGenre}</strong></p>
            <BooksTable books={favoriteBooks} />
        </div>
    )
}

export default Recommend