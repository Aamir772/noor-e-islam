import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { PERMISSIONS } from "../src/modules/auth/rbac";
import { ROLES } from "../src/modules/auth/roles";
import { contentModules } from "../src/modules/navigation/catalog";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required before running the seed script");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const languages = [
  { code: "AR", name: "Arabic", nativeName: "العربية", direction: "RTL", isInterface: true },
  { code: "HI", name: "Hindi", nativeName: "हिन्दी", direction: "LTR", isInterface: true },
  { code: "UR", name: "Urdu", nativeName: "اردو", direction: "RTL", isInterface: true },
  { code: "EN", name: "English", nativeName: "English", direction: "LTR", isInterface: true },
  { code: "UR_RO", name: "Roman Urdu", nativeName: "Roman Urdu", direction: "LTR", isInterface: false, isContent: false },
] as const;

const roleNames = Object.values(ROLES);
const permissionKeys = Object.values(PERMISSIONS);

const rolePermissionKeys: Record<string, readonly string[]> = {
  [ROLES.GUEST]: [PERMISSIONS.CONTENT_READ, PERMISSIONS.SEARCH_READ, PERMISSIONS.CORRECTION_SUBMIT],
  [ROLES.REGISTERED_USER]: [
    PERMISSIONS.CONTENT_READ,
    PERMISSIONS.SEARCH_READ,
    PERMISSIONS.CORRECTION_SUBMIT,
    PERMISSIONS.BOOKMARK_MANAGE,
    PERMISSIONS.READING_LIST_MANAGE,
    PERMISSIONS.READING_PROGRESS_MANAGE,
    PERMISSIONS.FAVORITE_DUA_MANAGE,
    PERMISSIONS.PREFERENCE_MANAGE,
  ],
  [ROLES.TRANSLATOR]: [
    PERMISSIONS.CONTENT_READ,
    PERMISSIONS.SEARCH_READ,
    PERMISSIONS.TRANSLATION_CREATE,
    PERMISSIONS.TRANSLATION_UPDATE,
  ],
  [ROLES.CONTENT_EDITOR]: [
    PERMISSIONS.CONTENT_READ,
    PERMISSIONS.SEARCH_READ,
    PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.CONTENT_UPDATE,
    PERMISSIONS.TRANSLATION_CREATE,
    PERMISSIONS.MEDIA_MANAGE,
  ],
  [ROLES.RESEARCH_REVIEWER]: [
    PERMISSIONS.CONTENT_READ,
    PERMISSIONS.SEARCH_READ,
    PERMISSIONS.RELIGIOUS_REVIEW,
    PERMISSIONS.CONTENT_APPROVE,
    PERMISSIONS.CORRECTION_REVIEW,
  ],
  [ROLES.ADMINISTRATOR]: [
    PERMISSIONS.CONTENT_READ,
    PERMISSIONS.SEARCH_READ,
    PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.CONTENT_UPDATE,
    PERMISSIONS.CONTENT_PUBLISH,
    PERMISSIONS.MEDIA_MANAGE,
    PERMISSIONS.USER_MANAGE,
    PERMISSIONS.DONATION_VIEW,
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.CORRECTION_REVIEW,
    PERMISSIONS.SETTINGS_MANAGE,
  ],
  [ROLES.SUPER_ADMINISTRATOR]: permissionKeys,
};

async function main(): Promise<void> {
  for (const language of languages) {
    await prisma.language.upsert({
      where: { code: language.code },
      update: {
        name: language.name,
        nativeName: language.nativeName,
        direction: language.direction,
        isInterface: language.isInterface,
        isContent: "isContent" in language ? language.isContent : true,
      },
      create: {
        code: language.code,
        name: language.name,
        nativeName: language.nativeName,
        direction: language.direction,
        isInterface: language.isInterface,
        isContent: "isContent" in language ? language.isContent : true,
      },
    });
  }

  for (const name of roleNames) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name, description: `${name} role` },
    });
  }

  for (const key of permissionKeys) {
    await prisma.permission.upsert({
      where: { key },
      update: {},
      create: { key, description: `${key} permission` },
    });
  }

  const roles = await prisma.role.findMany({ where: { name: { in: [...roleNames] } } });
  const permissions = await prisma.permission.findMany({ where: { key: { in: [...permissionKeys] } } });
  const roleIdByName = new Map(roles.map((role) => [role.name, role.id]));
  const permissionIdByKey = new Map(permissions.map((permission) => [permission.key, permission.id]));

  const links = Object.entries(rolePermissionKeys).flatMap(([roleName, keys]) =>
    keys.flatMap((key) => {
      const roleId = roleIdByName.get(roleName);
      const permissionId = permissionIdByKey.get(key);
      return roleId && permissionId ? [{ roleId, permissionId }] : [];
    }),
  );

  await prisma.rolePermission.createMany({ data: links, skipDuplicates: true });

  const demoLicense = await prisma.license.upsert({
    where: { name_holder: { name: "Demonstration Only", holder: "Noor-e-Islam" } },
    update: {},
    create: {
      name: "Demonstration Only",
      holder: "Noor-e-Islam",
      licenseType: "DEMONSTRATION",
      attributionRequired: false,
      verified: false,
      usagePermissions: "No religious text is licensed by this record.",
    },
  });

  const demoSource = await prisma.source.upsert({
    where: { name_edition: { name: "Demonstration Placeholder", edition: "none" } },
    update: {},
    create: {
      name: "Demonstration Placeholder",
      edition: "none",
      licenseId: demoLicense.id,
      verificationStatus: "UNVERIFIED",
      notes: "Placeholder for architecture testing. Not a religious source.",
    },
  });

  const englishLanguage = await prisma.language.findUniqueOrThrow({ where: { code: "EN" } });

  for (const itemModule of contentModules) {
    const item = await prisma.contentItem.upsert({
      where: { slug: `demo-${itemModule.slug}` },
      update: {},
      create: {
        type: itemModule.slug === "quran" ? "AYAH" : itemModule.slug === "hadith" ? "HADITH" : itemModule.slug === "dua" ? "DUA" : itemModule.slug === "myth-vs-fact" ? "MYTH_FACT" : itemModule.slug === "prophets" ? "PROPHET_STORY" : itemModule.slug === "concepts" ? "CONCEPT" : "TEACHING",
        slug: `demo-${itemModule.slug}`,
        status: "DRAFT",
        isDemo: true,
        canonicalTextImmutable: false,
      },
    });

    await prisma.textVariant.upsert({
      where: {
        contentItemId_languageId_sourceId_edition_variantType: {
          contentItemId: item.id,
          languageId: englishLanguage.id,
          sourceId: demoSource.id,
          edition: "none",
          variantType: "TRANSLATION",
        },
      },
      update: {},
      create: {
        contentItemId: item.id,
        languageId: englishLanguage.id,
        sourceId: demoSource.id,
        licenseId: demoLicense.id,
        variantType: "TRANSLATION",
        edition: "none",
        text: "Demonstration record only. No Quranic, Hadith, or other religious text has been loaded.",
        reviewStatus: "DRAFT",
        translation: {
          create: {
            languageId: englishLanguage.id,
            methodology: "Demonstration notice only; no translation performed.",
          },
        },
      },
    });
  }
}

main()
  .then(() => {
    process.stdout.write("Seed completed with demonstration-only records.\n");
  })
  .catch((error: unknown) => {
    process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
