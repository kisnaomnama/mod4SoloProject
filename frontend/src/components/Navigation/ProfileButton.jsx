import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { useNavigate } from 'react-router-dom';


function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const navigate = useNavigate();
  const toggleMenu = (e) => {
    e.stopPropagation(); 
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    navigate('/')
    closeMenu();
  };

  const manageSpots = (e) => {
    e.preventDefault();
    navigate('/spots/current');
    closeMenu();
  };

  const manageReviews = (e) => {
    e.preventDefault();
    navigate('/reviews/current');
    closeMenu();
  }

  const ulClassName = "profile-dropdown" + (showMenu ? " " : " hidden");

  return (
    <>
    <div className="log-in-menu">
      <button onClick={toggleMenu} className="profile-button fa-2x cursor">
      <i className="fa fa-bars" />
        <i className="fas fa-user-circle" />
        
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li>Hello {user.username}</li>
            <li className="profile-dropdown-lineitems">{user.email}</li>
            <li><button onClick={manageSpots} className="cursor profile-dropdown-button">Manage Spots</button></li>
            <li><button onClick={manageReviews} className="cursor profile-dropdown-button">Manage Reviews</button></li>
            <li><button onClick={logout} className="cursor profile-dropdown-button">Log Out</button></li>
          </>
        ) : (
          <>
            <OpenModalMenuItem
              className="cursor"
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              className="cursor"
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </ul>
      </div>
    </>
  );
}

export default ProfileButton;
