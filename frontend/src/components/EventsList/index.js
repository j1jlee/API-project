import { NavLink } from "react-router-dom"
import EventsGroupsHeader from "../EventsGroupsHeader/EventsGroupsHeader";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEvents } from "../../store/events";
import "./EventsList.css";

const EventsList = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAllEvents());
    }, [])


    const allEvents = useSelector(state => state.events.events)


const eventNodes = () => {
    if (allEvents) {

        console.log("all events exists, what is it", allEvents);

        const events = allEvents.Events;

        // console.log("does this work?", events)

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


            console.log('current event:', event, "previewEventImage", previewEventImageUrl);

            const { startDate, endDate, name, description } = event;


            return (
                <li key={event.id} className="event-node">
                    <div className="event-node-image">{previewEventImageUrl}</div>
                    <div className="event-node-text">
                    <div>{startDate}</div>
                    <div>{endDate}</div>
                    <div>{name}</div>
                    <div>{description}</div>
                    </div>
                </li>
            )
        }))
    }
    return (<p> testing </p>)
    }
    ////////////////

    //console.log("eventNodes", eventNodes());


    return (
        <>
        <EventsGroupsHeader eventsOrGroups="Events"/>
        <div className="event-group-header"></div>
        <ul className="group-wrapper">
            {eventNodes()}
        </ul>
        </>
    )
}

export default EventsList;
