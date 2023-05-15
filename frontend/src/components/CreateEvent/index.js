
import './CreateEvent.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchCreateEvent } from '../../store/events';
import { useHistory, useParams } from 'react-router-dom';
import { fetchGroupByGroupId } from '../../store/groups';

import { refreshEvent } from '../../store/events';
import { refreshGroup } from '../../store/groups';

import { lineBreakOrErrors } from '../aaComponentMiddleware';
import { formattedDateForm } from '../aaComponentMiddleware';

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

    //const [ venueId, setVenueId ] = useState('');
    const [ name, setName ] = useState('');
    const [ type, setType ] = useState('In person');
    const [ capacity, setCapacity ] = useState('0');
    const [ price, setPrice ] = useState(0);
    const [ description, setDescription ] = useState('');
    const [ startDate, setStartDate ] = useState(formattedDateForm());
    const [ endDate, setEndDate ] = useState(formattedDateForm());
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
            console.log("new errors yay", errors);
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
            <div className="create-event-wrapper">
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
                {lineBreakOrErrors(errors, 'name')}
                {/* {errors.name && <p className="errors-p">{errors.name}</p>} */}


            <div className="create-section-node">
            <p>Is this an in-person or online event?</p>

               <select name="type"
                onChange={(e) => setType(e.target.value)}>
                    <option value="In person">In Person</option>
                    <option value="Online">Online</option>
                </select>
                {lineBreakOrErrors(errors, 'type')}
            </div>
                {/* {errors.type && <p className="errors-p">{errors.type}</p>} */}

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
            <div className="create-section-node">
        <p>What is the price for your event? </p>
            <input className="create-event-price"
                type='number'
                step="any"
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                placeholder="0"
                name="Price"
            />
            {lineBreakOrErrors(errors, 'price')}
        </div>
            {/* {errors.price && <p className="errors-p">{errors.price}</p>} */}

            {/* startDate */}
            <div className="create-section-node">
            <p>When does your event start?</p>
            <input className="create-event-start-date"
                type='datetime-local'
                onChange={(e) => setStartDate(e.target.value)}
                value={startDate}
                placeholder="MM/DD/YYYY HH:mm AM"
                name="startDate"
                />
            {lineBreakOrErrors(errors, 'startDate')}
            {/* {errors.startDate && <p className="errors-p">{errors.startDate}</p>} */}

            {/* endDate */}
            <p>When does your event end?</p>
            <input className="create-event-end-date"
                type='datetime-local'
                onChange={(e) => setEndDate(e.target.value)}
                value={endDate}
                placeholder="MM/DD/YYYY HH:mm AM"
                name="endDate"
            />
            {lineBreakOrErrors(errors, 'endDate')}
            {/* {errors.endDate && <p className="errors-p">{errors.endDate}</p>} */}
            </div>
{/*  */}
            <div className="create-section-node">
            <p>TODO: IMAGEURL IMPLEMENTATION"""""" Please add an image url for your group below:</p>
                <input className="create-group-image-url"
                    type='text'
                    onChange={(e) => setImageUrl(e.target.value)}
                    value={imageUrl}
                    placeholder="Image Url"
                    name="imageUrl"
                />
                {lineBreakOrErrors(errors, 'imageUrl')}
                {/* {errors.imageUrl && <p className="errors-p">{errors.imageUrl}</p>} */}
            </div>

        <div className="create-section-node">
          <p>Please describe your event</p>
                <textarea
                value={description}
                className="create-group-about-input"
                placeholder="Please write at least 30 characters"
                onChange={(e) => setDescription(e.target.value)}></textarea>


                {/* <input className="create-group-about-input"
                    type='textarea'
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    placeholder="Please write at least 30 characters"
                    name="description"
                /> */}
            {lineBreakOrErrors(errors, 'description')}
            {/* {errors.description && <p className="errors-p">{errors.description}</p>} */}
            </div>

                <button type="submit" className="universal-button-red universal-button-wide">Create Event</button>
                <br></br>
                <br></br>
            </form>

            </div>
        </>
    )
}


export default CreateEvent;
