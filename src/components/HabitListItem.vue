<template>
  <div 
    class="habit-list-item"
    :class="{ 'is-selected': isSelected, 'is-checked': isCheckedToday }"
    @click="$emit('select')"
  >
    <button 
      class="check-btn"
      :class="{ 'is-checked': isCheckedToday }"
      :style="{ '--habit-color': habitColor }"
      @click.stop="$emit('toggle')"
      aria-label="Gewohnheit abhaken"
    >
      <svg v-if="isCheckedToday" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 8L6.5 11.5L13 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    
    <div class="habit-info">
      <div class="habit-header">
        <span class="habit-icon" v-if="habit.icon">{{ habit.icon }}</span>
        <span class="habit-name">{{ habit.name }}</span>
      </div>
      <div class="habit-meta" v-if="streak.current > 0">
        <span class="streak">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1V11M6 1L3 4M6 1L9 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ streak.current }} Tage
        </span>
      </div>
    </div>
    
    <div class="habit-actions">
      <button class="action-btn" @click.stop="$emit('edit')" aria-label="Bearbeiten">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M11.5 2.5L13.5 4.5L5 13H3V11L11.5 2.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button class="action-btn action-btn-delete" @click.stop="$emit('delete')" aria-label="Löschen">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 4H13M5 4V3C5 2.44772 5.44772 2 6 2H10C10.5523 2 11 2.44772 11 3V4M6 7V11M10 7V11M4 4L5 13C5 13.5523 5.44772 14 6 14H10C10.5523 14 11 13.5523 11 13L12 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  habit: {
    type: Object,
    required: true
  },
  isCheckedToday: {
    type: Boolean,
    default: false
  },
  streak: {
    type: Object,
    default: () => ({ current: 0, max: 0 })
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle', 'select', 'edit', 'delete'])

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
</script>

<style scoped>
.habit-list-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.habit-list-item:hover {
  border-color: var(--color-text-muted);
}

.habit-list-item.is-selected {
  border-color: var(--color-text-primary);
  background-color: var(--color-bg-soft);
}

.check-btn {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-sm);
  border: 2px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.check-btn:hover {
  border-color: var(--habit-color);
}

.check-btn.is-checked {
  background-color: var(--habit-color);
  border-color: var(--habit-color);
  color: white;
}

.habit-info {
  flex: 1;
  min-width: 0;
}

.habit-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.habit-icon {
  font-size: var(--font-size-base);
}

.habit-name {
  font-weight: 500;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.habit-meta {
  margin-top: var(--space-xs);
}

.streak {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--font-size-xs);
  color: var(--color-success);
  font-weight: 500;
}

.habit-actions {
  display: flex;
  gap: var(--space-xs);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.habit-list-item:hover .habit-actions {
  opacity: 1;
}

.action-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  transition: all var(--transition-fast);
}

.action-btn:hover {
  background-color: var(--color-bg-mute);
  color: var(--color-text-primary);
}

.action-btn-delete:hover {
  background-color: #FEE2E2;
  color: var(--habit-red);
}
</style>

