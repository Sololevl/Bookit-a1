# BookIt - Experience Booking Platform

A fullstack web application for booking travel experiences with real-time slot availability, promo codes, and secure booking flow.

## 🎯 Features

- **Browse Experiences**: View curated travel experiences with images and details
- **Search**: Find experiences by title or location
- **Real-time Availability**: Check available slots with live capacity updates
- **Date & Time Selection**: Choose from available dates and time slots
- **Promo Codes**: Apply discount codes (SAVE10, FLAT100)
- **Secure Booking**: Complete booking flow with email confirmation
- **Responsive Design**: Mobile-first design matching Figma specifications

## 🛠 Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (Build tool)
- TailwindCSS (Styling)
- Axios (API calls)

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL (Database)
- pg (PostgreSQL client)

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 14+
- Git

### 1. Clone Repository

```bash
git clone <repository-url>
cd bookit
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Database Setup

1. **Install PostgreSQL** (if not already installed)
   - macOS: `brew install postgresql@14`
   - Windows: Download from postgresql.org

2. **Start PostgreSQL service**
   ```bash
   # macOS
   brew services start postgresql@14
   
   # Windows - runs automatically after installation
   ```

3. **Create database**
   ```bash
   # Login to PostgreSQL
   psql postgres
   
   # Create database
   CREATE DATABASE bookit_db;
   
   # Exit
   \q
   ```

4. **Configure environment variables**
   
   Create `.env` file in `backend/` directory:
   ```env
   PORT=5000
   NODE_ENV=development
   
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME
   DB_USER
   DB_PASSWORD=your_password
   
   FRONTEND_URL=http://localhost:5173
   ```

5. **Run database migrations**
   ```bash
   npm run migrate
   ```
   
   This will:
   - Create all required tables (experiences, slots, promo_codes, bookings)
   - Insert sample experiences with images
   - Insert available slots
   - Insert promo codes (SAVE10, FLAT100, EXPIRED)

6. **Start backend server**
   ```bash
   npm run dev
   ```
   
   Backend will run on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd ../frontend
npm install
```

**Start development server**
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

### 5. Testing the Application

1. **Home Page**: Browse experiences at `http://localhost:5173`
2. **Search**: Try searching for "Kayak" or "Bangalore"
3. **Details**: Click "View Details" on Kayaking experience
4. **Booking**: Select date/time, adjust quantity, click "Confirm"
5. **Checkout**: 
   - Fill in name and email
   - Try promo codes: `SAVE10` (10% off) or `FLAT100` (₹100 off)
   - Check "I agree to terms"
   - Click "Pay and Confirm"
6. **Confirmation**: View your booking reference ID

## 📡 API Endpoints

### Experiences
- `GET /api/experiences` - List all experiences (with optional search query)
- `GET /api/experiences/:id` - Get experience details with slots

### Bookings
- `POST /api/bookings` - Create a new booking

### Promo Codes
- `POST /api/promo/validate` - Validate promo code

## 🎨 Design Fidelity

The frontend exactly matches the provided Figma design:
- Exact color scheme (Yellow #FCD34D, grays)
- Typography matching design specs
- Component spacing and sizing
- Responsive breakpoints (mobile, tablet, desktop)
- Interactive states (hover, active, disabled, sold-out)

## 🔐 Sample Data

### Experiences
- Kayaking (Udupi) - ₹999
- Nandi Hills Sunrise (Bangalore) - ₹899
- Coffee Trail (Coorg) - ₹1299
- Boat Cruise (Sunderban) - ₹999
- Bungee Jumping (Manali) - ₹999

### Promo Codes
- `SAVE10` - 10% discount
- `FLAT100` - ₹100 flat discount
- `EXPIRED` - Inactive code (for testing)

### Available Slots
Kayaking experience has 8 time slots across 5 dates:
- Oct 22: 07:00 (4 left), 09:00 (2 left), 11:00 (5 left), 13:00 (sold out)
- Oct 23-26: 09:00 AM slots

## 🏗 Build for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 📝 Additional Notes

- All images are from Unsplash (royalty-free)
- Taxes are hardcoded at ₹59 for simplicity
- Booking prevents double-booking with database row locking
- Real-time slot availability updates after each booking
- Form validation on both frontend and backend
- Error handling for all API calls

## 🎯 Future Enhancements

- User authentication
- Payment gateway integration
- Email confirmation system
- Booking history
- Admin dashboard
- More experience filters (price, location, category)
- Reviews and ratings
- Wishlist functionality

## 📄 License

MIT License - Feel free to use for learning and portfolio projects.