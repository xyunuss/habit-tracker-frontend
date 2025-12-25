<template>
  <div class="week-navigation">
    <button class="nav-btn" @click="previousWeek" aria-label="Vorherige Woche">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M12 15L7 10L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    
    <div class="week-days">
      <button 
        v-for="day in weekDays" 
        :key="day.date"
        class="day-btn"
        :class="{ 
          'is-today': day.isToday, 
          'is-selected': day.date === currentDate,
          'is-future': day.isFuture
        }"
        @click="selectDate(day.date)"
      >
        <span class="day-name">{{ day.dayName }}</span>
        <span class="day-number">{{ day.dayNumber }}</span>
      </button>
    </div>
    
    <button class="nav-btn" @click="nextWeek" aria-label="Nächste Woche">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M8 5L13 10L8 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    
    <button 
      v-if="!isCurrentWeek" 
      class="today-btn"
      @click="goToToday"
    >
      Heute
    </button>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { dateUtils } from '../services/api.js'

defineProps({
  currentDate: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['navigate'])

const weekOffset = ref(0)

const weekStart = computed(() => {
  const today = new Date()
  today.setDate(today.getDate() + (weekOffset.value * 7))
  const day = today.getDay()
  const diff = today.getDate() - day + (day === 0 ? -6 : 1)
  today.setDate(diff)
  return dateUtils.formatDate(today)
})

const weekDays = computed(() => {
  const days = []
  const start = new Date(weekStart.value)
  const today = dateUtils.today()
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    const dateStr = dateUtils.formatDate(date)
    
    days.push({
      date: dateStr,
      dayName: date.toLocaleDateString('de-DE', { weekday: 'short' }).slice(0, 2),
      dayNumber: date.getDate(),
      isToday: dateStr === today,
      isFuture: dateStr > today
    })
  }
  
  return days
})

const isCurrentWeek = computed(() => weekOffset.value === 0)

const previousWeek = () => {
  weekOffset.value--
}

const nextWeek = () => {
  weekOffset.value++
}

const goToToday = () => {
  weekOffset.value = 0
  emit('navigate', dateUtils.today())
}

const selectDate = (date) => {
  emit('navigate', date)
}
</script>

<style scoped>
.week-navigation {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
}

.nav-btn:hover {
  background-color: var(--color-bg-soft);
  color: var(--color-text-primary);
}

.week-days {
  display: flex;
  gap: var(--space-xs);
}

.day-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-md);
  min-width: 44px;
  transition: all var(--transition-fast);
}

.day-btn:hover:not(.is-future) {
  background-color: var(--color-bg-soft);
}

.day-btn.is-today {
  background-color: var(--color-text-primary);
  color: white;
}

.day-btn.is-today:hover {
  background-color: var(--color-text-secondary);
}

.day-btn.is-selected:not(.is-today) {
  background-color: var(--color-bg-mute);
}

.day-btn.is-future {
  opacity: 0.4;
  cursor: default;
}

.day-name {
  font-size: var(--font-size-xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.7;
}

.day-number {
  font-size: var(--font-size-base);
  font-weight: 600;
}

.today-btn {
  margin-left: var(--space-sm);
  padding: var(--space-xs) var(--space-md);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-accent);
  background-color: var(--color-accent-soft);
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}

.today-btn:hover {
  background-color: var(--color-accent);
  color: white;
}
</style>

