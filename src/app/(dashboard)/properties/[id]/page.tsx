import { checkIfProductInShop } from "@/actions/affiliates";
import { $requestWithoutToken } from "@/api/general";
import { authConfig } from "@/authConfig";
import PropertyWrapper from "@/components/property/PropertyWrapper";
import { USER_ROLE } from "@/constants/user";
import { IProperty } from "@/interface/property";
import { fetchPropertyById } from "@/services/properties.service";
import { getServerSession } from "next-auth";
import React from "react";

import { Metadata, ResolvingMetadata } from "next";

interface IParams {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata(
  props: IParams,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const id = params.id;

  const property = await fetchPropertyById(id, undefined, {
    cache: "force-cache",
    next: { revalidate: 300, tags: [`property-${id}`] },
  });

  if (!property?.success || !property?.data) {
    return {
      title: "Property Not Found",
    };
  }

  const data = property.data;
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: data.title,
    description: data.description || "View this property on Property Sec",
    openGraph: {
      title: data.title,
      description: data.description || "View this property on Property Sec",
      images: data.defaultImageUrl
        ? [data.defaultImageUrl, ...previousImages]
        : previousImages,
    },
  };
}

export default async function page(props: IParams) {
  const params = await props.params;
  const session = await getServerSession(authConfig);

  const token = session?.user.token;

  const property = await fetchPropertyById(params.id, token, {
    cache: "force-cache",
    next: { revalidate: 300, tags: [`property-${params.id}`] },
  });

  if (!property?.success || !property?.data) {
    return (
      <div className="container mx-auto py-10">
        <p className="text-center text-lg">Property not found</p>
      </div>
    );
  }

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
