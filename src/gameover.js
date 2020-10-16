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
                <span role="img" aria-label="partying smiley">&#129395;</span>
                <div id="total-time">זמן כולל: {this.props.totalTime} שניות</div>
            </section>

        )
    }
}

export default GameOver