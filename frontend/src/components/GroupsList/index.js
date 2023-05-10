import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllGroups } from "../../store/groups";
import EventsGroupsHeader from "../EventsGroupsHeader/EventsGroupsHeader";
import { NavLink } from "react-router-dom";
import { useHistory, useRouteMatch } from "react-router-dom";
import "./GroupsList.css";

const GroupsList = () => {

    const dispatch = useDispatch();

    useEffect(()=> {
         dispatch(fetchAllGroups());
        }, [])

    const allGroups = useSelector(state => state.groups.groups)
    // const history = useHistory();
    const { url } = useRouteMatch();

    console.log("url", url)

    // if (allGroups) {
    //     console.log("allgroups:", allGroups.Groups);
    //     console.log("typeof allgroups", typeof allGroups)
    //  }
    // const redirect = (groupId) => {
    //    history.push(`/${groupId}`)
    // }

     const groupNodes = () => {
        try {
            if (allGroups) {
                const groups = allGroups.Groups;

                return (groups.map((group) => {
                    const { name, location, about, previewImage } = group;
                    let privateOrPublic;
                    group.private ? privateOrPublic = "Private" : privateOrPublic = "Public";

                    return (
                        <NavLink key={group.id} className="group-node-a" to={`${url}/${group.id}`}>
                        {/* <NavLink key={group.id} className="group-node-a" onClick={redirect(group.id)}> */}
                        {/* <a key={group.id} className="group-node-a" href={`/groups/${group.id}`}> */}
                        <li className="group-node">
                            <div className="group-node-image">{previewImage}</div>
                            {/* TODO: get number of events */}
                            <div className="group-node-text">
                            <div>{name}</div>
                            <div>{location}</div>
                            <div>{about}</div>
                            <div>{privateOrPublic}</div>
                            </div>
                        </li>
                        </NavLink>
                        // </a>
                    )
                }))
            }
        } catch {
            return (<p> testing </p>)
        }
     }


    return (
        <>
        <EventsGroupsHeader eventsOrGroups="Groups"/>
        <div className="event-group-header"></div>
        <ul className="group-wrapper">

            {/* {allGroups.Groups.map(({name, location, about, previewImage}) => (
                <li>
                <div>{previewImage}</div>
                <div>{name}</div>
                <div>{location}</div>
                <div>{about}</div>
                <div>{"private"}</div>
            </li>
            ))} */}
            {groupNodes()}
        </ul>
        </>
    )
}

export default GroupsList;
