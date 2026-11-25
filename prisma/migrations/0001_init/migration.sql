-- Required PostgreSQL extensions for multilingual search fallback
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "LanguageCode" AS ENUM ('AR', 'HI', 'UR', 'EN', 'UR_RO');

-- CreateEnum
CREATE TYPE "TextDirection" AS ENUM ('RTL', 'LTR');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('AYAH', 'HADITH', 'DUA', 'TEACHING', 'ARTICLE', 'CONCEPT', 'MYTH_FACT', 'PROPHET_STORY');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'TRANSLATED', 'REFERENCED', 'REVIEWED', 'APPROVED', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "TextVariantType" AS ENUM ('SOURCE', 'TRANSLATION', 'TRANSLITERATION');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ReferenceType" AS ENUM ('QURAN', 'HADITH', 'DUA', 'TOPIC', 'OTHER');

-- CreateEnum
CREATE TYPE "ExplanationType" AS ENUM ('SCHOLARLY', 'EDITORIAL');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATED', 'MODIFIED', 'TRANSLATED', 'REFERENCED', 'REVIEWED', 'APPROVED', 'PUBLISHED', 'ARCHIVED', 'CORRECTION');

-- CreateEnum
CREATE TYPE "CorrectionStatus" AS ENUM ('OPEN', 'ASSIGNED', 'IN_REVIEW', 'RESOLVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "CorrectionCategory" AS ENUM ('REFERENCE', 'TRANSLATION', 'TEXT_ERROR', 'GRADING', 'LICENSING', 'OTHER');

-- CreateEnum
CREATE TYPE "DonationStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT,
    "emailVerifiedAt" TIMESTAMPTZ(6),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isSuspended" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "assignedById" UUID,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMPTZ(6),
    "revokedAt" TIMESTAMPTZ(6),

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "permissionId" UUID NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "languages" (
    "id" UUID NOT NULL,
    "code" "LanguageCode" NOT NULL,
    "name" TEXT NOT NULL,
    "nativeName" TEXT NOT NULL,
    "direction" "TextDirection" NOT NULL,
    "isInterface" BOOLEAN NOT NULL DEFAULT false,
    "isContent" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "licenses" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "holder" TEXT NOT NULL,
    "licenseType" TEXT NOT NULL,
    "attributionRequired" BOOLEAN NOT NULL DEFAULT false,
    "attributionText" TEXT,
    "usagePermissions" TEXT,
    "documentationUrl" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "licenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sources" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "authorOrInstitution" TEXT,
    "publisher" TEXT,
    "edition" TEXT,
    "licenseId" UUID,
    "sourceUrl" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_items" (
    "id" UUID NOT NULL,
    "type" "ContentType" NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "isDemo" BOOLEAN NOT NULL DEFAULT false,
    "canonicalTextImmutable" BOOLEAN NOT NULL DEFAULT false,
    "createdById" UUID,
    "publishedAt" TIMESTAMPTZ(6),
    "archivedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "content_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "text_variants" (
    "id" UUID NOT NULL,
    "contentItemId" UUID NOT NULL,
    "languageId" UUID NOT NULL,
    "sourceId" UUID,
    "licenseId" UUID,
    "variantType" "TextVariantType" NOT NULL,
    "edition" TEXT,
    "text" TEXT NOT NULL,
    "isCanonical" BOOLEAN NOT NULL DEFAULT false,
    "translatorId" UUID,
    "createdById" UUID,
    "reviewStatus" "ReviewStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "text_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translations" (
    "id" UUID NOT NULL,
    "textVariantId" UUID NOT NULL,
    "languageId" UUID NOT NULL,
    "translatorId" UUID,
    "reviewerId" UUID,
    "methodology" TEXT,
    "notes" TEXT,
    "reviewedAt" TIMESTAMPTZ(6),

    CONSTRAINT "translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transliterations" (
    "id" UUID NOT NULL,
    "textVariantId" UUID NOT NULL,
    "languageId" UUID NOT NULL,
    "scheme" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "transliterations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "references" (
    "id" UUID NOT NULL,
    "contentItemId" UUID NOT NULL,
    "sourceId" UUID NOT NULL,
    "referenceType" "ReferenceType" NOT NULL,
    "book" TEXT,
    "chapter" TEXT,
    "verseStart" INTEGER,
    "verseEnd" INTEGER,
    "hadithNumberStart" INTEGER,
    "hadithNumberEnd" INTEGER,
    "volume" TEXT,
    "page" TEXT,
    "sourceSnapshot" TEXT,
    "notes" TEXT,
    "url" TEXT,

    CONSTRAINT "references_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reference_text_variants" (
    "id" UUID NOT NULL,
    "referenceId" UUID NOT NULL,
    "textVariantId" UUID NOT NULL,

    CONSTRAINT "reference_text_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hadith_gradings" (
    "id" UUID NOT NULL,
    "referenceId" UUID NOT NULL,
    "grade" TEXT NOT NULL,
    "grader" TEXT NOT NULL,
    "gradingSource" TEXT NOT NULL,
    "edition" TEXT NOT NULL,
    "notes" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "hadith_gradings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "explanations" (
    "id" UUID NOT NULL,
    "contentItemId" UUID NOT NULL,
    "languageId" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "type" "ExplanationType" NOT NULL DEFAULT 'EDITORIAL',
    "reviewerId" UUID,
    "reviewStatus" "ReviewStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "explanations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scholarly_opinions" (
    "id" UUID NOT NULL,
    "contentItemId" UUID NOT NULL,
    "sourceId" UUID,
    "scholarName" TEXT NOT NULL,
    "workTitle" TEXT,
    "opinion" TEXT NOT NULL,
    "differsFromConsensus" BOOLEAN NOT NULL DEFAULT false,
    "reviewerId" UUID,
    "reviewStatus" "ReviewStatus" NOT NULL DEFAULT 'DRAFT',
    "referenceUrl" TEXT,

    CONSTRAINT "scholarly_opinions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topics" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" UUID,

    CONSTRAINT "topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_topics" (
    "id" UUID NOT NULL,
    "contentItemId" UUID NOT NULL,
    "topicId" UUID NOT NULL,

    CONSTRAINT "content_topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_tags" (
    "id" UUID NOT NULL,
    "contentItemId" UUID NOT NULL,
    "tagId" UUID NOT NULL,

    CONSTRAINT "content_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_assets" (
    "id" UUID NOT NULL,
    "fileName" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "altText" TEXT,
    "licenseId" UUID,
    "uploadedById" UUID,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_audits" (
    "id" UUID NOT NULL,
    "contentItemId" UUID NOT NULL,
    "action" "AuditAction" NOT NULL,
    "fromStatus" "ContentStatus",
    "toStatus" "ContentStatus",
    "actorId" UUID NOT NULL,
    "actorRoleSnapshot" TEXT NOT NULL,
    "notes" TEXT,
    "evidenceUrl" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_audits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_versions" (
    "id" UUID NOT NULL,
    "contentItemId" UUID NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "status" "ContentStatus" NOT NULL,
    "snapshot" JSONB,
    "textVariantId" UUID,
    "createdById" UUID,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "correction_submissions" (
    "id" UUID NOT NULL,
    "contentItemId" UUID NOT NULL,
    "submitterId" UUID,
    "category" "CorrectionCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "supportingReference" TEXT,
    "evidenceUrl" TEXT,
    "attachmentAssetId" UUID,
    "status" "CorrectionStatus" NOT NULL DEFAULT 'OPEN',
    "assignedReviewerId" UUID,
    "resolutionNotes" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMPTZ(6),

    CONSTRAINT "correction_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookmarks" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "contentItemId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reading_lists" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reading_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reading_list_items" (
    "id" UUID NOT NULL,
    "readingListId" UUID NOT NULL,
    "contentItemId" UUID NOT NULL,
    "addedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reading_list_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reading_progress" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "contentItemId" UUID NOT NULL,
    "progressPercent" INTEGER NOT NULL DEFAULT 0,
    "lastPosition" TEXT,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "reading_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "languageId" UUID NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "theme" TEXT NOT NULL DEFAULT 'system',

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite_duas" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "contentItemId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorite_duas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donations" (
    "id" UUID NOT NULL,
    "donorUserId" UUID,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "status" "DonationStatus" NOT NULL DEFAULT 'PENDING',
    "provider" TEXT NOT NULL,
    "providerReference" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donation_events" (
    "id" UUID NOT NULL,
    "donationId" UUID NOT NULL,
    "eventType" TEXT NOT NULL,
    "providerEventId" TEXT NOT NULL,
    "payload" JSONB,
    "signatureVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "donation_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_audits" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "ipHash" TEXT,
    "userAgentHash" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_audits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_audit_logs" (
    "id" UUID NOT NULL,
    "actorId" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_documents" (
    "id" UUID NOT NULL,
    "contentItemId" UUID NOT NULL,
    "languageId" UUID NOT NULL,
    "normalizedTitle" TEXT NOT NULL,
    "normalizedBody" TEXT NOT NULL,
    "aliases" TEXT,
    "searchVector" tsvector,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "search_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rate_limit_counters" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "windowStart" TIMESTAMPTZ(6) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "rate_limit_counters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_isActive_isSuspended_idx" ON "users"("isActive", "isSuspended");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_key_key" ON "permissions"("key");

-- CreateIndex
CREATE INDEX "user_roles_roleId_idx" ON "user_roles"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_userId_roleId_key" ON "user_roles"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_roleId_permissionId_key" ON "role_permissions"("roleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "languages_code_key" ON "languages"("code");

-- CreateIndex
CREATE INDEX "licenses_verified_idx" ON "licenses"("verified");

-- CreateIndex
CREATE UNIQUE INDEX "licenses_name_holder_key" ON "licenses"("name", "holder");

-- CreateIndex
CREATE INDEX "sources_verificationStatus_idx" ON "sources"("verificationStatus");

-- CreateIndex
CREATE UNIQUE INDEX "sources_name_edition_key" ON "sources"("name", "edition");

-- CreateIndex
CREATE UNIQUE INDEX "content_items_slug_key" ON "content_items"("slug");

-- CreateIndex
CREATE INDEX "content_items_type_status_idx" ON "content_items"("type", "status");

-- CreateIndex
CREATE INDEX "content_items_isDemo_status_idx" ON "content_items"("isDemo", "status");

-- CreateIndex
CREATE INDEX "content_items_publishedAt_idx" ON "content_items"("publishedAt");

-- CreateIndex
CREATE INDEX "text_variants_contentItemId_languageId_variantType_idx" ON "text_variants"("contentItemId", "languageId", "variantType");

-- CreateIndex
CREATE INDEX "text_variants_reviewStatus_idx" ON "text_variants"("reviewStatus");

-- CreateIndex
CREATE UNIQUE INDEX "text_variants_contentItemId_languageId_sourceId_edition_var_key" ON "text_variants"("contentItemId", "languageId", "sourceId", "edition", "variantType");

-- CreateIndex
CREATE UNIQUE INDEX "translations_textVariantId_key" ON "translations"("textVariantId");

-- CreateIndex
CREATE INDEX "translations_languageId_idx" ON "translations"("languageId");

-- CreateIndex
CREATE UNIQUE INDEX "transliterations_textVariantId_scheme_key" ON "transliterations"("textVariantId", "scheme");

-- CreateIndex
CREATE INDEX "references_contentItemId_referenceType_idx" ON "references"("contentItemId", "referenceType");

-- CreateIndex
CREATE INDEX "references_sourceId_idx" ON "references"("sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "reference_text_variants_referenceId_textVariantId_key" ON "reference_text_variants"("referenceId", "textVariantId");

-- CreateIndex
CREATE INDEX "hadith_gradings_referenceId_verified_idx" ON "hadith_gradings"("referenceId", "verified");

-- CreateIndex
CREATE INDEX "explanations_contentItemId_languageId_idx" ON "explanations"("contentItemId", "languageId");

-- CreateIndex
CREATE INDEX "scholarly_opinions_contentItemId_reviewStatus_idx" ON "scholarly_opinions"("contentItemId", "reviewStatus");

-- CreateIndex
CREATE UNIQUE INDEX "topics_slug_key" ON "topics"("slug");

-- CreateIndex
CREATE INDEX "topics_parentId_idx" ON "topics"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "content_topics_contentItemId_topicId_key" ON "content_topics"("contentItemId", "topicId");

-- CreateIndex
CREATE UNIQUE INDEX "content_tags_contentItemId_tagId_key" ON "content_tags"("contentItemId", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "media_assets_storagePath_key" ON "media_assets"("storagePath");

-- CreateIndex
CREATE INDEX "media_assets_mimeType_idx" ON "media_assets"("mimeType");

-- CreateIndex
CREATE INDEX "review_audits_contentItemId_createdAt_idx" ON "review_audits"("contentItemId", "createdAt");

-- CreateIndex
CREATE INDEX "content_versions_contentItemId_isCurrent_idx" ON "content_versions"("contentItemId", "isCurrent");

-- CreateIndex
CREATE UNIQUE INDEX "content_versions_contentItemId_versionNumber_key" ON "content_versions"("contentItemId", "versionNumber");

-- CreateIndex
CREATE INDEX "correction_submissions_status_createdAt_idx" ON "correction_submissions"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "bookmarks_userId_contentItemId_key" ON "bookmarks"("userId", "contentItemId");

-- CreateIndex
CREATE UNIQUE INDEX "reading_lists_userId_name_key" ON "reading_lists"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "reading_list_items_readingListId_contentItemId_key" ON "reading_list_items"("readingListId", "contentItemId");

-- CreateIndex
CREATE UNIQUE INDEX "reading_progress_userId_contentItemId_key" ON "reading_progress"("userId", "contentItemId");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_userId_languageId_key" ON "user_preferences"("userId", "languageId");

-- CreateIndex
CREATE UNIQUE INDEX "favorite_duas_userId_contentItemId_key" ON "favorite_duas"("userId", "contentItemId");

-- CreateIndex
CREATE UNIQUE INDEX "donations_providerReference_key" ON "donations"("providerReference");

-- CreateIndex
CREATE INDEX "donations_status_createdAt_idx" ON "donations"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "donation_events_providerEventId_key" ON "donation_events"("providerEventId");

-- CreateIndex
CREATE INDEX "donation_events_donationId_createdAt_idx" ON "donation_events"("donationId", "createdAt");

-- CreateIndex
CREATE INDEX "session_audits_userId_createdAt_idx" ON "session_audits"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "admin_audit_logs_actorId_createdAt_idx" ON "admin_audit_logs"("actorId", "createdAt");

-- CreateIndex
CREATE INDEX "search_documents_languageId_idx" ON "search_documents"("languageId");

-- CreateIndex
CREATE INDEX "search_documents_searchVector_idx" ON "search_documents" USING GIN ("searchVector");

-- Trigram fallback indexes for transliteration and spelling variants
CREATE INDEX "search_documents_title_trgm_idx" ON "search_documents" USING GIN ("normalizedTitle" gin_trgm_ops);
CREATE INDEX "search_documents_body_trgm_idx" ON "search_documents" USING GIN ("normalizedBody" gin_trgm_ops);

-- CreateIndex
CREATE UNIQUE INDEX "search_documents_contentItemId_languageId_key" ON "search_documents"("contentItemId", "languageId");

-- CreateIndex
CREATE UNIQUE INDEX "rate_limit_counters_key_key" ON "rate_limit_counters"("key");

-- CreateIndex
CREATE INDEX "rate_limit_counters_windowStart_idx" ON "rate_limit_counters"("windowStart");

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sources" ADD CONSTRAINT "sources_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "licenses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_items" ADD CONSTRAINT "content_items_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "text_variants" ADD CONSTRAINT "text_variants_contentItemId_fkey" FOREIGN KEY ("contentItemId") REFERENCES "content_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "text_variants" ADD CONSTRAINT "text_variants_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "text_variants" ADD CONSTRAINT "text_variants_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "text_variants" ADD CONSTRAINT "text_variants_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "licenses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "text_variants" ADD CONSTRAINT "text_variants_translatorId_fkey" FOREIGN KEY ("translatorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "text_variants" ADD CONSTRAINT "text_variants_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "translations" ADD CONSTRAINT "translations_textVariantId_fkey" FOREIGN KEY ("textVariantId") REFERENCES "text_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "translations" ADD CONSTRAINT "translations_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "translations" ADD CONSTRAINT "translations_translatorId_fkey" FOREIGN KEY ("translatorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "translations" ADD CONSTRAINT "translations_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transliterations" ADD CONSTRAINT "transliterations_textVariantId_fkey" FOREIGN KEY ("textVariantId") REFERENCES "text_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transliterations" ADD CONSTRAINT "transliterations_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "references" ADD CONSTRAINT "references_contentItemId_fkey" FOREIGN KEY ("contentItemId") REFERENCES "content_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "references" ADD CONSTRAINT "references_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reference_text_variants" ADD CONSTRAINT "reference_text_variants_referenceId_fkey" FOREIGN KEY ("referenceId") REFERENCES "references"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reference_text_variants" ADD CONSTRAINT "reference_text_variants_textVariantId_fkey" FOREIGN KEY ("textVariantId") REFERENCES "text_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hadith_gradings" ADD CONSTRAINT "hadith_gradings_referenceId_fkey" FOREIGN KEY ("referenceId") REFERENCES "references"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "explanations" ADD CONSTRAINT "explanations_contentItemId_fkey" FOREIGN KEY ("contentItemId") REFERENCES "content_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "explanations" ADD CONSTRAINT "explanations_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "explanations" ADD CONSTRAINT "explanations_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scholarly_opinions" ADD CONSTRAINT "scholarly_opinions_contentItemId_fkey" FOREIGN KEY ("contentItemId") REFERENCES "content_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scholarly_opinions" ADD CONSTRAINT "scholarly_opinions_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "sources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scholarly_opinions" ADD CONSTRAINT "scholarly_opinions_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_topics" ADD CONSTRAINT "content_topics_contentItemId_fkey" FOREIGN KEY ("contentItemId") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_topics" ADD CONSTRAINT "content_topics_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_tags" ADD CONSTRAINT "content_tags_contentItemId_fkey" FOREIGN KEY ("contentItemId") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_tags" ADD CONSTRAINT "content_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "licenses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_audits" ADD CONSTRAINT "review_audits_contentItemId_fkey" FOREIGN KEY ("contentItemId") REFERENCES "content_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_audits" ADD CONSTRAINT "review_audits_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_contentItemId_fkey" FOREIGN KEY ("contentItemId") REFERENCES "content_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_textVariantId_fkey" FOREIGN KEY ("textVariantId") REFERENCES "text_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "correction_submissions" ADD CONSTRAINT "correction_submissions_contentItemId_fkey" FOREIGN KEY ("contentItemId") REFERENCES "content_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "correction_submissions" ADD CONSTRAINT "correction_submissions_submitterId_fkey" FOREIGN KEY ("submitterId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "correction_submissions" ADD CONSTRAINT "correction_submissions_assignedReviewerId_fkey" FOREIGN KEY ("assignedReviewerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "correction_submissions" ADD CONSTRAINT "correction_submissions_attachmentAssetId_fkey" FOREIGN KEY ("attachmentAssetId") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_contentItemId_fkey" FOREIGN KEY ("contentItemId") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_lists" ADD CONSTRAINT "reading_lists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_list_items" ADD CONSTRAINT "reading_list_items_readingListId_fkey" FOREIGN KEY ("readingListId") REFERENCES "reading_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_list_items" ADD CONSTRAINT "reading_list_items_contentItemId_fkey" FOREIGN KEY ("contentItemId") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_progress" ADD CONSTRAINT "reading_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_progress" ADD CONSTRAINT "reading_progress_contentItemId_fkey" FOREIGN KEY ("contentItemId") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_duas" ADD CONSTRAINT "favorite_duas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_duas" ADD CONSTRAINT "favorite_duas_contentItemId_fkey" FOREIGN KEY ("contentItemId") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_donorUserId_fkey" FOREIGN KEY ("donorUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donation_events" ADD CONSTRAINT "donation_events_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "donations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_audits" ADD CONSTRAINT "session_audits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_audit_logs" ADD CONSTRAINT "admin_audit_logs_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "search_documents" ADD CONSTRAINT "search_documents_contentItemId_fkey" FOREIGN KEY ("contentItemId") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "search_documents" ADD CONSTRAINT "search_documents_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
