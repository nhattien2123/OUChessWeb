import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import PrivateRouter from './PrivateRoute';
import Login from 'src/components/login/Login';
import Home from '../components/home/Home';
import Register from 'src/components/register/Register';
import Game from '../components/game/Game';
import Matches from 'src/components/matches/Matches';
import ForgetPassword from 'src/components/forget/ForgetPassword';
import Editor from 'src/components/editor/Editor';
import Profile from 'src/components/profile/Profile';
import Messenger from 'src/components/messenger/Messenger';

interface RouterProps { }

const Router: React.FC<RouterProps> = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PrivateRouter component={Home} />} />
                <Route path="/profile/:username/edit" element={<PrivateRouter component={Editor} />} />
                <Route path="/messages" element={<PrivateRouter component={Messenger} />} />
                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/login" element={<Login />}></Route>
                <Route path="/game" element={<Game />}></Route>
                <Route path="/register" element={<Register />} />
                <Route path='/play/online' element={<Matches />} />
                <Route path="/forget" element={<ForgetPassword />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
