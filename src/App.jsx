import { useState, useEffect } from 'react'

export default function App () {
  const [usersResults, setUsersResults] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [sortAsc, setSortAsc] = useState(true)
  const [countryFilter, setCountryFilter] = useState('')
  const [color, setColor] = useState(false)
  const [error, setError] = useState()
  // Renderizar users
  useEffect(() => {
    fetch('https://randomuser.me/api/?results=100')
      .then(res => res.json())
      .then(data => {
        setUsersResults(data.results)
        setFilteredUsers(data.results)
      })
      .catch(() => setError('Error fetching data'))
  }, [])

  // Funcion para clasificar por orden de paises
  const sortByCountry = () => {
    const sortedUSers = [...filteredUsers].sort((a, b) => {
      return sortAsc
        ? a.location.country.localeCompare(b.location.country)
        : b.location.country.localeCompare(a.location.country)
    })
    setFilteredUsers(sortedUSers)
    setSortAsc(!sortAsc)
  }

  // Funcion para eliminar usuarios
  const deleUser = (uuid) => {
    const paramerCondition = filteredUsers.filter((user) => user.login.uuid !== uuid)
    setFilteredUsers(paramerCondition)
  }

  const restoreUser = () => {
    setFilteredUsers(usersResults)
  }

  useEffect(() => {
    if (countryFilter) {
      const filtered = usersResults.filter((user) => {
        return user.location.country.toLowerCase().includes(countryFilter.toLowerCase())
      })
      setFilteredUsers(filtered)
    } else { setFilteredUsers(usersResults) }
  }, [countryFilter, usersResults])

  const colorealButton = () => {
    setColor(!color)
  }

  return (
    <>
      <header>
        <input
          placeholder='Buscar por pais...'
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
        />
        <button onClick={restoreUser}>Reordenar usuarios</button>
        <button onClick={colorealButton}>Coloreal 🔺</button>
      </header>
      <main>
        {error && <p>`ocurrio un error de tipo${error}`</p>}
        <table>
          <thead>
            <tr>
              <th>Imagen </th>
              <th onClick={sortByCountry} style={{ cursor: 'pointer' }}> Pais {sortAsc ? '↑' : '↓'}</th>
              <th>Nombre</th>
              <th>Accion</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr style={{ backgroundColor: color ? '#516770' : '' }} key={user.login.uuid}>
                <td><img src={user.picture.thumbnail} alt='image the user from the randomuserAPI' /></td>
                <td>{user.location.country}</td>
                <td>{user.name.first} {user.name.last}</td>
                <td><button onClick={() => deleUser(user.login.uuid)}>Eliminar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>

  )
}
