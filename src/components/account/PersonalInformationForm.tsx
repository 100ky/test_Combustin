"use client";

import { useState, FC } from "react";
import { Session } from "next-auth";
import { Account } from "@/types/account";

interface PersonalInformationFormProps {
  initialData: Partial<Account>;
  session: Session | null;
  onFormChange: (updatedData: Partial<Account>) => void;
}

const PersonalInformationForm: FC<PersonalInformationFormProps> = ({
  initialData,
  session,
  onFormChange,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [desiredRole, setDesiredRole] = useState<"moderator" | "admin" | null>(
    initialData.moderationInterest ? "moderator" : null,
  );
  const [interestChecked, setInterestChecked] = useState(
    initialData.moderationInterest || false,
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    const updatedData = { ...formData, [id]: value };
    setFormData(updatedData);
    onFormChange(updatedData);
  };

  const handleRoleInterestCheck = () => {
    if (!desiredRole) {
      alert(
        "Prosím, vyberte roli (moderátor nebo admin), o kterou máte zájem.",
      );
      return;
    }
    const newInterest = !interestChecked;
    setInterestChecked(newInterest);
    const updatedData = { ...formData, moderationInterest: newInterest };
    setFormData(updatedData);
    onFormChange(updatedData);
  };

  const handleDesiredRoleChange = (role: "moderator" | "admin") => {
    setDesiredRole(role);
    if (interestChecked) {
      const updatedData = { ...formData, moderationInterest: true }; // Assuming role change implies interest
      setFormData(updatedData);
      onFormChange(updatedData);
    } else {
      onFormChange(formData); // Just to trigger dirty state
    }
  };

  return (
    <div className="animate-on-load mb-8 rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 border-b border-gray-200 pb-2 text-xl font-semibold text-gray-900">
        Osobní údaje
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
            value={session?.user?.email ?? ""}
            readOnly
            className="block w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-200 p-2.5 text-sm text-gray-600 focus:outline-none"
          />
        </div>

        {/* Role field with a descriptive tooltip */}
        <div>
          <label
            htmlFor="role"
            className="mb-1 block text-sm font-medium text-gray-600"
          >
            Role
          </label>
          <div className="group relative">
            <p className="flex h-[42px] cursor-help items-center rounded-md border border-yellow-200 bg-yellow-100 p-2.5 text-xs font-semibold text-yellow-800">
              Nebuď srab a staň se moderátorem/adminem.
            </p>
            <div className="pointer-events-none absolute top-1/2 left-full z-10 ml-4 w-72 -translate-y-1/2 rounded-lg bg-gray-800 p-3 text-sm text-white opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100">
              <h4 className="font-bold">Práva rolí:</h4>
              <ul className="mt-1 list-inside list-disc">
                <li>
                  <b>Moderátor:</b> Může upravovat a schvalovat obsah.
                </li>
                <li>
                  <b>Admin:</b> Může spravovat uživatele a nastavovat systém.
                </li>
              </ul>
              <div className="absolute top-1/2 left-[-8px] h-4 w-4 -translate-y-1/2 rotate-45 transform bg-gray-800"></div>
            </div>
          </div>
        </div>

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

        {/* Interactive section for users to express interest in a higher role */}
        <div className="md:col-span-2">
          <div className="mt-2 flex items-center">
            <input
              id="moderator-interest"
              name="moderator-interest"
              type="checkbox"
              checked={interestChecked}
              onChange={handleRoleInterestCheck}
              className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
              disabled={!desiredRole}
            />
            <div className="ml-3 block text-sm text-gray-700">
              <span>Mám zájem být </span>
              <button
                type="button"
                onClick={() => handleDesiredRoleChange("moderator")}
                className={`rounded-md p-1 font-semibold transition ${
                  desiredRole === "moderator"
                    ? "bg-blue-200 text-blue-800"
                    : "hover:bg-gray-200"
                }`}
              >
                moderátor
              </button>
              <span>/</span>
              <button
                type="button"
                onClick={() => handleDesiredRoleChange("admin")}
                className={`rounded-md p-1 font-semibold transition ${
                  desiredRole === "admin"
                    ? "bg-blue-200 text-blue-800"
                    : "hover:bg-gray-200"
                }`}
              >
                admin
              </button>
              <span>.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformationForm;
