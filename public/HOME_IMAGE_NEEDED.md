# Home Image Required

Please add a `home.png` image file to the `public/` folder.

The image should be:
- A modern house/home illustration
- Approximately 120x100 pixels (or any aspect ratio that looks good)
- PNG format with transparent background preferred
- Should represent a smart home or modern residential building

The PowerFlow component will automatically load this image from `/home.png` path.

Current usage in PowerFlowSVG component:
```jsx
<image href="/home.png" x="0" y="0" width="120" height="100" />
```

The PowerHive battery is now positioned attached to the right side of the house image.