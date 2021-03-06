import React from 'react'
import GameOver from './gameover'
import './game.scss'
import quack from './quack.mp3'
import correct from './correct-answer.mp3'

class Game extends React.Component {
    constructor() {
        super()

        this.nStart = 3
        this.nEnd = 12
        this.nSolutions = 3
        this.solutionsMaxDistance = 20
        this.timeToSolve = 10
        this.currentDrillWrong = false
        this.timerHandler = null
        this.drills = []
        this.mistakes = []
        this.quackSound = new Audio(quack)
        this.correctSound = new Audio(correct)
        this.startTime = null
        this.mode = null

        this.cleanState = {
            totalDrills: 0,
            currentDrill: {},
            drillSolutions: [],
            correctAnswers: 0,
            timeLeft: this.timeToSolve,
            gameOver: false,
            totalTime: 0
        }

        this.state = this.cleanState
    }

    componentDidMount() {
        this.quackSound.load()
        this.correctSound.load()
        this.mode = this.props.mode
        this.newGame(this.mode)
    }

    // mode: normal, mistakes, practice
    newGame(mode) {
        this.setState(this.cleanState)
        this.drills = []
        this.mode = "normal"
        this.mistakesMode = false
        this.practiceMode = false
        this.currentDrillWrong = false
        this.timerHandler = null

        if (mode === "normal") {
            for (let i = this.nStart; i <= this.nEnd; i++) {
                for (let j = i; j <= this.nEnd; j++) {
                    let drill = { a: i, b: j }
                    if (Math.round(Math.random())) {
                        drill = { a: j, b: i }
                    }
                    this.drills.push(drill)
                }
            }
        }
        else if (mode === "mistakes") {
            this.mode = "mistakes"
            this.drills = this.mistakes
        }
        else if (mode === "practice") {
            this.mode = "practice"
            let mistakesStr = localStorage.getItem("mistakes") || "[]"
            let mistakes = JSON.parse(mistakesStr).sort((a, b) => b[1] - a[1])
            if (mistakes.length > 10) {
                mistakes = mistakes.slice(0, 10)
            }
            mistakes = mistakes.map(arr => {
                return JSON.parse(arr[0])
            })
            this.drills = mistakes
        }

        this.mistakes = []
        this.setState({
            totalDrills: this.drills.length
        },
            this.getNextDrill
        )
        this.startTime = performance.now()
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

    storeMistakes() {
        let storedMapStr = localStorage.getItem("mistakes") || "[]"
        let storedMap = new Map(JSON.parse(storedMapStr))
        this.mistakes.forEach(drill => {

            // normalize drill - first small term then big term
            if (drill.a > drill.b) {
                drill = { a: drill.b, b: drill.a }
            }
            let key = JSON.stringify(drill)
            let n = storedMap.get(key) || 0
            storedMap.set(key, n + 1)
        });
        localStorage.setItem("mistakes", JSON.stringify([...storedMap]))
    }

    gameOver() {
        let end = performance.now()
        let timeElapsed = end - this.startTime
        timeElapsed = Math.floor(timeElapsed / 1000)
        this.storeMistakes()
        this.setState({
            gameOver: true,
            totalTime: timeElapsed
        })
    }

    getNextDrill() {
        if (this.timerHandler) {
            clearInterval(this.timerHandler)
        }
        if (this.drills.length === 0) {
            return this.gameOver()
        }
        this.currentDrillWrong = false
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
        button.blur()
        const drill = this.state.currentDrill
        const answer = drill.a * drill.b
        if (n === answer) {
            if (this.correctSound.paused) {
                this.correctSound.play()
            }
            else {
                this.correctSound.currentTime = 0
            }

            // remove drill from pool
            if (timeLeft > 0 && !this.currentDrillWrong) {
                this.drills = this.drills.filter(d => (d.a !== drill.a) || (d.b !== drill.b))
                this.setState({ correctAnswers: this.state.correctAnswers + 1 }, this.getNextDrill)
            }
            // go to next drill but keep this on in pool
            else {
                if (this.mistakes.indexOf(drill) === -1) {
                    this.mistakes.push(drill)
                }
                this.getNextDrill()
            }

        }
        // wrong answer
        else {
            if (this.mistakes.indexOf(drill) === -1) {
                this.mistakes.push(drill)
            }
            this.currentDrillWrong = true
            this.quackSound.play()
            button.style.backgroundColor = "#FEC8D8"
            button.style.color = "#000"
            setTimeout(() => {
                button.style.backgroundColor = null
                button.style.color = null
            }, 500)
        }
    }

    render() {
        if (this.state.gameOver) {
            return <GameOver totalTime={this.state.totalTime} mistakes={this.mistakes.length} mode={this.mode} restart={() => this.newGame("normal")} restartMistakes={() => this.newGame("mistakes")} stopGame={this.props.stopGame} />
        }
        const totalDrills = this.state.totalDrills
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
                <div className="card">
                    <div className="drill">{drill.a} &#215; {drill.b} = ?</div>
                    <div id="solutions">{solutions}</div>
                    <progress id="progress" value={correctAnswers} max={totalDrills}></progress>
                    <div id="timer">{timeLeft}</div>
                </div>
            </section>
        )
    }
}

export default Game