const { Group, GroupImage, User, Venue, Membership, Event, EventImage, Attendance } = require('../../db/models');

//is organizer
//is member (cohost, sometimes just even member)

//isAttendee (eventId)
//
const reqResTest = async (req, res, groupId) => {
    console.log('does test work?', test);
    console.log('can i pull id from req.user.id?', req.user.id);
    return res.json('test');
}

const isOrganizer = async (req, groupId) => {
    //const groupId = req.params.groupId;
    //const { user } = req;
    const userId = req.user.id;

    const currentGroup = await Group.findByPk(groupId);
    if (!currentGroup) {
        //res.status(400);
        return {"message": "Group couldn't be found"};
    }

    const organizerId = currentGroup.organizerId;

    if (userId === organizerId) {
        return true;
    }
    return false;
};


const isCohost = async (req, groupId) => {
    //const groupId = req.params.groupId;
    //const { user } = req;
    const userId = req.user.id;

    const currentMembership = await Membership.findOne({
        include: {
            model: Group
        },
        where: {
            userId,
            groupId,
        }
    });

    if (!currentMembership) {
        // res.status(400);
        // return res.json({"message": "Must be co-host of group, or organizer to post new venue"});
        return false;
    }

    if (currentMembership.status === "co-host") {
        return true;
    }
    return false;
}

const isAttendee = async (req, eventId) => {
    const userId = req.user.id;

    const currentAttendance = await Attendance.findOne({
        where: {
            userId,
            eventId
        }
    });
    if (currentAttendance) {
        return true;
    }
    return false;
}

module.exports = { isOrganizer, isCohost, reqResTest, isAttendee };
