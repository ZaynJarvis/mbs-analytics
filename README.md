# Video Processing Analytics Dashboard

A modern, interactive web application for analyzing video processing codec ladder filtering pipelines. Built with React, TypeScript, and Tailwind CSS.

## 🚀 Live Demo

**Production URL**: [https://fancy-yeot-117418.netlify.app](https://fancy-yeot-117418.netlify.app)

## 📋 Features

### 📊 Data Input & Processing
- **Excel File Upload**: Support for `.xlsx` and `.xls` files with drag-and-drop functionality
- **JSON Data Paste**: Direct clipboard paste of JSON objects or arrays
- **Robust Parsing**: Handles double-encoded JSON strings from Excel exports
- **Real-time Processing**: Instant data visualization upon upload

### 🔍 Analytics & Visualization
- **Codec Ladder Filtering Pipeline**: Interactive funnel chart showing 8 filtering stages
- **Ladder Information Display**: Detailed view of selected vs rejected codec gears
- **Key Performance Metrics**: Region, device type, duration, scores, and more
- **Record Navigation**: Browse through multiple records with pagination controls

### 🎯 Interactive Components
- **Funnel Chart**: Visual representation of filtering stages with removal tracking
- **Metric Cards**: Clean, card-based display of key performance indicators
- **Detailed Tables**: Expandable sections for additional information and settings
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 🔗 Sharing & Collaboration
- **Share Links**: Generate compressed URLs for sharing specific records
- **Public View**: Shared links work without requiring the original data
- **Settings Privacy**: Configuration settings excluded from shared views
- **Copy to Clipboard**: One-click sharing with automatic URL generation

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom gradients and animations
- **Icons**: Lucide React icon library
- **Routing**: React Router DOM for navigation
- **Data Processing**: 
  - XLSX library for Excel file parsing
  - LZ-String for URL compression
- **Build Tool**: Vite for fast development and optimized builds
- **Deployment**: Netlify with automatic deployments

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Dashboard.tsx           # Main dashboard page
│   ├── SharedView.tsx          # Public sharing page
│   ├── FileUpload.tsx          # File upload and JSON paste
│   ├── FunnelSection.tsx       # Codec ladder filtering pipeline
│   ├── FunnelChart.tsx         # Interactive funnel visualization
│   ├── MetricCards.tsx         # Key performance indicators
│   ├── RecordDetailsSection.tsx # Record details container
│   ├── KeyIdentifiersSection.tsx # Key identifiers display
│   ├── HorizontalTable.tsx     # Detailed record information
│   ├── LadderInfoDisplay.tsx   # Codec ladder analysis
│   └── DataTable.tsx           # Searchable data table
├── App.tsx                     # Main application component
├── main.tsx                    # Application entry point
└── index.css                   # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd video-analytics-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
npm run preview
```

## 📊 Data Format

### Excel Input
The application expects Excel files with the following key columns:
- `vid` - Video ID
- `item_id` - Item identifier
- `device_id` - Device identifier  
- `user_id` - User identifier
- `ladder_info` - JSON string containing codec ladder details
- `ladders_before_filter_*` - Pipeline stage data
- `ladders_after_filter_*` - Filtered stage data

### JSON Input
Direct JSON objects or arrays with the same structure as Excel data.

### Ladder Info Format
```json
{
  "ladder_name": {
    "bitrate": 82595,
    "status": "1",
    "reason": "not_supported_by_settings",
    "definition": 360,
    "universal_vmaf": 67.528
  }
}
```

## 🎨 Key Features Explained

### Codec Ladder Filtering Pipeline
- **8 Filtering Stages**: From initial adaptive video filter to final result
- **Visual Funnel**: Progressive width reduction showing filtering impact
- **Removal Tracking**: Displays exactly which ladders were removed at each stage
- **Summary Statistics**: Retention rates and total removal counts

### Ladder Information Analysis
- **Selected vs Rejected**: Clear separation of chosen and filtered-out gears
- **Sorting Logic**: Rejected gears sorted by reason, then bitrate
- **Detailed Metrics**: Bitrate, VMAF scores, and resolution information
- **Reason Tracking**: Why specific ladders were rejected

### Sharing System
- **URL Compression**: Uses LZ-String to create compact shareable URLs
- **Privacy Protection**: Excludes sensitive settings from shared views
- **Persistent Links**: Shared URLs work independently of original data source

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling
- Component-based architecture

## 🚀 Deployment

The application is configured for Netlify deployment with:
- Automatic builds from main branch
- SPA routing support via `_redirects` file
- Optimized build configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the live demo for expected functionality
- Review the data format requirements

## 🔄 Version History

- **v1.0.0** - Initial release with core analytics features
- **v1.1.0** - Added sharing functionality and improved Excel parsing
- **v1.2.0** - Enhanced ladder info display and mobile responsiveness