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

        if (days) setRemainingText(`${days}:${hours}:${minutes}:${seconds}`)
        else if (hours) setRemainingText(`${hours}:${minutes}:${seconds}`)
        else if (minutes) setRemainingText(`${minutes}:${seconds}`)
        else setRemainingText(`${seconds}`)

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