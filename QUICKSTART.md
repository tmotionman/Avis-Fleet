# 🚀 Quick Start Guide - Avis Fleet Management System

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open in Browser
```
http://localhost:5173/
```

That's it! 🎉

---

## 📊 What You'll See

### Dashboard
Real-time fleet metrics with:
- 5 KPI cards showing critical stats
- Fleet utilization chart (line graph)
- Vehicle status distribution (pie chart)
- Weekly fuel consumption (bar chart)
- Quick reference statistics

### Sidebar Navigation
Click to navigate between:
- 📊 Dashboard
- 🚗 Fleet Management
- 🔧 Maintenance
- ⛽ Fuel Management
- 📈 Reports
- 👥 User Management (Admin)

---

## 🎮 Demo Features to Try

### 1. **Fleet Management**
- Search vehicles by registration or model
- Filter by status (Active, In Service, Maintenance, Retired)
- Click the **+ Add Vehicle** button to add a new vehicle
- Click edit (✏️) to modify vehicle details
- Click delete (🗑️) to remove a vehicle

### 2. **Maintenance Tracker**
- View all maintenance records
- See total maintenance cost
- Add new maintenance records
- Edit or delete records
- Track pending services

### 3. **Fuel Management**
- Monitor total fuel spending (₦)
- View fuel consumption charts
- Check vehicle fuel efficiency
- See recent fuel transactions

### 4. **Reports**
- Select report type (Fleet, Maintenance, or Fuel)
- View detailed summary statistics
- Click **Export to CSV** to download data

### 5. **User Management** (Admin Only)
- View all system users
- Add new user accounts
- Assign roles: Admin, Manager, Employee
- Assign regions: Johannesburg, Cape Town, Durban, Pretoria
- Edit user information
- Delete user accounts

---

## 🎨 Customize with Avis Branding

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  avis: {
    red: '#E41E26',      // Your red
    black: '#000000',    // Your black
    darkgray: '#4B4B4B', // Your gray
    white: '#FFFFFF',    // White
  }
}
```

### Change Fonts
Edit `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont&display=swap" rel="stylesheet">
```

---

## 📁 Project Files Overview

```
src/
├── App.jsx                    # Main app router
├── main.jsx                   # Entry point
├── index.css                  # Global styles
├── components/                # Reusable components
│   ├── Sidebar.jsx
│   ├── Topbar.jsx
│   ├── KPICard.jsx
│   └── Charts.jsx
├── pages/                     # Page components
│   ├── Dashboard.jsx
│   ├── FleetList.jsx
│   ├── MaintenanceTracker.jsx
│   ├── FuelManagement.jsx
│   ├── Reports.jsx
│   └── UserManagement.jsx
└── data/                      # Mock data (JSON)
    ├── vehicles.json
    ├── maintenance.json
    ├── fuel.json
    └── users.json
```

---

## 💾 Build for Production

### Create Optimized Build
```bash
npm run build
```

This creates a `dist/` folder ready for deployment.

### Preview Production Build
```bash
npm run preview
```

---

## 🚢 Deploy Options

### **Vercel** (Easiest)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts

### **Netlify**
1. Run: `npm run build`
2. Drag `dist/` folder to [netlify.com](https://netlify.com)

### **GitHub Pages**
1. Update vite.config.js with your repo name
2. Run: `npm run build`
3. Push `dist/` to `gh-pages` branch

---

## 🔗 Connect to Real Backend

### Replace Mock Data with API

**Example: Replace vehicles.json with API call**

```javascript
// Before: src/pages/FleetList.jsx
import vehiclesData from '../data/vehicles.json'

// After:
const [vehicles, setVehicles] = useState([])

useEffect(() => {
  fetch('/api/vehicles')
    .then(res => res.json())
    .then(data => setVehicles(data))
    .catch(err => console.error(err))
}, [])
```

### Setup Environment Variables
Create `.env` file:
```
VITE_API_URL=https://your-api.com
VITE_API_KEY=your-api-key
```

Access in code:
```javascript
const API_URL = import.meta.env.VITE_API_URL
```

---

## 🆘 Troubleshooting

### Port 5173 Already in Use
```bash
npm run dev -- --port 3000
```

### Tailwind Not Applying
1. Clear browser cache (Ctrl+Shift+Delete)
2. Restart dev server
3. Check `src/index.css` is imported in `main.jsx`

### Charts Not Showing
- Verify Recharts is installed: `npm list recharts`
- Check data format matches chart requirements

### Sidebar Not Showing on Mobile
- Check viewport meta tag in `index.html`
- Verify Tailwind responsive classes

### Modal Behind Content
- Check z-index values (modal should be z-50)
- Ensure modal renders at top of DOM

---

## 📚 Useful Resources

- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [Recharts](https://recharts.org)
- [Vite](https://vitejs.dev)

---

## 📞 Support

For issues or questions:
1. Check README.md for detailed documentation
2. Review FEATURES.md for feature specifications
3. Check this Quick Start guide for common issues
4. Open an issue on GitHub if needed

---

## ✅ Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Dev server running (`npm run dev`)
- [ ] App visible at `http://localhost:5173`
- [ ] Navigation works (click sidebar items)
- [ ] Tables display data
- [ ] Charts render correctly
- [ ] Modals open and close
- [ ] Add/Edit/Delete buttons work
- [ ] Search and filters work
- [ ] Export to CSV works

---

**Congrats! 🎉 Your Avis Fleet Management System is ready to use!**

For more details, check:
- **README.md** - Full documentation
- **FEATURES.md** - Complete feature list
- **src/pages** - Page implementations
- **src/components** - Reusable components

Happy coding! 🚀
