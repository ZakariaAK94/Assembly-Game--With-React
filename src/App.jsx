import {languages} from "./languages"
import { useState } from "react"
import { clsx } from 'clsx';
import {getFarewellText, getRandomWord} from './utils' 
import Confetti from 'react-confetti'

export default function AssemblyEndGame() {   
  
  const [currentWord, setCurrentWord] = useState(()=>getRandomWord())
  const [letterGuessedByUser,setletterGuessedByUser] = useState([])

  const wrongGuessCount = letterGuessedByUser.filter( letter => !currentWord.includes(letter)).length
  const lastGuessedLetter = letterGuessedByUser[letterGuessedByUser.length - 1]
  const numGuessesLeft = languages.length - 1
  const isGameLost = (wrongGuessCount === languages.length-1)

  const isGameWon = currentWord.split("").every(letter => letterGuessedByUser.includes(letter))

  const isGameOver = isGameWon || isGameLost

 const letterOfWord = currentWord.split("").map( (letter,index) => {
            const shouldRevealTheWord = letterGuessedByUser.includes(letter) || isGameLost
            const className = clsx(
              "letter-word", !letterGuessedByUser.includes(letter) && "wrongLetters"
            )
            return(
                    <div key={index} className={className}>
                        {shouldRevealTheWord ? letter.toUpperCase() : ""}
                    </div>)
            })

const alphabet = "abcdefghijklmnopqrstuvwxyz"

function handleUserChoice(letter)
{
  setletterGuessedByUser(prev=> prev.includes(letter) ? prev : [...prev,letter])  
  
}


const keyboardElements = alphabet.split('').map(letter => 
  {
      const isGuessed = letterGuessedByUser.includes(letter)      
      const isCorrect = isGuessed && currentWord.includes(letter)     
      const isWrong = isGuessed && !currentWord.includes(letter)
      const className1 = clsx(
        "keyboardElements-btn",
        {
          correct: isCorrect,
          wrong: isWrong
        }
      )
      return (
               <button 
                key={letter} 
                disabled={isGameOver}
                aria-disabled={letterGuessedByUser.includes(letter)}
                aria-label={`Letter ${letter}`}
                className={className1}
                onClick={()=>handleUserChoice(letter)}>{letter.toUpperCase()}</button>)
  
})


  const languagesElements = languages.map(
    (language,index) => {
                  const isLanguageLost = index < wrongGuessCount
                  const styles = {
                    backgroundColor: language.backgroundColor,
                    color: language.color     }
                  const className = clsx("chip", isLanguageLost && "lost")
                  return (<span 
                            style={styles}
                            className={className}
                            key={language.name}
                            >{language.name}</span> )}  )

    const classNameForGameStatus = clsx(
      "game-status",
    {
      gameWon: isGameWon,
      gameLost: isGameLost,
      playing: !isGameWon && !isGameLost && wrongGuessCount
    })

    function renderGameStatus()
    {
        if(!isGameOver && wrongGuessCount)
        {
          return (<h2>{renderlanguagesLost} </h2>)
        }

        if(isGameOver)
        {
          if(isGameWon)
          {
            return (<>  <h2>You win!</h2>
                        <p>Well done! 🎉</p> </>)
          }else
          {
            return (<>  <h2>Game over</h2>
              <p>You lose! Better start learning Assembly 😭</p> </>)
          }
        }
    }

    function resetTheGame()
    {
      setCurrentWord(()=>getRandomWord())
      setletterGuessedByUser([])      
    }

    const languagesLost = languages.slice(0,wrongGuessCount).map(el=>el.name).join(" & ")

    const renderlanguagesLost = getFarewellText(languagesLost)
  return (
      <main>
        {isGameWon && <Confetti 
        recycle={false}
        numberOfPieces={1000}/>}
          <header>
            <h1>Assembly: Endgame</h1>
            <p>Guess the word in under 8 attempts to keep the programming world safe from Assembly!
                Doh! You lose! Too many misses. 
                Good luck next time.
                “Yay lots of choice, the world is safe”</p>
          </header>
          <section 
                aria-live="polite" 
                role="status" 
                className={classNameForGameStatus}>
           {renderGameStatus()}
          </section>
          <section className="languages-section">
            {languagesElements}
          </section>

          <section className="letter-word-section">
            {letterOfWord}
          </section>
           {/* Combined visually-hidden aria-live region for status updates */}
           <section 
                className="sr-only" 
                aria-live="polite" 
                role="status"
            >
                <p>
                    {currentWord.includes(lastGuessedLetter) ? 
                        `Correct! The letter ${lastGuessedLetter} is in the word.` : 
                        `Sorry, the letter ${lastGuessedLetter} is not in the word.`
                    }
                    You have {numGuessesLeft} attempts left.
                </p>
                <p>Current word: {currentWord.split("").map(letter => 
                letterGuessedByUser.includes(letter) ? letter + "." : "blank.")
                .join(" ")}</p>
            
            </section>
            
          <section className="keyboardElements-section">
            {keyboardElements}
          </section>
          {isGameOver && <button className="new-game" onClick={resetTheGame}>New Game</button> }
      </main>
  )
}
