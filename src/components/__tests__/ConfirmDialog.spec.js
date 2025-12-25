import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ConfirmDialog from '../ConfirmDialog.vue'

describe('ConfirmDialog', () => {
  const defaultProps = {
    title: 'Löschen bestätigen',
    message: 'Bist du sicher?',
    confirmText: 'Löschen',
    cancelText: 'Abbrechen'
  }

  it('renders title correctly', () => {
    const wrapper = mount(ConfirmDialog, { 
      props: defaultProps,
      global: {
        stubs: {
          teleport: true
        }
      }
    })
    expect(wrapper.text()).toContain('Löschen bestätigen')
  })

  it('renders message correctly', () => {
    const wrapper = mount(ConfirmDialog, { 
      props: defaultProps,
      global: {
        stubs: {
          teleport: true
        }
      }
    })
    expect(wrapper.text()).toContain('Bist du sicher?')
  })

  it('renders confirm button text correctly', () => {
    const wrapper = mount(ConfirmDialog, { 
      props: defaultProps,
      global: {
        stubs: {
          teleport: true
        }
      }
    })
    expect(wrapper.text()).toContain('Löschen')
  })

  it('renders cancel button text correctly', () => {
    const wrapper = mount(ConfirmDialog, { 
      props: defaultProps,
      global: {
        stubs: {
          teleport: true
        }
      }
    })
    expect(wrapper.text()).toContain('Abbrechen')
  })

  it('emits confirm event when confirm button is clicked', async () => {
    const wrapper = mount(ConfirmDialog, { 
      props: defaultProps,
      global: {
        stubs: {
          teleport: true
        }
      }
    })
    const confirmBtn = wrapper.find('.btn-danger')
    await confirmBtn.trigger('click')
    expect(wrapper.emitted('confirm')).toBeTruthy()
  })

  it('emits cancel event when cancel button is clicked', async () => {
    const wrapper = mount(ConfirmDialog, { 
      props: defaultProps,
      global: {
        stubs: {
          teleport: true
        }
      }
    })
    const cancelBtn = wrapper.find('.btn-secondary')
    await cancelBtn.trigger('click')
    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('emits cancel event when overlay is clicked', async () => {
    const wrapper = mount(ConfirmDialog, { 
      props: defaultProps,
      global: {
        stubs: {
          teleport: true
        }
      }
    })
    await wrapper.find('.dialog-overlay').trigger('click')
    expect(wrapper.emitted('cancel')).toBeTruthy()
  })
})

