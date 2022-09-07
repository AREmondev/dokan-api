import Product from "../models/productModels.js";
import asyncHandler from "express-async-handler";

export const createProduct = asyncHandler(async (req, res) => {
  if (req.user.isAdmin == true) {
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
  }else{
    res.status(204).json({
      message: "You are not admin",
    });
  }
 
});

export const getAllProducts = asyncHandler(async (req, res) => {
  if (req.user.isAdmin == true) {
    const product = await Product.find({});
    res.send(product);
  }res.status(204).json({
    message: "You are not admin",
  });
  
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
