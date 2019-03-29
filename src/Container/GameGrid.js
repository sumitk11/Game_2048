import React, {Component} from 'react';
import _ from 'lodash';
import "./GameGrid.css";

class GameGrid extends Component{
    
    state = {
            game: [
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0]
            ]
        }

    componentDidMount() {
        document.addEventListener("keydown", this.onKeyPressed.bind(this));
    }
    
    componentWillUnmount() {
        document.removeEventListener("keydown", this.onKeyPressed.bind(this));
    }      

    onKeyPressed = (e) => {
        if( [ 37, 38, 39, 40].indexOf( e.keyCode ) !== -1){
            switch(e.keyCode){
                    case 37: this.handleLeftKeyPress();
                        break;
                    case 39: this.handleRightKeyPress();
                        break;
                    case 38: this.handleTopKeyPress();
                        break;
                    case 40: this.handleBottomKeyPress();
                        break;
                    default:
                        break;
                }
            }
        }

    

    //1. reduce -> reduced     -> generate a 2 in remaining area, update score 
    //          -> not reduced -> grid have spaces do nothing
    //                         -> grid don't have spaces game over
    //   

    //2. generate new number
    handleLeftKeyPress = () => {
        let grid = this.getStateCopy();
        grid = this.reduceGridLeft(grid);
        this.updateState(grid, 'game');
        this.addNewNumberToGrid();
    }
    handleRightKeyPress = () => {
        let grid = this.getStateCopy();
        grid = this.reduceGridRight(grid);
        this.updateState(grid, 'game');
        this.addNewNumberToGrid();
    }
    handleTopKeyPress = () => {
        this.reduceGridTop();
        this.addNewNumberToGrid();
    }
    handleBottomKeyPress = () => {
        this.reduceGridBottom();
        this.addNewNumberToGrid();
    }

    rotateGrid = (grid, dir) =>{
        switch(dir){
            case "180":     
                    return _.map(grid, row => {
                        let rot = [];
                        for(let i=0, j=row.length-1; i<j; i++, j--){
                            rot[i] = row[j];
                            rot[j] = row[i];
                        }
                        return rot;
                    })
            default:
                    return grid;
        }
    }

    findNextNonZero = (row, start, end) => {  
        for( let i = start; i <= end; i++)
            if (row[i]!==0)
                return i;
        return -1;
    }

    reduceGridLeft = (grid) => {
        for( let i = 0; i< grid.length; i++){
            let nonZeroIndex = this.findNextNonZero(grid[i], 0, grid[0].length-1);
            while(true){
                if(nonZeroIndex === -1)
                    break;
                let nextNonZeroIndex = this.findNextNonZero( grid[i], nonZeroIndex+1, grid[0].length-1);
                if(nextNonZeroIndex === -1)
                    break;

                let nonZeroValCurrent = grid[i][nonZeroIndex];
                let nonZeroValNext = grid[i][nextNonZeroIndex];

                if(nonZeroValCurrent === nonZeroValNext){
                    grid[i][nonZeroIndex] = 2*nonZeroValCurrent;
                    grid[i][nextNonZeroIndex] = 0;
                    nonZeroIndex = this.findNextNonZero(grid[i], nonZeroIndex+1, grid[0].length-1);
                }else{
                nonZeroIndex = nextNonZeroIndex;
                }
            }

            let zeroPosition = 0;
            for( let j = 0; j< grid[0].length;j++){
                if(grid[i][j]!==0){
                    grid[i][zeroPosition]=grid[i][j];
                    zeroPosition++;
                }
            }
            for(zeroPosition;zeroPosition<grid[0].length; zeroPosition++){
                grid[i][zeroPosition]=0;
            } 
        }

        return grid;
    }

    reduceGridRight = (grid) => {
        grid = this.rotateGrid(grid, "180");
        this.reduceGridLeft(grid);
        grid = this.rotateGrid(grid, "180");
        return grid;
    }

    getRandomFreeCell = () => {
        let emptyCells=0;
        _.forEach(this.state.game, row =>{
            _.forEach(row, col=>{
                if(col === 0){
                    emptyCells++;
                }
            })
        })
        let randomCell = Math.floor((Math.random() * emptyCells));
     
        for(let i = 0; i<this.state.game.length; i++){
            for(let j = 0; j<this.state.game[0].length; j++){
                if(this.state.game[i][j] === 0){
                    if(randomCell === 0){
                        return {
                            rowNum: i,
                            colNum: j
                        };
                    }
                    randomCell--;
            }
        }
    }           

        return {
                rowNum: -1,
                colNum: -1
            };
    }

    addNewNumberToGrid = () => {
        console.log("called");
        let {rowNum, colNum} = this.getRandomFreeCell();
        if( rowNum === -1)
            throw Error('grid_full');
        const grid = this.getStateCopy();
        grid[rowNum][colNum] = (Math.random()*2 <= 1) ? 2 : 4;
        this.updateState(grid, 'game');
    }

    updateState = (value, key) => {
        this.setState({
            ...this.state,
            [key]: value
        })
    }

    getStateCopy = () => {
        return _.map(this.state.game, (row, i) => {
            return _.map(row, (col, j) => {
                return col;
            });
        });
    }

    render(){
    return (
        <div onKeyDown={this.onKeyPressed}>
            <div className = "grid_container">
            {
                this.state.game.map((row,i) => {
                 return row.map((col,j) => (<div className="grid_cell" key={i*4+j}>{col}</div>))}
                )
            }
            </div>
        </div>
        )
    }
}

export default GameGrid;