import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import PrivateRouter from './PrivateRoute';
import Login from '../components/login/Login';
import Home from '../components/home/Home';
import Register from '../components/register/Register';
import Game from '../components/game/Game';

interface RouterProps { }

const Router: React.FC<RouterProps> = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PrivateRouter component={Home} />} />
                <Route path="/login" element={<Login />}></Route>
                <Route path="/game" element={<Game />}></Route>
                <Route path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
