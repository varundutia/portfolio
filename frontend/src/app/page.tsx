import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Blocks,
  Cloud,
  Code2,
  Contact2,
  Database,
  Download,
  ExternalLink,
  GitBranch,
  KeyRound,
  Mail,
  MessageSquareText,
  MonitorCog,
  Network,
  ServerCog,
  ShieldCheck,
  Smartphone,
  Workflow,
} from "lucide-react";

import { ChatWindow } from "@/components/chat/chat-window";
import { LanguageBreakdown } from "@/components/github/language-breakdown";
import { RepoCard } from "@/components/github/repo-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ApiError,
  documentFileUrl,
  listDocuments,
  listProjects,
  listRepositories,
} from "@/lib/api";
import { findResumeDocument } from "@/lib/documents";
import { siteConfig } from "@/lib/site-config";
import type { PortfolioDocument, Project, Repository } from "@/lib/types";

type LoadResult<T> = { data: T; error: string | null };

async function loadResult<T>(promise: Promise<T>, fallback: T): Promise<LoadResult<T>> {
  try {
    return { data: await promise, error: null };
  } catch (err) {
    return {
      data: fallback,
      error: err instanceof ApiError ? err.message : "Could not load this backend data.",
    };
  }
}

const operatingScope = [
  "Backend services",
  "Payments",
  "Authentication and authorization",
  "Microservices",
  "Mobile and web applications",
  "Internal administration systems",
  "Product analytics",
  "CI/CD and monitoring",
];

const workExperience = [
  {
    role: "Senior Software Developer",
    organization: "Devaseva (DonateKart)",
    period: "March 2022 - August 2025",
    location: "Hyderabad, India",
    summary:
      "Built full-stack product systems for 15,000+ users, including Razorpay payments, sub-200ms APIs, JWT/RBAC admin tools, and revenue-focused product features.",
  },
  {
    role: "Project Engineer",
    organization: "Wipro Limited",
    period: "July 2021 - March 2022",
    location: "Chennai, India",
    summary:
      "Built backend reporting pipelines integrating SAP and MSSQL systems, improving reliability through data transformation optimisation.",
  },
  {
    role: "Internship Experience",
    organization: "BeyondX, Metta Studio, Play And Shine Foundation, The Sparks Foundation",
    period: "August 2020 - July 2021",
    location: "India",
    summary:
      "Delivered early web, Python, Android, React Native, Node.js, Firebase, and AWS work across internship and founding-member technology roles.",
  },
];

const educationHistory = [
  {
    program: siteConfig.education,
    institution: "University College Dublin",
    period: siteConfig.educationDates,
    location: "Dublin, Ireland",
    summary:
      "MSc Computer Science coursework includes software engineering, cloud computing, databases, Java, data structures, data science, and information security.",
  },
  {
    program: "B.Tech Electrical and Electronics Engineering",
    institution: "Vellore Institute of Technology (VIT)",
    period: "2017 - 2021",
    location: "Chennai, India",
    summary:
      "Bachelor of Technology in Electrical and Electronics Engineering with Minor in Computer Science and Engineering; CGPA 7.89, Minor CGPA 7.75.",
  },
  {
    program: "Senior School Certificate Examination",
    institution: "Central Board of Secondary Education",
    period: "2017",
    location: "DAV Sr. Secondary School, Mogappair, Chennai",
    summary:
      "Class 12 CBSE pass with English Core 93, Mathematics 82, Physics 95, Chemistry 92, and Computer Science 97.",
  },
];

const workAreas = [
  {
    title: "Payments and Platform Integrations",
    description:
      "Experience across payment-oriented product systems and integrations, including Razorpay in the supplied technology stack.",
    tags: ["Payments", "Razorpay", "REST APIs"],
  },
  {
    title: "Authentication and Internal Systems",
    description:
      "Backend and product work involving JWT, Google OAuth, RBAC, and administration workflows.",
    tags: ["JWT", "Google OAuth", "RBAC"],
  },
  {
    title: "Microservices and Messaging",
    description:
      "Systems experience across Node.js, NestJS, Redis, RabbitMQ, SQL, and service-to-service APIs.",
    tags: ["Node.js", "NestJS", "RabbitMQ", "Redis"],
  },
  {
    title: "Mobile, Web, and Product Analytics",
    description:
      "Cross-platform delivery across React, Next.js, Flutter, Dart, MoEngage, Firebase Analytics, and Crashlytics.",
    tags: ["React", "Next.js", "Flutter", "Firebase"],
  },
];

const capabilities = [
  {
    title: "Backend Engineering",
    description:
      "API design, service boundaries, SQL-backed systems, asynchronous workflows, and operational debugging.",
    icon: ServerCog,
    items: ["Node.js", "NestJS", "TypeScript", "REST APIs", "SQL", "MySQL"],
  },
  {
    title: "Identity and Payments",
    description:
      "Production-oriented work around authorization, user access, third-party payment flows, and platform integrations.",
    icon: ShieldCheck,
    items: ["JWT", "Google OAuth", "RBAC", "Razorpay"],
  },
  {
    title: "Distributed Product Systems",
    description:
      "Microservice coordination, queue-backed workflows, caching, release pipelines, and cloud monitoring.",
    icon: Network,
    items: ["Redis", "RabbitMQ", "AWS", "CloudWatch", "Azure DevOps", "CI/CD"],
  },
  {
    title: "Cross-Platform Delivery",
    description:
      "Product engineering across web, mobile, analytics, and crash reporting, with attention to maintainability after launch.",
    icon: Smartphone,
    items: ["React", "Next.js", "Flutter", "Dart", "MoEngage", "Firebase"],
  },
];

const systemMap = [
  { label: "Product UI", icon: MonitorCog },
  { label: "API Layer", icon: Code2 },
  { label: "Auth", icon: KeyRound },
  { label: "Payments", icon: Blocks },
  { label: "Data", icon: Database },
  { label: "Cloud Ops", icon: Cloud },
];

function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-10 max-w-3xl">
      <p className="font-mono text-xs uppercase text-muted-foreground">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
      <p className="mt-3 text-base leading-7 text-muted-foreground">{description}</p>
    </div>
  );
}

function HeroSystemMap() {
  return (
    <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-border/70 bg-card p-4 shadow-sm">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:32px_32px] opacity-35" />
      <div className="relative flex h-full min-h-[328px] flex-col justify-between">
        <div className="flex items-center justify-between border-b border-border/70 pb-3">
          <div>
            <p className="font-mono text-xs uppercase text-muted-foreground">Operating Model</p>
            <p className="mt-1 text-sm font-medium">Product systems, end to end</p>
          </div>
          <Workflow className="size-5 text-muted-foreground" aria-hidden />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {systemMap.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="flex min-h-20 items-center gap-3 rounded-md border border-border/70 bg-background/90 p-3"
            >
              <span className="flex size-9 items-center justify-center rounded-md bg-muted">
                <Icon className="size-4" aria-hidden />
              </span>
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>

        <div className="rounded-md border border-border/70 bg-background/90 p-3">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium">Build, integrate, operate, improve</p>
            <BarChart3 className="size-4 text-muted-foreground" aria-hidden />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2" aria-hidden>
            <span className="h-1.5 rounded-full bg-[var(--series-1)]" />
            <span className="h-1.5 rounded-full bg-[var(--series-3)]" />
            <span className="h-1.5 rounded-full bg-[var(--series-4)]" />
            <span className="h-1.5 rounded-full bg-[var(--series-8)]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturedWork({
  projects,
  repos,
  apiIssues,
}: {
  projects: Project[];
  repos: Repository[];
  apiIssues: string[];
}) {
  const featuredRepos = repos
    .filter((repo) => repo.category === "flagship" || repo.category === "supporting" || repo.featured)
    .slice(0, 4);

  return (
    <section id="work" className="border-t border-border/70">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionIntro
          eyebrow="Selected Work"
          title="Case-study areas backed by product and systems experience."
          description="The strongest thread is ownership across the product stack: services, integrations, internal workflows, mobile and web clients, analytics, release pipelines, and production feedback loops."
        />

        {apiIssues.length > 0 && (
          <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            Backend data is temporarily unavailable: {apiIssues.join(" ")}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {workAreas.map((area) => (
            <article key={area.title} className="rounded-lg border border-border/70 bg-card p-5">
              <h3 className="text-lg font-semibold tracking-tight">{area.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{area.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {area.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="rounded-md">
                    {tag}
                  </Badge>
                ))}
              </div>
            </article>
          ))}
        </div>

        {(projects.length > 0 || featuredRepos.length > 0) && (
          <div className="mt-12">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold tracking-tight">Repository Evidence</h3>
              {projects.length > 0 ? (
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  All projects <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              ) : repos.length > featuredRepos.length ? (
                <Link
                  href="/github"
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  View all <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              ) : null}
            </div>

            {projects.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {projects.slice(0, 4).map((project) => (
                  <article key={project.id} className="rounded-lg border border-border/70 bg-card p-5">
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="font-semibold tracking-tight">{project.title}</h4>
                      <Link
                        href={`/projects/${project.slug}`}
                        className="shrink-0 text-sm text-muted-foreground hover:text-foreground"
                      >
                        Case study
                      </Link>
                    </div>
                    <div className="mt-4 space-y-3">
                      {project.repositories.slice(0, 2).map((repo) => (
                        <RepoCard key={repo.id} repo={repo} />
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {featuredRepos.map((repo) => (
                  <RepoCard key={repo.id} repo={repo} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default async function Home() {
  const [reposResult, projectsResult, documentsResult] = await Promise.all([
    loadResult<Repository[]>(listRepositories(), []),
    loadResult<Project[]>(listProjects(), []),
    loadResult<PortfolioDocument[]>(listDocuments(), []),
  ]);

  const repos = reposResult.data;
  const projects = projectsResult.data;
  const documents = documentsResult.data;
  const resume = findResumeDocument(documents);
  const apiIssues = [
    projectsResult.error ? `Projects: ${projectsResult.error}` : null,
    reposResult.error ? `Repositories: ${reposResult.error}` : null,
  ].filter((issue): issue is string => Boolean(issue));

  return (
    <div>
      <section id="home" className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:py-24">
        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="rounded-md">
              {siteConfig.location}
            </Badge>
            <Badge variant="outline" className="rounded-md">
              {siteConfig.experience}
            </Badge>
          </div>
          <h1 className="mt-6 max-w-4xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            {siteConfig.shortName}
          </h1>
          <p className="mt-5 max-w-3xl text-balance text-lg leading-8 text-muted-foreground sm:text-xl">
            {siteConfig.tagline}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" render={<Link href="#work" />}>
              <GitBranch className="size-4" aria-hidden /> View Work
            </Button>
            <Button size="lg" variant="outline" render={<Link href="#contact" />}>
              <Mail className="size-4" aria-hidden /> Contact
            </Button>
          </div>
          <div className="mt-10 grid gap-2 sm:grid-cols-2">
            {operatingScope.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="size-1.5 rounded-full bg-[var(--series-3)]" aria-hidden />
                {item}
              </div>
            ))}
          </div>
        </div>

        <HeroSystemMap />
      </section>

      <section id="experience" className="border-t border-border/70 bg-muted/25">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionIntro
            eyebrow="Experience"
            title="Production-minded engineering across services, apps, and operating workflows."
            description="A concise view of professional experience, internship background, and education, without exposing the underlying document library."
          />
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg border border-border/70 bg-card p-5">
              <div className="mb-4">
                <p className="font-mono text-xs uppercase text-muted-foreground">Work Experience</p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight">Engineering roles and internships</h3>
              </div>
              <div className="grid gap-4">
                {workExperience.map((item) => (
                  <article key={`${item.organization}-${item.role}`} className="border-t border-border/70 pt-4 first:border-t-0 first:pt-0">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div>
                        <h4 className="font-semibold tracking-tight">{item.role}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.organization} - {item.location}
                        </p>
                      </div>
                      <p className="shrink-0 font-mono text-xs uppercase text-muted-foreground">{item.period}</p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.summary}</p>
                  </article>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-border/70 bg-card p-5">
              <div className="mb-4">
                <p className="font-mono text-xs uppercase text-muted-foreground">Education</p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight">Academic background</h3>
              </div>
              <div className="grid gap-4">
                {educationHistory.map((item) => (
                  <article key={`${item.institution}-${item.program}`} className="border-t border-border/70 pt-4 first:border-t-0 first:pt-0">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div>
                        <h4 className="font-semibold tracking-tight">{item.program}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.institution} - {item.location}
                        </p>
                      </div>
                      <p className="shrink-0 font-mono text-xs uppercase text-muted-foreground">{item.period}</p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.summary}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturedWork projects={projects} repos={repos} apiIssues={apiIssues} />

      <section id="capabilities" className="border-t border-border/70 bg-muted/25">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionIntro
            eyebrow="Engineering Capabilities"
            title="A practical stack for building and operating product systems."
            description="The emphasis is not a long list of frameworks. It is the ability to connect product needs to service design, data, access control, integration reliability, delivery pipelines, and observability."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {capabilities.map(({ title, description, icon: Icon, items }) => (
              <article key={title} className="rounded-lg border border-border/70 bg-card p-5">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 items-center justify-center rounded-md bg-muted">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-semibold tracking-tight">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {items.map((item) => (
                    <Badge key={item} variant="outline" className="rounded-md">
                      {item}
                    </Badge>
                  ))}
                </div>
              </article>
            ))}
          </div>

          {repos.length > 0 && (
            <div className="mt-12 rounded-lg border border-border/70 bg-card p-5">
              <LanguageBreakdown repos={repos} />
            </div>
          )}
        </div>
      </section>

      <section id="about" className="border-t border-border/70">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionIntro
              eyebrow="About"
              title="Calm, accountable product engineering."
              description="Varun is a software engineer based in Dublin, currently pursuing an MSc in Computer Science at University College Dublin while continuing to build on more than four years of engineering experience."
            />
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" render={<Link href={siteConfig.github} target="_blank" rel="noreferrer" />}>
                <GitBranch className="size-4" aria-hidden /> GitHub
              </Button>
              <Button variant="outline" render={<Link href={siteConfig.linkedin} target="_blank" rel="noreferrer" />}>
                <Contact2 className="size-4" aria-hidden /> LinkedIn
              </Button>
            </div>
          </div>
          <div className="rounded-lg border border-border/70 bg-card p-5">
            <div className="mb-5 flex items-center gap-3">
              <MessageSquareText className="size-5 text-muted-foreground" aria-hidden />
              <div>
                <h3 className="font-semibold tracking-tight">Ask the Portfolio</h3>
                <p className="text-sm text-muted-foreground">
                  Use the evidence-backed assistant for specifics when documents and repositories are synced.
                </p>
              </div>
            </div>
            <ChatWindow />
          </div>
        </div>
      </section>

      <section id="contact" className="border-t border-border/70 bg-muted/25">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
            <SectionIntro
              eyebrow="Contact"
              title="Open to software engineering roles across backend and product systems."
              description="Best fit conversations: backend engineering, product engineering, payments, microservices, platform integrations, mobile/web delivery, and production ownership."
            />
            <div className="grid content-start gap-3">
              <Link
                href={`mailto:${siteConfig.email}`}
                className="flex items-center justify-between gap-4 rounded-lg border border-border/70 bg-card p-4 text-sm transition-colors hover:border-foreground/20"
              >
                <span className="flex items-center gap-3">
                  <Mail className="size-4 text-muted-foreground" aria-hidden />
                  {siteConfig.email}
                </span>
                <ArrowRight className="size-4 text-muted-foreground" aria-hidden />
              </Link>
              <Link
                href={siteConfig.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-4 rounded-lg border border-border/70 bg-card p-4 text-sm transition-colors hover:border-foreground/20"
              >
                <span className="flex items-center gap-3">
                  <Contact2 className="size-4 text-muted-foreground" aria-hidden />
                  LinkedIn
                </span>
                <ExternalLink className="size-4 text-muted-foreground" aria-hidden />
              </Link>
              <Link
                href={siteConfig.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-4 rounded-lg border border-border/70 bg-card p-4 text-sm transition-colors hover:border-foreground/20"
              >
                <span className="flex items-center gap-3">
                  <GitBranch className="size-4 text-muted-foreground" aria-hidden />
                  GitHub
                </span>
                <ExternalLink className="size-4 text-muted-foreground" aria-hidden />
              </Link>
              {resume && (
                <Button
                  variant="outline"
                  className="h-auto justify-between rounded-lg p-4"
                  render={<a href={documentFileUrl(resume.id)} download />}
                >
                  <span className="flex items-center gap-3">
                    <Download className="size-4 text-muted-foreground" aria-hidden />
                    Download resume
                  </span>
                  <ArrowRight className="size-4 text-muted-foreground" aria-hidden />
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
