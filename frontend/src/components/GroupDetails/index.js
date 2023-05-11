
import { useParams, NavLink } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchGroupByGroupId } from "../../store/groups";
import { fetchEventsByGroupId } from "../../store/events";
import './GroupDetails.css'
import { useRouteMatch } from "react-router-dom";

const GroupDetails = () => {

    const [ numberEvents, setNumberEvents ] = useState();


    const dispatch = useDispatch();
    const { groupId } = useParams();
    const { url } = useRouteMatch();

    useEffect(() => {
        dispatch(fetchGroupByGroupId(groupId));

        dispatch(fetchEventsByGroupId(groupId));

    }, []);

    const thisGroup = useSelector((state) => state.groups.group);
    const thisGroupEvents = useSelector((state) => state.events);
   // let numberOfEvents;


    console.log("thisgroupevents", thisGroupEvents);

    const handleClick = (e) => {
        e.preventDefault();
        alert("Feature coming soon")
    }


    const renderGroupDetails = () => {
        try {
            if (thisGroup) {

                const groupImage = thisGroup.GroupImages.find((group) => {
                    return group.preview === true;
                })
                let groupImageUrl = "N/A";

                try {
                    groupImageUrl = groupImage.url
                } catch {

                }
                // if (groupImage) {
                //     groupImageUrl = groupImage.url;
                // } else {
                //     groupImageUrl = "N/A";
                // }

                const { name, city, state, about, numEvents } = thisGroup;

                //setNumberEvents(numEvents);

                const { firstName, lastName } = thisGroup.Organizer;


                let publicOrPrivate = "N/A";

                if (typeof thisGroup.private === 'boolean') {
                    if (thisGroup.private === true) {
                        publicOrPrivate = "Private";
                    } else {
                        publicOrPrivate = "Public";
                    }
                }

                return (
                    <>
                    <div className="group-details-wrapper">
                    <div>{"< "}
                      <NavLink to="/groups">Groups</NavLink>
                    </div>

                    <div className="group-details-top">
                        <div className="gd-top-link-img">
                            <div>
                                {groupImageUrl}
                            </div>
                            </div>

                        <div className="gd-top-group-description">
                            <div>{name}</div>
                            <div>{city}, {state}</div>
                            <div>{numEvents} events · {publicOrPrivate}</div>
                            <div>Organized by: {firstName} {lastName}</div>

                            <div>
                            <button onClick={handleClick}>Join this group</button>

                            </div>
                        </div>
                    </div>
                   {/* ///////////////////////////            */}
                    <div className="group-details-middle">
                        <div>Organizer</div>
                        <div>{firstName} {lastName}</div>
                        <br></br>
                        <div>What we're about</div>
                        <div>{about}</div>
                    </div>
                    </div>
                </>
                );

                }

        } catch {
            console.log("break");
            return (
                "loading:"
            )

        }
    }

    const renderEventDetails = () => {
        try {
            if (thisGroupEvents) {
                const currentEvents = thisGroupEvents.events;

                //console.log("currentEvents", currentEvents)
                //numberOfEvents = currentEvents.length;

            return (currentEvents.map((event) => {

                let previewEventImageUrl = "N/A";

                // if (typeof previewEventImage === 'undefined') {
                //     previewEventImageUrl = "N/A";
                // } else {
                //     previewEventImageUrl = previewEventImage.url;
                try {
                    if (event.previewImage) {
                        previewEventImageUrl = event.previewImage;
                    }
                } catch {
                    previewEventImageUrl = "still N/A"
                }

                const { startDate, endDate, name, description } = event;


                return (
                    <NavLink className='event-node-a' to={`/events/${event.id}`}>
                    <li key={event.id} className="event-node">
                        <div className="event-node-image">{previewEventImageUrl}</div>
                        <div className="event-node-text">
                        <div>{startDate}</div>
                        <div>{endDate}</div>
                        <div>{name}</div>
                        <div>{description}</div>
                        </div>
                    </li>
                    </NavLink>
                )
            }))
            ////////////
            //console.log("currentEvents", currentEvents)
            }
        } catch {
            return ( <p>No corresponding events!</p>)
        }
    }

    //renderEventDetails();


    return (
        <>
        <div className="group-details-and-events-wrapper">
            {renderGroupDetails()}
            {renderEventDetails()}
        </div>
        </>


    )
}

export default GroupDetails;
