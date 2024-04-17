const canvas = document.getElementById('canvas'); //constante qui se fixe a la page
const ctx = canvas.getContext('2d');//dessine et verifie si il est supporté
const startButton = document.getElementById('startButton');//constante qui se fixe a la page
const timer = document.getElementById('timer');//constante qui se fixe a la page
const timeLeftSpan = document.getElementById('timeLeft');//constante qui se fixe a la page
const endScreen = document.getElementById('endScreen');//constante qui se fixe a la page
const finalScoreSpan = document.getElementById('finalScore');//constante qui se fixe a la page
const scoreValueSpan = document.getElementById('scoreValue');//constante qui se fixe a la page

let balls = [];
let startTime;
let timerInterval;
let score = 0;

function startGame() {
    startButton.disabled = true;
    startButton.textContent = 'En cours...';

    // Réinitialiser le jeu
    balls = [];
    score = 0;
    endScreen.style.display = 'none';
    canvas.style.display = 'block';

    // Démarrer le minuteur
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);

    // Démarrer l'animation
    requestAnimationFrame(updateGame);
}

function updateTimer() {
    const currentTime = Date.now();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    const timeLeft = Math.max(0, 60 - elapsedTime);

    timeLeftSpan.textContent = timeLeft;

    if (timeLeft === 0) {
        endGame();
    }
}

function endGame() {
    clearInterval(timerInterval);
    startButton.disabled = false;
    startButton.textContent = 'Rejouer';
    canvas.style.display = 'none';
    endScreen.style.display = 'block';
    finalScoreSpan.textContent = score;
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Générer une nouvelle balle avec une couleur aléatoire
    if (Math.random() < 0.05) {
        const radius = Math.random() * 20 + 10;
        const x = Math.random() * (canvas.width - 2 * radius) + radius;
        const ball = {
            x: x,
            y: -radius,
            radius: radius,
            color: getRandomColor(),
            score: Math.round(radius / 10),
        };
        balls.push(ball);
    }

    // Mettre à jour et dessiner les balles
    for (let i = balls.length - 1; i >= 0; i--) {
        const ball = balls[i];
        ball.y += 5; // Vitesse de chute

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.closePath();

        // Vérifier si la balle a été cliquée
        canvas.addEventListener('click', function(event) {
            const mouseX = event.clientX - canvas.getBoundingClientRect().left;
            const mouseY = event.clientY - canvas.getBoundingClientRect().top;

            if (Math.sqrt((mouseX - ball.x) ** 2 + (mouseY - ball.y) ** 2) < ball.radius) {
                score += ball.score;
                scoreValueSpan.textContent = score;
                balls.splice(i, 1); // Supprimer la balle cliquée
            }
        });

        // Vérifier si la balle atteint le bas
        if (ball.y > canvas.height + ball.radius) {
            balls.splice(i, 1);
        }
    }

    // Appel récursif pour continuer l'animation
    requestAnimationFrame(updateGame);
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

startButton.addEventListener('click', startGame);