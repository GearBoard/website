"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";
import ReplyComment from "./ReplyComment";
import { useCreateReply, useLikeComment, useUnlikeComment } from "@/shared/hooks";
import { cn, formatRelativeTime } from "@/shared/libs/utils";

export interface CommentItemAuthor {
  id: string;
  name: string;
  image: string | null;
}

export interface CommentItemData {
  id: string;
  content: string;
  author?: CommentItemAuthor;
  createdAt: string;
  replies?: CommentItemData[];
}

export interface CommentItemProps {
  comment: CommentItemData;
  depth?: 0 | 1;
  currentUser: { name: string; username: string; avatar?: string };
  onReplyCreated?: () => void | Promise<void>;
}

export default function CommentItem({
  comment,
  depth = 0,
  currentUser,
  onReplyCreated,
}: CommentItemProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isReplying, setIsReplying] = useState(false);
  const { trigger: likeComment } = useLikeComment(comment.id);
  const { trigger: unlikeComment } = useUnlikeComment(comment.id);
  const { trigger: createReply } = useCreateReply(comment.id);

  const authorName = comment.author?.name ?? "ผู้ใช้ที่ถูกลบ";
  const username = authorName.toLowerCase().replace(/\s+/g, ".");
  const hasReplies = depth === 0 && !!comment.replies?.length;

  const handleLikeToggle = async () => {
    const result = isLiked ? await unlikeComment() : await likeComment();
    setIsLiked(result.liked);
    setLikeCount(result.likeCount);
  };

  const handleReplySubmit = async ({ content }: { content: string }) => {
    await createReply({ content });
    setIsReplying(false);
    await onReplyCreated?.();
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {/* the comment's own row: avatar column + content. The thread line lives in the
          avatar column and uses flex-1 so it always runs exactly to the bottom of this
          row's content — no hardcoded height that breaks on longer comments. */}
      <div className="flex w-full gap-2.5">
        <div className="flex shrink-0 flex-col items-center">
          <div className="relative size-10 shrink-0 rounded-full overflow-hidden">
            <Image
              src={comment.author?.image || "/profile.svg"}
              alt={authorName}
              fill
              sizes="40px"
              className="object-cover"
              unoptimized={!!comment.author?.image}
            />
          </div>
          {hasReplies && <div className="mt-1 w-0.5 flex-1 bg-red-tint-active" />}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex flex-col min-w-0">
              <span className="font-medium text-sm leading-[135%] text-black truncate">
                {authorName}
              </span>
              <span className="font-medium text-xs leading-[135%] text-dark-gray truncate">
                @{username}
              </span>
            </div>
            <time
              className="ml-auto font-medium text-xs leading-[135%] text-dark-gray"
              dateTime={comment.createdAt}
            >
              {formatRelativeTime(comment.createdAt)}
            </time>
          </div>

          <p className="font-medium text-base leading-[135%] text-black">{comment.content}</p>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => void handleLikeToggle()}
              className="group flex items-center gap-2 text-black cursor-pointer"
              aria-label="ถูกใจ"
              aria-pressed={isLiked}
            >
              <Heart
                className={cn(
                  "size-[18px] transition-colors",
                  isLiked ? "text-primary-red" : "text-black group-hover:text-primary-red"
                )}
                fill={isLiked ? "currentColor" : "none"}
              />
              <span className="font-semibold text-base leading-[135%]">{likeCount}</span>
            </button>

            {depth === 0 && (
              <button
                type="button"
                onClick={() => setIsReplying((prev) => !prev)}
                className="group flex items-center gap-2 text-black cursor-pointer"
              >
                <MessageCircle className="size-[18px] transition-colors group-hover:text-primary-red" />
                <span className="font-semibold text-base leading-[135%]">Reply</span>
              </button>
            )}
          </div>

          {isReplying && <ReplyComment user={currentUser} onSubmit={handleReplySubmit} />}
        </div>
      </div>

      {/* replies sit outside the row above so the thread line stops at that row's bottom;
          each reply then draws its own elbow connecting up to wherever the line left off */}
      {hasReplies && (
        <div className="flex w-full flex-col gap-6 pl-[50px]">
          {comment.replies!.map((reply, i) => (
            <div key={reply.id} className="relative">
              {/* every piece of the thread sits at x=19px so it lines up exactly with the
                  parent's line (centred in the 40px avatar column), and they all use the
                  solid red-tint-active token — overlapping segments then can't show up as
                  darker patches the way an alpha shade would. */}

              {/* run-through: keeps the line going past this reply down to the next one's
                  elbow. Omitted on the last reply so the thread ends at its avatar. */}
              {i < comment.replies!.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute -left-[31px] -top-[26px] -bottom-6 w-0.5 bg-red-tint-active"
                />
              )}

              {/* elbow: runs up past the 24px gap (plus 2px of overlap) to meet the line
                  above, then turns right into this reply's avatar centre at +21px */}
              <span
                aria-hidden="true"
                className="absolute -left-[31px] -top-[26px] h-[47px] w-[31px] rounded-bl-[14px] border-b-2 border-l-2 border-red-tint-active"
              />
              <CommentItem
                comment={reply}
                depth={1}
                currentUser={currentUser}
                onReplyCreated={onReplyCreated}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
