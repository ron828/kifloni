import React from 'react'
import './homepage.scss'

class Homepage extends React.Component {

    constructor() {
        super()
        this.state = {
            records: [],
            mistakes: [],
            view: "home"
        }
    }

    componentDidMount() {
        let recordsStr = localStorage.getItem("records") || "[]"
        let mistakesStr = localStorage.getItem("mistakes") || "[]"
        let mistakes = JSON.parse(mistakesStr).sort((a, b) => b[1] - a[1])
        mistakes = mistakes.map(arr => {
            return [JSON.parse(arr[0]), arr[1]]
        })
        if (mistakes.length > 10) {
            mistakes = mistakes.slice(0, 10)
        }
        this.setState({
            records: JSON.parse(recordsStr),
            mistakes: mistakes
        })
    }

    clearRecords = () => {
        localStorage.setItem("records", "[]")
        this.setState({
            records: []
        }, window.history.back())
    }

    clearMistakes = () => {
        localStorage.setItem("mistakes", "[]")
        this.setState({
            mistakes: []
        }, window.history.back())
    }

    changeView(view) {
        this.setState({
            view: view
        })
    }

    render() {
        let records = this.state.records
        let mistakes = this.state.mistakes
        let view = this.state.view
        let page
        if (view === "home") {
            page = <section id="homepage-container">
                <div className="card">
                    <h1>כִּפְלוֹנִי</h1>
                    <button id="button-start" onClick={() => this.props.startGame("normal")}>התחלה</button>
                    {records.length > 0 || mistakes.length > 0 ?
                        <div id="links">
                            {records.length > 0 ? <button className="link" onClick={() => this.changeView("records")}>שיאים</button> : ''}
                            {mistakes.length > 0 ? <button className="link" onClick={() => this.changeView("mistakes")}>טעויות</button> : ''}
                        </div>
                        : ''
                    }

                </div>
            </section>
        }
        else if (view === "mistakes") {
            let mistakesTable = mistakes.map((arr, index) => {
                return (
                    <tr key={index}>
                        <td>{arr[0].a} &#215; {arr[0].b}</td>
                        <td>{arr[1]}</td>
                    </tr>
                )
            })
            page = <section id="mistakes-container">
                <div className="card">
                    <h1>טעויות</h1>
                    <table>
                        <tbody>
                            <tr>
                                <th>תרגיל</th>
                                <th>טעויות</th>
                            </tr>
                            {mistakesTable}
                        </tbody>
                    </table>
                    <div id="buttons">
                        <button key={0} onClick={() => this.props.startGame("practice")}>אימון טעויות</button>
                        <button key={1} onClick={this.clearMistakes}>איפוס טעויות</button>
                    </div>
                    <button className="link" onClick={() => this.changeView("home")}>לעמוד הבית</button>
                </div>
            </section>
        }
        else if (view === "records") {
            let recordsTable = records.map((r, index) => {
                return (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{r} שניות</td>
                    </tr>
                )
            })
            page = <section id="records-container">
                <div className="card">
                    <h1>שיאים</h1>
                    <table>
                        <tbody>
                            <tr>
                                <th>מקום</th>
                                <th>זמן</th>
                            </tr>
                            {recordsTable}
                        </tbody>
                    </table>
                    <button onClick={this.clearRecords}>איפוס שיאים</button>
                    <button className="link" onClick={() => this.changeView("home")}>לעמוד הבית</button>
                </div>
            </section>
        }

        return (
            <div className="top-container">
                {page}
            </div>
        )
    }
}

export default Homepage