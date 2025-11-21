# 🎨 H.E.L.I.X. Public Assets

## 🏆 Hackathon Project Assets

This directory contains **static assets** for the H.E.L.I.X. frontend application, including logos, icons, and images.

## 📁 Files in This Directory

| File | Size | Purpose |
|------|------|---------|
| `favicon.svg` | 12.7 KB | Browser favicon (H.E.L.I.X. logo) |
| `logo.svg` | 12.7 KB | Main H.E.L.I.X. logo (color version) |
| `logo.png` | 11.2 KB | Main H.E.L.I.X. logo (PNG format) |
| `logo-black.svg` | 12.6 KB | H.E.L.I.X. logo (black version) |
| `logo-large.svg` | 1.5 KB | Large H.E.L.I.X. logo variant |
| `icp-black.svg` | 1.6 KB | Internet Computer logo (legacy) |
| `internet-computer-icp-logo.svg` | 2.3 KB | ICP logo (legacy) |
| `ipfs-icon.svg` | 721 bytes | IPFS icon (legacy) |
| `images/` | - | Additional image assets |

## 📄 File Descriptions

### Logo Files

#### `logo.svg` / `logo.png` - Main Logo
**H.E.L.I.X. primary logo**
- Used in header, landing page, documentation
- Color version with gradient
- Available in SVG (scalable) and PNG (raster) formats

#### `favicon.svg` - Browser Icon
**Browser tab icon**
- Displays in browser tabs
- Shows in bookmarks
- Used in PWA manifest

#### `logo-black.svg` - Dark Mode Logo
**Black version for light backgrounds**
- Used in light mode themes
- Print-friendly version
- High contrast for accessibility

#### `logo-large.svg` - Large Format Logo
**Simplified large logo**
- Used for hero sections
- Optimized for large displays
- Reduced file size for performance

### Legacy Assets

#### `icp-black.svg` / `internet-computer-icp-logo.svg`
**Internet Computer Protocol logos (historical)**
- From original ICP implementation
- Kept for reference
- No longer used in production

#### `ipfs-icon.svg`
**IPFS icon (historical)**
- From original decentralized storage implementation
- Kept for reference
- No longer used in production

### Images Directory
**Additional image assets**
- Screenshots for documentation
- Demo images
- UI mockups

## 🎯 Asset Usage

### In HTML
```html
<!-- Favicon -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />

<!-- Logo in header -->
<img src="/logo.svg" alt="H.E.L.I.X. Logo" width="120" />
```

### In React Components
```typescript
// Import logo
import logo from '/logo.svg';

// Use in component
const Header = () => {
  return (
    <header>
      <img src={logo} alt="H.E.L.I.X." className="logo" />
    </header>
  );
};
```

### In CSS
```css
/* Background logo */
.hero {
  background-image: url('/logo-large.svg');
  background-size: contain;
  background-repeat: no-repeat;
}
```

## 🎯 Hackathon Highlights

### Branding
- **✅ Professional Logo**: Custom-designed H.E.L.I.X. branding
- **✅ Multiple Formats**: SVG and PNG for flexibility
- **✅ Dark Mode Support**: Black variant for light backgrounds
- **✅ Scalable**: Vector graphics for all sizes

### Performance
- **✅ Optimized SVGs**: Minified for fast loading
- **✅ Small File Sizes**: Compressed images
- **✅ Lazy Loading**: Images loaded on demand
- **✅ Caching**: Browser caching enabled

### Accessibility
- **✅ Alt Text**: Descriptive alt attributes
- **✅ High Contrast**: Readable in all modes
- **✅ Scalable**: Works at any size
- **✅ Color Blind Safe**: Accessible color choices

## 📊 Asset Statistics

| Metric | Value |
|--------|-------|
| **Total Files** | 8+ files |
| **Total Size** | ~55 KB |
| **Logo Variants** | 4 variants |
| **Formats** | SVG, PNG |
| **Legacy Assets** | 3 files |

## 🔗 Related Documentation

- **Frontend README**: [../README.md](../README.md) - Frontend overview
- **Components**: [../src/components/README.md](../src/components/README.md) - Component usage

## 📝 License

MIT License - see [LICENSE](../LICENSE) for details.

---

**Built for Hedera Hackathon 2025** | **Category:** Visual Assets
