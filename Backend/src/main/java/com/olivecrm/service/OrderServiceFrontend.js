import axios from 'axios';

const API_URL = 'http://localhost:8080/api/orders';

const orderService = {
    // Get all orders with pagination
    getAllOrders(page = 0, size = 10) {
        return axios.get(`${API_URL}?page=${page}&size=${size}`);
    },

    // Get orders by customer ID
    getOrdersByCustomerId(customerId) {
        return axios.get(`${API_URL}/customer/${customerId}`);
    },

    // Get orders by sales type
    getOrdersBySalesType(salesType) {
        return axios.get(`${API_URL}/type/${salesType}`);
    },

    // Get orders by sales date
    getOrdersBySalesDate(salesDate) {
        return axios.get(`${API_URL}/date/${salesDate}`);
    },

    // Get orders by total cost
    getOrdersByTotalCost(totalCost) {
        return axios.get(`${API_URL}/total_cost/${totalCost}`);
    },

    // Get orders by various filters
    getOrdersByFilters(filters) {
        return axios.get(`${API_URL}/filter`, { params: filters });
    }
};

export default orderService;
