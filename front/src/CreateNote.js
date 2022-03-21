import {Fragment, useState, useEffect, useRef} from 'react';
import Header from './components/Header';
import Loader from './components/Loader';
import './styles/CreateNote.css'
import './styles/form.css'

function CreateNote() {
  if (!localStorage.token) {
    window.location.href = '/iniciar_sesion';
  }

  const [noteData, setNoteData] = useState({
    title: '',
    content: '',
  });
  const [loader, setLoader] = useState(false);
  const errorMessage = useRef(null);
  useEffect(async () => {
    const noteContent = await fetch(
      `${process.env.REACT_APP_URL_API}nota/obtener_auto_guardado`,
      {
        method: 'post',
        body: JSON.stringify({token: localStorage.token}),
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );

    const noteContentJson = await noteContent.json();
    console.log(noteContentJson);
    if (noteContentJson) {
      setNoteData({...noteData, content: noteContentJson})
    }
  }, []);

  const saveContent = async function() {
    await fetch(
      `${process.env.REACT_APP_URL_API}nota/auto_guardar`,
      {
        method: 'post',
        body: JSON.stringify({
          token: localStorage.token,
          content: noteData.content
        }),
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );
  };

  const handlerSubmit = async function(event) {
    event.preventDefault();
    errorMessage.current.hidden = true;
    setLoader(true);
    let formData = new FormData();
    formData.append('token', localStorage.token)
    for (let data in noteData) {
      formData.append(data, noteData[data])
    }
    const noteResponse = await fetch(
      `${process.env.REACT_APP_URL_API}nota/crear`,
      {
        method: 'post',
        body: formData,
      }
    ).catch(err => manageError);

    if (noteResponse.status === 400) {
      manageError();
      return;
    }

    if (!noteResponse) {
      return;
    }

    const noteResponseJson = await noteResponse.json();
    if (noteResponseJson.error) {
      window.location.href = '/iniciar_sesion';
    }

    window.location.href = `/notas/${noteResponseJson.userId}`;
  };

  const manageError = function() {
    setLoader(false);
    errorMessage.current.hidden = false;
    errorMessage.current.textContent = (
      'Error al cargar la nota, intentalo de nuevo'
    );
    return false
  }

  const handlerChange = function(event) {
    const dInput = event.target;
    setNoteData({
      ...noteData,
      [dInput.name]: dInput.value,
    });

    if (dInput.dataset.autosave && !(dInput.value.length % 100)) {
      saveContent();
    }
  };

  const handlerLoadImage = function(event) {
    const dInput = event.target;
    setNoteData({
      ...noteData,
      [dInput.name]: dInput.files[0],
    });
  };

  return (
    <Fragment>
      <Header />
      <h1>Crea una nueva nota:</h1>
      <form method="post" className="form_note" onSubmit={handlerSubmit}>
        <input
          type="text"
          name="title"
          className="input"
          required="required"
          placeholder="Titulo"
          onChange={handlerChange}
        />
        <textarea
          rows="20"
          name="content"
          className="textarea"
          required="required"
          placeholder="Contenido"
          data-autosave="1"
          onChange={handlerChange}
          value={noteData.content}
        ></textarea>
        <label>
          <p className="label_text">
            Agregar imagen a la nota:
          </p>
          <input
            accept="image/*"
            type="file"
            name="image"
            onChange={handlerLoadImage}
          />
        </label>
        <span hidden={true} ref={errorMessage} className="error"></span>
        <button className="button">
          Crear nota
        </button>
      </form>
      {
        loader &&
        <Loader />
      }
    </Fragment>
  );
}

export default CreateNote;
