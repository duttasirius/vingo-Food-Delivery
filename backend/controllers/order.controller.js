import DeliveryAssingment from "../models/deliveryAssingment.model.js";
import Order from "../models/order.model.js";
import Shop from "../models/shop.model.js";
import User from "../models/user.model.js";

export const placeOrder = async (req, res) => {
  try {
    const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;

    if (!cartItems) {
      return res.json({
        success: false,
        message: "CART IS EMPTY",
      });
    }

    if (
      !deliveryAddress ||
      !deliveryAddress.latitude ||
      !deliveryAddress.longitude
    ) {
      return res.json({
        success: false,
        message: "DELIVERY IS EMPTY",
      });
    }

    const groupItemByShop = {};
    // Object to store grouped cart items by shop
    // Example structure after grouping:
    // {
    //   shop1: [item1, item2],
    //   shop2: [item3]
    // }

    // Loop through each cart item
    cartItems.forEach((item) => {
      // Get the shop ID from the current item
      const shopId = item.shop._id || item.shop;

      // If this shop does NOT exist yet in the object,
      // create a new array for that shop
      if (!groupItemByShop[shopId]) {
        groupItemByShop[shopId] = [];
      }

      // Push the current item into that shop's array
      // This groups all items belonging to the same shop
      groupItemByShop[shopId].push(item);
    });

    // After loop ends:
    // All cart items are grouped by shop inside groupItemByShop
    // Useful for:
    // - Showing cart shop-wise
    // - Calculating totals per shop
    // - Creating separate orders per shop

    // ----------------------------------------

    const shopOrders = await Promise.all(
      Object.keys(groupItemByShop).map(async (shopId) => {
        const shop = await Shop.findById(shopId).populate("owner");

        if (!shop) {
          throw new Error("Shop not found");
        }

        // inbuild JS function if JS find key(like priorly stored this line -- Object.keys(groupItemByShop).map(async (shopId) it returns the paired key-value automatically & stored thats how i've got items like burger pizza inside items varibale  )
        const items = groupItemByShop[shopId];
        /*
===========================
GROUP ITEMS BY SHOP NOTES
===========================

Goal:
Group cart items shop-wise, then get items of each shop easily.

-----------------------------------
STEP 1: After grouping
-----------------------------------

groupItemByShop = {
  s1: [burger, pizza],
  s2: [tea]
}

Meaning:
key   = shopId
value = array of items for that shop

So:
- "s1" contains 2 items
- "s2" contains 1 item

Think of it like labeled boxes:
s1 → items of shop s1
s2 → items of shop s2

-----------------------------------
STEP 2: Get all shop IDs
-----------------------------------

Object.keys(groupItemByShop)

Gives:
["s1", "s2"]

This means:
Loop will run once per shop.

-----------------------------------
STEP 3: Inside loop
-----------------------------------

First loop:
shopId = "s1"

Now we want items of this shop.

const items = groupItemByShop[shopId];

This becomes:
const items = groupItemByShop["s1"];

Which equals:
items = [burger, pizza]

So:
object[key] → returns value stored at that key

Here:
groupItemByShop[shopId]
returns → items array of that shop

-----------------------------------
IMPORTANT MEMORY TRICK
-----------------------------------

groupItemByShop structure:
{
  shopId: itemsArray
}

So:
groupItemByShop["s1"] → items of shop s1
groupItemByShop["s2"] → items of shop s2

We are NOT getting shopId again.
We are getting the VALUE stored under that key.


*/

        const subTotal = items.reduce(
          (sum, i) => sum + Number(i.price) * Number(i.quantity),
          0,
        );

        return {
          shop: shop._id,
          owner: shop.owner._id,
          subTotal,
          // we need this to send for shopitemschema model
          shopOrderItems: items.map((i) => ({
            item: i.id,
            price: i.price,
            quantity: i.quantity,
            name: i.name,
          })),
        };
      }),
    );

    const newOrder = await Order.create({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      shopOrders,
    });

    return res.json({
      success: true,
      newOrder,
    });
  } catch (error) {
    // Catch and log any runtime errors
    console.log(error);
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🧑 Customer
    if (user.role === "user") {
      const orders = await Order.find({ user: req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("shopOrders.owner", "name email mobile")
        .populate("shopOrders.shopOrderItems.item", "name image price");

      return res.json({
        success: true,
        orders,
      });
    }

    // 🏪 Owner
    if (user.role === "owner") {
      const orders = await Order.find({ "shopOrders.owner": req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("user", "fullName email mobile")
        .populate("shopOrders.shopOrderItems.item", "name image price");

      const filterOrders = orders.map((order) => ({
        _id: order._id,
        paymentMethod: order.paymentMethod,
        user: order.user,
        createdAt: order.createdAt,
        deliveryAddress: order.deliveryAddress,

        shopOrders: order.shopOrders.filter(
          (o) => o.owner._id.toString() === req.userId.toString(),
        ),
      }));

      return res.json({
        success: true,
        orders: filterOrders, // ALWAYS send "orders"
      });
    }

    return res.status(403).json({
      success: false,
      message: "Unauthorized role",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, shopId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const shopOrders = order.shopOrders.find(
      (o) => o.shop.toString() === shopId,
    );

    if (!shopOrders) {
      return res
        .status(404)
        .json({ success: false, message: "Shop order not found" });
    }

    shopOrders.status = status;

    let deliveryBoyPayLoad = [];

    if (status === "out of delivery" && !shopOrders.assignment) {
      const { longitude, latitude } = order.deliveryAddress;

      const nearByDeliveryBoys = await User.find({
        role: "deliveryBoy",
        location: {
          $near: {
            // check the person order location through lat & long & return delivery boys within the 5/10 km of this order location
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)],
            },
            // coordinates based on userModel location --
            $maxDistance: 10000,
            // 10 km means 10000 mazor in meters
          },
        },
      });

      // stored all delivery boy ID within 10km radious
      const nearById = nearByDeliveryBoys.map((b) => b._id);

      // -------------------------------------------------------
      // STEP 3: Find delivery boys who are already BUSY
      // -------------------------------------------------------

      // REF--finding from Deliveryassingment model
      const busyIds = await DeliveryAssingment.find({
        // Only check assignments for nearby delivery boys
        assignedTo: { $in: nearById },

        // Ignore assignments that are not active
        status: {
          $nin: ["brodcasted", "expired"],
          // means:
          // include only "assigned"
          // because:
          // broadcasted → not accepted yet
          // expired → no longer valid
        },
      })

        // -------------------------------------------------------
        // STEP 4: Get only unique deliveryBoy IDs
        // -------------------------------------------------------
        // .distinct("assignedTo") returns unique deliveryBoy IDs who are currently busy.
        .distinct("assignedTo");
      // busyId now contains:
      // delivery boys who are already assigned to some order

      const busyIdset = new Set(busyIds.map((id) => String(id)));
      //➡️ Convert busy delivery boy IDs into a Set of strings
      // So you can quickly check who is busy and who is free.

      const availableBoys = nearByDeliveryBoys.filter(
        (b) => !busyIdset.has(String(b._id)),
      );

      const candidates = availableBoys.map((b) => b._id);

      if (candidates.length === 0) {
        await order.save();
        return res.json({
          message: "NO DELIVERY BOY AVAILABLE AT THIS TIME",
        });
      }

      // created delivery assignment
      const deliveryAssignment = await DeliveryAssingment.create({
        order: order._id,
        shop: shopOrders.shop,
        shopOrderId: shopOrders._id,
        broscastedTo: candidates,
        status: "brodcasted",
      });

      // Copy the assigned delivery boy's User _id
      // from DeliveryAssignment into this shopOrder.
      // This makes it easy to know which rider is handling
      // this specific shop order without querying again.
      shopOrders.assignedDeliveryBoy = deliveryAssignment.assignedTo;

      // shopOrderSchema model we need assignment id to track
      shopOrders.assignment = deliveryAssignment._id;

      deliveryBoyPayLoad = availableBoys.map((b) => ({
        id: b._id,
        fullName: b.fullName,
        longitude: b.location.coordinates?.[0],
        latitude: b.location.coordinates?.[1],
        mobile: b.mobile,
      }));
    }

    await order.save(); // always need to  save parent doc

    await order.populate("shopOrders.shop", "name");
    await order.populate(
      "shopOrders.assignedDeliveryBoy",
      "fullName email mobile",
    );

    const updatedShopOrder = order.shopOrders.find(
      (o) => o.shop._id.toString() === shopId,
    );

    return res.json({
      success: true,
      shopOrders: updatedShopOrder,
      assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy,
      availableBoys: deliveryBoyPayLoad,
      assignment: updatedShopOrder?.assignment._id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
