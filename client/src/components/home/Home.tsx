import Cookies from 'js-cookie';
import { useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Props {}

const Home = (props: Props) => {
    const currentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);

    useEffect(() => {
        if (currentUser) {
            Cookies.set('user', JSON.stringify(currentUser));
        }
        console.log(currentUser);
    }, [currentUser]);

    return (
        <>
            <div>Home</div>
            <Link to={`/profile/${currentUser.username}`}>Go</Link>
        </>
    );
};

export default Home;
