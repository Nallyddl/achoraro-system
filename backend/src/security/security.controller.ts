import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import {
    CertifyRequestDto,
    CertifyResponseDto,
    HandshakeRequestDto,
    HandshakeResponseDto
} from "./security.dto.ts";
import { SecurityService } from "./security.service.ts";

@Controller("api/v1/security")
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  /**
   * Endpoint for Hardware Recognition & Wipe Method Certification handshake
   * Initiated by local agent to verify correct standards before wiping
   */
  @Post("handshake")
  @HttpCode(HttpStatus.OK)
  async processHandshake(
    @Body() dto: HandshakeRequestDto
  ): Promise<HandshakeResponseDto> {
    return this.securityService.processHandshake(dto);
  }

  /**
   * Endpoint to register successful wipe evidence and sign digital NIST 800-88 compliance certificate
   */
  @Post("certify")
  @HttpCode(HttpStatus.CREATED)
  async certifySanitization(
    @Body() dto: CertifyRequestDto
  ): Promise<CertifyResponseDto> {
    return this.securityService.certifySanitization(dto);
  }
}
