# Customer Management System - Frontend

A modern React application for managing customers and their addresses with a clean, responsive user interface.

## Description

This is the frontend application for the Customer Management System. It provides an intuitive interface for creating, viewing, updating, and deleting customer records along with managing multiple addresses for each customer. Built with React, React Router, and Tailwind CSS for a modern and responsive user experience.

## Tech Stack

- **React** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Hot Toast** - Toast notifications
- **React Scripts** - Build tooling

## Features

### Customer Management
- Create new customers with form validation
- View list of all customers
- View detailed customer information
- Update customer details (First Name, Last Name, Phone Number)
- Delete customers with confirmation

### Address Management
- Add multiple addresses for each customer
- View all addresses for a customer
- Visual indicators for single or multiple addresses
- Update address information
- Delete addresses

### Search & Filter
- Search customers by City
- Search customers by State
- Search customers by Pin Code
- Clear filters functionality

### User Interface
- Responsive design (mobile, tablet, desktop)
- Modern UI with Tailwind CSS
- Toast notifications for user feedback
- Smooth navigation with React Router
- Loading states
- Error handling

## How to Run

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation Steps

1. **Navigate to the frontend directory**
   ```bash
   cd customer-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (Optional)
   
   Create a `.env` file in the `customer-frontend` directory:
   ```
   REACT_APP_API_URL=http://localhost:5001/api
   ```
   
   If not set, it defaults to `http://localhost:5001/api`

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   
   The application will automatically open at `http://localhost:3000`

### Build for Production

To create a production build:

```bash
npm run build
```

The build folder will contain the optimized production files ready for deployment.

## Project Structure

```
customer-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Home.js              # Landing page with hero section
│   │   ├── Navbar.js             # Navigation bar
│   │   ├── CustomerList.js       # Customer list with search/filter
│   │   ├── CreateCustomer.js     # Create customer form
│   │   └── CustomerDetails.js    # Customer details and address management
│   ├── config/
│   │   └── api.js                # API configuration
│   ├── App.js                    # Main app component with routing
│   ├── index.js                  # React entry point
│   └── index.css                 # Tailwind CSS imports
├── package.json
└── tailwind.config.js
```

## Routes

- `/` - Home page with hero section and features
- `/customers/all` - View all customers
- `/customers/new` - Create new customer
- `/customers/:id` - View/edit customer details

## Responsive Design

The application is fully responsive and optimized for:
- **Mobile devices** (320px and up)
- **Tablets** (768px and up)
- **Desktop** (1024px and up)

All components adapt seamlessly to different screen sizes with:
- Mobile-friendly navigation menu
- Responsive forms and buttons
- Flexible grid layouts
- Touch-friendly interface elements

## API Configuration

The frontend connects to the backend API. Update the API URL in:
- `.env` file: `REACT_APP_API_URL=your-backend-url/api`
- Or modify `src/config/api.js`

## Notes

- The application uses React Router for client-side routing
- Toast notifications provide user feedback for all actions
- All forms include client-side validation
- The UI is built with Tailwind CSS for consistent styling

