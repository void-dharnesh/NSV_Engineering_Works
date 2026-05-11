const STORAGE_KEY = "fynlo-clarity-state-v3";

const moodOptions = [
  "Calm focus",
  "Motivated",
  "Need recovery",
  "Scattered"
];

const moodDescriptions = {
  "Calm focus": "Your current mood supports steady work and balanced recovery.",
  Motivated: "Energy is high, so channel it into one meaningful block.",
  "Need recovery": "Pull back slightly and protect a lighter, more restorative pace.",
  Scattered: "Reduce the noise by finishing one small task before switching context."
};

const moduleTargets = {
  clarity: "insightsPanel",
  goals: "goalPanel",
  habits: "habitPanel",
  tasks: "plannerPanel",
  wellbeing: "wellbeingPanel",
  insights: "insightsPanel"
};

function createDefaultState() {
  return {
    tasks: [
      {
        id: crypto.randomUUID(),
        title: "Plan next week carousel content",
        time: "9:00 AM",
        done: true
      },
      {
        id: crypto.randomUUID(),
        title: "Review habit streaks and weekly report",
        time: "11:30 AM",
        done: false
      },
      {
        id: crypto.randomUUID(),
        title: "Evening movement and reflection",
        time: "7:15 PM",
        done: false
      }
    ],
    habits: [
      { id: crypto.randomUUID(), name: "Morning planning", streak: 12, done: true },
      { id: crypto.randomUUID(), name: "Workout", streak: 8, done: false },
      { id: crypto.randomUUID(), name: "Inbox zero", streak: 5, done: true }
    ],
    goals: [
      {
        id: crypto.randomUUID(),
        name: "Launch the first beta",
        current: 72,
        target: 100,
        color: "linear-gradient(135deg, #5aa7ff, #46d0d0)"
      },
      {
        id: crypto.randomUUID(),
        name: "Build a calmer daily routine",
        current: 61,
        target: 100,
        color: "linear-gradient(135deg, #4f77ff, #82b1ff)"
      },
      {
        id: crypto.randomUUID(),
        name: "Protect wellbeing consistency",
        current: 83,
        target: 100,
        color: "linear-gradient(135deg, #edbf68, #35d0c4)"
      }
    ],
    mood: "Calm focus",
    focusMinutes: 90,
    timerRemaining: 90 * 60,
    timerRunning: false,
    selectedModule: "clarity",
    weeklyClarity: [64, 71, 68, 82, 78, 85, 84]
  };
}

const elements = {
  taskList: document.getElementById("taskList"),
  habitList: document.getElementById("habitList"),
  goalList: document.getElementById("goalList"),
  moodList: document.getElementById("moodList"),
  weeklyChart: document.getElementById("weeklyChart"),
  insightSpotlightBars: document.getElementById("insightSpotlightBars"),
  taskComposer: document.getElementById("taskComposer"),
  taskTitle: document.getElementById("taskTitle"),
  taskTime: document.getElementById("taskTime"),
  focusRange: document.getElementById("focusRange"),
  focusBtn: document.getElementById("focusBtn"),
  plannerPanel: document.getElementById("plannerPanel"),
  clarityCore: document.getElementById("clarityCore"),
  coreOverline: document.getElementById("coreOverline"),
  coreValue: document.getElementById("coreValue"),
  coreTitle: document.getElementById("coreTitle"),
  coreHint: document.getElementById("coreHint"),
  focusMinutes: document.getElementById("focusMinutes"),
  focusTimerHero: document.getElementById("focusTimerHero"),
  focusTargetHero: document.getElementById("focusTargetHero"),
  focusTimerPanel: document.getElementById("focusTimerPanel"),
  momentumWordHero: document.getElementById("momentumWordHero"),
  momentumFillHero: document.getElementById("momentumFillHero"),
  momentumLabelHero: document.getElementById("momentumLabelHero"),
  momentumNoteHero: document.getElementById("momentumNoteHero"),
  goalSummary: document.getElementById("goalSummary"),
  habitSummary: document.getElementById("habitSummary"),
  progressSummary: document.getElementById("progressSummary"),
  taskSummary: document.getElementById("taskSummary"),
  wellbeingSummary: document.getElementById("wellbeingSummary"),
  taskPill: document.getElementById("taskPill"),
  habitPill: document.getElementById("habitPill"),
  goalPill: document.getElementById("goalPill"),
  moodPill: document.getElementById("moodPill"),
  completionRate: document.getElementById("completionRate"),
  habitRate: document.getElementById("habitRate"),
  insightHeadline: document.getElementById("insightHeadline"),
  insightNote: document.getElementById("insightNote"),
  weeklyAverageSpotlight: document.getElementById("weeklyAverageSpotlight"),
  insightPreviewSpotlight: document.getElementById("insightPreviewSpotlight"),
  energyLevel: document.getElementById("energyLevel"),
  energyNote: document.getElementById("energyNote"),
  recoveryLevel: document.getElementById("recoveryLevel"),
  recoveryNote: document.getElementById("recoveryNote"),
  wellbeingGuide: document.getElementById("wellbeingGuide"),
  wellbeingGuideNote: document.getElementById("wellbeingGuideNote"),
  companionTitle: document.getElementById("companionTitle"),
  companionText: document.getElementById("companionText")
};

const moduleButtons = Array.from(document.querySelectorAll("[data-module]"));
const timerButtons = Array.from(document.querySelectorAll("[data-timer-action]"));

let state = loadState();
let timerInterval = null;

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return createDefaultState();
    }

    const parsed = JSON.parse(saved);
    const defaults = createDefaultState();

    return {
      ...defaults,
      ...parsed,
      timerRunning: false,
      timerRemaining: Number.isFinite(parsed.timerRemaining)
        ? parsed.timerRemaining
        : Number(parsed.focusMinutes || defaults.focusMinutes) * 60,
      selectedModule: parsed.selectedModule || "clarity",
      weeklyClarity:
        Array.isArray(parsed.weeklyClarity) && parsed.weeklyClarity.length === 7
          ? parsed.weeklyClarity
          : defaults.weeklyClarity
    };
  } catch {
    return createDefaultState();
  }
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...state,
      timerRunning: false
    })
  );
}

function computeGoalAverage() {
  const total = state.goals.reduce((sum, goal) => sum + goal.current / goal.target, 0);
  return total / state.goals.length;
}

function computeTaskRate() {
  const completed = state.tasks.filter((task) => task.done).length;
  return state.tasks.length ? completed / state.tasks.length : 1;
}

function computeHabitRate() {
  const completed = state.habits.filter((habit) => habit.done).length;
  return state.habits.length ? completed / state.habits.length : 1;
}

function moodBoost() {
  const boosts = {
    "Calm focus": 1,
    Motivated: 0.92,
    "Need recovery": 0.68,
    Scattered: 0.52
  };

  return boosts[state.mood] ?? 0.75;
}

function computeWellbeingScore() {
  return Math.round(moodBoost() * 70 + computeHabitRate() * 20 + computeTaskRate() * 10);
}

function getClarityScore() {
  const score =
    computeTaskRate() * 35 +
    computeHabitRate() * 25 +
    computeGoalAverage() * 25 +
    (state.focusMinutes / 180) * 7 +
    moodBoost() * 8;

  return Math.round(Math.min(100, score));
}

function getWeeklyAverage(score) {
  const values = [...state.weeklyClarity.slice(0, -1), score];
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function getMomentumLabel(score) {
  if (score >= 85) {
    return "Intentional momentum";
  }

  if (score >= 70) {
    return "Calm and in control";
  }

  if (score >= 55) {
    return "Building your rhythm";
  }

  return "Reduce the noise";
}

function getRhythmWord(score) {
  if (score >= 90) {
    return "Excellent";
  }

  if (score >= 78) {
    return "Great";
  }

  if (score >= 62) {
    return "Good";
  }

  if (score >= 48) {
    return "Okay";
  }

  return "Low";
}

function getInsight(score) {
  if (score >= 85) {
    return {
      headline: "You are protecting the right priorities.",
      note: "Keep the first focus block sacred and the rest of the day stays light."
    };
  }

  if (score >= 70) {
    return {
      headline: "Protect your first focused hour.",
      note: "Your best days begin with one clear priority before the rest of the noise arrives."
    };
  }

  if (score >= 55) {
    return {
      headline: "Cut the list before adding more.",
      note: "A smaller task list and one consistent habit will improve momentum faster than pushing harder."
    };
  }

  return {
    headline: "Start with one goal and one habit.",
    note: "Simplify the day first, then let the rhythm build back up."
  };
}

function getTopGoal() {
  return [...state.goals].sort((a, b) => b.current - a.current)[0];
}

function getTopHabit() {
  return [...state.habits].sort((a, b) => b.streak - a.streak)[0];
}

function getEnergyState() {
  if (state.timerRunning) {
    return {
      title: "Locked in",
      note: "Your focus timer is running, so your energy is being used with intention."
    };
  }

  if (state.mood === "Motivated") {
    return {
      title: "High",
      note: "Motivation is available. Use it on one thing that truly matters."
    };
  }

  if (state.mood === "Calm focus") {
    return {
      title: "Steady",
      note: "A calm state is giving you a consistent pace for the day."
    };
  }

  if (state.mood === "Need recovery") {
    return {
      title: "Soft",
      note: "Energy is lower, so a lighter rhythm will keep the day sustainable."
    };
  }

  return {
    title: "Uneven",
    note: "Your energy is jumping around. Finishing one small task should settle it."
  };
}

function getRecoveryState() {
  const remainingTasks = Math.max(0, state.tasks.length - state.tasks.filter((task) => task.done).length);

  if (state.mood === "Need recovery") {
    return {
      title: "Needed",
      note: "Make room for a reset before asking for another long focus session."
    };
  }

  if (remainingTasks <= 1) {
    return {
      title: "Open",
      note: "You have enough space left in the day for recovery without losing momentum."
    };
  }

  if (remainingTasks <= 3) {
    return {
      title: "Balanced",
      note: "The workload is manageable if you protect one quiet pause."
    };
  }

  return {
    title: "Tight",
    note: "Too many open loops are crowding out recovery. Trim the list before adding more."
  };
}

function getCompanionMessage() {
  const remainingTasks = Math.max(0, state.tasks.length - state.tasks.filter((task) => task.done).length);

  if (state.timerRunning) {
    return {
      title: "Focus buddy is guarding your flow.",
      note: "It is quietly holding the clipboard while your timer runs and distractions stay outside."
    };
  }

  if (remainingTasks <= 1) {
    return {
      title: "Focus buddy is celebrating a light list.",
      note: "You've kept the day clean, so it's just floating around and checking things off."
    };
  }

  return {
    title: "Focus buddy is planning quietly.",
    note: "It stays in the extra space like a calm little emote, keeping the panel alive while you work through the day."
  };
}

function formatTimer(totalSeconds) {
  const seconds = Math.max(0, totalSeconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function buildModuleStats(score) {
  const completedTasks = state.tasks.filter((task) => task.done).length;
  const remainingTasks = Math.max(0, state.tasks.length - completedTasks);
  const completedHabits = state.habits.filter((habit) => habit.done).length;
  const habitRate = Math.round(computeHabitRate() * 100);
  const goalAverage = Math.round(computeGoalAverage() * 100);
  const taskRate = Math.round(computeTaskRate() * 100);
  const wellbeingScore = computeWellbeingScore();
  const weeklyAverage = getWeeklyAverage(score);
  const topGoal = getTopGoal();
  const topHabit = getTopHabit();
  const insight = getInsight(score);

  return {
    clarity: {
      overline: "Clarity score",
      value: String(score),
      title: getMomentumLabel(score),
      hint: "Tap a module to jump straight to its statistics."
    },
    goals: {
      overline: "Goal alignment",
      value: `${goalAverage}%`,
      title: `${state.goals.length} goals in motion`,
      hint: `Top milestone: ${topGoal.name} at ${topGoal.current}%.`
    },
    habits: {
      overline: "Habit score",
      value: `${habitRate}%`,
      title: `${completedHabits} of ${state.habits.length} habits kept`,
      hint: `Longest streak: ${topHabit.streak} days on ${topHabit.name}.`
    },
    tasks: {
      overline: "Task execution",
      value: `${taskRate}%`,
      title: `${remainingTasks} tasks remaining`,
      hint: `${completedTasks} completed with intention today.`
    },
    wellbeing: {
      overline: "Wellbeing",
      value: `${wellbeingScore}%`,
      title: state.mood,
      hint: moodDescriptions[state.mood]
    },
    insights: {
      overline: "Weekly insight",
      value: `${weeklyAverage}%`,
      title: "Patterns worth protecting",
      hint: insight.headline
    }
  };
}

function renderTasks() {
  elements.taskList.innerHTML = "";

  state.tasks.forEach((task) => {
    const card = document.createElement("article");
    card.className = "task-card";

    const taskMain = document.createElement("div");
    taskMain.className = "task-main";

    const toggleButton = document.createElement("button");
    toggleButton.className = `task-toggle ${task.done ? "is-complete" : ""}`;
    toggleButton.type = "button";
    toggleButton.setAttribute(
      "aria-label",
      task.done ? "Mark task incomplete" : "Mark task complete"
    );

    const taskText = document.createElement("div");
    taskText.className = `task-text ${task.done ? "is-complete" : ""}`;

    const title = document.createElement("strong");
    title.textContent = task.title;

    const subtitle = document.createElement("p");
    subtitle.textContent = task.done
      ? "Completed with intention."
      : "Next step waiting for focused time.";

    taskText.append(title, subtitle);
    taskMain.append(toggleButton, taskText);

    const taskMeta = document.createElement("div");
    taskMeta.className = "task-meta";

    const timeBadge = document.createElement("span");
    timeBadge.className = "time-badge";
    timeBadge.textContent = task.time || "Any time";

    const deleteButton = document.createElement("button");
    deleteButton.className = "task-delete";
    deleteButton.type = "button";
    deleteButton.setAttribute("aria-label", "Delete task");
    deleteButton.textContent = "\u00d7";

    taskMeta.append(timeBadge, deleteButton);
    card.append(taskMain, taskMeta);

    toggleButton.addEventListener("click", () => {
      state.tasks = state.tasks.map((item) =>
        item.id === task.id ? { ...item, done: !item.done } : item
      );
      state.selectedModule = "tasks";
      syncWeeklyClarity();
      persistAndRender();
    });

    deleteButton.addEventListener("click", () => {
      state.tasks = state.tasks.filter((item) => item.id !== task.id);
      state.selectedModule = "tasks";
      syncWeeklyClarity();
      persistAndRender();
    });

    elements.taskList.appendChild(card);
  });
}

function renderHabits() {
  elements.habitList.innerHTML = "";

  state.habits.forEach((habit) => {
    const card = document.createElement("article");
    card.className = "habit-card";
    card.innerHTML = `
      <div class="habit-top">
        <div>
          <strong>${habit.name}</strong>
          <p>${habit.done ? "Kept today" : "Still available today"}</p>
        </div>
        <span class="streak-badge">${habit.streak}-day streak</span>
      </div>
      <button class="habit-toggle ${habit.done ? "is-complete" : ""}" type="button">
        ${habit.done ? "Completed" : "Mark done"}
      </button>
    `;

    const toggleButton = card.querySelector(".habit-toggle");
    toggleButton.addEventListener("click", () => {
      state.habits = state.habits.map((item) =>
        item.id === habit.id
          ? {
              ...item,
              done: !item.done,
              streak: item.done ? Math.max(1, item.streak - 1) : item.streak + 1
            }
          : item
      );
      state.selectedModule = "habits";
      syncWeeklyClarity();
      persistAndRender();
    });

    elements.habitList.appendChild(card);
  });
}

function renderGoals() {
  elements.goalList.innerHTML = "";

  state.goals.forEach((goal) => {
    const progress = Math.round((goal.current / goal.target) * 100);
    const card = document.createElement("article");
    card.className = "goal-card";
    card.innerHTML = `
      <div class="goal-top">
        <div>
          <strong>${goal.name}</strong>
          <p>${progress}% complete</p>
        </div>
        <button class="goal-step" type="button">+5%</button>
      </div>
      <div class="goal-progress">
        <span style="width:${progress}%; background:${goal.color};"></span>
      </div>
      <div class="goal-footer">
        <span class="goal-value">${goal.current} / ${goal.target}</span>
        <span class="time-badge">${goal.target - goal.current}% left</span>
      </div>
    `;

    const stepButton = card.querySelector(".goal-step");
    stepButton.addEventListener("click", () => {
      state.goals = state.goals.map((item) =>
        item.id === goal.id
          ? { ...item, current: Math.min(item.target, item.current + 5) }
          : item
      );
      state.selectedModule = "goals";
      syncWeeklyClarity();
      persistAndRender();
    });

    elements.goalList.appendChild(card);
  });
}

function renderMoodOptions() {
  elements.moodList.innerHTML = "";

  moodOptions.forEach((mood) => {
    const button = document.createElement("button");
    button.className = `mood-chip ${state.mood === mood ? "is-active" : ""}`;
    button.type = "button";
    button.textContent = mood;

    button.addEventListener("click", () => {
      state.mood = mood;
      state.selectedModule = "wellbeing";
      syncWeeklyClarity();
      persistAndRender();
    });

    elements.moodList.appendChild(button);
  });
}

function renderWeeklyChart(score) {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const values = [...state.weeklyClarity.slice(0, -1), score];
  elements.weeklyChart.innerHTML = "";

  values.forEach((value, index) => {
    const bar = document.createElement("div");
    bar.className = "chart-bar";
    bar.innerHTML = `
      <span>${labels[index]}</span>
      <div class="bar-fill" style="height:${Math.max(44, value * 1.8)}px"></div>
      <strong>${value}</strong>
    `;
    elements.weeklyChart.appendChild(bar);
  });
}

function renderInsightSpotlight(score) {
  const values = [...state.weeklyClarity.slice(0, -1), score];
  const insight = getInsight(score);
  const weeklyAverage = getWeeklyAverage(score);

  elements.weeklyAverageSpotlight.textContent = `${weeklyAverage}%`;
  elements.insightPreviewSpotlight.textContent = insight.headline;
  elements.insightSpotlightBars.innerHTML = "";

  values.forEach((value) => {
    const bar = document.createElement("div");
    bar.className = "spotlight-bar";
    bar.innerHTML = `
      <div class="spotlight-bar-fill" style="height:${Math.max(34, value * 1.2)}px"></div>
      <strong>${value}</strong>
    `;
    elements.insightSpotlightBars.appendChild(bar);
  });
}

function renderWellbeingOverview() {
  const energyState = getEnergyState();
  const recoveryState = getRecoveryState();
  const supportCue = moodDescriptions[state.mood];

  elements.energyLevel.textContent = energyState.title;
  elements.energyNote.textContent = energyState.note;
  elements.recoveryLevel.textContent = recoveryState.title;
  elements.recoveryNote.textContent = recoveryState.note;
  elements.wellbeingGuide.textContent =
    state.timerRunning ? "Stay with the timer." : "Protect one quiet hour.";
  elements.wellbeingGuideNote.textContent = supportCue;
}

function renderTimerDisplays() {
  const timerText = formatTimer(state.timerRemaining);
  const freshDuration = state.focusMinutes * 60;
  const toggleLabel = state.timerRunning
    ? "Pause focus"
    : state.timerRemaining === freshDuration
      ? "Start focus"
      : "Resume focus";

  elements.focusTimerHero.textContent = timerText;
  elements.focusTargetHero.textContent = `Target: ${state.focusMinutes} minutes`;
  elements.focusTimerPanel.textContent = timerText;
  elements.focusMinutes.textContent = `${state.focusMinutes} min`;
  elements.focusRange.value = String(state.focusMinutes);

  timerButtons.forEach((button) => {
    if (button.dataset.timerAction === "toggle") {
      button.textContent = toggleLabel;
    }
  });
}

function renderSummary(score) {
  const completedTasks = state.tasks.filter((task) => task.done).length;
  const remainingTasks = Math.max(0, state.tasks.length - completedTasks);
  const completedHabits = state.habits.filter((habit) => habit.done).length;
  const goalAverage = Math.round(computeGoalAverage() * 100);
  const momentum = getMomentumLabel(score);
  const rhythmWord = getRhythmWord(score);
  const insight = getInsight(score);

  elements.momentumWordHero.textContent = rhythmWord;
  elements.momentumFillHero.style.width = `${score}%`;
  elements.momentumLabelHero.textContent = momentum;
  elements.momentumNoteHero.textContent =
    `Tasks ${Math.round(computeTaskRate() * 100)}% · Habits ${Math.round(
      computeHabitRate() * 100
    )}% · Goals ${goalAverage}% are shaping today's rhythm.`;

  elements.goalSummary.textContent = `${state.goals.length} active`;
  elements.habitSummary.textContent = `${completedHabits} completed`;
  elements.progressSummary.textContent = `${score}% clarity`;
  elements.taskSummary.textContent = `${remainingTasks} remaining`;
  elements.wellbeingSummary.textContent = state.mood;

  elements.taskPill.textContent = `${remainingTasks} remaining`;
  elements.habitPill.textContent = `${completedHabits} complete`;
  elements.goalPill.textContent = `${state.goals.length} active`;
  elements.moodPill.textContent = state.mood;

  elements.completionRate.textContent = `${Math.round(computeTaskRate() * 100)}%`;
  elements.habitRate.textContent = `${Math.round(computeHabitRate() * 100)}%`;
  elements.insightHeadline.textContent = insight.headline;
  elements.insightNote.textContent = insight.note;
}

function renderCore(score) {
  const moduleStats = buildModuleStats(score);
  const selected = moduleStats[state.selectedModule] || moduleStats.clarity;

  elements.coreOverline.textContent = selected.overline;
  elements.coreValue.textContent = selected.value;
  elements.coreTitle.textContent = selected.title;
  elements.coreHint.textContent = selected.hint;
}

function renderSelectionState() {
  moduleButtons.forEach((button) => {
    const isActive = button.dataset.module === state.selectedModule;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.remove("is-active-panel");
  });

  const targetId = moduleTargets[state.selectedModule];
  if (targetId) {
    document.getElementById(targetId)?.classList.add("is-active-panel");
  }
}

function renderDashboard(score) {
  renderTimerDisplays();
  renderSummary(score);
  renderWellbeingOverview();
  renderCore(score);
  renderSelectionState();
  renderWeeklyChart(score);
  renderInsightSpotlight(score);

  const companionMessage = getCompanionMessage();
  elements.companionTitle.textContent = companionMessage.title;
  elements.companionText.textContent = companionMessage.note;
}

function syncWeeklyClarity() {
  const score = getClarityScore();
  state.weeklyClarity = [...state.weeklyClarity.slice(0, -1), score];
}

function persistAndRender() {
  saveState();
  render();
}

function render() {
  const score = getClarityScore();
  renderTasks();
  renderHabits();
  renderGoals();
  renderMoodOptions();
  renderDashboard(score);
}

function scrollToTarget(targetId) {
  const target = document.getElementById(targetId);
  if (!target) {
    return;
  }

  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function stopTimer() {
  state.timerRunning = false;
  if (timerInterval) {
    window.clearInterval(timerInterval);
    timerInterval = null;
  }
  renderTimerDisplays();
  saveState();
}

function startTimer() {
  if (state.timerRemaining <= 0) {
    state.timerRemaining = state.focusMinutes * 60;
  }

  state.timerRunning = true;
  renderTimerDisplays();

  if (timerInterval) {
    window.clearInterval(timerInterval);
  }

  timerInterval = window.setInterval(() => {
    state.timerRemaining = Math.max(0, state.timerRemaining - 1);
    renderTimerDisplays();

    if (state.timerRemaining === 0) {
      stopTimer();
    }
  }, 1000);
}

function resetTimer() {
  stopTimer();
  state.timerRemaining = state.focusMinutes * 60;
  renderTimerDisplays();
  saveState();
}

elements.taskComposer.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = elements.taskTitle.value.trim();
  const time = elements.taskTime.value.trim();

  if (!title) {
    elements.taskTitle.focus();
    return;
  }

  state.tasks = [
    ...state.tasks,
    { id: crypto.randomUUID(), title, time, done: false }
  ];
  state.selectedModule = "tasks";
  elements.taskTitle.value = "";
  elements.taskTime.value = "";
  syncWeeklyClarity();
  persistAndRender();
});

elements.focusRange.addEventListener("input", (event) => {
  state.focusMinutes = Number(event.target.value);
  state.timerRemaining = state.focusMinutes * 60;
  state.selectedModule = "wellbeing";
  stopTimer();
  syncWeeklyClarity();
  persistAndRender();
});

elements.focusBtn.addEventListener("click", () => {
  scrollToTarget("plannerPanel");
});

timerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.selectedModule = "wellbeing";
    if (button.dataset.timerAction === "toggle") {
      if (state.timerRunning) {
        stopTimer();
      } else {
        startTimer();
      }
    } else {
      resetTimer();
    }

    saveState();
    renderDashboard(getClarityScore());
  });
});

moduleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const module = button.dataset.module;
    const target = button.dataset.target;

    state.selectedModule = module;
    saveState();
    renderDashboard(getClarityScore());

    if (target) {
      scrollToTarget(target);
    }
  });
});

render();
