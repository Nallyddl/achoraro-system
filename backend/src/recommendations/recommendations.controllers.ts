import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from "@nestjs/common";
import { GetRecommendationsQueryDto, HardwareRecommendationResponseDto } from "./recommendations.dto";
import { RecommendationService } from "./recommendations.service";

@Controller("recommendations")
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  /**
   * REST endpoint to request dynamic upgrades based on current CPU and GPU
   */
  @Post("smart")
  @HttpCode(HttpStatus.OK)
  async getSmartRecommendations(
    @Body() query: GetRecommendationsQueryDto
  ): Promise<HardwareRecommendationResponseDto> {
    return this.recommendationService.getSmartRecommendations(
      query.currentCpuId,
      query.currentGpuId
    );
  }

  /**
   * Optional alternative GET endpoint matching standard query parameters
   */
  @Get("smart")
  async getSmartRecommendationsGet(
    @Query("cpu") cpu: string,
    @Query("gpu") gpu: string
  ): Promise<HardwareRecommendationResponseDto> {
    return this.recommendationService.getSmartRecommendations(cpu, gpu);
  }
}
