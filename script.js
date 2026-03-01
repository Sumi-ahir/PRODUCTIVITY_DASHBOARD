function weatherFunctionality() {
  // OPEN CARDS
  function openCards() {
    var cards = document.querySelectorAll(".card");
    var pages = document.querySelectorAll(".fullcard");
    var dashboard = document.getElementById("dashboard");

    //HIDE ALL ON LOAD
    pages.forEach(p => p.style.display = "none");
    cards.forEach((card, index) => {
      card.addEventListener("click", () => {

        dashboard.style.display = "none";
        pages.forEach(p => p.style.display = "none");
        pages[index].style.display = "flex";
        window.scrollTo(0, 0);

      });
    });

    pages.forEach(page => {
      page.querySelector(".back").addEventListener("click", () => {
        page.style.display = "none";
        dashboard.style.display = "block";
      });
    });
  }
  openCards()
  // TODO PAGE
  function todoPage() {

    let form = document.querySelector('.addTask form')
    let taskInput = document.getElementById('task-input')
    let textBox = document.getElementById('textArea')
    let checkBox = document.getElementById('check')
    let allTask = document.querySelector('.allTask')

    let currentTask = JSON.parse(localStorage.getItem('currentTask')) || []

    // Display existing tasks
    function renderTasks() {
      allTask.innerHTML = '';
      if (currentTask.length === 0) {
        allTask.innerHTML = "<p class='empty'>Your tasklist is empty !</p>";
        return;
      }

      currentTask.forEach((item, index) => {
        let taskDiv = document.createElement('div')
        taskDiv.classList.add('task')

        taskDiv.innerHTML = `
        <h3>
          ${item.task}
          ${item.imp ? '<span class="true">!</span>' : ''}
        </h3>
        <p>${item.detail}</p>
        <button class='deleteBtn' data-id="${index}">Completed</button>
      `

        allTask.appendChild(taskDiv)
      })
    }
    renderTasks()

    form.addEventListener('submit', function (e) {
      e.preventDefault()

      if (taskInput.value.trim() === '') {
        alert("Task cannot be empty")
        return
      }

      currentTask.push({
        task: taskInput.value,
        detail: textBox.value,
        imp: checkBox.checked
      })

      localStorage.setItem('currentTask', JSON.stringify(currentTask))

      taskInput.value = ''
      textBox.value = ''
      checkBox.checked = false

      renderTasks()
    })
    // DELETE TASK
    allTask.addEventListener('click', function (e) {
      if (e.target.classList.contains('deleteBtn')) {
        let id = e.target.getAttribute('data-id')
        currentTask.splice(id, 1)
        localStorage.setItem('currentTask', JSON.stringify(currentTask))
        renderTasks()
      }

    })
  }
  todoPage()
  // DAILY PLANNER
  function dailyPlanner() {

    function formatTime(hour) {
      const ampm = hour >= 12 ? "PM" : "AM"
      const formattedHour = hour % 12 || 12
      return `${formattedHour}:00 ${ampm}`
    }
    var dayPlanData = JSON.parse(localStorage.getItem('dayPlanData')) || {};
    var dayPlan = document.querySelector('.dayPlan')
    var hourse = Array.from({ length: 18 }, (_, idx) => {
      const start = 6 + idx
      const end = 7 + idx
      return `${formatTime(start)}-${formatTime(end)}`
    }
    )
    var wholeDaySum = ''
    hourse.forEach(function (elem, idx) {
      var savedData = dayPlanData[idx] || ''
      wholeDaySum += `
   <div class="dayPlanTime">
        <p>${elem}</p>
        <input id=${idx} type="text" placeholder="..." value=${savedData}>
    </div>
  `
    })
    //LOCALSTORAGE
    //JSON.parse//CONVERT STR TO OBJECT
    dayPlan.innerHTML = wholeDaySum
    var dayPlanInput = document.querySelectorAll('.dayPlan input')

    dayPlanInput.forEach(function (elem) {
      elem.addEventListener('input', function () {
        dayPlanData[elem.id] = elem.value
        console.log(dayPlanData);

        localStorage.setItem('dayPlanData', JSON.stringify(dayPlanData))
      })
    })

    // RESET DATA 
    const today = new Date().toDateString()
    if (localStorage.getItem('savedData') !== today) {
      localStorage.clear();
      localStorage.setItem('savedData', today)
    }
  }
  dailyPlanner()
  // MOTIVATION
  function motivationQuote() {

    var quoteText = document.querySelector('.motivation-name h3');
    var quoteAuthor = document.querySelector('.motivation-auther p');

    async function fetchQuote() {
      try {

        let response = await fetch('https://api.adviceslip.com/advice');
        let data = await response.json();
        console.log(data);


        quoteText.innerHTML = data.slip.advice;
        quoteAuthor.innerHTML = "- Advice";

      }
      catch (error) {
        quoteText.innerHTML = "Failed to load quote.";
        quoteAuthor.innerHTML = "";
        console.log(error);
      }
    }

    fetchQuote();
  }
  motivationQuote();
  // POMODORO TIMER
  function initPomodoro() {

    document.querySelector(".progress-ring").classList.add("running");
    const timeDisplay = document.getElementById("time");
    const startBtn = document.querySelector(".start");
    const pauseBtn = document.querySelector(".pause");
    const resetBtn = document.querySelector(".reset");
    const modeButtons = document.querySelectorAll(".mode");
    const progressCircle = document.querySelector(".progress");

    let timer;
    let totalTime = 25 * 60;
    let remainingTime = totalTime;
    let isRunning = false;

    const radius = 100;
    const circumference = 2 * Math.PI * radius;

    progressCircle.style.strokeDasharray = circumference;
    progressCircle.style.strokeDashoffset = 0;

    function formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    }

    function updateDisplay() {
      timeDisplay.textContent = formatTime(remainingTime);

      const progressPercent = remainingTime / totalTime;
      progressCircle.style.strokeDashoffset =
        circumference - progressPercent * circumference;
    }

    function startTimer() {
      if (isRunning) return;
      isRunning = true;

      timer = setInterval(() => {
        if (remainingTime > 0) {
          remainingTime--;
          updateDisplay();
        } else {
          clearInterval(timer);
          isRunning = false;
          alert("Time's up. Back to work.");
        }
      }, 1000);
    }

    function pauseTimer() {
      clearInterval(timer);
      isRunning = false;
    }

    function resetTimer() {
      clearInterval(timer);
      isRunning = false;
      remainingTime = totalTime;
      updateDisplay();
    }

    modeButtons.forEach(button => {
      button.addEventListener("click", () => {

        modeButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const minutes = button.dataset.time;
        totalTime = minutes * 60;
        remainingTime = totalTime;

        resetTimer();
      });
    });

    startBtn.addEventListener("click", startTimer);
    pauseBtn.addEventListener("click", pauseTimer);
    resetBtn.addEventListener("click", resetTimer);
    timeDisplay.classList.add("shake");
    setTimeout(() => timeDisplay.classList.remove("shake"), 500);

    updateDisplay();
  }

  // CALL ALTER LOAD DOM
  document.addEventListener("DOMContentLoaded", initPomodoro);
  // WEATHER
  function weather() {
    // WETHER API
    var weatherKey = 'f60c677e07c94bbc82295308262402'
    var city = 'Mahuva'
    var weatherDay = document.querySelector('.left h2')
    var weatherDate = document.querySelector('.left p')
    var degree = document.querySelector('.right h1')
    var Weathercondition = document.querySelector('.right h2')
    var weatherPrecipitation = document.querySelector('.right .Precipitation')
    var weatherHumidity = document.querySelector('.right .Humidity')
    var weatherWind = document.querySelector('.right .wind')

    var data = null
    async function weatherAPI() {
      var response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${weatherKey}&q=${city}`)
      var data = await response.json()
      console.log(data.current);

      degree.innerHTML = `${data.current.temp_c}°C`
      Weathercondition.innerHTML = `${data.current.condition.text}`
      weatherPrecipitation.innerHTML = `Heatindex: ${data.current.heatindex_c}`
      weatherHumidity.innerHTML = `Humidity: ${data.current.humidity}`
      weatherWind.innerHTML = `Wind: ${data.current.wind_kph}`


    } weatherAPI()

    function timeDate() {
      const totalDayOfWeak = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const totalMonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      var date = new Date()
      var dayOfWeak = totalDayOfWeak[date.getDay()]
      var hours = date.getHours();
      var minutes = date.getMinutes()
      var tarikh = date.getDate()
      var month = totalMonth[date.getMonth()]
      var year = date.getFullYear()

      weatherDate.innerHTML = `${tarikh} ${month} ${year}`
      if (hours > 12) {
        weatherDay.innerHTML = `${dayOfWeak}, ${hours - 12}:${minutes} PM`
      } else {
        weatherDay.innerHTML = `${dayOfWeak}, ${hours}:${minutes} AM`
      }
    }
    setInterval(() => {
      timeDate()
    }, 1000)
  }
  weather()
  // CHANGE THEME
  function changeTheme() {
    var theme = document.querySelector('.theme')
    var rootElement = document.documentElement

    //CHECK WHEN PAGE IS LOAD
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'green') {
      rootElement.style.setProperty('--card', '#5A7863')
      rootElement.style.setProperty('--transparent', '#6d82728e')
      rootElement.style.setProperty('--text', '#6d8272')
      rootElement.style.setProperty('--bg', 'rgba(151, 173, 162, 0.903)')

    } else if (savedTheme === 'mint') {
      rootElement.style.setProperty('--bg', 'rgba(108, 94, 121, 0.293)');
      rootElement.style.setProperty('--card', '#6C5E79');
      rootElement.style.setProperty('--transparent', '#9F95A9');
      rootElement.style.setProperty('--text', '#6C5E79');
    }

    theme.addEventListener('click', function () {
      if (localStorage.getItem('theme') === 'green') {
        rootElement.style.setProperty('--bg', 'rgba(108, 94, 121, 0.293)');
        rootElement.style.setProperty('--card', '#6C5E79');
        rootElement.style.setProperty('--transparent', '#9F95A9');
        rootElement.style.setProperty('--text', '#6C5E79');
        localStorage.setItem('theme', 'mint')
      } else {
        rootElement.style.setProperty('--card', '#5A7863')
        rootElement.style.setProperty('--transparent', '#6d82728e')
        rootElement.style.setProperty('--text', '#6d8272')
        rootElement.style.setProperty('--bg', 'rgba(151, 173, 162, 0.903)')
        localStorage.setItem('theme', 'green')
      }

    })
  }
  changeTheme()

  // DAILY GOALS
  function dailyGoal() {

    const allGoals = document.querySelector('.allGoals');
    const noGoalMsg = document.getElementById("noGoalMsg");
    const form = document.querySelector('.addGoals form');
    const taskInput = document.getElementById('tskinput');
    const detailInput = document.getElementById('tetArea');
    const progressBar = document.querySelector('.progressBar');
    const progressText = document.querySelector('.progressText');
    const goalCount = document.querySelector('.goalCount');

    let goals = JSON.parse(localStorage.getItem("dailyGoals")) || [];

    // ---------- SAVE ----------
    function saveLocal() {
      localStorage.setItem("dailyGoals", JSON.stringify(goals));
    }

    // ---------- RENDER ----------
    function renderGoals() {
      allGoals.innerHTML = "";

      goals.forEach((goal, index) => {

        const goalCard = document.createElement('div');
        goalCard.classList.add('goalCard');
        if (goal.completed) goalCard.classList.add('completed');

        goalCard.innerHTML = `
        <div class='goal'>
          <div class="goalTop">
            <div class="check1">
              <input type="checkbox" 
                     class="goalCheck" 
                     data-index="${index}"
                     ${goal.completed ? "checked" : ""}>
              <h3>${goal.task}</h3>
            </div>
            <h2 class="deleteBtn" data-index="${index}">
              <i class="ri-close-circle-line"></i>
            </h2>
          </div>
          <div class='goalBtm'>
            <p>${goal.detail}</p>
            <span class="priority ${goal.priority.toLowerCase()}">
              ${goal.priority}
            </span>
          </div>
        </div>
      `;

        allGoals.appendChild(goalCard);
      });

      checkGoals();
      updateProgress();
    }

    // ---------- EMPTY CHECK ----------
    function checkGoals() {
      noGoalMsg.style.display = goals.length === 0 ? "block" : "none";
    }

    // ---------- PROGRESS ----------
    function updateProgress() {
      const total = goals.length;
      const completed = goals.filter(g => g.completed).length;
      const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

      progressBar.style.width = percent + "%";
      progressText.textContent = percent + "%";
      goalCount.textContent = `${completed}/${total}`;
    }

    // ---------- ADD GOAL ----------
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const task = taskInput.value.trim();
      const detail = detailInput.value.trim();
      const priorityInput = document.querySelector('input[name="priority"]:checked');

      if (task === '' || detail === '') {
        alert("Task ane Detail lakh!");
        return;
      }

      if (!priorityInput) {
        alert("Priority select kar!");
        return;
      }

      goals.push({
        task: task,
        detail: detail,
        priority: priorityInput.value,
        completed: false
      });

      saveLocal();
      renderGoals();
      form.reset();
    });

    // ---------- CHECKBOX ----------
    allGoals.addEventListener('change', function (e) {
      if (e.target.classList.contains('goalCheck')) {
        const index = e.target.dataset.index;
        goals[index].completed = e.target.checked;
        saveLocal();
        updateProgress();
      }
    });

    // ---------- DELETE ----------
    allGoals.addEventListener('click', function (e) {
      const btn = e.target.closest('.deleteBtn');
      if (btn) {
        const index = btn.dataset.index;
        goals.splice(index, 1);
        saveLocal();
        renderGoals();
      }
    });

    // ---------- INITIAL LOAD ----------
    renderGoals();
  }
  dailyGoal();

}
weatherFunctionality()