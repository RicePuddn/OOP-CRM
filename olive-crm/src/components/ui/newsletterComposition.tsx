import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
            <h2 className="text-2xl font-bold mb-4">Compose Newsletter</h2>
            <label className="font-bold text-gray-700">Title:</label>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full border border-gray-300 rounded p-2 mb-4"
            />
            <label className="font-bold text-gray-700">Customer Segment:</label>
            <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="Target Customer Segmentation"
                className="w-full border border-gray-300 rounded p-2 mb-4"
            />
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
