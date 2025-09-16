"use client";

import React, { useState } from "react";
import { IUser } from "@/interface/user";
import { useCopyToClipboard } from "usehooks-ts";
import { toast } from "../ui/use-toast";
import { addParamsToUrl, verifyServerResponse } from "@/lib/general";
import {
  addPropertyToShop,
  removePropertyFromShop,
} from "@/actions/affiliates";
import ActionButton from "../buttons/ActionButton";

interface AffiliateButtonsProps {
  user?: IUser;
  isInAffiliateShop?: boolean;
  propertyId: string;
}

const AffiliateButtons: React.FC<AffiliateButtonsProps> = ({
  user,
  isInAffiliateShop,
  propertyId,
}) => {
  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const [loading, setLoading] = useState(false);

  const handleAddToShop = async () => {
    try {
      setLoading(true);
      const data = await addPropertyToShop(propertyId);
      verifyServerResponse(data);
      toast({
        title: "Success!",
        description: "Property added to shop",
        variant: "success",
        duration: 3000,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed!",
        description: "Failed to add property to shop",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromShop = async () => {
    try {
      setLoading(true);
      const data = await removePropertyFromShop(propertyId);
      verifyServerResponse(data);
      toast({
        title: "Success!",
        description: "Property removed from shop",
        variant: "success",
        duration: 3000,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed!",
        description: "Failed to remove property from shop",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {isInAffiliateShop && (
        <ActionButton
          text="Copy Property URL"
          onClick={() => {
            // Get the current URL and remove any query parameters
            const currentUrl = window.location.href.split("?")[0];
            copyToClipboard(
              addParamsToUrl(currentUrl, {
                aff: user?.id,
              })
            )
              .then(() => {
                toast({
                  title: "Copied!",
                  description: "Copied to clipboard",
                  variant: "success",
                  duration: 3000,
                });
              })
              .catch(() => {
                toast({
                  title: "Failed to copy!",
                  description: "Failed to copy to clipboard",
                  variant: "destructive",
                  duration: 3000,
                });
              });
          }}
        />
      )}

      <ActionButton
        text={`${isInAffiliateShop ? "Remove" : "Add"} Product From Shop`}
        variant="secondary"
        onClick={isInAffiliateShop ? handleRemoveFromShop : handleAddToShop}
        loading={loading}
      />
    </div>
  );
};

export default AffiliateButtons;
