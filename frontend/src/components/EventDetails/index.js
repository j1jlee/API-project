
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { fetchEventByEventId } from "../../store/events";
import { fetchGroupByGroupId } from "../../store/groups";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import "./EventDetails.css";
import OpenModalButton from "../OpenModalButton";
import DeleteEventModal from "../DeleteEventModal";

import { formattedDateString } from "../aaComponentMiddleware";

//import { refreshEvent } from "../../store/events";

const EventDetails = () => {

    const dispatch = useDispatch();
    const { eventId } = useParams();


    useEffect(() => {
        dispatch(fetchEventByEventId(eventId));
    }, [])

    const thisEvent = useSelector((state) => state.events.events);

    useEffect(() => {
        try {
            dispatch(fetchGroupByGroupId(thisEvent.groupId))
        } catch {}
    }, [thisEvent]);

    const updateAlert = (e) => {
        e.preventDefault();
        alert("Feature to be added!");
    }

    const currentUser = useSelector((state) => state.session.user);
    const thisGroup = useSelector((state) => state.groups.group)

    const deleteButtonIfOrganizer = () => {
        try {
            if (currentUser.id === thisGroup.Organizer.id) {
                return (
                    <div>
                    <button onClick={updateAlert}>Update</button>

                    <OpenModalButton
                        buttonText="Delete"
                        modalComponent={<DeleteEventModal eventId={eventId} groupId={thisGroup.id}/>}
                    />
                    {/* <button>Delete</button> */}
                    </div>
                )
            }
        } catch {}
    }
        //header,
            /*
            link back to events
            EVENT NAME
            hosted by firstname, lastname from group */

        /*
        eventpicture        minigroup
                            group image, group name, public or private

                            startdate
                            endDate
                            free/ or price (price)
                            in-person or private (type)

        Details
        (description)
         */
    const eventDetailsRender = () => {
        try {
            const { name, description, startDate, endDate, type, groupId } = thisEvent;

            const startDateParse = formattedDateString(startDate);
            const endDateParse = formattedDateString(endDate);

            // let startDateParse = new Date(startDate);
            // console.log("start date parse", startDateParse)
            // console.log(startDateParse.getUTCFullYear());
            // console.log(startDateParse.getUTCMonth() + 1);
            // console.log(startDateParse.getUTCDate());

            // console.log(startDateParse.getHours());
            // console.log(startDateParse.getMinutes());



            let { price } = thisEvent;
            if (price == 0) {
                price = "Free";
            }

            // console.log("type of price", typeof price, "price rn", price)
            // console.log("does stringified price have .", `${price}`.includes('.'))

            if ((price !== "Free") && !`${price}`.includes('.')) {
                price = price + '.00';
            }

            //dispatch, get organizer firstname lastname from groupbyid
            //const thisGroup = await dispatch(fetchGroupByGroupId(groupId));
            //console.log("thisGroup:", thisGroup);
            const { firstName, lastName } = thisGroup.Organizer;
            const groupName = thisGroup.name;
            /////
            let eventImageUrl = "N/A";

            if (thisEvent.EventImages.length > 0) {
                const previewImage = thisEvent.EventImages.find((image) => image.preview === true)

                try {
                    eventImageUrl = previewImage.url
                } catch {

                }
            }

            ///////////
            let groupImageUrl = "N/A";

            if (thisGroup.GroupImages.length) {
                const previewGroupImage = thisGroup.GroupImages.find((image) => image.preview === true)

                try {
                    groupImageUrl = previewGroupImage.url;
                } catch {

                }
            }
            //////////
            let publicOrPrivate = "N/A";

            if (typeof thisGroup.private === 'boolean') {
                if (thisGroup.private === true) {
                    publicOrPrivate = "Private";
                } else {
                    publicOrPrivate = "Public";
                }
            }
            /////////
            return (
            <>
                    <div className="event-details-wrapper">

                    <div className="event-header">
                    <div className="event-header-child">{"< "}
                      <NavLink to="/events">Events</NavLink>
                    </div>
                    <h1>{name}</h1>
                    <p className="event-header-child">Hosted by {firstName} {lastName}</p>
                    </div>

                    <div className="rest-of-page-wrapper">

                    <div className="event-details-top">
                        <div className="ed-top-link-img">
                            <div>
                                {eventImageUrl}
                            </div>
                            </div>

                        <div className="ed-top-right">

                            <NavLink className="ed-top-right-group-navlink" to={`/groups/${groupId}`}>
                            <div className="ed-top-right-grids ed-top-right-group">
                            <div className="ed-top-right-group-image">{groupImageUrl}</div>
                            <div className="ed-top-right-group-info">
                                <div>{groupName}</div>
                                <div>{publicOrPrivate}</div>
                                {/* <div>Organized by {firstName} {lastName}</div> */}
                            </div>
                            </div>
                            </NavLink>

                        <div className="ed-top-right-event-details ed-top-right-grids">

                            <div className="ed-top-right-minigrid-time ed-top-right-grid">
                                <div className="ed-top-right-minigrid-clock-icon">
                                <i className="fa-regular fa-clock fa-2x"></i>
                                </div>


                                <span className="ed-top-right-minigrid-start-label"> START </span>
                                <span className="ed-top-right-minigrid-start-time">{startDateParse}</span>

                                <span className="ed-top-right-minigrid-end-label"> END </span>
                                <span className="ed-top-right-minigrid-end-time">{endDateParse}</span>
                            </div>

                            <div className="ed-top-right-price-grid ed-top-right-grid">
                                <div className="ed-top-right-price-icon">
                                <i class="fa-solid fa-dollar-sign fa-2x"></i>
                                </div>
                                <span className="ed-top-right-price-value">{price}</span>

                            </div>

                            <div className="ed-top-right-price-grid ed-top-right-grid">
                                <div className="ed-top-right-price-icon">
                                <i class="fa-solid fa-map-pin fa-2x"></i>
                                </div>
                                <span className="ed-top-right-price-value">{type}</span>

                            </div>

                            {/* in person or online */}

                        {/*  */}
                        {deleteButtonIfOrganizer()}
                        {/* <div>
                    <OpenModalButton
                        buttonText="Delete"
                        modalComponent={<DeleteEventModal eventId={eventId} groupId={thisGroup.id}/>}
        />
                    {/* <button>Delete</button>
                    </div> */}





                        {/*  */}
                        </div>
                        </div>
                    </div>
                   {/* ///////////////////////////            */}
                    <div className="event-details-main">
                        <h2>Details</h2>
                        <div>{description}</div>
                    </div>

                    </div>

                    </div> {/* rest of page? */}
                </>
            )
//////////////////////////////////

        } catch (e) {
            console.log("error", e)
            return (
                <p>Loading</p>
            )
        }
    }

    //const res = eventDetailsRender();

    //console.log("res", res, "typeof res", typeof res)

    return (
       <div>
        {eventDetailsRender()}
       </div>
    )
};

export default EventDetails;
