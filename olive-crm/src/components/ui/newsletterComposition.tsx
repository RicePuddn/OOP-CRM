import React, { useState } from "react";
import ReactQuill, { Quill } from "react-quill";
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
        onSave(title, target, content);
    };

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ align: [] }],
            ["blockquote", "code-block"],
            ["link", "image", "video"],
            ["clean"],
        ],
    };

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "color",
        "background",
        "list",
        "bullet",
        "align",
        "blockquote",
        "code-block",
        "link",
        "image",
        "video",
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
                onChange={setContent}
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
