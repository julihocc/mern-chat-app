// Simple test to verify setup
import { describe, it, expect } from 'vitest'

describe('Testing Setup', () => {
  it('should run basic tests', () => {
    expect(1 + 1).toBe(2)
  })

  it('should have vitest working', () => {
    const testData = { name: 'test' }
    expect(testData).toEqual({ name: 'test' })
  })
})