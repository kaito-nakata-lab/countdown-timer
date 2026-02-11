'use strict';

const addCountdown = document.getElementById('start-countdown')

function padZero(num) {
    return num.toString().padStart(2, '0');
}

function updateClock() {
    const now = new Date();
    const year = now.getFullYear();
    const month = padZero(now.getMonth() + 1);
    const day = padZero(now.getDate());
    const hours = padZero(now.getHours());
    const minutes = padZero(now.getMinutes());
    const seconds = padZero(now.getSeconds());

    const timeString = `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
    document.getElementById('current-time').innerText = timeString;
}

let countdowns = [];

addCountdown.addEventListener(
    'click',
    () => {
        const nameInput = document.getElementById('event-name');
        const dateInput = document.getElementById('event-date');

        const eventName = nameInput.value;
        const targetDateStr = dateInput.value;

        if (!eventName || !targetDateStr) {
            alert("イベント名と日時を入力してください");
            return;
        }

        const targetDate = new Date(targetDateStr);
        const now = new Date();

        if (targetDate <= now) {
            alert("日時を設定してください");
            return;
        }

        const newCountdown = {
            id: Date.now(),
            name: eventName,
            target: targetDate,
        };

        countdowns.push(newCountdown);
        renderCountdowns();

        nameInput.value = '';
        dateInput.value = '';
    }
);

function deleteCountdown(id) {
    countdowns = countdowns.filter(item => item.id !== id);
    renderCountdowns();
}

function updateCountdowns() {
    const now = new Date();
    const listElement = document.getElementById('countdown-list');

    countdowns.forEach(item => {
        const diff = item.target - now;
        const timerElement = document.getElementById(`timer-${item.id}`);

        if (!timerElement) return;

        if (diff <= 0) {
            timerElement.innerText = "終了しました";
            timerElement.style.color = "red";
        } else {
            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);

            timerElement.innerText = `あと ${d}日 ${padZero(h)}時間 ${padZero(m)}分 ${padZero(s)}秒`;
        }
    });
}

function renderCountdowns() {
    const listElement = document.getElementById('countdown-list');
    listElement.innerHTML = '';

    countdowns.forEach(item => {
        const li = document.createElement('li');
        li.className = 'countdown-item';
        li.innerHTML = `
            <button class="delete-btn" onclick="deleteCountdown(${item.id})">削除</button>
            <div class="event-title">${item.name} まで</div>
            <div id="timer-${item.id}" class="timer-display">計算中...</div>
        `;
        listElement.appendChild(li);
    });

    updateCountdowns();
}

setInterval(() => {
    updateClock();
    updateCountdowns();
}, 1000);

updateClock();