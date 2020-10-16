import React from 'react';
import Homepage from './homepage';
import Game from './game'
import './App.scss'

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      started: false
    };
  }

  startGame = () => {
    this.setState({ started: true });
  }

  render() {
    const started = this.state.started;
    return (
      <section className="app-container">
        { !started ? <Homepage startGame={this.startGame} /> : <Game />}
      </section>
    );
  }
}

export default App;
