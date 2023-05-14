
import './CreateGroup.css';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchCreateGroup } from '../../store/groups';
import { useHistory } from 'react-router-dom';
import { refreshGroup } from '../../store/groups';


const NewGroup = () => {

    const dispatch = useDispatch();

    const [ name, setName ] = useState('');
    const [ about, setAbout ] = useState('');
    const [ type, setType ] = useState('In person');
    const [ groupPrivate, setGroupPrivate ] = useState(true);
    const [ city, setCity ] = useState('');
    const [ state, setState ] = useState('');
    const [ imageUrl, setImageUrl ] = useState('');

    const [ errors, setErrors ] = useState({});

    const history = useHistory();

    //console.log("errors?", errors)

    useEffect(() => {

        dispatch(refreshGroup());
    }, [])

    const createNewGroupButton = async (e) => {
        e.preventDefault();

        const newGroup = {
            name,
            about,
            type,
            "private": groupPrivate,
            city,
            state
        }



        // try {
        //     await dispatch(fetchCreateGroup(newGroup));
        //     resetEntries();
        // } catch {
        //     const res = await dispatch(fetchCreateGroup(newGroup));
        //     console.log("res?", res);
        //     const data = await res.json();
        // if (data && data.errors) setErrors(data.errors);
        // }
        setErrors({});

        return dispatch(fetchCreateGroup(newGroup))
        // .then(resetEntries)
        .then((res) => history.push(`/groups/${res.id}`))
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(data.errors);
        }
        )
    }

    // setErrors({});
    // return dispatch(sessionActions.login({ credential, password }))
    // .then(closeModal)
    // .catch(async (res) => {
    //     const data = await res.json();
    //     if (data && data.errors) setErrors(data.errors);
    //   }
    // );

    const resetEntries = () => {
        setName('');
        setAbout('');
        setType('In person');
        setGroupPrivate(true);
        setCity('');
        setState('');
    }
        // dispatch(fetchCreateGroup(
        //     {
        //         "name": "newestGroupCREATEBUTTON",
        //         "about": "This is the newest group! Need to fill up 50 characters somehow, from create button.",
        //         "type": "Online",
        //         "private": "true",
        //         "city": "Metrocity",
        //         "state": "NY"
        //       }
        // ))


        return (
            <>
            <div className="create-group-wrapper">
            {/* <h1>NEW GROUP FORM</h1> */}
            <h1>START A NEW GROUP</h1>
            {/* <button onClick={createNewGroupButton}>CLick me to create a new group!</button> */}

            <p>BECOME AN ORGANIZER</p>
<h2>We'll walk you through a few steps to build your local community</h2>

            <form onSubmit={createNewGroupButton}>

            <h2>Set your group's location</h2>
            {/* <h2>First, set your group's location.</h2> */}
            <p>
            Meetup groups meet locally, in person, and online. We'll connect you with people in your area.
            </p>
            {/* <p>
            Meetup groups meet locally, in person and online. We'll connect you with people
            in your area, and more can join you online.
            </p> */}

            City:
            <input className="create-group-city-input"
                type='text'
                onChange={(e) => setCity(e.target.value)}
                value={city}
                placeholder="City"
                name="City"
            />
            {errors.city && <p className="errors-p">{errors.city}</p>}

            State:
            <input className="create-group-state-input"
                type='text'
                onChange={(e) => setState(e.target.value)}
                value={state}
                placeholder="STATE"
                name="state"
            />
            {errors.state && <p className="errors-p">{errors.state}</p>}

            <h2>What will your group's name be?</h2>
<p>Choose a name that will give people a clear idea of what the group is about.
Feel free to get creative! You can edit this later if you change your mind.</p>



                Name:
                <input
                    type='text'
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    placeholder="What is your group name?"
                    name="name"
                />
                {errors.name && <p className="errors-p">{errors.name}</p>}

                <h2>Describe the purpose of your group.</h2>
                {/* <h2>Now describe what your group will be about</h2> */}
<p>People will see this when we promote your group, but you'll be able to add to it later, too.</p>
<ol>
<li>1. What's the purpose of the group?</li>
<li>2. Who should join?</li>
<li>3. What will you do at your events?</li>
    </ol>
{/* 1. What's the purpose of the group?<br></br>
2. Who should join?<br></br>
3. What will you do at your events? */}


                About:
                <input className="create-group-about-input"
                    type='textarea'
                    onChange={(e) => setAbout(e.target.value)}
                    value={about}
                    placeholder="Please write at least 30 characters"
                    name="about"
                />
                {errors.about && <p className="errors-p">{errors.about}</p>}

                <h2>Final steps...</h2>
<p>Is this an in-person or online group?</p>



                Type:
                <select name="type"
                onChange={(e) => setType(e.target.value)}>
                    <option value="In person">In Person</option>
                    <option value="Online">Online</option>
                </select>
                {errors.type && <p className="errors-p">{errors.type}</p>}

                <p>Is this group private or public?</p>

                Private:
                <select name="type"
                onChange={(e) => setGroupPrivate(e.target.value)}>
                    <option value={true}>Private</option>
                    <option value={false}>Public</option>
                </select>
                {errors.private && <p className="errors-p">{errors.private}</p>}

                <p>TODO: IMAGEURL IMPLEMENTATION"""""" Please add an image url for your group below:</p>
                <input className="create-group-image-url"
                    type='text'
                    onChange={(e) => setImageUrl(e.target.value)}
                    value={imageUrl}
                    placeholder="Image Url"
                    name="imageUrl"
                />
                {/* {errors.imageUrl && <p className="errors-p">{errors.imageUrl}</p>} */}

<br></br>
<br></br>
                <button type="submit" className="universal-button-red universal-button-wide">Create Group</button>
            </form>

            </div>
        </>
    )
}


export default NewGroup;
