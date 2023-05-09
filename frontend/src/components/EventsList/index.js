import { NavLink } from "react-router-dom"
import EventsGroupsHeader from "../EventsGroupsHeader/EventsGroupsHeader";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllGroups } from "../../store/groups";
import "./EventsList.css";

const EventsList = () => {
    return (
        <>
        <EventsGroupsHeader eventsOrGroups="Events"/>
        <div className="event-group-header"></div>
        <ul className="group-wrapper" />
        </>
    )
}

export default EventsList;


// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchAllGroups } from "../../store/groups";
// import EventsGroupsHeader from "../EventsGroupsHeader/EventsGroupsHeader";
// import "./GroupsList.css";

// const GroupsList = () => {

//     const dispatch = useDispatch();

//     useEffect(()=> {
//          dispatch(fetchAllGroups());
//         }, [])

//     const allGroups = useSelector(state => state.groups.groups)

//     if (allGroups) {
//         console.log("allgroups:", allGroups.Groups);
//         console.log("typeof allgroups", typeof allGroups)
//      }

//      const groupNodes = () => {
//         if (allGroups) {
//             const groups = allGroups.Groups;

//             return (groups.map((group) => {
//                 const { name, location, about, previewImage } = group;
//                 let privateOrPublic;
//                 group.private ? privateOrPublic = "Private" : privateOrPublic = "   Public";

//                 return (
//                     <li key={group.id} className="group-node">
//                         <div className="group-node-image">{previewImage}</div>
//                         {/* TODO: get number of events */}
//                         <div className="group-node-text">
//                         <div>{name}</div>
//                         <div>{location}</div>
//                         <div>{about}</div>
//                         <div>{privateOrPublic}</div>
//                         </div>
//                     </li>
//                 )
//             }))
//         }

//         return (<p> testing </p>)
//      }


//     return (
//         <>
//         <EventsGroupsHeader eventsOrGroups="Groups"/>
//         <div className="event-group-header"></div>
//         <ul className="group-wrapper">

//             {/* {allGroups.Groups.map(({name, location, about, previewImage}) => (
//                 <li>
//                 <div>{previewImage}</div>
//                 <div>{name}</div>
//                 <div>{location}</div>
//                 <div>{about}</div>
//                 <div>{"private"}</div>
//             </li>
//             ))} */}
//             {groupNodes()}
//         </ul>
//         </>
//     )
// }

// export default GroupsList;
