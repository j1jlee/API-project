
//contain all actions specific to session user's info, session user's Redux reducer

// frontend/src/store/session.js
import { csrfFetch } from "./csrf";

//get singleMulterUpload, singleFileUpload
// import { singleMulterUpload, singlePublicFileUpload } from "../../../backend/utils/awsS3";


const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER,
  };
};

export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

///////
export const restoreUser = () => async (dispatch) => {
    const response = await csrfFetch("/api/session");
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
  };
//////////
//phase 2, signup action
export const signup = (user) => async (dispatch) => {
  const { image, username, firstName, lastName, email, password } = user;

  //remove
  const imageUrl = '';

  console.log("at store for session/signup, image?", image)

  //formdata instead of JSON.stringify, for image upload/incorporation
  const formData = new FormData();

  formData.append('username', username)
  formData.append('firstName', firstName)
  formData.append('lastName', lastName)
  formData.append('email', email)
  formData.append('password', password)
  if (image) {
    formData.append('image', image)
   }
  //  else {
  //    formData.append('image', null)
  //  }


  // const { username, firstName, lastName, email, password } = user;
  const response = await csrfFetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  });
  // const response = await csrfFetch("/api/users", {
  //   method: "POST",
  //   body: JSON.stringify({
  //     username,
  //     firstName,
  //     lastName,
  //     email,
  //     password,
  //     imageUrl
  //   }),
  // });

  // console.log('what is response', response)

  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
  //return data??
};
// export const signup = (user) => async (dispatch) => {
//   const { username, firstName, lastName, email, password } = user;
//   const response = await csrfFetch("/api/users", {
//     method: "POST",
//     body: JSON.stringify({
//       username,
//       firstName,
//       lastName,
//       email,
//       password
//     }),
//   });
//   const data = await response.json();
//   dispatch(setUser(data.user));
//   return response;
// };

//phase 3, logout
export const logout = () => async (dispatch) => {
  const response = await csrfFetch('/api/session', {
    method: 'DELETE',
  });
  dispatch(removeUser());
  return response;
};
//window.store.dispatch(window.sessionActions.logout());


const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_USER:
      newState = Object.assign({}, state);
      newState.user = action.payload;
      return newState;
    case REMOVE_USER:
      newState = Object.assign({}, state);
      newState.user = null;
      return newState;
    default:
      return state;
  }
};




export default sessionReducer;
