import { Inject, Injectable } from '@nestjs/common';

import { DeckEntity } from '@domain/entities/deck/deck.entity';
import { ResourceType } from '@domain/entities/resource/resource.interface';
import { CreateDeck, DECK_REPOSITORY_TOKEN, IDeckRepository } from '@domain/repositories/deck/deck.repository';
import { IResourceRepository, RESOURCE_REPOSITORY_TOKEN } from '@domain/repositories/resource/resource.repository';

export interface CreateDeckInput {
  data: Omit<CreateDeck, 'resource'>;
  userId: number;
}

@Injectable()
export class CreateDeckUseCase {
  constructor(
    @Inject(RESOURCE_REPOSITORY_TOKEN)
    private readonly resourceRepository: IResourceRepository,
    @Inject(DECK_REPOSITORY_TOKEN)
    private readonly deckRepository: IDeckRepository
  ) {}

  async execute(input: CreateDeckInput): Promise<DeckEntity> {
    const { data, userId } = input;

    const resource = await this.resourceRepository.create({
      type: ResourceType.DECK,
      userId
    });

    const deck = await this.deckRepository.create({
      ...data,
      resource
    });

    return new DeckEntity(deck);
  }
}
