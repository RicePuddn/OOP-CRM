"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FilePenLine } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import NewsletterComposition from "./ui/newsletterComposition";
import Cookies from "js-cookie";
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

const CUSTOMER_SEGMENTS = [
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

const Newsletter: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [isComposing, setIsComposing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableTitle, setEditableTitle] = useState("");
  const [editableContent, setEditableContent] = useState("");
  const [editableTarget, setEditableTarget] = useState("");

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/newsletter/all"
        );
        console.log("Fetched templates:", response.data);
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

  const handleSaveTemplate = async ({
    title,
    content,
    target,
  }: Omit<Template, "id">) => {
    const username = Cookies.get("username");

    if (!username) {
      alert("Username not found. Please login again.");
      return;
    }

    const newTemplate: Template = {
      id: Date.now(),
      title,
      content,
      target,
      username,
    };

    try {
      await axios.post(
        "http://localhost:8080/api/newsletter/create",
        {
          title,
          content,
          username,
          target,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setTemplates([...templates, newTemplate]);
      setIsComposing(false);
      alert("Template created successfully!");
    } catch (error) {
      console.error("Error create template:", error);
      alert("Failed to create the template.");
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
      setEditableTarget(selectedTemplate.target);
      setIsEditing(true);
    }
  };

  const saveChanges = async () => {
    if (selectedTemplate) {
      const updatedTemplate = {
        ...selectedTemplate,
        title: editableTitle,
        content: editableContent,
        username: selectedTemplate.username,
        target: editableTarget,
      };
      console.log("selectedTemplate: ", selectedTemplate);
      setTemplates((prevTemplates) =>
        prevTemplates.map((template) =>
          template.id === selectedTemplate.id ? updatedTemplate : template
        )
      );
      setSelectedTemplate(updatedTemplate);
      setIsEditing(false);

      try {
        await axios.put(
          `http://localhost:8080/api/newsletter/update/${selectedTemplate.id}`,
          {
            title: editableTitle,
            content: editableContent,
            username: selectedTemplate.username,
            target: editableTarget,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
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

  const handleDeleteTemplate = async (templateId: number) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/newsletter/delete/${templateId}`,
        {
          withCredentials: true,
        }
      );
      setTemplates(templates.filter((template) => template.id !== templateId));
      setSelectedTemplate(null);
      alert("Template deleted successfully!");
    } catch (error) {
      console.error("Error deleting template:", error);
      alert("Failed to delete the template.");
    }
  };

  const loggedInUsername = Cookies.get("username");
  console.log("loggedInUsername: ", loggedInUsername);

  return (
    <div className="p-10">
      {isComposing ? (
        <NewsletterComposition
          onSave={(title, target, content) =>
            handleSaveTemplate({
              title,
              target,
              content,
              username: Cookies.get("username") || "",
            })
          }
          onCancel={handleCancelComposition}
        />
      ) : selectedTemplate ? (
        <div className="bg-white shadow-lg rounded-xl p-10 ">
          <div className="flex justify-between mb-4">
            <button
              onClick={() => setSelectedTemplate(null)}
              className="text-xl"
            >
              &larr;
            </button>
            {!isEditing && (
              <>
                {console.log(
                  "selectedtemplate username" + selectedTemplate.username
                )}
                <FilePenLine
                  onClick={startEditing}
                  className="h-6 w-6 text-black cursor-pointer mr-3"
                />
              </>
            )}
          </div>
          <h2 className="text-2xl font-bold mb-4">
            {isEditing ? (
              <input
                type="text"
                value={editableTitle}
                onChange={(e) => setEditableTitle(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
              />
            ) : (
              selectedTemplate.title
            )}
          </h2>
          <div className="flex items-center justify-between mb-4">
            {!isEditing && (
              <label className="font-bold text-gray-700 mr-4">
                Target Customer Segment:
              </label>
            )}
            <div className="text-gray-700 flex-1">
              {isEditing ? (
                <Select onValueChange={(value) => setEditableTarget(value)}>
                  <SelectTrigger className="w-full border border-gray-300 rounded p-2">
                    <SelectValue
                      placeholder={
                        editableTarget || "Select a customer segment"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {CUSTOMER_SEGMENTS.map((segment, index) => (
                      <SelectItem key={index} value={segment}>
                        {segment}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <span>{selectedTemplate.target}</span>
              )}
            </div>
          </div>

          <div className="text-gray-700 mb-4">
            {isEditing ? (
              <ReactQuill
                value={editableContent}
                onChange={setEditableContent}
                modules={{
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
                }}
                formats={[
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
                ]}
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

          {!isEditing && selectedTemplate.username === loggedInUsername && (
            <div className="flex mt-4">
              <button
                onClick={() => {
                  handleDeleteTemplate(selectedTemplate.id);
                }}
                className="bg-red-600 text-white py-2 px-4 rounded "
              >
                Delete Template
              </button>{" "}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div
            className="flex flex-col justify-center items-center bg-green-700 text-white rounded-lg p-6 cursor-pointer transition-transform transform hover:scale-105 hover:bg-green-600"
            onClick={handleAddNewTemplate}
          >
            <div className="text-6xl">+</div>
            <p className="mt-4 font-bold">Add New Template</p>
          </div>

          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white shadow-lg rounded-lg p-6 text-center transition-transform transform hover:scale-105 cursor-pointer"
              onClick={() => {
                console.log("Selected template:", template);
                setSelectedTemplate(template);
              }}
            >
              <h3 className="text-lg font-bold mb-2">{template.title}</h3>

              <p className="text-sm text-gray-500 mb-2">
                Target: {template.target}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Created By: {template.username}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Newsletter;
