import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/data/properties";
import { Stamp } from "@/components/ui/Stamp";
import { cn } from "@/lib/utils";

const imageHover: Record<Property["category"], string> = {
  villa:
    "transition-[transform,filter] duration-[1400ms] ease-out group-hover:scale-[1.05] group-hover:brightness-[1.03]",
  apartment:
    "transition-[filter,transform] duration-[1400ms] ease-out group-hover:scale-[1.04] group-hover:brightness-[0.62]",
  farmland:
    "transition-[transform,filter] duration-[1600ms] ease-out group-hover:scale-[1.08] group-hover:brightness-[1.05]",
};

interface PropertyCardProps {
  property: Property;
  large?: boolean;
  className?: string;
}

export function PropertyCard({ property, large, className }: PropertyCardProps) {
  const ratio = large ? "aspect-[4/5]" : "aspect-[4/3]";
  const dim = property.tall || large ? 1200 : 900;

  return (
    <Link
      href={`/properties/${property.slug}`}
      className={cn("group block", className)}
    >
      <div className="relative overflow-hidden rounded-[2px] bg-carbon">
        <div className={ratio}>
          <Image
            src={`https://picsum.photos/seed/${property.seed}/${dim}/${dim}`}
            alt={`${property.title} - ${property.area}, ${property.location}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={cn("object-cover", imageHover[property.category])}
          />
        </div>

        {property.category === "apartment" && (
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_110%,rgba(14,14,11,0.95)_0%,rgba(14,14,11,0.35)_45%,transparent_70%)] opacity-0 transition-opacity duration-1000 ease-out group-hover:opacity-100" />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon/75 via-transparent to-transparent" />

        <div className="absolute left-0 right-0 top-4 flex justify-between px-5">
          <Stamp
            label={property.status}
            tone={
              property.status === "Available"
                ? "available"
                : property.status === "Sold"
                  ? "sold"
                  : "reserved"
            }
          />
          <span className="stamp flex items-center border border-brass/60 bg-carbon/40 px-2.5 py-1 text-brass">
            Folio {property.folio}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="eyebrow text-emerald">{property.location}</p>
          <h3 className="mt-2 font-display text-3xl font-light text-paper">
            {property.title}
          </h3>
          <p className="mt-2 text-[15px] text-paper/80">
            {property.price} · {property.area}
          </p>
        </div>
      </div>
    </Link>
  );
}
