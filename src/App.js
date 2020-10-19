import React from 'react';
import Homepage from './homepage';
import Game from './game'
import './App.scss'

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      started: false,
      mode: "normal"
    };
  }

  startGame = (mode) => {
    this.setState({ started: true, mode: mode })
  }

  stopGame = () => {
    this.setState({ started: false, mode: "normal" })
  }

  render() {
    const started = this.state.started;
    const mode = this.state.mode;
    return (
      <section className="app-container">
        { !started ? <Homepage startGame={this.startGame} /> : <Game mode={mode} stopGame={this.stopGame} />}
      </section>
    );
  }
}

export default App;
