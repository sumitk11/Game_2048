import React, { Component } from 'react';
import './App.css';
import GameGrid from './Container/GameGrid'

class App extends Component {
  render() {
    return (
      <div className="App">
        <GameGrid/>
      </div>
    );
  }
}

export default App;
