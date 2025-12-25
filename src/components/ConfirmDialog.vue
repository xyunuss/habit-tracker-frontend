<template>
  <Teleport to="body">
    <div class="dialog-overlay" @click.self="$emit('cancel')">
      <div class="dialog animate-scale-in">
        <div class="dialog-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        
        <h3 class="dialog-title">{{ title }}</h3>
        <p class="dialog-message">{{ message }}</p>
        
        <div class="dialog-actions">
          <button class="btn btn-secondary" @click="$emit('cancel')">
            {{ cancelText }}
          </button>
          <button class="btn btn-danger" @click="$emit('confirm')">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { onMounted } from 'vue'

defineProps({
  title: {
    type: String,
    default: 'Bestätigung'
  },
  message: {
    type: String,
    default: 'Bist du sicher?'
  },
  confirmText: {
    type: String,
    default: 'Bestätigen'
  },
  cancelText: {
    type: String,
    default: 'Abbrechen'
  }
})

const emit = defineEmits(['confirm', 'cancel'])

// Close on escape
onMounted(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      emit('cancel')
    }
  }
  window.addEventListener('keydown', handleEscape)
  return () => window.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
  z-index: 1001;
  backdrop-filter: blur(4px);
}

.dialog {
  background-color: var(--color-bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 400px;
  padding: var(--space-xl);
  text-align: center;
}

.dialog-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto var(--space-md);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FEE2E2;
  color: var(--habit-red);
  border-radius: var(--radius-full);
}

.dialog-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--space-sm);
}

.dialog-message {
  color: var(--color-text-secondary);
  margin-bottom: var(--space-xl);
}

.dialog-actions {
  display: flex;
  gap: var(--space-sm);
  justify-content: center;
}

.btn-danger {
  background-color: var(--habit-red);
  color: white;
}

.btn-danger:hover {
  background-color: #DC2626;
}
</style>

