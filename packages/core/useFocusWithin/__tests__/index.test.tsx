import React, { useRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/react'
import type { UseFocusWithinOptions } from '../index'
import useFocusWithin from '../index'

function setup(options?: UseFocusWithinOptions) {
  const TestComponent = () => {
    const ref = useRef(null)
    const isFocusWithin = useFocusWithin(ref, options)
    return (
      <div ref={ref}>
        <label>
          First Name
          <input />
        </label>
        <label>
          Last Name
          <input />
        </label>
        <p>
          isFocusWithin:
          {JSON.stringify(isFocusWithin)}
        </p>
      </div>
    )
  }

  return render(<TestComponent />)
}

describe('useFocusWithin', () => {
  it('should call onFocus/onBlur', () => {
    const onFocus = vi.fn()
    const onBlur = vi.fn()
    const result = setup({ onFocus, onBlur })
    fireEvent.focusIn(result.getByLabelText('First Name'))
    expect(onFocus).toBeCalled()
    fireEvent.focusOut(result.getByLabelText('First Name'))
    expect(onBlur).toBeCalled()
  })

  it('should call onChange', () => {
    const onChange = vi.fn()
    const result = setup({ onChange })
    fireEvent.focusIn(result.getByLabelText('First Name'))
    expect(onChange).toBeCalledWith(true)
    fireEvent.focusOut(result.getByLabelText('First Name'))
    expect(onChange).toHaveBeenLastCalledWith(false)
  })
})
