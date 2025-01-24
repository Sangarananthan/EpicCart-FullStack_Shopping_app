# EpicCart - E-commerce Application

EpicCart is a full-stack e-commerce application designed to provide a seamless shopping experience. It features robust user and admin functionalities, including product management, cart operations, checkout, and payment integration. The application is built with modern technologies for performance, scalability, and responsiveness.

---
## Live Demo

Check out the live deployment of the project here: [EpicCart Live](https://epic-cart-wheat.vercel.app/)  


## Features

### **User Features**
1. **Authentication and Authorization**:
   - Secure account creation and login.
   - JWT-based authentication.
   - Role-based access control for users and admins.

2. **Product Browsing**:
   - Browse products by categories, brands, and price range.
   - View product details with images, descriptions, pricing, and reviews.
   - Add products to favorites for later access.

3. **Shopping Cart**:
   - Add products to the cart with adjustable quantities.
   - Remove items from the cart.
   - View order summary with subtotal.

4. **Checkout & Payment**:
   - Input shipping details (address, city, postal code, country).
   - Pay securely via PayPal or credit/debit cards.
   - Order summary with taxes and shipping costs calculated.

5. **Reviews**:
   - View product reviews and ratings.
   - Submit reviews with a rating and comment.

### **Admin Features**
1. **Admin Dashboard**:
   - View total sales, customers, orders, and sales trends.
   - See recent orders with customer details and status.

2. **Product Management**:
   - Create, update, and delete products.
   - Assign products to categories and upload images via Cloudinary.

3. **Order Management**:
   - Manage and update order statuses.

### **Additional Features**
- **Responsive Design**: Works seamlessly across devices (desktop, tablet, and mobile).
- **Pagination**: Efficient navigation through large product lists.
- **Favorites**: Mark products as favorites and store them in local storage.

---

## Tech Stack

### **Frontend**:
- **React.js**: Dynamic and responsive user interfaces.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Redux**: State management across components.
- **Vite**: Fast development and hot module replacement.

### **Backend**:
- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web framework for routing and APIs.
- **MongoDB**: NoSQL database for storing data.
- **JWT (JSON Web Token)**: Secure authentication and authorization.
- **Bcrypt.js**: Password hashing for security.
- **Cloudinary**: Cloud storage for product images.

### **Other Tools**:
- **Git & GitHub**: Version control and collaboration.
- **Postman**: API testing and development.
- **Axios**: HTTP client for API requests.

---

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB instance

### Clone the Repository
```bash
git clone https://github.com/your-username/EpicCart.git
cd EpicCart
```

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file and configure the following:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   PAYPAL_CLIENT_ID=your_paypal_client_id
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Access the Application
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

---

## Functionalities Overview

1. **User Authentication**: Secure login, registration, and role-based access.
2. **Product Management**: Add, edit, delete, and view products with image uploads.
3. **Cart Operations**: Add to cart, update quantities, and view order summary.
4. **Checkout**: Input shipping details and make payments.
5. **Admin Dashboard**: Overview of sales, orders, and customers.
6. **Review System**: Submit and view product reviews.

---

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add a new feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---

## License
This project is licensed under the [MIT License](LICENSE).

---

## Contact
For questions or feedback, please contact:
- **Name**: Sangar Ananthan
- **Email**: sangarcool20@gmail.com.com
- **GitHub**: [sangarananthan](https://github.com/sangarananthan)
