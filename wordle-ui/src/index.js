import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

class Square extends React.Component {
  render() {
    return (
      <div className="square">
        {this.props.letter}
      </div>
    );
  }
}

class Key extends React.Component {
  keyState = this.props.keyState;

  render(){
    const { inputLetter, onPress, keyState } = this.props,
      pressKey = () => onPress(inputLetter),
      keyClass = 'key-' + keyState;

    return (
      <button className={keyClass} onClick={pressKey}>
        {inputLetter.toUpperCase()}
      </button>
    )
  }
}

class Board extends React.Component {
  letters = [
    "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
    "a", "s", "d", "f", "g", "h", "j", "k", "l",
    "z", "x", "c", "v", "b", "n", "m"
  ];

  rowLetters = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: []
  }

  rowNum = 0;

  render() {
    const status = 'Player Name,  Score';
    
    this.keyboardListener();
    
    return (
      <div>
        <div className="word-grid">
          <div className="status">{status}</div>
          {this.renderGrid()} 
        </div>
      </div>
    );
  }

  renderGrid()
  {
    return <div>
          {this.renderRow(0)}
          {this.renderRow(1)}
          {this.renderRow(2)}
          {this.renderRow(3)}
          {this.renderRow(4)}
          {this.renderRow(5)}
          </div>
  }

  renderRow(i)
  {
    return <div>
          {this.renderSquare(this.rowLetters[i][0])}
          {this.renderSquare(this.rowLetters[i][1])}
          {this.renderSquare(this.rowLetters[i][2])}
          {this.renderSquare(this.rowLetters[i][3])}
          {this.renderSquare(this.rowLetters[i][4])}
          </div>
  }

  renderSquare(letter) {
    return <Square letter={letter} />;
  }

}

class Keyboard extends React.Component {
  
  letters = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"]
  ];

  pressKeyOnKeyboard(letter){
    // console.log(letter);
  }

  renderRow(i){  
    const row = [];

    let letter;

    for (let j=0; j<this.letters[i].length; j++)
    {
      letter = this.letters[i][j];  

      row.push((<Key 
        inputLetter={letter} 
        onPress={this.pressKeyOnKeyboard} 
        keyState={this.props.keyStates[letter]}/>));
    }
    return (<div className="keyboard-row">{row}</div>);
  }

  render(){
    return (
      <div>
        {this.renderRow(0)}
        {this.renderRow(1)}
        {this.renderRow(2)}
      </div>
    )
  }
}

class Game extends React.Component {
  // Store the state of each letter
  letterStates = {
    a: 'white',
    b: 'white',
    c: 'white',
    d: 'white',
    e: 'white',
    f: 'white',
    g: 'white',
    h: 'white',
    i: 'green',
    j: 'white',
    k: 'white',
    l: 'grey',
    m: 'green',
    n: 'yellow',
    o: 'white',
    p: 'white',
    q: 'white',
    r: 'white',
    s: 'white',
    t: 'white',
    u: 'white',
    v: 'white',
    w: 'white',
    x: 'white',
    y: 'white',
    z: 'white'
  };

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>

        <div className="keyboard">
          <Keyboard keyStates={this.letterStates}/>
        </div>

        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>

      </div>
    );
  }
}

// ========================================

React.useEffect(() => {
  window.addEventListener('keydown', (event) => {

    if (this.letters.includes(event.key) && this.rowLetters[this.rowNum]<5)
    {
      this.rowLetters[this.rowNum].push(event.key);
    }
    else if (event.code === 'Backspace')
    {
      this.rowLetters[this.rowNum].pop();
    }
    }, false);
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

