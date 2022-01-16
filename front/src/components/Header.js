import {Link} from 'react-router-dom';
import '../styles/Header.css'

function Header() {
  const handlerLogOut = async function() {
    localStorage.removeItem('token');
    window.location.href = 'iniciar_sesion';
  };

  return (
    <header className="header">
      <Link to="/" className="links">
        Inicio
      </Link>
      <Link to="/crear_nota" className="links">
        Crear Nueva Nota
      </Link>
      <p className="links" onClick={handlerLogOut}>
        Cerrar Sesion
      </p>
    </header>
  );
}

export default Header;
