import Customer from '../models/customerModels.js'
import asyncHandler from 'express-async-handler'
import generateToken from '../utills/generateToken.js'
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
    const { name, father_name, village, phone_number, newCustomer, total_due, previous_due, password } = req.body
    if(req.user.isAdmin == true){
      let createdBy = req.user.name
      const customer = await Customer.create({
        name, father_name, village, phone_number, newCustomer, total_due, previous_due, password, createdBy
      })
    
      if (customer) {
        res.status(201).json({
          customer,
          token: generateToken(customer._id),
        })
      } else {
        res.status(400).JSON({ message: 'Invalid customer data' })
      }
    }else {
      res.status(401).JSON({ message: 'Unauthorized User' })
    }
    
})
  