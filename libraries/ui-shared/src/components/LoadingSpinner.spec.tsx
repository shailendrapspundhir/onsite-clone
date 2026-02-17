import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default size', () => {
    render(<LoadingSpinner />);
    const el = document.querySelector('[role="status"]');
    expect(el).toBeTruthy();
  });

  it('renders with size sm', () => {
    render(<LoadingSpinner size="sm" />);
    const el = document.querySelector('[role="status"]');
    expect(el?.className).toContain('h-6');
  });

  it('has accessible label', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Loading...')).toBeTruthy();
  });
});
