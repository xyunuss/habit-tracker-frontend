import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WeekNavigation from '../WeekNavigation.vue'

describe('WeekNavigation', () => {
  const defaultProps = {
    currentDate: new Date().toISOString().split('T')[0]
  }

  it('renders 7 day buttons', () => {
    const wrapper = mount(WeekNavigation, { props: defaultProps })
    const dayButtons = wrapper.findAll('.day-btn')
    expect(dayButtons.length).toBe(7)
  })

  it('renders navigation buttons', () => {
    const wrapper = mount(WeekNavigation, { props: defaultProps })
    const navButtons = wrapper.findAll('.nav-btn')
    expect(navButtons.length).toBe(2) // Previous and Next
  })

  it('highlights today', () => {
    const wrapper = mount(WeekNavigation, { props: defaultProps })
    const todayButton = wrapper.find('.day-btn.is-today')
    expect(todayButton.exists()).toBe(true)
  })

  it('emits navigate event when a day is clicked', async () => {
    const wrapper = mount(WeekNavigation, { props: defaultProps })
    const dayButtons = wrapper.findAll('.day-btn')
    
    // Click on a non-future day
    const pastDay = dayButtons.find(btn => !btn.classes().includes('is-future'))
    if (pastDay) {
      await pastDay.trigger('click')
      expect(wrapper.emitted('navigate')).toBeTruthy()
    }
  })

  it('shows day names', () => {
    const wrapper = mount(WeekNavigation, { props: defaultProps })
    const dayNames = wrapper.findAll('.day-name')
    expect(dayNames.length).toBe(7)
  })

  it('shows day numbers', () => {
    const wrapper = mount(WeekNavigation, { props: defaultProps })
    const dayNumbers = wrapper.findAll('.day-number')
    expect(dayNumbers.length).toBe(7)
  })

  it('navigates to previous week when previous button is clicked', async () => {
    const wrapper = mount(WeekNavigation, { props: defaultProps })
    const prevButton = wrapper.findAll('.nav-btn').at(0)
    
    // Get current first day number
    const firstDayBefore = wrapper.findAll('.day-number').at(0).text()
    
    await prevButton.trigger('click')
    
    // Day numbers should change after navigation
    const firstDayAfter = wrapper.findAll('.day-number').at(0).text()
    expect(firstDayAfter).not.toBe(firstDayBefore)
  })

  it('shows today button when not in current week', async () => {
    const wrapper = mount(WeekNavigation, { props: defaultProps })
    
    // Initially no today button
    expect(wrapper.find('.today-btn').exists()).toBe(false)
    
    // Navigate to previous week
    const prevButton = wrapper.findAll('.nav-btn').at(0)
    await prevButton.trigger('click')
    
    // Now today button should appear
    expect(wrapper.find('.today-btn').exists()).toBe(true)
  })
})

