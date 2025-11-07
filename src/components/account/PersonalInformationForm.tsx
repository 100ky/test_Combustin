"use client";

import { useState, type FC } from "react";
import type { Account } from "@/types/account";

// --- TypeScript Interfaces ---
interface PersonalInformationFormProps {
  initialData: Partial<Account>;
  onFormChange: (updatedData: Partial<Account>) => void;
}

/**
 * A form component for editing a user's personal information.
 * It manages its own state for form fields and communicates changes to the parent component.
 */
const PersonalInformationForm: FC<PersonalInformationFormProps> = ({
  initialData,
  onFormChange,
}) => {
  // --- State Management ---
  const [formData, setFormData] = useState(initialData);

  // --- Event Handlers ---

  /**
   * Handles changes in text inputs and textareas.
   * Updates the local form data and notifies the parent component.
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    const updatedData = { ...formData, [id]: value };
    setFormData(updatedData);
    onFormChange(updatedData);
  };

  // --- Render ---
  return (
    <div className="animate-on-load mb-8 rounded-lg bg-[var(--background)] p-6 shadow">
      <h2 className="mb-4 border-b border-gray-200 pb-2 text-xl font-semibold text-[var(--foreground)]">
        Osobní údaje
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* First Name Input */}
        <div>
          <label
            htmlFor="firstName"
            className="mb-1 block text-sm font-medium text-gray-600"
          >
            Jméno
          </label>
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Last Name Input */}
        <div>
          <label
            htmlFor="lastName"
            className="mb-1 block text-sm font-medium text-gray-600"
          >
            Příjmení
          </label>
          <input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Email Input (Read-only) */}
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-gray-600"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email ?? ""}
            readOnly
            className="block w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-200 p-2.5 text-sm text-gray-600 focus:outline-none"
          />
        </div>

        {/* Role field */}
        <div>
          <label
            htmlFor="role"
            className="mb-1 block text-sm font-medium text-gray-600"
          >
            Role
          </label>
          <input
            type="text"
            id="role"
            value={formData.authorities?.join(", ") ?? ""}
            readOnly
            className="block w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-200 p-2.5 text-sm text-gray-600 focus:outline-none"
          />
        </div>

        {/* Profession Input */}
        <div>
          <label
            htmlFor="profession"
            className="mb-1 block text-sm font-medium text-gray-600"
          >
            Profese
          </label>
          <input
            type="text"
            id="profession"
            value={formData.profession}
            onChange={handleInputChange}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Např. Projektový manažer"
          />
        </div>

        {/* Organization Input */}
        <div>
          <label
            htmlFor="organization"
            className="mb-1 block text-sm font-medium text-gray-600"
          >
            Organizace / Firma
          </label>
          <input
            type="text"
            id="organization"
            value={formData.organization}
            onChange={handleInputChange}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Název firmy"
          />
        </div>

        {/* Description Textarea */}
        <div className="md:col-span-2">
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium text-gray-600"
          >
            Poznámky pro administrátory
          </label>
          <textarea
            id="description"
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Zde můžete zanechat vzkaz pro administrátory..."
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformationForm;
