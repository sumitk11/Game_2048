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
            ],
            game_status: "not_started"
        }

    componentDidMount() {
        document.addEventListener("keyup", this.onKeyPressed.bind(this));
    }
    
    componentWillUnmount() {
        document.removeEventListener("keyup", this.onKeyPressed.bind(this));
    }      

    onKeyPressed = (e) => {
        console.log(e);
        if(this.state.game_status === "started"){
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
    }
    
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
        let grid = this.getStateCopy();
        grid = this.reduceGridTop(grid);
        this.updateState(grid, 'game');
        this.addNewNumberToGrid();
    }
    handleBottomKeyPress = () => {
        let grid = this.getStateCopy();
        grid = this.reduceGridBottom(grid);
        this.updateState(grid, 'game');
        this.addNewNumberToGrid();
    }


    rotateGrid = (grid, dir) =>{
        switch(dir){
            case "180": {     
                    return _.map(grid, row => {
                        let rot = [];
                        for(let i=0, j=row.length-1; i<j; i++, j--){
                            rot[i] = row[j];
                            rot[j] = row[i];
                        }
                        return rot;
                    })
                }
            case "90": {
                    let rot = [];
                    for(let i=grid[0].length-1; i>=0; i--){
                        let rotRow = [];
                        for(let j=0; j<grid.length; j++){
                            rotRow.push(grid[j][i]);
                        }
                        rot.push(rotRow)
                    }
                    return rot;
                }
            case "270":{
                    let rot = [];
                    for(let i=0; i<grid[0].length; i++){
                        let rotRow = [];
                        for(let j=grid.length-1; j>=0; j--){
                            rotRow.push(grid[j][i]);
                        }
                        rot.push(rotRow)
                    }
                    return rot;
                }
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

    reduceGridTop = (grid) => {
        grid = this.rotateGrid(grid, "90");
        this.reduceGridLeft(grid);
        grid = this.rotateGrid(grid, "270");
        return grid;
    }

    reduceGridBottom = (grid) => {
        grid = this.rotateGrid(grid, "270");
        this.reduceGridLeft(grid);
        grid = this.rotateGrid(grid, "90");
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
        if( rowNum === -1){
            this.updateState('over', 'game_status')
            return;
        }
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
        let rot = [];
        for(let i=0; i<this.state.game.length; i++){
            let rotRow = [];
            for(let j=0; j<this.state.game[0].length; j++){
                rotRow.push(this.state.game[i][j]);
            }
            rot.push(rotRow)
        }
        return rot;
    }

    startGameAction = () => {
        this.updateState('started', 'game_status')
    }

    getClassName = (num) => {
        if(num===0)
            return "";
        return "num"+num;
    }

    render(){
    return (
        <div onKeyDown={this.onKeyPressed}>
            <div className = "grid_container">
            {
                this.state.game.map((row,i) => {
                 return row.map((col,j) => (<div className={"grid_cell "+ this.getClassName(col)} key={i*4+j}>{col === 0? "": col}</div>))}
                )
            }
            </div>
            <button className="start" onClick={this.startGameAction}>Start Game</button>
        </div>
        )
    }
}

export default GameGrid;