import {useState} from 'react';
import {Link} from 'react-router-dom';
import './styles/form.css';

function Login() {
  if (localStorage.token) {
    window.location.href = '/';
  }

  const [loginData, setLoginData] = useState({});
  const handlerSubmit = async function(event) {
    const dErrorMessage = document.querySelector('.jsErrorMessage');
    dErrorMessage.hidden = true;
    event.preventDefault();
    const loginRsponse = await fetch(
      'http://localhost:8081/usuario/iniciar_sesion',
      {
        method: 'post',
        body: JSON.stringify(loginData),
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );

    const loginRsponseJson = await loginRsponse.json();
    if (!loginRsponseJson.login) {
      dErrorMessage.hidden = false;
      return;
    }

    localStorage.token = loginRsponseJson.token;
    window.location.href = '/';
  };

  const handlerChange = function(event) {
    const dInput = event.target;
    setLoginData({
      ...loginData,
      [dInput.name]: dInput.value,
    });
  };

  return (
    <div className="container">
      <form method="post" className="form" onSubmit={handlerSubmit}>
        <div>
          <label className="title_input">
            Correo
            <input
              type="email"
              name="email"
              className="input"
              onChange={handlerChange}
            />
          </label>
        </div>
        <div>
          <label className="title_input">
            Contrasena
            <input
              type="password"
              name="password"
              className="input"
              onChange={handlerChange}
            />
          </label>
        </div>
        <button className="button">
          Iniciar Sesion
        </button>
        <p className="error jsErrorMessage" hidden={true}>
          El correo o la contrasena que pusiste no coinciden :(
        </p>
        <p>
          No tienes una cuenta aun? <Link to="/registrarse">Registrate</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
