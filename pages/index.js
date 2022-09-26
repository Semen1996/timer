const timer = document.querySelector('.timer');
const counter = document.querySelector('.timer__counter');
const setTimer = document.querySelector('.set-timer');

const btn = document.querySelector('.button');
const hour = document.querySelector('.set-timer__time_type_hours');
const minutes = document.querySelector('.set-timer__time_type_minutes');
const seconds = document.querySelector('.set-timer__time_type_seconds');

let reg = /[A-Za-zА-Яа-яЁё\-]/g;
let interval;
let audio = new Audio();

// Функция для ввода только цифр
function inputOnlyNumber(e) {
  e.target.value = e.target.value.replace(reg, '');
}

// Функция для добавления нуля, если мы ввели только одну цифру или пустую строку
function addNull(e) {
  if( e.target.value < 10 && !e.target.value.match('0') ) {
    e.target.value = '0' + e.target.value;
  }

  if( e.target.value === '0' || e.target.value ==='' ) {
    e.target.value ="00";
  }
}

// Функция, активирующая и дезактивирующая кнопку старта
function btnDisabled() {
  if( hour.value==="00" && minutes.value==="00" && seconds.value==="00" ){
    btn.setAttribute("disabled", "disabled");
    btn.classList.add('button_type_disabled');
  } else {
    btn.removeAttribute("disabled");
    btn.classList.remove('button_type_disabled');
  }
}

// Функция, исполняемая при изменение поля
function handleChange(e) {
  if( e.target.value >= 60) {
    e.target.value ="00";
  }
  addNull(e);
  btnDisabled();
}

// Функция включения и выключения звука
function toggleSound(a) {
  if(a) {
    audio.src = './audio/alarm.mp3'; 
    audio.autoplay = true;
  } else {
    audio.pause();
  }
}

// Функция для смены кнопок
function changeButton() {
  if( btn.classList.contains('button_type_start') ) {
    btn.classList.remove('button_type_start');
    btn.removeEventListener('click', handleStart);
  
    btn.classList.add('button_type_reset');
    btn.textContent = "Сбросить";
    btn.addEventListener('click', handleReset);
  } else {
    btn.classList.remove('button_type_reset');
    btn.removeEventListener('click', handleReset);
  
    btn.classList.add('button_type_start');
    btn.textContent = "Начать";
    btn.addEventListener('click', handleStart);
  }
}

// Функция смены дисплея
function changeDisplay() {
  if( btn.classList.contains('button_type_start') ) {
    timer.style.display = "none";
    setTimer.style.display = "flex";
  } else {
    setTimer.style.display = "none";
    timer.style.display = "flex";
  }
}

// Функция, запускающая таймер
function timerRun() {
  let h = Number(hour.value);
  let m = Number(minutes.value);
  let s = Number(seconds.value);

  const time = s + m*60 + h*3600;
  timer.style.setProperty('--animation', `${time}s`);

  counter.textContent = `${ h < 10 ? '0' + h : h }:${ m < 10 ? '0' + m : m }:${ s < 10 ? '0' + s : s }`;

  interval = setInterval(() => {

    s = s - 1;

    if( s < 0) {
      s = 59;
      m > 0 ? m -= 1 : m = 0;
    }

    if( m < 0) {
      m = 59;
      h > 0 ? h -= 1 : h = 0;
    }

    counter.textContent = `${ h < 10 ? '0' + h : h }:${ m < 10 ? '0' + m : m }:${ s < 10 ? '0' + s : s }`;

    if( h===0 && m === 0 && s === 0) {
      clearInterval(interval);
      toggleSound(true);
    }
  }, 1e+3);
}

// Функция, выполняющаяся при нажатие на кнопку СБРОСИТЬ
function handleReset() {
  changeButton();
  changeDisplay();
  
  timer.style.setProperty('--animation', `0s`);
  clearInterval(interval);

  toggleSound(false);
}

// Функция, выполняющаяся при нажатие на кнопку НАЧАТЬ
function handleStart() {
  changeButton();
  changeDisplay();
  timerRun();
}

// Навешиваем слушатели на часы
hour.addEventListener('input', inputOnlyNumber);
hour.addEventListener('change', handleChange);

// Навешиваем слушатели на минуты
minutes.addEventListener('input', inputOnlyNumber);
minutes.addEventListener('change', handleChange);

// Навешиваем слушатели на секунды
seconds.addEventListener('input', inputOnlyNumber);
seconds.addEventListener('change', handleChange);

btn.addEventListener('click', handleStart);
