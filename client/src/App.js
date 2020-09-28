import React from 'react';
import { Provider } from 'react-redux'
import PlaySpace from './components/PlaySpace'
import Sidebar from './components/Sidebar'
import store from './store'
import './App.css'

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <PlaySpace />
        <Sidebar />
      </Provider>
    </div>
  );
}

export default App;
