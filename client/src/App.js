import React from 'react';
import { Provider } from 'react-redux'
import PlaySpace from './components/PlaySpace'
import store from './store'

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <PlaySpace />
      </Provider>
    </div>
  );
}

export default App;
