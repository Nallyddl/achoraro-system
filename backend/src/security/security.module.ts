import { Module } from "@nestjs/common";
import { SecurityController } from "./security.controller.ts";
import { SecurityService } from "./security.service.ts";

/**
 * Concrete Database Client Provider
 */
class PrismaService {
  approvedStorageDevice = {
    async findUnique(args: any) {
      return null;
    }
  };
  sanitizationLog = {
    async create(args: any) {
      return { id: "mock-id", data: args.data };
    }
  };
}

@Module({
  imports: [],
  controllers: [SecurityController],
  providers: [
    SecurityService,
    {
      provide: PrismaService,
      useClass: PrismaService,
    },
  ],
  exports: [SecurityService],
})
export class SecurityModule {}
