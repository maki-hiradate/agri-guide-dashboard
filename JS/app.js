// 変数の初期化
let speed = 0;
let distance = 0;
let isRunning = false;
let animationId = null;

// Canvas設定
const canvas = document.getElementById('fieldCanvas');
const ctx = canvas.getContext('2d');

// 走行経路の座標
let path = [];
let currentX = 50;
let currentY = 150;

// DOM要素の取得
const speedDisplay = document.getElementById('speed');
const distanceDisplay = document.getElementById('distance');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const leds = document.querySelectorAll('.led');

// 初期描画
drawField();

// ボタンイベント
startBtn.addEventListener('click', start);
stopBtn.addEventListener('click', stop);
resetBtn.addEventListener('click', reset);

// 開始
function start() {
    if (!isRunning) {
        isRunning = true;
        animate();
    }
}

// 停止
function stop() {
    isRunning = false;
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
}

// リセット
function reset() {
    stop();
    speed = 0;
    distance = 0;
    path = [];
    currentX = 50;
    currentY = 150;
    updateDisplay();
    drawField();
    updateLEDs(0);
}

// アニメーションループ
function animate() {
    if (!isRunning) return;

    // 速度を徐々に上げる（最大10km/h）
    if (speed < 10) {
        speed += 0.1;
    }

    // 距離を増やす
    distance += speed * 0.01;

    // 表示を更新
    updateDisplay();

    // 走行経路を更新
    updatePath();

    // フィールドを再描画
    drawField();

    // LEDバーを更新
    updateLEDs(speed);

    // 次のフレーム
    animationId = requestAnimationFrame(animate);
}

// 表示更新
function updateDisplay() {
    speedDisplay.textContent = speed.toFixed(1);
    distanceDisplay.textContent = distance.toFixed(1);
}

// 走行経路を更新
function updatePath() {
    // 右に移動
    currentX += 2;
    
    // 画面端に来たら折り返し
    if (currentX > canvas.width - 50) {
        currentX = 50;
        currentY += 20;
        
        // 下端に来たらリセット
        if (currentY > canvas.height - 50) {
            currentY = 50;
        }
    }

    path.push({ x: currentX, y: currentY });

    // 経路が長すぎたら古い部分を削除
    if (path.length > 200) {
        path.shift();
    }
}

// フィールドを描画
function drawField() {
    // 背景をクリア
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // グリッド線を描画
    ctx.strokeStyle = '#1a3a1a';
    ctx.lineWidth = 1;

    // 縦線
    for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    // 横線
    for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // 走行経路を描画
    if (path.length > 1) {
        ctx.strokeStyle = '#27ae60';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        
        for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
        }
        
        ctx.stroke();
    }

    // 現在位置を描画（赤い点）
    if (path.length > 0) {
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(currentX, currentY, 5, 0, Math.PI * 2);
        ctx.fill();
    }
}

// LEDバーを更新
function updateLEDs(currentSpeed) {
    const ledCount = Math.floor((currentSpeed / 10) * leds.length);
    
    leds.forEach((led, index) => {
        if (index < ledCount) {
            led.classList.add('active');
        } else {
            led.classList.remove('active');
        }
    });
}