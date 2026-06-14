import { EraseMethod, StorageType } from "./prisma.types.ts";

/**
 * Handshake Request DTO sent by the local Windows operational agent
 */
export class HandshakeRequestDto {
  /**
   * Detected hardware model name (e.g. "Kingston NV2 1TB NVMe PCIe 4.0")
   */
  model!: string;

  /**
   * Unique hardware physical serial number
   */
  serialNumber!: string;

  /**
   * Hardware vendor detected from system BIOS/SMART query
   */
  vendor!: string;

  /**
   * Technician identifier conducting the sanitization run
   */
  technicianId!: string;
}

/**
 * Handshake Authorization response approving standard-specific erase directives
 */
export class HandshakeResponseDto {
  /**
   * Temporal authentication token validating this exact sanitization sequence
   */
  sessionToken!: string;

  /**
   * Homologated sanitization method chosen by the backend rules engine
   */
  eraseMethod!: EraseMethod;

  /**
   * Hardware Type classified
   */
  storageType!: StorageType;

  /**
   * Expiration date/time for the temporal authentication session (standard 1 hour)
   */
  expiresAt!: string;

  /**
   * Instructional payload mapping native command protocols required
   */
  agentGuidelines!: string[];
}

/**
 * Hardware metrics queried post-erasure validating null block states and raw drive integrity
 */
export interface HardwareVerificationPayload {
  smartHealthStatus: string;       // e.g. "GOOD", "98% LIFE"
  unallocatedBlocksCount: number;  // Must match sector size
  remainingLifePercent: number;    // e.g. 98
  totalWrittenBytes: number;       // Accumulated lifetime TBW
  isUnallocatedSpaceVerified: boolean; // Must be TRUE under NIST 800-88
}

/**
 * Certification Payload submitted upon successful standard execution
 */
export class CertifyRequestDto {
  /**
   * Match corresponding token provided during the initial hardware handshake
   */
  sessionToken!: string;

  /**
   * Discovered physical serial number
   */
  serialNumber!: string;

  /**
   * Storage model
   */
  diskModel!: string;

  /**
   * Device vendor (e.g. "Kingston")
   */
  vendor!: string;

  /**
   * Technician identifier who reviewed the run
   */
  technicianId!: string;

  /**
   * Method executed on the physical storage blocks
   */
  methodApplied!: EraseMethod;

  /**
   * Overall state
   */
  status!: "SUCCESS" | "FAILED";

  /**
   * Timestamp for when block-writing operation started
   */
  startedAt!: string;

  /**
   * Timestamp for when post-sanitization read validation phase ended
   */
  completedAt!: string;

  /**
   * Operational duration in seconds
   */
  durationSeconds!: number;

  /**
   * Local command exit/return code (0 expected for success)
   */
  exitCode!: number;

  /**
   * Embedded JSON verification metrics (SMART, unallocated block confirmation)
   */
  hardwareVerification!: HardwareVerificationPayload;

  /**
   * Signature of the entire parameter string using private RSA/SHA256 key pairing
   */
  digitalSignature!: string;
}

/**
 * Return response indicating audit ledger status and PDF validation
 */
export class CertifyResponseDto {
  /**
   * Registered record UUID in the SanitizationLog history table
   */
  logId!: string;

  /**
   * Immutable signature matching audit logs
   */
  auditSignatureHash!: string;

  /**
   * NIST 800-88 Certificate number
   */
  certificateId!: string;

  /**
   * Status
   */
  success!: boolean;

  /**
   * PDF target generation outcome response message
   */
  pdfConformityMessage!: string;
}
