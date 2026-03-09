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
    const post = await postRepository.findById(id);
    return post ? toPostDto(post) : null;
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
    // Check if user is owner or admin
    const isOwner = await postRepository.checkOwnership(id, userId);
    const isAdmin = await postRepository.checkIsAdmin(userId);

    if (!isOwner && !isAdmin) {
      return null; // Will be handled as unauthorized in controller
    }

    const post = await postRepository.update(id, data);
    return post ? toPostDto(post) : null;
  },

  async delete(id: bigint, userId: bigint): Promise<boolean> {
    // Check if user is owner or admin
    const isOwner = await postRepository.checkOwnership(id, userId);
    const isAdmin = await postRepository.checkIsAdmin(userId);

    if (!isOwner && !isAdmin) {
      return false; // Will be handled as unauthorized in controller
    }

    await postRepository.delete(id);
    return true;
  },
};
