// 変数の初期化
let speed = 0;
let distance = 0;
let isRunning = false;
let animationId = null;

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

// グラフ用の変数（グローバルで保持）
let speedChart = null;
let distanceChart = null;

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

// バックエンドから現在のセンサーデータを取得
function fetchSensorData() {
    fetch('http://localhost:8080/agri-guide-backend/api/sensor-data')
        .then(response => response.text())
        .then(data => {
            const values = data.split(',');
            speed = parseFloat(values[0]);
            distance = parseFloat(values[1]);
            updateDisplay();
            console.log('センサーデータ取得:', speed, distance);
        })
        .catch(error => console.error('センサーデータ取得エラー:', error));
}

// バックエンドから履歴データを取得してグラフを更新
function fetchHistoryData() {
    fetch('http://localhost:8080/agri-guide-backend/api/history-data')
        .then(response => response.json())
        .then(data => {
            console.log('履歴データ取得:', data);
            
            // データが空の場合は何もしない
            if (!data || data.length === 0) {
                console.log('履歴データが空です');
                return;
            }
            
            // 新しい順に取得されるので、古い順に並び替え
            data.reverse();
            
            // ラベル（ID または タイムスタンプ）
            const labels = data.map((item, index) => `${index + 1}`);
            
            // 速度データ
            const speedData = data.map(item => item.speed);
            
            // 距離データ
            const distanceData = data.map(item => item.distance);
            
            // グラフを更新
            if (speedChart) {
                speedChart.data.labels = labels;
                speedChart.data.datasets[0].data = speedData;
                speedChart.update();
            }
            
            if (distanceChart) {
                distanceChart.data.labels = labels;
                distanceChart.data.datasets[0].data = distanceData;
                distanceChart.update();
            }
        })
        .catch(error => console.error('履歴データ取得エラー:', error));
}

// 3秒ごとにセンサーデータを取得
setInterval(fetchSensorData, 3000);

// 初回実行
fetchSensorData();

// ========================================
// 地図の初期化
// ========================================

// 地図の作成（日本の中心付近）
const map = L.map('map').setView([36.0, 138.0], 6);

// OpenStreetMapのタイルレイヤーを追加
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18
}).addTo(map);

// サンプルの走行ルート（圃場を想定）
const routeCoordinates = [
    [36.5, 138.5],
    [36.51, 138.51],
    [36.52, 138.52],
    [36.53, 138.51],
    [36.54, 138.50],
    [36.55, 138.49]
];

// ルートを描画（青い線）
const route = L.polyline(routeCoordinates, {
    color: 'blue',
    weight: 4,
    opacity: 0.7
}).addTo(map);

// 地図の表示範囲をルートに合わせる
map.fitBounds(route.getBounds());

// スタート地点にマーカーを追加
L.marker(routeCoordinates[0]).addTo(map)
    .bindPopup('スタート地点')
    .openPopup();

// ゴール地点にマーカーを追加
L.marker(routeCoordinates[routeCoordinates.length - 1]).addTo(map)
    .bindPopup('ゴール地点');

// ========================================
// グラフの初期化
// ========================================

// DOMが読み込まれてから実行
document.addEventListener('DOMContentLoaded', function() {
    
    // 速度グラフの作成
    const speedCtx = document.getElementById('speedChart').getContext('2d');
    speedChart = new Chart(speedCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: '速度 (km/h)',
                data: [],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#fff'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#fff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: '#fff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });
    
    // 距離グラフの作成
    const distanceCtx = document.getElementById('distanceChart').getContext('2d');
    distanceChart = new Chart(distanceCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: '距離 (m)',
                data: [],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#fff'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#fff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: '#fff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });
    
    // 初回の履歴データを取得
    fetchHistoryData();
    
    // 10秒ごとに履歴データを更新
    setInterval(fetchHistoryData, 10000);
});
