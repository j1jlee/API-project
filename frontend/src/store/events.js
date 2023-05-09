

// frontend/src/store/events.js
import { csrfFetch } from "./csrf";

//actions
const GET_EVENTS = "Events/getEvents"



//action collectors
const getAllEvents = (events) => {
    return {
        type: GET_EVENTS,
        events
    }
};
//thunk reducers
export const fetchAllEvents = () => async (dispatch) => {
    const response = await csrfFetch("/api/events");
    // const response = await fetch("/api/events");

    console.log("all events fetch worked?")
    console.log(typeof response)
    const allEvents = await response.json();
    console.log("allEvents res", allEvents)
    dispatch(getAllEvents(allEvents));

}
/*
root reducer, SEND to index
*/


const initialState = { events: null };

const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_EVENTS:
      return {...state, events: action.events}
    default:
      return state;
  }
};




export default eventsReducer;
