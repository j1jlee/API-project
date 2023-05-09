
import { useParams, NavLink } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchGroupByGroupId } from "../../store/groups";
import './GroupDetails.css'

const GroupDetails = () => {

    const dispatch = useDispatch();
    const { groupId } = useParams();

    useEffect(() => {
        dispatch(fetchGroupByGroupId(groupId));
    }, []);

    const thisGroup = useSelector((state) => state.groups.group)

    const renderGroupDetails = () => {
        if (thisGroup) {

        const groupImage = thisGroup.GroupImages.find((group) => {
            return group.preview === true;
        })
        let groupImageUrl = "";

        if (groupImage) {
            groupImageUrl = groupImage.url;
        } else {
            groupImageUrl = "N/A";
        }

        const { name, city, state, about } = thisGroup;
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
                    <div>## events</div>
                    <div>{publicOrPrivate}</div>
                    <div>Organized by {firstName} {lastName}</div>
                </div>
            </div>
           {/* ///////////////////////////            */}
            <div className="group-details-middle">
                <div>Organizer</div>
                <div>{firstName} {lastName}</div>
                <div>What we're about</div>
                <div>{about}</div>
            </div>
            <div className="group-details-bottom">
                <div>PLACEHOLDER FOR EVENTS FETCH</div>
            </div>
            </div>
        </>
        );

        }

        return (
            "loading:"
        )

    }





    return (
        <>
            {renderGroupDetails()}
        </>


    )
}

export default GroupDetails;
