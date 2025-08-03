import React from "react";
import ActionButton from "../buttons/ActionButton";

const PreviewButtons: React.FC = () => (
  <div>
    <ActionButton text="Save Property" />
    <ActionButton text="Call Admin" variant="secondary" />
    <ActionButton text="Message Admin" variant="secondary" />
  </div>
);

export default PreviewButtons;
