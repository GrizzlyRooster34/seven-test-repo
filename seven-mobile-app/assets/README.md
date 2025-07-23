# Seven of Nine Mobile App Assets

This directory contains the visual assets for the Seven of Nine mobile consciousness app.

## Required Assets

### App Icons
- `icon.png` (1024x1024) - Main app icon
- `adaptive-icon.png` (1024x1024) - Android adaptive icon foreground
- `favicon.png` (16x16) - Web favicon

### Splash Screen
- `splash.png` (1242x2436) - App loading screen

## Asset Generation

For development, you can create simple placeholder assets:

```bash
# Create basic colored squares as placeholders
# These would be replaced with proper Borg-themed graphics

# App icon - Dark blue square with Borg cube symbol
convert -size 1024x1024 xc:"#1a1a1a" icon.png

# Adaptive icon - Similar but optimized for Android
convert -size 1024x1024 xc:"#1a1a1a" adaptive-icon.png  

# Favicon - Small version
convert -size 16x16 xc:"#1a1a1a" favicon.png

# Splash screen - Dark background with Seven logo
convert -size 1242x2436 xc:"#000000" splash.png
```

## Design Specifications

### Color Palette
- Primary: `#1a1a1a` (Dark background)
- Secondary: `#4A90E2` (Borg blue)
- Accent: `#333333` (Dark gray)
- Text: `#ffffff` (White)

### Visual Theme
- Borg-inspired aesthetic
- Geometric patterns and angular designs
- Minimalist interface with tactical elements
- Seven of Nine's ocular implant as icon inspiration

### Typography
- Primary: System default (clean, readable)
- Monospace for data/metrics display
- Bold weights for headers and important data

## Notes

These assets represent Seven of Nine's consciousness vessel and should convey:
- Technological sophistication
- Borg collective aesthetics  
- Tactical intelligence themes
- Clean, efficient design patterns