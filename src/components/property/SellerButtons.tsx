"use client";

import React, { useState } from "react";
import { IProperty } from "@/interface/property";
import { IUser } from "@/interface/user";
import { useRouter } from "next/navigation";
import { EDIT_PROPERTY_ROUTE } from "@/constants/routes";
import ActionButton from "../buttons/ActionButton";
import CustomButton from "../buttons/CustomButton";
import CustomModal from "../modal/CustomModal";

interface SellerButtonsProps {
  property: IProperty;
  user?: IUser;
}

const SellerButtons: React.FC<SellerButtonsProps> = ({ property, user }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();

  return (
    <div>
      {user?.id === property.userId && (
        <>
          <ActionButton
            text="Edit Property"
            onClick={() => router.push(`${EDIT_PROPERTY_ROUTE}/${property.id}`)}
          />
          <ActionButton
            text="Delete"
            variant="secondary"
            onClick={() => setShowDeleteModal(true)}
          />
        </>
      )}

      <CustomModal
        title="Delete Property"
        isShown={showDeleteModal}
        setIsShown={setShowDeleteModal}
      >
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this property? This action cannot be
            undone.
          </p>
          <div className="flex gap-4">
            <CustomButton
              variant="secondary"
              className="flex-1"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </CustomButton>
            <CustomButton
              variant="destructive"
              className="flex-1"
              onClick={() => {
                // TODO: Implement delete functionality
                setShowDeleteModal(false);
              }}
            >
              Delete
            </CustomButton>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default SellerButtons;
