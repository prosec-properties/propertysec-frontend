import ProductCard from "@/components/property/PropertyCard";
import { fetchAllProperties } from "@/services/properties.service";
import { IProperty } from "@/interface/property";

export default async function FeaturedProperties() {
    let properties;
    try {
        properties = await fetchAllProperties(undefined, {
            cache: "force-cache",
            next: { revalidate: 300, tags: ["properties"] },
        });
    } catch (error) {
        console.error('Failed to fetch properties:', error);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const publishedProperties = properties?.data?.data?.filter((property: any) => property.status === 'published') || [];
    const hasPublishedProperties = publishedProperties.length > 0;

    return (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {!properties && (
                <p className="col-span-full text-center text-gray-500">
                    Unable to load properties. Please try again later.
                </p>
            )}
            {properties && !hasPublishedProperties && (
                <p className="col-span-full text-center text-gray-500">
                    No published properties available at the moment.
                </p>
            )}
            {hasPublishedProperties &&
                publishedProperties.map((property: IProperty, index: number) => (
                    <ProductCard key={index} property={property} />
                ))
            }
        </div>
    );
}
