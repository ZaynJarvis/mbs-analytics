# Development Guide

## 🛠️ Development Environment Setup

### Prerequisites
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **Git**: For version control
- **VS Code**: Recommended IDE with extensions

### Recommended VS Code Extensions
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### Initial Setup
```bash
# Clone the repository
git clone <repository-url>
cd video-analytics-dashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

## 🏗️ Architecture Overview

### Component Hierarchy
```
App.tsx
├── Dashboard.tsx (Main dashboard page)
│   ├── FileUpload.tsx
│   ├── KeyIdentifiersSection.tsx
│   ├── MetricCards.tsx
│   ├── FunnelSection.tsx
│   │   └── FunnelChart.tsx
│   └── RecordDetailsSection.tsx
│       └── HorizontalTable.tsx
│           └── LadderInfoDisplay.tsx
└── SharedView.tsx (Public sharing page)
    ├── KeyIdentifiersSection.tsx (reused)
    ├── MetricCards.tsx (reused)
    ├── FunnelSection.tsx (reused)
    └── RecordDetailsSection.tsx (reused)
```

### Data Flow
1. **File Upload** → `FileUpload.tsx` → Excel/JSON parsing
2. **Data Processing** → `Dashboard.tsx` → State management
3. **Record Navigation** → `Dashboard.tsx` → Current record selection
4. **Component Rendering** → Individual components → Display logic
5. **Sharing** → URL compression → `SharedView.tsx`

## 📊 Data Processing Pipeline

### Excel File Processing
```typescript
// File upload handling
const handleFileUpload = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  // Convert to LogRecord format
  const headers = jsonData[0] as string[];
  const records = jsonData.slice(1).map(row => {
    const record: LogRecord = {};
    headers.forEach((header, index) => {
      record[header] = row[index] || '';
    });
    return record;
  });
};
```

### JSON Parsing Strategy
```typescript
// Handle double-encoded JSON from Excel
const parseValue = (value: any) => {
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed === 'object') {
        return parsed;
      }
    } catch {
      // Not JSON, return as-is
    }
  }
  return value;
};
```

### Ladder Info Processing
```typescript
// Complex nested JSON parsing
const parseLadderData = (data: any): LadderItem[] => {
  // Handle string → JSON → nested JSON parsing
  let parsedData = typeof data === 'string' ? JSON.parse(data) : data;
  
  // Process ladder map structure
  Object.entries(parsedData).forEach(([ladderName, ladderInfo]) => {
    let processedInfo = ladderInfo;
    if (typeof ladderInfo === 'string') {
      processedInfo = JSON.parse(ladderInfo); // Double-decode
    }
    // Create ladder items...
  });
};
```

## 🎨 Styling Guidelines

### Tailwind CSS Patterns
```css
/* Gradient backgrounds */
.gradient-bg {
  @apply bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100;
}

/* Glass morphism cards */
.glass-card {
  @apply bg-white/80 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg;
}

/* Interactive elements */
.interactive {
  @apply transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5;
}
```

### Color System
- **Primary**: Blue (600-500) to Purple (600-500) gradients
- **Success**: Green (600-500) for selected items
- **Error**: Red (600-500) for rejected items
- **Warning**: Orange (600-500) for settings
- **Neutral**: Gray (50-900) for text and backgrounds

### Component Styling Patterns
```typescript
// Status-based styling
const getStatusStyle = (status: string) => {
  return status === '1' 
    ? 'bg-green-50 border-green-200 text-green-800'
    : 'bg-red-50 border-red-200 text-red-800';
};

// Responsive grid layouts
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

## 🔧 Development Workflow

### Branch Strategy
```bash
# Feature development
git checkout -b feature/new-component
git commit -m "feat: add new component"
git push origin feature/new-component

# Bug fixes
git checkout -b fix/parsing-issue
git commit -m "fix: resolve double JSON parsing"
git push origin fix/parsing-issue

# Hotfixes
git checkout -b hotfix/critical-bug
git commit -m "hotfix: resolve production issue"
git push origin hotfix/critical-bug
```

### Commit Message Convention
```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

### Code Quality Checks
```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint -- --fix

# Type checking
npx tsc --noEmit

# Build verification
npm run build
```

## 🧪 Testing Strategy

### Component Testing Approach
```typescript
// Example test structure
describe('LadderInfoDisplay', () => {
  it('should parse double-encoded JSON correctly', () => {
    const doubleEncodedData = '{"ladder1": "{\\"status\\": \\"1\\"}"}';
    const result = parseLadderData(doubleEncodedData);
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe('1');
  });
});
```

### Manual Testing Checklist
- [ ] Excel file upload (.xlsx, .xls)
- [ ] JSON paste functionality
- [ ] Record navigation (prev/next)
- [ ] Funnel chart rendering
- [ ] Ladder info display (selected/rejected)
- [ ] Share link generation
- [ ] Shared view rendering
- [ ] Mobile responsiveness
- [ ] Error handling (malformed data)

## 🚀 Build & Deployment

### Local Build
```bash
# Development build
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Netlify Deployment
```bash
# Build settings
Build command: npm run build
Publish directory: dist

# Environment variables (if needed)
VITE_API_URL=https://api.example.com
```

### Build Optimization
- **Code Splitting**: Vite automatically splits vendor and app code
- **Tree Shaking**: Unused code is eliminated
- **Asset Optimization**: Images and fonts are optimized
- **Compression**: Gzip compression enabled

## 🐛 Debugging Guide

### Common Issues & Solutions

#### 1. Excel Parsing Failures
```typescript
// Debug Excel parsing
console.log('Raw Excel data:', jsonData);
console.log('Headers:', headers);
console.log('First record:', records[0]);
```

#### 2. Double-Encoded JSON
```typescript
// Debug JSON parsing
console.log('Raw value:', value);
console.log('First parse:', JSON.parse(value));
console.log('Second parse:', JSON.parse(JSON.parse(value)));
```

#### 3. Funnel Chart Empty
```typescript
// Debug funnel data
console.log('Funnel stages:', stages);
console.log('Parsed items per stage:', stages.map(s => s.items));
```

#### 4. Share Link Issues
```typescript
// Debug compression
console.log('Original data:', shareableData);
console.log('Compressed:', compressed);
console.log('Share URL:', url);
```

### Browser DevTools
- **React DevTools**: Component state inspection
- **Network Tab**: File upload monitoring
- **Console**: Debug logging output
- **Application Tab**: Local storage inspection

## 📈 Performance Optimization

### React Optimization
```typescript
// Memoization for expensive calculations
const funnelData = useMemo(() => {
  return processStages(record);
}, [record]);

// Callback memoization
const handleRecordChange = useCallback((index: number) => {
  setCurrentRecordIndex(index);
}, []);
```

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist
```

### Performance Monitoring
- **Lighthouse**: Core Web Vitals
- **React Profiler**: Component render times
- **Network**: Asset loading times
- **Memory**: Memory usage patterns

## 🔒 Security Considerations

### Data Handling
- **Client-Side Only**: No server-side data storage
- **URL Compression**: Data compressed in share URLs
- **Settings Exclusion**: Sensitive settings excluded from shares
- **Input Validation**: Robust parsing with error handling

### Best Practices
- **XSS Prevention**: Proper data sanitization
- **HTTPS Only**: Secure data transmission
- **No Sensitive Data**: No API keys or secrets in frontend
- **Error Boundaries**: Graceful error handling

## 📚 Learning Resources

### Technologies Used
- **React**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/
- **Tailwind CSS**: https://tailwindcss.com/
- **Vite**: https://vitejs.dev/
- **XLSX**: https://docs.sheetjs.com/

### Advanced Topics
- **React Patterns**: Component composition, render props
- **TypeScript**: Advanced types, generics
- **Performance**: Code splitting, lazy loading
- **Testing**: Unit tests, integration tests
- **Accessibility**: ARIA labels, keyboard navigation

## 🤝 Contributing Guidelines

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Automatic formatting
- **File Naming**: PascalCase for components, camelCase for utilities

### Pull Request Process
1. **Fork** the repository
2. **Create** feature branch
3. **Implement** changes with tests
4. **Update** documentation
5. **Submit** pull request with description

### Code Review Checklist
- [ ] TypeScript types are properly defined
- [ ] Components are properly memoized
- [ ] Error handling is implemented
- [ ] Responsive design is maintained
- [ ] Accessibility is considered
- [ ] Performance impact is minimal

## 📞 Support & Troubleshooting

### Getting Help
- **GitHub Issues**: Bug reports and feature requests
- **Documentation**: Check README and this guide
- **Code Comments**: Inline documentation
- **Console Logs**: Debug information

### Common Solutions
- **Clear Cache**: `rm -rf node_modules package-lock.json && npm install`
- **Reset State**: Clear browser local storage
- **Update Dependencies**: `npm update`
- **Restart Dev Server**: `npm run dev`