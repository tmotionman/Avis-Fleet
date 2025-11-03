# 🚗 Avis Fleet Management System

A modern, elegant, and fully responsive fleet management web application built with **React**, **Tailwind CSS**, **Framer Motion**, and **Recharts**. Designed for Avis Fleet employees to manage company vehicles, monitor usage, and track maintenance schedules.

![Fleet Management System](https://via.placeholder.com/1200x600?text=Avis+Fleet+Management+System)

## ✨ Features

### 🎯 Core Features
- **Dashboard** - Real-time fleet statistics and utilization charts
- **Fleet Management** - Complete vehicle inventory with search and filtering
- **Maintenance Tracking** - Schedule and track vehicle maintenance
- **Fuel Management** - Monitor fuel consumption and expenses
- **Reports** - Generate and export CSV reports
- **User Management** - Admin panel for user control (Admin only)

### 🎨 Design Elements
- **Responsive Layout** - Works seamlessly on mobile, tablet, and desktop
- **Avis Brand Colors** - Professional red (#E41E26), black, and white
- **Smooth Animations** - Framer Motion transitions and hover effects
- **Interactive Charts** - Recharts for data visualization
- **Modern UI Components** - Clean cards, tables, modals, and badges

### 🔐 Role-Based Access
- **Admin** - Full system access
- **Manager** - Regional fleet oversight
- **Employee** - Vehicle and fuel tracking

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd avis-fleet
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
avis-fleet/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Sidebar.jsx      # Navigation sidebar
│   │   ├── Topbar.jsx       # Top navigation bar
│   │   ├── KPICard.jsx      # KPI stat cards
│   │   └── Charts.jsx       # Chart components
│   │
│   ├── pages/               # Page components
│   │   ├── Dashboard.jsx    # Main dashboard
│   │   ├── FleetList.jsx    # Vehicle management
│   │   ├── MaintenanceTracker.jsx
│   │   ├── FuelManagement.jsx
│   │   ├── Reports.jsx
│   │   └── UserManagement.jsx
│   │
│   ├── data/                # Mock data (JSON)
│   │   ├── vehicles.json    # Vehicle records
│   │   ├── maintenance.json # Maintenance records
│   │   ├── fuel.json        # Fuel transactions
│   │   └── users.json       # User accounts
│   │
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # React entry point
│   └── index.css            # Tailwind & global styles
│
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
└── README.md                # This file
```

## 🛠️ Available Scripts

### Development
```bash
npm run dev        # Start dev server with hot reload
```

### Build
```bash
npm run build      # Create optimized production build
```

### Preview
```bash
npm run preview    # Preview production build locally
```

## 📦 Dependencies

### Core
- **React** (v18) - UI library
- **React DOM** (v18) - DOM rendering
- **Vite** - Build tool and dev server

### Styling & Animation
- **Tailwind CSS** (v3) - Utility-first CSS framework
- **Framer Motion** (v10) - Smooth animations and transitions
- **PostCSS** - CSS processing
- **Autoprefixer** - Vendor prefixes

### Data Visualization
- **Recharts** (v2) - React charting library

### Icons
- **lucide-react** - Modern icon library

## 🎯 Usage Guide

### Dashboard
- View key fleet metrics at a glance
- Monitor vehicle status distribution
- Check fuel consumption trends
- See pending maintenance services

### Fleet Management
- Search vehicles by registration or model
- Filter by status (Active, In Service, Maintenance, Retired)
- Add new vehicles with details
- Edit existing vehicle information
- Delete vehicles from the system
- Paginated table view

### Maintenance Tracker
- Track all maintenance records
- Add new service records
- Edit maintenance details
- Delete old records
- View total maintenance costs
- Monitor pending services

### Fuel Management
- Monitor fuel consumption per vehicle
- Track fuel card usage
- View spending trends over time
- Analyze fuel efficiency
- Export fuel transaction reports

### Reports
- Generate fleet reports with vehicle details
- Create maintenance expense reports
- Export fuel consumption reports
- Download data as CSV files

### User Management (Admin Only)
- Create user accounts
- Assign roles (Admin, Manager, Employee)
- Set regional access
- Manage user status
- Edit user information
- Delete user accounts

## 🎨 Customization

### Brand Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  avis: {
    red: '#E41E26',
    black: '#000000',
    darkgray: '#4B4B4B',
    white: '#FFFFFF',
  }
}
```

### Fonts
Google Fonts are loaded in `index.html`. Default: Inter and Poppins

### Data
Mock data is stored in JSON files in `src/data/`. Replace with real API calls as needed.

## 🔄 Integration with Backend

To connect to a real backend:

1. **Replace JSON imports** with API calls:
   ```javascript
   // Before
   import vehiclesData from '../data/vehicles.json'
   
   // After
   const [vehicles, setVehicles] = useState([])
   useEffect(() => {
     fetch('/api/vehicles')
       .then(res => res.json())
       .then(data => setVehicles(data))
   }, [])
   ```

2. **Add environment variables** in `.env`:
   ```
   VITE_API_URL=https://api.yourdomain.com
   ```

3. **Create API service layer** in `src/services/api.js`

## 📱 Responsive Breakpoints

- **Mobile** - < 640px
- **Tablet** - 640px - 1024px
- **Desktop** - > 1024px

All components are fully responsive with Tailwind CSS breakpoints.

## ⚡ Performance Tips

- Lazy load pages with React.lazy() and Suspense
- Optimize images and assets
- Use React.memo() for heavy components
- Implement pagination for large tables
- Cache API responses

## 🐛 Common Issues

### Chart not rendering
- Ensure Recharts is installed: `npm install recharts`
- Check data format matches chart expectations

### Styles not applying
- Restart dev server after tailwind config changes
- Clear browser cache (Ctrl+Shift+Delete)
- Verify CSS import in `main.jsx`

### Modal appearing behind content
- Check z-index values in CSS
- Ensure modal is rendered at top level

## 🚀 Deployment

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Drag dist/ folder to Netlify
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "dev"]
```

## 📊 Mock Data

The application includes realistic mock data:
- **8 Vehicles** with detailed specs
- **8 Maintenance Records** with costs
- **8 Fuel Transactions** across locations
- **7 User Accounts** with different roles

All data is in `src/data/*.json` files.

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [Recharts](https://recharts.org)
- [Vite Guide](https://vitejs.dev)

## 📝 Future Enhancements

- [ ] Google Maps integration for vehicle location tracking
- [ ] Real-time notifications system
- [ ] Advanced reporting with PDF export
- [ ] Vehicle telematics dashboard
- [ ] Mobile app (React Native)
- [ ] Dark mode theme
- [ ] Multi-language support
- [ ] Advanced analytics and predictive maintenance

## 📄 License

This project is open source and available under the MIT License.

## 👥 Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the development team.

## 🎉 Credits

Built with modern web technologies:
- React 18
- Tailwind CSS 3
- Framer Motion 10
- Recharts 2
- Vite
- Lucide React Icons

---

**Last Updated:** November 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅
