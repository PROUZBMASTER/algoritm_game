document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll('[data-cell]');
    const messageElement = document.getElementById('message');
    const restartButton = document.getElementById('restartButton');
    const questions = [
        { question: "What is 2 + 2?", answer: "4" },
        { question: "What is the capital of France?", answer: "Paris" },
        { question: "What is the color of the sky?", answer: "Blue" },
        // Add more questions as needed
    ];

    let isXTurn = true;

    function handleClick(event) {
        const cell = event.target;
        if (cell.textContent !== '') return;

        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        const userAnswer = prompt(randomQuestion.question);

        if (userAnswer && userAnswer.toLowerCase() === randomQuestion.answer.toLowerCase()) {
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
    }

    restartButton.addEventListener('click', startGame);

    startGame();
});


