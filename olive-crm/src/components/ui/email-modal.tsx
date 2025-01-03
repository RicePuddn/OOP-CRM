import React, { useState } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSendEmail: (email: string) => Promise<void>;
    emailContent: string;
}

const EmailModal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onSendEmail,
    emailContent,
}) => {
    const [receiverEmail, setReceiverEmail] = useState("");
    const [isSending, setIsSending] = useState(false);

    if (!isOpen) return null;

    const handleSendEmail = async () => {
        if (!receiverEmail) {
            alert("Please enter an email address");
            return;
        }

        setIsSending(true);
        try {
            await onSendEmail(receiverEmail);
            setReceiverEmail("");
            onClose();
        } catch (error) {
            console.error("Failed to send email:", error);
            alert("Failed to send email. Please try again.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg w-1/2 h-auto">
                <h2 className="text-lg font-semibold mb-4">
                    Email Information
                </h2>

                <label className="block text-sm font-medium mb-2">
                    Customer Email:
                </label>
                <input
                    type="email"
                    value={receiverEmail}
                    onChange={(e) => setReceiverEmail(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    placeholder="Enter customer's email"
                    disabled={isSending}
                />

                <h3 className="text-sm mb-2">Email Content:</h3>
                <div
                    className="border p-3 bg-gray-100 mb-4 text-sm overflow-auto max-h-60"
                    dangerouslySetInnerHTML={{ __html: emailContent }}
                ></div>

                <div className="flex justify-between">
                    <button
                        className="bg-green-800 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-lg"
                        onClick={onClose}
                        disabled={isSending}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-green-800 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-lg ml-2"
                        onClick={handleSendEmail}
                        disabled={isSending}
                    >
                        {isSending ? "Sending..." : "Send Email"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailModal;
