import axe from 'axe-core'
import { expect } from 'vitest'

export async function expectNoA11yViolations(container: Element) {
  const results = await axe.run(container, {
    rules: {
      'color-contrast': { enabled: false },
      region: { enabled: false },
    },
  })

  const summary = results.violations.map(
    (violation) =>
      `${violation.id}: ${violation.help} → ${violation.nodes.map((node) => String(node.target)).join(' | ')}`,
  )

  expect(summary).toEqual([])
}