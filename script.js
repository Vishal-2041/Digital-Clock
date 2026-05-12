/* =========================
   ELEMENTS
========================= */

const clockDisplay =
    document.getElementById('digital-clock');

const greetingDisplay =
    document.getElementById('greeting');

const progress =
    document.getElementById('progress');

const themeBtn =
    document.getElementById('theme-toggle');

/* ANALOG CLOCK */

const hourHand =
    document.getElementById('hour-hand');

const minuteHand =
    document.getElementById('minute-hand');

const secondHand =
    document.getElementById('second-hand');

/* =========================
   CLOCK
========================= */

function updateClock() {

    const now = new Date();

    let h = now.getHours();

    const m =
        String(now.getMinutes()).padStart(2, '0');

    const s =
        String(now.getSeconds()).padStart(2, '0');

    const ampm =
        h >= 12 ? 'PM' : 'AM';

    /* Greeting */

    if (h < 12)
        greetingDisplay.innerText =
        "Good Morning";

    else if (h < 18)
        greetingDisplay.innerText =
        "Good Afternoon";

    else
        greetingDisplay.innerText =
        "Good Evening";

    /* ANALOG CLOCK */

    const hourDeg =
        (h * 30) + (now.getMinutes() * 0.5);

    const minuteDeg =
        now.getMinutes() * 6;

    const secondDeg =
        now.getSeconds() * 6;

    hourHand.style.transform =
        `translateX(-50%) rotate(${hourDeg}deg)`;

    minuteHand.style.transform =
        `translateX(-50%) rotate(${minuteDeg}deg)`;

    secondHand.style.transform =
        `translateX(-50%) rotate(${secondDeg}deg)`;

    /* 12-HOUR FORMAT */

    h = h % 12;

    h = h ? h : 12;

    clockDisplay.innerText =
        `${String(h).padStart(2, '0')}:${m}:${s}`;

    document.getElementById('ampm')
        .innerText = ampm;

    /* PROGRESS BAR */

    const percent =
        (now.getSeconds() / 60) * 100;

    progress.style.width =
        `${percent}%`;

    /* DATE */

    const options = {

        weekday: 'long',

        month: 'short',

        day: 'numeric'
    };

    document.getElementById('date-display')
        .innerText =
        now.toLocaleDateString(undefined, options);
}

setInterval(updateClock, 1000);

updateClock();

/* =========================
   THEME TOGGLE
========================= */

themeBtn.addEventListener('click', () => {

    const html =
        document.documentElement;

    const isDark =
        html.getAttribute('data-theme') === 'dark';

    html.setAttribute(
        'data-theme',
        isDark ? 'light' : 'dark'
    );

    themeBtn.innerHTML =
        isDark
            ? "<i class='bx bx-moon'></i> Dark Mode"
            : "<i class='bx bx-sun'></i> Light Mode";
});

/* =========================
   SIDEBAR NAVIGATION
========================= */

const navButtons =
    document.querySelectorAll('.nav-btn');

const pages =
    document.querySelectorAll('.page');

navButtons.forEach(button => {

    button.addEventListener('click', (e) => {

        e.preventDefault();

        /* REMOVE ACTIVE */

        navButtons.forEach(btn =>
            btn.classList.remove('active')
        );

        button.classList.add('active');

        /* HIDE PAGES */

        pages.forEach(page =>
            page.classList.remove('active-page')
        );

        /* SHOW PAGE */

        const targetPage =
            button.dataset.page;

        document.getElementById(targetPage)
            .classList.add('active-page');
    });
});

/* =========================
   STOPWATCH
========================= */

const stopwatchDisplay =
    document.getElementById('stopwatch-display');

const startBtn =
    document.getElementById('start-btn');

const pauseBtn =
    document.getElementById('pause-btn');

const resetBtn =
    document.getElementById('reset-btn');

let stopwatchInterval;

let elapsedSeconds = 0;

function renderStopwatch() {

    let hours =
        Math.floor(elapsedSeconds / 3600);

    let minutes =
        Math.floor((elapsedSeconds % 3600) / 60);

    let seconds =
        elapsedSeconds % 60;

    stopwatchDisplay.innerText =
        `${String(hours).padStart(2, '0')}:` +
        `${String(minutes).padStart(2, '0')}:` +
        `${String(seconds).padStart(2, '0')}`;
}

/* START */

startBtn.addEventListener('click', () => {

    clearInterval(stopwatchInterval);

    stopwatchInterval = setInterval(() => {

        elapsedSeconds++;

        renderStopwatch();

    }, 1000);
});

/* PAUSE */

pauseBtn.addEventListener('click', () => {

    clearInterval(stopwatchInterval);
});

/* RESET */

resetBtn.addEventListener('click', () => {

    clearInterval(stopwatchInterval);

    elapsedSeconds = 0;

    renderStopwatch();
});

renderStopwatch();

/* =========================
   EVENTS
========================= */

const eventInput =
    document.getElementById('event-input');

const addEventBtn =
    document.getElementById('add-event-btn');

const eventsList =
    document.getElementById('events-list');

/* LOAD EVENTS */

window.addEventListener(
    'DOMContentLoaded',
    loadEvents
);

function saveEvent(text) {

    let events =
        JSON.parse(
            localStorage.getItem('events')
        ) || [];

    events.push(text);

    localStorage.setItem(
        'events',
        JSON.stringify(events)
    );
}

function loadEvents() {

    let events =
        JSON.parse(
            localStorage.getItem('events')
        ) || [];

    events.forEach(event => {

        createEventElement(event);
    });
}

/* CREATE EVENT */

function createEventElement(text) {

    const li =
        document.createElement('li');

    li.innerHTML = `
        <span>${text}</span>

        <button class="delete-btn">
            Delete
        </button>
    `;

    /* DELETE */

    li.querySelector('.delete-btn')
        .addEventListener('click', () => {

            li.remove();

            removeEvent(text);
        });

    eventsList.appendChild(li);
}

/* REMOVE EVENT */

function removeEvent(text) {

    let events =
        JSON.parse(
            localStorage.getItem('events')
        ) || [];

    events =
        events.filter(event =>
            event !== text
        );

    localStorage.setItem(
        'events',
        JSON.stringify(events)
    );
}

/* ADD EVENT */

addEventBtn.addEventListener('click', () => {

    const text =
        eventInput.value.trim();

    if (text === '') return;

    createEventElement(text);

    saveEvent(text);

    eventInput.value = '';
});

/* ENTER KEY SUPPORT */

eventInput.addEventListener('keypress', (e) => {

    if (e.key === 'Enter') {

        addEventBtn.click();
    }
});
