"use client";

import { IUser } from "@/interface/user";
import React, { useState } from "react";
import UserBanner from "./UserBanner";
import { useSession } from "next-auth/react";
import UploadedDoc from "../files/UploadedDoc";
import { IProfileFileCategory, IProfileFileInterface } from "@/interface/file";
import { useUser } from "@/hooks/useUser";
import { USER_ROLE } from "@/constants/user";
import AdminEditUserForm from "../forms/AdminEditUserForm";
import { deleteAccount } from "@/services/admin.service";
import CustomModal from "../modal/CustomModal";
import { showToaster } from "@/lib/general";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { ADMIN_USERS_ROUTE } from "@/constants/routes";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { revalidateCacheTags } from "@/actions/cache";

interface Props {
  user: IUser;
}

const fileCategories: {
  title: string;
  category: IProfileFileCategory;
  adminOnly?: boolean;
}[] = [
  {
    title: "Approval Agreement",
    category: "approval_agreement",
    adminOnly: true,
  },
  {
    title: "Means of Identification",
    category: "id_card",
  },
  {
    title: "Power of Attorney",
    category: "power_of_attorney",
    adminOnly: true,
  },
];

const ADMIN_ONLY_FIELDS = [
  "nin",
  "bvn",
  "bankAccountNumber",
  "bankAccountName",
];

const ProfileWrapper = ({ user }: Props) => {
  const { user: appUser, token } = useUser();
  const { data: session } = useSession();
  const isAdmin = appUser?.role === USER_ROLE.ADMIN && !(session as any)?.impersonating;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    business: true,
    address: true,
    banking: true,
  });

  const router = useRouter();

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const shouldShowField = (fieldName: string) => {
    return isAdmin || !ADMIN_ONLY_FIELDS.includes(fieldName);
  };

  const handleDeleteAccount = async () => {
    if (!isAdmin || !token) return;

    try {
      setIsDeleting(true);
      await deleteAccount(token, user.id);
      revalidateCacheTags([
        "admin-users",
        "admin-subscribed-users",
        "fetchUserById",
      ]).catch((error) => {
        console.error("Failed to revalidate admin user tags:", error);
      });
      showToaster("Account deleted successfully", "success");
      router.push(ADMIN_USERS_ROUTE);
    } catch (error) {
      console.error("Failed to delete account:", error);
      showToaster("Failed to delete account", "destructive");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const formatSensitiveInfo = (
    value: string | undefined,
    isSensitive = false
  ) => {
    if (!value) return "Not provided";
    if (isSensitive && !isAdmin) return "••••••••••";
    return value;
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-20 md:pb-0">
      {/* User Banner */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <UserBanner
          user={user}
          isAdmin={isAdmin}
          setShowDeleteModal={setShowDeleteModal}
          onEditClick={() => setShowEditModal(true)}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <CustomModal
        isShown={showDeleteModal}
        setIsShown={setShowDeleteModal}
        contentClass="max-w-md"
        title={`Delete ${user.fullName}'s Account`}
      >
        <div className="p-4">
          <p className="text-greyBody mb-6">
            Are you sure you want to permanently delete this account? This
            action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => setShowDeleteModal(false)}
              variant="outline"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              variant="destructive"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </Button>
          </div>
        </div>
      </CustomModal>

      {/* Edit User Modal */}
      <CustomModal
        isShown={showEditModal}
        setIsShown={setShowEditModal}
        contentClass="max-w-2xl"
        title={`Edit ${user.fullName}'s Profile`}
      >
        <AdminEditUserForm
          user={user}
          token={token || ""}
          onSuccess={() => {
            setShowEditModal(false);
            // Refresh the page to show updated data
            window.location.reload();
          }}
          onCancel={() => setShowEditModal(false)}
        />
      </CustomModal>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <button
            onClick={() => toggleSection("personal")}
            className="w-full p-4 md:p-6 flex items-center justify-between bg-gray-50 md:bg-transparent md:cursor-default"
          >
            <h2 className="text-base md:text-lg font-semibold">
              Personal Information
            </h2>
            <ChevronDown
              className={cn("w-5 h-5 transition-transform md:hidden", {
                "rotate-180": expandedSections.personal,
              })}
            />
          </button>
          <div
            className={cn("overflow-hidden transition-all duration-200", {
              "max-h-0 md:max-h-none": !expandedSections.personal,
              "max-h-[1000px] md:max-h-none": expandedSections.personal,
            })}
          >
            <div className="p-4 md:p-6 md:pt-0 space-y-3 md:space-y-4">
              {shouldShowField("nin") && (
                <div className="border-b border-gray-100 pb-3">
                  <label className="text-xs md:text-sm font-medium text-gray-600">
                    NIN
                  </label>
                  <p className="text-xs md:text-sm">
                    {user.nin || "Not provided"}
                  </p>
                </div>
              )}

              {fileCategories
                .filter((fileCat) => isAdmin || !fileCat.adminOnly)
                .map((fileCat) => (
                  <FileDisplayByCategory
                    key={fileCat.category}
                    files={user.profileFiles || []}
                    category={fileCat.category}
                    title={fileCat.title}
                    className="border-b border-gray-100 pb-3"
                  />
                ))}

              {shouldShowField("bvn") && (
                <div className="border-b border-gray-100 pb-3">
                  <label className="text-xs md:text-sm font-medium text-gray-600">
                    BVN
                  </label>
                  <p className="text-xs md:text-sm">
                    {formatSensitiveInfo(user.bvn, true)}
                  </p>
                </div>
              )}

              <div className="border-b border-gray-100 pb-3">
                <label className="text-xs md:text-sm font-medium text-gray-600">
                  State of Origin
                </label>
                <p className="text-xs md:text-sm">
                  {user.stateOfOrigin || "Not provided"}
                </p>
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium text-gray-600">
                  Nationality
                </label>
                <p className="text-xs md:text-sm">
                  {user.nationality || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <button
            onClick={() => toggleSection("business")}
            className="w-full p-4 md:p-6 flex items-center justify-between bg-gray-50 md:bg-transparent md:cursor-default"
          >
            <h2 className="text-base md:text-lg font-semibold">
              Business Information
            </h2>
            <ChevronDown
              className={cn("w-5 h-5 transition-transform md:hidden", {
                "rotate-180": expandedSections.business,
              })}
            />
          </button>
          <div
            className={cn("overflow-hidden transition-all duration-200", {
              "max-h-0 md:max-h-none": !expandedSections.business,
              "max-h-[1000px] md:max-h-none": expandedSections.business,
            })}
          >
            <div className="p-4 md:p-6 md:pt-0 space-y-3 md:space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <label className="text-xs md:text-sm font-medium text-gray-600">
                  Business Name
                </label>
                <p className="text-xs md:text-sm">
                  {user.businessName || "Not provided"}
                </p>
              </div>

              <div className="border-b border-gray-100 pb-3">
                <label className="text-xs md:text-sm font-medium text-gray-600">
                  Registration Number
                </label>
                <p className="text-xs md:text-sm">
                  {user.businessRegNo || "Not provided"}
                </p>
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium text-gray-600">
                  Business Address
                </label>
                <p className="text-xs md:text-sm">
                  {user.businessAddress || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <button
            onClick={() => toggleSection("address")}
            className="w-full p-4 md:p-6 flex items-center justify-between bg-gray-50 md:bg-transparent md:cursor-default"
          >
            <h2 className="text-base md:text-lg font-semibold">
              Address Information
            </h2>
            <ChevronDown
              className={cn("w-5 h-5 transition-transform md:hidden", {
                "rotate-180": expandedSections.address,
              })}
            />
          </button>
          <div
            className={cn("overflow-hidden transition-all duration-200", {
              "max-h-0 md:max-h-none": !expandedSections.address,
              "max-h-[1000px] md:max-h-none": expandedSections.address,
            })}
          >
            <div className="p-4 md:p-6 md:pt-0 space-y-3 md:space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <label className="text-xs md:text-sm font-medium text-gray-600">
                  State of Residence
                </label>
                <p className="text-xs md:text-sm">
                  {user.stateOfResidence || "Not provided"}
                </p>
              </div>

              <div className="border-b border-gray-100 pb-3">
                <label className="text-xs md:text-sm font-medium text-gray-600">
                  City of Residence
                </label>
                <p className="text-xs md:text-sm">
                  {user.cityOfResidence || "Not provided"}
                </p>
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium text-gray-600">
                  Full Address
                </label>
                <p className="text-xs md:text-sm">
                  {user.homeAddress || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Banking Information - Only show to admin */}
        {isAdmin && (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <button
              onClick={() => toggleSection("banking")}
              className="w-full p-4 md:p-6 flex items-center justify-between bg-gray-50 md:bg-transparent md:cursor-default"
            >
              <h2 className="text-base md:text-lg font-semibold">
                Banking Information
              </h2>
              <ChevronDown
                className={cn("w-5 h-5 transition-transform md:hidden", {
                  "rotate-180": expandedSections.banking,
                })}
              />
            </button>
            <div
              className={cn("overflow-hidden transition-all duration-200", {
                "max-h-0 md:max-h-none": !expandedSections.banking,
                "max-h-[1000px] md:max-h-none": expandedSections.banking,
              })}
            >
              <div className="p-4 md:p-6 md:pt-0 space-y-3 md:space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <label className="text-xs md:text-sm font-medium text-gray-600">
                    Bank Name
                  </label>
                  <p className="text-xs md:text-sm">
                    {user.bankName || "Not provided"}
                  </p>
                </div>

                <div className="border-b border-gray-100 pb-3">
                  <label className="text-xs md:text-sm font-medium text-gray-600">
                    Account Number
                  </label>
                  <p className="text-xs md:text-sm">
                    {formatSensitiveInfo(user.bankAccountNumber, true)}
                  </p>
                </div>

                <div>
                  <label className="text-xs md:text-sm font-medium text-gray-600">
                    Account Name
                  </label>
                  <p className="text-xs md:text-sm">
                    {formatSensitiveInfo(user.bankAccountName, true)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface FileDisplayProps {
  files: IProfileFileInterface[];
  category: IProfileFileCategory;
  title: string;
  className?: string;
}

const FileDisplayByCategory: React.FC<FileDisplayProps> = ({
  files = [],
  category,
  title,
  className = "",
}) => {
  const filteredFiles = files.filter((file) => file.fileCategory === category);

  if (filteredFiles.length === 0) return null;

  return (
    <div className={className}>
      <label className="text-xs md:text-sm font-medium text-gray-600">
        {title}
      </label>
      <div className="space-y-2 mt-1">
        {filteredFiles.map((file) => (
          <UploadedDoc
            key={file.id}
            fileName={file.fileName}
            fileSize={file.meta ? JSON.parse(file.meta)?.size : 0}
            viewFile={() => window.open(file.fileUrl, '_blank')}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfileWrapper;
