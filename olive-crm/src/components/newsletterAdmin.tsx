"use client";

import React, { useState } from "react";

interface Template {
    id: number;
    title: string;
    overview: string;
}

const Newsletter: React.FC = () => {
    const [templates] = useState<Template[]>([
        {
            id: 1,
            title: "Creative Resume",
            overview: "A professional resume designed by MOO.",
        },
        {
            id: 2,
            title: "Simple Cover Letter",
            overview: "A clean and simple cover letter template.",
        },
        {
            id: 3,
            title: "Calendar",
            overview: "A simple calendar template for your schedule.",
        },
        {
            id: 4,
            title: "Write a Journal",
            overview: "A journal template to track your thoughts.",
        },
        {
            id: 5,
            title: "Create an Outline",
            overview: "A structured template to help you outline your work.",
        },
    ]);

    const addNewTemplate = () => {
        console.log("Add new template clicked!");
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
            {/* Add New Template Card */}
            <div
                className="flex flex-col justify-center items-center bg-teal-100 text-teal-700 rounded-lg p-6 cursor-pointer transition-transform transform hover:scale-105"
                onClick={addNewTemplate}
            >
                <div className="text-6xl">+</div>
                <p className="mt-4 font-bold">Add New Template</p>
            </div>

            {/* Render Existing Templates */}
            {templates.map((template) => (
                <div
                    className="bg-white shadow-lg rounded-lg p-6 text-center transition-transform transform hover:scale-105"
                    key={template.id}
                >
                    <h3 className="text-lg font-bold mb-2">{template.title}</h3>
                    <p className="text-sm text-gray-600">{template.overview}</p>
                </div>
            ))}
        </div>
    );
};

export default Newsletter;
