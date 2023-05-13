
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { fetchEventByEventId } from "../../store/events";
import { fetchGroupByGroupId } from "../../store/groups";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import "./EventDetails.css";
import OpenModalButton from "../OpenModalButton";
import DeleteEventModal from "../DeleteEventModal";

//import { refreshEvent } from "../../store/events";

const EventDetails = () => {

    const dispatch = useDispatch();
    const { eventId } = useParams();

    useEffect(() => {
        dispatch(fetchEventByEventId(eventId));

        //dispatch(refreshEvent());
    }, [])

    const thisEvent = useSelector((state) => state.events.events);

    useEffect(() => {
        try {
            dispatch(fetchGroupByGroupId(thisEvent.groupId))
        } catch {}
    }, [thisEvent]);

    const thisGroup = useSelector((state) => state.groups.group)
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

            let { price } = thisEvent;
            if (price == 0) {
                price = "Free";
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

                    <div className="event header">
                    <div>{"< "}
                      <NavLink to="/events">Events</NavLink>
                    </div>
                    <h1>{name}</h1>
                    <p>Hosted by {firstName} {lastName}</p>
                    </div>

                    <div className="event-details-top">
                        <div className="ed-top-link-img">
                            <div>
                                {eventImageUrl}
                            </div>
                            </div>

                        <div className="ed-top-right">
                            <div className="ed-top-right-group">
                            <div>{groupImageUrl}</div>
                            <div>{groupName}</div>
                            <div>{publicOrPrivate}</div>
                            <div>Organized by {firstName} {lastName}</div>
                            </div>

                        <div className="ed-top-right-event-details">
                            <div>{startDate}</div>
                            <div>{endDate}</div>
                            <div><i class="fa-solid fa-dollar-sign"></i> {price}</div>
                            <div>{type}</div>
                            {/* in person or online */}

                        {/*  */}
                        <div>
                        {/* <div className="buttons-gray"> */}
                    <OpenModalButton
                        buttonText="Delete"
                        modalComponent={<DeleteEventModal eventId={eventId} groupId={thisGroup.id}/>}
        />
                    {/* <button>Delete</button> */}
                    </div>





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
