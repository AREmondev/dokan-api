import Customer from "../models/customerModels.js";
import Product from "../models/productModels.js";
import Transition from "../models/transitionModels.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utills/generateToken.js";
import fetch from "node-fetch";

export const createNewCustomer = asyncHandler(async (req, res) => {
  const {
    name,
    father_name,
    village,
    phone_number,
    total_due,
  } = req.body;
  if (req.user.isAdmin == true) {
    console.log(req.body)
    let createdBy = req.user._id;
    const customer = await Customer({
      name,
      father_name,
      village,
      phone_number,
      total_due,
      createdBy,
    });
    console.log(customer);
    let newCustomer = await customer.save();
    console.log(newCustomer)

    if (customer) {
      res.status(201).json({
        customer,
        token: generateToken(customer._id),
      });
    } else {
      res.status(400);
    }
  } else {
    res.status(401).json({ message: "Unauthorized User" });
  }
});
export const getAllCustomer = asyncHandler(async (req, res) => {
  if (req.user.isAdmin == true) {
    const customer = await Customer.find()
      .populate("transitions")
      .populate("createdBy");

    if (customer) {
      res.status(200).json({
        customer,
      });
    } else {
      res.status(400).json({ message: "Invalid customer data" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized User" });
  }
});
export const filterCustomer = asyncHandler(async (req, res) => {
  if (req.user.isAdmin == true) {
    console.log(req.query.filter);
    Customer.find({}) //grabs all subcategoris
      .where("name")
      .equals("Ro")
      .exec(function (err, data) {
        if (err) {
          console.log(err);
          console.log("error returned");
          res.send(500, { error: "Failed insert" });
        }

        if (!data) {
          res.send(403, { error: "Authentication Failed" });
        }

        res.send(200, data);
        console.log("success generate List");
      });
    // Customer.find(
    //   {
    //     $or: [
    //       {
    //         name: `${req.query.filter}`,
    //       },
    //       {
    //         phone: req.query.filter,
    //       },
    //     ],
    //     // $and: [
    //     //   {
    //     //     village: "Andhorail",
    //     //   },
    //     // ],
    //   },
    //   function (err, docs) {
    //     console.log(docs);
    //     if (!err) {
    //       res.status(200).json({
    //         docs,
    //       });
    //     } else {
    //       res.status(400).json({ message: "Invalid customer data" });
    //     }
    //   }
    // );
  } else {
    res.status(401).json({ message: "Unauthorized User" });
  }
});
export const getSingleCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id).populate(
    "transitions"
  );

  if (customer) {
    res.status(200).json({
      customer,
    });
  } else {
    res.status(400).json({ message: "Invalid customer data" });
  }
});

export const createOrder = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { products, type, customer } = req.body;
  let allProduct = await Product.find({ _id: { $in: Object.keys(products) } });
  let transitionAll = await Transition.find({ customer: customer });

  var total = 0;
  var newStock;
  if(type == 'order'){
    for (let pd of allProduct) {
      if (pd.countInStock > products[pd._id].qty) {
        total += products[pd._id].qty * pd.price;
        newStock = pd.countInStock - products[pd._id].qty;
        pd.countInStock = newStock;
  
        Product.updateOne(
          { _id: pd._id },
          { countInStock: newStock },
          function (err, records) {
            if (err) {
              return false;
            } else {
              return true;
            }
          }
        );
  
        products[pd._id] = { pd, ...products[pd._id] };
      } else {
        res.status(402).json({ message: `${pd.name} Stock out` });
        res.end();
      }
    }
    let prevDue = 0
    if(transitionAll.length > 0){
      prevDue = transitionAll[transitionAll.length - 1].totalDue
      ? transitionAll[transitionAll.length - 1].totalDue
      : 0;
    }
    let totalDue = prevDue + total;
    if (req.user.isAdmin == true) {
      let createdBy = req.user._id;
      const transition = await Transition.create({
        products,
        type,
        customer,
        totalDue: totalDue,
        createdBy,
        due: total,
      });
  
      if (transition) {
        let prevCustomer = await Customer.findOne({_id: customer})
        prevCustomer.total_due = parseInt(prevCustomer.total_due) +  parseInt(transition.due)
        prevCustomer.transitions.push(transition._id)
        let newCustomer = await prevCustomer.save()
        if(newCustomer){
          res.status(201).json({
            transition,
          });
        }
      } else {
        res.status(400).json({ message: "Invalid customer data" });
      }
    } else {
      res.status(401).json({ message: "Unauthorized User" });
    }
  }else if (type === 'stock'){
    console.log("reached")
    for (let pd of allProduct) {
        total += products[pd._id].qty * pd.price;
        newStock = pd.countInStock + products[pd._id].qty;
        console.log(newStock)
        pd.countInStock = newStock;
  
        Product.updateOne(
          { _id: pd._id },
          { countInStock: newStock },
          function (err, records) {
            if (err) {
              return false;
            } else {
              return true;
            }
          }
        );
        console.log(Product)
  
        products[pd._id] = { pd, ...products[pd._id] };
      
    }
    if (req.user.isAdmin == true) {
      let createdBy = req.user._id;
      const transition = await Transition.create({
        products,
        type,
        customer,
        totalDue: null,
        createdBy,
        due: total,
      });
  
      console.log(transition)
      res.status(201).json({
        transition,
      });
    } else {
      res.status(401).json({ message: "Unauthorized User" });
    }
  }
});


export const payment = asyncHandler(async (req, res) => {
  const { payment, type, customer } = req.body;
  console.log(req.body);
  if (req.user.isAdmin == true) {
    let createdBy = req.user._id;
    let transitionAll = await Transition.find({ customer: customer });
    let mycstmer = await Customer.findOne({ _id: customer });
    console.log("prevDue", mycstmer);

    let prevDue = mycstmer.total_due;

    let totalDue = parseInt(prevDue) - parseInt(payment);
    console.log(totalDue);
    const transition = await Transition.create({
      payment,
      type,
      customer,
      createdBy,
      totalDue,
    });
    if (transition) {
      let newCustomer = await Customer.updateOne(
        {
          _id: customer,
        },
        {
          $set: { total_due: totalDue },
          $push: {
            transitions: transition._id,
          },
        }
      );
      res.status(201).json({
        transition,
      });
      if (mycstmer.phone_number || true) {
        let today = "" + new Date();
        let text = `আপনি আজকে(${today.split(" ")[1]} ${today.split(" ")[2]} ${
          today.split(" ")[3]
        }) ${payment}  টাকা জমা দিয়েছেন । আপনার বর্তমান বাকি ${newCustomer.totalDue} টাকা ।
          মেসার্স রহমান ট্রেডার্স `;

        const url = `http://66.45.237.70/api.php?username=01644686490&password=MVBK93WP&number=8801644686490&message=${text}`;
        const headers = {
          "Content-Type": "application/x-www-form-urlencoded",
        };

        fetch(url, { method: "POST", headers: headers })
          .then((res) => {
            return res.json();
          })
          .then((json) => {
            // Do something with the returned data.
            console.log(json);
          });
      }
    } else {
      res.status(400).json({ message: "Invalid customer data" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized User" });
  }
});
