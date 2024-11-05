// Newsletter Component with Select Component for Customer List
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader } from "./ui/card";
import EmailModal from "./ui/email-modal";
import { motion } from "framer-motion";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "./ui/select";

interface Template {
    id: number;
    title: string;
    content: string;
    target: string;
    username: string;
}

interface Customer {
    name: string;
    first_name: string;
    last_name: string;
    cid: number;
    products: { name: string; price: string }[];
}

interface Product {
    name: string;
    price: string;
    quantity: number;
}

export default function Newsletter() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
        null
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [receiverEmail, setReceiverEmail] = useState("");
    const [emailContent, setEmailContent] = useState("");
    const [editableFields, setEditableFields] = useState<string[]>([]);
    const [baseContent, setBaseContent] = useState("");

    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
        null
    );
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [topProducts, setTopProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8080/api/newsletter/all"
                );
                setTemplates(response.data);
            } catch (error) {
                console.error("Error fetching templates:", error);
            }
        };
        fetchTemplates();
    }, []);

    useEffect(() => {
        const fetchCustomersBySegment = async (segmentType: string) => {
            try {
                const mappedSegment = mapSegmentName(segmentType.split(" ")[0]);
                const response = await axios.get(
                    `http://localhost:8080/api/customers/segment?segmentType=${mappedSegment}`
                );
                const customerNames = response.data.map(
                    (customer: Customer) => ({
                        name: `${customer.first_name} ${customer.last_name}`,
                        first_name: customer.first_name,
                        last_name: customer.last_name,
                        cid: customer.cid,
                        products: customer.products,
                    })
                );
                setCustomers([
                    {
                        name: "All",
                        first_name: "",
                        last_name: "",
                        cid: 0,
                        products: [],
                    },
                    ...customerNames,
                ]);
            } catch (error) {
                console.error("Error fetching customers by segment:", error);
            }
        };

        if (selectedTemplate) {
            fetchCustomersBySegment(selectedTemplate.target);
        }
    }, [selectedTemplate]);

    useEffect(() => {
        const fetchTopProducts = async () => {
            if (selectedCustomer && selectedCustomer.cid !== 0) {
                try {
                    const response = await axios.get(
                        `http://localhost:8080/api/orders/customer/${selectedCustomer.cid}/top-products`
                    );
                    setTopProducts(response.data);
                    console.log("Top products:", response.data);
                } catch (error) {
                    console.error("Error fetching top products:", error);
                }
            } else {
                setTopProducts([]);
            }
        };

        fetchTopProducts();
    }, [selectedCustomer]);

    useEffect(() => {
        if (
            selectedCustomer &&
            selectedCustomer.cid !== 0 &&
            topProducts.length > 0
        ) {
            console.log(
                "Handling selected customer with top products:",
                topProducts
            );

            let updatedContent = selectedTemplate?.content || "";

            updatedContent = updatedContent.replace(
                "[Customer Name]",
                selectedCustomer.name
            );

            topProducts.forEach((product, index) => {
                updatedContent = updatedContent.replace(
                    `[Product Name ${index + 1}]`,
                    product.productName
                );
                updatedContent = updatedContent.replace(
                    `[Product Price ${index + 1}]`,
                    product.individualPrice.toString()
                );
            });

            setEmailContent(updatedContent);
        }
    }, [topProducts, selectedCustomer]);

    const handleCustomerSelect = (customerName: string) => {
        const customer = customers.find((c) => c.name === customerName);
        setSelectedCustomer(customer);

        if (customer) {
            console.log("Selected customer:", customer);
        } else {
            console.log("No customer selected or found.");
        }
    };
    const handleInputChange = (field: string, value: string) => {
        if (
            !field.toLowerCase().includes("product name") &&
            !field.toLowerCase().includes("product price") &&
            !field.toLowerCase().includes("customer name")
        ) {
            const regex = new RegExp(`\\[${field}\\]`, "g");
            setEmailContent((prevContent) => prevContent.replace(regex, value));
        }
    };

    const handleTemplateClick = (template: Template) => {
        setSelectedTemplate(template);
        setBaseContent(template.content);
        setEmailContent(template.content);

        const matches = template.content.match(/\[([^\]]+)\]/g) || [];
        setEditableFields(matches.map((match) => match.replace(/[\[\]]/g, "")));
    };

    const parseHtmlToText = (html) => {
        let text = html.replace(/<br\s*\/?>/gi, "\n");

        text = text.replace(/<\/?p>/gi, "\n");

        text = text.replace(/<p class="ql-indent-1">/gi, "\n    ");

        text = text.replace(/<[^>]*>/g, "");

        text = text.replace(/\n\s*\n\s*\n/g, "\n\n");

        text = text.trim();

        return text;
    };

    const sendEmail = async () => {
        if (!receiverEmail || !emailContent) {
            console.error("Receiver email or email content is missing.");
            return;
        }

        try {
            const formattedContent = parseHtmlToText(emailContent);

            if (formattedContent.length > 1800) {
                console.warn("Email content is too long for a GET request.");
                alert("Email content is too long for a GET request.");
                return;
            }

            const encodedSubject = encodeURIComponent(
                selectedTemplate?.title || "Newsletter"
            );
            const encodedMessage = encodeURIComponent(formattedContent);

            const apiUrl = `http://localhost:8080/api/send-email?to=${encodeURIComponent(
                receiverEmail
            )}&subject=${encodedSubject}&message=${encodedMessage}`;

            const response = await axios.get(apiUrl);

            if (response.status === 200) {
                console.log("Email sent successfully:", response.data);
                alert("Email sent successfully!");
            } else {
                console.error("Error sending email:", response.data);
                alert("Failed to send email.");
            }
        } catch (error) {
            console.error("Error during email sending:", error);
            alert("An error occurred while trying to send the email.");
        }
    };

    const handleSendEmail = async () => {
        await sendEmail();
        setIsModalOpen(true);
    };

    const mapSegmentName = (targetSegment: string) => {
        switch (targetSegment.toLowerCase()) {
            case "active":
                return "ACTIVE";
            case "dormant":
                return "DORMANT";
            case "returning":
                return "RETURNING";
            case "frequent shoppers":
                return "FREQUENT";
            case "occasional shoppers":
                return "OCCASIONAL";
            case "one-time buyers":
                return "ONETIME";
            case "high-value customers":
                return "HIGHVALUE";
            case "mid-tier customers":
                return "MIDTIER";
            case "low-spend customers":
                return "LOWSPEND";
            default:
                return targetSegment;
        }
    };

    return (
        <motion.section
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.5 } }}
        >
            <div className="w-full px-6 py-8">
                {!selectedTemplate ? (
                    // Grid layout for displaying templates
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {templates.map((template) => (
                            <div
                                key={template.id}
                                className="bg-white shadow-lg rounded-lg p-6 text-center transition-transform transform hover:scale-105 cursor-pointer"
                                onClick={() => handleTemplateClick(template)}
                            >
                                <h3 className="text-md font-bold mb-2">
                                    {template.title}
                                </h3>
                                <p className="text-sm text-gray-500 mb-1">
                                    Target: {template.target}
                                </p>
                                <p className="text-sm text-gray-500 mb-1">
                                    Created By: {template.username}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        <Card>
                            <CardHeader>
                                <h3 className="text-xl font-bold ">
                                    {selectedTemplate.title}
                                </h3>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {editableFields.includes(
                                        "Customer Name"
                                    ) && (
                                        <div className="mb-4 flex items-center space-x-4 ">
                                            <p className="text-sm font-semibold whitespace-nowrap">
                                                Choose a customer:
                                            </p>
                                            <Select
                                                onValueChange={
                                                    handleCustomerSelect
                                                }
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a customer" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {customers.map(
                                                        (customer, index) => (
                                                            <SelectItem
                                                                key={
                                                                    customer.name +
                                                                    index
                                                                }
                                                                value={
                                                                    customer.name
                                                                }
                                                            >
                                                                {customer.name}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                    <div className="flex flex-wrap gap-2 items-center">
                                        {editableFields.map((field) => {
                                            if (
                                                !field
                                                    .toLowerCase()
                                                    .includes("product name") &&
                                                !field
                                                    .toLowerCase()
                                                    .includes(
                                                        "product price"
                                                    ) &&
                                                !field
                                                    .toLowerCase()
                                                    .includes("customer name")
                                            ) {
                                                return (
                                                    <span
                                                        key={field}
                                                        contentEditable
                                                        onBlur={(e) =>
                                                            handleInputChange(
                                                                field,
                                                                e.target
                                                                    .textContent ||
                                                                    ""
                                                            )
                                                        }
                                                        className="border border-slate-400 rounded-sm p-1 mx-1"
                                                        suppressContentEditableWarning={
                                                            true
                                                        }
                                                    >
                                                        [{field}]
                                                    </span>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>

                                    {emailContent && (
                                        <div
                                            className="text-sm text-gray-600"
                                            dangerouslySetInnerHTML={{
                                                __html: emailContent,
                                            }}
                                        ></div>
                                    )}
                                    <button
                                        className="bg-green-800 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-lg mt-5"
                                        onClick={handleSendEmail}
                                    >
                                        Send Email
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                        <EmailModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onSendEmail={handleSendEmail}
                            emailContent={emailContent}
                            setReceiverEmail={setReceiverEmail}
                            receiverEmail={receiverEmail}
                        />
                    </div>
                )}
            </div>
        </motion.section>
    );
}
