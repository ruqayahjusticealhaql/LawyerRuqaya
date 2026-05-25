"use server";

import { prisma } from "@/lib/prisma";
import { getSession, hasRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Type definitions for default configurations
export type ThemeConfig = {
  primaryGold: string;
  primaryNavy: string;
  surfaceBase: string;
};

export type HomeConfig = {
  heroTitle: string;
  heroSubtitle: string;
  heroFeatures: string[];
  aboutTitle: string;
  aboutText: string;
  aboutStats: { label: string; value: string }[];
  servicesTitle: string;
  servicesSubtitle: string;
  contactTitle: string;
  contactSubtitle: string;
};

// Default Configurations
const DEFAULT_THEME: ThemeConfig = {
  primaryGold: "#C5A059",
  primaryNavy: "#0B1325",
  surfaceBase: "#FAF8F5",
};

const DEFAULT_HOME: HomeConfig = {
  heroTitle: "مكتب المحامية رقية عبدالرحمن",
  heroSubtitle: "التميز في تقديم الاستشارات والحلول القانونية",
  heroFeatures: ["استشارات دقيقة", "تمثيل قانوني", "حماية مصالحك"],
  aboutTitle: "لماذا تختار مكتبنا؟",
  aboutText: "نحن نقدم أفضل الخدمات القانونية لعملائنا عبر فريق متخصص يمتلك خبرات متراكمة في شتى مجالات القانون.",
  aboutStats: [
    { label: "سنوات الخبرة", value: "15+" },
    { label: "قضية ناجحة", value: "500+" },
    { label: "عميل سعيد", value: "1000+" },
  ],
  servicesTitle: "أبرز خدماتنا القانونية",
  servicesSubtitle: "مجموعة شاملة من الخدمات لتلبية كافة احتياجاتك",
  contactTitle: "تواصل معنا",
  contactSubtitle: "فريقنا جاهز للرد على كافة استفساراتك القانونية",
};

// --- GETTERS ---

export async function getThemeConfig(): Promise<ThemeConfig> {
  const record = await prisma.cmsConfig.findUnique({ where: { key: "theme" } });
  if (record && record.value) {
    try {
      return { ...DEFAULT_THEME, ...JSON.parse(record.value) };
    } catch {
      return DEFAULT_THEME;
    }
  }
  return DEFAULT_THEME;
}

export async function getHomeConfig(): Promise<HomeConfig> {
  const record = await prisma.cmsConfig.findUnique({ where: { key: "home" } });
  if (record && record.value) {
    try {
      return { ...DEFAULT_HOME, ...JSON.parse(record.value) };
    } catch {
      return DEFAULT_HOME;
    }
  }
  return DEFAULT_HOME;
}

// --- SETTERS ---

export async function saveThemeConfig(data: ThemeConfig) {
  const session = await getSession();
  if (!hasRole(session, "MANAGER", "CONTENT_MANAGER")) throw new Error("Unauthorized");

  await prisma.cmsConfig.upsert({
    where: { key: "theme" },
    update: { value: JSON.stringify(data) },
    create: { key: "theme", value: JSON.stringify(data) },
  });

  revalidatePath("/");
  revalidatePath("/dashboard/cms/theme");
  return { success: true };
}

export async function saveHomeConfig(data: HomeConfig) {
  const session = await getSession();
  if (!hasRole(session, "MANAGER", "CONTENT_MANAGER")) throw new Error("Unauthorized");

  await prisma.cmsConfig.upsert({
    where: { key: "home" },
    update: { value: JSON.stringify(data) },
    create: { key: "home", value: JSON.stringify(data) },
  });

  revalidatePath("/");
  revalidatePath("/dashboard/cms/home");
  return { success: true };
}
