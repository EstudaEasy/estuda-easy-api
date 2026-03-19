import { Module } from '@nestjs/common';

import { GroupPostUseCasesModule } from '@application/use-cases/group-post/group-post.use-cases';
import { GroupPostController } from '@presentation/http/controllers/group-post/group-post.controller';

@Module({
  imports: [GroupPostUseCasesModule],
  controllers: [GroupPostController]
})
export class GroupPostModule {}
