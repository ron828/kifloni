import React from 'react'
import './gameover.scss'
import win from './win.mp3'

class GameOver extends React.Component {

    constructor() {
        super()
        this.recordsToKeep = 10
        this.winSound = new Audio(win)
    }

    componentDidMount() {
        this.celebrate()
        this.storeRecord()
    }

    celebrate = () => {
        if (this.winSound.paused) {
            this.winSound.play()
        }
        else {
            this.winSound.currentTime = 0
        }
        window.confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }

    storeRecord() {
        if (this.props.mode === "normal") {
            let recordsStr = localStorage.getItem("records")
            let records = []
            if (recordsStr) {
                records = JSON.parse(recordsStr)
            }
            records.push(this.props.totalTime)
            records.sort((a, b) => a - b)
            if (records.length > this.recordsToKeep) {
                records.pop()
            }
            localStorage.setItem("records", JSON.stringify(records))
        }
    }

    render() {
        let message
        if (this.props.mode !== "normal") {
            message = <div className="finished-message">כל הכבוד!</div>
        }
        else {
            message = <div className="finished-message">זמן כולל: {this.props.totalTime} שניות</div>
        }
        return (
            <section className="gameover-container">
                <div className="card">
                    <button id="button-smiley" onClick={this.celebrate}>
                        <span role="img" aria-label="partying smiley">&#128526;</span>
                    </button>
                    {message}
                    <div id="mistakes">טעויות: {this.props.mistakes}</div>
                    <div className="buttons">
                        <button onClick={this.props.restart}>משחק חדש</button>
                        {this.props.mistakes > 0 ? <button id="button-mistakes" onClick={this.props.restartMistakes}>חזרה על טעויות</button> : ''}
                    </div>
                    <button className="link-home link" onClick={this.props.stopGame}>לעמוד הבית</button>
                </div>
            </section>
        )
    }
}

export default GameOver