import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Button from '../../components/Button'

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('applies variant styles', () => {
    const { container } = render(<Button variant="danger">Delete</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('bg-red-600')
  })

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByText('Disabled')
    expect(button).toBeDisabled()
  })
})



