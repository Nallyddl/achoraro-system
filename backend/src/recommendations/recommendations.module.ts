import { Module } from "@nestjs/common";
import { RecommendationController } from "./recommendations.controllers";
import { RecommendationService } from "./recommendations.service.js";

/**
 * Custom Mock Database Client injection matching production providers
 */
class PrismaService {
  product = {};
  cpu = {};
  gpu = {};
}

@Module({
  imports: [],
  controllers: [RecommendationController],
  providers: [
    RecommendationService,
    {
      provide: PrismaService,
      useClass: PrismaService,
    },
  ],
  exports: [RecommendationService],
})
export class RecommendationModule {}
