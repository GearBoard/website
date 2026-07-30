import { CreatePostCard } from "@/features/post/components/CreatePostCard";

export default function Home() {
  return (
    <section className="min-h-full bg-light-gray px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto w-full max-w-[720px]">
        <CreatePostCard />
      </div>
    </section>
  );
}
