import { useEffect, useState } from "react"
import moment from 'moment';

export const CountDownTimer = ({ targetTime }) => {
    const [remainingText, setRemainingText] = useState();

    const setDate = () => {
        let now = moment();
        let targetTimeDate = moment.unix(targetTime);
        let distance = targetTimeDate.diff(now);

        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        let daysStr = days.toString();
        let hoursStr = hours.toString().padStart(2, '0');
        let minutesStr = minutes.toString().padStart(2, '0');
        let secondsStr = seconds.toString().padStart(2, '0');

        if (days) setRemainingText(`${daysStr}:${hoursStr}:${minutesStr}:${secondsStr}`)
        else if (hours) setRemainingText(`${hoursStr}:${minutesStr}:${secondsStr}`)
        else if (minutes) setRemainingText(`${minutesStr}:${secondsStr}`)
        else setRemainingText(`${minutesStr}:${secondsStr}`)

        if (distance < 0) {
            setRemainingText(`EXPIRED`);
        }
    }

    useEffect(() => {
        setDate();
        const interval = setInterval(() => {
            setDate();
        }, 1000)

        return () => {
            clearInterval(interval);
        }
    })


    return (
        <>
            {remainingText}
        </>
    )




}