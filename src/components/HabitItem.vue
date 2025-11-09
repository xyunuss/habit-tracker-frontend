<template>
  <li class="habit-item">✅ {{ habit.name }}</li>
</template>

<script setup>
defineProps({
  habit: Object,
})
</script>

<style scoped>
.habit-item {
  font-size: 18px;
  margin: 4px 0;
}
</style>
