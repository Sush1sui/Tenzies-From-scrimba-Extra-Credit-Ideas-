import React from "react";

const Die = (props) => {
    const dieNum = props.dieNumber
    function dots() {
        const arr=[]
        for(let i=0; i<dieNum; i++) {
            arr.push(<div></div>)
        }return arr
    }
    return(
        <div 
            className="die" 
            style={props.isHeldStyle}
            onClick={props.holdDice}
        >
            {/* {<h2>{props.dieNumber}</h2>} */}
            {dots()}
        </div>
    )
}

export default Die