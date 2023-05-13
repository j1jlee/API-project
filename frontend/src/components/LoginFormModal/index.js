// frontend/src/components/LoginFormPage/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
// import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
// import { Redirect } from "react-router-dom";
//
import "./LoginForm.css";

export const LoginFormModal = () => {
  const dispatch = useDispatch();
  // const sessionUser = useSelector((state) => state.session.user);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  // if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
    .then(closeModal)
    .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      }
    );
  };

  const loginDemoUser = (e) => {
    e.preventDefault();
    return dispatch(sessionActions.login({ credential:"Demo-lition", password:"password"}))
    .then(closeModal)
  }

  return (
    <>
      <h1>Log In</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Username or Email:<br></br>
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <br></br>
        <label>
          Password:<br></br>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {/* {errors.credential && <p>{errors.credential}</p>}
        <br></br>
        <br></br> */}
        {errors.credential ? <p className="login-error-message">{errors.credential}</p> : <><br></br><br></br></>}

        <button type="submit" className="universal-button-red">Log In</button>
      </form>

      <button onClick={loginDemoUser}>Log in as Demo User</button>
    </>
  );
}

export default LoginFormModal;
