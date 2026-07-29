import { postRepository } from "../post.repository.js";
import { CreatePostOutputDTO, type CreatePostBody } from "../dto/create-post.dto.js";
import { tagRepository } from "../../tag/tag.repository.js";
import { NotFoundError } from "../../../common/errors/app-error.js";

export async function createPostService(
  data: CreatePostBody,
  userId: string
): Promise<CreatePostOutputDTO> {
  const tags = await tagRepository.findManyByIds(data.tagIds);
  if (tags.length !== data.tagIds.length) {
    throw new NotFoundError("Tag not found");
  }

  const post = await postRepository.create(
    {
      title: data.title,
      description: data.description,
      images: data.images,
      tags,
    },
    userId
  );

  return CreatePostOutputDTO.toDTO(post);
}
