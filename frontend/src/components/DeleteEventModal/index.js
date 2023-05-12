// frontend/src/components/SignupFormPage/index.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
// import { useDispatch, useSelector } from "react-redux";
// import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./DeleteEventModal.css";

import { fetchDeleteEvent } from "../../store/events";

function DeleteEventModal({eventId, groupId}) {
  const dispatch = useDispatch();

  const history = useHistory();
  const { closeModal } = useModal();

  // if (sessionUser) return <Redirect to="/" />;

  const handleDelete = (e) => {
    e.preventDefault();


    return dispatch(fetchDeleteEvent(eventId)) //no need for non-fetch dispatch apparently?
    .then(closeModal)
    .then(() => history.push(`/groups/${groupId}`)) //go to group creator details
    .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) console.log("error", data.message)
        // setErrors(data.errors);
    }
    )

  }



  return (
    <>
      <h1>Confirm Delete</h1>
      <h2>Are you sure you want to remove this event?</h2>

      <button className="delete-button-red" onClick={handleDelete}>Yes (Delete event)</button> <br></br>
      <button className="delete-button-dark-gray" onClick={closeModal}>No (Keep event)</button>



    </>
  );
}

export default DeleteEventModal;
