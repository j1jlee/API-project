
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

    // console.log(dateParse.getUTCMonth() + 1);
    // console.log(dateParse.getUTCDate());

    // console.log(dateParse.getHours());
    // console.log(dateParse.getMinutes());

}

// const formattedDateMilliseconds = (date) => {

// }

export { formattedDateString };
