<template>
  <div id="app" class="app-container">
    <!-- Header -->
    <header class="app-header">
      <div class="header-content">
        <div class="header-left">
          <div class="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="currentColor"/>
              <path d="M9 16L14 21L23 11" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h1 class="app-title">Habit Tracker</h1>
        </div>
        <div class="header-center">
          <WeekNavigation
            :currentDate="currentDate"
            @navigate="handleDateNavigation"
          />
        </div>
        <div class="header-right">
          <span class="today-label">{{ formattedToday }}</span>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="app-main">
      <!-- Left Sidebar: Habit List -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2 class="sidebar-title">Meine Gewohnheiten</h2>
          <button class="btn btn-primary btn-sm" @click="openNewHabitModal">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Neu
          </button>
        </div>

        <div class="habit-list" v-if="habits.length > 0">
          <HabitListItem
            v-for="habit in habits"
            :key="habit.id"
            :habit="habit"
            :isCheckedToday="isHabitCheckedToday(habit.id)"
            :streak="getStreak(habit.id)"
            :isSelected="selectedHabit?.id === habit.id"
            @toggle="toggleHabitToday(habit.id)"
            @select="selectHabit(habit)"
            @edit="openEditHabitModal(habit)"
            @delete="confirmDeleteHabit(habit)"
          />
        </div>

        <div class="empty-state" v-else>
          <div class="empty-icon">📝</div>
          <p class="empty-text">Noch keine Gewohnheiten</p>
          <p class="empty-subtext">Erstelle deine erste Gewohnheit um loszulegen</p>
        </div>
      </aside>

      <!-- Right Content: Progress View -->
      <section class="content">
        <div v-if="selectedHabit" class="progress-view">
          <HabitDetail
            :habit="selectedHabit"
            :entries="selectedHabitEntries"
            :streak="getStreak(selectedHabit.id)"
            @edit="openEditHabitModal(selectedHabit)"
          />
        </div>

        <div v-else class="progress-overview">
          <h2 class="section-title">Übersicht</h2>
          <div class="habits-grid">
            <HabitCard
              v-for="habit in habits"
              :key="habit.id"
              :habit="habit"
              :entries="getEntriesForHabit(habit.id)"
              :streak="getStreak(habit.id)"
              @select="selectHabit(habit)"
              @toggle="toggleHabit(habit.id, $event)"
            />
          </div>

          <div class="empty-overview" v-if="habits.length === 0">
            <div class="empty-overview-icon">🎯</div>
            <h3>Willkommen beim Habit Tracker</h3>
            <p>Beginne damit, deine erste Gewohnheit zu erstellen und verfolge deinen Fortschritt.</p>
            <button class="btn btn-primary" @click="openNewHabitModal">
              Erste Gewohnheit erstellen
            </button>
          </div>
        </div>
      </section>
    </main>

    <!-- Habit Modal -->
    <HabitModal
      v-if="showHabitModal"
      :habit="editingHabit"
      @save="saveHabit"
      @close="closeHabitModal"
    />

    <!-- Delete Confirmation -->
    <ConfirmDialog
      v-if="showDeleteConfirm"
      title="Gewohnheit löschen"
      :message="`Möchtest du '${deletingHabit?.name}' wirklich löschen? Alle Einträge werden ebenfalls gelöscht.`"
      confirmText="Löschen"
      cancelText="Abbrechen"
      @confirm="deleteHabit"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { habitApi, entryApi, dateUtils, statsUtils } from './services/api.js'
import WeekNavigation from './components/WeekNavigation.vue'
import HabitListItem from './components/HabitListItem.vue'
import HabitCard from './components/HabitCard.vue'
import HabitDetail from './components/HabitDetail.vue'
import HabitModal from './components/HabitModal.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'

// State
const habits = ref([])
const entries = ref([])
const selectedHabit = ref(null)
const currentDate = ref(dateUtils.today())
const loading = ref(false)

// Modal state
const showHabitModal = ref(false)
const editingHabit = ref(null)
const showDeleteConfirm = ref(false)
const deletingHabit = ref(null)

// Computed
const formattedToday = computed(() => {
  const today = new Date()
  return today.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})

const selectedHabitEntries = computed(() => {
  if (!selectedHabit.value) return []
  return entries.value.filter(e => e.habitId === selectedHabit.value.id)
})

// Methods
const loadData = async () => {
  loading.value = true
  try {
    // Load habits
    habits.value = await habitApi.getAll()

    // Load entries for last 90 days
    const startDate = (() => {
      const d = new Date()
      d.setDate(d.getDate() - 90)
      return dateUtils.formatDate(d)
    })()
    const endDate = dateUtils.today()

    entries.value = await entryApi.getInRange(startDate, endDate)
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    loading.value = false
  }
}

const getEntriesForHabit = (habitId) => {
  return entries.value.filter(e => e.habitId === habitId)
}

const isHabitCheckedToday = (habitId) => {
  const today = dateUtils.today()
  return entries.value.some(e => e.habitId === habitId && e.date === today && e.completed)
}

const getStreak = (habitId) => {
  const habitEntries = getEntriesForHabit(habitId)
  return statsUtils.calculateStreak(habitEntries)
}

const toggleHabitToday = async (habitId) => {
  const today = dateUtils.today()
  await toggleHabit(habitId, today)
}

const toggleHabit = async (habitId, date) => {
  try {
    const result = await entryApi.toggle(habitId, date)

    // Update local state
    const existingIndex = entries.value.findIndex(
      e => e.habitId === habitId && e.date === date
    )

    if (existingIndex >= 0) {
      entries.value[existingIndex] = result
    } else {
      entries.value.push(result)
    }
  } catch (error) {
    console.error('Error toggling habit:', error)
  }
}

const selectHabit = (habit) => {
  selectedHabit.value = selectedHabit.value?.id === habit.id ? null : habit
}

const handleDateNavigation = (newDate) => {
  currentDate.value = newDate
}

// Modal handlers
const openNewHabitModal = () => {
  editingHabit.value = null
  showHabitModal.value = true
}

const openEditHabitModal = (habit) => {
  editingHabit.value = { ...habit }
  showHabitModal.value = true
}

const closeHabitModal = () => {
  showHabitModal.value = false
  editingHabit.value = null
}

const saveHabit = async (habitData) => {
  try {
    if (habitData.id) {
      // Update existing habit
      const { id, ...updateData } = habitData
      const updated = await habitApi.update(id, updateData)
      const index = habits.value.findIndex(h => h.id === id)
      if (index >= 0) {
        habits.value[index] = updated
      }
      if (selectedHabit.value?.id === id) {
        selectedHabit.value = updated
      }
    } else {
      // Create new habit - remove id if present
      const createData = { ...habitData }
      delete createData.id
      const created = await habitApi.create(createData)
      habits.value.push(created)
    }
    closeHabitModal()
  } catch (error) {
    console.error('Error saving habit:', error)
    alert(`Fehler beim Speichern: ${error.message || 'Unbekannter Fehler'}`)
  }
}

const confirmDeleteHabit = (habit) => {
  deletingHabit.value = habit
  showDeleteConfirm.value = true
}

const deleteHabit = async () => {
  if (!deletingHabit.value) return

  try {
    await habitApi.delete(deletingHabit.value.id)
    habits.value = habits.value.filter(h => h.id !== deletingHabit.value.id)
    entries.value = entries.value.filter(e => e.habitId !== deletingHabit.value.id)

    if (selectedHabit.value?.id === deletingHabit.value.id) {
      selectedHabit.value = null
    }
  } catch (error) {
    console.error('Error deleting habit:', error)
  } finally {
    showDeleteConfirm.value = false
    deletingHabit.value = null
  }
}

// Lifecycle
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg);
}

/* Header */
.app-header {
  background-color: var(--color-bg-card);
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-md) var(--space-xl);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xl);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.logo {
  color: var(--color-text-primary);
}

.app-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-text-primary);
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.header-right {
  display: flex;
  align-items: center;
}

.today-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

/* Main */
.app-main {
  flex: 1;
  display: flex;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
  padding: var(--space-xl);
  gap: var(--space-xl);
}

/* Sidebar */
.sidebar {
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--color-border);
}

.sidebar-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
}

.btn-sm {
  padding: var(--space-xs) var(--space-sm);
  font-size: var(--font-size-sm);
}

.habit-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: var(--space-2xl) var(--space-lg);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: var(--space-md);
}

.empty-text {
  font-size: var(--font-size-lg);
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: var(--space-xs);
}

.empty-subtext {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

/* Content */
.content {
  flex: 1;
  min-width: 0;
}

.progress-view,
.progress-overview {
  animation: fadeIn var(--transition-base) ease-out;
}

.section-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--space-lg);
}

.habits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: var(--space-lg);
}

/* Empty Overview */
.empty-overview {
  text-align: center;
  padding: var(--space-2xl);
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.empty-overview-icon {
  font-size: 4rem;
  margin-bottom: var(--space-lg);
}

.empty-overview h3 {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--space-sm);
}

.empty-overview p {
  color: var(--color-text-secondary);
  margin-bottom: var(--space-xl);
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

/* Responsive */
@media (max-width: 1024px) {
  .app-main {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }

  .habits-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-wrap: wrap;
  }

  .header-center {
    order: 3;
    width: 100%;
    margin-top: var(--space-sm);
  }

  .today-label {
    display: none;
  }
}
</style>
