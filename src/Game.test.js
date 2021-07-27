/**
 *
 * @jest-environment jsdom
 */

import {jest} from '@jest/globals'
import Game from "./index"
import React from 'react';
import ReactDOM from 'react-dom';
import Board from "./Components/Board"
import Cell from "./Components/Cell"
import {shallow, configure} from "enzyme";
import Adapter from 'enzyme-adapter-react-16'

configure({adapter: new Adapter()});

describe("Board Test", () => {
    const boardWrapper = shallow(<Board/>);
    const targetLength = [4, 9, 12, 9];
    const testStateDifficulty = ["Easy", "Moderate", "Hard", null];
    const targetMineCount = [1, 10, 15, 10];
    const targetNumberOfUnrevealed = targetLength.map((eachData) => {
        return Math.pow(eachData, 2);
    })

    it("Reset Function", () => {
        for (let i = 0; i < testStateDifficulty.length; i++) {
            boardWrapper.instance().reset(testStateDifficulty[i]);
            expect(boardWrapper.state().length).toEqual(targetLength[i]);
            expect(boardWrapper.state().mineCount).toEqual(targetMineCount[i]);
        }
    });

    it("getNumberOfUnrevealed Function", () => {
        for (let i = 0; i < testStateDifficulty.length; i++) {
            boardWrapper.instance().reset(testStateDifficulty[i]);
            expect(boardWrapper.instance().getNumberOfUnrevealed(boardWrapper.state().boardData)).toEqual(targetNumberOfUnrevealed[i])
        }
    });
});

describe('Cell Test', () => {
    const testStateValue = {
        x: 0,
        y: 0,
        hasMine: false,
        neighbour: 0,
        isRevealed: true,
        isEmpty: false,
        isFlagged: false,
    }

    const mockCallBack = jest.fn()
    const cellWrapper = shallow((<Cell onClick={mockCallBack} value={testStateValue} cMenu={mockCallBack}
    />));

    it('Get Color of Number Function', () => {
        const colorArray = ["red", "purple", "green", "yellow", "orange", "black", "blue", "pink"]
        for (let i = 0; i < colorArray.length; i++) {
            expect(cellWrapper.instance().getColor(i + 1)).toBe(colorArray[i])
        }
    })

    it('Right and Left Click Functions', () => {
        //Test Left Click
        cellWrapper.find('div').simulate('click');
        expect(mockCallBack.mock.calls.length).toBe(1);

        //Test Right Click
        cellWrapper.find('div').simulate('contextmenu')
        expect(mockCallBack.mock.calls.length).toBe(2);
    });
});

describe('Integration Test', () =>
    it('Render', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Game/>, div);
    }));