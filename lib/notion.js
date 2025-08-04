import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import dotenv from "dotenv";

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const DATABASE_IDS = {
  projects: process.env.PUBLIC_NOTION_PROJECTS_ID,
  experiences: process.env.PUBLIC_NOTION_EXPERIENCES_ID,
  skills: process.env.PUBLIC_NOTION_SKILLS_ID,
};

export async function getProjects() {
  if (!DATABASE_IDS.projects) {
    throw new Error("NOTION_PROJECTS_ID is not defined in .env");
  }

  const response = await notion.databases.query({
    database_id: DATABASE_IDS.projects,
    sorts: [
        {
        property: "position",  // exact property name in your Notion DB
        direction: "ascending", // or "descending"
        },
    ],
  });

  return response.results.map((page) => {
    const props = page.properties;

    return {
      id: page.id,
      title: props?.title?.title?.[0]?.plain_text ?? "Untitled",
      live: props?.live?.url ?? null,
      github: props?.github?.url ?? null,
      thumbnail:
        props?.thumbnail?.url ??
        null,
      description:
        props?.description?.rich_text?.[0]?.plain_text ?? "",
      tech: props?.tech?.rich_text?.[0]?.plain_text
        ?.split(",")
        .map((s) => s.trim()) ?? [],
    };
  });
}


export async function getSkills() {
  if (!DATABASE_IDS.skills) {
    throw new Error("skills is not defined in .env");
  }

  const response = await notion.databases.query({
    database_id: DATABASE_IDS.skills,
  });

  return response.results.map((page) => {
    const props = page.properties;

    return {
      id: page.id,
      title: props?.title?.title?.[0]?.plain_text ?? "",
    };
  });
}

export async function getExperiences() {
  if (!DATABASE_IDS.experiences) {
    throw new Error("experiences is not defined in .env");
  }

  const response = await notion.databases.query({
    database_id: DATABASE_IDS.experiences,
    sorts: [
        {
        property: "timeline", // must match the Notion property name exactly (case-sensitive)
        direction: "descending", // or "ascending" for oldest first
        },
    ],
  });

  return response.results.map((page) => {
    const props = page.properties;
    return {  
      id: page.id,
      title: props?.title?.title?.[0]?.plain_text ?? "",
      link: props?.link?.url ?? null,
      from: props?.from?.rich_text?.[0]?.plain_text ?? "",
      to: props?.to?.rich_text?.[0]?.plain_text ?? "",
      role: props?.role?.rich_text?.[0]?.plain_text ?? "",
      skills: props?.skills?.rich_text?.[0]?.plain_text ?? "",
      timeline: props?.timeline?.rich_text?.[0]?.plain_text ?? "",
    };
  });
}


export async function getPosts(parentPageId) {
  const response = await notion.blocks.children.list({
    block_id: parentPageId, // Replace with your "posts" page ID
    page_size: 100, // Adjust based on number of subpages
  });
  return response.results
    .filter(block => block.type === "child_page")
    .map(page => ({
      id: page.id,
      title: page.child_page.title || "Untitled",
      url: `/posts/${page.id}`, // Dynamic route for details page
      created_at: page.created_time, // ISO timestamp
    }));
}


const n2m = new NotionToMarkdown({ notionClient: notion });
export async function getMarkdownFromPage(pageId) {
  const mdBlocks = await n2m.pageToMarkdown(pageId);
  const markdown = n2m.toMarkdownString(mdBlocks).parent;

  return markdown;
}