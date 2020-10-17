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
            records: []
        }
    }

    componentDidMount() {
        let recordsStr = localStorage.getItem("records")
        if (recordsStr) {
            this.setState({
                records: JSON.parse(recordsStr)
            })
        }
    }

    clearRecords = () => {
        localStorage.setItem("records", "[]")
        this.setState({
            records: []
        }, window.history.back())
    }

    render() {
        let records = this.state.records
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
                    <Route path="/שיאים">
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
                                <button onClick={this.clearRecords}>אפס שיאים</button>
                            </div>
                        </section>
                    </Route>
                    <Route path="/">
                        <section className="homepage-container">
                            <div className="card">
                                <h1>כִּפְלוֹנִי</h1>
                                <button id="button-start" onClick={this.props.startGame}>התחלה</button>
                                {records.length > 0 ? <Link to="/שיאים" className="link">שיאים</Link> : ''}
                            </div>
                        </section>
                    </Route>
                </Switch>
            </Router>

        )
    }
}

export default Homepage