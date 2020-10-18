import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import './homepage.scss'

class Homepage extends React.Component {

    constructor() {
        super()
        this.state = {
            records: [],
            mistakes: []
        }
    }

    componentDidMount() {
        let recordsStr = localStorage.getItem("records") || "[]"
        let mistakesStr = localStorage.getItem("mistakes") || "[]"
        let mistakes = JSON.parse(mistakesStr).sort((a, b) => b[1] - a[1])
        mistakes = mistakes.map(arr => {
            return [JSON.parse(arr[0]), arr[1]]
        })
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

    render() {
        let records = this.state.records
        let mistakes = this.state.mistakes
        let mistakesTable = mistakes.map((arr, index) => {
            return (
                <tr key={index}>
                    <td>{arr[0].a} &#215; {arr[0].b}</td>
                    <td>{arr[1]}</td>
                </tr>
            )
        })
        let recordsTable = records.map((r, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{r} שניות</td>
                </tr>
            )
        })
        return (
            <Router>
                <Switch>
                    <Route path="/kifloni/טעויות">
                        <section id="mistakes-container">
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
                                <button onClick={this.clearMistakes}>איפוס טעויות</button>
                            </div>
                        </section>
                    </Route>
                    <Route path="/kifloni/שיאים">
                        <section id="records-container">
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
                            </div>
                        </section>
                    </Route>
                    <Route path="/">
                        <section className="homepage-container">
                            <div className="card">
                                <h1>כִּפְלוֹנִי</h1>
                                <button id="button-start" onClick={this.props.startGame}>התחלה</button>
                                {records.length > 0 || mistakes.length > 0 ?
                                    <div id="links">
                                        {records.length > 0 ? <Link to="/kifloni/שיאים" className="link">שיאים</Link> : ''}
                                        {mistakes.length > 0 ? <Link to="/kifloni/טעויות" className="link">טעויות</Link> : ''}
                                    </div>
                                    : ''
                                }

                            </div>
                        </section>
                    </Route>
                </Switch>
            </Router>

        )
    }
}

export default Homepage