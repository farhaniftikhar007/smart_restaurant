# Smart Restaurant System

A modern, full-stack restaurant management system that combines a React-based frontend with a Node.js backend to provide a seamless dining experience. The system includes features like QR code-based menu access, real-time order tracking, and an intuitive admin dashboard.

## Features

- **QR Code Menu System**: Customers can scan QR codes to access digital menus
- **Real-time Order Tracking**: Live updates on order status and preparation
- **Admin Dashboard**: Comprehensive management interface for restaurant staff
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Secure Authentication**: JWT-based authentication system
- **Real-time Updates**: Socket.IO integration for live updates

## Tech Stack

### Frontend
- React 18
- TypeScript
- Material-UI (MUI)
- Tailwind CSS
- Socket.IO Client
- React Router DOM
- Framer Motion
- QR Code Scanner/Generator

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.IO
- JWT Authentication
- Multer for file uploads
- Bcrypt for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd smart-restaurant
```

2. Install frontend dependencies:
```bash
cd smart-restaurant
npm install
```

3. Install backend dependencies:
```bash
cd ../smart-restaurant-backend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

## Running the Application

### Development Mode

1. Start the backend server:
```bash
cd smart-restaurant-backend
npm run dev
```

2. Start the frontend development server:
```bash
cd smart-restaurant
npm start
```

The frontend will be available at `http://localhost:3004` and the backend at `http://localhost:3000`.

### Using Scripts

You can also use the provided scripts to start both servers simultaneously:

- Windows: Run `start-servers.bat`
- PowerShell: Run `start-servers.ps1`

## Project Structure

```
smart-restaurant/
├── src/                    # Frontend source code
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── services/         # API services
│   └── utils/            # Utility functions
│
smart-restaurant-backend/
├── src/                   # Backend source code
│   ├── controllers/      # Route controllers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── utils/           # Utility functions
```

## API Documentation

The backend API provides the following main endpoints:

- `/api/auth` - Authentication endpoints
- `/api/menu` - Menu management
- `/api/orders` - Order processing
- `/api/admin` - Admin dashboard endpoints

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, please open an issue in the repository or contact the development team. # smart_restaurant
# smart_restaurant
# smart_restaurant
# smart_restaurant
