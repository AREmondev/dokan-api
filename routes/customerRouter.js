import express from "express";
import {
  createNewCustomer,
  payment,
  getSingleCustomer,
  createOrder,
  getAllCustomer,
  filterCustomer,
} from "../controllers/customerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// router.route('/login').post(authCustomer)
// router
//   .route('/profile')
//   .get(protect, getCustomerProfile)
//   .put(protect, updateCustomerProfile)

// router.route('/signup').post(protect, registerNewCustomer)
router.route("/create-customer").post(protect, createNewCustomer);
router.route("/").get(protect, getAllCustomer);

router.route("/filterCustomer").get(protect, filterCustomer);
router.route("/:id").get(protect, getSingleCustomer);
router.route("/payment").post(protect, payment);
router.route("/order").post(protect, createOrder);


export default router;
