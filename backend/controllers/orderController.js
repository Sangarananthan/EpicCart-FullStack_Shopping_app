import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// Utility Functions
const createResponse = (success, message, data = null) => ({
  success,
  message,
  data,
});

function calcPrices(orderItems) {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.15;
  const taxPrice = (itemsPrice * taxRate).toFixed(2);
  const totalPrice = (
    itemsPrice +
    shippingPrice +
    parseFloat(taxPrice)
  ).toFixed(2);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
}


// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems?.length) {
      return res
        .status(400)
        .json(createResponse(false, "Order must contain at least one item"));
    }

    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    // Validate all products exist
    const missingProducts = orderItems.filter(
      (item) =>
        !itemsFromDB.some((dbItem) => dbItem._id.toString() === item._id)
    );

    if (missingProducts.length) {
      return res
        .status(404)
        .json(
          createResponse(
            false,
            `Products not found: ${missingProducts
              .map((p) => p._id)
              .join(", ")}`
          )
        );
    }

    const dbOrderItems = orderItems.map((itemFromClient) => ({
      ...itemFromClient,
      product: itemFromClient._id,
      price: itemsFromDB.find(
        (item) => item._id.toString() === itemFromClient._id
      ).price,
      _id: undefined,
    }));

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res
      .status(201)
      .json(createResponse(true, "Order created successfully", createdOrder));
  } catch (error) {
    res.status(500).json(
      createResponse(false, "Failed to create order", {
        error: error.message,
      })
    );
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id username");
    res.json(createResponse(true, "Orders retrieved successfully", orders));
  } catch (error) {
    res.status(500).json(
      createResponse(false, "Failed to retrieve orders", {
        error: error.message,
      })
    );
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(
      createResponse(true, "User orders retrieved successfully", orders)
    );
  } catch (error) {
    res.status(500).json(
      createResponse(false, "Failed to retrieve user orders", {
        error: error.message,
      })
    );
  }
};

const countTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json(
      createResponse(true, "Total orders counted successfully", { totalOrders })
    );
  } catch (error) {
    res.status(500).json(
      createResponse(false, "Failed to count orders", {
        error: error.message,
      })
    );
  }
};

const calculateTotalSales = async (req, res) => {
  try {
    const orders = await Order.find();
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    res.json(
      createResponse(true, "Total sales calculated successfully", {
        totalSales,
      })
    );
  } catch (error) {
    res.status(500).json(
      createResponse(false, "Failed to calculate total sales", {
        error: error.message,
      })
    );
  }
};

const calculateTotalSalesByDate = async (req, res) => {
  try {
    const salesByDate = await Order.aggregate([
      {
        $match: { isPaid: true },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
          },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.json(
      createResponse(true, "Sales by date retrieved successfully", salesByDate)
    );
  } catch (error) {
    res.status(500).json(
      createResponse(false, "Failed to retrieve sales by date", {
        error: error.message,
      })
    );
  }
};

const findOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "username email"
    );

    if (!order) {
      return res.status(404).json(createResponse(false, "Order not found"));
    }

    res.json(createResponse(true, "Order retrieved successfully", order));
  } catch (error) {
    res.status(500).json(
      createResponse(false, "Failed to retrieve order", {
        error: error.message,
      })
    );
  }
};

const markOrderAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json(createResponse(false, "Order not found"));
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();
    res.json(
      createResponse(true, "Order marked as paid successfully", updatedOrder)
    );
  } catch (error) {
    res.status(500).json(
      createResponse(false, "Failed to mark order as paid", {
        error: error.message,
      })
    );
  }
};

const markOrderAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json(createResponse(false, "Order not found"));
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(
      createResponse(
        true,
        "Order marked as delivered successfully",
        updatedOrder
      )
    );
  } catch (error) {
    res.status(500).json(
      createResponse(false, "Failed to mark order as delivered", {
        error: error.message,
      })
    );
  }
};

export {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calculateTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
};
