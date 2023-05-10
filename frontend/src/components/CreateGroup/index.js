
import './CreateGroup.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchCreateGroup } from '../../store/groups';

const NewGroup = () => {

    const dispatch = useDispatch();

    const createNewGroupButton = (e) => {
        e.preventDefault();

        dispatch(fetchCreateGroup(
            {
                "name": "newestGroupCREATEBUTTON",
                "about": "This is the newest group! Need to fill up 50 characters somehow, from create button.",
                "type": "Online",
                "private": "true",
                "city": "Metrocity",
                "state": "NY"
              }
        ))

    }

    return (
        <>
            <h1>NEW GROUP FORM</h1>
            <button onClick={createNewGroupButton}>CLick me to create a new group!</button>
        </>
    )
}


export default NewGroup;
