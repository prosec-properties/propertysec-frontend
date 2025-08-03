import React from "react";
import ChatDoubleIcon from "../icons/ChatDouble";
import CallIcon from "../icons/Call";
import LocationIcon from "../icons/Location";
import ContactForm from "../forms/ContactForm";

const ContactWrapper = () => {
  const contacts = [
    {
      title: "Chat us",
      description: "Our friendly team is here to help you",
      contact: "Support@propertysec.com",
      icon: <ChatDoubleIcon />,
    },
    {
      title: "Call us",
      description: "You can always call us to tell us your mind",
      contact: "+2347081931289",
      icon: <CallIcon />,
    },
    {
      title: "Visit us",
      description: "Come say hello to us in our office",
      contact: "N0 47, Eastland Abuja, NIigeria.",
      icon: <LocationIcon />,
    },
  ];
  return (
    <div className="md:flex md:justify-betwen md:gap-8">
      <div className="bg-primary md:basis-[40%] p-2 pt-4 md:px-6  md:py-12 md:space-y-2 my-8  ">
        {contacts.map((contact, index) => (
          <div key={index} className="mb-[5rem]">
            <ContactOption
              title={contact.title}
              description={contact.description}
              contact={contact.contact}
              icon={contact.icon}
            />
          </div>
        ))}
      </div>
      <div className="md:basis-[60%] mx-auto max-w-screen-xl space-y-8 px-4 py-16 sm:px-6 lg:space-y-16 lg:px-8">
        <ContactForm />
      </div>
    </div>
  );
};

export default ContactWrapper;

interface ContactOptionProps {
  title: string;
  description: string;
  contact: string;
  icon: React.ReactElement<SVGElement>;
}
const ContactOption = (props: ContactOptionProps) => {
  return (
    <div className="text-white grid justify-center ga grid-rows-3 grid-cols-4">
      <div className="border border-grey4 size-[2.5rem] bg-white rounded-[0.3125rem] self-center justify-self-center flex justify-center items-center row-span-1 col-span-1">
        {props.icon}
      </div>
      <div className="row-span-2 col-span-3">
        <h2 className="text-xl font-medium mb-3">{props.title}</h2>
        <p className="text-sm mb-4">{props.description}</p>
        <p>{props.contact}</p>
      </div>
    </div>
  );
};
