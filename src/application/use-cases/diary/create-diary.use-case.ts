import { Inject, Injectable } from '@nestjs/common';

import { DiaryEntity } from '@domain/entities/diary/diary.entity';
import { ResourceType } from '@domain/entities/resource/resource.interface';
import { CreateDiary, DIARY_REPOSITORY_TOKEN, IDiaryRepository } from '@domain/repositories/diary/diary.repository';
import { IResourceRepository, RESOURCE_REPOSITORY_TOKEN } from '@domain/repositories/resource/resource.repository';

export interface CreateDiaryInput {
  data: Omit<CreateDiary, 'resource'>;
  userId: number;
}

@Injectable()
export class CreateDiaryUseCase {
  constructor(
    @Inject(RESOURCE_REPOSITORY_TOKEN)
    private readonly resourceRepository: IResourceRepository,
    @Inject(DIARY_REPOSITORY_TOKEN)
    private readonly diaryRepository: IDiaryRepository
  ) {}

  async execute(input: CreateDiaryInput): Promise<DiaryEntity> {
    const { data, userId } = input;

    const resource = await this.resourceRepository.create({
      type: ResourceType.DIARY,
      userId
    });

    const diary = await this.diaryRepository.create({
      ...data,
      resource
    });

    return new DiaryEntity(diary);
  }
}
