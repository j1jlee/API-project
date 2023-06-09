// frontend/src/components/Navigation/ProfileButton.js
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';

import { useHistory } from 'react-router-dom';
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";

function ProfileButton({ user }) {

  const history = useHistory();

  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    //
    history.push('/');

  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>

      <NavLink className="start-group-navlink" to="/groups/new">Start a new Group</NavLink>
      <span>&emsp;</span>
      <button onClick={openMenu} className="nav-button-light-gray">
        <i className="fas fa-user-circle" />
      </button>

      <div className="dropdown-wrap">
      <ul className={ulClassName} ref={ulRef}>
        <li>Hello, {user.firstName}</li>
        <li>
          <NavLink to="/groups">View groups</NavLink>
        </li>
        <li>
          <NavLink to="/events">View events</NavLink>
        </li>
        {/* <li>{user.username}</li>
        <li>{user.firstName} {user.lastName}</li> */}
        <li>{user.email}</li>
        <li>
          <button onClick={logout}>Log Out</button>
        </li>
      </ul>
      </div>


    </>
  );
}

export default ProfileButton;
