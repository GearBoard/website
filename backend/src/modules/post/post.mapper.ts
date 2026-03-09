import { PostResponseDto, AuthorInfoDto } from "./post.dto.js";

interface PostWithRelations {
  id: bigint;
  userId: bigint;
  title: string;
  description: string;
  isClosed: boolean;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  user: {
    id: bigint;
    username: string;
    image: string | null;
  };
  tags: Array<{
    postId: bigint;
    tagId: bigint;
    tag: {
      id: bigint;
      name: string;
    };
  }>;
  images: Array<{
    id: bigint;
    postId: bigint;
    url: string;
  }>;
}

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
