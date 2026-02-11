'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const currentTimeElement = document.getElementById('current-time');
    const nameInput = document.getElementById('event-name');
    const dateInput = document.getElementById('event-date');
    const addButton = document.getElementById('add-button');
    const listElement = document.getElementById('countdown-list');

    let countdowns = [];

    addButton.addEventListener('click', addCountdown);

    nameInput.addEventListener('keydown', checkEnter);
    dateInput.addEventListener('keydown', checkEnter);

    listElement.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-btn')) {
            const id = Number(event.target.getAttribute('data-id'));
            deleteCountdown(id);
        }
    });

    const padZero = (num) => num.toString().padStart(2, '0');

    function updateClock() {
        const now = new Date();
        const year = now.getFullYear();
        const month = padZero(now.getMonth() + 1);
        const day = padZero(now.getDate());
        const hours = padZero(now.getHours());
        const minutes = padZero(now.getMinutes());
        const seconds = padZero(now.getSeconds());

        currentTimeElement.innerText = `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
    }

    function checkEnter(event) {
        if (event.key === 'Enter') {
            addCountdown();
        }
    }

    function addCountdown() {
        const eventName = nameInput.value;
        const targetDateStrings = dateInput.value;

        if (!eventName || !targetDateStrings) {
            if (!eventName) nameInput.focus();
            else dateInput.focus();
            return;
        }

        const targetDate = new Date(targetDateStrings);
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
        nameInput.focus();
    }

    function deleteCountdown(id) {
        countdowns = countdowns.filter(item => item.id !== id);
        renderCountdowns();
    }

    function updateCountdowns() {
        const now = new Date();

        countdowns.forEach(item => {
            const diff = item.target - now;
            const timerElement = document.getElementById(`timer-${item.id}`);

            if (!timerElement) return;

            if (diff <= 0) {
                timerElement.innerHTML = '<span class="badge bg-danger">終了しました</span>';
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
        listElement.innerHTML = '';

        countdowns.forEach(item => {
            const div = document.createElement('div');
            div.className = 'card bg-light border';

            div.innerHTML = `
                <div class="card-body d-flex justify-content-between align-items-center">
                    <div class="text-start">
                        <h5 class="card-title text-primary mb-1">${item.name}</h5>
                        <p class="card-text timer-display fs-5 mb-0" id="timer-${item.id}">計算中...</p>
                    </div>

                    <button class="btn btn-outline-danger btn-sm ms-3 delete-btn" data-id="${item.id}">削除</button>
                </div>
            `;

            listElement.appendChild(div);
        });

        updateCountdowns();
    }

    setInterval(() => {
        updateClock();
        updateCountdowns();
    }, 1000);

    updateClock();
});
