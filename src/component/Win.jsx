import React from "react";

export default function Win(props) {
    function removePopUp(e) {
        return e.target.style.display='none'
    }
    return(
        <div 
            className="win--popup-bg"
            onClick={removePopUp}
        >
            <div className="win--popup-wrapper">
                <div className="current-record">
                    <h2>Current Record</h2>
                    <h3>Rolls: {props.currentRecord.no_of_rolls}</h3>
                    <h3>Time Taken: {`${props.currentRecord.timeTaken.hour}h ${props.currentRecord.timeTaken.minute}m ${props.currentRecord.timeTaken.second}s`}</h3>
                </div>
                <div className="best-record">
                    <h2>Best Record</h2>
                    <h3>Best Rolls: {props.bestRecord.no_of_rolls}</h3>
                    <h3>Best Time Taken: {`${props.bestRecord.timeTaken.hour}h ${props.bestRecord.timeTaken.minute}m ${props.bestRecord.timeTaken.second}s`}</h3>
                </div>
            </div>
        </div>
    )
}