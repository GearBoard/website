import { toPostDto } from "./post.mapper.js";
import { postRepository } from "./post.repository.js";
import {
  PostResponseDto,
  PostPaginatedDto,
  CreatePostRequestDto,
  UpdatePostRequestDto,
} from "./post.dto.js";
import { GetAllPostsQuery } from "./post.schema.js";
import { getSkipTake } from "../../common/utils/pagination.js";

export const postService = {
  async getById(id: bigint): Promise<PostResponseDto | null> {
    // Check if post exists
    const post = await postRepository.findById(id);
    if (!post) {
      return null; // Post not found - will be handled as 404 in controller
    }

    return toPostDto(post);
  },

  async getAll(query: GetAllPostsQuery): Promise<PostPaginatedDto> {
    const { skip, take } = getSkipTake(query.page, query.limit);

    const { posts, total } = await postRepository.findMany({
      skip,
      take,
      search: query.search,
      tagName: query.tag,
      userId: query.userId,
    });

    return {
      data: posts.map(toPostDto),
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    };
  },

  async create(data: CreatePostRequestDto, userId: bigint): Promise<PostResponseDto> {
    const post = await postRepository.create(data, userId);
    return toPostDto(post);
  },

  async update(
    id: bigint,
    data: UpdatePostRequestDto,
    userId: bigint
  ): Promise<PostResponseDto | null> {
    // Check if post exists and get ownership info
    const post = await postRepository.findById(id);
    if (!post) {
      return null; // Post not found
    }

    // Check if user is owner
    if (post.userId !== userId) {
      return null; // Not owner
    }

    const updatedPost = await postRepository.update(id, data);
    return updatedPost ? toPostDto(updatedPost) : null;
  },

  async delete(id: bigint, userId: bigint): Promise<boolean | null> {
    // Check if post exists and get ownership info
    const post = await postRepository.findById(id);
    if (!post) {
      return null; // Post not found
    }

    // Check if user is owner
    if (post.userId !== userId) {
      return false; // Not owner
    }

    await postRepository.delete(id);
    return true;
  },
};
