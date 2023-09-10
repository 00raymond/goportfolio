const characters = "\\/<>-_";
const targetTexts = ["Hi,","Mabuhay,","Ciao,","Salut,","Hola,","Namaste,","Hallo,","Ni hao,"];
const scrambleTextElement = document.getElementById("scrambleText");

let currentTargetIndex = 0;
let scrambleState = 'unscrambling';
let scrambleOrder = [];
let scrambleSpeed = 300; 
let scrambleTimer = null;

function updateScrambleText() {
  let currentWord = targetTexts[currentTargetIndex].split('');

  if (scrambleState === 'unscrambling') {
    if (scrambleOrder.length === 0) {
      scrambleOrder = Array.from({ length: currentWord.length }, (_, i) => i);
      scrambleOrder.sort(() => Math.random() - 0.5);
    }

    let nextIndex = scrambleOrder.pop();
    let newWord = scrambleTextElement.textContent.split('');
    newWord[nextIndex] = currentWord[nextIndex];
    scrambleTextElement.textContent = newWord.join('');

    if (scrambleOrder.length === 0) {
      scrambleState = 'idle';
      clearInterval(scrambleTimer); 
      setTimeout(() => {
        scrambleTextElement.textContent = characters[Math.floor(Math.random() * characters.length)];
        scrambleState = 'building';
        scrambleTimer = setInterval(scrambleRandomCharacter, scrambleSpeed / 3);
      }, 2000);
    }
  } else if (scrambleState === 'building') {
    let nextWord = targetTexts[(currentTargetIndex + 1) % targetTexts.length];
    if (scrambleTextElement.textContent.length < nextWord.length) {
      scrambleTextElement.textContent += characters[Math.floor(Math.random() * characters.length)];
    } else {
      scrambleState = 'unscrambling';
      currentTargetIndex = (currentTargetIndex + 1) % targetTexts.length;
    }
  }
}

function scrambleRandomCharacter() {
  if (scrambleState === 'unscrambling' || scrambleState === 'building') {
    let scrambleText = scrambleTextElement.textContent.split('');
    for (let i = 0; i < scrambleText.length; i++) {
      if (characters.includes(scrambleText[i])) {
        scrambleText[i] = characters[Math.floor(Math.random() * characters.length)];
      }
    }
    scrambleTextElement.textContent = scrambleText.join('');
  }
}

setInterval(updateScrambleText, 50);
scrambleTimer = setInterval(scrambleRandomCharacter, scrambleSpeed / 3);
