import Order from "../models/order.model.js";
import Shop from "../models/shop.model.js";

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
            item: i._id,
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
