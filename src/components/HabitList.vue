<template>
  <div>
    <h2>My Habits</h2>
    <ul>
      <HabitItem v-for="habit in habits" :key="habit.id" :habit="habit" />
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import HabitItem from './HabitItem.vue'

const habits = ref([])

onMounted(() => {
  // Beispiel-Daten – später ersetzt durch Daten vom Backend
  habits.value = [
    { id: 1, name: 'Drink Water' },
    { id: 2, name: 'Go for a walk' },
    { id: 3, name: 'Sleep early' },
  ]
})
</script>
