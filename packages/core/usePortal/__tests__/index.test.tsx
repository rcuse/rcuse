import React from 'react';
import { render, renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePortal } from '../index';

describe('usePortal', () => {
  it('should be defined', () => {
    expect(usePortal).toBeDefined();
  });

  it('should create a portal div element and render children into it', async () => {
    const { result } = renderHook(() => usePortal());
    const { Portal, container } = result.current;

    document.body.appendChild(container);

    const { getByTestId } = render(
      <Portal>
        <div data-testid="portal-content">Portal Content</div>
      </Portal>
    )

    expect(getByTestId('portal-content')).toBeInTheDocument();
  });
});
