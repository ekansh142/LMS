import express from 'express'
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { createOrder, getAllPurchasedCourses, getCourseDetailWithPurchaseStatus, verifyPayment } from '../controllers/coursePurchase.controller.js';
import { get } from 'mongoose';

const router = express.Router();

router.post('/create-order', isAuthenticated, createOrder);
router.post('/verify-payment', isAuthenticated, verifyPayment);
router.get('/course/:courseId/detail-with-status', isAuthenticated, getCourseDetailWithPurchaseStatus);
router.get('/', isAuthenticated, getAllPurchasedCourses);

export default router;