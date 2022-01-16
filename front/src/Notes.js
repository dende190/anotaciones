import {Fragment, useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import Header from './components/Header';
import './styles/Notes.css'

function Notes() {
  if (!localStorage.token) {
    window.location.href = '/iniciar_sesion';
  }

  const [userNotes, setUserNotes] = useState({notes: []});
  const {userId} = useParams();
  useEffect(async () => {
    const userNotesData = await fetch(
      'http://localhost:8081/nota/obtener',
      {
        method: 'post',
        body: JSON.stringify({token: localStorage.token, userId}),
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );

    const userNotesDataJson = await userNotesData.json();
    if (userNotesDataJson.error) {
      window.location.href = '/iniciar_sesion';
    }
    setUserNotes(userNotesDataJson);
  }, []);

  return (
    !userNotes.notes.length ?
    <h3>Sin Notas</h3> :
    (
      <Fragment>
        <Header />
        <div>
          <h1>Notas de {userNotes.userName}:</h1>
          {
            userNotes.notes.map(note => (
              <div key={note.id}>
                <h2 className="title">
                  {note.title} <span className="date">{note.createdDate}</span>
                </h2>
                <p className="content">{note.content}</p>
                <hr className="separator"/>
              </div>
            ))
          }
        </div>
      </Fragment>
    )
  );
}

export default Notes;
