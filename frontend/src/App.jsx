import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import userGetCurrentUser from "./hooks/userGetCurrentUser";
import { useDispatch, useSelector } from "react-redux";
import Home from "./pages/Home";
import useGetCity from "./hooks/useGetCity";
import CreateEditShop from "./pages/CreateEditShop";
import AddItem from "./pages/AddItem";
import EditItem from "./pages/EditItem";
import useGetShopByCity from "./hooks/useGetShopByCity";
import userGetItemByCity from "./hooks/userGetItemByCity";
import CartPage from "./pages/CartPage";
import CheckOut from "./pages/CheckOut";
import OrderPlaced from "./pages/OrderPlaced";
import MyOrders from "./pages/MyOrders";
import userGetMyOrders from "./hooks/userGetMyOrders";
import useUpdateLocation from "./hooks/useUpdateLocation";
import TrackOrderPage from "./pages/TrackOrderPage";
import Shop from "./pages/Shop";
import { io } from "socket.io-client";
import { setSocket } from "./redux/userSlice";
import AiFoodAssistant from "./components/AiFoodAssistant";

export const serverurl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

const App = () => {
  const isLoading = userGetCurrentUser();
  const dispatch = useDispatch();
  useGetCity();
  useGetShopByCity();
  userGetItemByCity();
  userGetMyOrders();
  useUpdateLocation();

  const { userData, socket } = useSelector((state) => state.user);

  useEffect(() => {
    const socketInstance = io(serverurl, { withCredentials: true });
    socketInstance.on("connect", () => console.log("Connected:", socketInstance.id));
    dispatch(setSocket(socketInstance));
    return () => socketInstance.disconnect();
  }, []);

  useEffect(() => {
    if (!socket || !userData?._id) return;
    socket.emit("identity", { userId: userData._id });
  }, [socket, userData]);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen bg-orange-50"><p className="text-orange-500 text-lg font-semibold animate-pulse">Loading...</p></div>;
  }

  if (!userData) {
    return (
      <>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<Navigate to="/signin" />} />
        </Routes>
        <AiFoodAssistant />
      </>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-edit-shop" element={<CreateEditShop />} />
        <Route path="/add-item" element={userData ? <AddItem /> : <SignIn />} />
        <Route path="/edit-item/:itemId" element={<EditItem />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckOut />} />
        <Route path="/order-placed" element={<OrderPlaced />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/track-order/:orderId" element={<TrackOrderPage />} />
        <Route path="/shop/:shopId" element={<Shop />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <AiFoodAssistant />
    </>
  );
};

export default App;
