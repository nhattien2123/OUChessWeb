import React, { useEffect, useState } from 'react';
import '../counter/Counter.scss';

type CounterProps = {
    timer: number;
};

const Counter: React.FC<CounterProps> = ({ timer: timer }) => {
    const [time, setTime] = useState(timer);

    useEffect(() => {
        if (time === 0) return;

        const counter = setInterval(() => {
            setTime(time - 1);
        }, 1000);

        return () => clearInterval(counter);
    }, [time]);

    return (
        <>
           
                {time === 0 ? (
                    <button className="counter btn-counter" onClick={(evt) => setTime(timer)}>
                        Gửi
                    </button>
                ) : (
                    <div className="counter clock">{time}</div>
                )}
           
        </>
    );
};

export default Counter;
