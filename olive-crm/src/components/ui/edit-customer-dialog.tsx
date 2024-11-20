import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Input } from "./input";
import { Button } from "./button";

interface EditCustomerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: number;
  onSave: (
    customerId: number,
    data: { first_name: string; last_name: string; zipcode: string }
  ) => void;
  initialData?: {
    first_name: string;
    last_name: string;
    zipcode: string;
  };
}

export function EditCustomerDialog({
  isOpen,
  onClose,
  customerId,
  onSave,
  initialData = { first_name: "", last_name: "", zipcode: "" },
}: EditCustomerDialogProps) {
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(customerId, formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-black">
            Edit Customer Details
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="customer_id"
              className="block text-sm font-medium text-black"
            >
              Customer ID
            </label>
            <Input
              id="customer_id"
              name="customer_id"
              value={customerId}
              disabled
              className="mt-1 bg-gray-300 disabled:text-gray-500 disabled:opacity-100"
            />
          </div>
          <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-medium text-black"
            >
              First Name
            </label>
            <Input
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="mt-1 bg-gray-100 text-black"
            />
          </div>
          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-black"
            >
              Last Name
            </label>
            <Input
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="mt-1 bg-gray-100 text-black"
            />
          </div>
          <div>
            <label
              htmlFor="zipcode"
              className="block text-sm font-medium text-black"
            >
              Zip Code
            </label>
            <Input
              id="zipcode"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleChange}
              className="mt-1 bg-gray-100 text-black"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="submit" className="hover:bg-slate-600">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
