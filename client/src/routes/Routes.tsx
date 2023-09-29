import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import PrivateRouter from './PrivateRoute';
import Login from '../components/login/Login';
import Home from '../components/home/Home';
import Register from '../components/register/Register';
import ForgetPassword from '../components/forget/ForgetPassword';
import Editor from "../components/Editor/Editor";
import Profile from '../components/Profile/Profile';
import Messenger from '../components/Messenger/Messenger';

interface RouterProps {}

const Router: React.FC<RouterProps> = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PrivateRouter component={Home} />} />
                <Route path='/profile/:username/edit' element={<PrivateRouter component={Editor} />} />
                <Route path='/messages' element={<Messenger />} />
                <Route path="/profile/:username" element={<Profile/>}/>
                <Route path="/login" element={<Login />}></Route>

                <Route path="/register" element={<Register />} />
                <Route path='/forget' element={<ForgetPassword />}/>
                
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
