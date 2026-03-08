import { Inject, Injectable } from '@nestjs/common';

import { DeckEntity } from '@domain/deck/deck.entity';
import { CreateDeck, DECK_REPOSITORY_TOKEN, IDeckRepository } from '@domain/deck/deck.repository';
import { ResourceType } from '@domain/resource/resource.interface';
import { IResourceRepository, RESOURCE_REPOSITORY_TOKEN } from '@domain/resource/resource.repository';

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
