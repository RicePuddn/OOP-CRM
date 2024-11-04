import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Info } from "lucide-react";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "./select"; // Adjust the path as needed

interface NewsletterCompositionProps {
    onSave: (title: string, target: string, content: string) => void;
    onCancel: () => void;
}

const NewsletterComposition: React.FC<NewsletterCompositionProps> = ({
    onSave,
    onCancel,
}) => {
    const [title, setTitle] = useState("");
    const [target, setTarget] = useState("");
    const [content, setContent] = useState("");

    const CUSTOMER_SEGMENTS = [
        "All",
        "Active Customers",
        "Dormant Customers",
        "Returning Customers",
        "Frequent Shoppers",
        "Occasional Shoppers",
        "One-time Buyers",
        "High-Value Customers",
        "Mid-Tier Customers",
        "Low-Spend Customers",
    ];

    const handleSave = () => {
        if (
            title.trim() === "" ||
            target.trim() === "" ||
            content.trim() === ""
        ) {
            alert("Please fill in all fields.");
            return;
        }
        onSave(title, target, content);
    };

    const handleEditorChange = (value: string) => {
        setContent(value);
    };

    // Updated toolbar modules
    const modules = {
        toolbar: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ size: [] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
            ],
            ["link", "image", "video"],
            ["clean"],
            [
                { align: "" },
                { align: "center" },
                { align: "right" },
                { align: "justify" },
            ],
        ],
    };

    // Updated formats
    const formats = [
        "header",
        "font",
        "size",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
        "video",
        "align",
    ];

    return (
        <div className="p-4 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
                Compose Newsletter
                <div className="relative group ml-2">
                    <Info className="text-gray-500 cursor-pointer" />
                    <span className="absolute left-0 ml-6 w-64 p-2 rounded bg-green-800 text-white text-xs shadow-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        Mark editable fields with square brackets. E.g.,
                        [Customer Name], [Product Name], [Product Price]. For
                        multiple products, use numbers such as [Product Name 1].
                    </span>
                </div>
            </h2>

            <label className="font-bold text-gray-700">Title:</label>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full border border-gray-300 rounded p-2 mb-4"
            />
            <label className="font-bold text-gray-700">Customer Segment:</label>
            <Select onValueChange={(value) => setTarget(value)}>
                <SelectTrigger className="w-full border border-gray-300 rounded p-2 mb-4">
                    <SelectValue placeholder="Select a customer segment" />
                </SelectTrigger>
                <SelectContent>
                    {CUSTOMER_SEGMENTS.map((segment, index) => (
                        <SelectItem key={index} value={segment}>
                            {segment}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <label className="font-bold text-gray-700">Content:</label>
            <ReactQuill
                value={content}
                onChange={handleEditorChange}
                modules={modules}
                formats={formats}
                placeholder="Type your content here..."
                theme="snow"
            />
            <div className="flex justify-between mt-4">
                <button
                    onClick={onCancel}
                    className="bg-gray-600 text-white py-2 px-4 rounded mr-2"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="bg-green-700 text-white py-2 px-4 rounded"
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default NewsletterComposition;
