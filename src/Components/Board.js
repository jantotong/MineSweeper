import React, {Component} from 'react';
import Cell from './Cell';
import Dropdown from "react-dropdown";

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            length: 9,
            boardData: this.setupBoard(9, 10),
            gameStatus: "In Game",
            mineCount: 10,
            timer: {time: [0, 0], start: false,},
        }
    };

    /**
     * Reset board according to difficulty
     * @param difficulty
     */
    reset = (difficulty = null) => {
        let newLength, mineCount;
        switch (difficulty) {
            case "Easy":
                newLength = 4;
                mineCount = 1;
                break;
            case "Hard":
                newLength = 12;
                mineCount = 15;
                break;
            default:
                newLength = 9;
                mineCount = 10;
                break;
        }
        this.stopTimer();
        this.setState({
            length: newLength,
            boardData: this.setupBoard(newLength, mineCount),
            gameStatus: "In Progress",
            mineCount: mineCount,
            timer: {
                time: [0, 0], start: false,
            }
        });
    }

    /**
     * Helper function for DropdownList's onChange
     * @param e
     */
    handleDropDownChange = (e) => {
        let difficulty = e.value.split(" ")[0]
        this.reset(difficulty)
    }

    /**
     * Return number of hidden cells
     * @param data
     * @returns {number}
     */
    getNumberOfUnrevealed = (data) => {
        let unrevealedCell = 0;
        data.forEach(eachrowOfData => {
            eachrowOfData.forEach((dataInRow) => {
                if (!dataInRow.isRevealed) {
                    unrevealedCell = unrevealedCell + 1;
                }
            });
        });
        return unrevealedCell;
    }

    /**
     * Create cells for board -> Activate Mines -> Get the number on cell (Neighbors)
     * @param length
     * @param mines
     * @returns {*|*[]}
     */
    setupBoard = (length, mines) => {
        let data = this.populateCell(length);
        data = this.activateMines(data, length, mines);
        data = this.getNumberOnCell(data, length);
        return data;
    }

    /**
     * Populate board with cells
     * @param length
     * @returns {*[]}
     */
    populateCell = (length) => {
        let data = [];
        for (let row = 0; row < length; row++) {
            data.push([]);
            for (let column = 0; column < length; column++) {
                data[row][column] = {
                    x: row,
                    y: column,
                    hasMine: false,
                    neighbour: 0,
                    isRevealed: false,
                    isEmpty: false,
                    isFlagged: false,
                };
            }
        }
        return data;
    }

    /**
     * Plant random mines on board
     * @param data
     * @param length
     * @param mines
     * @returns {*}
     */
    activateMines = (data, length, mines) => {
        let randomX, randomY, minesPlanted = 0;

        while (minesPlanted < mines) {
            randomX = Math.floor(Math.random() * 1000) % length;
            randomY = Math.floor(Math.random() * 1000) % length;

            if (!(data[randomX][randomY].hasMine)) {
                data[randomX][randomY].hasMine = true;
                minesPlanted++;
            }
        }
        return data;
    }

    /**
     * Returns array of data with the neighbor's number (number on cell)
     * @param data
     * @param length
     * @returns {*}
     */
    getNumberOnCell = (data, length) => {
        let updatedData = data;
        for (let row = 0; row < length; row++) {
            for (let column = 0; column < length; column++) {
                if (data[row][column].hasMine !== true) {
                    let mine = 0;
                    this.getAdjacentEight(length, data[row][column].x, data[row][column].y, data).forEach(value => {
                        if (value.hasMine) {
                            mine++;
                        }
                    });
                    if (mine === 0) {
                        updatedData[row][column].isEmpty = true;
                    }
                    updatedData[row][column].neighbour = mine;
                }
            }
        }
        return updatedData;
    };

    /**
     * Returns array of neighbor cells' data
     * @param length
     * @param x
     * @param y
     * @param data
     * @returns {*[]}
     */
    getAdjacentEight = (length, x, y, data) => {
        const surroundingArr = [];

        if (x > 0) {
            surroundingArr.push(data[x - 1][y]);
        }
        if (x < length - 1) {
            surroundingArr.push(data[x + 1][y]);
        }

        if (y > 0) {
            surroundingArr.push(data[x][y - 1]);
        }

        if (y < length - 1) {
            surroundingArr.push(data[x][y + 1]);
        }

        if (x > 0 && y > 0) {
            surroundingArr.push(data[x - 1][y - 1]);
        }

        if (x > 0 && y < length - 1) {
            surroundingArr.push(data[x - 1][y + 1]);
        }

        if (x < length - 1 && y < length - 1) {
            surroundingArr.push(data[x + 1][y + 1]);
        }

        if (x < length - 1 && y > 0) {
            surroundingArr.push(data[x + 1][y - 1]);
        }
        return surroundingArr;
    }

    /**
     * When Game ends, reveal the board
     */
    revealBoard = () => {
        let updatedData = this.state.boardData;
        updatedData.forEach((rowOfData) => {
            rowOfData.forEach((data) => {
                data.isRevealed = true;
            });
        });
        this.setState({
            boardData: updatedData
        });
    }

    /**
     * Reveal empty cells, and if it's empty, recursively reveal its neighbor's for empty cells
     * @param length
     * @param x
     * @param y
     * @param data
     * @returns {*}
     */
    revealEmpty = (length, x, y, data) => {
        let surroundingEight = this.getAdjacentEight(length, x, y, data);
        surroundingEight.forEach(value => {
            if (!value.isFlagged && !value.isRevealed && (value.isEmpty || !value.hasMine)) {
                data[value.x][value.y].isRevealed = true;
                if (value.isEmpty) {
                    this.revealEmpty(length, value.x, value.y, data);
                }
            }
        });
        return data;
    }

    /**
     * Starts Timer
     */
    startTimer = () => {
        this.intervalID = setInterval(() => {
            let secPlusOne = this.state.timer.time[1] + 1;
            let min = this.state.timer.time[0];
            if (secPlusOne > 59) {
                min = this.state.timer.time[0] + 1;
                secPlusOne = 0;
            }
            this.setState({
                    timer: {
                        start: true,
                        time: [min, secPlusOne]
                    }
                }
            )

        }, 1000)
    }

    /**
     * Stops Timer
     */
    stopTimer = () => {
        clearInterval(this.intervalID)
    }

    /**
     * Handles Left Click on cell
     * @param {event} e
     * @param {number} x
     * @param {number} y
     */
    handleCellClick = (e, x, y) => {

        if (this.state.boardData[x][y].isRevealed) {
            return null;
        }

        if (this.state.boardData[x][y].hasMine) {
            this.stopTimer();
            this.setState(
                {gameStatus: "YOU LOSE!"}
            );
            alert(" GAME LOST ! ");
            this.revealBoard();
        }

        let updatedData = this.state.boardData;
        updatedData[x][y].isFlagged = false;
        updatedData[x][y].isRevealed = true;

        if (updatedData[x][y].isEmpty) {
            updatedData = this.revealEmpty(this.state.length, x, y, updatedData);
        }

        if (this.getNumberOfUnrevealed(updatedData) === this.state.mineCount) {
            this.setState(
                {gameStatus: "You Win."}
            );
            this.stopTimer();
            this.revealBoard();
            alert(" YOU WIN ! ")
        }
        this.setState({
            boardData: updatedData,
        });
    }

    /**
     * Handles Right Click on cell (Flag)
     * @param {event} e
     * @param {number} x
     * @param {number} y
     */
    handleContextMenu = (e, x, y) => {
        e.preventDefault();

        let updatedData = this.state.boardData;

        if (updatedData[x][y].isRevealed) {
            return null;
        }

        if (updatedData[x][y].isFlagged) {
            updatedData[x][y].isFlagged = false;
        } else {
            updatedData[x][y].isFlagged = true;
        }

        this.setState(
            {boardData: updatedData,});
    }


    /**
     * Returns Dropdown List
     * @returns {JSX.Element} Dropdown list of difficulty
     */
    getDropDown = () => {
        let difficulty = [
            'Easy (4x4, 1 mine)', 'Moderate (9x9, 10 mines)', "Hard (12x12, 15 mines)"
        ];
        return (<Dropdown options={difficulty} className='dropDown' value={difficulty[1]}
                          onChange={this.handleDropDownChange}> </Dropdown>);
    }

    /**
     * Render the cells part of the board with data array
     * @param data
     * @returns {*}
     */
    renderBoard = (data) => {

        return data.map((rowOfData) => {
                return rowOfData.map((eachData) => {
                    return (
                        <div key={('' + eachData.x) + ('' + eachData.y)}>
                            <Cell
                                onClick={(e) => {
                                    if (!this.state.timer.start) {
                                        this.startTimer();
                                    }
                                    this.setState({
                                            timer: {
                                                start: true,
                                                time: [this.state.timer.time[0], this.state.timer.time[1]]
                                            },
                                        }
                                    )
                                    this.handleCellClick(e, eachData.x, eachData.y);
                                }}
                                cMenu={(e) => this.handleContextMenu(e, eachData.x, eachData.y)}
                                value={eachData}
                            />
                            {(rowOfData[rowOfData.length - 1] === eachData) ? <div className="clear"/> : ""}
                        </div>);
                })
            }
        );
    }

    render() {
        return (
            <div className="board">
                <button onClick={this.reset}>RESET</button>
                <div className="Dropdown">
                    Difficulty: {this.getDropDown()}
                </div>
                <div className="header">
                    <h4 className="info">Number of Mines: {this.state.mineCount}</h4>
                    <h4>{this.state.timer.time[0]} Minutes {this.state.timer.time[1]} Seconds</h4>
                    <h4 className="info">{this.state.gameStatus}</h4>
                </div>
                <div className="cells">
                    {this.renderBoard(this.state.boardData)}
                </div>
            </div>
        );
    }
}

export default Board;