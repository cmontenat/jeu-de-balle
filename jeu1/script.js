// Récupération des éléments HTML
const canvas = document.getElementById('canvas'); // Récupère l'élément canvas
const ctx = canvas.getContext('2d'); // Contexte de dessin 2D du canvas
const startButton = document.getElementById('startButton'); // Bouton de démarrage du jeu
const timer = document.getElementById('timer'); // Élément HTML pour afficher le minuteur
const timeLeftSpan = document.getElementById('timeLeft'); // Élément HTML pour afficher le temps restant
const endScreen = document.getElementById('endScreen'); // Écran de fin de jeu
const finalScoreSpan = document.getElementById('finalScore'); // Élément HTML pour afficher le score final
const scoreValueSpan = document.getElementById('scoreValue'); // Élément HTML pour afficher la valeur du score

// Variables du jeu
let balls = []; // Tableau pour stocker les balles en jeu
let startTime; // Temps de départ du jeu
let timerInterval; // Interval pour mettre à jour le minuteur
let score = 0; // Score du joueur

// Fonction pour démarrer le jeu
function startGame() {
    startButton.disabled = true; // Désactive le bouton de démarrage
    startButton.textContent = 'En cours...'; // Change le texte du bouton de démarrage

    // Réinitialise le jeu
    balls = []; // Vide le tableau de balles
    score = 0; // Réinitialise le score
    endScreen.style.display = 'none'; // Cache l'écran de fin de jeu
    canvas.style.display = 'block'; // Affiche le canvas

    // Démarre le minuteur
    startTime = Date.now(); // Enregistre le temps de départ
    timerInterval = setInterval(updateTimer, 1000); // Lance l'interval pour mettre à jour le minuteur toutes les secondes

    // Démarre l'animation du jeu
    requestAnimationFrame(updateGame);
}

// Fonction pour mettre à jour le minuteur
function updateTimer() {
    const currentTime = Date.now(); // Temps actuel
    const elapsedTime = Math.floor((currentTime - startTime) / 1000); // Temps écoulé depuis le début du jeu en secondes
    const timeLeft = Math.max(0, 60 - elapsedTime); // Temps restant, maximum 60 secondes

    timeLeftSpan.textContent = timeLeft; // Affiche le temps restant

    if (timeLeft === 0) {
        endGame(); // Fin du jeu lorsque le temps est écoulé
    }
}

// Fonction pour mettre fin au jeu
function endGame() {
    clearInterval(timerInterval); // Arrête le minuteur
    startButton.disabled = false; // Réactive le bouton de démarrage
    startButton.textContent = 'Rejouer'; // Change le texte du bouton de démarrage
    canvas.style.display = 'none'; // Cache le canvas
    endScreen.style.display = 'block'; // Affiche l'écran de fin de jeu
    finalScoreSpan.textContent = score; // Affiche le score final
}

// Fonction pour mettre à jour le jeu (animation des balles, vérification des clics)
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Efface le canvas

    // Génère une nouvelle balle avec une couleur aléatoire
    if (Math.random() < 0.05) {
        const radius = Math.random() * 20 + 10; // Rayon aléatoire entre 10 et 30
        const x = Math.random() * (canvas.width - 2 * radius) + radius; // Position x aléatoire
        const ball = {
            x: x,
            y: -radius,
            radius: radius,
            color: getRandomColor(),
            score: Math.round(radius / 10), // Score en fonction du rayon de la balle
        };
        balls.push(ball); // Ajoute la nouvelle balle au tableau des balles
    }

    // Met à jour et dessine les balles
    for (let i = balls.length - 1; i >= 0; i--) {
        const ball = balls[i]; // Balle courante

        ball.y += 5; // Vitesse de chute des balles

        // Dessine la balle
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.closePath();

        // Vérifie si la balle a été cliquée
        canvas.addEventListener('click', function(event) {
            const mouseX = event.clientX - canvas.getBoundingClientRect().left; // Position x du clic
            const mouseY = event.clientY - canvas.getBoundingClientRect().top; // Position y du clic

            // Vérifie si le clic est à l'intérieur de la balle
            if (Math.sqrt((mouseX - ball.x) ** 2 + (mouseY - ball.y) ** 2) < ball.radius) {
                score += ball.score; // Augmente le score
                scoreValueSpan.textContent = score; // Met à jour l'affichage du score
                balls.splice(i, 1); // Supprime la balle cliquée du tableau des balles
            }
        });

        // Vérifie si la balle atteint le bas du canvas
        if (ball.y > canvas.height + ball.radius) {
            balls.splice(i, 1); // Supprime la balle du tableau des balles
        }
    }

    // Appel récursif pour continuer l'animation
    requestAnimationFrame(updateGame);
}

// Fonction pour générer une couleur aléatoire
function getRandomColor() {
    const letters = '0123456789ABCDEF'; // Caractères hexadécimaux
    let color = '#'; // Couleur générée

    // Génère une couleur hexadécimale aléatoire
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Écouteur d'événement pour démarrer le jeu lorsque le bouton est cliqué
startButton.addEventListener('click', startGame);
