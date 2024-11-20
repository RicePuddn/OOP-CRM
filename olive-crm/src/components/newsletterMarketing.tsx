// Newsletter Component with Select Component for Customer List
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader } from "./ui/card";
import EmailModal from "./ui/email-modal";
import { motion } from "framer-motion";
import { MoveLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    productName: string;
    individualPrice: string;
    quantity: number;
}

export default function Newsletter() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
        null
    );
    const { toast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [emailContent, setEmailContent] = useState("");
    const [editableFields, setEditableFields] = useState<string[]>([]);
    const [baseContent, setBaseContent] = useState("");

    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
        null
    );
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [topProducts, setTopProducts] = useState<Product[]>([]);

    const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

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
                console.log("Fetching customers by segment:", segmentType);
                const mappedSegment = mapSegmentName(segmentType.split(" ")[0]);
                console.log("Mapped segment:", mappedSegment);
                const response = await axios.get(
                    `http://localhost:8080/api/customers/segment?segmentType=${mappedSegment}`
                );

                console.log("Customers by segment:", response.data);
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
            let updatedContent = baseContent;

            updatedContent = updatedContent.replace(
                "[Customer Name]",
                selectedCustomer.name
            );

            const hasNumberedProducts = /\[Product (Name|Price) \d+\]/.test(
                updatedContent
            );

            if (hasNumberedProducts) {
                const maxProducts = Math.min(3, topProducts.length);
                for (let i = 0; i < maxProducts; i++) {
                    const product = topProducts[i];
                    updatedContent = updatedContent.replace(
                        `[Product Name ${i + 1}]`,
                        product.productName
                    );
                    updatedContent = updatedContent.replace(
                        `[Product Price ${i + 1}]`,
                        product.individualPrice.toString()
                    );
                }
            } else {
                const topProduct = topProducts[0];
                if (topProduct) {
                    updatedContent = updatedContent.replace(
                        "[Product Name]",
                        topProduct.productName
                    );
                    updatedContent = updatedContent.replace(
                        "[Product Price]",
                        topProduct.individualPrice.toString()
                    );
                }
            }

            Object.entries(fieldValues).forEach(([field, value]) => {
                const regex = new RegExp(`\\[${field}\\]`, "g");
                updatedContent = updatedContent.replace(regex, value);
            });

            setEmailContent(updatedContent);
        }
    }, [topProducts, selectedCustomer, fieldValues, baseContent]);

    const handleClearFields = () => {
        setFieldValues({});

        setEmailContent(baseContent);
    };

    const handleCustomerSelect = (customerName: string) => {
        const customer = customers.find((c) => c.name === customerName);
        if (customer) {
            setSelectedCustomer(customer);
        }

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
            setFieldValues((prev) => ({
                ...prev,
                [field]: value,
            }));
            let updatedContent = baseContent;

            Object.entries({ ...fieldValues, [field]: value }).forEach(
                ([fieldName, fieldValue]) => {
                    const regex = new RegExp(`\\[${fieldName}\\]`, "g");
                    updatedContent = updatedContent.replace(regex, fieldValue);
                }
            );

            setEmailContent(updatedContent);
        }
    };

    const handleTemplateClick = (template: Template) => {
        setSelectedTemplate(template);
        setBaseContent(template.content);
        setEmailContent(template.content);
        setFieldValues({});

        const matches = template.content.match(/\[([^\]]+)\]/g) || [];
        setEditableFields(matches.map((match) => match.replace(/[\[\]]/g, "")));
    };

    interface ParseHtmlToText {
        (html: string): string;
    }

    const parseHtmlToText: ParseHtmlToText = (html) => {
        let text = html.replace(/&nbsp;/g, " ");
        text = text.replace(/<br\s*\/?>/gi, "\n");
        text = text.replace(/<\/?p>/gi, "\n");
        text = text.replace(/\t/gi, "\n    ");
        text = text.replace(/<[^>]*>/g, "");
        text = text.replace(/\n\s*\n\s*\n/g, "\n\n");
        text = text.trim();
        return text;
    };

    const sendEmail = async (receiverEmail: string) => {
        if (!emailContent) {
            toast({
                title: "Error",
                description: "Email content is missing.",
                variant: "destructive",
            });
            return;
        }

        try {
            const formattedContent = parseHtmlToText(emailContent);

            if (formattedContent.length > 1800) {
                throw new Error("Email content is too long for a GET request.");
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
                toast({
                    title: "Success",
                    variant: "default",
                    description: "Email sent successfully!",
                });
            } else {
                toast({
                    title: "Success",
                    description: "Email sent successfully!",
                });
            }
        } catch (error) {
            console.error("Error during email sending:", error);
            throw error;
        }
    };

    const handleSendEmail = () => {
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
            case "frequent":
                return "FREQUENT";
            case "occasional":
                return "OCCASIONAL";
            case "one-time":
                return "ONETIME";
            case "high-value":
                return "HIGHVALUE";
            case "mid-tier":
                return "MIDTIER";
            case "low-spend":
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
            <div className="w-full px-6 py-3"></div>
            {!selectedTemplate ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 ml-5 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            className="bg-card shadow-lg rounded-lg p-6 text-center transition-transform transform hover:scale-105 cursor-pointer"
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
                <>
                    <button
                        className="text-lg mb-4 flex  ml-5 items-center"
                        onClick={() => setSelectedTemplate(null)}
                        aria-label="Back to Templates"
                    >
                        <MoveLeft className="w-5 h-5" />{" "}
                        {/* Adjust size as needed */}
                    </button>
                    <div className="flex gap-2">
                        <div className="w-1/4 min-w-[250px] space-y-4 bg-card p-4  ml-2 rounded-xl shadow-md">
                            <h3 className="font-semibold text-lg border-b pb-2">
                                Template Variables
                            </h3>

                            {editableFields.includes("Customer Name") && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Choose a customer:
                                    </label>
                                    <Select
                                        onValueChange={handleCustomerSelect}
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
                                                        value={customer.name}
                                                    >
                                                        {customer.name}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {editableFields.map((field) => {
                                if (
                                    !field
                                        .toLowerCase()
                                        .includes("product name") &&
                                    !field
                                        .toLowerCase()
                                        .includes("product price") &&
                                    !field
                                        .toLowerCase()
                                        .includes("customer name")
                                ) {
                                    return (
                                        <div key={field} className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                {field}:
                                            </label>
                                            <input
                                                type="text"
                                                value={fieldValues[field] || ""}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        field,
                                                        e.target.value
                                                    )
                                                }
                                                placeholder={`Enter ${field.toLowerCase()}`}
                                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            />
                                        </div>
                                    );
                                }
                                return null;
                            })}
                            <button
                                className="bg-green-800 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-lg mt-5"
                                onClick={handleClearFields}
                            >
                                Clear Fields
                            </button>
                        </div>

                        <div className="flex-1">
                            <Card>
                                <CardHeader>
                                    <h3 className="text-xl font-bold">
                                        {selectedTemplate.title}
                                    </h3>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {emailContent && (
                                            <div
                                                className="text-sm text-gray-600 prose max-w-none"
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
                                onSendEmail={sendEmail}
                                emailContent={emailContent}
                            />
                        </div>
                    </div>
                </>
            )}
        </motion.section>
    );
}
