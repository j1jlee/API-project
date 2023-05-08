import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllGroups } from "../../store/groups";
import EventsGroupsHeader from "../EventsGroupsHeader/EventsGroupsHeader";

const GroupsList = () => {

    const dispatch = useDispatch();

    useEffect(()=> {
         dispatch(fetchAllGroups());
        }, [])

    const allGroups = useSelector(state => state.groups.groups)

    if (allGroups) {
        console.log("allgroups:", allGroups.Groups);
        console.log("typeof allgroups", typeof allGroups)
     }

     const groupNodes = () => {
        if (allGroups) {
            const groups = allGroups.Groups;

            return (groups.map((group) => {
                const { name, location, about } = group;
                let privateOrPublic;
                group.private ? privateOrPublic = "Private" : privateOrPublic = "   Public";

                return (
                    <li key={group.id}>
                        {/* <div>{previewImage}</div> */}
                        {/* TODO: previewImage comes from GROUPIMAGE */}
                        {/* TODO: get number of events */}
                        <div>{name}</div>
                        <div>{location}</div>
                        <div>{about}</div>
                        <div>{privateOrPublic}</div>
                    </li>
                )
            }))
        }

        return (<p> testing </p>)
     }


    return (
        <>
        <EventsGroupsHeader eventsOrGroups="Groups"/>
        <div className="event-group-header"></div>
        <ul className="group-list">

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
