import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { en } from "@/data/en";
import { fr } from "@/data/locales/fr";
import { it } from "@/data/locales/it";
import { es } from "@/data/locales/es";
import { de } from "@/data/locales/de";
import { ru } from "@/data/locales/ru";
import { gd } from "@/data/locales/gd";
import { cy } from "@/data/locales/cy";
import { ga } from "@/data/locales/ga";

export const LANGS = [
  ["en", "English"],
  ["en-US", "American English"],
  ["gd", "Gàidhlig"],
  ["cy", "Cymraeg"],
  ["ga", "Gaeilge"],
  ["fr", "Français"],
  ["it", "Italiano"],
  ["es", "Español"],
  ["de", "Deutsch"],
  ["ru", "Русский"],
] as const;

export type Lang = (typeof LANGS)[number][0];

const STORAGE_KEY = "every-greek-ever-lang";

const tables: Record<Lang, Record<string, string>> = {
  en,
  "en-US": en,
  gd,
  cy,
  ga,
  fr,
  it,
  es,
  de,
  ru,
};

const SPELL: [RegExp, string][] = [
  [/\bcentimetres\b/gi, "centimeters"],
  [/\bcentimetre\b/gi, "centimeter"],
  [/\bcentres\b/gi, "centers"],
  [/\bcentre\b/gi, "center"],
  [/\bmetres\b/gi, "meters"],
  [/\bmetre\b/gi, "meter"],
  [/\bfavourites\b/gi, "favorites"],
  [/\bfavourite\b/gi, "favorite"],
  [/\bhonoured\b/gi, "honored"],
  [/\bhonours\b/gi, "honors"],
  [/\bhonour\b/gi, "honor"],
  [/\bcolours\b/gi, "colors"],
  [/\bcoloured\b/gi, "colored"],
  [/\bcolour\b/gi, "color"],
  [/\bneighbours\b/gi, "neighbors"],
  [/\bneighbour\b/gi, "neighbor"],
  [/\bharbours\b/gi, "harbors"],
  [/\bharbour\b/gi, "harbor"],
  [/\btravellers\b/gi, "travelers"],
  [/\btraveller\b/gi, "traveler"],
  [/\btravelling\b/gi, "traveling"],
  [/\btravelled\b/gi, "traveled"],
  [/\bgrey\b/gi, "gray"],
  [/\btheatres\b/gi, "theaters"],
  [/\btheatre\b/gi, "theater"],
  [/\blabelled\b/gi, "labeled"],
  [/\bmaths\b/gi, "math"],
  [/\bpractising\b/gi, "practicing"],
  [/\bpractised\b/gi, "practiced"],
  [/\bpractise\b/gi, "practice"],
];

function keepCase(from: string, to: string) {
  if (from === from.toUpperCase()) return to.toUpperCase();
  if (from[0] === from[0]?.toUpperCase()) return to[0]!.toUpperCase() + to.slice(1);
  return to;
}

export function americanize(input: string) {
  let out = input;
  for (const [re, to] of SPELL) {
    out = out.replace(re, (match) => keepCase(match, to));
  }
  return out;
}

function fill(input: string, vars?: Record<string, string>) {
  if (!vars) return input;
  return input.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? `{${key}}`);
}

export function translate(lang: Lang, key: string, vars?: Record<string, string>) {
  const table = tables[lang] ?? en;
  const raw = (lang !== "en" && lang !== "en-US" && table[key]) || en[key] || key;
  const spelled = lang === "en-US" ? americanize(raw) : raw;
  return fill(spelled, vars);
}

type Ctx = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, vars?: Record<string, string>) => string;
};

const I18nContext = createContext<Ctx | null>(null);

function isLang(value: string | null): value is Lang {
  return LANGS.some(([id]) => id === value);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLang(saved)) setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "en-US" ? "en" : lang;
  }, [lang]);

  const value = useMemo<Ctx>(() => {
    const setLang = (next: Lang) => {
      setLangState(next);
      localStorage.setItem(STORAGE_KEY, next);
    };
    const t = (key: string, vars?: Record<string, string>) => translate(lang, key, vars);
    return { lang, setLang, t };
  }, [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("Language is not ready");
  return ctx;
}
