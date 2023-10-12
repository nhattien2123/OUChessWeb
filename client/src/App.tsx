import React from 'react';
import './App.css';
import Router from './routes/Routes';
import { useSockets } from 'src/util/Socket';

function App() {
  return (
    <>
      <Router></Router>
    </>
  );
}

export default App;
