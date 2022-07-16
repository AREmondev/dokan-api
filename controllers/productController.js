import Product from "../models/productModels.js";
import asyncHandler from "express-async-handler";

export const createProduct = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { name, price, countInStock, expireDate } = req.body;
  const product = await Product.create({
    name,
    price,
    countInStock,
    expireDate,
  });
  if (product) {
    res.status(201).json({
      product,
    });
  }
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const product = await Product.find({});
  res.send(product);
});

export const getSingleProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404);
    throw new Error("Product Not Found");
  }
});
