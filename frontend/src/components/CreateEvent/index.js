
import './CreateEvent.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchCreateEvent } from '../../store/events';
import { useHistory, useParams } from 'react-router-dom';
import { fetchGroupByGroupId } from '../../store/groups';

import { refreshEvent } from '../../store/events';
import { refreshGroup } from '../../store/groups';

/* /groups/:groupId/events/new */
const CreateEvent = () => {

    const { groupId } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchGroupByGroupId(groupId));


        dispatch(refreshEvent());
        dispatch(refreshGroup());
    }, [])

    const thisGroup = useSelector((state) => state.groups.group);

    let thisGroupName = "Group";
    try {
        thisGroupName = thisGroup.name;
    } catch {}

    const [ venueId, setVenueId ] = useState('');
    const [ name, setName ] = useState('');
    const [ type, setType ] = useState('In person');
    const [ capacity, setCapacity ] = useState('0');
    const [ price, setPrice ] = useState(0);
    const [ description, setDescription ] = useState('');
    const [ startDate, setStartDate ] = useState(new Date);
    const [ endDate, setEndDate ] = useState(new Date);
    const [ imageUrl, setImageUrl ] = useState("");


            //         "venueId": 2, //hardcode venueId
        //         "name": "asdasdasGROUP3",
        //         "type": "Online",
        //         "capacity": "21",
        //         "price": 1,
        //         "description": "asd",
        //         "startDate": "2024-11-19 20:00:00",
        //         "endDate": "2025-11-19 22:00:00"
    const [ errors, setErrors ] = useState({});

    const history = useHistory();

    const createNewEventButton = async (e) => {
        e.preventDefault();

        const newEvent = {
            "venueId": 1, //hopefully hardcoding this will work
            name,
            type,
            capacity,
            price,
            description,
            startDate,
            endDate
        }

        setErrors({});

        return dispatch(fetchCreateEvent(newEvent, groupId))
        // .then(resetEntries)
        .then((res) => history.push(`/events/${res.id}`))
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(data.errors);
        }
        )
    }

          //     {
        //         "venueId": 2, //hardcode venueId
        //         "name": "asdasdasGROUP3",
        //         "type": "Online",
        //         "capacity": "21",
        //         "price": 1,
        //         "description": "asd",
        //         "startDate": "2024-11-19 20:00:00",
        //         "endDate": "2025-11-19 22:00:00"
        //       }
        // //       }
        // ))


        return (
            <>
            <h1>Create an event for {thisGroupName}</h1>

            {/* <p>BECOME AN ORGANIZER</p>
<h2>We'll walk you through a few steps to build your local community</h2> */}

            <form onSubmit={createNewEventButton}>
<p>
What is the name of your event?
</p>
                <input
                    type='text'
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    placeholder="Event Name"
                    name="name"
                />
                {errors.name && <p className="errors-p">{errors.name}</p>}
<p>Is this an in-person or online event?</p>

               <select name="type"
                onChange={(e) => setType(e.target.value)}>
                    <option value="In person">In Person</option>
                    <option value="Online">Online</option>
                </select>
                {errors.type && <p className="errors-p">{errors.type}</p>}

                {/* <p>Is this event private or public?</p>
                        NO PRIVATE/PUBLIC IN BACKEND FOR EVENTS
                Private:
                <select name="type"
                onChange={(e) => setEventPrivate(e.target.value)}>
                    <option value={true}>Private</option>
                    <option value={false}>Public</option>
                </select>
                {errors.private && <p className="errors-p">{errors.private}</p>} */}

            {/* Price */}
        <p>What is the price for your event? </p>
            <input className="create-event-price"
                type='number'
                step="any"
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                placeholder="0"
                name="Price"
            />
            {errors.price && <p className="errors-p">{errors.price}</p>}

            {/* startDate */}
            <p>When does your event start?</p>
            <input className="create-event-start-date"
                type='datetime-local'
                onChange={(e) => setStartDate(e.target.value)}
                value={startDate}
                placeholder="MM/DD/YYYY HH:mm AM"
                name="startDate"
                />
            {errors.startDate && <p className="errors-p">{errors.startDate}</p>}

            {/* endDate */}
            <p>When does your event end?</p>
            <input className="create-event-end-date"
                type='datetime-local'
                onChange={(e) => setEndDate(e.target.value)}
                value={endDate}
                placeholder="MM/DD/YYYY HH:mm AM"
                name="endDate"
            />
            {errors.endDate && <p className="errors-p">{errors.endDate}</p>}

{/*  */}
            <p>TODO: IMAGEURL IMPLEMENTATION"""""" Please add an image url for your group below:</p>
                <input className="create-group-image-url"
                    type='text'
                    onChange={(e) => setImageUrl(e.target.value)}
                    value={imageUrl}
                    placeholder="Image Url"
                    name="imageUrl"
                />
                {/* {errors.imageUrl && <p className="errors-p">{errors.imageUrl}</p>} */}


          <p>Please describe your event</p>
                <input className="create-group-about-input"
                    type='textarea'
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    placeholder="Please write at least 30 characters"
                    name="description"
                />
                {errors.description && <p className="errors-p">{errors.description}</p>}




<br></br>
<br></br>
                <button type="submit">Create Group</button>
            </form>
        </>
    )
}


export default CreateEvent;
