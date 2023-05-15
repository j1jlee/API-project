
import { useParams, NavLink } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchGroupByGroupId } from "../../store/groups";
import { fetchEventsByGroupId } from "../../store/events";
import './GroupDetails.css'
import { useRouteMatch, useHistory } from "react-router-dom";

import OpenModalButton from "../OpenModalButton";
import DeleteGroupModal from "../DeleteGroupModal";

import { formattedDateString, eventSort, firstUpcomingEventIndex, urlToImage } from "../aaComponentMiddleware";

//import { refreshGroup } from "../../store/groups";

const GroupDetails = () => {

    //let hackyNonsense = 0;

    const dispatch = useDispatch();
    const { groupId } = useParams();
    const { url } = useRouteMatch();
    const history = useHistory();

    useEffect(() => {
        dispatch(fetchGroupByGroupId(groupId));
        dispatch(fetchEventsByGroupId(groupId));


    }, []);



    const thisGroup = useSelector((state) => state.groups.group);
    const thisGroupEvents = useSelector((state) => state.events);
   // let numberOfEvents;
    const currentUser = useSelector((state) => state.session.user);

//    let outerEventNum = 0;
//     try {
//         if (thisGroupEvents) {
//             outerEventNum = thisGroupEvents.events.length;
//         }
//     } catch {}

    // let currentUserId = 0;
    // try {
    //     if (currentUser) {
    //         currentUserId = currentUser.id;
    //     }
    // } catch {}

    //console.log("currentuserid", currentUserId);

    // console.log("thisgroupevents", thisGroupEvents);

    const handleClick = (e) => {
        e.preventDefault();
        alert("Feature coming soon")
    }

    const forwardToGroupId = () => {
        try {
            history.push(`/groups/${thisGroup.id}/edit`);
        } catch {}
    }

    const forwardToCreateEvent = () => {
        try {
            history.push(`/groups/${thisGroup.id}/events/new`)
        } catch {}
    }

    const isOrganizer = () => {
        try {
            const currentUserId = currentUser.id;
            if (currentUserId === thisGroup.organizerId) {
                return (
                    <>
                    <div className="buttons-gray">
                    <button onClick={forwardToCreateEvent}>Create Event</button>
                    <button onClick={forwardToGroupId}>Update</button>
                    <OpenModalButton
          buttonText="Delete"
          modalComponent={<DeleteGroupModal groupId={thisGroup.id}/>}
        />
                    {/* <button>Delete</button> */}
                    </div>
                    </>
                //"buttons-create-update-delete" //is organizer
                )
            } else {
                return (<>
                        <div className="buttons-red">
                     <button onClick={handleClick}>Join this group</button>
                        </div>
                </>)
                //"buttons-join" //logged in but not organizer
            }
        } catch {
            return (<></>) //not logged in
        }
    }
    /* 	if organizer, see
		create event, update, delete
	if not logged in, see
		join this group
	if logged in but NOT organizer, see
		join this group */

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
                                {urlToImage(groupImageUrl, 3)}
                                {/* {groupImageUrl} */}
                            </div>
                            </div>

                        <div className="gd-top-group-description">
                            <div>{name}</div>
                            <div>{city}, {state}</div>
                            <div>{numEvents} events · {publicOrPrivate}</div>
                            <div>Organized by: {firstName} {lastName}</div>

                            <div className="gd-join-or-edit-buttons">
                           {isOrganizer()}
                            </div>
                        </div>
                    </div>
                    {/*  */}

                    </div>

                    {/*  */}


                   {/* ///////////////////////////            */}
                    <div className="group-details-middle">
                        <div className="gd-middle-organizer">Organizer</div>
                        <div>{firstName} {lastName}</div>
                        <br></br>
                        <div className="gd-middle-about">What we're about</div>
                        <div>{about}</div>
                    </div>
                    {/*  */}

                    {/*  */}
                </>
                );
                }

        } catch {
            // console.log("break");
            return (
                "loading:"
            )
        }
    }


    // please work lol
    let previousEvents = [];
    let upcomingEvents = [];

    try {
            if (thisGroupEvents) {
                const currentEvents = thisGroupEvents.events;

            //    let currentEventsSorted;
               const currentEventsSorted = eventSort(currentEvents);

                const upcomingEventIndex = firstUpcomingEventIndex(currentEventsSorted);
                // console.log("upcoming event index?", upcomingEventIndex);


                if (upcomingEventIndex === -1) {
                    previousEvents = [...currentEventsSorted];
                } else {
                    previousEvents = [...currentEventsSorted.slice(0, upcomingEventIndex)];
                    upcomingEvents = [...currentEventsSorted.slice(upcomingEventIndex)]
                }

                // console.log('previous events', previousEvents);
                // console.log('upcoming events', upcomingEvents);
            }
     }
        catch {}





    /* previous or upcoming */
    const renderEventDetails = (events) => {
        try {
            if (events) {
            return (
                events.map((event) => {
                // currentEventsSorted.map((event) => {
                // currentEvents.map((event) => {

                let previewEventImageUrl = "N/A";

                try {
                    if (event.EventImages) {
                        let eventImage = event.EventImages.find((image) => image.preview === true)
                        previewEventImageUrl = eventImage.url;
                    }
                    // if (event.previewImage) {
                    //     previewEventImageUrl = event.previewImage;
                    // }
                } catch {
                    previewEventImageUrl = "still N/A"
                }

                const { startDate, endDate, name, description } = event;


                return (
                    <NavLink key={event.id} className='gd-event-node-a' to={`/events/${event.id}`}>
                    <div className="gd-node-margin-remove">
                        <li key={event.id} className="gd-event-node">
                        <div className="gd-event-node-image">{urlToImage(previewEventImageUrl, 1)}</div>
                        {/* <div className="gd-event-node-image">{previewEventImageUrl}</div> */}
                        <div className="gd-event-node-text">
                        <div className="gd-event-date">{formattedDateString(startDate)}</div>
                        {/* <div>{formattedDateString(endDate)}</div> */}
                        <div className="gd-event-name">{name}</div>
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

            <div className="group-details-event-wrapper">
            <div className="group-details-event-num">Upcoming Events {`(${upcomingEvents.length || 0})`}</div>
            {/* <div className="group-details-event-num">Upcoming Events {`(${outerEventNum || 0})`}</div> */}
            {renderEventDetails(upcomingEvents)}


            <div className="group-details-event-num">Previous Events {`(${previousEvents.length || 0})`}</div>
            {/* <div className="group-details-event-num">Upcoming Events {`(${outerEventNum || 0})`}</div> */}
            {renderEventDetails(previousEvents)}

            <br></br>
            <br></br>
            <br></br>
            <br></br>

            </div> {/* group details event wrapper */}
        </div>
        </>
        )
}

export default GroupDetails;
