import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './style.css';
import navicon from './favicon.png'


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

    <div className="nav-bar">
      <div className="nav-bar left-side">
        <NavLink className="home-icon-assembly" to="/"><img className="home-icon" src={navicon} /><h2>shivabnb</h2></NavLink>
      </div>

      <div className="nav-bar right-side">
        {isLoaded && sessionLinks}
      </div>
    </div>

  );
}

export default Navigation;
