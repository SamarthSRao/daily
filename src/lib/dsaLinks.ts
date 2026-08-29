export type LinkSource = "leetcode" | "codeforces";

export interface ParsedDsaLink {
  source: LinkSource;
  id: string;
  title: string;
  url: string;
  lc?: string;
  cf?: string;
  contestId?: string;
  index?: string;
}

export interface LinkableProblem {
  lc?: string | null;
  url?: string;
  cf?: string;
  source?: string;
}

export interface ProblemLink {
  label: string;
  href: string;
}

export function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function withProtocol(raw: string): string {
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

export function parseDsaLink(raw: string): ParsedDsaLink | null {
  const text = raw.trim().replace(/^<|>$/g, "");
  if (!text) return null;

  try {
    const url = new URL(withProtocol(text));
    const host = url.hostname.replace(/^www\./, "").toLowerCase();

    if (host.includes("leetcode")) {
      const match =
        url.pathname.match(/\/problems\/([a-z0-9-]+)/i) ||
        url.pathname.match(/\/contest\/[^/]+\/problems\/([a-z0-9-]+)/i);
      if (!match) return null;
      const slug = match[1].toLowerCase();
      return {
        source: "leetcode",
        id: `custom-lc-${slug}`,
        title: titleFromSlug(slug),
        url: `https://leetcode.com/problems/${slug}/`,
        lc: slug,
      };
    }

    if (host.includes("codeforces")) {
      const problemset = url.pathname.match(
        /\/problemset\/problem\/(\d+)\/([A-Za-z][0-9]*)/i
      );
      const contest = url.pathname.match(
        /\/(?:contest|gym)\/(\d+)\/problem\/([A-Za-z][0-9]*)/i
      );
      const match = problemset || contest;
      if (!match) return null;
      const contestId = match[1];
      const index = match[2].toUpperCase();
      const isGym = url.pathname.includes("/gym/");
      const href = isGym
        ? `https://codeforces.com/gym/${contestId}/problem/${index}`
        : `https://codeforces.com/problemset/problem/${contestId}/${index}`;
      return {
        source: "codeforces",
        id: `custom-cf-${contestId}${index}`,
        title: `Codeforces ${contestId}${index}`,
        url: href,
        cf: `${contestId}/${index}`,
        contestId,
        index,
      };
    }
  } catch {
    return null;
  }

  return null;
}

export function parseDsaLinks(text: string): { parsed: ParsedDsaLink[]; invalid: string[] } {
  const parts = text
    .split(/[\n,]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  const seen = new Set<string>();
  const parsed: ParsedDsaLink[] = [];
  const invalid: string[] = [];

  for (const part of parts) {
    const item = parseDsaLink(part);
    if (!item) {
      invalid.push(part);
      continue;
    }
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    parsed.push(item);
  }

  return { parsed, invalid };
}

export function getProblemLinks(problem: LinkableProblem): ProblemLink[] {
  const links: ProblemLink[] = [];
  const seen = new Set<string>();

  const add = (label: string, href?: string | null) => {
    if (!href || seen.has(href)) return;
    seen.add(href);
    links.push({ label, href });
  };

  if (problem.lc) {
    add("LeetCode", `https://leetcode.com/problems/${problem.lc}/`);
  } else if (problem.source === "leetcode" && problem.url) {
    add("LeetCode", problem.url);
  }

  if (problem.source === "codeforces" && problem.url) {
    add("Codeforces", problem.url);
  } else if (problem.cf) {
    if (/^https?:\/\//i.test(problem.cf)) {
      add("Codeforces", problem.cf);
    } else {
      const [contestId, index] = problem.cf.split("/");
      if (contestId && index) {
        add("Codeforces", `https://codeforces.com/problemset/problem/${contestId}/${index}`);
      }
    }
  }

  return links;
}

export async function enrichParsedLink(item: ParsedDsaLink): Promise<ParsedDsaLink> {
  if (item.source !== "codeforces" || !item.contestId || !item.index) return item;
  try {
    const response = await fetch(
      `https://codeforces.com/api/contest.standings?contestId=${item.contestId}&from=1&count=1`
    );
    if (!response.ok) return item;
    const data = await response.json();
    const problem = data?.result?.problems?.find(
      (entry: { index?: string }) => String(entry.index).toUpperCase() === item.index
    );
    if (problem?.name) {
      return { ...item, title: `${item.contestId}${item.index}. ${problem.name}` };
    }
  } catch {
    // Title stays as the contest/index fallback when the API is blocked.
  }
  return item;
}
