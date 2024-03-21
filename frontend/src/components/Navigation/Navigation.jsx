import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';
import navicon from './navicon.png'


function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  const sessionLinks = sessionUser ?
    (
      <>
        <li>
          <ProfileButton user={sessionUser} />
        </li>
        <li>
          <NavLink to='/spots/new' className="create-new-spot hover-shadow">Create a New Spot</NavLink>
        </li>
      </>

    ) : (
      <>
        <ProfileButton />
      </>
    );

  return (
    <ul>
      <div className="nav-bar">
        <NavLink className="home-icon-assembly" to="/"><img className="home-icon" src={navicon} /></NavLink>
        <li className="nav-bar right-side">
          {isLoaded && sessionLinks}
        </li>

      </div>
    </ul>
  );
}

export default Navigation;
