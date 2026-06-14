/**
 * Homologated TypeScript enums representing raw storage hardware profiles.
 * Safe to import directly into NestJS service layers & DTO layers.
 * These align with the declarations inside 'schema.prisma'.
 */

export enum StorageType {
  HDD = "HDD",
  SSD_SATA = "SSD_SATA",
  SSD_NVME = "SSD_NVME"
}

export enum EraseMethod {
  SDELETE = "SDELETE",                     // Logical block writing for traditional mechanical drives
  ATA_SECURE_ERASE = "ATA_SECURE_ERASE",   // ATA Controller command instruction set
  NVME_SANITIZE = "NVME_SANITIZE",         // Native block-level semiconductor purge
  CRYPTO_ERASE = "CRYPTO_ERASE"            // Cryptographic key invalidation
}
