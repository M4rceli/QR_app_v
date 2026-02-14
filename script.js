// ============================================================
// CONFIGURATION: Edit answers here easily
// ============================================================
const STAGES = [
    {
        id: 1,
        // Sudoku answers are the 4 empty cells: [0,0]=5, [2,8]=7, [4,4]=5, [8,2]=5
        // Checked via checkSudoku(), not checkAnswer()
        answers: ['5957'] // <-- fallback, actual check is per-cell
    },
    {
        id: 2,
        answers: ['rozowy', 'pink']
    },
    {
        id: 3,
        answers: ['wesele']
    },
    {
        id: 4,
        answers: ['panda', 'mariusz']
    },
    {
        id: 5,
        answers: ['cola', 'cocacola', 'coca cola', 'coca-cola']
    },
    {
        id: 6,
        answers: ['koziorozecirak', 'koziorozecrak', 'koziorozec rak', 'koziorozec,rak', 'koziorozec i rak']
    },
    {
        id: 7,
        answers: ['gdansk']
    },
    {
        id: 8,
        answers: ['wlochy', 'italia', 'italy']
    },
    // Stage 9 is Tic-Tac-Toe (no text answer)
    {
        id: 9,
        answers: []
    },
    {
        id: 10,
        answers: ['warszawa', 'narodowy', 'stadion narodowy']
    },
    // Stage 11 is number guessing (handled separately)
    {
        id: 11,
        answers: []
    }
];

const TOTAL_STAGES = STAGES.length; // 11 stages

// Sudoku expected values for the 24 empty cells
const SUDOKU_ANSWERS = {
    'sudoku-0-0': '5',
    'sudoku-0-2': '4',
    'sudoku-0-5': '8',
    'sudoku-0-8': '2',
    'sudoku-1-1': '7',
    'sudoku-1-4': '9',
    'sudoku-2-3': '3',
    'sudoku-2-6': '5',
    'sudoku-2-8': '7',
    'sudoku-3-0': '8',
    'sudoku-3-5': '1',
    'sudoku-3-7': '2',
    'sudoku-4-1': '2',
    'sudoku-4-3': '8',
    'sudoku-4-4': '5',
    'sudoku-4-7': '9',
    'sudoku-5-2': '3',
    'sudoku-5-4': '2',
    'sudoku-6-1': '6',
    'sudoku-6-3': '5',
    'sudoku-6-8': '4',
    'sudoku-7-0': '2',
    'sudoku-7-6': '6',
    'sudoku-8-2': '5',
    'sudoku-8-3': '2',
    'sudoku-8-7': '7'
};

// ============================================================
// POLISH DIACRITICS REMOVAL MAP
// ============================================================
const POLISH_DIACRITICS_MAP = {
    'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n',
    'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
    'Ą': 'a', 'Ć': 'c', 'Ę': 'e', 'Ł': 'l', 'Ń': 'n',
    'Ó': 'o', 'Ś': 's', 'Ź': 'z', 'Ż': 'z'
};

/**
 * Normalizes text: lowercase, removes Polish diacritics, removes spaces
 */
function normalizeText(text) {
    let normalized = text.toLowerCase().trim();
    normalized = normalized.replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, (match) => {
        return POLISH_DIACRITICS_MAP[match] || match;
    });
    normalized = normalized.replace(/\s+/g, '');
    return normalized;
}

// ============================================================
// SUDOKU CHECK (Stage 1)
// ============================================================
function checkSudoku() {
    const stageEl = document.getElementById('stage-1');
    const errorMsg = document.getElementById('error-1');

    let allCorrect = true;
    let allFilled = true;

    for (const [id, expected] of Object.entries(SUDOKU_ANSWERS)) {
        const input = document.getElementById(id);
        if (!input) continue;

        const val = input.value.trim();
        if (val === '') {
            allFilled = false;
            input.style.borderColor = '#ff5252';
        } else if (val !== expected) {
            allCorrect = false;
            input.style.borderColor = '#ff5252';
        } else {
            input.style.borderColor = '#66bb6a';
        }
    }

    if (!allFilled) {
        stageEl.classList.add('shake');
        if (errorMsg) errorMsg.textContent = '❌ Uzupełnij wszystkie puste pola!';
        setTimeout(() => stageEl.classList.remove('shake'), 500);
        return;
    }

    if (!allCorrect) {
        stageEl.classList.add('shake');
        if (errorMsg) errorMsg.textContent = '❌ Niepoprawne wartości! Spróbuj ponownie.';
        setTimeout(() => stageEl.classList.remove('shake'), 500);
        return;
    }

    // All correct
    if (errorMsg) errorMsg.textContent = '';
    transitionToNext(1);
}

// ============================================================
// MAIN CHECK ANSWER FUNCTION
// ============================================================
function checkAnswer(stageNumber) {
    const input = document.getElementById(`answer-${stageNumber}`);
    const errorMsg = document.getElementById(`error-${stageNumber}`);
    const stageEl = document.getElementById(`stage-${stageNumber}`);

    if (!input || !stageEl) return;

    const userAnswer = normalizeText(input.value);
    const stageConfig = STAGES.find(s => s.id === stageNumber);

    if (!stageConfig) return;

    const isCorrect = stageConfig.answers.some(answer => {
        return normalizeText(answer) === userAnswer;
    });

    if (isCorrect) {
        if (errorMsg) errorMsg.textContent = '';
        transitionToNext(stageNumber);
    } else {
        stageEl.classList.add('shake');
        if (errorMsg) errorMsg.textContent = '❌ Niepoprawna odpowiedź! Spróbuj ponownie.';
        setTimeout(() => {
            stageEl.classList.remove('shake');
        }, 500);
    }
}

// ============================================================
// STAGE TRANSITION
// ============================================================
function transitionToNext(currentStageNumber) {
    const currentStage = document.getElementById(`stage-${currentStageNumber}`);
    const isLastStage = currentStageNumber >= TOTAL_STAGES;
    const nextStageId = isLastStage ? 'stage-final' : `stage-${currentStageNumber + 1}`;
    const nextStage = document.getElementById(nextStageId);

    if (!currentStage || !nextStage) return;

    // Fade out current
    currentStage.classList.add('fade-out');

    setTimeout(() => {
        currentStage.classList.remove('active', 'fade-out');

        // Fade in next
        nextStage.classList.add('fade-in');
        nextStage.style.display = 'flex';

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                nextStage.classList.remove('fade-in');
                nextStage.classList.add('active');

                // Focus the input of the next stage if it exists
                const nextInput = nextStage.querySelector('.answer-input');
                if (nextInput) {
                    nextInput.focus();
                }

                // If stage 6 is now visible, draw constellations
                if (nextStageId === 'stage-6') {
                    drawConstellations();
                }

                // If stage 9 is now visible, initialize Tic-Tac-Toe
                if (nextStageId === 'stage-9') {
                    initTTT();
                }
            });
        });
    }, 500);
}

// ============================================================
// ENTER KEY SUPPORT
// ============================================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const activeStage = document.querySelector('.stage.active');
        if (!activeStage) return;

        const stageId = activeStage.id;

        // Stage 1 (Sudoku) — check sudoku
        if (stageId === 'stage-1') {
            checkSudoku();
            return;
        }

        // Stage 9 (TTT) - no enter action
        if (stageId === 'stage-9') return;

        // Stage 11 (number guess)
        if (stageId === 'stage-11') {
            checkGuess();
            return;
        }

        // Stage final — check final password if hint is visible
        if (stageId === 'stage-final') {
            const hint = document.getElementById('caesar-hint');
            if (hint && hint.style.display !== 'none') {
                checkFinalPassword();
            }
            return;
        }

        const match = stageId.match(/stage-(\d+)/);
        if (match) {
            checkAnswer(parseInt(match[1]));
        }
    }
});

// ============================================================
// CONSTELLATION DRAWING (Stage 6: Capricorn & Cancer)
// ============================================================
function drawConstellations() {
    const canvas = document.getElementById('constellation-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);

    // Background stars
    for (let i = 0; i < 80; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const r = Math.random() * 1.2;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.2 + Math.random() * 0.4})`;
        ctx.fill();
    }

    // Capricorn (left) - Deneb Algedi is the brightest
    const capricorn = [
        { x: 60, y: 100 }, { x: 90, y: 70 }, { x: 130, y: 55 },
        { x: 170, y: 70 }, { x: 190, y: 110 }, { x: 170, y: 160 },
        { x: 130, y: 180 }, { x: 100, y: 160 }, { x: 80, y: 130 }
    ];

    // Cancer (right) - Acubens is notable
    const cancer = [
        { x: 310, y: 90 }, { x: 350, y: 110 }, { x: 380, y: 140 },
        { x: 360, y: 170 }, { x: 400, y: 100 }, { x: 420, y: 180 }
    ];

    const capricornLines = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,0]];
    const cancerLines = [[0,1],[1,2],[2,3],[1,4],[2,5]];

    function drawConstellation(stars, lines, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.6;
        lines.forEach(([a, b]) => {
            ctx.beginPath();
            ctx.moveTo(stars[a].x, stars[a].y);
            ctx.lineTo(stars[b].x, stars[b].y);
            ctx.stroke();
        });

        ctx.globalAlpha = 1;
        stars.forEach((star, i) => {
            const radius = (i === 0) ? 4 : 2.5;
            ctx.beginPath();
            ctx.arc(star.x, star.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(star.x, star.y, radius + 3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,0.15)';
            ctx.fill();
        });
    }

    drawConstellation(capricorn, capricornLines, 'rgba(255,255,255,0.5)');
    drawConstellation(cancer, cancerLines, 'rgba(255,255,255,0.5)');
}

// ============================================================
// TIC-TAC-TOE (Stage 9)
// ============================================================
let tttBoard = ['', '', '', '', '', '', '', '', ''];
let tttGameOver = false;
let tttPlayerTurn = true;

const TTT_WIN_COMBOS = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6]           // diagonals
];

function initTTT() {
    tttBoard = ['', '', '', '', '', '', '', '', ''];
    tttGameOver = false;
    tttPlayerTurn = true;

    const cells = document.querySelectorAll('.ttt-cell');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.className = 'ttt-cell';
        cell.onclick = () => tttPlayerMove(parseInt(cell.dataset.index));
    });

    const status = document.getElementById('ttt-status');
    if (status) status.textContent = '';

    const resetBtn = document.getElementById('ttt-reset-btn');
    if (resetBtn) resetBtn.style.display = 'none';
}

function tttPlayerMove(index) {
    if (tttGameOver || !tttPlayerTurn || tttBoard[index] !== '') return;

    tttBoard[index] = 'X';
    renderTTTCell(index, 'X');
    tttPlayerTurn = false;

    const winCombo = checkTTTWinner('X');
    if (winCombo) {
        tttGameOver = true;
        highlightWinCells(winCombo);
        const status = document.getElementById('ttt-status');
        if (status) status.textContent = '🎉 Wygrałaś!';
        setTimeout(() => {
            transitionToNext(9);
        }, 1000);
        return;
    }

    if (tttBoard.every(c => c !== '')) {
        tttGameOver = true;
        const status = document.getElementById('ttt-status');
        if (status) status.textContent = '🤝 Remis! Spróbuj ponownie.';
        const resetBtn = document.getElementById('ttt-reset-btn');
        if (resetBtn) resetBtn.style.display = 'inline-block';
        return;
    }

    setTimeout(tttComputerMove, 400);
}

function tttComputerMove() {
    if (tttGameOver) return;

    let move = tttFindBestMove('O'); // try to win
    if (move === -1) move = tttFindBestMove('X'); // try to block
    if (move === -1) {
        const available = tttBoard
            .map((val, idx) => val === '' ? idx : -1)
            .filter(idx => idx !== -1);
        if (available.length === 0) return;
        move = available[Math.floor(Math.random() * available.length)];
    }

    tttBoard[move] = 'O';
    renderTTTCell(move, 'O');

    const winCombo = checkTTTWinner('O');
    if (winCombo) {
        tttGameOver = true;
        highlightWinCells(winCombo);
        const status = document.getElementById('ttt-status');
        if (status) status.textContent = '😔 Komputer wygrał! Spróbuj ponownie.';
        const resetBtn = document.getElementById('ttt-reset-btn');
        if (resetBtn) resetBtn.style.display = 'inline-block';
        return;
    }

    if (tttBoard.every(c => c !== '')) {
        tttGameOver = true;
        const status = document.getElementById('ttt-status');
        if (status) status.textContent = '🤝 Remis! Spróbuj ponownie.';
        const resetBtn = document.getElementById('ttt-reset-btn');
        if (resetBtn) resetBtn.style.display = 'inline-block';
        return;
    }

    tttPlayerTurn = true;
}

function tttFindBestMove(marker) {
    for (const combo of TTT_WIN_COMBOS) {
        const values = combo.map(i => tttBoard[i]);
        const markerCount = values.filter(v => v === marker).length;
        const emptyCount = values.filter(v => v === '').length;
        if (markerCount === 2 && emptyCount === 1) {
            return combo.find(i => tttBoard[i] === '');
        }
    }
    return -1;
}

function renderTTTCell(index, marker) {
    const cell = document.querySelectorAll('.ttt-cell')[index];
    if (!cell) return;
    cell.textContent = marker;
    cell.classList.add('taken');
    cell.classList.add(marker === 'X' ? 'x-mark' : 'o-mark');
}

function checkTTTWinner(marker) {
    for (const combo of TTT_WIN_COMBOS) {
        if (combo.every(i => tttBoard[i] === marker)) {
            return combo;
        }
    }
    return null;
}

function highlightWinCells(combo) {
    const cells = document.querySelectorAll('.ttt-cell');
    combo.forEach(i => {
        cells[i].classList.add('win-cell');
    });
}

function resetTTT() {
    initTTT();
}

// ============================================================
// NUMBER GUESSING GAME (Stage 11)
// ============================================================
const SECRET_NUMBER = 11;

function checkGuess() {
    const input = document.getElementById('answer-11');
    const feedback = document.getElementById('guess-feedback');
    if (!input || !feedback) return;

    const value = parseInt(input.value);

    if (isNaN(value) || value < 1 || value > 20) {
        feedback.textContent = '⚠️ Wpisz liczbę od 1 do 20!';
        feedback.className = 'guess-feedback';
        return;
    }

    if (value > SECRET_NUMBER) {
        feedback.textContent = '⬇️ Mniej!';
        feedback.className = 'guess-feedback lower';
        input.value = '';
        input.focus();
    } else if (value < SECRET_NUMBER) {
        feedback.textContent = '⬆️ Więcej!';
        feedback.className = 'guess-feedback higher';
        input.value = '';
        input.focus();
    } else {
        feedback.textContent = '✅ Brawo! To ta liczba!';
        feedback.className = 'guess-feedback correct';
        setTimeout(() => {
            transitionToNext(11);
        }, 1000);
    }
}

// ============================================================
// CAESAR CIPHER (Final Stage)
// ============================================================
const CIPHER_ORIGINAL = 'vznslx nts mfmfwvl';
const CIPHER_SHIFT_CORRECT = 11;
const FINAL_PASSWORD = 'kocham cie bubulka';
let cipherRevealed = false;

function caesarShift(text, shift) {
    return text.split('').map(ch => {
        if (ch >= 'a' && ch <= 'z') {
            return String.fromCharCode(((ch.charCodeAt(0) - 97 + shift) % 26) + 97);
        } else if (ch >= 'A' && ch <= 'Z') {
            return String.fromCharCode(((ch.charCodeAt(0) - 65 + shift) % 26) + 65);
        }
        return ch;
    }).join('');
}

function updateCipher(shift) {
    const cipherText = document.getElementById('cipher-text');
    const shiftLabel = document.getElementById('cipher-shift-value');
    const caesarHint = document.getElementById('caesar-hint');

    if (!cipherText || !shiftLabel) return;

    const decoded = caesarShift(CIPHER_ORIGINAL, shift);
    cipherText.textContent = decoded;
    shiftLabel.textContent = `Przesunięcie: ${shift}`;

    if (shift === CIPHER_SHIFT_CORRECT) {
        cipherText.classList.add('decoded');
        // Show Caesar hint and password input
        if (caesarHint && !cipherRevealed) {
            caesarHint.style.display = 'block';
            const finalInput = document.getElementById('answer-final');
            if (finalInput) {
                setTimeout(() => finalInput.focus(), 300);
            }
        }
    } else {
        cipherText.classList.remove('decoded');
        // Hide hint if user moves slider away
        if (caesarHint && !cipherRevealed) {
            caesarHint.style.display = 'none';
        }
    }
}

function checkFinalPassword() {
    const input = document.getElementById('answer-final');
    const errorMsg = document.getElementById('error-final');
    const stageEl = document.getElementById('stage-final');

    if (!input) return;

    const userAnswer = normalizeText(input.value);
    const expected = normalizeText(FINAL_PASSWORD);

    if (userAnswer === expected) {
        cipherRevealed = true;
        if (errorMsg) errorMsg.textContent = '';

        // Hide cipher controls and hint
        const cipherControls = document.getElementById('cipher-controls');
        const caesarHint = document.getElementById('caesar-hint');
        if (cipherControls) cipherControls.style.display = 'none';
        if (caesarHint) caesarHint.style.display = 'none';

        // Hide the cipher text box
        const cipherTextEl = document.getElementById('cipher-text');
        if (cipherTextEl) cipherTextEl.style.display = 'none';

        // Show the big final password display
        const reveal = document.getElementById('final-reveal');
        const display = document.getElementById('final-password-display');
        if (reveal && display) {
            display.textContent = 'Kocham Cię Bubulka 💕';
            reveal.style.display = 'block';
        }

        // Launch confetti
        launchConfetti();
    } else {
        if (stageEl) {
            stageEl.classList.add('shake');
            setTimeout(() => stageEl.classList.remove('shake'), 500);
        }
        if (errorMsg) errorMsg.textContent = '❌ Niepoprawne hasło! Spróbuj ponownie.';
    }
}

// ============================================================
// VALENTINE QUESTION
// ============================================================
function valentineAnswer(yes) {
    if (yes) {
        const question = document.getElementById('valentine-question');
        if (question) question.style.display = 'none';
        launchConfetti();
    } else {
        // The "No" button runs away
        const noBtn = document.getElementById('no-btn');
        if (noBtn) {
            const x = (Math.random() - 0.5) * 200;
            const y = (Math.random() - 0.5) * 200;
            noBtn.style.position = 'relative';
            noBtn.style.left = x + 'px';
            noBtn.style.top = y + 'px';
            noBtn.style.transition = 'left 0.3s ease, top 0.3s ease';
        }
    }
}

// ============================================================
// CONFETTI (Pure JS Canvas Implementation)
// ============================================================
function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiColors = [
        '#e91e63', '#f8bbd0', '#ff5252', '#ff4081',
        '#f50057', '#ff80ab', '#ffffff', '#ffcdd2',
        '#ff1744', '#d50000', '#c51162', '#ad1457'
    ];

    const pieces = [];
    const PIECE_COUNT = 200;

    for (let i = 0; i < PIECE_COUNT; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: Math.random() * 10 + 5,
            h: Math.random() * 6 + 3,
            color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            velocityX: (Math.random() - 0.5) * 4,
            velocityY: Math.random() * 3 + 2,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            opacity: 1
        });
    }

    let startTime = Date.now();
    const DURATION = 5000;

    function animate() {
        const elapsed = Date.now() - startTime;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        pieces.forEach((p) => {
            p.x += p.velocityX;
            p.y += p.velocityY;
            p.rotation += p.rotationSpeed;
            p.velocityY += 0.05;

            if (elapsed > DURATION * 0.7) {
                p.opacity = Math.max(0, 1 - (elapsed - DURATION * 0.7) / (DURATION * 0.3));
            }

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        });

        if (elapsed < DURATION) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }, { once: true });
}

// ============================================================
// INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // Constellation canvas (drawn when stage 6 becomes active)
    const stage6 = document.getElementById('stage-6');
    if (stage6 && stage6.classList.contains('active')) {
        drawConstellations();
    }

    // Caesar cipher slider listener
    const cipherSlider = document.getElementById('cipher-slider');
    if (cipherSlider) {
        cipherSlider.addEventListener('input', (e) => {
            updateCipher(parseInt(e.target.value));
        });
    }

    // Sudoku input: auto-advance to next empty cell
    const sudokuInputs = document.querySelectorAll('.sudoku-input');
    sudokuInputs.forEach((input, idx) => {
        input.addEventListener('input', () => {
            // Only allow single digit
            input.value = input.value.replace(/[^1-9]/g, '').slice(0, 1);
            // Auto-advance to next empty sudoku input
            if (input.value.length === 1 && idx < sudokuInputs.length - 1) {
                sudokuInputs[idx + 1].focus();
            }
        });
    });
});