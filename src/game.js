import React from 'react'
import './game.scss'

class Game extends React.Component {
    constructor() {
        super()
        this.nStart = 1
        this.nEnd = 12
        this.totalDrills = 144
        this.nSolutions = 5
        this.solutionsMaxDistance = 20
        this.timeToSolve = 10
        this.timerHandler = null
        this.drills = []
        this.state = {
            currentDrill: {},
            drillSolutions: [],
            correctAnswers: 0,
            timeLeft: this.timeToSolve
        }
    }

    componentDidMount() {
        for (let i = this.nStart; i <= this.nEnd; i++) {
            for (let j = this.nStart; j <= this.nEnd; j++) {
                this.drills.push({ a: i, b: j })
            }
        }
        this.getNextDrill()
    }

    getRandomDrill() {
        return this.drills[Math.floor(Math.random() * this.drills.length)]
    }

    getRandomCloseNumber(n, deltaOptions) {
        let delta = deltaOptions[Math.floor(Math.random() * deltaOptions.length)]
        if (Math.round(Math.random())) {
            return n + delta
        }
        else {
            return n - delta
        }
    }

    getRandomSolutions(n) {
        let solutions = []
        let deltaOptions = []
        for (let i = 1; i <= this.solutionsMaxDistance; i++) {
            deltaOptions.push(i)
        }
        for (let i = 0; i < this.nSolutions; i++) {
            let index = Math.floor(Math.random() * deltaOptions.length)
            let delta = deltaOptions[index]
            let solution = Math.round(Math.random()) ? (n + delta) : (n - delta)
            if (solution < 0) {
                solution = n + delta
            }
            solutions.push(solution)
            deltaOptions.splice(index, 1)
        }
        return solutions
    }

    getPossibleSolutions(drill) {
        let answer = drill.a * drill.b
        let solutions = this.getRandomSolutions(answer)
        solutions[Math.floor(Math.random() * solutions.length)] = answer
        return solutions
    }

    getNextDrill() {
        if (this.timerHandler) {
            clearInterval(this.timerHandler)
        }
        let drill = this.getRandomDrill()
        let solutions = this.getPossibleSolutions(drill)
        this.setState({
            currentDrill: drill,
            drillSolutions: solutions,
            timeLeft: this.timeToSolve
        },
            () => {
                this.timerHandler = setInterval(() => this.tickDown(), 1000)
            }
        )
    }

    tickDown() {
        const time = this.state.timeLeft
        if (time <= 0) {
            clearInterval(this.timerHandler)
        }
        else {
            this.setState({ timeLeft: time - 1 })
        }
    }

    checkAnswer(event, n) {
        const timeLeft = this.state.timeLeft
        var button = event.target
        const drill = this.state.currentDrill
        const answer = drill.a * drill.b
        if (n === answer) {
            // remove drill from pool
            if (timeLeft > 0) {
                this.drills = this.drills.filter(d => (d.a !== drill.a) || (d.b !== drill.b))
                this.setState({ correctAnswers: this.state.correctAnswers + 1 }, this.getNextDrill)
            }
            // go to next drill but keep this on in pool
            else {
                this.getNextDrill()
            }
            
        }
        // wrong answer
        else {
            button.style.backgroundColor = "#FEC8D8"
            setTimeout(() => {
                button.style.backgroundColor = null
            }, 500)
        }
    }

    render() {
        const drill = this.state.currentDrill
        const solutions = this.state.drillSolutions.map(n => {
            return (
                <button className="button-answer" key={n} onClick={(e) => this.checkAnswer(e, n)}>{n}</button>
            )
        })
        const correctAnswers = this.state.correctAnswers
        let timeLeft = this.state.timeLeft
        if (timeLeft <= 0) {
            timeLeft = <span role="img" aria-label="sad face">&#128532;</span>
        }
        return (
            <section className="game-container">
                <div className="drill">{drill.a} &#215; {drill.b} = ?</div>
                <div>{solutions}</div>
                <progress id="progress" value={correctAnswers} max={this.totalDrills}></progress>
                <div id="timer">{timeLeft}</div>
            </section>
        )
    }
}

export default Game