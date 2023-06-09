import { NavLink, useRouteMatch } from "react-router-dom"
import EventsGroupsHeader from "../EventsGroupsHeader/EventsGroupsHeader";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEvents } from "../../store/events";
import "./EventsList.css";

import { formattedDateString, eventSort, firstUpcomingEventIndex, urlToImage } from "../aaComponentMiddleware";

import { refreshEvent } from "../../store/events";
import { refreshGroup } from "../../store/groups"

const EventsList = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAllEvents());

        dispatch(refreshEvent());
        dispatch(refreshGroup());
    }, [])


    const allEvents = useSelector(state => state.events.events)
    const { url } = useRouteMatch();


    let events;
    let previousEvents = [];
    let upcomingEvents = [];

    try {
        events = allEvents.Events;

        const eventsSorted = eventSort(events);
        const upcomingEventIndex = firstUpcomingEventIndex(eventsSorted);

        if (upcomingEventIndex === -1) {
                    previousEvents = [...eventsSorted];
                } else {
                    previousEvents = [...eventsSorted.slice(0, upcomingEventIndex)];
                    upcomingEvents = [...eventsSorted.slice(upcomingEventIndex)]
                }
    } catch {}



    const eventNodes = (events) => {
    try {
///////////////////////
if (events) {
// if (allEvents) {
    // console.log("all events exists, what is it", allEvents);

    // const events = allEvents.Events;


    return (events.map((event) => {

        let previewEventImage = event.EventImages.find((image) => {
        //console.log("image current", image)
         return image.preview = true;
        })

        let previewEventImageUrl;

        if (typeof previewEventImage === 'undefined') {
            previewEventImageUrl = "N/A";
        } else {
            previewEventImageUrl = previewEventImage.url;
        }

        let eventCity, eventState;

        try {
            eventCity = event.Venue.city;
        } catch {
            eventCity = "unknown City";
        }
        try {
            eventState = event.Venue.state;
        } catch {
            eventCity = "unknown State";
        }
        
        // console.log('current event:', event, "previewEventImage", previewEventImageUrl);

        const { startDate, endDate, name, description } = event;


        return (
            <NavLink className='event-node-a' to={`${url}/${event.id}`}>
            <li key={event.id} className="event-node">
                <div className="event-node-image">{urlToImage(previewEventImageUrl, 1)}</div>
                {/* <div className="event-node-image">{previewEventImageUrl}</div> */}
                <div className="event-node-text">
                    <div className="en-start-date">{formattedDateString(startDate)}</div>
                    {/* <div>{formattedDateString(endDate)}</div> */}
                    <div className="en-name">{name}</div>
                    <div className="en-place">{eventCity}, {eventState}</div>
                </div>

                <div className="event-node-description">
                <div>{description}</div>
                </div>

            </li>
            </NavLink>
        )
    }))
}
/////////////////////////////////
    } catch {
        return (<p> Loading </p>)
    }
}

    // if (allEvents) {
    //     console.log("all events exists, what is it", allEvents);

    //     const events = allEvents.Events;

    //     // console.log("does this work?", events)

    //     return (events.map((event) => {

    //         let previewEventImage = event.EventImages.find((image) => {
    //         //console.log("image current", image)
    //          return image.preview = true;
    //         })

    //         let previewEventImageUrl;

    //         if (typeof previewEventImage === 'undefined') {
    //             previewEventImageUrl = "N/A";
    //         } else {
    //             previewEventImageUrl = previewEventImage.url;
    //         }


    //         console.log('current event:', event, "previewEventImage", previewEventImageUrl);

    //         const { startDate, endDate, name, description } = event;


    //         return (
    //             <li key={event.id} className="event-node">
    //                 <div className="event-node-image">{previewEventImageUrl}</div>
    //                 <div className="event-node-text">
    //                 <div>{startDate}</div>
    //                 <div>{endDate}</div>
    //                 <div>{name}</div>
    //                 <div>{description}</div>
    //                 </div>
    //             </li>
    //         )
    //     }))
    // }
    // return (<p> testing </p>)
    // }
    ////////////////

    //console.log("eventNodes", eventNodes());


    return (
        <>
        <EventsGroupsHeader eventsOrGroups="Events"/>
        {/* <div className="event-group-header"></div>
        <ul className="group-wrapper">
            {eventNodes()}
        </ul> */}

        <div className="events-groups-header-wrapper">
        <ul className="group-wrapper">
            {eventNodes(upcomingEvents)}
        <li className="prev-event-label">Previous Events:</li>
            {eventNodes(previousEvents)}
        </ul>
        </div>
        </>
    )
}

export default EventsList;
