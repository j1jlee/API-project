
//contain all actions specific to session user's info, session user's Redux reducer

// frontend/src/store/groups.js
import { csrfFetch } from "./csrf";

//actions
const GET_GROUPS = "groups/getGroups"
/*
TODO: create group
    add image to group
    get groups by current user
    get details of group by ID */


//action collectors
const getAllGroups = (groups) => {
    return {
        type: GET_GROUPS,
        groups
    }
};
//thunk reducers
export const fetchAllGroups = () => async (dispatch) => {
    const response = await csrfFetch("/api/groups");
    // const response = await fetch("/api/groups");

    console.log("all group fetch worked?")
    console.log(typeof response)
    const allGroups = await response.json();
    console.log("typeof allgroups", typeof allGroups)
    dispatch(getAllGroups(allGroups));

}
/*
root reducer, SEND to index
*/


const initialState = { groups: null };

const groupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_GROUPS:
      return {...state, groups: action.groups}
    default:
      return state;
  }
};




export default groupsReducer;
