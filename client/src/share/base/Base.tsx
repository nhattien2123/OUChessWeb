import React from 'react';
import Header from 'src/share/header/Header';
import Sidebar from 'src/share/sidebar/Sidebar';
import 'src/share/base/Base.scss';
import { useAppSelector } from 'src/app/hooks';
import { RootState } from 'src/app/store';

type Props = {
    component: any;
};

const Base: React.FC<Props> = (props: Props) => {
    const { component } = props;
    const currentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);
    return (
        <>
            {currentUser._id && <Header />}
            <Sidebar />

            <div className="content-field">{component}</div>
        </>
    );
};

export default Base;
