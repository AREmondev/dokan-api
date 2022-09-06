import Order from '../models/orderModels.js'
import asyncHandler from 'express-async-handler'
import Transition from '../models/transitionModels.js'

export const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body
  console.log(req.body)
  if (orderItems && orderItems.length === 0) {
    res.status(400)
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    })
    const createdOrder = await order.save()
    res.json(createdOrder)
  }
})
export const getAllOrder = asyncHandler(async (req, res) => {
  if (req.user.isAdmin == true) {
    const transition = await Transition.find().populate('customer').populate('createdBy')
    console.log(transition)
    if (transition) {
      res.json(transition)
    } else {
      res.status(404).json({ message: 'Order Not Found' })
    }
  }
 
});
export const singleOrderItems = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email',
  )

  if (order) {
    res.json(order)
  } else {
    res.status(404).json({ message: 'Order Not Found' })
  }
})
export const userOrderItems = asyncHandler(async (req, res) => {
  const order = await Order.find({ user: req.user })

  if (order) {
    res.json(order)
  } else {
    res.status(404).json({ message: 'Order Not Found' })
  }
})
export const allOrderItems = asyncHandler(async (req, res) => {
  const order = await Order.find({})
  if (order) {
    res.json(order)
  } else {
    res.status(404).json({ message: 'Order Not Found' })
  }
})

export const updateOrderToPay = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: req.body._id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    }
    const updatedOrder = await order.save()
    res.json(updatedOrder)
  } else {
    res.status(404).json({ message: 'Order Not Found' })
  }
})

export const cancelOrderItems = asyncHandler(async (req, res) => {
  const order = await Order.deleteOne({ id: req.body.id })
  console.log(order)
  if (order) {
    console.log('order Deleted')
    res.json(order)
  } else {
    res.status(404).json({ message: 'Order Not Found' })
  }
})
