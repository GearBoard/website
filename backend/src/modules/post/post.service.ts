import { ForbiddenError, NotFoundError } from "../../common/errors/app-error.js";
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
  async getById(id: string): Promise<PostResponseDto> {
    const post = await postRepository.findById(id);
    if (!post) {
      throw new NotFoundError("Post not found");
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

  async create(data: CreatePostRequestDto, userId: string): Promise<PostResponseDto> {
    const post = await postRepository.create(data, userId);
    return toPostDto(post);
  },

  async update(id: string, data: UpdatePostRequestDto, userId: string): Promise<PostResponseDto> {
    const post = await postRepository.findById(id);
    if (!post) {
      throw new NotFoundError("Post not found");
    }

    if (post.userId !== userId) {
      throw new ForbiddenError("Forbidden");
    }

    const updatedPost = await postRepository.update(id, data);
    if (!updatedPost) {
      throw new NotFoundError("Post not found");
    }

    return toPostDto(updatedPost);
  },

  async delete(id: string, userId: string): Promise<void> {
    const post = await postRepository.findById(id);
    if (!post) {
      throw new NotFoundError("Post not found");
    }

    if (post.userId !== userId) {
      throw new ForbiddenError("Forbidden");
    }

    await postRepository.delete(id);
  },
};
