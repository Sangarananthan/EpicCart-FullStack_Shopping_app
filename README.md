# EpicCart

EpicCart is a feature-rich e-commerce application designed for seamless online shopping experiences. This repository contains the source code and instructions for setting up and running the application locally.

## 🚀 Live Demo

Check out the live deployment of the project here: [EpicCart Live](https://epic-cart-wheat.vercel.app/)  
Use the following credentials for admin functionality:  
- **Email**: admin@gmail.com  
- **Password**: admin

---

## ✨ Features

### 🛒 User Features
- **User Authentication**: Secure account creation and login.  
  ![User Authentication](https://github.com/user-attachments/assets/e235503a-267a-4d5f-931c-9b56c0a80b3b)
- **Role-Based Access Control**: Separate user and admin functionalities.
- **Product Browsing**: View products categorized and filterable by price, brand, and category.  
  ![Home screen product browse page](https://github.com/user-attachments/assets/2e40d7a6-2cbd-4ad4-89f1-91c320b61a50)
![Image](https://github.com/user-attachments/assets/384ee04b-4a70-47aa-8644-33de626eac42)
- **Favorites**: Save favorite products for later access.  
  ![Favorite product page](https://github.com/user-attachments/assets/7d48a2a8-e2e4-4f3c-ba83-5837457688e0)
- **Cart Management**: Add, update quantity, and remove products from the cart.  
  ![Cart page](https://github.com/user-attachments/assets/35686dea-bffe-4ff1-bd8d-6b1317c9fde1)
- **Checkout**: Seamless payment integration with PayPal and credit card options.  
  ![Shipping details page](https://github.com/user-attachments/assets/87380e4a-a69e-4fc4-acf6-5521eabd352a)
- **Review System**: Write and read reviews, including a review summary and star ratings.  
  ![Product detailed view page](https://github.com/user-attachments/assets/2564159e-6c58-44b5-a8ec-fee3b0a000e1)

### 👨‍💻 Admin Features
- **Category Management**: Create, edit, and delete product categories.
- **Product Management**: Add, update, and delete products, including uploading images via Cloudinary.
- **Order Management**: View order statuses and update as necessary.
- **Dashboard**: View total sales, customer count, orders, and sales trends.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** with **Vite**
- **Tailwind CSS**
- **Redux** for state management

### Backend
- **Node.js**
- **Express.js**
- **MongoDB** for the database
- **JWT** for authentication
- **bcrypt.js** for password hashing
- **Cloudinary** for image hosting

### Deployment
- **Vercel** (Frontend)
- **Render** or similar (Backend)

---

## 🖥️ Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/epiccart.git
   cd epiccart
   ```

2. **Install Dependencies**:
   - Navigate to the `frontend` directory and install dependencies:
     ```bash
     cd frontend
     npm install
     ```
   - Navigate to the `backend` directory and install dependencies:
     ```bash
     cd ../backend
     npm install
     ```

3. **Environment Variables**:
   - Create a `.env` file in the `backend` directory and add the following:
     ```env
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
     CLOUDINARY_API_KEY=your_cloudinary_api_key
     CLOUDINARY_API_SECRET=your_cloudinary_api_secret
     PAYPAL_CLIENT_ID=your_paypal_client_id
     ```

4. **Run the Application**:
   - Start the backend:
     ```bash
     cd backend
     npm run dev
     ```
   - Start the frontend:
     ```bash
     cd ../frontend
     npm run dev
     ```

5. **Access the Application**:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:5000](http://localhost:5000)

---

## 🤝 Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue for any bugs or feature requests.

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
