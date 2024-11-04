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
    products: { name: string; price: string }[];
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
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
        null
    );
    const [customers, setCustomers] = useState<Customer[]>([
        {
            name: "John Doe",
            products: [
                { name: "Product A", price: "$100" },
                { name: "Product B", price: "$150" },
            ],
        },
        {
            name: "Jane Smith",
            products: [
                { name: "Product X", price: "$200" },
                { name: "Product Y", price: "$250" },
            ],
        },
    ]);

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

    const handleTemplateClick = (template: Template) => {
        setSelectedTemplate(template);
        setEmailContent(template.content);

        // Extract placeholders from the template content
        const matches = template.content.match(/\[([^\]]+)\]/g) || [];
        setEditableFields(matches.map((match) => match.replace(/[\[\]]/g, ""))); // Remove brackets
    };

    const handleCustomerSelect = (customerName: string) => {
        const customer = customers.find((c) => c.name === customerName);
        setSelectedCustomer(customer);

        // Replace placeholders with customer details
        let updatedContent = selectedTemplate?.content || "";
        if (customer) {
            updatedContent = updatedContent.replace(
                "[Customer Name]",
                customer.name
            );
            if (customer.products.length > 0) {
                updatedContent = updatedContent.replace(
                    "[Product Name]",
                    customer.products[0].name
                );
                updatedContent = updatedContent.replace(
                    "[Product Price]",
                    customer.products[0].price
                );
            }
        }
        setEmailContent(updatedContent);
    };

    const handleSendEmail = () => {
        setIsModalOpen(true);
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
                                                        (customer) => (
                                                            <SelectItem
                                                                key={
                                                                    customer.name
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
                                    <div
                                        className="text-sm text-gray-600"
                                        dangerouslySetInnerHTML={{
                                            __html: emailContent,
                                        }}
                                    ></div>
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
