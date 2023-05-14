
const formattedDateString = (dateString) => {
    const date = new Date(dateString);
    // console.log("datelength", typeof `${date.getUTCDate()}` )
    // console.log('this nonsense', `${date.getUTCDate()}`.length)
    const year = `${date.getUTCFullYear()}`;
    const month = `${`${date.getUTCMonth() + 1}`.length === 1 ? 0 : ''}` + `${date.getUTCMonth() + 1}`;
    const day = `${`${date.getUTCDate}`.length === 1 ? 0 : ''}` + `${date.getUTCDate()}`;

    const hour = `${`${date.getHours()}`.length === 1 ? 0 : ''}` + `${date.getHours()}`;
    const minutes = `${`${date.getMinutes()}`.length === 1 ? 0 : ''}` +`${date.getMinutes()}`;

    return `${year}/${month}/${day} · ${hour}:${minutes}`
}

const formattedDateForm = () => {
    const date = new Date();
    // console.log("datelength", typeof `${date.getUTCDate()}` )
    // console.log('this nonsense', `${date.getUTCDate()}`.length)
    const year = `${date.getUTCFullYear()}`;
    const month = `${`${date.getUTCMonth() + 1}`.length === 1 ? 0 : ''}` + `${date.getUTCMonth() + 1}`;
    const day = `${`${date.getUTCDate}`.length === 1 ? 0 : ''}` + `${date.getUTCDate()}`;

    const hour = `${`${date.getHours()}`.length === 1 ? 0 : ''}` + `${date.getHours()}`;
    const minutes = `${`${date.getMinutes()}`.length === 1 ? 0 : ''}` +`${date.getMinutes()}`;

    return `${year}-${month}-${day}T${hour}:${minutes}`
}

const lineBreakOrErrors = (errors, subject) => {

    // console.log('subject?', subject);
    // console.log('errors in mid', errors);

    // console.log('testing linebreak read', errors[subject])

    return (
        errors[subject] ? <p className="errors-p">{errors[subject]}</p> : <><br></br><br></br></>
    )
}
// const formattedDateMilliseconds = (date) => {

const eventSort = (events) => {
    try {
        let tempEvents = [...events];

        tempEvents.sort((a, b) => {
            console.log("a", (new Date(a.startDate)).getTime());
            console.log("b", b);

            return (new Date(a.startDate)).getTime() - (new Date(b.startDate)).getTime();
        });
        return tempEvents;
    } catch (e) {
        console.log("somewhere failed", e);
        return events;
    }
}

const firstUpcomingEventIndex = (events) => {
    const currentDateMilli = (new Date()).getTime();

    return events.findIndex((event) => {
        return (new Date(event.startDate)).getTime() > currentDateMilli;
    });
}
// }

export { formattedDateString };
export { formattedDateForm };

export { lineBreakOrErrors };

export { eventSort };

export { firstUpcomingEventIndex };
