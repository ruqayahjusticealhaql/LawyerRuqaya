import { prisma } from "@/lib/prisma";

export type CmsSettings = {
  siteName: string; slogan: string; logoUrl: string;
  primaryColor: string; secondaryColor: string;
  phone: string; whatsapp: string; email: string; address: string;
  instagramUrl: string; twitterUrl: string; linkedinUrl: string;
  aboutText: string; aboutImage: string;
  vision: string; mission: string;
  journeyText: string;
  qualifications: string;
  experiences: string;
  aboutValues: string;
  workHours: string;
  mapLat: string; mapLng: string;
  googleMapReviewsUrl?: string;
  footerAboutText: string;
  companyReg: string;
  teamMembers: string;
};

export type CmsService = {
  id: string; title: string; description: string; icon: string;
  imageUrl: string; bullets: string; order: number; active: boolean;
};

export type CmsSection = {
  id: string; type: string; page: string; title: string;
  content: Record<string, unknown>; order: number; active: boolean;
};

export type CmsAnnouncement = {
  id: string; title: string; content: string; active: boolean; createdAt: string;
};

export type CmsBlogPost = {
  id: string; title: string; slug?: string; excerpt: string; content: string;
  published: boolean; createdAt: string; category?: string; imageUrl?: string;
};

export type CmsData = {
  settings: CmsSettings;
  services: CmsService[];
  sections: CmsSection[];
  announcements: CmsAnnouncement[];
  blog: CmsBlogPost[];
};

const DEFAULT_SETTINGS: CmsSettings = {
  siteName: "مكتب المحامية رقية عبدالرحمن", slogan: "", logoUrl: "/images/logo.png",
  primaryColor: "#C5A059", secondaryColor: "#0B1325",
  phone: "", whatsapp: "", email: "", address: "",
  instagramUrl: "", twitterUrl: "", linkedinUrl: "", googleMapReviewsUrl: "",
  aboutText: "", aboutImage: "", vision: "", mission: "", journeyText: "",
  qualifications: "", experiences: "", aboutValues: "",
  workHours: "", mapLat: "", mapLng: "",
  footerAboutText: "", companyReg: "", teamMembers: "",
};

async function getKey<T>(key: string, defaultVal: T): Promise<T> {
  try {
    const record = await prisma.cmsConfig.findUnique({ where: { key } });
    if (record?.value) return { ...defaultVal as object, ...JSON.parse(record.value) } as T;
  } catch {}
  return defaultVal;
}

async function getArrayKey<T>(key: string): Promise<T[]> {
  try {
    const record = await prisma.cmsConfig.findUnique({ where: { key } });
    if (record?.value) return JSON.parse(record.value) as T[];
  } catch {}
  return [];
}

async function setKey(key: string, value: unknown) {
  await prisma.cmsConfig.upsert({
    where: { key },
    update: { value: JSON.stringify(value) },
    create: { key, value: JSON.stringify(value) },
  });
}

export async function getCmsData(): Promise<CmsData> {
  const [settings, services, sections, announcements, blog] = await Promise.all([
    getKey("settings", DEFAULT_SETTINGS),
    getArrayKey<CmsService>("services"),
    getArrayKey<CmsSection>("sections"),
    getArrayKey<CmsAnnouncement>("announcements"),
    getArrayKey<CmsBlogPost>("blog"),
  ]);
  return { settings, services, sections, announcements, blog };
}

export async function getSettings(): Promise<CmsSettings> {
  return getKey("settings", DEFAULT_SETTINGS);
}

export async function saveSettings(s: Partial<CmsSettings>): Promise<CmsSettings> {
  const current = await getSettings();
  const updated = { ...current, ...s };
  await setKey("settings", updated);
  return updated;
}

export async function getServices(): Promise<CmsService[]> {
  return getArrayKey<CmsService>("services");
}

export async function saveService(s: Omit<CmsService, "id">): Promise<CmsService> {
  const list = await getServices();
  const item = { ...s, id: crypto.randomUUID() };
  list.push(item);
  await setKey("services", list);
  return item;
}

export async function updateService(id: string, s: Partial<CmsService>) {
  const list = await getServices();
  await setKey("services", list.map(x => x.id === id ? { ...x, ...s } : x));
}

export async function deleteService(id: string) {
  const list = await getServices();
  await setKey("services", list.filter(x => x.id !== id));
}

export async function getSections(): Promise<CmsSection[]> {
  return getArrayKey<CmsSection>("sections");
}

export async function saveSection(s: Omit<CmsSection, "id">): Promise<CmsSection> {
  const list = await getSections();
  const item = { ...s, id: crypto.randomUUID() };
  list.push(item);
  await setKey("sections", list);
  return item;
}

export async function updateSection(id: string, s: Partial<CmsSection>) {
  const list = await getSections();
  await setKey("sections", list.map(x => x.id === id ? { ...x, ...s } : x));
}

export async function deleteSection(id: string) {
  const list = await getSections();
  await setKey("sections", list.filter(x => x.id !== id));
}

export async function getAnnouncements(): Promise<CmsAnnouncement[]> {
  return getArrayKey<CmsAnnouncement>("announcements");
}

export async function saveAnnouncement(a: Omit<CmsAnnouncement, "id" | "createdAt">): Promise<CmsAnnouncement> {
  const list = await getAnnouncements();
  const item = { ...a, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  list.push(item);
  await setKey("announcements", list);
  return item;
}

export async function updateAnnouncement(id: string, a: Partial<CmsAnnouncement>) {
  const list = await getAnnouncements();
  await setKey("announcements", list.map(x => x.id === id ? { ...x, ...a } : x));
}

export async function deleteAnnouncement(id: string) {
  const list = await getAnnouncements();
  await setKey("announcements", list.filter(x => x.id !== id));
}

export async function getBlogPosts(): Promise<CmsBlogPost[]> {
  return getArrayKey<CmsBlogPost>("blog");
}

export async function saveBlogPost(p: Omit<CmsBlogPost, "id" | "createdAt">): Promise<CmsBlogPost> {
  const list = await getBlogPosts();
  const item = { ...p, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  list.push(item);
  await setKey("blog", list);
  return item;
}

export async function updateBlogPost(id: string, p: Partial<CmsBlogPost>) {
  const list = await getBlogPosts();
  await setKey("blog", list.map(x => x.id === id ? { ...x, ...p } : x));
}

export async function deleteBlogPost(id: string) {
  const list = await getBlogPosts();
  await setKey("blog", list.filter(x => x.id !== id));
}
