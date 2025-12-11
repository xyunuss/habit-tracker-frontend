<template>
  <div>
    <h2>My Habits</h2>

    <!-- --- Formular zum Erstellen eines neuen Habits --- -->
    <div class="form">
      <input
        v-model="newHabitName"
        placeholder="Habit name"
        class="input"
      />

      <select v-model="newHabitColor" class="input">
        <option value="blue">Blue</option>
        <option value="green">Green</option>
        <option value="orange">Orange</option>
      </select>

      <button @click="addHabit" class="btn">Add Habit</button>
    </div>

    <ul>
      <HabitItem
        v-for="habit in habits"
        :key="habit.id"
        :habit="habit"
      />
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import HabitItem from "./HabitItem.vue";

// List of habits
const habits = ref([]);

// Form state
const newHabitName = ref("");
const newHabitColor = ref("blue");

// Load Habits on Page Load
onMounted(async () => {
  await loadHabits();
});

// GET habits
async function loadHabits() {
  try {
    const response = await fetch(
      "https://habit-tracker-backend-v21g.onrender.com/api/habits"
    );
    habits.value = await response.json();
  } catch (err) {
    console.error("Error fetching habits:", err);
  }
}

// POST new habit
async function addHabit() {
  if (!newHabitName.value.trim()) {
    alert("Please enter a habit name!");
    return;
  }

  const payload = {
    name: newHabitName.value,
    color: newHabitColor.value,
    createdAt: new Date().toISOString().split("T")[0] // yyyy-mm-dd
  };

  try {
    const response = await fetch(
      "https://habit-tracker-backend-v21g.onrender.com/api/habits",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    const savedHabit = await response.json();

    // Update UI immediately
    habits.value.push(savedHabit);

    // Clear the form
    newHabitName.value = "";
    newHabitColor.value = "blue";
  } catch (err) {
    console.error("Error creating habit:", err);
  }
}
</script>

<style scoped>
.form {
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
}

.input {
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn {
  padding: 6px 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background-color: #45a049;
}
</style>
