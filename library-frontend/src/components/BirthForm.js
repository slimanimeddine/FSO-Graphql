import { useState } from 'react'
import { useMutation } from '@apollo/client'
import Select from 'react-select'

import { EDIT_BORN, ALL_AUTHORS } from '../queries'

const BirthForm = ({ authors }) => {
    const [born, setBorn] = useState('')
    const [selectedOption, setSelectedOption] = useState(null)

    const options = authors?.map(author => ({
      value: author.name.toString(),
      label: author.name.toString()
    }))

    const [ EditBorn ] = useMutation(EDIT_BORN, {
      refetchQueries: [{ query: ALL_AUTHORS}]
    })

    const submit = async event => {
        event.preventDefault()
        EditBorn({ variables: { name: selectedOption.value, setBornTo: parseInt(born, 10) } })
        setBorn('')
    }

  return (
    <div>
      <h2>Set birthyear</h2>

      <form onSubmit={submit}>
        <Select
          defaultValue={selectedOption}
          onChange={setSelectedOption}
          options={options}
        />
        <div>
          born{' '}
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default BirthForm