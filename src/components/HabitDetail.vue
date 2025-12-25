<template>
  <div class="habit-detail">
    <div class="detail-header">
      <div class="habit-info">
        <span class="habit-icon" v-if="habit.icon">{{ habit.icon }}</span>
        <div>
          <h2 class="habit-name">{{ habit.name }}</h2>
          <p class="habit-description" v-if="habit.description">{{ habit.description }}</p>
        </div>
      </div>
      <button class="btn btn-secondary" @click="$emit('edit')">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M11.5 2.5L13.5 4.5L5 13H3V11L11.5 2.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Bearbeiten
      </button>
    </div>
    
    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon" style="background-color: var(--color-success-soft); color: var(--color-success);">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2V18M10 2L5 7M10 2L15 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ streak.current }}</span>
          <span class="stat-label">Aktueller Streak</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon" style="background-color: var(--color-warning-soft); color: var(--color-warning);">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L12 7H18L13 11L15 17L10 13L5 17L7 11L2 7H8L10 2Z" fill="currentColor"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ streak.max }}</span>
          <span class="stat-label">Längster Streak</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon" style="background-color: var(--color-accent-soft); color: var(--color-accent);">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2"/>
            <path d="M10 6V10L13 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ completionRate }}%</span>
          <span class="stat-label">Erfolgsquote (30 Tage)</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon" style="background-color: #F3E8FF; color: var(--habit-purple);">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 10L8 13L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ totalCompleted }}</span>
          <span class="stat-label">Gesamt erledigt</span>
        </div>
      </div>
    </div>
    
    <!-- Calendar View -->
    <div class="calendar-section">
      <div class="section-header">
        <h3 class="section-title">Monatsübersicht</h3>
        <div class="month-nav">
          <button class="nav-btn" @click="previousMonth">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <span class="month-label">{{ currentMonthLabel }}</span>
          <button class="nav-btn" @click="nextMonth" :disabled="isCurrentMonth">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div class="calendar">
        <div class="calendar-header">
          <span v-for="day in weekDays" :key="day">{{ day }}</span>
        </div>
        <div class="calendar-grid">
          <div 
            v-for="(day, index) in calendarDays" 
            :key="index"
            class="calendar-day"
            :class="{
              'is-empty': !day,
              'is-completed': day?.completed,
              'is-today': day?.isToday,
              'is-future': day?.isFuture,
              'is-outside': day?.isOutside
            }"
          >
            <span v-if="day" class="day-number">{{ day.dayNumber }}</span>
            <div v-if="day?.completed" class="check-mark">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L5 9L10 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Weekly Progress -->
    <div class="weekly-section">
      <h3 class="section-title">Wochenübersicht</h3>
      <div class="weekly-chart">
        <div 
          v-for="week in weeklyData" 
          :key="week.label"
          class="week-bar"
        >
          <div class="bar-container">
            <div 
              class="bar-fill" 
              :style="{ height: `${week.percentage}%` }"
            ></div>
          </div>
          <span class="week-label">{{ week.label }}</span>
          <span class="week-value">{{ week.completed }}/7</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { dateUtils, statsUtils } from '../services/api.js'

const props = defineProps({
  habit: {
    type: Object,
    required: true
  },
  entries: {
    type: Array,
    default: () => []
  },
  streak: {
    type: Object,
    default: () => ({ current: 0, max: 0 })
  }
})

defineEmits(['edit'])

const monthOffset = ref(0)
const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

const completionRate = computed(() => {
  const last30Days = dateUtils.getLastNDays(30)
  return statsUtils.calculateCompletionRate(
    props.entries.filter(e => last30Days.includes(e.date)), 
    30
  )
})

const totalCompleted = computed(() => {
  return props.entries.filter(e => e.completed).length
})

const currentMonth = computed(() => {
  const date = new Date()
  date.setMonth(date.getMonth() + monthOffset.value)
  return date
})

const currentMonthLabel = computed(() => {
  return currentMonth.value.toLocaleDateString('de-DE', { 
    month: 'long', 
    year: 'numeric' 
  })
})

const isCurrentMonth = computed(() => monthOffset.value === 0)

const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  const today = dateUtils.today()
  
  // First day of month
  const firstDay = new Date(year, month, 1)
  // Last day of month
  const lastDay = new Date(year, month + 1, 0)
  
  // Day of week for first day (0 = Sunday, convert to Monday-based)
  let startDay = firstDay.getDay() - 1
  if (startDay < 0) startDay = 6
  
  const days = []
  
  // Empty cells before first day
  for (let i = 0; i < startDay; i++) {
    days.push(null)
  }
  
  // Days of month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d)
    const dateStr = dateUtils.formatDate(date)
    const entry = props.entries.find(e => e.date === dateStr)
    
    days.push({
      dayNumber: d,
      date: dateStr,
      completed: entry?.completed || false,
      isToday: dateStr === today,
      isFuture: dateStr > today
    })
  }
  
  return days
})

const weeklyData = computed(() => {
  const weeks = []
  const today = new Date()
  
  for (let w = 3; w >= 0; w--) {
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - (w * 7) - today.getDay() + 1)
    
    let completed = 0
    for (let d = 0; d < 7; d++) {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + d)
      const dateStr = dateUtils.formatDate(date)
      
      if (dateStr <= dateUtils.today()) {
        const entry = props.entries.find(e => e.date === dateStr)
        if (entry?.completed) completed++
      }
    }
    
    weeks.push({
      label: `KW ${getWeekNumber(weekStart)}`,
      completed,
      percentage: (completed / 7) * 100
    })
  }
  
  return weeks
})

const previousMonth = () => {
  monthOffset.value--
}

const nextMonth = () => {
  if (!isCurrentMonth.value) {
    monthOffset.value++
  }
}

const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}
</script>

<style scoped>
.habit-detail {
  animation: fadeIn var(--transition-base) ease-out;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-xl);
  padding-bottom: var(--space-lg);
  border-bottom: 1px solid var(--color-border);
}

.habit-info {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
}

.habit-icon {
  font-size: 2rem;
}

.habit-name {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
}

.habit-description {
  margin-top: var(--space-xs);
  color: var(--color-text-secondary);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg);
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.2;
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

/* Calendar Section */
.calendar-section {
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
}

.month-nav {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.nav-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
}

.nav-btn:hover:not(:disabled) {
  background-color: var(--color-bg-soft);
  color: var(--color-text-primary);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.month-label {
  min-width: 140px;
  text-align: center;
  font-weight: 500;
}

/* Calendar */
.calendar {
  margin-top: var(--space-md);
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--space-xs);
  margin-bottom: var(--space-sm);
}

.calendar-header span {
  text-align: center;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-muted);
  padding: var(--space-xs);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--space-xs);
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  position: relative;
  background-color: var(--color-bg-soft);
  transition: all var(--transition-fast);
}

.calendar-day.is-empty {
  background-color: transparent;
}

.calendar-day.is-completed {
  background-color: var(--color-success-soft);
}

.calendar-day.is-today {
  box-shadow: inset 0 0 0 2px var(--color-text-primary);
}

.calendar-day.is-future {
  opacity: 0.4;
}

.day-number {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-primary);
}

.check-mark {
  position: absolute;
  bottom: 2px;
  color: var(--color-success);
}

/* Weekly Section */
.weekly-section {
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
}

.weekly-section .section-title {
  margin-bottom: var(--space-lg);
}

.weekly-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 200px;
}

.week-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  flex: 1;
}

.bar-container {
  width: 100%;
  max-width: 60px;
  height: 140px;
  background-color: var(--color-bg-soft);
  border-radius: var(--radius-sm);
  position: relative;
  overflow: hidden;
}

.bar-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--color-success);
  border-radius: var(--radius-sm);
  transition: height var(--transition-slow);
}

.week-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.week-value {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-primary);
}

/* Responsive */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .detail-header {
    flex-direction: column;
    gap: var(--space-md);
  }
}
</style>

