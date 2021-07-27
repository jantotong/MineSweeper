import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Board from './Components/Board';
import './style.scss';

class Game extends Component {
    render() {
        return (
            <div className="game">
                <Board />
            </div>
        );
    }
}
ReactDOM.render(<Game />, document.getElementById("root") || document.createElement('div'));
export default Game;