
//contain all actions specific to session user's info, session user's Redux reducer

// frontend/src/store/groups.js
import { csrfFetch } from "./csrf";

//actions
const GET_GROUPS = "groups/getGroups";
const CREATE_GROUP = "groups/createGroup";
const EDIT_GROUP = "groups/editGroup"
const GET_GROUP_BY_USER = "groups/groupByUser";
const GET_GROUP_BY_ID = "groups/groupByGroupId";
const CREATE_VENUE_FOR_GROUP = "groups/createVenueForGroup";
const GET_VENUES_FOR_GROUP = "groups/getVenuesForGroup";
/*
TODO: create group / edit group?
    add image to group
    get groups by current user
    get details of group by ID
    create new venue FOR group (form?) / edit venue
    get all venues for group
    */


//action collectors
const getAllGroups = (groups) => {
    return {
        type: GET_GROUPS,
        groups
    }
};

const createGroup = (group) => {
    return {
        type: CREATE_GROUP,
        group
    }
}

const editGroup = (group) => {
    return {
        type: EDIT_GROUP,
        group
    }
}

const getGroupByUser = (group) => {
    return {
        type: GET_GROUP_BY_USER,
        group
    }
}

const getGroupById = (group) => {
    return {
        type: GET_GROUP_BY_ID,
        group
    }
}

const createVenueForGroup = (venue) => {
    return {
        type: CREATE_VENUE_FOR_GROUP,
        venue
    }
}

const getVenuesForGroup = (venues) => {
    return {
        type: GET_VENUES_FOR_GROUP,
        venues
    }
}

/*

const CREATE_GROUP = "groups/createGroup";
const EDIT_GROUP = "groups/editGroup"
const GET_GROUP_BY_USER = "groups/groupByUser";
const GET_GROUP_BY_ID = "groups/groupByGroupId";
const CREATE_VENUE_FOR_GROUP = "groups/createVenueForGroup";
const GET_VENUES_FOR_GROUP = "groups/getVenuesForGroup"; */

//thunk reducers
export const fetchAllGroups = () => async (dispatch) => {
    const response = await csrfFetch("/api/groups");
    // const response = await fetch("/api/groups");

    //console.log("all group fetch worked?")
    //console.log(typeof response)
    const allGroups = await response.json();
    //console.log("typeof allgroups", typeof allGroups)
    dispatch(getAllGroups(allGroups));

}

export const fetchCreateGroup = (group) => async (dispatch) => {
    const response = await csrfFetch("/api/groups", {
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "body": JSON.stringify(group)
    });

    if (response.ok) {
        const newGroup = await response.json();
        dispatch(createGroup(newGroup));
        return newGroup;
    } else {
        const newError = await response.json();
        return newError;
    }
}



/*
root reducer, SEND to index
*/


const initialState = { groups: null };

const groupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_GROUPS:
      return {...state, groups: action.groups};
    case CREATE_GROUP:
        let newState = {...state};

        if (newState.groups) {
            Object.assign(newState.groups, action.group)
        } else {
            newState.groups = action.group;
        }

        console.log("does this work? newState:", newState);

        return newState;

        // return {...state, Object.assign(groups, action.group)}
        /* groups: [...state.groups, action.group] */
    default:
      return state;
  }
};




export default groupsReducer;
