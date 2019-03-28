import React, {Component} from 'react';
import "./GameGrid.css"

class GameGrid extends Component{
    
    state = {
        grid: [
            [2,0,0,0],
            [4,0,0,2048],
            [8,0,0,0],
            [16,0,0,0]
        ]
    };
    render(){
    return (
        <div className = "grid_container">
            {
                this.state.grid.map(row => {
                 return row.map(col => (<div className="grid_cell">{col}</div>))}
                )
            }
        </div>
        )
    }
}

export default GameGrid;