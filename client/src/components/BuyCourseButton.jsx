import { useCreateOrderMutation, useGetCourseDetailWithStatusQuery, useVerifyPaymentMutation } from '@/features/api/purchaseCourseApi';
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react';

const BuyCourseButton = ({ course, courseId }) => {

    const creatorId = course?.creator?._id;

    const [createOrder, { data, isLoading, isSuccess, isError, error }] = useCreateOrderMutation();

    const [verifyPayment, { data: paymentData, isSuccess: paymentSuccess }] = useVerifyPaymentMutation();

    const { refetch } = useGetCourseDetailWithStatusQuery(courseId);

    const [paymentResponse, setPaymentResponse] = useState(null);
    const purchaseHandler = async () => {
        try {
            await createOrder({ creatorId, courseId });
        } catch (error) {
            console.error("Error creating order:", error);
        }
    }
    useEffect(() => {
        // Check if Razorpay script is loaded
        if (!window.Razorpay) {
            console.error("Razorpay SDK not loaded");
            return;
        }

        // Check successful data fetch and backend response
        if (isSuccess && data?.success) {
            console.log("Payment Data:", data);

            const options = {
                key: data.key,
                amount: data.amount,
                currency: data.currency,
                name: "Course Purchase",
                description: "Buy your course",
                order_id: data.orderId,
                handler: async function (response) {
                    console.log("Payment Response:", response);
                    setPaymentResponse(response);
                    try {
                        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;
                        await verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature });
                    } catch (error) {
                        console.log("Error verifying payment:", error);
                        alert("Payment verification failed. Please try again.");
                    }
                },
                prefill: {
                    name: "User Name",
                    email: "user@example.com",
                    contact: "9999999999"
                }
            };

            try {
                const razorpay = new window.Razorpay(options);
                razorpay.on("payment.failed", function (response) {
                    alert("Payment Failed: " + response.error.description);
                });
                razorpay.open();
            } catch (error) {
                console.error("Error initializing Razorpay:", error);
            }
        }

        // Handle error state if needed
        if (isError) {
            console.error("Payment Error:", error);
        }
    }, [data, isSuccess, isError, error]);



    useEffect(() => {
        if (paymentSuccess && paymentData?.success) {
            alert("Payment Verified Successfully");
            refetch();
        }
    }, [paymentSuccess, paymentData]);

    // Load Razorpay script dynamically in another useEffect
    useEffect(() => {
        const loadScript = () => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            document.body.appendChild(script);
        };

        if (!window.Razorpay) {
            loadScript();
        }
    }, []);
    return (
        <div>
            <Button disabled={isLoading} onClick={purchaseHandler} className='w-full'>
                {
                    isLoading ? (
                        <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please Wait
                        </>
                    ) : "Purchase Course"
                }

            </Button>
        </div>
    )
}

export default BuyCourseButton
