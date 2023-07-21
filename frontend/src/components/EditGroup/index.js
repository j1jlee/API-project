
import './EditGroup.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchAllGroups, fetchEditGroup, fetchGroupByGroupId } from '../../store/groups';
import { useHistory, useParams } from 'react-router-dom';

const EditGroup = () => {

    const dispatch = useDispatch();
    const { groupId } = useParams();

    const currentUser = useSelector((state) => state.session.user);
    const currentGroup = useSelector((state) => state.groups.group);
    const history = useHistory();



    useEffect(() => {
        dispatch(fetchGroupByGroupId(groupId));

        if (!currentUser) {
            //console.log("not logged in????")
            history.push("/")
        }
    }, [])

    // console.log("currentuserId", currentUser, "organizerId", currentGroup)

    try { //will only execute once currentUser exists, AND currentGroup exists
    //if (currentUser.id === currentGroup.organizerId) console.log("matching")
    if (currentUser.id !== currentGroup.organizerId) {
        //console.log("currentuserId", currentUser.id, "organizerId", currentGroup.organizer.id);
        history.push("/");
    }

    } catch {}


    let name, about, type, groupPrivate, city, state; //, imageUrl

    try {
        name = currentGroup.name;
        about = currentGroup.about;
        type = currentGroup.type;
        groupPrivate = currentGroup.private;
        city = currentGroup.city;
        state = currentGroup.state;
        // imageUrl = currentGroup.imageUrl; need to pull from groupImages, not here
    } catch {}

    const [ editName, setEditName ] = useState(name);
    const [ editAbout, setEditAbout ] = useState(about);
    const [ editType, setEditType ] = useState(type);
    const [ editGroupPrivate, setEditGroupPrivate ] = useState(groupPrivate);
    const [ editCity, setEditCity ] = useState(city);
    const [ editState, setEditState ] = useState(state);
    const [ editImageUrl, setEditImageUrl ] = useState('');

    const [ errors, setErrors ] = useState({});


    //console.log("errors?", errors)

    // useEffect(() => {
    //     document.title = "Start a New Group"
    // }, [])

    const createNewGroupButton = async (e) => {
        e.preventDefault();

        const updateGroup = {
            "name": editName,
            "about": editAbout,
            "type": editType,
            "private": editGroupPrivate,
            "city": editCity,
            "state": editState
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

        return dispatch(fetchEditGroup(updateGroup, groupId))// should create new reducer
        // .then(resetEntries)
        .then((res) => history.push(`/groups/${res.id}`))
        .catch(async (res) => {

            // console.log("res?", res)

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

    // const resetEntries = () => {
    //     setName('');
    //     setAbout('');
    //     setType('In person');
    //     setGroupPrivate(true);
    //     setCity('');
    //     setState('');
    // }
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
            <h1>UPDATE YOUR GROUPS INFORMATION</h1>
            {/* <button onClick={createNewGroupButton}>CLick me to create a new group!</button> */}

            <p>BECOME AN ORGANIZER</p>
<h2>We'll walk you through a few steps to build your local community</h2>
<br></br>
            <form onSubmit={createNewGroupButton}>

            <div className="create-section-node">

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
                onChange={(e) => setEditCity(e.target.value)}
                value={editCity}
                placeholder="City"
                name="City"
            />
            {errors.city && <p className="errors-p">{errors.city}</p>}

            State:
            <input className="create-group-state-input"
                type='text'
                onChange={(e) => setEditState(e.target.value)}
                value={editState}
                placeholder="STATE"
                name="state"
            />
            {errors.state && <p className="errors-p">{errors.state}</p>}
            </div> {/* end of create-section node */}


            <div className="create-section-node">
            <h2>What will your group's name be?</h2>
<p>Choose a name that will give people a clear idea of what the group is about.
Feel free to get creative! You can edit this later if you change your mind.</p>



                Name:
                <input
                    type='text'
                    onChange={(e) => setEditName(e.target.value)}
                    value={editName}
                    placeholder="What is your group name?"
                    name="name"
                />
                {errors.name && <p className="errors-p">{errors.name}</p>}
            </div>


            <div className="create-section-node">
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
                    onChange={(e) => setEditAbout(e.target.value)}
                    value={editAbout}
                    placeholder="Please write at least 30 characters"
                    name="about"
                />
                {errors.about && <p className="errors-p">{errors.about}</p>}
            </div>

            <div className="create-section-node">
                <h2>Final steps...</h2>
                <p>Is this an in-person or online group?</p>



                Type:
                <select name="type"
                value={editType}
                onChange={(e) => setEditType(e.target.value)}>
                    <option value="In person">In Person</option>
                    <option value="Online">Online</option>
                </select>
                {errors.type && <p className="errors-p">{errors.type}</p>}

                <p>Is this group private or public?</p>

                Private:
                <select name="type"
                value={editGroupPrivate}
                onChange={(e) => setEditGroupPrivate(e.target.value)}>
                    <option value={true}>Private</option>
                    <option value={false}>Public</option>
                </select>
                {errors.private && <p className="errors-p">{errors.private}</p>}

                <p>TODO: IMAGEURL IMPLEMENTATION"""""" Please add an image url for your group below:</p>
                <input className="create-group-image-url"
                    type='text'
                    onChange={(e) => setEditImageUrl(e.target.value)}
                    value={editImageUrl}
                    placeholder="Image Url"
                    name="imageUrl"
                />
                {/* {errors.imageUrl && <p className="errors-p">{errors.imageUrl}</p>} */}
            </div>
<br></br>
<br></br>
                <button type="submit">Update Group</button>
            </form>


            </div>
        </>
    )
}


export default EditGroup;
