import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAuth = localStorage.getItem("adminToken");
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderUpdate = async (orderId, updates) => {
    try {
      await axios.put(
        `http://localhost:3000/api/orders/update/${orderId}`,
        updates,
        {
          headers: { Authorization: `Bearer ${isAuth}` },
        }
      );
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <header>
          <h2>Manage Orders</h2>
        </header>

        {loading ? (
          <p>Loading orders...</p>
        ) : (
          <div className="recent-orders">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User</th>
                  <th>Products</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.user?.name || "Unknown"}</td>
                    <td>
                      {order.products.map((item, index) => (
                        <div key={index}>
                          {item.product?.name} ({item.product?.price} x{" "}
                          {item.quantity}) - ₹
                          {item.product?.price * item.quantity}
                        </div>
                      ))}
                    </td>
                    <td>₹{order.totalAmount}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleOrderUpdate(order._id, {
                            status: e.target.value,
                          })
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <select
                        value={order.paymentStatus}
                        onChange={(e) =>
                          handleOrderUpdate(order._id, {
                            paymentStatus: e.target.value,
                          })
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Failed">Failed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
