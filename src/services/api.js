const API_BASE = 'https://habit-tracker-backend-v21g.onrender.com/api'

// Helper for API requests
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorData.error || errorMessage
      } catch (e) {
        const errorText = await response.text()
        if (errorText) {
          errorMessage = errorText
        }
      }
      throw new Error(errorMessage)
    }
    
    // Handle empty responses
    const text = await response.text()
    return text ? JSON.parse(text) : null
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error)
    // Re-throw with more context
    if (error.message) {
      throw error
    }
    throw new Error(`Network error: ${error.message || 'Could not connect to server'}`)
  }
}

// Habit API
export const habitApi = {
  // Get all habits
  getAll: () => request('/habits'),
  
  // Get single habit
  getById: (id) => request(`/habits/${id}`),
  
  // Create new habit
  create: (habit) => {
    console.log('Creating habit with data:', habit)
    return request('/habits', {
      method: 'POST',
      body: JSON.stringify(habit)
    })
  },
  
  // Update habit
  update: (id, habit) => request(`/habits/${id}`, {
    method: 'PUT',
    body: JSON.stringify(habit)
  }),
  
  // Delete habit
  delete: (id) => request(`/habits/${id}`, {
    method: 'DELETE'
  })
}

// Habit Entry API
export const entryApi = {
  // Get entries for a habit
  getForHabit: (habitId) => request(`/entries/habit/${habitId}`),
  
  // Get entries for a habit in date range
  getForHabitInRange: (habitId, startDate, endDate) => 
    request(`/entries/habit/${habitId}/range?startDate=${startDate}&endDate=${endDate}`),
  
  // Get entries for a specific date
  getForDate: (date) => request(`/entries/date/${date}`),
  
  // Get entries in date range (all habits)
  getInRange: (startDate, endDate) => 
    request(`/entries/range?startDate=${startDate}&endDate=${endDate}`),
  
  // Toggle entry (check/uncheck)
  toggle: (habitId, date) => request('/entries/toggle', {
    method: 'POST',
    body: JSON.stringify({ habitId, date })
  }),
  
  // Set entry explicitly
  set: (habitId, date, completed) => request('/entries', {
    method: 'POST',
    body: JSON.stringify({ habitId, date, completed })
  }),
  
  // Delete entry
  delete: (id) => request(`/entries/${id}`, {
    method: 'DELETE'
  })
}

// Date utilities
export const dateUtils = {
  // Format date as YYYY-MM-DD
  formatDate: (date) => {
    const d = new Date(date)
    return d.toISOString().split('T')[0]
  },
  
  // Get today's date as YYYY-MM-DD
  today: () => {
    return new Date().toISOString().split('T')[0]
  },
  
  // Get start of week (Monday)
  getWeekStart: (date = new Date()) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    d.setDate(diff)
    return dateUtils.formatDate(d)
  },
  
  // Get end of week (Sunday)
  getWeekEnd: (date = new Date()) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() + (day === 0 ? 0 : 7 - day)
    d.setDate(diff)
    return dateUtils.formatDate(d)
  },
  
  // Get start of month
  getMonthStart: (date = new Date()) => {
    const d = new Date(date)
    d.setDate(1)
    return dateUtils.formatDate(d)
  },
  
  // Get end of month
  getMonthEnd: (date = new Date()) => {
    const d = new Date(date)
    d.setMonth(d.getMonth() + 1)
    d.setDate(0)
    return dateUtils.formatDate(d)
  },
  
  // Get array of dates between start and end
  getDateRange: (startDate, endDate) => {
    const dates = []
    const current = new Date(startDate)
    const end = new Date(endDate)
    
    while (current <= end) {
      dates.push(dateUtils.formatDate(current))
      current.setDate(current.getDate() + 1)
    }
    
    return dates
  },
  
  // Get week days starting from a date
  getWeekDays: (startDate) => {
    return dateUtils.getDateRange(startDate, (() => {
      const d = new Date(startDate)
      d.setDate(d.getDate() + 6)
      return dateUtils.formatDate(d)
    })())
  },
  
  // Get last N days
  getLastNDays: (n) => {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - n + 1)
    return dateUtils.getDateRange(dateUtils.formatDate(start), dateUtils.formatDate(end))
  },
  
  // Format date for display
  formatDisplay: (dateStr, options = {}) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('de-DE', {
      weekday: options.weekday || undefined,
      day: 'numeric',
      month: options.month || 'short',
      year: options.year || undefined
    })
  },
  
  // Get day name
  getDayName: (dateStr, short = true) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('de-DE', { weekday: short ? 'short' : 'long' })
  },
  
  // Check if date is today
  isToday: (dateStr) => {
    return dateStr === dateUtils.today()
  },
  
  // Check if date is in the past
  isPast: (dateStr) => {
    return dateStr < dateUtils.today()
  },
  
  // Check if date is in the future
  isFuture: (dateStr) => {
    return dateStr > dateUtils.today()
  }
}

// Statistics utilities
export const statsUtils = {
  // Calculate streak for a habit
  calculateStreak: (entries, today = dateUtils.today()) => {
    if (!entries || entries.length === 0) return { current: 0, max: 0 }
    
    // Sort entries by date descending
    const sortedEntries = [...entries]
      .filter(e => e.completed)
      .sort((a, b) => b.date.localeCompare(a.date))
    
    if (sortedEntries.length === 0) return { current: 0, max: 0 }
    
    // Calculate current streak
    let currentStreak = 0
    let checkDate = today
    
    // Check if today or yesterday has an entry
    const todayEntry = sortedEntries.find(e => e.date === today)
    const yesterday = (() => {
      const d = new Date(today)
      d.setDate(d.getDate() - 1)
      return dateUtils.formatDate(d)
    })()
    const yesterdayEntry = sortedEntries.find(e => e.date === yesterday)
    
    if (!todayEntry && !yesterdayEntry) {
      currentStreak = 0
    } else {
      checkDate = todayEntry ? today : yesterday
      
      for (const entry of sortedEntries) {
        if (entry.date === checkDate) {
          currentStreak++
          const d = new Date(checkDate)
          d.setDate(d.getDate() - 1)
          checkDate = dateUtils.formatDate(d)
        } else if (entry.date < checkDate) {
          break
        }
      }
    }
    
    // Calculate max streak
    let maxStreak = 0
    let tempStreak = 0
    let prevDate = null
    
    for (const entry of sortedEntries.sort((a, b) => a.date.localeCompare(b.date))) {
      if (!prevDate) {
        tempStreak = 1
      } else {
        const prev = new Date(prevDate)
        prev.setDate(prev.getDate() + 1)
        const expectedDate = dateUtils.formatDate(prev)
        
        if (entry.date === expectedDate) {
          tempStreak++
        } else {
          maxStreak = Math.max(maxStreak, tempStreak)
          tempStreak = 1
        }
      }
      prevDate = entry.date
    }
    maxStreak = Math.max(maxStreak, tempStreak)
    
    return { current: currentStreak, max: maxStreak }
  },
  
  // Calculate completion rate
  calculateCompletionRate: (entries, totalDays) => {
    if (!entries || totalDays === 0) return 0
    const completedCount = entries.filter(e => e.completed).length
    return Math.round((completedCount / totalDays) * 100)
  }
}

