import React, {Component} from 'react';

class Cell extends Component {
    /**
     * Returns value of cell
     * @returns {number|string|null} Name of Color
     */
    getValue(value) {
        if (!value.isRevealed) {
            return this.props.value.isFlagged ? "🏁" : null;
        }
        if (value.hasMine) {
            return "💣";
        }
        if (value.neighbour === 0) {
            return null;
        }
        return value.neighbour;
    }

    /**
     * Returns color name according to number on cell
     * @param {number|null} value
     * @returns {string|null} Name of Color
     */
    getColor(value) {
        switch (value) {
            case 1 :
                return "red";
            case 2 :
                return "purple";
            case 3:
                return "green";
            case 4:
                return "yellow";
            case 5:
                return "orange";
            case 6:
                return "black";
            case 7:
                return "blue";
            case 8:
                return "pink";
            default:
                return null;
        }
    }

    render() {
        const {value, onClick, cMenu} = this.props;
        let className =
            "cell" +
            (value.isRevealed ? "" : " hidden") +
            (value.hasMine ? " is-mine" : "") +
            (value.isFlagged ? " is-flag" : "");

        let myStyle = {
            color: this.getColor(this.getValue(value)),
        }

        return (
            <div
                onClick={ (e) => {onClick(e);}}
                className={className}
                onContextMenu={cMenu}
                style={myStyle}
            >
                {this.getValue(value)}
            </div>
        );
    }
}

export default Cell;