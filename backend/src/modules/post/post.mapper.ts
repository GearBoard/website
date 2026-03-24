import { PostResponseDto, AuthorInfoDto } from "./post.dto.js";
import { Prisma } from "../../../generated/prisma/client.js";
import { postInclude } from "./post.repository.js";

export type PostWithRelations = Prisma.PostGetPayload<{ include: typeof postInclude }>;

export function toPostDto(post: PostWithRelations): PostResponseDto {
  return {
    id: post.id.toString(),
    title: post.title,
    description: post.description,
    tags: post.tags.map((pt) => pt.tag.name),
    images: post.images.map((pi) => pi.url),
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    isClosed: post.isClosed,
    authorInfo: {
      id: post.user.id.toString(),
      username: post.user.username,
      image: post.user.image,
    },
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };
}
