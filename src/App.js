import { Provider } from 'react-redux';
import React from 'react';
import { UnitsWrapper } from './components/UnitsWrapper';
import './App.css';
import store from './store';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <UnitsWrapper />
      </div>
    </Provider>
  );
}

export default App;
