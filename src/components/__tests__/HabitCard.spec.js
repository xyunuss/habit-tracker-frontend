import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HabitCard from '../HabitCard.vue'

describe('HabitCard', () => {
  const defaultProps = {
    habit: {
      id: 1,
      name: 'Meditation',
      color: 'purple',
      icon: '🧘'
    },
    entries: [
      { habitId: 1, date: '2024-01-15', completed: true },
      { habitId: 1, date: '2024-01-14', completed: true },
      { habitId: 1, date: '2024-01-13', completed: false }
    ],
    streak: { current: 2, max: 5 }
  }

  it('renders habit name correctly', () => {
    const wrapper = mount(HabitCard, { props: defaultProps })
    expect(wrapper.text()).toContain('Meditation')
  })

  it('renders habit icon when provided', () => {
    const wrapper = mount(HabitCard, { props: defaultProps })
    expect(wrapper.text()).toContain('🧘')
  })

  it('displays current streak', () => {
    const wrapper = mount(HabitCard, { props: defaultProps })
    expect(wrapper.text()).toContain('2')
    expect(wrapper.text()).toContain('Streak')
  })

  it('displays completion rate', () => {
    const wrapper = mount(HabitCard, { props: defaultProps })
    expect(wrapper.text()).toContain('Quote')
  })

  it('displays max streak badge when max > 0', () => {
    const wrapper = mount(HabitCard, { props: defaultProps })
    expect(wrapper.text()).toContain('Best: 5 Tage')
  })

  it('does not display max streak badge when max is 0', () => {
    const props = {
      ...defaultProps,
      streak: { current: 0, max: 0 }
    }
    const wrapper = mount(HabitCard, { props })
    expect(wrapper.text()).not.toContain('Best:')
  })

  it('emits select event when card is clicked', async () => {
    const wrapper = mount(HabitCard, { props: defaultProps })
    await wrapper.find('.habit-card').trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
  })

  it('renders heatmap cells', () => {
    const wrapper = mount(HabitCard, { props: defaultProps })
    const cells = wrapper.findAll('.heatmap-cell')
    expect(cells.length).toBeGreaterThan(0)
  })

  it('applies correct color based on habit color prop', () => {
    const wrapper = mount(HabitCard, { props: defaultProps })
    const card = wrapper.find('.habit-card')
    expect(card.attributes('style')).toContain('--habit-color')
  })
})

