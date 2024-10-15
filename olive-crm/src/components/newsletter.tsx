"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";

export default function Newsletter() {
    const [customerName, setCustomerName] = useState<string>("Customer Name");
    const [productName1, setProductName1] = useState<string>("Product Name 1");
    const [productPrice1, setProductPrice1] = useState<string>("Product Price");
    const [discount1, setDiscount1] = useState<string>("Discount Percentage");
    const [promoCode1, setPromoCode1] = useState<string>("Promo Code");

    const [productName2, setProductName2] = useState<string>("Product Name 2");
    const [productPrice2, setProductPrice2] = useState<string>("Product Price");
    const [discount2, setDiscount2] = useState<string>("Discount Percentage");
    const [promoCode2, setPromoCode2] = useState<string>("Promo Code");

    const [productName3, setProductName3] = useState<string>("Product Name 3");
    const [productPrice3, setProductPrice3] = useState<string>("Product Price");
    const [discount3, setDiscount3] = useState<string>("Discount Percentage");
    const [promoCode3, setPromoCode3] = useState<string>("Promo Code");

    const [email] = useState<string>("");

    const handleBlur =
        (setter: React.Dispatch<React.SetStateAction<string>>) =>
        (e: React.FocusEvent<HTMLSpanElement>) =>
            setter(e.target.textContent || "");

    const handleSendEmail = async () => {
        const receiverEmail = prompt(
            "Please enter the customer's email address:",
            email
        );
        if (!receiverEmail) return; // Exit if no email is provided

        const emailContent = `
            Dear ${customerName},

            We've curated something special for you! 
            Based on your recent purchases and browsing history, here are some exclusive offers and recommendations we think you'll love.

            Top Picks for You:
            1. ${productName1} 
                    Price: $${productPrice1}, 
                    Discount: ${discount1}% off with code ${promoCode1}
            2. ${productName2} 
                    Price: $${productPrice2}, 
                    Discount: ${discount2}% off with code ${promoCode2}
            3. ${productName3} 
                    Price: $${productPrice3}, 
                    Discount: ${discount3}% off with code ${promoCode3}

            Take advantage of these personalized offers and discover more. Shop now and enjoy the best deals tailored just for you!

            Warm regards,
            Marketing team
        `;

        // Confirm email content with user
        const isConfirmed = confirm(
            `Please confirm the email content:\n\n${emailContent}`
        );
        if (!isConfirmed) return; // Exit if not confirmed

        // Encode the email content for the URL
        const encodedSubject = encodeURIComponent(
            "Personalized Offers for You!"
        );
        const encodedMessage = encodeURIComponent(emailContent);

        // Build the full URL for the backend API
        const apiUrl = `http://localhost:8080/api/send-email?to=${receiverEmail}&subject=${encodedSubject}&message=${encodedMessage}`;

        // Send the request to the backend API
        try {
            const response = await fetch(apiUrl);
            if (response.ok) {
                alert("Email sent successfully!");
            } else {
                alert("Failed to send the email.");
            }
        } catch (error) {
            console.error("Error sending email:", error);
            alert("An error occurred while sending the email.");
        }
    };

    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            <div className="container mx-auto px-6 py-8 mt-20">
                <h3 className="text-gray-700 text-3xl font-medium p-5">
                    Newsletter Designer
                </h3>
                <Card>
                    <CardHeader></CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <p>
                                Dear{" "}
                                <span
                                    contentEditable
                                    onBlur={handleBlur(setCustomerName)}
                                    className="border border-slate-400 rounded-sm p-1"
                                    suppressContentEditableWarning={true}
                                >
                                    {customerName}
                                </span>
                                ,
                            </p>
                            <p>
                                We’ve curated something special for you! Based
                                on your recent purchases and browsing history,
                                here are some exclusive offers and
                                recommendations we think you'll love.
                            </p>
                            <p>Top Picks for You:</p>
                            <ol className="list-decimal list-inside">
                                <li className="p-2">
                                    <span
                                        contentEditable
                                        onBlur={handleBlur(setProductName1)}
                                        className="border border-slate-400 rounded-sm p-1"
                                        suppressContentEditableWarning={true}
                                    >
                                        {productName1}
                                    </span>
                                    <ul className="list-disc list-inside ml-3">
                                        <li className="p-2">
                                            Price: $
                                            <span
                                                contentEditable
                                                onBlur={handleBlur(
                                                    setProductPrice1
                                                )}
                                                className="border border-slate-400 rounded-sm p-1 m-1"
                                                suppressContentEditableWarning={
                                                    true
                                                }
                                            >
                                                {productPrice1}
                                            </span>
                                        </li>
                                        <li className="p-2">
                                            Discount:
                                            <span
                                                contentEditable
                                                onBlur={handleBlur(
                                                    setDiscount1
                                                )}
                                                className="border border-slate-400 rounded-sm p-1 m-1"
                                                suppressContentEditableWarning={
                                                    true
                                                }
                                            >
                                                {discount1}
                                            </span>
                                            % off with code
                                            <span
                                                contentEditable
                                                onBlur={handleBlur(
                                                    setPromoCode1
                                                )}
                                                className="border border-slate-400 rounded-sm p-1 m-1"
                                                suppressContentEditableWarning={
                                                    true
                                                }
                                            >
                                                {promoCode1}
                                            </span>
                                        </li>
                                    </ul>
                                </li>
                                <li className="p-2">
                                    <span
                                        contentEditable
                                        onBlur={handleBlur(setProductName2)}
                                        className="border border-slate-400 rounded-sm p-1"
                                        suppressContentEditableWarning={true}
                                    >
                                        {productName2}
                                    </span>
                                    <ul className="list-disc list-inside ml-3">
                                        <li className="p-2">
                                            Price: $
                                            <span
                                                contentEditable
                                                onBlur={handleBlur(
                                                    setProductPrice2
                                                )}
                                                className="border border-slate-400 rounded-sm p-1 m-1"
                                                suppressContentEditableWarning={
                                                    true
                                                }
                                            >
                                                {productPrice2}
                                            </span>
                                        </li>
                                        <li className="p-2">
                                            Discount:
                                            <span
                                                contentEditable
                                                onBlur={handleBlur(
                                                    setDiscount2
                                                )}
                                                className="border border-slate-400 rounded-sm p-1 m-1"
                                                suppressContentEditableWarning={
                                                    true
                                                }
                                            >
                                                {discount2}
                                            </span>
                                            % off with code
                                            <span
                                                contentEditable
                                                onBlur={handleBlur(
                                                    setPromoCode2
                                                )}
                                                className="border border-slate-400 rounded-sm p-1 m-1"
                                                suppressContentEditableWarning={
                                                    true
                                                }
                                            >
                                                {promoCode2}
                                            </span>
                                        </li>
                                    </ul>
                                </li>
                                <li className="p-2">
                                    <span
                                        contentEditable
                                        onBlur={handleBlur(setProductName3)}
                                        className="border border-slate-400 rounded-sm p-1"
                                        suppressContentEditableWarning={true}
                                    >
                                        {productName3}
                                    </span>
                                    <ul className="list-disc list-inside ml-3">
                                        <li className="p-2">
                                            Price: $
                                            <span
                                                contentEditable
                                                onBlur={handleBlur(
                                                    setProductPrice3
                                                )}
                                                className="border border-slate-400 rounded-sm p-1 m-1"
                                                suppressContentEditableWarning={
                                                    true
                                                }
                                            >
                                                {productPrice3}
                                            </span>
                                        </li>
                                        <li className="p-2">
                                            Discount:
                                            <span
                                                contentEditable
                                                onBlur={handleBlur(
                                                    setDiscount3
                                                )}
                                                className="border border-slate-400 rounded-sm p-1 m-1"
                                                suppressContentEditableWarning={
                                                    true
                                                }
                                            >
                                                {discount3}
                                            </span>
                                            % off with code
                                            <span
                                                contentEditable
                                                onBlur={handleBlur(
                                                    setPromoCode3
                                                )}
                                                className="border border-slate-400 rounded-sm p-1 m-1"
                                                suppressContentEditableWarning={
                                                    true
                                                }
                                            >
                                                {promoCode3}
                                            </span>
                                        </li>
                                    </ul>
                                </li>
                            </ol>
                            <p>
                                Take advantage of these personalized offers and
                                discover more with Timperio. Shop now and enjoy
                                the best deals tailored just for you!
                            </p>
                            <p>Warm regards,</p>
                            <p>Marketing team</p>
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={handleSendEmail}
                            >
                                Send Email
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
