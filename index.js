let arrayQuestions;
let responseData;
let textQuestion;
let textButtonAnswerOptions;
let moneyTree;
let answerButton;
const maxCountQuestionsInTheGame = 10;
let count = 0;
let sound = new Audio();

const requestData = async () => {
  try {
    const response = await fetch(
      "https://api.jsonbin.io/v3/b/6358f1932b3499323beafa99/latest",
      {
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": `$2b$10$K8rHnU.Ps4KmWiCofzhTIuVz4rX8qKat.4hmFN3mxfK8dQbXCyiJa`,
          "X-Bin-Meta": false,
        },
      }
    );
    console.log(response);
    responseData = await response.json();
  } catch (error) {
    console.log(error);
  }
};
requestData();

function startGame() {
  let sound = new Audio();
  sound.preload = "metadata";
  sound.src = "./Sounds/startGame.mp3";
  sound.play();
  go();
}

function go() {
  count = 0;
  let body = document.querySelector("body");
  body.innerHTML = `
        <div class="preloader">
            <div class="preloader__row">
                <div class="preloader__item"></div>
                <div class="preloader__item"></div>
            </div>
        </div>`;
  setTimeout(() => {
    body.style = `-webkit-animation-duration: 5s;
                        animation-duration: 5s;
                        -webkit-animation-fill-mode: both;
                        animation-fill-mode: both;
                        -webkit-animation-name: fadeIn;
                        animation-name: fadeIn;`;
    window.onload = function () {
      document.body.classList.add("loaded_hiding");
      window.setTimeout(function () {
        document.body.classList.add("loaded");
        document.body.classList.remove("loaded_hiding");
      }, 500);
    };

    body.innerHTML = `
            <div class="main">

            <div id="bonusIcon">
                <img onclick="fiftyOnFifty(this)">
                <img onclick="adviceSpectators(this)">
                <img onclick="callToFriend(this)">
            </div>
            
            <div id="mainIcon">
                <img>
                <div id="question">
            
                </div>
            </div>

            <div id="moneyTree">

                <table>
                    <th>
                        ПРИЗ
                    </th>
                    <tr>
                        <td>1 000 000</td>
                    </tr>
                    <tr>
                        <td>500 000</td>
                    </tr>
                    <tr>
                        <td>200 000</td>
                    </tr>
                    <tr>
                        <td>100 000</td>
                    </tr>
                    <tr>
                        <td>50 000</td>
                    </tr>
                    <tr>
                        <td>20 000</td>
                    </tr>
                    <tr>
                        <td>10 000</td>
                    </tr>
                    <tr>
                        <td>5 000</td>
                    </tr>
                    <tr>
                        <td>2 000</td>
                    </tr>
                    <tr>
                        <td>1 000</td>
                    </tr>
                </table>

                <div id="takeMoney">
                    <button onclick="takeMoney()">
                        Забрать
                    </button>
                </div>

            </div>
        </div>

        <div class="wrapper">
            <button onclick="giveAnswer(this)"><p>A: <span id="answerOption"></span></p></button>
            <button onclick="giveAnswer(this)"><p>B: <span id="answerOption"></span></p></button>
            <button onclick="giveAnswer(this)"><p>C: <span id="answerOption"></span></p></button>
            <button onclick="giveAnswer(this)"><p>D: <span id="answerOption"></span></p></button>
        </div>

        <div id="adviceSpectators" class="modal">
            
            <div class="modal-content-chart" >           
                    
                <span class="close">&times;</span> 
                <div id="chart">
                    <div>A</div>
                    <div>B</div>
                    <div>C</div>
                    <div>D</div>
                </div>
                
            </div>

        </div>

        <div id="callToFriend" class="modal">
            
            <div class="modal-content" >           
                <p class="answer"></p>
                <span class="close">&times;</span>
            </div>

        </div>
        
        <div id="finishGame" class="modal">
            
            <div class="modal-content">               
                <p class="message"></p>
                <button onclick="go()">Заново</button>
                <button onclick="cancel()">Отмена</button>
            </div>

        </div>`;
    let bonusesImg = document.querySelectorAll("#bonusIcon img");
    let logoImg = document.querySelector("#mainIcon img");
    answerButton = document.querySelectorAll(".wrapper button");
    textQuestion = document.querySelector("#question");
    textButtonAnswerOptions = document.querySelectorAll("#answerOption");
    moneyTree = document.querySelectorAll("td");
    arrayQuestions = indexesQuestions(
      Object.keys(responseData.question).length - 1,
      maxCountQuestionsInTheGame
    );

    // Вставка картинок на страницу
    logoImg.src = responseData.images.logo;
    for (let i = 0; i < bonusesImg.length; i++) {
      bonusesImg[i].src = responseData.images.bonuses[i];
    }

    //Вставка текста вопроса и вариантов ответа
    textQuestion.textContent = responseData.question[arrayQuestions[0]];
    let temp = 0;
    for (let button of textButtonAnswerOptions) {
      button.textContent = responseData.answerOptions[arrayQuestions[0]][temp];
      temp++;
    }
  }, 3000);
  setTimeout(() => {
    sound.pause();
    sound = new Audio();
    sound.src = "./Sounds/forThinking.mp3";
    sound.play();
  }, 4000);
}

function giveAnswer(button) {
  sound.pause();
  sound = new Audio();
  sound.src = "./Sounds/waitAnswer.mp3";
  sound.play();
  for (let but of answerButton) {
    but.disabled = true;
  }
  button.style.animation = "blink 1s linear 2";
  console.log(IsTrueAnswer(button));
  if (IsTrueAnswer(button)) {
    setTimeout(() => {
      sound.pause();
      sound = new Audio();
      sound.src = "./Sounds/trueAnswer.mp3";
      sound.play();
      button.style.animation = "staticGreen 1s linear 1";
      button.style.background = "green";
    }, 2000);
    setTimeout(() => {
      for (let but of answerButton) {
        but.disabled = false;
        but.hidden = false;
        but.style.background = "#2F73B6";
      }
      if (count !== 0)
        moneyTree[moneyTree.length - count].style.background = "";
      count++;
      moneyTree[moneyTree.length - count].style.background = "green";
      if (count !== maxCountQuestionsInTheGame) nextQuestion();
      else {
        moneyTree[moneyTree.length - count].style.animation =
          "staticGreen 1s linear infinite";
        sound.pause();
        sound = new Audio();
        sound.src = "./Sounds/finishGame.mp3";
        sound.play();
        setTimeout(() => {
          finishGame();
        }, 3000);
      }
    }, 5000);
  } else {
    setTimeout(() => {
      sound.pause();
      sound = new Audio();
      sound.src = "./Sounds/falseAnswer.mp3";
      sound.play();
      button.style.animation = "staticRed 1s linear 1";
      button.style.background = "red";
      for (let but of answerButton) {
        if (IsTrueAnswer(but)) {
          but.style.animation = "staticGreen 1s linear 1";
          but.style.background = "green";
        }
      }
      let takeMoney = document.querySelector("#takeMoney button");
      takeMoney.disabled = true;
      if (count !== 0)
        moneyTree[moneyTree.length - count].style.animation =
          "staticRed 1s linear infinite";
      setTimeout(() => {
        loseGame();
      }, 3000);
    }, 2000);
  }
}

function IsTrueAnswer(button) {
  if (
    button.textContent.slice(3) ===
    responseData.rightAnswer[arrayQuestions[count]]
  )
    return true;
  else return false;
}

function nextQuestion() {
  sound.pause();
  sound = new Audio();
  sound.src = "./Sounds/forThinking.mp3";
  sound.play();
  textQuestion.textContent = responseData.question[arrayQuestions[count]];
  let temp = 0;
  for (let button of textButtonAnswerOptions) {
    button.textContent =
      responseData.answerOptions[arrayQuestions[count]][temp];
    temp++;
  }
}

function indexesQuestions(max, countOfQuestion) {
  let arrayOfIndexes = new Set();
  while (arrayOfIndexes.size < countOfQuestion)
    arrayOfIndexes.add(Math.floor(Math.random() * max));
  return Array.from(arrayOfIndexes);
}

function fiftyOnFifty(bonus) {
  let IndexNotTrueButton = [];
  for (let i = 0; i < answerButton.length; i++) {
    if (!IsTrueAnswer(answerButton[i])) {
      IndexNotTrueButton.push(i);
    }
  }
  shuffle(IndexNotTrueButton);
  answerButton[IndexNotTrueButton[0]].hidden = true;
  answerButton[IndexNotTrueButton[1]].hidden = true;
  bonus.onclick = "";
  bonus.style.opacity = ".5";
}

function adviceSpectators(bonus) {
  let columns = document.querySelectorAll("#chart div");
  let modal = document.getElementById("adviceSpectators");
  let span = document.getElementsByClassName("close")[0];
  span.onclick = function () {
    modal.style.display = "none";
  };
  modal.style.display = "block";

  let IndexTrueButton;
  for (let i = 0; i < answerButton.length; i++) {
    if (IsTrueAnswer(answerButton[i])) {
      IndexTrueButton = i;
      break;
    }
  }

  if (IndexTrueButton === 0) {
    if (!answerButton[0].hidden) columns[0].style.height = "80%";
    else {
      columns[0].style.height = "0%";
      columns[0].textContent = "";
    }
    if (!answerButton[1].hidden) columns[1].style.height = "20%";
    else {
      columns[1].style.height = "0%";
      columns[1].textContent = "";
    }
    if (!answerButton[2].hidden) columns[2].style.height = "60%";
    else {
      columns[2].style.height = "0%";
      columns[2].textContent = "";
    }
    if (!answerButton[3].hidden) columns[3].style.height = "40%";
    else {
      columns[3].style.height = "0%";
      columns[3].textContent = "";
    }
  } else if (IndexTrueButton === 1) {
    if (!answerButton[0].hidden) columns[0].style.height = "20%";
    else {
      columns[0].style.height = "0%";
      columns[0].textContent = "";
    }
    if (!answerButton[1].hidden) columns[1].style.height = "80%";
    else {
      columns[1].style.height = "0%";
      columns[1].textContent = "";
    }
    if (!answerButton[2].hidden) columns[2].style.height = "60%";
    else {
      columns[2].style.height = "0%";
      columns[2].textContent = "";
    }
    if (!answerButton[3].hidden) columns[3].style.height = "40%";
    else {
      columns[3].style.height = "0%";
      columns[3].textContent = "";
    }
  } else if (IndexTrueButton === 2) {
    if (!answerButton[0].hidden) columns[0].style.height = "60%";
    else {
      columns[0].style.height = "0%";
      columns[0].textContent = "";
    }
    if (!answerButton[1].hidden) columns[1].style.height = "40%";
    else {
      columns[1].style.height = "0%";
      columns[1].textContent = "";
    }
    if (!answerButton[2].hidden) columns[2].style.height = "80%";
    else {
      columns[2].style.height = "0%";
      columns[2].textContent = "";
    }
    if (!answerButton[3].hidden) columns[3].style.height = "20%";
    else {
      columns[3].style.height = "0%";
      columns[3].textContent = "";
    }
  } else if (IndexTrueButton === 3) {
    if (!answerButton[0].hidden) columns[0].style.height = "20%";
    else {
      columns[0].style.height = "0%";
      columns[0].textContent = "";
    }
    if (!answerButton[1].hidden) columns[1].style.height = "60%";
    else {
      columns[1].style.height = "0%";
      columns[1].textContent = "";
    }
    if (!answerButton[2].hidden) columns[2].style.height = "20%";
    else {
      columns[2].style.height = "0%";
      columns[2].textContent = "";
    }
    if (!answerButton[3].hidden) columns[3].style.height = "80%";
    else {
      columns[3].style.height = "0%";
      columns[3].textContent = "";
    }
  }

  bonus.onclick = "";
  bonus.style.opacity = ".5";
}

function callToFriend(bonus) {
  let modal = document.getElementById("callToFriend");
  let span = document.getElementsByClassName("close")[1];
  let answer = document.querySelector(".answer");
  span.onclick = function () {
    modal.style.display = "none";
  };
  modal.style.display = "block";

  let IndexTrueButton;
  for (let i = 0; i < answerButton.length; i++) {
    if (IsTrueAnswer(answerButton[i])) {
      IndexTrueButton = i;
      break;
    }
  }

  answer.textContent =
    "Друг думает, что ответ: " +
    answerButton[IndexTrueButton].textContent.slice(0, 1);
  bonus.onclick = "";
  bonus.style.opacity = ".5";
}

function takeMoney() {
  if (count !== 0) {
    finishGame();
  } else alert("Вы ещё не ответили ни на один вопрос!");
}

function finishGame(){
  if(count !== maxCountQuestionsInTheGame) {
    sound.pause();
    sound = new Audio();
    sound.src = "./Sounds/finishGame.mp3";
    sound.play();
  }

  for (let but of answerButton) {
    but.disabled = true;
  }
  let bonusButton = document.querySelectorAll("#bonusIcon img");
  for (let but of bonusButton) {
    but.onclick = "";
  }
  
  let arrayMoney = [
    1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000,
  ];    
  let modal = document.getElementById("finishGame");
  let text = document.querySelector(".message");
  modal.style.display = "block";
  
  if(count === maxCountQuestionsInTheGame)
    text.textContent = "Поздравляем! Вы стали миллионером!!!\nХотите сыграть ещё?";
  else{
    text.textContent = "Поздравяем, вы заработали " + arrayMoney[count - 1] + " рублей!\nХотите сыграть ещё?";
  }
}

function loseGame(){
  for (let but of answerButton) {
    but.disabled = true;
  }
  let bonusButton = document.querySelectorAll("#bonusIcon img");
  for (let but of bonusButton) {
    but.onclick = "";
  }

  let modal = document.getElementById("finishGame");
  let text = document.querySelector(".message");
  let buttons = document.querySelectorAll(".modal-content button");  
  buttons[0].textContent = "Да"
  buttons[1].textContent = "Нет"
  modal.style.display = "block";
  
  text.textContent = "Вы проиграли, игра окончена...\nХотите сыграть ещё?)";
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function cancel(){
  let modal = document.getElementById("finishGame");
  modal.style.display = 'none';
}