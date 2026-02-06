## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Backend API running at `http://localhost:8000`

### Environment Variables

Create a `.env` file in the project root:
```env
VITE_API_BASE_URL=http://localhost:8000
```

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Test Credentials

**Admin:**
- Email: `admin@restaurant.com`
- Password: `admin123`

**Customer:**
- Email: `customer@test.com`
- Password: `customer123`

### Backend Connection

The frontend connects to the FastAPI backend at:
- **API**: `http://localhost:8000/api`
- **WebSocket**: `ws://localhost:8000/api/ws`

Make sure the backend is running before starting the frontend:
```bash
cd ../restaurant-backend
uvicorn main:app --reload
```

### Features
- ✅ User authentication (JWT)
- ✅ Real-time menu display
- ✅ Order placement
- ✅ Live order tracking (WebSocket)
- ✅ Admin dashboard
- ✅ Restaurant management
