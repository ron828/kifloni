import React from 'react'
import './gameover.scss'
import win from './win.mp3'

class GameOver extends React.Component {

    componentDidMount() {
        let winSound = new Audio(win)
        winSound.play()
        window.confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }

    render() {
        return (
            <section className="gameover-container">
                <div className="card">
                    <span role="img" aria-label="partying smiley">&#128526;</span>
                    <div id="total-time">זמן כולל: {this.props.totalTime} שניות</div>
                    <div id="mistakes">טעויות: {this.props.mistakes}</div>
                    <div className="buttons">
                        <button id="button-new-game" onClick={this.props.restart}>משחק חדש</button>
                        {this.props.mistakes > 0 ? <button onClick={this.props.restartMistakes}>חזרה על טעויות</button> : ''}
                    </div>
                </div>
            </section>

        )
    }
}

export default GameOver