"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { IUser } from "@/interface/user";
import Avatar from "./Avatar";
import { approveBuyerAccount, unapproveBuyerAccount } from "@/actions/user";
import { verifyServerResponse } from "@/lib/general";
import { toast } from "../ui/use-toast";

interface UserBannerProps {
  user: IUser;
  onWhatsAppClick?: () => void;
  onDeleteClick?: () => Promise<void> | void;
  onEditClick?: () => void;
  className?: string;
  isAdmin?: boolean;
  showAdminBadge?: boolean;
  setShowDeleteModal?: (show: boolean) => void;
}

const UserBanner: React.FC<UserBannerProps> = ({
  user,
  onWhatsAppClick,
  onDeleteClick,
  onEditClick,
  className,
  isAdmin = false,
  showAdminBadge = false,
  setShowDeleteModal,
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleAccountApproval = async () => {
    try {
      setLoading(true);

      let data 

      if(user.buyerApproved){
        data = await unapproveBuyerAccount(user.id)
      } else {
        data = await approveBuyerAccount(user.id)
      }

      verifyServerResponse(data)

      toast({
        title: data.message,
        variant: "success",
        duration: 5000,
      })
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: "An error occured while approving account",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <div
        className={cn(
          "bg-white rounded-lg shadow-sm overflow-hidden",
          className
        )}
      >
        <div className="w-full h-24 bg-primary relative">
          <div className="absolute left-6 -bottom-12">
            <Avatar
              imageSrc={
                user.profileFiles?.find(
                  (f) => f.fileCategory === "profile_image"
                )?.fileUrl
              }
              name={user.fullName}
              size="xxl"
              userId={user.id}
              className="border-4 border-white"
            />
            {showAdminBadge && user.role === "admin" && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                Admin
              </div>
            )}
          </div>
        </div>

        <div className="pt-16 pb-6 px-6">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {user.fullName}
              </h1>
            </div>

            {(user.stateOfResidence || user.nationality) && (
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <span className="text-grey6 text-base">
                  {[user.stateOfResidence, user.nationality]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            )}
          </div>

          <div className="mb-6 space-y-1">
            <div className="flex items-center gap-2 text-gray-700">
              <span>Email:</span>
              <span className="truncate text-grey6">{user.email}</span>
            </div>

            {user.phoneNumber && (
              <div className="flex items-center gap-2 text-gray-700">
                <span>Phone:</span>
                <span className="text-grey6">{user.phoneNumber}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              onClick={onWhatsAppClick}
              className="gap-2"
              disabled={!user.phoneNumber}
            >
              WhatsApp
            </Button>

            {isAdmin && onEditClick && (
              <Button variant="outline" onClick={onEditClick}>
                Edit Profile
              </Button>
            )}

            {isAdmin && (
              <Button
                variant="destructive"
                onClick={() => setShowDeleteModal && setShowDeleteModal(true)}
              >
                Delete Account
              </Button>
            )}

            {isAdmin && user.role === "buyer" && (
              <Button
                variant="default"
                className={cn({
                  "bg-green-600 text-white hover:bg-green-700 hover:text-white":
                    !user.buyerApproved,
                  "bg-yellow-600 text-white hover:bg-yellow-700 hover:text-white":
                    user.buyerApproved,
                })}
                onClick={handleAccountApproval}
                disabled={loading}
              >
                {user.buyerApproved ? "Withdraw Approval" : "Approve Account"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserBanner;
