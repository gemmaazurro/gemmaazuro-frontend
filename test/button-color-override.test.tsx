import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/core/Button';

/**
 * Regression guard for a dark-on-dark hero button.
 *
 * The label lives in its own span stacked above the hover-fill circle. That
 * span used to hardcode the palette foreground, so a `color` passed via
 * `style` reached only the outer element and never the text. On the hero --
 * a dark band on a light-themed page -- the secondary button rendered
 * near-black text on a near-black background, which no type check or build
 * catches.
 */

function label(name: string) {
  // The rendered tree is <a|button style=...><span fill/><span>{label}</span></a>.
  return screen.getByText(name);
}

describe('Button colour overrides', () => {
  it('lets a style colour override reach the label, not just the outer element', () => {
    render(
      <Button variant="secondary" style={{ color: '#fff' }}>
        Customize a Piece
      </Button>
    );
    // The computed colour is what decides contrast, so assert that rather than
    // the literal `inherit` keyword.
    expect(label('Customize a Piece')).toHaveStyle({ color: 'rgb(255, 255, 255)' });
    expect(label('Customize a Piece').closest('button')).toHaveStyle({ color: '#fff' });
  });

  it('keeps the override after a hover round-trip', () => {
    render(
      <Button variant="secondary" style={{ color: '#fff' }}>
        Customize a Piece
      </Button>
    );
    const el = label('Customize a Piece').closest('button')!;
    fireEvent.mouseEnter(el);
    fireEvent.mouseLeave(el);
    // Previously mouseLeave reset the label to the palette colour, so the
    // override survived until the first hover and then silently died.
    expect(label('Customize a Piece')).toHaveStyle({ color: 'rgb(255, 255, 255)' });
  });

  it('still falls back to the palette colour with no override', () => {
    render(<Button variant="secondary">Our Story</Button>);
    expect(label('Our Story').closest('button')).toHaveStyle({
      color: 'var(--color-foreground)',
    });
  });
});
