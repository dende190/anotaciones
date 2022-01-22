import {Fragment, useState, useEffect} from 'react';
import Header from './components/Header';
import Loader from './components/Loader';
import './styles/CreateNote.css'
import './styles/form.css'

function CreateNote() {
  if (!localStorage.token) {
    window.location.href = '/iniciar_sesion';
  }

  const [noteData, setNoteData] = useState({});
  const [loader, setLoader] = useState(false);
  const handlerSubmit = async function(event) {
    event.preventDefault();
    setLoader(true);
    const noteResponse = await fetch(
      `${process.env.REACT_APP_URL_API}nota/crear`,
      {
        method: 'post',
        body: JSON.stringify({noteData, token: localStorage.token}),
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );

    const noteResponseJson = await noteResponse.json();
    if (noteResponseJson.error) {
      window.location.href = '/iniciar_sesion';
    }

    window.location.href = `/notas/${noteResponseJson.userId}`;
  };

  const handlerChange = function(event) {
    const dInput = event.target;
    setNoteData({
      ...noteData,
      [dInput.name]: dInput.value,
    });
  };

  const handlerLoadImage = function(event) {
    const reader = new FileReader();
    const dInput = event.target;
    const imageData = dInput.files[0];
    reader.readAsDataURL(imageData);
    reader.onload = () => (
      setNoteData({
        ...noteData,
        [dInput.name]: reader.result,
        imageName: imageData.name,
      })
    );
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
          onChange={handlerChange}
        ></textarea>
        <input
          type="file"
          name="image"
          onChange={handlerLoadImage}
        />
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
