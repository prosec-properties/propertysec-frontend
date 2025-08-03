"use client";

import React, { useState } from "react";
import { IProperty, IPropertyStatus } from "@/interface/property";
import ActionButton from "../buttons/ActionButton";
import TextArea from "../inputs/TextArea";
import { updatePropertyStatus } from "@/actions/property";
import { verifyServerResponse } from "@/lib/general";
import { toast } from "../ui/use-toast";
import {
  AlertDialogTrigger,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../ui/alert-dialog";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

interface AdminButtonsProps {
  property: IProperty;
}

const AdminButtons: React.FC<AdminButtonsProps> = ({ property }) => {
  const [showRejectArea, setShowRejectArea] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const publishStatus: IPropertyStatus[] = ["draft", "pending", "rejected"];
  const rejectStatus: IPropertyStatus[] = ["published", "draft", "pending"];

  const handlePublish = async () => {
    try {
      setLoading(true);
      const data = await updatePropertyStatus(property.id, "published");
      verifyServerResponse(data);
      toast({
        title: "Success!",
        description: "Property published",
        variant: "success",
        duration: 3000,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed!",
        description: "Failed to publish property",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);

      if (reason.trim().length <= 5) {
        toast({
          title: "Failed!",
          description: "Please enter a minimum of 5 characters",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      const data = await updatePropertyStatus(property.id, "rejected", reason);
      verifyServerResponse(data);

      toast({
        title: "Success!",
        description: "Property rejected",
        variant: "success",
        duration: 3000,
      });

      setShowRejectArea(false);
      setReason("");
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed!",
        description: "Failed to reject property",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const propertyMeta = property.meta ? JSON.parse(property.meta) : null;

  return (
    <div>
      <div className="mb-4 border py-2 px-2">
        <div>
          Current Property Status:{" "}
          <span className="font-bold">{property.status.toUpperCase()}</span>
        </div>

        {property.status === "rejected" && (
          <div className="mt-3">
            Reject Reason:{" "}
            <span className="font-bold">
              {propertyMeta?.rejectedReason ?? "N/A"}
            </span>
          </div>
        )}
      </div>

      {!showRejectArea && (
        <div className="flex gap-4 items-center">
          {publishStatus.includes(property.status) && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <ActionButton text="Publish" loading={loading} />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handlePublish}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {rejectStatus.includes(property.status) && (
            <Dialog>
              <DialogTrigger asChild>
                <ActionButton
                  text="Reject"
                  loading={loading}
                  variant="destructive"
                />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reject Property</DialogTitle>
                  <DialogDescription>
                    Please enter a reason for rejecting this property
                  </DialogDescription>
                </DialogHeader>

                <div>
                  <TextArea
                    label="Reason"
                    value={reason}
                    onChange={(e) => {
                      setReason(e.target.value);
                    }}
                  />
                </div>

                <DialogFooter>
                  <div className="flex gap-4 mt-5">
                    <DialogClose>
                      <ActionButton
                        text="Cancel"
                        variant="secondary"
                        onClick={() => {
                          setShowRejectArea(false);
                        }}
                        loading={loading}
                      />
                    </DialogClose>

                    <ActionButton
                      text="Reject"
                      variant="destructive"
                      onClick={handleReject}
                      loading={loading}
                    />
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}

      {showRejectArea && (
        <div>
          <h4 className="font-semibold">Reject Property:</h4>
          <p className="mb-4">
            Please enter a reason for rejecting this property
          </p>

          <TextArea
            label="Reason"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
            }}
          />

          <div className="flex gap-4 mt-5">
            <ActionButton
              text="Cancel"
              variant="secondary"
              onClick={() => {
                setShowRejectArea(false);
              }}
              loading={loading}
            />
            <ActionButton
              text="Reject"
              variant="destructive"
              onClick={handleReject}
              loading={loading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminButtons;
