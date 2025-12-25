import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HabitModal from '../HabitModal.vue'

describe('HabitModal', () => {
  const defaultProps = {
    habit: null
  }

  it('renders modal with "Neue Gewohnheit" title when creating', () => {
    const wrapper = mount(HabitModal, { 
      props: defaultProps,
      global: {
        stubs: {
          teleport: true
        }
      }
    })
    expect(wrapper.text()).toContain('Neue Gewohnheit')
  })

  it('renders modal with "Gewohnheit bearbeiten" title when editing', () => {
    const props = {
      habit: {
        id: 1,
        name: 'Sport',
        color: 'blue',
        type: 'DAILY'
      }
    }
    const wrapper = mount(HabitModal, { 
      props,
      global: {
        stubs: {
          teleport: true
        }
      }
    })
    expect(wrapper.text()).toContain('Gewohnheit bearbeiten')
  })

  it('populates form with habit data when editing', () => {
    const props = {
      habit: {
        id: 1,
        name: 'Sport',
        color: 'blue',
        type: 'DAILY',
        icon: '💪'
      }
    }
    const wrapper = mount(HabitModal, { 
      props,
      global: {
        stubs: {
          teleport: true
        }
      }
    })
    const nameInput = wrapper.find('input[type="text"]')
    expect(nameInput.element.value).toBe('Sport')
  })

  it('emits close event when close button is clicked', async () => {
    const wrapper = mount(HabitModal, { 
      props: defaultProps,
      global: {
        stubs: {
          teleport: true
        }
      }
    })
    await wrapper.find('.close-btn').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits close event when cancel button is clicked', async () => {
    const wrapper = mount(HabitModal, { 
      props: defaultProps,
      global: {
        stubs: {
          teleport: true
        }
      }
    })
    const cancelBtn = wrapper.findAll('button').find(btn => btn.text().includes('Abbrechen'))
    await cancelBtn.trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits save event with form data when form is submitted', async () => {
    const wrapper = mount(HabitModal, { 
      props: defaultProps,
      global: {
        stubs: {
          teleport: true
        }
      }
    })
    
    // Fill in the form
    const nameInput = wrapper.find('input[type="text"]')
    await nameInput.setValue('Neue Gewohnheit')
    
    // Submit form
    await wrapper.find('form').trigger('submit')
    
    expect(wrapper.emitted('save')).toBeTruthy()
    expect(wrapper.emitted('save')[0][0].name).toBe('Neue Gewohnheit')
  })

  it('has color selector with multiple options', () => {
    const wrapper = mount(HabitModal, { 
      props: defaultProps,
      global: {
        stubs: {
          teleport: true
        }
      }
    })
    const colorButtons = wrapper.findAll('.color-btn')
    expect(colorButtons.length).toBeGreaterThan(0)
  })

  it('has icon selector with multiple options', () => {
    const wrapper = mount(HabitModal, { 
      props: defaultProps,
      global: {
        stubs: {
          teleport: true
        }
      }
    })
    const iconButtons = wrapper.findAll('.icon-btn')
    expect(iconButtons.length).toBeGreaterThan(0)
  })

  it('shows target per week selector when type is WEEKLY', async () => {
    const wrapper = mount(HabitModal, { 
      props: defaultProps,
      global: {
        stubs: {
          teleport: true
        }
      }
    })
    
    // Select WEEKLY type by clicking the radio input
    const weeklyRadio = wrapper.find('input[value="WEEKLY"]')
    await weeklyRadio.setValue(true)
    
    expect(wrapper.find('.target-selector').exists()).toBe(true)
  })
})

