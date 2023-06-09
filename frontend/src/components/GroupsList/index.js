import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllGroups } from "../../store/groups";
import EventsGroupsHeader from "../EventsGroupsHeader/EventsGroupsHeader";
import { NavLink } from "react-router-dom";
import { useRouteMatch } from "react-router-dom";
import "./GroupsList.css";

import { urlToImage } from "../aaComponentMiddleware";

import { refreshGroup } from "../../store/groups";
import { refreshEvent } from "../../store/events";


const GroupsList = () => {

    const dispatch = useDispatch();

    useEffect(()=> {
         dispatch(fetchAllGroups());

        dispatch(refreshGroup());
        //  dispatch(refreshEvent());
        }, [])




    const allGroups = useSelector(state => state.groups.groups)
    // const history = useHistory();
    const { url } = useRouteMatch();

    // console.log("url", url)

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
                    const { name, about, city, state, previewImage, numEvents } = group;
                    let privateOrPublic;
                    group.private ? privateOrPublic = "Private" : privateOrPublic = "Public";

                    return (
                        <NavLink key={group.id} className="group-node-a" to={`${url}/${group.id}`}>
                        {/* <NavLink key={group.id} className="group-node-a" onClick={redirect(group.id)}> */}
                        {/* <a key={group.id} className="group-node-a" href={`/groups/${group.id}`}> */}
                        <li className="group-node">
                            <div className="group-node-image">{urlToImage(previewImage, 1)}</div>
                            {/* <div className="group-node-image">{previewImage}</div> */}
                            {/* TODO: get number of events */}
                            <div className="group-node-text">
                            <div className="group-node-text-name">{name}</div>
                            <div className="group-node-text-place">{city}, {state}</div>
                            <div className="group-node-text-about">{about}</div>
                            <div className="group-node-text-events-private">{numEvents} events · {privateOrPublic}</div>
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
        <div className="events-groups-header-wrapper">
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

        </div>
        </>
    )
}

export default GroupsList;
