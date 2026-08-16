"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown, Loader2, MessageCircleX } from "lucide-react";
import PostCard from "@/features/feed/components/PostCard";
import AboutCard from "@/features/feed/components/AboutCard";
import CreateComment from "@/features/comment/components/CreateComment";
import CommentItem from "@/features/comment/components/CommentItem";
import {
  useGetPostById,
  useGetPostComments,
  useCreateComment,
  useUploadImage,
  useGetMe,
} from "@/shared/hooks";
import { authClient } from "@/shared/libs/auth-client";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { data: me } = useGetMe();
  const { data: post, error, isLoading, mutate } = useGetPostById(id);
  const { data: comments, mutate: mutateComments } = useGetPostComments(id);
  const { trigger: uploadImage } = useUploadImage();
  const { trigger: createComment } = useCreateComment(id);

  const name = me?.name || "John doe";
  const username = me?.name ? me.name.toLowerCase().replace(/\s+/g, ".") : "john.doe";
  const currentUser = { name, username, avatar: me?.image ?? undefined };

  const topLevelComments = (comments ?? []).filter((c) => !c.parentId);

  const handleCommentSubmit = async ({ content, image }: { content: string; image?: File }) => {
    let images: string | undefined;
    if (image) {
      const result = await uploadImage(image);
      images = result.url;
    }
    await createComment({ content, images });
    await Promise.all([mutate(), mutateComments()]);
  };

  return (
    <section className="min-h-full bg-light-gray px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex w-full max-w-[728px] gap-6 lg:max-w-[1040px]">
        <div className="flex w-full flex-col gap-4 lg:max-w-[728px]">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex w-fit items-center gap-2 font-medium text-black hover:text-primary-red md:hidden"
          >
            <ArrowLeft className="size-5" />
            ย้อนกลับ
          </button>

          {isLoading ? (
            <div className="rounded-lg bg-white p-6" role="status" aria-label="กำลังโหลดโพสต์">
              <Loader2
                className="mx-auto size-6 animate-spin text-primary-red"
                aria-hidden="true"
              />
            </div>
          ) : error || !post ? (
            <div className="rounded-lg bg-white p-6 text-center">
              <p className="text-primary-red">ไม่พบโพสต์นี้</p>
              <button
                type="button"
                className="mt-2 font-medium text-primary-red underline"
                onClick={() => void mutate()}
              >
                ลองอีกครั้ง
              </button>
            </div>
          ) : (
            <div className="flex w-full flex-col gap-5 rounded-lg bg-white px-5 py-4">
              <PostCard
                title={post.title}
                description={post.description}
                tags={post.tags}
                likeCount={post.likeCount}
                commentCount={post.commentCount}
                authorInfo={post.authorInfo}
                createdAt={post.createdAt}
                imageUrl={post.images[0]}
                isOwner={session?.user?.id === post.authorInfo.id}
                expanded
                bare
              />

              <CreateComment user={currentUser} onSubmit={handleCommentSubmit} />

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-lg leading-[135%] text-primary-red">
                      ความคิดเห็น
                    </span>
                    <span className="font-medium text-base leading-[135%] text-dark-gray">
                      {post.commentCount}
                    </span>
                  </div>
                  {topLevelComments.length > 0 && (
                    <button
                      type="button"
                      className="flex items-center gap-1 font-medium text-base leading-[135%] text-dark-gray"
                    >
                      ใหม่ล่าสุด
                      <ChevronDown className="size-4" />
                    </button>
                  )}
                </div>

                {topLevelComments.length === 0 ? (
                  <div className="flex flex-col items-center gap-1 py-16">
                    <MessageCircleX className="size-[54px] text-gray" strokeWidth={1.5} />
                    <p className="text-center font-bold text-xl leading-[135%] text-gray">
                      ยังไม่มีความคิดเห็น
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-8">
                    {topLevelComments.map((comment) => (
                      <CommentItem
                        key={comment.id}
                        comment={comment}
                        currentUser={currentUser}
                        onReplyCreated={async () => {
                          await mutateComments();
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="hidden lg:block">
          <AboutCard />
        </div>
      </div>
    </section>
  );
}
