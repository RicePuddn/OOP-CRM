"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FilePenLine } from "lucide-react";
import { Editor } from "@tinymce/tinymce-react";
import NewsletterComposition from "./ui/newsletterComposition";

interface Template {
    newsID: number;
    title: string;
    content: string;
}

const Newsletter: React.FC = () => {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
        null
    );
    const [isComposing, setIsComposing] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editableTitle, setEditableTitle] = useState("");
    const [editableContent, setEditableContent] = useState("");

    // Fetch templates from the API
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

    const handleAddNewTemplate = () => {
        setSelectedTemplate(null);
        setIsComposing(true);
    };

    const handleSaveTemplate = async (title: string, content: string) => {
        const newTemplate = { newsID: Date.now(), title, content };

        // Update UI immediately
        setTemplates([...templates, newTemplate]);
        setIsComposing(false);

        // API call to save the new template
        try {
            await axios.post("http://localhost:8080/api/newsletter/create", {
                title,
                content,
            });
            alert("Template saved successfully!");
        } catch (error) {
            console.error("Error saving template:", error);
            alert("Failed to save the template.");
        }
    };

    const handleCancelComposition = () => {
        setIsComposing(false);
        setSelectedTemplate(null);
    };

    const startEditing = () => {
        if (selectedTemplate) {
            setEditableTitle(selectedTemplate.title);
            setEditableContent(selectedTemplate.content);
            setIsEditing(true);
        }
    };

    const saveChanges = async () => {
        if (selectedTemplate) {
            const updatedTemplate = {
                ...selectedTemplate,
                title: editableTitle,
                content: editableContent,
            };

            setTemplates((prevTemplates) =>
                prevTemplates.map((template) =>
                    template.newsID === selectedTemplate.newsID
                        ? updatedTemplate
                        : template
                )
            );
            setSelectedTemplate(updatedTemplate);
            setIsEditing(false);

            // Make an API call to update the template in the backend
            try {
                await axios.put(
                    `http://localhost:8080/api/newsletter/update?id=${selectedTemplate.newsID}`,
                    {
                        title: editableTitle,
                        content: editableContent,
                    }
                );
                alert("Template updated successfully!");
            } catch (error) {
                console.error("Error updating template:", error);
                alert("Failed to update the template.");
            }
        }
    };

    const cancelEditing = () => {
        setIsEditing(false);
    };

    // Helper function to get the first sentence of content
    const getFirstLine = (content: string) => {
        const match = content.match(/.*?(?:\.\s|$)/); // Match up to the first period followed by space or end
        return match ? match[0] : content;
    };

    return (
        <div className="p-4">
            {isComposing ? (
                <NewsletterComposition
                    onSave={handleSaveTemplate}
                    onCancel={handleCancelComposition}
                />
            ) : selectedTemplate ? (
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <div className="flex justify-between mb-4">
                        <button
                            onClick={() => setSelectedTemplate(null)}
                            className="text-2xl"
                        >
                            &larr;
                        </button>
                        {!isEditing && (
                            <FilePenLine
                                onClick={startEditing}
                                className="h-6 w-6 text-black cursor-pointer mr-3"
                            />
                        )}
                    </div>
                    <h2 className="text-2xl font-bold mb-4">
                        {isEditing ? (
                            <input
                                type="text"
                                value={editableTitle}
                                onChange={(e) =>
                                    setEditableTitle(e.target.value)
                                }
                                className="w-full border border-gray-300 rounded p-2"
                            />
                        ) : (
                            selectedTemplate.title
                        )}
                    </h2>
                    <div className="text-gray-700 mb-4">
                        {isEditing ? (
                            <Editor
                                apiKey="whnj4jyxxe0cyg9z1oh4ripnr09j8m7v73ujqir4fboablwq"
                                value={editableContent}
                                init={{
                                    height: 400,
                                    menubar: false,
                                    plugins: [
                                        "advlist autolink lists link image charmap print preview anchor",
                                        "searchreplace visualblocks code fullscreen",
                                        "insertdatetime media table paste code help wordcount",
                                    ],
                                    toolbar:
                                        "undo redo | formatselect | bold italic backcolor | \
                                        alignleft aligncenter alignright alignjustify | \
                                        bullist numlist outdent indent | removeformat | help",
                                }}
                                onEditorChange={(content) =>
                                    setEditableContent(content)
                                }
                            />
                        ) : (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: selectedTemplate.content,
                                }}
                            />
                        )}
                    </div>
                    {isEditing && (
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={cancelEditing}
                                className="bg-gray-600 text-white py-2 px-4 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveChanges}
                                className="bg-green-600 text-white py-2 px-4 rounded"
                            >
                                Save
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <div
                        className="flex flex-col justify-center items-center bg-green-700 text-white rounded-lg p-6 cursor-pointer transition-transform transform hover:scale-105"
                        onClick={handleAddNewTemplate}
                    >
                        <div className="text-6xl">+</div>
                        <p className="mt-4 font-bold">Add New Template</p>
                    </div>

                    {/* Render Template List */}
                    {templates.map((template) => (
                        <div
                            key={template.newsID}
                            className="bg-white shadow-lg rounded-lg p-6 text-center transition-transform transform hover:scale-105 cursor-pointer"
                            onClick={() => setSelectedTemplate(template)}
                        >
                            <h3 className="text-lg font-bold mb-2">
                                {template.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {getFirstLine(template.content)}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Newsletter;
