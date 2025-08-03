"use client";

import React, { useEffect } from "react";
import CustomModal from "../modal/CustomModal";
import RegisterForm from "../forms/Register";
import { useLocalSearchParams } from "@/hooks/useLocalSearchParams";

interface Props {
  isShown: boolean;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
}

const RegisterUserModal = (props: Props) => {
  const { getSearchParams, deleteSearchParams } = useLocalSearchParams();
  const addedByAdmin = getSearchParams("addedByAdmin"); // Replace 'addedByAdmin' with the actual query parameter name you want to check for

  useEffect(() => {
    if (addedByAdmin && addedByAdmin === "true") {
      props.setIsShown(false);
      deleteSearchParams("addedByAdmin");
    }
  }, [addedByAdmin]);

  return (
    <CustomModal
      isShown={props.isShown}
      setIsShown={props.setIsShown}
      title="Add New User"
    >
      <RegisterForm />
    </CustomModal>
  );
};

export default RegisterUserModal;
