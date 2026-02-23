import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId; // FIXED

    if (!userId) {
      return res.json({
        success: false,
        message: "no user found",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: "no user found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUserLocation = async (req, res) => {
  try {
    const { lat, lon } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        location: {
          type: "Point",
          // as per mapSlice.js lat , lon
          coordinates: [lon, lat],
        },
      },
      { new: true },
    );
    if (!user) {
      return res.json({
        success: false,
        message: "no user found",
      });
    }

    return res.json({
      success: true,
      location: user.location,
    });
  } catch (error) {
    console.log(error);
  }
};
