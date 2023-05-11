
import { useParams, NavLink } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchGroupByGroupId } from "../../store/groups";
import { fetchEventsByGroupId } from "../../store/events";
import './GroupDetails.css'
import { useRouteMatch } from "react-router-dom";

const GroupDetails = () => {

    let hackyNonsense = 0;

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
    const currentUser = useSelector((state) => state.session.user);

   let outerEventNum = 0;
    try {
        if (thisGroupEvents) {
            outerEventNum = thisGroupEvents.events.length;
        }
    } catch {}

    // let currentUserId = 0;
    // try {
    //     if (currentUser) {
    //         currentUserId = currentUser.id;
    //     }
    // } catch {}

    //console.log("currentuserid", currentUserId);

    console.log("thisgroupevents", thisGroupEvents);

    const handleClick = (e) => {
        e.preventDefault();
        alert("Feature coming soon")
    }

    const joinGroupEnable = () => {
        try {
            const currentUserId = currentUser.id;
            if (currentUserId === thisGroup.organizerId) {
                return "join-button-hidden"
            } else {
                return "join-button-enabled"
            }
        } catch {
            return "join-button-disabled"
        }
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

            return (
                currentEvents.map((event) => {

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
                    <NavLink className='gd-event-node-a' to={`/events/${event.id}`}>
                    <div>
                        <li key={event.id} className="gd-event-node">
                        <div className="gd-event-node-image">{previewEventImageUrl}</div>
                        <div className="gd-event-node-text">
                        <div>{startDate}</div>
                        <div>{endDate}</div>
                        <div>{name}</div>
                        </div>
                        <div>
                        </div>
                    </li>
                        <div className="gd-event-node-description">{description}</div>
                    </div>
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
            <div className="group-details-event-num">Events {`(${outerEventNum || 0})`}</div>
            {renderEventDetails()}
        </div>
        </>


    )
}

export default GroupDetails;
