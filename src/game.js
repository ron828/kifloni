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
        this.drills = []
        this.state = {
            currentDrill: {},
            drillSolutions: [],
            correctAnswers: 0
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
        let drill = this.getRandomDrill()
        let solutions = this.getPossibleSolutions(drill)
        this.setState({
            currentDrill: drill,
            drillSolutions: solutions
        })
    }

    checkAnswer(n) {
        const drill = this.state.currentDrill
        const answer = drill.a * drill.b
        if (n === answer) {
            // remove drill from pool
            this.drills = this.drills.filter(d => (d.a !== drill.a) || (d.b !== drill.b))
            this.setState({correctAnswers: this.state.correctAnswers + 1})
        }
        else {

        }
        this.getNextDrill()
    }

    render() {
        const drill = this.state.currentDrill
        const solutions = this.state.drillSolutions.map(n => {
            return (
                <button className="button-answer" key={n} onClick={() => this.checkAnswer(n)}>{n}</button>
            )
        })
        const correctAnswers = this.state.correctAnswers
        return (
            <section className="game-container">
                <div className="drill">{drill.a} &#215; {drill.b} = ?</div>
                <div>{solutions}</div>
                <progress id="progress" value={correctAnswers} max={this.totalDrills}></progress>
            </section>
        )
    }
}

export default Game