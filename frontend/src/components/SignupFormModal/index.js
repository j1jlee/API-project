// frontend/src/components/SignupFormPage/index.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
// import { useDispatch, useSelector } from "react-redux";
// import { Redirect } from "react-router-dom";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  // const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const [ buttonDisabled, setButtonDisabled ] = useState("signup-button-disabled");
  // if (sessionUser) return <Redirect to="/" />;


  useEffect(() => {
    if (
      !email ||
      !username ||
      !firstName ||
      !lastName ||
      !password ||
      !confirmPassword ||
      username.length < 4 ||
      password.length < 6
    ) {
      setButtonDisabled("signup-button-disabled");
    } else {
      setButtonDisabled("universal-button-red")
    }
  }, [email, username, firstName, lastName, password, confirmPassword])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email ? <p className="signup-error-message">{errors.email}</p> : <><br></br><br></br></>}
        {/* {errors.email && <p>{errors.email}</p>} */}
        {/* <><br></br><br></br></> */}

        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username ? <p className="signup-error-message">{errors.username}</p> : <><br></br><br></br></>}
        {/* {errors.username && <p>{errors.username}</p>} */}
        {/* <br></br>
        <br></br> */}

        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {errors.firstName ? <p className="signup-error-message">{errors.firstName}</p> : <><br></br><br></br></>}
        {/* {errors.firstName && <p>{errors.firstName}</p>} */}
        {/* <br></br>
        <br></br> */}

        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {errors.lastName ? <p className="signup-error-message">{errors.lastName}</p> : <><br></br><br></br></>}
        {/* {errors.lastName && <p>{errors.lastName}</p>} */}
        {/* <br></br>
        <br></br> */}

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password ? <p className="signup-error-message">{errors.password}</p> : <><br></br><br></br></>}
        {/* {errors.password && <p>{errors.password}</p>} */}

        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword ? <p className="signup-error-message">{errors.confirmPassword}</p> : <><br></br><br></br></>}
        {/* {errors.confirmPassword && <p>{errors.confirmPassword}</p>} */}
        <button type="submit" className={buttonDisabled}>Sign Up</button>
        {/* <button type="submit" className="universal-button-red">Sign Up</button> */}
      </form>
    </>
  );
}

export default SignupFormModal;
