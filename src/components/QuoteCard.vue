<template>
  <div class="quote-card" v-if="quote">
    <div class="quote-icon">💡</div>
    <blockquote class="quote-text">
      "{{ quote.text }}"
    </blockquote>
    <cite class="quote-author">— {{ quote.author }}</cite>
  </div>
  <div class="quote-card quote-loading" v-else-if="loading">
    <div class="quote-icon">💡</div>
    <p class="quote-placeholder">Lädt Zitat...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { quoteApi } from '../services/api.js'

const quote = ref(null)
const loading = ref(true)

const loadQuote = async () => {
  loading.value = true
  try {
    quote.value = await quoteApi.getRandom()
  } catch (error) {
    console.error('Error loading quote:', error)
    // Fallback quote if API fails
    quote.value = {
      text: "Der beste Zeitpunkt, einen Baum zu pflanzen, war vor zwanzig Jahren. Der zweitbeste Zeitpunkt ist jetzt.",
      author: "Chinesisches Sprichwort"
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadQuote()
})
</script>

<style scoped>
.quote-card {
  background: linear-gradient(135deg, var(--color-bg-soft) 0%, var(--color-bg-mute) 100%);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-sm);
  animation: fadeIn var(--transition-base) ease-out;
}

.quote-icon {
  font-size: 1.5rem;
  opacity: 0.8;
}

.quote-text {
  font-size: var(--font-size-base);
  font-style: italic;
  color: var(--color-text-primary);
  line-height: 1.6;
  margin: 0;
  max-width: 100%;
}

.quote-author {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-style: normal;
}

.quote-loading {
  opacity: 0.7;
}

.quote-placeholder {
  color: var(--color-text-muted);
  font-style: italic;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
