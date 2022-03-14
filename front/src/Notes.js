import {Fragment, useState, useEffect} from 'react';
import {Link, useParams} from 'react-router-dom';
import parse from 'html-react-parser';
import Header from './components/Header';
import Loader from './components/Loader';
import './styles/Notes.css'

function Notes() {
  if (!localStorage.token) {
    window.location.href = '/iniciar_sesion';
  }

  const [userNotes, setUserNotes] = useState({notes: []});
  const {userId} = useParams();
  useEffect(async () => {
    const userNotesData = await fetch(
      `${process.env.REACT_APP_URL_API}nota/obtener`,
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
    <Fragment>
      <Header />
      <div>
        <h1>Notas de {userNotes.userName}:</h1>
        {
          !userNotes.notes.length ?
          <Loader /> :
          userNotes.notes.map((note, index) => (
            <div key={note.id}>
              <h2 className="title">
                {note.title}
                <span className="date">
                  {note.createdDate}
                </span>
              </h2>
              <p className="content">
                {
                  parse(
                    note
                    .content
                    .replace(
                      /((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»“”‘’]))/g,
                      '<a href="$1" target="_blank">$1</a>'
                    )
                  )
                }
              </p>
              {
                note.imageName &&
                <div className="container_image_note">
                  <img
                    src={`${process.env.REACT_APP_URL_API}${process.env.REACT_APP_IMAGE_PATH_API}${note.imageName}`}
                    className="image_note"
                    alt={note.imageName}
                  />
                </div>
              }
              <hr className="separator"/>
            </div>
          ))
        }
      </div>
      <Link className="links return" to="/">
        Volver al Inicio
      </Link>
    </Fragment>
  );
}

export default Notes;
