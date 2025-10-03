import { checkIfProductInShop } from "@/actions/affiliates";
import { $requestWithoutToken } from "@/api/general";
import { authConfig } from "@/authConfig";
import PropertyWrapper from "@/components/property/PropertyWrapper";
import { USER_ROLE } from "@/constants/user";
import { IProperty } from "@/interface/property";
import { fetchPropertyById } from "@/services/properties.service";
import { getServerSession } from "next-auth";
import React from "react";

interface IParams {
  params: Promise<{
    id: string;
  }>;
}

export default async function page(props: IParams) {
  const params = await props.params;
  const session = await getServerSession(authConfig);

  const token = session?.user. token;

  const property = await fetchPropertyById(params.id, token);

  let isInAffiliateShop = false;

  if (session?.user.role === USER_ROLE.AFFILIATE) {
    const res = await checkIfProductInShop(params.id);
    isInAffiliateShop = !!res?.data;
  }

  return (
    <PropertyWrapper
      property={property.data}
      role={session?.user.role}
      isInAffiliateShop={isInAffiliateShop}
    />
  );
}
