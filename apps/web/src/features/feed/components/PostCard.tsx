"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Bookmark, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Popover } from "radix-ui";
import { cn, formatRelativeTime } from "@/shared/libs/utils";
import { ConfirmModal } from "@/shared/components/ConfirmModal";
import { useDeletePost } from "@/shared/hooks";

export interface PostCardAuthor {
  id: string;
  name: string;
  image: string | null;
}

export interface PostCardProps {
  postId: string;
  title: string;
  description: string;
  tags: string[];
  likeCount: number;
  commentCount: number;
  authorInfo: PostCardAuthor;
  createdAt: string;
  imageUrl?: string | null;
  isLiked?: boolean;
  isSaved?: boolean;
  isOwner?: boolean;
  className?: string;
  onClick?: () => void;
  onLikeClick?: () => void;
  onCommentClick?: () => void;
  onSaveClick?: () => void;
  onMenuClick?: () => void;
  onEditClick?: () => void;
  onDeleted?: () => void;
}

const TAG_COLOR_CLASSES = [
  "bg-[#44ADE2]/50 text-[#008ACF]",
  "bg-[#9533F0]/50 text-[#9755D5]",
  "bg-[#248F53]/50 text-[#248F53]",
];

export default function PostCard({
  postId,
  title,
  description,
  tags,
  likeCount,
  commentCount,
  authorInfo,
  createdAt,
  imageUrl,
  isLiked = false,
  isSaved = false,
  isOwner = false,
  className,
  onClick,
  onLikeClick,
  onCommentClick,
  onSaveClick,
  onMenuClick,
  onEditClick,
  onDeleted,
}: PostCardProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { trigger: deletePost, isMutating: isDeleting } = useDeletePost(postId);

  const stop = (handler?: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    handler?.();
  };

  async function handleConfirmDelete() {
    setDeleteError(null);
    try {
      await deletePost();
      setIsConfirmingDelete(false);
      onDeleted?.();
    } catch {
      setDeleteError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    }
  }

  return (
    <article
      onClick={onClick}
      className={cn(
        "bg-white rounded-lg overflow-hidden flex flex-col gap-3.5 w-full py-4",
        onClick && "cursor-pointer",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 px-5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative size-10 shrink-0 rounded-full overflow-hidden">
            <Image
              src={authorInfo.image || "/profile.svg"}
              alt={authorInfo.name}
              fill
              sizes="40px"
              className="object-cover"
              unoptimized={!!authorInfo.image}
            />
          </div>
          <div className="flex flex-col min-w-0 mt-1">
            <span className="font-medium text-sm leading-[135%] text-black truncate">
              {authorInfo.name}
            </span>
            <span className="font-medium text-xs leading-[135%] text-dark-gray truncate">
              @{authorInfo.name}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <time className="font-medium text-xs leading-[135%] text-dark-gray" dateTime={createdAt}>
            {formatRelativeTime(createdAt)}
          </time>
          {isOwner && (
            <Popover.Root
              onOpenChange={(open) => {
                if (open) onMenuClick?.();
              }}
            >
              <Popover.Trigger asChild>
                <button
                  type="button"
                  onClick={stop()}
                  className="-mr-1.5 text-black cursor-pointer"
                  aria-label="ตัวเลือกเพิ่มเติม"
                >
                  <MoreVertical className="size-6" />
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  align="end"
                  sideOffset={8}
                  onClick={(e) => e.stopPropagation()}
                  className={cn(
                    "z-50 w-40 rounded-lg bg-white p-2 shadow-primary-red",
                    "data-[state=open]:animate-in data-[state=closed]:animate-out",
                    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
                  )}
                >
                  <button
                    type="button"
                    onClick={stop(onEditClick)}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-black transition-colors hover:bg-light-gray"
                  >
                    <Pencil className="size-4" />
                    แก้ไขข้อมูล
                  </button>
                  <button
                    type="button"
                    onClick={stop(() => setIsConfirmingDelete(true))}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-primary-red transition-colors hover:bg-primary-red/10"
                  >
                    <Trash2 className="size-4" />
                    ลบโพสต์
                  </button>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          )}
        </div>
      </div>

      {isOwner && (
        <ConfirmModal
          open={isConfirmingDelete}
          onOpenChange={(open) => {
            if (!open) setIsConfirmingDelete(false);
          }}
          title="ลบโพสต์"
          message="คุณแน่ใจหรือไม่ว่าต้องการลบโพสต์นี้? การกระทำนี้ไม่สามารถย้อนกลับได้"
          confirmLabel="ลบ"
          cancelLabel="ยกเลิก"
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsConfirmingDelete(false)}
          isLoading={isDeleting}
          errorMessage={deleteError ?? undefined}
        />
      )}

      <div className="flex flex-col gap-1.5 -mb-1 px-5">
        <h3 className="font-semibold text-xl leading-[135%] text-black">{title}</h3>
        <p className="font-medium text-base leading-[135%] text-black line-clamp-3">
          {description}
        </p>
      </div>

      {imageUrl && (
        <div className="px-5">
          {/* eslint-disable-next-line @next/next/no-img-element -- post image dimensions aren't known ahead of time (not stored in the schema), so next/image's required width/height can't be set; a plain img lets the browser size it to its natural aspect ratio */}
          <img src={imageUrl} alt="" className="w-full h-auto" />
        </div>
      )}

      <div className="px-5">
        <div className="border-t border-gray" />
      </div>

      <div className="flex items-center justify-between gap-2.5 px-5 -mt-1">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          {tags.map((tag, i) => (
            <span
              key={tag}
              className={cn(
                "px-2 py-1 rounded-lg font-semibold text-base leading-[135%]",
                TAG_COLOR_CLASSES[i % TAG_COLOR_CLASSES.length]
              )}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <button
            type="button"
            onClick={stop(onLikeClick)}
            className="group flex items-center gap-2 text-black cursor-pointer"
            aria-label="ถูกใจ"
            aria-pressed={isLiked}
          >
            <Heart
              className={cn(
                "size-5 transition-colors",
                isLiked ? "text-primary-red" : "text-black group-hover:text-primary-red"
              )}
              fill={isLiked ? "currentColor" : "none"}
            />
            <span className="font-inter font-semibold text-base leading-[135%]">{likeCount}</span>
          </button>
          <button
            type="button"
            onClick={stop(onCommentClick)}
            className="group flex items-center gap-2 text-black cursor-pointer"
            aria-label="แสดงความคิดเห็น"
          >
            <MessageCircle className="size-5 text-black transition-colors group-hover:text-primary-red" />
            <span className="font-inter font-semibold text-base leading-[135%]">
              {commentCount}
            </span>
          </button>
          <button
            type="button"
            onClick={stop(onSaveClick)}
            className={cn(
              "cursor-pointer transition-colors hover:text-primary-red",
              isSaved ? "text-primary-red" : "text-black"
            )}
            aria-label="บันทึกโพสต์"
            aria-pressed={isSaved}
          >
            <Bookmark className="size-6" fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </article>
  );
}
