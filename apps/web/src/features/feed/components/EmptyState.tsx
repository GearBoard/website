import Image from "next/image";

type EmptyStateProps = {
  title: string;
  description?: string;
};

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex w-[250px] flex-col items-center justify-center text-center">
      <Image
        src="/empty.svg"
        alt="Empty state illustration"
        width={250}
        height={120}
        className="mb-4 h-auto w-full max-w-[220px]"
      />

      <h2 className="break-all text-[20px] font-bold text-primary-red">{title}</h2>

      {description && (
        <p className="break-all text-[14px] font-medium text-dark-gray">{description}</p>
      )}
    </div>
  );
}
