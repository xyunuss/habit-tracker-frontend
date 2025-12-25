<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal animate-scale-in">
        <div class="modal-header">
          <h2 class="modal-title">{{ isEditing ? 'Gewohnheit bearbeiten' : 'Neue Gewohnheit' }}</h2>
          <button class="close-btn" @click="$emit('close')" aria-label="Schließen">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="handleSubmit" class="modal-form">
          <!-- Name -->
          <div class="form-group">
            <label class="form-label">Name *</label>
            <input 
              type="text" 
              class="input"
              v-model="form.name"
              placeholder="z.B. Meditation, Sport, Lesen..."
              required
              autofocus
            />
          </div>
          
          <!-- Description -->
          <div class="form-group">
            <label class="form-label">Beschreibung (optional)</label>
            <input 
              type="text" 
              class="input"
              v-model="form.description"
              placeholder="Kurze Beschreibung..."
            />
          </div>
          
          <!-- Type -->
          <div class="form-group">
            <label class="form-label">Typ</label>
            <div class="type-options">
              <label class="type-option" :class="{ 'is-selected': form.type === 'DAILY' }">
                <input type="radio" v-model="form.type" value="DAILY" />
                <span class="type-icon">📅</span>
                <span class="type-label">Täglich</span>
              </label>
              <label class="type-option" :class="{ 'is-selected': form.type === 'WEEKLY' }">
                <input type="radio" v-model="form.type" value="WEEKLY" />
                <span class="type-icon">📊</span>
                <span class="type-label">X-mal pro Woche</span>
              </label>
            </div>
          </div>
          
          <!-- Target per week (only if WEEKLY) -->
          <div class="form-group" v-if="form.type === 'WEEKLY'">
            <label class="form-label">Ziel pro Woche</label>
            <div class="target-selector">
              <button 
                v-for="n in 7" 
                :key="n"
                type="button"
                class="target-btn"
                :class="{ 'is-selected': form.targetPerWeek === n }"
                @click="form.targetPerWeek = n"
              >
                {{ n }}x
              </button>
            </div>
          </div>
          
          <!-- Icon -->
          <div class="form-group">
            <label class="form-label">Icon (optional)</label>
            <div class="icon-selector">
              <button 
                v-for="icon in icons" 
                :key="icon"
                type="button"
                class="icon-btn"
                :class="{ 'is-selected': form.icon === icon }"
                @click="form.icon = icon"
              >
                {{ icon }}
              </button>
            </div>
          </div>
          
          <!-- Color -->
          <div class="form-group">
            <label class="form-label">Farbe</label>
            <div class="color-selector">
              <button 
                v-for="color in colors" 
                :key="color.value"
                type="button"
                class="color-btn"
                :class="{ 'is-selected': form.color === color.value }"
                :style="{ backgroundColor: color.hex }"
                @click="form.color = color.value"
                :aria-label="color.label"
              ></button>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="$emit('close')">
              Abbrechen
            </button>
            <button type="submit" class="btn btn-primary">
              {{ isEditing ? 'Speichern' : 'Erstellen' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  habit: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['save', 'close'])

const icons = ['💪', '📚', '🧘', '🏃', '💧', '🎯', '✍️', '🎨', '🎵', '💤', '🥗', '💊', '🧹', '📱', '💻', '🌿']

const colors = [
  { value: 'blue', hex: '#3B82F6', label: 'Blau' },
  { value: 'green', hex: '#10B981', label: 'Grün' },
  { value: 'purple', hex: '#8B5CF6', label: 'Lila' },
  { value: 'orange', hex: '#F97316', label: 'Orange' },
  { value: 'pink', hex: '#EC4899', label: 'Pink' },
  { value: 'teal', hex: '#14B8A6', label: 'Türkis' },
  { value: 'red', hex: '#EF4444', label: 'Rot' },
  { value: 'yellow', hex: '#EAB308', label: 'Gelb' }
]

const form = ref({
  name: '',
  description: '',
  type: 'DAILY',
  targetPerWeek: 3,
  icon: '',
  color: 'blue'
})

const isEditing = computed(() => !!props.habit?.id)

// Initialize form when editing
watch(() => props.habit, (newHabit) => {
  if (newHabit) {
    form.value = {
      id: newHabit.id,
      name: newHabit.name || '',
      description: newHabit.description || '',
      type: newHabit.type || 'DAILY',
      targetPerWeek: newHabit.targetPerWeek || 3,
      icon: newHabit.icon || '',
      color: newHabit.color || 'blue'
    }
  }
}, { immediate: true })

const handleSubmit = () => {
  if (!form.value.name.trim()) {
    alert('Bitte gib einen Namen für die Gewohnheit ein.')
    return
  }
  
  const habitData = {
    name: form.value.name.trim(),
    description: form.value.description?.trim() || null,
    type: form.value.type,
    targetPerWeek: form.value.type === 'WEEKLY' ? form.value.targetPerWeek : null,
    icon: form.value.icon || null,
    color: form.value.color || 'blue'
  }
  
  // Only include id if editing
  if (isEditing.value && form.value.id) {
    habitData.id = form.value.id
  }
  
  emit('save', habitData)
}

// Close on escape
onMounted(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      emit('close')
    }
  }
  window.addEventListener('keydown', handleEscape)
  return () => window.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal {
  background-color: var(--color-bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg);
  border-bottom: 1px solid var(--color-border);
}

.modal-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-text-primary);
}

.close-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  transition: all var(--transition-fast);
}

.close-btn:hover {
  background-color: var(--color-bg-soft);
  color: var(--color-text-primary);
}

.modal-form {
  padding: var(--space-lg);
}

.form-group {
  margin-bottom: var(--space-lg);
}

.form-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-sm);
}

/* Type Options */
.type-options {
  display: flex;
  gap: var(--space-sm);
}

.type-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.type-option input {
  display: none;
}

.type-option:hover {
  border-color: var(--color-text-muted);
}

.type-option.is-selected {
  border-color: var(--color-text-primary);
  background-color: var(--color-bg-soft);
}

.type-icon {
  font-size: 1.5rem;
}

.type-label {
  font-size: var(--font-size-sm);
  font-weight: 500;
}

/* Target Selector */
.target-selector {
  display: flex;
  gap: var(--space-xs);
}

.target-btn {
  flex: 1;
  padding: var(--space-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-weight: 500;
  transition: all var(--transition-fast);
}

.target-btn:hover {
  border-color: var(--color-text-muted);
}

.target-btn.is-selected {
  background-color: var(--color-text-primary);
  border-color: var(--color-text-primary);
  color: white;
}

/* Icon Selector */
.icon-selector {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.icon-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.icon-btn:hover {
  border-color: var(--color-text-muted);
  transform: scale(1.1);
}

.icon-btn.is-selected {
  border-color: var(--color-text-primary);
  background-color: var(--color-bg-soft);
  transform: scale(1.1);
}

/* Color Selector */
.color-selector {
  display: flex;
  gap: var(--space-sm);
}

.color-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  border: 2px solid transparent;
  transition: all var(--transition-fast);
}

.color-btn:hover {
  transform: scale(1.15);
}

.color-btn.is-selected {
  border-color: var(--color-text-primary);
  transform: scale(1.15);
  box-shadow: 0 0 0 2px var(--color-bg-card);
}

/* Actions */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
  margin-top: var(--space-xl);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--color-border);
}
</style>

