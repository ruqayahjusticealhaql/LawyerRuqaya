import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "cms.json");

export type CmsSettings = {
  siteName: string; slogan: string; logoUrl: string;
  primaryColor: string; secondaryColor: string;
  phone: string; whatsapp: string; email: string; address: string;
  instagramUrl: string; twitterUrl: string; linkedinUrl: string;
  // About page
  aboutText: string; aboutImage: string;
  vision: string; mission: string;
  journeyText: string;
  qualifications: string; // JSON array of strings
  experiences: string;    // JSON array of {year, title, place}
  aboutValues: string;    // JSON array of {title, desc}
  // Contact page
  workHours: string;      // JSON array of {day, hours}
  mapLat: string; mapLng: string;
  // Footer
  footerAboutText: string;
  companyReg: string;
  // Team
  teamMembers: string; // JSON array of {name, title, specialization, photoUrl}
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
  id: string; title: string; excerpt: string; content: string;
  published: boolean; createdAt: string;
};

export type CmsData = {
  settings: CmsSettings;
  services: CmsService[];
  sections: CmsSection[];
  announcements: CmsAnnouncement[];
  blog: CmsBlogPost[];
};

function read(): CmsData {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  } catch {
    return {
      settings: {
        siteName: "شركة رقية عبدالرحمن", slogan: "", logoUrl: "/images/logo.png",
        primaryColor: "#C5A059", secondaryColor: "#0B1325",
        phone: "", whatsapp: "", email: "", address: "", instagramUrl: "", twitterUrl: "", linkedinUrl: "",
        aboutText: "", aboutImage: "",
      },
      services: [], sections: [], announcements: [], blog: [],
    };
  }
}

function write(data: CmsData) {
  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export function getCmsData(): CmsData { return read(); }
export function getSettings(): CmsSettings { return read().settings; }

export function saveSettings(s: Partial<CmsSettings>) {
  const data = read();
  data.settings = { ...data.settings, ...s };
  write(data);
  return data.settings;
}

export function getServices() { return read().services; }
export function saveService(s: Omit<CmsService, "id">) {
  const data = read();
  const item = { ...s, id: crypto.randomUUID() };
  data.services.push(item);
  write(data);
  return item;
}
export function updateService(id: string, s: Partial<CmsService>) {
  const data = read();
  data.services = data.services.map(x => x.id === id ? { ...x, ...s } : x);
  write(data);
}
export function deleteService(id: string) {
  const data = read();
  data.services = data.services.filter(x => x.id !== id);
  write(data);
}

export function getSections() { return read().sections; }
export function saveSection(s: Omit<CmsSection, "id">) {
  const data = read();
  const item = { ...s, id: crypto.randomUUID() };
  data.sections.push(item);
  write(data);
  return item;
}
export function updateSection(id: string, s: Partial<CmsSection>) {
  const data = read();
  data.sections = data.sections.map(x => x.id === id ? { ...x, ...s } : x);
  write(data);
}
export function deleteSection(id: string) {
  const data = read();
  data.sections = data.sections.filter(x => x.id !== id);
  write(data);
}

export function getAnnouncements() { return read().announcements; }
export function saveAnnouncement(a: Omit<CmsAnnouncement, "id" | "createdAt">) {
  const data = read();
  const item = { ...a, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  data.announcements.push(item);
  write(data);
  return item;
}
export function updateAnnouncement(id: string, a: Partial<CmsAnnouncement>) {
  const data = read();
  data.announcements = data.announcements.map(x => x.id === id ? { ...x, ...a } : x);
  write(data);
}
export function deleteAnnouncement(id: string) {
  const data = read();
  data.announcements = data.announcements.filter(x => x.id !== id);
  write(data);
}

export function getBlogPosts() { return read().blog; }
export function saveBlogPost(p: Omit<CmsBlogPost, "id" | "createdAt">) {
  const data = read();
  const item = { ...p, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  data.blog.push(item);
  write(data);
  return item;
}
export function updateBlogPost(id: string, p: Partial<CmsBlogPost>) {
  const data = read();
  data.blog = data.blog.map(x => x.id === id ? { ...x, ...p } : x);
  write(data);
}
export function deleteBlogPost(id: string) {
  const data = read();
  data.blog = data.blog.filter(x => x.id !== id);
  write(data);
}
