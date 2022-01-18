import {useState} from 'react';
import {Link} from 'react-router-dom';
import './styles/Signup.css';
import './styles/form.css';

function Signup() {
  if (localStorage.token) {
    window.location.href = '/';
  }

  const [signUpData, setSignUpData] = useState({});
  const handlerSubmit = async function(event) {
    const dErrorMessage = document.querySelector('.jsErrorMessage');
    dErrorMessage.hidden = true;
    event.preventDefault();
    const signUpRsponse = await fetch(
      `${process.env.REACT_APP_URL_API}usuario/registrarse`,
      {
        method: 'post',
        body: JSON.stringify(signUpData),
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );

    const signUpRsponseJson = await signUpRsponse.json();
    if (!signUpRsponseJson.login) {
      dErrorMessage.hidden = false;
      return;
    }

    localStorage.token = signUpRsponseJson.token;
    window.location.href = '/';
  };

  const handlerChange = function(event) {
    const dInput = event.target;
    setSignUpData({
      ...signUpData,
      [dInput.name]: dInput.value,
    });
  };

  return (
    <div className="container">
      <form method="post" className="form" onSubmit={handlerSubmit}>
        <div>
          <label className="title_input">
            Nombres*
            <input
              type="text"
              name="firstname"
              className="input"
              required="required"
              placeholder="Nombres"
              onChange={handlerChange}
            />
          </label>
        </div>
        <div>
          <label className="title_input">
            Apellidos*
            <input
              type="text"
              name="lastname"
              className="input"
              required="required"
              placeholder="Apellidos"
              onChange={handlerChange}
            />
          </label>
        </div>
        <div>
          <label className="title_input">
            Correo*
            <input
              type="email"
              name="email"
              className="input"
              required="required"
              placeholder="Correo"
              onChange={handlerChange}
            />
          </label>
        </div>
        <div>
          <label className="title_input">
            Contrasena*
            <input
              type="password"
              name="password"
              className="input"
              required="required"
              placeholder="Contrasena"
              onChange={handlerChange}
            />
          </label>
        </div>
        <div>
          <label className="title_input">
            Repetir Contrasena*
            <input
              type="password"
              name="passwordRepeat"
              className="input"
              required="required"
              placeholder="Repetir Contrasena"
              onChange={handlerChange}
            />
          </label>
        </div>
        <input
          type="text"
          name="campo"
          className="input validate_input"
          onChange={handlerChange}
        />
        <button className="button">
          Crear usuario
        </button>
        <p className="error jsErrorMessage" hidden={true}>
          El correo o la contrasena que pusiste no coinciden :(
        </p>
        <p>
          Ya tienes una cuenta? <Link to="/iniciar_sesion">Inicia Sesion</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
