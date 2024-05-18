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
        const userAnswer = prompt(currentQuestion.question);

        if (userAnswer && userAnswer.toLowerCase() === currentQuestion.answer.toLowerCase()) {
            cell.textContent = isXTurn ? 'X' : 'O';
            if (checkWin(isXTurn ? 'X' : 'O')) {
                messageElement.textContent = `Congratulations! ${isXTurn ? 'X' : 'O'} wins!`;
                messageElement.classList.add('winning-message');
                cells.forEach(cell => cell.removeEventListener('click', handleClick));
            } else if (isDraw()) {
                messageElement.textContent = 'Draw!';
            } else {
                isXTurn = !isXTurn;
                messageElement.textContent = `${isXTurn ? 'X' : 'O'}'s turn.`;
            }
        } else {
            messageElement.textContent = `Wrong answer! ${isXTurn ? 'X' : 'O'}'s turn.`;
            isXTurn = !isXTurn;
        }
        currentQuestion = null;
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
