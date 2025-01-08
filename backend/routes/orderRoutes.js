import express from "express";
const router = express.Router();

import {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calculateTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
} from "../controllers/orderController.js";

import {
  authenicateUser,
  authorizeAdmin,
} from "../middlewares/authMiddleware.js";

router
  .route("/")
  .post(authenicateUser, createOrder)
  .get(authenicateUser, authorizeAdmin, getAllOrders);

router.route("/mine").get(authenicateUser, getUserOrders);
router.route("/total-orders").get(countTotalOrders);
router.route("/total-sales").get(calculateTotalSales);
router.route("/total-sales-by-date").get(calculateTotalSalesByDate);
router.route("/:id").get(authenicateUser, findOrderById);
router.route("/:id/pay").put(authenicateUser, markOrderAsPaid);
router
  .route("/:id/deliver")
  .put(authenicateUser, authorizeAdmin, markOrderAsDelivered);

export default router;
