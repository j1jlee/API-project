
import { NavLink } from "react-router-dom";
import "./EventsGroupsHeader.css"

const EventsGroupsHeader = ({eventsOrGroups}) => {

    const disabledHandler = (trueOrFalse) => {
        if (trueOrFalse) {
            return "";
        } else {
            return "disabled";
        }
    }

    return (
        <>
            <div>
            <NavLink to="/events" className={disabledHandler(eventsOrGroups === "Groups")}>Events</NavLink>
            <NavLink to="/groups" className={disabledHandler(eventsOrGroups === "Events")}>Groups</NavLink>
            </div>
            <div>
                {eventsOrGroups} in Meetup
            </div>
        </>
    )


}

export default EventsGroupsHeader;
