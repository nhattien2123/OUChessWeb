import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

type PrivateRouterProps = {
    component: React.FC<any>;
};

const PrivateRouter: React.FC<PrivateRouterProps> = ({ component: Component }) => {
    const token = Cookies.get('token');
    if (!token) {
        return <Navigate to={'/login'} />;
    } else {
        return <Component />;
    }
};

export default PrivateRouter;
