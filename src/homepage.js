import React from 'react'
import './homepage.scss'

class Homepage extends React.Component {
    render() {
        return (
            <section className="homepage-container">
                <h1>כפלוני</h1>
                <button onClick={this.props.startGame}>התחלה</button>
            </section>
        )
    }
}

export default Homepage