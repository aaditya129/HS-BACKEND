const mongoose = require('mongoose'); // Add this line
const Product = require('../models/Product'); // Ensure the correct path to Product model

// @desc    Add a new product
// @route   POST /api/products
// @access  Public (or Private if only admins can add products)
const addProduct = async (req, res) => {
    try {
        const { name, photo, price, rating } = req.body;

        const newProduct = new Product({
            name,
            photo,
            price,
            rating
        });

        const savedProduct = await newProduct.save();

        res.status(201).json({
            success: true,
            data: savedProduct,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};

// @desc    Edit an existing product
// @route   PUT /api/products/:id
// @access  Public (or Private if only admins can edit products)
const editProduct = async (req, res) => {
    try {
        const { name, photo, price, rating } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name,
                photo,
                price,
                rating
            },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.status(200).json({
            success: true,
            data: updatedProduct,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};

// @desc    Add a review to a product
// @route   POST /api/products/:id/reviews
// @access  Public (or Private if only authenticated users can leave reviews)
const addReview = async (req, res) => {
    try {
        const { user, rating, comment } = req.body;
        
        console.log('User ID:', user);

        // Ensure 'user' is a valid ObjectId if you are using ObjectId for user references
        if (!mongoose.Types.ObjectId.isValid(user)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID',
            });
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        const review = {
            user: new mongoose.Types.ObjectId(user), // Use 'new' keyword to create ObjectId
            rating: Number(rating),
            comment,
        };

        product.reviews.push(review);

        // Save the product, which will trigger pre-save middleware to update the average rating
        await product.save();

        res.status(201).json({
            success: true,
            message: 'Review added',
        });
    } catch (error) {
        console.error('Error adding review:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

const editReview = async (req, res) => {
    try {
        const { productId, reviewId } = req.params;
        const { user, rating, comment } = req.body;

        // Find the product by ID
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Find the review by ID
        const review = product.reviews.id(reviewId);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
            });
        }

        // Check if the review belongs to the user
        if (review.user.toString() !== user) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to edit this review',
            });
        }

        // Update the review fields
        if (rating) review.rating = rating;
        if (comment) review.comment = comment;

        // Save the product, which will trigger the pre-save middleware to update the average rating
        await product.save();

        res.status(200).json({
            success: true,
            message: 'Review updated successfully',
            data: product,
        });
    } catch (error) {
        console.error('Error editing review:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

module.exports = {
    addProduct,
    getProductById,
    editProduct,
    addReview,
    editReview
};
