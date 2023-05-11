
import { NavLink } from "react-router-dom";
import "./EventsGroupsHeader.css"

const EventsGroupsHeader = ({eventsOrGroups}) => {

    const disabledHandler = (trueOrFalse) => {
        if (trueOrFalse) {
            return "not-disabled";
        } else {
            return "disabled";
        }
    }

    return (
        <>
            <div className="events-groups-header-wrapper">
            <div>
            <NavLink to="/events" className={disabledHandler(eventsOrGroups === "Groups")}>Events</NavLink>
            <span>&emsp;</span> {/* four space tab apparently */}
            <NavLink to="/groups" className={disabledHandler(eventsOrGroups === "Events")}>Groups</NavLink>
            </div>
            <br></br>
            <div>
                {eventsOrGroups} in Meetup
            </div>
            </div>
        </>
    )


}

export default EventsGroupsHeader;
