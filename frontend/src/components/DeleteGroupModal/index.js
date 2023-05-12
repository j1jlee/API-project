// frontend/src/components/SignupFormPage/index.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
// import { useDispatch, useSelector } from "react-redux";
// import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./DeleteGroupModal.css";

import { fetchDeleteGroup } from "../../store/groups";

function DeleteGroupModal({groupId}) {
  const dispatch = useDispatch();

  const history = useHistory();
  const { closeModal } = useModal();

  // if (sessionUser) return <Redirect to="/" />;

  const handleDelete = (e) => {
    e.preventDefault();


    return dispatch(fetchDeleteGroup(groupId)) //no need for non-fetch dispatch apparently?
    .then(closeModal)
    .then(() => history.push(`/groups`))
    .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) console.log("error", data.message)
        // setErrors(data.errors);
    }
    )

  }

//       .then(closeModal)
//       .catch(async (res) => {
//         const data = await res.json();
//         if (data && data.errors) {
//           setErrors(data.errors);
//         }
//       });
//     }
//     return setErrors({
//       confirmPassword: "Confirm Password field must be the same as the Password field"
//     });
//   };

  return (
    <>
      <h1>Confirm Delete</h1>
      <h2>Are you sure you want to remove this group?</h2>

      <button className="delete-button-red" onClick={handleDelete}>Yes (Delete Group)</button> <br></br>
      <button className="delete-button-dark-gray" onClick={closeModal}>No (Keep Group)</button>



    </>
  );
}

export default DeleteGroupModal;
