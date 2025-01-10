// const url = "mongodb://127.0.0.1:27017/FoodDeliveryAndManagementSystem";
// export default url;
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.MONGO_URL;

export default url;