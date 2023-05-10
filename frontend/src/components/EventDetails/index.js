
import { useParams } from "react-router-dom";

const EventDetails = () => {

    const { eventId } = useParams();

    return (
        <h1> EVENT DETAILS PLACEHOLDER for EVENT :{eventId}</h1>
    )
};

export default EventDetails;
