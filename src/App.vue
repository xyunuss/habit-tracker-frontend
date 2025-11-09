<template>
  <div id="app">
    <h1>Habit Tracker</h1>
    <HabitList />
  </div>
</template>

<script setup>
import HabitList from './components/HabitList.vue'
</script>

<style scoped>
#app {
  font-family: Arial, sans-serif;
  padding: 1rem;
}
</style>
