# Claude Code Rules — Client Portal 2.0

## Styling & Components

**Always use existing project components and styles.**
When given a reference image, use it only as a reference for content and layout — never copy styling from the image. All UI must be implemented using the existing components (`components/ui/`, `components/common/`) and SCSS variables from `frontend/src/style.scss`. Do not introduce inline styles, new CSS frameworks, or non-standard variants unless explicitly instructed.

## Accessibility (WCAG AA)

**All UI must comply with WCAG 2.1 Level AA.** Apply these rules to everything built for this project:

- **Text contrast**: Normal text (under 18pt/24px regular, or 14pt/18.67px bold) requires a minimum **4.5:1** contrast ratio against its background. Large text requires **3:1**. Never use `$color-neutral-disabled` (#767676) or lighter for body/label text on white without checking contrast.
- **Font sizes**: Do not go below `$font-size-small` (0.875rem / 14px) for any visible text. Prefer `$font-size-body` (1rem / 16px) for primary reading content.
- **Interactive elements**: Buttons, links, and form controls must have visible focus states and meet the 3:1 contrast requirement for their boundaries/states.
- **Color alone**: Never convey meaning (status, error, selection) using color alone — always pair with an icon, label, or other visual indicator.
- **Images and icons**: Decorative icons need no alt text; functional icons (used as buttons or conveying information) must have a tooltip or aria-label.
