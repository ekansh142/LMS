import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const PURCHASE_COURSE_API = "https://lms-hhw0.onrender.com/api/v1/purchase/"

export const coursePurchaseApi = createApi({
    reducerPath: "purchaseCourseApi",
    tagTypes: "Refetch_Creator_Course",
    baseQuery: fetchBaseQuery({
        baseUrl: PURCHASE_COURSE_API,
        credentials: "include"
    }),
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: ({ creatorId, courseId }) => ({
                url: "create-order",
                method: "POST",
                body: { creatorId, courseId }
            })
        }),
        verifyPayment: builder.mutation({
            query: ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => ({
                url: "verify-payment",
                method: "POST",
                body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
            })
        }),
        getCourseDetailWithStatus: builder.query({
            query: (courseId) => ({
                url: `/course/${courseId}/detail-with-status`,
                method: "GET"
            })
        }),
        getAllPurchasedCourses: builder.query({
            query: () => ({
                url: "/",
                method: "GET"
            })
        })
    })
})

export const {
    useCreateOrderMutation,
    useVerifyPaymentMutation,
    useGetCourseDetailWithStatusQuery,
    useGetAllPurchasedCoursesQuery
} = coursePurchaseApi