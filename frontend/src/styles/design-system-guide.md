# Premium Design System Guide

## Overview

This sophisticated design system provides a comprehensive set of visual elements, components, and guidelines for creating premium, modern interfaces with glass-morphism, neumorphism, and advanced visual effects.

## Color System

### Primary Palette
- **Primary**: `hsl(231 98% 65%)` - Vibrant blue for main actions
- **Primary Light**: `hsl(231 98% 75%)` - Lighter variant for hover states
- **Primary Dark**: `hsl(231 98% 55%)` - Darker variant for depth
- **Secondary Accent**: `hsl(266 85% 58%)` - Purple accent for variety

### Usage Examples
```tsx
// CSS classes
className="text-primary bg-primary-light border-primary-dark"

// CSS variables
color: hsl(var(--primary))
background: hsl(var(--primary-light))
```

## Typography

### Font Stack
- **Display**: Manrope (headings and emphasis)
- **Body**: Inter (general text)
- **Monospace**: JetBrains Mono (code and data)

### Responsive Typography
```css
h1: text-4xl lg:text-5xl xl:text-6xl (36px → 48px → 64px)
h2: text-3xl lg:text-4xl (30px → 36px)
h3: text-2xl lg:text-3xl (24px → 30px)
```

## Component Variants

### Button Variants

#### Premium (`variant="premium"`)
Gradient background with subtle glow and scale effects
```tsx
<Button variant="premium" size="lg">Premium Action</Button>
```

#### Glass (`variant="glass"`)
Translucent with backdrop blur for overlay contexts
```tsx
<Button variant="glass" size="default">Glass Button</Button>
```

#### Gradient (`variant="gradient"`)
Animated gradient with smooth color transitions
```tsx
<Button variant="gradient" size="xl">Gradient Action</Button>
```

#### Glow (`variant="glow"`)
Subtle glow effect with dynamic shadow
```tsx
<Button variant="glow" size="lg">Glow Button</Button>
```

#### Neumorphic (`variant="neumorphic"`)
Soft, inset/outset shadow effect
```tsx
<Button variant="neumorphic" size="default">Neumorphic</Button>
```

#### Aurora (`variant="aurora"`)
Animated gradient background with continuous color shift
```tsx
<Button variant="aurora" size="lg">Aurora Effect</Button>
```

### Card Variants

#### Premium (`variant="premium"`)
Elevated card with subtle backdrop blur and hover animations
```tsx
<Card variant="premium">
  <CardHeader>
    <CardTitle>Premium Card</CardTitle>
  </CardHeader>
</Card>
```

#### Glass (`variant="glass"`)
Fully translucent card with strong backdrop blur
```tsx
<Card variant="glass">
  <CardContent>Glass morphism effect</CardContent>
</Card>
```

#### Neumorphic (`variant="neumorphic"`)
Soft shadows that create depth through light/shadow contrast
```tsx
<Card variant="neumorphic">
  <CardContent>Neumorphic design</CardContent>
</Card>
```

## Advanced Effects

### Gradient Classes

#### `.gradient-primary`
Primary brand gradient (blue to purple)
```css
background: linear-gradient(135deg, primary → secondary-accent)
```

#### `.gradient-mesh`
Multi-layered radial gradients creating organic patterns
```css
background: multiple radial-gradients with varying opacity
```

#### `.gradient-aurora`
Animated gradient with 15s continuous animation
```css
background: 400% gradient with animation
```

### Glass Morphism
```css
.card-glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

### Neumorphism
```css
.card-neumorphic {
  box-shadow: 
    8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.8);
}
```

## Animations

### Micro-interactions
- **Scale on hover**: `hover:scale-105`
- **Lift on hover**: `hover:-translate-y-1`
- **Glow on hover**: `hover:shadow-glow`

### Entrance Animations
- **Fade in**: `animate-fade-in`
- **Scale in**: `animate-scale-in`
- **Slide in**: `animate-slide-in-right`
- **Bounce in**: `animate-bounce-in`

### Continuous Animations
- **Float**: `animate-float`
- **Glow pulse**: `animate-glow`
- **Aurora**: `animate-aurora`
- **Shimmer**: `animate-shimmer`

## Shadow System

### Standard Shadows
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
```

### Colored Shadows
```css
--shadow-colored: 0 8px 32px rgba(99, 102, 241, 0.2)
--shadow-glow: 0 0 20px rgba(99, 102, 241, 0.3)
```

## Interactive States

### Hover Effects
```tsx
// Subtle elevation
className="hover:shadow-lg hover:-translate-y-1"

// Color shifts
className="hover:bg-primary-light hover:text-white"

// Glow effects
className="hover:shadow-glow hover:scale-105"
```

### Focus States
```tsx
// Ring focus
className="focus-visible:ring-2 focus-visible:ring-primary"

// Glow focus
className="focus-visible:shadow-glow focus-visible:scale-105"
```

### Active States
```tsx
// Scale down
className="active:scale-95"

// Color darken
className="active:bg-primary-dark"
```

## Utility Classes

### Text Effects
- `.text-gradient`: Gradient text with primary colors
- `.font-display`: Manrope font for headings
- `.font-mono`: JetBrains Mono for code

### Background Effects
- `.backdrop-blur-glass`: 16px backdrop blur
- `.bg-glass`: Semi-transparent glass background
- `.gradient-mesh`: Organic mesh gradient

### Border Effects
- `.border-glass`: Glass morphism border
- `.border-gradient`: Animated gradient border
- `.border-strong`: Enhanced border visibility

## Responsive Behavior

### Breakpoint System
```css
xs: 320px   /* Extra small devices */
sm: 576px   /* Small devices */
md: 768px   /* Medium devices */
lg: 992px   /* Large devices */
xl: 1200px  /* Extra large devices */
2xl: 1600px /* XXL devices */
```

### Mobile Optimizations
- Reduced animations on `prefers-reduced-motion`
- Touch-friendly sizing (minimum 44px targets)
- Simplified effects on smaller screens

## Dark Mode Support

All components automatically adapt to dark mode through CSS custom properties:

```css
.dark {
  --background: 222.2 84% 4.9%;
  --card: 222.2 84% 4.9%;
  --glass-bg: rgba(255, 255, 255, 0.05);
  /* ... all color variables adjusted */
}
```

## Best Practices

### Performance
- Use `transform` for animations (GPU accelerated)
- Prefer `opacity` changes over color transitions
- Apply `will-change` sparingly and remove after animation

### Accessibility
- Maintain color contrast ratios (WCAG AA: 4.5:1)
- Provide focus indicators for all interactive elements
- Test with screen readers and keyboard navigation
- Support `prefers-reduced-motion` for animations

### Implementation
```tsx
// Good: Combine effects thoughtfully
<Button variant="premium" className="animate-fade-in hover:animate-glow">
  Premium Button
</Button>

// Avoid: Overusing effects
<Button className="animate-bounce animate-pulse animate-glow shadow-2xl">
  Too Much
</Button>
```

## Examples

### Hero Section
```tsx
<section className="hero-premium relative min-h-screen flex items-center">
  <div className="absolute inset-0 gradient-mesh opacity-30" />
  <div className="container mx-auto px-6 relative z-10">
    <h1 className="font-display text-6xl font-bold text-white mb-6 animate-fade-in-up">
      Research Platform
    </h1>
    <p className="text-xl text-white/80 mb-8 animate-fade-in-up animation-delay-200">
      Advanced analytics and insights
    </p>
    <Button variant="glass" size="xl" className="animate-bounce-in animation-delay-400">
      Get Started
    </Button>
  </div>
</section>
```

### Dashboard Card
```tsx
<Card variant="premium" className="animate-scale-in">
  <CardHeader>
    <CardTitle className="text-gradient">Analytics Overview</CardTitle>
    <CardDescription>Real-time insights</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-3 gap-4">
      {metrics.map((metric, i) => (
        <div 
          key={metric.id}
          className="text-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
        >
          <div className="text-2xl font-bold text-primary">{metric.value}</div>
          <div className="text-sm text-muted-foreground">{metric.label}</div>
        </div>
      ))}
    </div>
  </CardContent>
</Card>
```

This design system provides a comprehensive foundation for creating sophisticated, modern interfaces with premium visual effects while maintaining performance and accessibility standards.