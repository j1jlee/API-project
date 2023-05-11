
import './CreateGroup.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchCreateGroup } from '../../store/groups';


const NewGroup = () => {

    const dispatch = useDispatch();

    const [ name, setName ] = useState('');
    const [ about, setAbout ] = useState('');
    const [ type, setType ] = useState('In-person');
    const [ groupPrivate, setGroupPrivate ] = useState(true);
    const [ city, setCity ] = useState('');
    const [ state, setState ] = useState('');

    const [ errors, setErrors ] = useState({});


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

        console.log(newGroup);
        console.log("errors?", errors)

        try {
            await dispatch(fetchCreateGroup(newGroup));
            resetEntries();
        } catch {
            const res = await dispatch(fetchCreateGroup(newGroup));
            console.log("res?", res);
            const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
        }
    }

    const resetEntries = () => {
        setName('');
        setAbout('');
        setType('In-person');
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
            <h1>NEW GROUP FORM</h1>
            {/* <button onClick={createNewGroupButton}>CLick me to create a new group!</button> */}

            <form onSubmit={createNewGroupButton}>
                Name:
                <input
                    type='text'
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    placeholder="Name"
                    name="name"
                />
                About:
                <input
                    type='textarea'
                    onChange={(e) => setAbout(e.target.value)}
                    value={about}
                    placeholder="About"
                    name="about"
                />
                Type:
                <select name="type"
                onChange={(e) => setType(e.target.value)}>
                    <option value="In-person">In-person</option>
                    <option value="Online">Online</option>
                </select>
                Private:
                <select name="type"
                onChange={(e) => setGroupPrivate(e.target.value)}>
                    <option value={true}>Private</option>
                    <option value={false}>Public</option>
                </select>

                City:
                <input
                    type='text'
                    onChange={(e) => setCity(e.target.value)}
                    value={city}
                    placeholder="City"
                    name="city"
                />

                State:
                <input
                    type='text'
                    onChange={(e) => setState(e.target.value)}
                    value={state}
                    placeholder="State"
                    name="state"
                />
                {/* about, type, private, city, state */}
                <button type="submit">Create New Group</button>
            </form>

            BECOME AN ORGANIZER
First, set your group's location.
We'll walk you through a few steps to build your local community
Meetup groups meet locally, in person and online. We'll connect you with people
in your area, and more can join you online.
City, STATE
What will your group's name be?
Choose a name that will give people a clear idea of what the group is about.
Feel free to get creative! You can edit this later if you change your mind.
What is your group name?
Now describe what your group will be about
People will see this when we promote your group, but you'll be able to add to it later, too.
1, What's the purpose of the group?
2. Who should join?
3. What will you do at your events?
Please write at least 30 characters
Final steps...
Is this an in person or online group?
Is this group private or public?
Please add an image url for your group below:
        </>
    )
}


export default NewGroup;
