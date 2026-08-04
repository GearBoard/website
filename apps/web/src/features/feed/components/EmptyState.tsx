import Image from "next/image";
import { cn } from "@/shared/libs/utils";

type EmptyStateProps = {
  title?: string;
  description?: string;
  imageSrc?: string;
  imageWidth?: number;
  imageHeight?: number;
};

export default function EmptyState({
  title,
  description,
  imageSrc = "/empty.svg",
  imageWidth = 250,
  imageHeight = 120,
}: EmptyStateProps) {
  return (
    <div className="flex w-[250px] flex-col items-center justify-center text-center">
      <Image
        src={imageSrc}
        alt="Empty state illustration"
        width={imageWidth}
        height={imageHeight}
        className={cn("h-auto w-full max-w-[220px]", title && "mb-4")}
      />

      {title && <h2 className="text-[20px] font-bold text-primary-red">{title}</h2>}

      {description && (
        <p className="break-all text-[14px] font-medium text-dark-gray">{description}</p>
      )}
    </div>
  );
}
