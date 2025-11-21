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



