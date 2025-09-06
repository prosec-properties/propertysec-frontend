"use client";

import React, { useState } from "react";
import CustomButton from "../buttons/CustomButton";
import { USER_ROLE } from "@/constants/user";
import { useUser } from "@/hooks/useUser";
import { IProduct } from "@/interface/product";
import { useRouter } from "next/navigation";
import CustomModal from "../modal/CustomModal";
import { formatPrice } from "@/lib/payment";
import { useMutation } from "@tanstack/react-query";
import { deleteProperty } from "@/services/properties.service";
import { useToast } from "../ui/use-toast";
import { extractServerErrorMessage } from "@/lib/general";

interface Props {
  product: IProduct;
}

const ProductDetails: React.FC<Props> = ({ product }) => {
  const { user, token } = useUser();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: deleteProperty,
    onSuccess: (data) => {
      toast({
        title: "Property deleted successfully",
        variant: "success",
      });
      setShowDeleteModal(false);
      router.back();
    },
    onError: (error) => {
      extractServerErrorMessage(error);
    },
  });

  const onDelete = () => {
    deleteMutation.mutate({
      accessToken: token,
      propertyId: product.id,
    });
  };

  const roleButtons = {
    [USER_ROLE.LANDLORD]: (
      <SellerButtons
        product={product}
        setShowDeleteModal={setShowDeleteModal}
      />
    ),
    [USER_ROLE.BUYER]: <BuyerButtons product={product} />,
    [USER_ROLE.AFFILIATE]: <AffiliateButtons product={product} />,
    default: <PreviewButtons />,
  };

  return (
    <div>
      <div className="mb-2 text-grey9">
        <h1 className="font-medium text-xl">{product?.title}</h1>
      </div>

      <div className="mb-4">
        <p className="font-normal text-sm text-gray-500">{product?.address}</p>
      </div>

      <div className="mb-4">
        <p className="text-lg font-semibold text-grey10">
          {formatPrice(product?.price, "NGN")}
          {product.negotiable && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              (Negotiable)
            </span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm px-3 py-1 bg-gray-100 rounded-full">
          Condition: {product.condition}
        </span>
        <span className="text-sm px-3 py-1 bg-gray-100 rounded-full">
          Status: {product.status}
        </span>
        {product.quantity > 0 && (
          <span className="text-sm px-3 py-1 bg-gray-100 rounded-full">
            In Stock: {product.quantity}
          </span>
        )}
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-2">Description</h3>
        <p className="text-sm text-greyBody">{product?.description}</p>
      </div>

      {product.specifications && (
        <div className="mb-6">
          <h3 className="font-medium mb-2">Specifications</h3>
          <div
            className="text-sm text-greyBody"
            dangerouslySetInnerHTML={{ __html: product.specifications }}
          />
        </div>
      )}

      {product.brand && (
        <div className="mb-6">
          <h3 className="font-medium mb-2">Brand</h3>
          <p className="text-sm text-greyBody">{product.brand}</p>
        </div>
      )}

      {product.model && (
        <div className="mb-6">
          <h3 className="font-medium mb-2">Model</h3>
          <p className="text-sm text-greyBody">{product.model}</p>
        </div>
      )}

      {roleButtons[user?.role ?? "default"]}

      <CustomModal
        title="Delete Product"
        isShown={showDeleteModal}
        setIsShown={setShowDeleteModal}
      >
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this product? This action cannot be
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
              onClick={onDelete}
            >
              Deleteee
            </CustomButton>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

const BuyerButtons: React.FC<{ product: IProduct }> = ({ product }) => {
  return (
    <div>
      <CustomButton className="w-full mb-4">
        {product.availability === "available" ? "Add to Cart" : "Out of Stock"}
      </CustomButton>
      <div className="md:flex gap-6 mb-4">
        <ActionButton text="Call Seller" variant="secondary" />
        <ActionButton text="WhatsApp Seller" variant="secondary" />
      </div>
      <ActionButton text="Save for Later" variant="tertiary" />
    </div>
  );
};

const SellerButtons: React.FC<{
  product: IProduct;
  setShowDeleteModal: (show: boolean) => void;
}> = ({ product, setShowDeleteModal }) => {
  const router = useRouter();

  return (
    <div>
      <ActionButton
        text="Edit Product"
        // onClick={() => router.push(`${EDIT_PRODUCT_ROUTE}/${product.id}`)}
      />
      <ActionButton
        text="Delete"
        variant="secondary"
        onClick={() => setShowDeleteModal(true)}
      />
    </div>
  );
};

const AffiliateButtons: React.FC<{ product: IProduct }> = ({ product }) => {
  return (
    <div>
      <ActionButton text="Copy Product URL" />
      <ActionButton
        text={
          product.availability === "available"
            ? "Add to My Shop"
            : "Product Unavailable"
        }
        variant="secondary"
      />
    </div>
  );
};

const PreviewButtons: React.FC = () => (
  <div>
    <ActionButton text="Save Product" />
    <ActionButton text="Contact Admin" variant="secondary" />
  </div>
);

const ActionButton: React.FC<{
  text: string;
  variant?: "primary" | "secondary" | "tertiary";
  onClick?: () => void;
}> = ({ text, variant = "primary", onClick }) => (
  <CustomButton variant={variant} className="w-full mb-4" onClick={onClick}>
    {text}
  </CustomButton>
);

export default ProductDetails;
