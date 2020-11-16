// Incase of common js we use require. Below we are converting it to ES. For this add a type:module in package.json and include .js while importing files and change exporting module in products to ES module standards
// const express = require('express')
// const dotenv = require('dotenv')
// const products = require('./data/products')

import express from 'express';
import dotenv from 'dotenv';
import products from './data/products.js'


dotenv.config()

const app = express()

app.get('/', (req, res) => {
    res.send('API is running....')
})

app.get('/api/products', (req, res) => {
    res.json(products)
})

app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p._id === req.params.id)
    res.json(product)
})

const PORT = process.env.PORT || 5000

app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    )

