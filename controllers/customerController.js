import Customer from "../models/customerModels.js";
import Product from "../models/productModels.js";
import Transition from "../models/transitionModels.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utills/generateToken.js";
import fetch from "node-fetch";

// export const authCustomer = asyncHandler(async (req, res) => {
//   const { email, password } = req.body
//   const customer = await Customer.findOne({ email })

//   if (customer) {
//     const passwordMatch = await customer.matchPassword(password)
//     if (customer && passwordMatch) {
//       res.json({
//         _id: customer._id,
//         name: customer.name,
//         email: customer.email,
//         isAdmin: customer.isAdmin,
//         token: generateToken(customer._id),
//       })
//     } else {
//       res.status(400)
//     }
//   } else {
//     res.status(400)
//   }
// })
// export const registerNewCustomer = asyncHandler(async (req, res) => {
//   const { name, email, password } = req.body

//   const customerExists = await Customer.findOne({ email })

//   if (customerExists) {
//     res.status(400).json({ message: 'Customer already exists' })
//   }

//   const customer = await Customer.create({
//     name,
//     email,
//     password,
//   })

//   if (customer) {
//     res.status(201).json({
//       _id: customer._id,
//       name: customer.name,
//       email: customer.email,
//       isAdmin: customer.isAdmin,
//       token: generateToken(customer._id),
//     })
//   } else {
//     res.status(400).JSON({ message: 'Invalid customer data' })
//   }
// })

// // Get Customer Profile
// export const getCustomerProfile = asyncHandler(async (req, res) => {
//   const customer = await Customer.findById(req.customer._id)

//   if (customer) {
//     res.json({
//       _id: customer._id,
//       name: customer.name,
//       email: customer.email,
//       isAdmin: customer.isAdmin,
//     })
//   }
// })
// // Update Customer Profile
// export const updateCustomerProfile = asyncHandler(async (req, res) => {
//   const customer = await Customer.findById(req.customer._id)

//   const { name, email, password } = req.body
//   if (customer) {
//     customer.name = name
//     customer.email = email
//     if (password) {
//       customer.password = password
//     }
//     const upDateCustomer = await customer.save()
//     res.json({
//       _id: customer._id,
//       name: customer.name,
//       email: customer.email,
//       isAdmin: customer.isAdmin,
//       token: generateToken(customer._id),
//     })
//   } else {
//     res.json({ message: 'Customer Not Found' })
//   }
// })

export const createNewCustomer = asyncHandler(async (req, res) => {
  const {
    name,
    father_name,
    village,
    phone_number,
    newCustomer,
    total_due,
    previous_due,
  } = req.body;
  if (req.user.isAdmin == true) {
    let createdBy = req.user._id;
    const customer = await Customer.create({
      name,
      father_name,
      village,
      phone_number,
      newCustomer,
      total_due,
      previous_due,
      createdBy,
    });

    if (customer) {
      res.status(201).json({
        customer,
        token: generateToken(customer._id),
      });
    } else {
      res.status(400).JSON({ message: "Invalid customer data" });
    }
  } else {
    res.status(401).JSON({ message: "Unauthorized User" });
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
      res.status(400).JSON({ message: "Invalid customer data" });
    }
  } else {
    res.status(401).JSON({ message: "Unauthorized User" });
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
    //       res.status(400).JSON({ message: "Invalid customer data" });
    //     }
    //   }
    // );
  } else {
    res.status(401).JSON({ message: "Unauthorized User" });
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
    res.status(400).JSON({ message: "Invalid customer data" });
  }
});

export const createOrder = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { products, type, customer } = req.body;
  let allProduct = await Product.find({ _id: { $in: Object.keys(products) } });
  let transitionAll = await Transition.find({ customer: customer });

  let total = 0;
  let newStock;
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
      res.status(402).JSON({ message: `${pd.name} Stock out` });
      res.end();
    }
  }
  console.log(allProduct);
  let prevDue = transitionAll[transitionAll.length - 1].totalDue
    ? transitionAll[transitionAll.length - 1].totalDue
    : 0;
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
      await Customer.updateOne(
        {
          _id: customer,
        },
        {
          $push: {
            transitions: transition._id,
          },
        }
      );
      res.status(201).json({
        transition,
      });
    } else {
      res.status(400).JSON({ message: "Invalid customer data" });
    }
  } else {
    res.status(401).JSON({ message: "Unauthorized User" });
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
        }) ২৫০ টাকা জমা দিয়েছেন । আপনার বর্তমান বাকি ৮০ টাকা ।
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
      res.status(400).JSON({ message: "Invalid customer data" });
    }
  } else {
    res.status(401).JSON({ message: "Unauthorized User" });
  }
});
