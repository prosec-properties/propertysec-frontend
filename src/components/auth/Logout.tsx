"use client";

import React, { useState } from "react";
import { showToaster } from "@/lib/general";
import { signOut, useSession } from "next-auth/react";
import { googleLogout } from "@react-oauth/google";
import CustomButton from "../buttons/CustomButton";
import { $requestWithToken } from "@/api/general";
import CustomModal from "../modal/CustomModal";
import { logoutApi } from "@/services/auth.service";

const Logout = () => {
  const { data } = useSession();
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleLogout = async () => {
    if (!data || !data?.accessToken) {
      showToaster("You are not currently logged in.", "destructive");
      return;
    }

    try {
      setLoading(true);

      // Perform server-side logout
      await logoutApi(data.accessToken);

      // Clear client-side sessions
      await Promise.all([
        signOut({ redirect: false }),
        new Promise((resolve) => {
          googleLogout();
          resolve(true);
        }),
      ]);

      showToaster("You have been successfully logged out.", "success");

      // Redirect to home page after successful logout
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      showToaster("Failed to logout. Please try again.", "destructive");
    } finally {
      setLoading(false);
    }
  };

  const initiateLogout = () => {
    setShowConfirmModal(true);
  };

  return (
    <div className="p-6">
      <h2 className="mb-6 text-black font-medium text-2xl bg-white p-4 md:p-6 rounded-[0.625rem]">
        Logout
      </h2>
      <div className="bg-white rounded-[0.625rem] min-h-[70vh]">
        <p className="font-medium text-sm md:text-xl mb-10 p-4 md:p-6 text-greyBody">
          For security purposes, clicking logout will end your current session
          and require re-authentication for future access.
        </p>
        <div className="flex justify-center">
          <CustomButton
            loading={loading}
            onClick={initiateLogout}
            className="md:w-[20%]"
          >
            {loading ? "Logging out..." : "Logout"}
          </CustomButton>
        </div>
      </div>

      <CustomModal
        isShown={showConfirmModal}
        setIsShown={setShowConfirmModal}
        contentClass="max-w-md"
        title="Confirm Logout"
      >
        <div className="p-4">
          <p className="text-greyBody mb-6">
            Are you sure you want to logout? You will need to sign in again to
            access your account.
          </p>
          <div className="flex justify-end gap-3">
            <CustomButton
              onClick={() => setShowConfirmModal(false)}
              variant="outline"
              disabled={loading}
            >
              Cancel
            </CustomButton>
            <CustomButton
              loading={loading}
              onClick={handleLogout}
              variant="destructive"
              loadingText="Logging out..."
            >
              Logout
            </CustomButton>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default Logout;
