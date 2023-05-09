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

    //////////
    const allEvents = useSelector(state => state.events.events)




    const eventNodes = () => {
    if (allEvents) {
        const events = allEvents.Events;

        return (events.map((event) => {

            /* startDate, endDate, name, description eventImages from each detailFetch to GET */
            const { name, location, about, previewImage } = event;
            let privateOrPublic;
            event.private ? privateOrPublic = "Private" : privateOrPublic = "Public";

            return (
                <li key={event.id} className="event-node">
                    <div className="event-node-image">{previewImage}</div>
                    {/* TODO: get number of events */}
                    <div className="event-node-text">
                    <div>{name}</div>
                    <div>{location}</div>
                    <div>{about}</div>
                    <div>{privateOrPublic}</div>
                    </div>
                </li>
            )
        }))
    }

    return (<p> testing </p>)
    }


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
