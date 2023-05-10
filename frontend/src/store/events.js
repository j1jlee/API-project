

// frontend/src/store/events.js
import { csrfFetch } from "./csrf";

//actions
const GET_EVENTS = "events/getEvents"
const CREATE_EVENT_BY_GROUP_ID = "groups/groupId/createEvent"
const ADD_IMAGE_TO_EVENT = "events/eventId/addImage"
const GET_EVENTS_BY_GROUP_ID = "groups/groupId/getAllEvents"
const GET_EVENT_BY_EVENT_ID = "events/getEvent"
const EDIT_EVENT = "events/editEvent"


//action collectors
const getAllEvents = (events) => {
    return {
        type: GET_EVENTS,
        events
    }
};

const createEvent = (event) => {
    return {
        type: CREATE_EVENT_BY_GROUP_ID,
        event
    }
}

const addImage = (event) => {
    return {
        type: ADD_IMAGE_TO_EVENT,
        event
    }
}

const getEventsByGroupId = (events) => {
    return {
        type: GET_EVENTS_BY_GROUP_ID,
        events
    }
}

const getEventByEventId = (event) => {
    return {
        type: GET_EVENT_BY_EVENT_ID,
        event
    }
}

const editEvent = (event) => {
    return {
        type: EDIT_EVENT,
        event
    }
}

/* const ADD_IMAGE_TO_EVENT = "events/eventId/addImage"
const GET_EVENTS_BY_GROUP_ID = "groups/groupId/getAllEvents"
const GET_EVENT_BY_EVENT_ID = "events/getEvent"
const EDIT_EVENT = "events/editEvent" */
/*  */


//thunk reducers
export const fetchAllEvents = () => async (dispatch) => {
    const response = await csrfFetch("/api/events");
    // const response = await fetch("/api/events");

    // console.log("all events fetch worked?")
    // console.log(typeof response)
    const allEvents = await response.json();
    // console.log("allEvents res", allEvents)
    dispatch(getAllEvents(allEvents));

}

export const fetchEventsByGroupId = (groupId) => async (dispatch) => {

    //console.log("anything here?")

    try {
        const response = await csrfFetch(`/api/groups/${groupId}/events`);
        const resEvents = await response.json();
        dispatch(getEventsByGroupId(resEvents));
        return resEvents;
    } catch (e) {
        dispatch(getEventsByGroupId({error: e}))
        return {"message": "Group could not be found"};
    }
}

export const fetchEventByEventId = (eventId) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/events/${eventId}`);
        const resEvents = await response.json();
        dispatch(getEventByEventId(resEvents));
        return resEvents;
    } catch (e) {
        dispatch(getEventByEventId({error: e}));
        return {"message": "Event could not be found"}
    }
}
/*
root reducer, SEND to index
*/


const initialState = { events: null };

const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_EVENTS:
      return {...state, events: action.events};
    case GET_EVENTS_BY_GROUP_ID:
        return {...state, events: action.events};
    case GET_EVENT_BY_EVENT_ID:
        return {...state, events: action.event}
    default:
      return state;
  }
};




export default eventsReducer;
