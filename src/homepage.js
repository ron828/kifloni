import React from 'react'
import './homepage.scss'

class Homepage extends React.Component {
    render() {
        return (
            <section className="homepage-container">
                <div className="card">
                    <h1>כִּפְלוֹנִי</h1>
                    <button onClick={this.props.startGame}>התחלה</button>
                </div>
            </section>
        )
    }
}

export default Homepage