<template>
  <div class="habit-card" :style="{ '--habit-color': habitColor }" @click="$emit('select')">
    <div class="card-header">
      <div class="habit-title">
        <span class="habit-icon" v-if="habit.icon">{{ habit.icon }}</span>
        <h3 class="habit-name">{{ habit.name }}</h3>
      </div>
      <div class="habit-stats">
        <div class="stat" v-if="streak.current > 0">
          <span class="stat-value">{{ streak.current }}</span>
          <span class="stat-label">Streak</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ completionRate }}%</span>
          <span class="stat-label">Quote</span>
        </div>
      </div>
    </div>
    
    <div class="heatmap">
      <div class="heatmap-months">
        <span v-for="month in months" :key="month">{{ month }}</span>
      </div>
      <div class="heatmap-grid">
        <div class="heatmap-days">
          <span>Mo</span>
          <span>Mi</span>
          <span>Fr</span>
          <span>So</span>
        </div>
        <div class="heatmap-cells">
          <div 
            v-for="(week, weekIndex) in heatmapData" 
            :key="weekIndex"
            class="heatmap-week"
          >
            <div
              v-for="(day, dayIndex) in week"
              :key="dayIndex"
              class="heatmap-cell"
              :class="getCellClass(day)"
              :title="day ? formatTooltip(day) : ''"
              @click.stop="day && !day.isFuture && $emit('toggle', day.date)"
            ></div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card-footer">
      <span class="streak-badge" v-if="streak.max > 0">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 1L7.5 4.5L11 5L8.5 7.5L9 11L6 9.5L3 11L3.5 7.5L1 5L4.5 4.5L6 1Z" fill="currentColor"/>
        </svg>
        Best: {{ streak.max }} Tage
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
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

defineEmits(['select', 'toggle'])

const colorMap = {
  blue: 'var(--habit-blue)',
  green: 'var(--habit-green)',
  purple: 'var(--habit-purple)',
  orange: 'var(--habit-orange)',
  pink: 'var(--habit-pink)',
  teal: 'var(--habit-teal)',
  red: 'var(--habit-red)',
  yellow: 'var(--habit-yellow)'
}

const habitColor = computed(() => colorMap[props.habit.color] || 'var(--habit-blue)')

const completionRate = computed(() => {
  const last30Days = dateUtils.getLastNDays(30)
  return statsUtils.calculateCompletionRate(props.entries.filter(e => last30Days.includes(e.date)), 30)
})

const months = computed(() => {
  const monthSet = new Set()
  const today = new Date()
  
  for (let i = 0; i < 12; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - (i * 7))
    const month = date.toLocaleDateString('de-DE', { month: 'short' })
    monthSet.add(month)
  }
  
  return Array.from(monthSet).reverse().slice(-3)
})

const heatmapData = computed(() => {
  const weeks = []
  const today = new Date()
  const todayStr = dateUtils.today()
  
  // Get last 12 weeks of data
  for (let w = 11; w >= 0; w--) {
    const week = []
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - (w * 7) - today.getDay() + 1)
    
    for (let d = 0; d < 7; d++) {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + d)
      const dateStr = dateUtils.formatDate(date)
      
      const entry = props.entries.find(e => e.date === dateStr)
      
      week.push({
        date: dateStr,
        completed: entry?.completed || false,
        isToday: dateStr === todayStr,
        isFuture: dateStr > todayStr
      })
    }
    
    weeks.push(week)
  }
  
  return weeks
})

const getCellClass = (day) => {
  if (!day) return ''
  return {
    'is-completed': day.completed,
    'is-today': day.isToday,
    'is-future': day.isFuture
  }
}

const formatTooltip = (day) => {
  const status = day.completed ? '✓ Erledigt' : '○ Nicht erledigt'
  return `${dateUtils.formatDisplay(day.date)} - ${status}`
}
</script>

<style scoped>
.habit-card {
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.habit-card:hover {
  border-color: var(--color-text-muted);
  box-shadow: var(--shadow-md);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-lg);
}

.habit-title {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.habit-icon {
  font-size: var(--font-size-lg);
}

.habit-name {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
}

.habit-stats {
  display: flex;
  gap: var(--space-lg);
}

.stat {
  text-align: right;
}

.stat-value {
  display: block;
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--habit-color);
}

.stat-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Heatmap */
.heatmap {
  margin-bottom: var(--space-md);
}

.heatmap-months {
  display: flex;
  justify-content: space-around;
  margin-bottom: var(--space-xs);
  padding-left: 24px;
}

.heatmap-months span {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.heatmap-grid {
  display: flex;
  gap: var(--space-xs);
}

.heatmap-days {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2px 0;
}

.heatmap-days span {
  font-size: 9px;
  color: var(--color-text-muted);
  line-height: 12px;
}

.heatmap-cells {
  display: flex;
  gap: 3px;
  flex: 1;
}

.heatmap-week {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.heatmap-cell {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: var(--color-bg-mute);
  transition: all var(--transition-fast);
}

.heatmap-cell:hover:not(.is-future) {
  transform: scale(1.2);
}

.heatmap-cell.is-completed {
  background-color: var(--habit-color);
}

.heatmap-cell.is-today {
  box-shadow: 0 0 0 2px var(--color-text-primary);
}

.heatmap-cell.is-future {
  opacity: 0.3;
  cursor: default;
}

/* Footer */
.card-footer {
  display: flex;
  justify-content: flex-end;
}

.streak-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--font-size-xs);
  color: var(--color-warning);
  font-weight: 500;
}
</style>

