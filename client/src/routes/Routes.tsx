import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRouter from './PrivateRoute';
import Login from 'src/components/login/Login';
import Home from 'src/components/home/Home';
import Register from 'src/components/register/Register';
import Game from 'src/components/game/Game';
import Matches from 'src/components/matches/Matches';
import ForgetPassword from 'src/components/forget/ForgetPassword';
import Editor from 'src/components/editor/Editor';
import Profile from 'src/components/profile/Profile';
import Messenger from 'src/components/messenger/Messenger';
import Base from 'src/share/base/Base';
import Players from 'src/components/players/Players';
import Admin from 'src/components/admin/Admin';

interface RouterProps { }

const Router: React.FC<RouterProps> = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PrivateRouter component={<Home />} />} />
                <Route
                    path="/profile/:username/edit"
                    element={<PrivateRouter component={<Base component={<Editor />} />} />}
                />
                <Route path="/messages" element={<PrivateRouter component={<Base component={<Messenger />} />} />} />
                <Route
                    path="/messages/:chatId"
                    element={<PrivateRouter component={<Base component={<Messenger />} />} />}
                />
                <Route path="/profile/:username" element={<Base component={<Profile />} />} />
                <Route path="/player" element={<PrivateRouter component={<Base component={<Players />} />} />} />
                <Route path="/login" element={<Login />}></Route>
                <Route path="/game/live/:matchId" element={<PrivateRouter component={<Game />} />} />
                {/* <Route path="/game/live/:matchId" element={<Game />}></Route> */}
                <Route path="/register" element={<Register />} />
                <Route path="/play/online" element={<PrivateRouter component={<Matches />} />} />
                <Route path="/forget" element={<ForgetPassword />} />
                <Route path="/admin" element={<Admin />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
