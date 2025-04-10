import Razorpay from 'razorpay'
import { Course } from '../models/course.model.js';
import { CoursePurchase } from '../models/coursePurchase.model.js';
import crypto from 'crypto'
import { Lecture } from '../models/lecture.model.js';
import { User } from '../models/user.model.js';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

export const createOrder = async (req, res) => {
    try {
        const userId = req.id;
        const { courseId } = req.body;
        const { creatorId } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            })
        }

        const newPurchase = new CoursePurchase({
            courseId,
            userId,
            creatorId,
            amount: course.coursePrice,
            status: "pending"
        })

        const options = {
            amount: course.coursePrice * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes: {
                courseId: courseId,
                userId: userId
            }
        }

        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(400).json({ success: false, message: "Error creating order" });
        }

        newPurchase.paymentId = order.id;
        await newPurchase.save();

        return res.status(200).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID
        })
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ success: false, message: "Payment initiation failed", error });
    }
}

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Missing payment details"
            })
        }

        const secret = process.env.RAZORPAY_KEY_SECRET;

        const hmac = crypto.createHmac("sha256", secret);

        hmac.update(razorpay_order_id + '|' + razorpay_payment_id);

        const generatedSignature = hmac.digest('hex');

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            })
        }
        const purchase = await CoursePurchase.findOneAndUpdate(
            { paymentId: razorpay_order_id },
            { status: "completed" },
            { new: true }
        ).populate({ path: "courseId" })

        if (!purchase) {
            return res.status(404).json({ success: false, message: "Purchase record not found" });
        }

        if (purchase.courseId && purchase.courseId.lectures.length > 0) {
            await Lecture.updateMany(
                { _id: { $in: purchase.courseId.lectures } },
                { $set: { isPreviewFree: true } }
            )
        }

        await purchase.save();

        await User.findByIdAndUpdate(
            purchase.userId,
            { $addToSet: { enrolledCourses: purchase.courseId._id } },
            { new: true }
        )

        await Course.findByIdAndUpdate(
            purchase.courseId,
            { $addToSet: { enrolledStudents: purchase.userId } },
            { new: true }
        )

        return res.status(200).json({
            success: true,
            message: "Payment successfull",
            purchase
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const deleteAllPurchases = async () => {
    try {
        await CoursePurchase.deleteMany({});
        console.log("All purchase records deleted successfully");
    } catch (error) {
        console.error("Error deleting purchases:", error);
    }
};

export const getCourseDetailWithPurchaseStatus = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;
        const course = await Course.findById(courseId).populate({ path: "creator" }).populate({ path: "lectures" });
        let purchased = await CoursePurchase.findOne({ userId, courseId, status: "completed" });
        purchased = (purchased?.status === "completed") ? true : false;

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }
        return res.status(200).json({
            success: true,
            course,
            purchased: purchased
        })
    } catch (error) {
        console.error("Error fetching course details:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const getAllPurchasedCourses = async (req, res) => {
    try {
        const creatorId = req.id;
        const purchasedCourses = await CoursePurchase.find({ creatorId, status: "completed" }).populate("courseId");
        if (!purchasedCourses || purchasedCourses.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No purchased courses found"
            })
        }
        return res.status(200).json({
            success: true,
            purchasedCourses
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}