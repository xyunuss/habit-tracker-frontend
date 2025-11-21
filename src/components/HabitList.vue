<template>
  <div>
    <h2>My Habits</h2>
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

const habits = ref([]);

onMounted(async () => {
  try {
    const response = await fetch(
      "https://habit-tracker-backend-v21g.onrender.com/api/habits"
    );
    const data = await response.json();
    habits.value = data;
  } catch (error) {
    console.error("Error fetching habits:", error);
  }
});
</script>
