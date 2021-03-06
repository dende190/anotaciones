import {Fragment, useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import Header from './components/Header';
import './styles/Home.css'

function Home() {
  if (!localStorage.token) {
    window.location.href = '/iniciar_sesion';
  }

  const [usersList, setUsersList] = useState([]);
  useEffect(async () => {
    const users = await fetch(
      `${process.env.REACT_APP_URL_API}usuario/obtener_listado`,
      {
        method: 'post',
        body: JSON.stringify({token: localStorage.token}),
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );

    const usersJson = await users.json();
    if (usersJson.error) {
      window.location.href = '/iniciar_sesion';
    }

    setUsersList(usersJson);
  }, []);

  return (
    <Fragment>
      <Header />
      <div>
        <h2 className="title">Listado de usuarios</h2>
        <ul>
          {
            usersList.map(user => {
              return (
                <li className="user" key={user.id}>
                  <Link to={`notas/${user.id}`}>{user.name}</Link>
                  <span className="new_note">
                    {
                      user.notesCount > 0 &&
                      `(Tiene ${user.notesCount} nota nuevas hoy)`
                    }
                  </span>
                </li>
              )
            })
          }
        </ul>
      </div>
    </Fragment>
  );
}

export default Home;
