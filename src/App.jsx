import React, { useEffect, useState } from "react";
import Die from "./component/Die";
import { getRNG } from "./utils/utils";
import {nanoid} from 'nanoid'
import Confetti from 'react-confetti'
import Win from "./component/Win";

const App = ()=> {
    const [numbers, setNumbers] = useState(AllNewDice())
    const [dices, setDices] = useState(numbers.map(num => {
        const isHeldStyle = num.isHeld===true ? '#59E391' : 'white'
        return <Die 
                    key={num.id} 
                    isHeldStyle={{backgroundColor: isHeldStyle}} 
                    dieNumber={num.value}
                    id={num.id}
                    holdDice={()=> holdDice(num.id)}
                />
    }))
    const [tenzies, setTenzies] = useState(false)
    const [currentRecord, setCurrentRecord] = useState({
        no_of_rolls: 0, 
        timeTaken: {
            second: 0,
            minute: 0,
            hour: 0
        }})
    const [bestRecord, setBestRecord] = useState(
        JSON.parse(localStorage.getItem('bestRecord'))
        || {
            no_of_rolls: 0,
            timeTaken: {
                second: 0,
                minute: 0,
                hour: 0
            }
        }
    )

    let intervalId;
    console.log(currentRecord)    

    useEffect(()=> {
        setDices(numbers.map(num => {
            const isHeldStyle = num.isHeld===true ? '#59E391' : 'white'
            return <Die 
                        key={num.id} 
                        isHeldStyle={{backgroundColor: isHeldStyle}} 
                        dieNumber={num.value}
                        id={num.id}
                        holdDice={()=> holdDice(num.id)}
                    />
        }))
        
        const allHeld = numbers.every(num => num.isHeld)
        const firstNum = numbers[0].value
        const allSameValue = numbers.every(num => num.value === firstNum)
        if(allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [numbers])

    useEffect(()=> {

        if (!tenzies) {
            intervalId = setInterval(() => {
                setCurrentRecord(prevRecord => {
                    const newTime = { ...prevRecord.timeTaken };
                    newTime.second += 1;
    
                    if (newTime.second === 60) {
                        newTime.second = 0;
                        newTime.minute += 1;
    
                        if (newTime.minute === 60) {
                            newTime.minute = 0;
                            newTime.hour += 1;
                        }
                    }
    
                    return {
                        ...prevRecord,
                        timeTaken: newTime
                    };
                });
            }, 1000);
    
            return () => clearInterval(intervalId);
        }
        
        if(currentRecord.no_of_rolls < bestRecord.no_of_rolls || bestRecord.no_of_rolls === 0) {
            setBestRecord(prevRecord => ({
                ...prevRecord,
                no_of_rolls: currentRecord.no_of_rolls
            }))
        }

        if (bestRecord.timeTaken.hour===0 && bestRecord.timeTaken.minute===0 && bestRecord.timeTaken.second===0) {
            setBestRecord(currentRecord)
        }

        if(currentRecord.timeTaken.hour < bestRecord.timeTaken.hour) {
            setBestRecord(prevRecord => ({
                ...prevRecord,
                timeTaken: {...prevRecord.timeTaken}
            }))
        }

        if(currentRecord.timeTaken.minute < bestRecord.timeTaken.minute && 
            currentRecord.timeTaken.hour <= bestRecord.timeTaken.hour) {
            setBestRecord(prevRecord => ({
                ...prevRecord,
                timeTaken: {...prevRecord.timeTaken}
            }))
        }


        if(currentRecord.timeTaken.second < bestRecord.timeTaken.second && 
            currentRecord.timeTaken.minute <= bestRecord.timeTaken.minute && 
            currentRecord.timeTaken.hour <= bestRecord.timeTaken.hour) {
            setBestRecord(prevRecord => ({
                ...prevRecord,
                timeTaken: {...prevRecord.timeTaken}
            }))
        }
    }, [tenzies])

    useEffect(() => {
        localStorage.setItem('bestRecord', JSON.stringify(bestRecord))
        console.log(bestRecord)
    }, [bestRecord])

    function AllNewDice() {
        const arr=[]
        for(let i=0; i < 10; i++) {
            arr.push(
                {value: getRNG(1, 6), isHeld: false, id: nanoid()}
            )
        }
        return arr
    }

    function rollDice() {
        if(tenzies) {
            setCurrentRecord(prevRecord => ({
                no_of_rolls: 0,
                timeTaken: { second: 0, minute: 0, hour: 0 }
            }));
            clearInterval(intervalId)
            setTenzies(false)
            setNumbers(AllNewDice())
        } else {
            setCurrentRecord(prevRecord => (
                {...prevRecord, 
                    no_of_rolls: prevRecord.no_of_rolls+1
                }
            ))
            setNumbers(prevDices => prevDices.map(num => {
                return !num.isHeld ? {value: getRNG(1, 6), isHeld: false, id: nanoid()} : num
            }))
        }
    }

    function holdDice(id) {
        setNumbers(prevNumbers=> prevNumbers.map(num => {
            return num.id === id ? {...num, isHeld: !num.isHeld} : num
        }))
    }

    return(
        <main>
            {
                tenzies && <Win 
                    currentRecord={currentRecord}
                    bestRecord={bestRecord}
                />
            }
            <h1 className="title">Tenzies</h1>
            <p className="instructions">
                Roll until all dice are the same. Click each die to freeze it at its current value between rolls.
            </p>
            <div className="die--wrapper">
                {dices}
            </div>
            {
                <button 
                    className="roll-dice--btn"
                    onClick={rollDice}
                >
                    <h2>
                        {tenzies ? 'New Game' : 'Roll'}
                    </h2>
                </button>
            }
            {
                tenzies &&
                <Confetti width={window.innerWidth} height={window.innerHeight} />
            }
        </main>
    )
}

export default App