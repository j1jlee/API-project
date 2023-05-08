// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
// import * as sessionActions from '../../store/session';
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
//   const dispatch = useDispatch();

//   const logout = (e) => {
//     e.preventDefault();
//     dispatch(sessionActions.logout());
//   };

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <li className="nav-grid-left">
        <ProfileButton user={sessionUser}/>

        {/* <button onClick={logout}>Log Out</button> */}
      </li>
    );
  } else {
    sessionLinks = (
      <li className="nav-grid-right">
        {/* <NavLink to="/login">Log In</NavLink> */}
        <OpenModalButton
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />
        {/* <NavLink to="/signup">Sign Up</NavLink> */}
        <OpenModalButton
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />}
        />

      </li>
    );
  }

  return (
    <div className="nav-wrapper">
    <ul className="nav-grid-container">
      <li>
        <NavLink exact to="/" className="nav-grid-left">HomeMEETUP-LOGO</NavLink>
      </li >
      {isLoaded && sessionLinks}
    </ul>
    </ div>
  );
}

export default Navigation;
