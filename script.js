document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll('[data-cell]');
    const messageElement = document.getElementById('message');
    const restartButton = document.getElementById('restartButton');
    const questionTypeContainer = document.getElementById('question-type-container');
    const gameContainer = document.getElementById('game-container');
    const questionTypeButtons = document.querySelectorAll('.question-type-button');

    const questions = {
        math: [
            { question: "What is 2 + 2?", answer: "4" },
            { question: "What is 3 * 3?", answer: "9" },
            { question: "What is 10 / 2?", answer: "5" },
            { question: "What is 2 + 3?", answer: "5" },
            { question: "What is 2 + 4?", answer: "6" },
            { question: "What is 2 + 5?", answer: "7" },
            { question: "What is 2 + 6?", answer: "8" },
            { question: "What is 2 + 7?", answer: "9" },
            { question: "What is 2 + 8?", answer: "10" },
            { question: "What is 2 + 9?", answer: "11" },
            { question: "What is 2 + 10?", answer: "12" },
            { question: "What is 2 + 11?", answer: "13" },
            // Add more math questions
        ],
        general: [
            { question: "What is the capital of France?", answer: "Paris" },
            { question: "What is the largest ocean?", answer: "Pacific" },
            { question: "Who wrote 'To Kill a Mockingbird'?", answer: "Harper Lee" },
            // Add more general knowledge questions
        ],
        science: [
            { question: "What planet is known as the Red Planet?", answer: "Mars" },
            { question: "What is the chemical symbol for water?", answer: "H2O" },
            { question: "What is the speed of light?", answer: "299792458" },
            // Add more science questions
        ]
    };

    let selectedQuestions = [];
    let isXTurn = true;
    let askedQuestions = [];
    let currentQuestion = null;

    questionTypeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const questionType = button.getAttribute('data-type');
            selectedQuestions = questions[questionType];
            questionTypeContainer.style.display = 'none';
            gameContainer.style.display = 'flex';
            startGame();
        });
    });

    function getRandomQuestion() {
        let randomQuestion;
        do {
            randomQuestion = selectedQuestions[Math.floor(Math.random() * selectedQuestions.length)];
        } while (askedQuestions.includes(randomQuestion.question));
        
        askedQuestions.push(randomQuestion.question);
        return randomQuestion;
    }

    function handleClick(event) {
        const cell = event.target;
        if (cell.textContent !== '' || currentQuestion) return;

        currentQuestion = getRandomQuestion();
        const newWindow = window.open("", "_blank", "fullscreen=yes");
        newWindow.document.write(`
            <style>
                body {
                    background-image: url('./back.jpeg');
                    background-size: cover;
                    background-position: center;
                    font-family: Arial, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                #question-box {
                    width: 500px;
                    height: 170px;
                    background-color: rgba(255, 255, 255, 0.8);
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
                    text-align: center;
                }
                h2 {
                    margin-bottom: 20px;
                    text-align: center;
                }
                input {
                    margin-bottom: 10px;
                    padding: 8px;
                    width: 90%;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    box-sizing: border-box;
                }
                button {
                    padding: 8px 20px;
                    font-size: 1em;
                    background-color: #007bff;
                    color: #fff;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }
            </style>
            <div id="question-box">
                <h2>${currentQuestion.question}</h2>
                <input type="text" id="userAnswer">
                <button onclick="submitAnswer()">Submit</button>
            </div>
        `);

        newWindow.submitAnswer = function() {
            const userAnswer = newWindow.document.getElementById('userAnswer').value;
            if (userAnswer.toLowerCase() === currentQuestion.answer.toLowerCase()) {
                cell.textContent = isXTurn ? 'X' : 'O';
                if (checkWin(isXTurn ? 'X' : 'O')) {
                    messageElement.textContent = `Congratulations! ${isXTurn ? 'X' : 'O'} wins!`;
                    messageElement.classList.add('winning-message');
                    cells.forEach(cell => cell.removeEventListener('click', handleClick));
                } else if (isDraw()) {
                    messageElement.textContent = 'Draw!';
                    messageElement.classList.add('wrong-answer');
                } else {
                    isXTurn = !isXTurn;
                    messageElement.textContent = `${isXTurn ? 'X' : 'O'}'s turn.`;
                    messageElement.classList.add('wrong-answer');
                }
            } else {
                messageElement.textContent = `Wrong answer! ${isXTurn ? 'X' : 'O'}'s turn.`;
                isXTurn = !isXTurn;
                messageElement.classList.add('wrong-answer');
            }
            currentQuestion = null;
            newWindow.close();
        };

        newWindow.document.getElementById('userAnswer').addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                newWindow.submitAnswer();
            }
        });
    }

    function checkWin(currentPlayer) {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        return winningCombinations.some(combination => {
            return combination.every(index => {
                return cells[index].textContent === currentPlayer;
            });
        });
    }

    function isDraw() {
        return [...cells].every(cell => {
            return cell.textContent === 'X' || cell.textContent === 'O';
        });
    }

    function startGame() {
        cells.forEach(cell => {
            cell.textContent = '';
            cell.addEventListener('click', handleClick);
        });
        messageElement.textContent = '';
        messageElement.classList.remove('winning-message');
        isXTurn = true;
        askedQuestions = [];
        currentQuestion = null;
    }

    restartButton.addEventListener('click', () => {
        questionTypeContainer.style.display = 'block';
        gameContainer.style.display = 'none';
    });

    startGame();
});