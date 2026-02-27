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
        .populate("shopOrders.shopOrderItems.item", "name image price")
        .populate("shopOrders.assignedDeliveryBoy", "fullName mobile");

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
        .populate("shopOrders.assignedDeliveryBoy", "fullName mobile");

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

    // future we load delivery boy name , id location etc etc here
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

      // created delivery assignment means out for delivery order
      const deliveryAssignment = await DeliveryAssingment.create({
        // orderId coming from frontend params  & stored order variable above
        order: order._id,
        shop: shopOrders.shop,
        shopOrderId: shopOrders._id,
        // candidates mean delivery boy available within 10 km area || const candidates = availableBoys.map((b) => b._id);
        broscastedTo: candidates,
        status: "brodcasted",
      });

      // Delivery Boy clicks ACCEPT
      //         ↓
      // DeliveryAssignment.assignedTo = boyId (delivery boy id stored to DeliveryAssingment model)
      //         ↓
      // Copy boyId into -

      // shopOrders.assignedDeliveryBoy (so that we can show in frotend delivery boy details name mobile)
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

    // now order contain shop name delivery boy details & we stored every thing inside updatedShoporder variable
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

// need to understand this properly tomorrow
export const getDeliveryBoyAssignment = async (req, res) => {
  try {
    const deliveryBoyId = req.userId;

    const assignments = await DeliveryAssingment.find({
      $or: [
        { broscastedTo: deliveryBoyId, status: "brodcasted" }, // new orders
      ],
    })
      .populate("order")
      .populate("shop");

    const formatted = assignments.map((a) => {
      const shopOrder = a.order.shopOrders.find(
        (so) => so._id.toString() === a.shopOrderId.toString(),
      );

      return {
        assignmentId: a._id,
        order: a.order._id,
        shopName: a.shop.name,
        deliveryAddress: a.order.deliveryAddress,
        items: shopOrder?.shopOrderItems || [],
        subTotal: shopOrder?.subTotal,
        status: a.status,
      };
    });

    return res.json({
      success: true,
      formatted,
    });
  } catch (error) {
    console.log(error);
  }
};

export const acceptOrder = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await DeliveryAssingment.findById(assignmentId);

    if (!assignment) {
      return res.json({
        success: false,
        message: "assingments not found",
      });
    }

    if (assignment.status !== "brodcasted") {
      return res.json({
        success: false,
        message: "assingments is expired",
      });
    }

    //  Check if this delivery boy is already busy with another order
    // ---------------------------------------------------------------
    // We search in DeliveryAssignment collection for assignments where:
    // assignedTo = req.userId
    // → means orders already accepted by THIS delivery boy
    //
    // status: { $nin: ["brodcasted", "completed"] }
    // → $nin = "not in"
    // → ignore:
    //    - "brodcasted"  → only sent, not accepted yet (still free)
    //    - "completed"   → already finished
    const alredayAssigned = await DeliveryAssingment.findOne({
      assignedTo: req.userId,
      status: { $nin: ["brodcasted", "completed"] },
    });

    if (alredayAssigned) {
      return res.json({
        success: false,
        message: "You already have an active delivery",
      });
    }

    // the logged-in delivery boy accepted the order his id gonna save inside DeliveryAssingment model-(assignedTo) & Order model-shopOrderSchema -assignedDeliveryBoy we can see frontend delivery boy details
    assignment.assignedTo = req.userId;

    //statues changed now no one else gonna accepted this
    assignment.status = "assigned";

    assignment.acceptedAt = new Date();

    await assignment.save();

    //“Go to the Orders model & compare inside assignment=deliveryAssingmentSchema ID
    //And findById() returns the full document so now inside order i've everything
    // take the id inside deliveryAssingmentSchema & find if this ID exists in order model if found returen full object & stored order variable
    const order = await Order.findById(assignment.order);

    if (!order) {
      return res.json({ message: "Order not found" });
    }

    const shoporder = order.shopOrders.find(
      (so) => so._id.toString() === assignment.shopOrderId.toString(),
    );
    shoporder.assignedDeliveryBoy = req.userId;

    await order.save();

    return res.json({
      success: true,
      message: "ORDER ACCEPTED",
    });
  } catch (error) {
    console.log(error);
  }
};

// showing delivery boy current assigned order

export const getCurrentOrder = async (req, res) => {
  try {
    const assignment = await DeliveryAssingment.findOne({
      assignedTo: req.userId,
      status: "assigned",
    })
      .populate("shop", "name")
      .populate("assignedTo", "fullName email mobile location")
      .populate({
        path: "order",
        populate: {
          path: "user",
          select: "fullName email location mobile",
        },
      });

    if (!assignment) {
      return res.json({
        success: false,
        message: "ASSIGNMENT NOT FOUND",
      });
    }

    if (!assignment.order) {
      return res.json({
        success: false,
        message: "ORDER NOT FOUND",
      });
    }

    if (!assignment.shopOrderId) {
      return res.json({
        success: false,
        message: "SHOP ORDER ID NOT FOUND IN ASSIGNMENT",
      });
    }

    if (!Array.isArray(assignment.order.shopOrders)) {
      return res.json({
        success: false,
        message: "SHOP ORDERS NOT FOUND",
      });
    }

    // Find correct shopOrder inside order
    const shopOrder = assignment.order.shopOrders.find(
      (so) => so._id.toString() === assignment.shopOrderId.toString(),
    );

    if (!shopOrder) {
      return res.json({
        success: false,
        message: "SHOP ORDER NOT FOUND",
      });
    }

    let deliveryBoyLocation = { lat: null, lon: null };
    // MongoDB stores GeoJSON coordinates as:
    // coordinates: [longitude, latitude]
    //
    // assignment.assignedTo -> refers to the delivery boy (UserModel)
    // assignedTo.location.coordinates -> contains [lon, lat]
    //
    // coordinates[0] = longitude
    // coordinates[1] = latitude
    //
    if (
      assignment.assignedTo?.location?.coordinates &&
      assignment.assignedTo.location.coordinates.length >= 2
    ) {
      deliveryBoyLocation.lat = assignment.assignedTo.location.coordinates[1];
      deliveryBoyLocation.lon = assignment.assignedTo.location.coordinates[0];
    }

    let CustomerLocation = { lat: null, lon: null };

    if (assignment.order.deliveryAddress) {
      CustomerLocation.lat = assignment.order.deliveryAddress.latitude || null;
      CustomerLocation.lon = assignment.order.deliveryAddress.longitude || null;
    }

    return res.json({
      success: true,
      // have order id because .populate order line above inside assignment variable
      // assignment.order._id
      //
      // This is the ORIGINAL Order document _id.
      // It was created when the user placed the order.
      //
      // Flow:
      // 1️⃣ User places order → MongoDB creates Order._id
      // 2️⃣ That same Order._id is stored inside DeliveryAssignment.order (as reference)
      // 3️⃣ We populate("order") → now assignment.order becomes full Order document
      // 4️⃣ assignment.order._id → gives the main Order ID
      //
      // Important:
      // - This does NOT create a new ID.
      // - This does NOT modify the database.
      // - It only sends the existing Order ID to frontend.
      // - This ID uniquely identifies the entire order.
      _id: assignment.order._id,
      user: assignment.order.user,
      shopOrder,
      deliveryAddress: assignment.order.deliveryAddress,
      deliveryBoyLocation,
      CustomerLocation,
    });
  } catch (error) {
    console.log("GET CURRENT ORDER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
