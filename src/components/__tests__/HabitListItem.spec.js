import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HabitListItem from '../HabitListItem.vue'

describe('HabitListItem', () => {
  const defaultProps = {
    habit: {
      id: 1,
      name: 'Sport',
      color: 'blue',
      icon: '💪'
    },
    isCheckedToday: false,
    streak: { current: 5, max: 10 },
    isSelected: false
  }

  it('renders habit name correctly', () => {
    const wrapper = mount(HabitListItem, { props: defaultProps })
    expect(wrapper.text()).toContain('Sport')
  })

  it('renders habit icon when provided', () => {
    const wrapper = mount(HabitListItem, { props: defaultProps })
    expect(wrapper.text()).toContain('💪')
  })

  it('shows streak when current streak is greater than 0', () => {
    const wrapper = mount(HabitListItem, { props: defaultProps })
    expect(wrapper.text()).toContain('5 Tage')
  })

  it('does not show streak when current streak is 0', () => {
    const props = {
      ...defaultProps,
      streak: { current: 0, max: 5 }
    }
    const wrapper = mount(HabitListItem, { props })
    expect(wrapper.text()).not.toContain('Tage')
  })

  it('applies is-checked class when isCheckedToday is true', () => {
    const props = { ...defaultProps, isCheckedToday: true }
    const wrapper = mount(HabitListItem, { props })
    expect(wrapper.find('.check-btn').classes()).toContain('is-checked')
  })

  it('applies is-selected class when isSelected is true', () => {
    const props = { ...defaultProps, isSelected: true }
    const wrapper = mount(HabitListItem, { props })
    expect(wrapper.find('.habit-list-item').classes()).toContain('is-selected')
  })

  it('emits toggle event when check button is clicked', async () => {
    const wrapper = mount(HabitListItem, { props: defaultProps })
    await wrapper.find('.check-btn').trigger('click')
    expect(wrapper.emitted('toggle')).toBeTruthy()
  })

  it('emits select event when item is clicked', async () => {
    const wrapper = mount(HabitListItem, { props: defaultProps })
    await wrapper.find('.habit-list-item').trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
  })

  it('emits edit event when edit button is clicked', async () => {
    const wrapper = mount(HabitListItem, { props: defaultProps })
    await wrapper.find('.action-btn').trigger('click')
    expect(wrapper.emitted('edit')).toBeTruthy()
  })

  it('emits delete event when delete button is clicked', async () => {
    const wrapper = mount(HabitListItem, { props: defaultProps })
    const deleteBtn = wrapper.findAll('.action-btn').at(1)
    await deleteBtn.trigger('click')
    expect(wrapper.emitted('delete')).toBeTruthy()
  })
})

