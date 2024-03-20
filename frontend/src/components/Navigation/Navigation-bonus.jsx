import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton-bonus';
import logo from './favicon.ico'
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <header className='header-container'>
      <div className ='logo-header'>
        <NavLink to="/" className="home-nav">
          <div className='home-button'>
            <img src={logo} className='logo'/> 
            <h2> Shiva</h2>
          </div>
        </NavLink>
      </div>
      <section className='top-right-buttons'>
      {sessionUser && (
        <div>
          <NavLink className="create-new-spot-nav" to='/spots/new'>
            Create a New Spot
          </NavLink>
        </div>
      )}
      {isLoaded && (
        <div>
          <ProfileButton user={sessionUser} />
        </div>
      )}
      </section>
    </header>
  );
}

export default Navigation;
