/* empty css                                 */
import { b as createAstro, c as createComponent, m as maybeRenderHead, a as renderComponent, r as renderTemplate, e as addAttribute } from '../chunks/astro/server_CqgkFk_a.mjs';
import 'kleur/colors';
import { g as getCollection, r as renderEntry } from '../chunks/_astro_content_ZMj8EG3v.mjs';
import { $ as $$ProjectCard } from '../chunks/ProjectCard_ClEBvcaw.mjs';
import 'clsx';
import { $ as $$MainLayout } from '../chunks/MainLayout_AZj25lPk.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Astro$1 = createAstro("https://fazleyrabbi.xyz");
const $$Projects = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Projects;
  const { type = "home" } = Astro2.props;
  const allProjects = await getCollection("projects");
  allProjects.sort((a, b) => (a.data.position || 0) - (b.data.position || 0));
  const projects = type === "home" ? allProjects.slice(0, 4) : allProjects;
  return renderTemplate`${maybeRenderHead()}<section id="projects" class="py-16"> <div class="max-w-6xl mx-auto px-6"> <div class="flex items-center gap-6 mb-12"> <div> <span class="section-label">02 / Projects</span> <h2 class="reveal-heading text-[var(--text-primary)] font-display font-bold text-[clamp(2rem,5vw,3rem)] leading-tight">Featured Projects</h2> </div> <div class="flex-1 hidden md:block h-[1px] bg-accent opacity-20 dark:opacity-30"></div> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-5"> ${projects.map((project) => renderTemplate`${renderComponent($$result, "ProjectCard", $$ProjectCard, { "project": project })}`)} </div> ${type === "home" && allProjects.length > 4 && renderTemplate`<div class="mt-8 text-center"> <a href="/projects" class="btn-ghost group">
View All Projects
<span class="inline-block transition-transform group-hover:translate-x-1 ml-1">→</span> </a> </div>`} </div> </section>`;
}, "/Users/rabbi/Desktop/Projects/Sites/astro-portfolio/src/components/Projects.astro", void 0);

const $$Experience = createComponent(async ($$result, $$props, $$slots) => {
  const experiences = await getCollection("experiences");
  experiences.sort((a, b) => {
    const dateA = a.data.timeline ? new Date(a.data.timeline) : /* @__PURE__ */ new Date(0);
    const dateB = b.data.timeline ? new Date(b.data.timeline) : /* @__PURE__ */ new Date(0);
    return dateB.getTime() - dateA.getTime();
  });
  const renderedExperiences = await Promise.all(experiences.map(async (exp) => {
    const { Content } = await renderEntry(exp);
    return { ...exp, Content };
  }));
  return renderTemplate`${maybeRenderHead()}<section id="experience" class="py-16"> <div class="max-w-6xl mx-auto px-6"> <div class="flex items-center gap-6 mb-12"> <div> <span class="section-label">04 / Experience</span> <h2 class="reveal-heading text-[var(--text-primary)] font-display font-bold text-[clamp(1.8rem,5vw,2.5rem)] leading-tight">Career Journey</h2> </div> <div class="flex-1 hidden md:block h-[1px] bg-accent opacity-20 dark:opacity-30"></div> </div> <div class="timeline relative ml-3"> ${renderedExperiences.map((item) => renderTemplate`<div class="timeline-entry relative pl-10 pb-8 last:pb-0 group"> <div class="timeline-dot absolute left-[-4.5px] top-2"></div> <div class="timeline-date font-mono text-[0.68rem] text-[var(--text-muted)] mb-1 uppercase tracking-widest"> ${item.data.from} — ${item.data.to} </div> <a${addAttribute(item.data.link ?? "#", "href")} target="_blank" rel="noreferrer" class="timeline-company font-sans font-bold text-[1.1rem] text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors mb-0.5 block"> ${item.data.title} </a> <div class="timeline-role font-sans italic text-[0.92rem] text-[var(--text-secondary)] mb-2"> ${item.data.role} </div> <div class="timeline-desc font-sans text-[0.92rem] text-[var(--text-secondary)] leading-relaxed max-w-2xl opacity-90"> ${renderComponent($$result, "item.Content", item.Content, {})} </div> </div>`)} </div> </div> </section>`;
}, "/Users/rabbi/Desktop/Projects/Sites/astro-portfolio/src/components/Experience.astro", void 0);

const $$LatestPosts = createComponent(async ($$result, $$props, $$slots) => {
  const allPostsRaw = await getCollection("posts");
  const allPosts = allPostsRaw.filter((post) => !post.data.draft);
  allPosts.sort((a, b) => {
    const dateA = a.data.date ? new Date(a.data.date).getTime() : 0;
    const dateB = b.data.date ? new Date(b.data.date).getTime() : 0;
    return dateB - dateA;
  });
  const latestPosts = allPosts.slice(0, 3);
  return renderTemplate`${maybeRenderHead()}<section id="posts" class="py-16"> <div class="max-w-6xl mx-auto px-6"> <div class="flex items-center gap-6 mb-12"> <div> <span class="section-label">05 / Writing</span> <h2 class="reveal-heading text-[var(--text-primary)] font-display font-bold text-[clamp(1.8rem,5vw,2.5rem)] leading-tight">Latest Thoughts</h2> </div> <div class="flex-1 hidden md:block h-[1px] bg-accent opacity-20 dark:opacity-30"></div> </div> <div class="post-list border-t border-border"> ${latestPosts.map((post, i) => renderTemplate`<a${addAttribute(`/posts/${post.slug}`, "href")} class="post-row flex flex-col sm:flex-row sm:items-center py-4 sm:py-3 border-b border-border group transition-all duration-300 hover:bg-[var(--accent-dim)] hover:pl-4"> <div class="flex items-start gap-4 sm:gap-6 flex-1 min-w-0"> <span class="post-number font-mono text-[0.7rem] text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors shrink-0">0${i + 1}</span> <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 min-w-0"> <span class="post-date font-mono text-[0.68rem] text-[var(--text-muted)] shrink-0"> ${post.data.date ? new Date(post.data.date).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "Unknown"} </span> <span class="post-title font-display font-semibold text-[1.02rem] text-[var(--text-primary)] group-hover:text-[var(--text-primary)] truncate"> ${post.data.title} </span> </div> </div> <span class="post-arrow font-mono text-[var(--text-secondary)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all mt-2 sm:mt-0 ml-auto sm:ml-0 hidden sm:inline-block">→</span> </a>`)} </div> ${latestPosts.length === 0 && renderTemplate`<div class="text-center py-12"> <p class="text-[var(--text-muted)] font-mono text-xs">No posts yet. Check back soon!</p> </div>`} ${latestPosts.length > 0 && renderTemplate`<div class="mt-6 text-center"> <a href="/posts" class="btn-ghost">Show More Posts</a> </div>`} </div> </section>`;
}, "/Users/rabbi/Desktop/Projects/Sites/astro-portfolio/src/components/LatestPosts.astro", void 0);

const $$Astro = createAstro("https://fazleyrabbi.xyz");
const $$Skills = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Skills;
  const marqueeItems = [
    "PHP",
    "Laravel",
    "MySQL",
    "REST API",
    "Docker",
    "Netlify",
    "GitHub",
    "CI/CD",
    "JavaScript",
    "Tailwind CSS",
    "Bootstrap",
    "Astro",
    "Linux",
    "VPS",
    "API Design"
  ];
  const skillsMatrix = [
    { label: "BACKEND", values: "PHP, Laravel 8\u201312, REST API, MySQL" },
    { label: "FRONTEND", values: "JavaScript, Tailwind CSS, Bootstrap" },
    { label: "INFRA / DEVOPS", values: "Docker, Netlify, GitHub, Linux VPS" },
    { label: "TOOLS", values: "Astro, Markdown, Web Automation" }
  ];
  return renderTemplate`${maybeRenderHead()}<section id="skills" class="py-16 overflow-hidden"> <div class="max-w-6xl mx-auto px-6"> <div class="flex items-center gap-6 mb-12"> <div> <span class="section-label">03 / Skills</span> <h2 class="reveal-heading text-[var(--text-primary)] font-display font-bold text-[clamp(1.8rem,5vw,2.5rem)] leading-tight">Expertise & Stack</h2> </div> <div class="flex-1 hidden md:block h-[1px] bg-accent opacity-20 dark:opacity-30"></div> </div> </div> <!-- Dual-row marquee --> <div class="marquee-track"> <div class="marquee-inner marquee-inner--left"> ${[...marqueeItems, ...marqueeItems].map((item) => renderTemplate`<div class="marquee-item"> ${item} </div>`)} </div> </div> <div class="marquee-track"> <div class="marquee-inner marquee-inner--right"> ${[...marqueeItems.slice().reverse(), ...marqueeItems.slice().reverse()].map((item) => renderTemplate`<div class="marquee-item"> ${item} </div>`)} </div> </div> <div class="max-w-6xl mx-auto px-6 mt-8"> <!-- Skills Matrix --> <div class="border-t border-border"> ${skillsMatrix.map((row) => renderTemplate`<div class="skills-row flex flex-col md:flex-row md:items-start group transition-colors hover:bg-[var(--accent-dim)] px-4 -mx-4"> <div class="skills-cat w-full md:w-[180px] shrink-0"> ${row.label} </div> <div class="skills-val flex-1"> ${row.values} </div> </div>`)} </div> </div> </section>`;
}, "/Users/rabbi/Desktop/Projects/Sites/astro-portfolio/src/components/Skills.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$AsciiAvatar = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(["", `<div class="ascii-avatar" aria-hidden="true" data-astro-cid-unq6fp4j> <canvas id="ascii-smoke-canvas" data-astro-cid-unq6fp4j></canvas> <div class="ascii-glow" data-astro-cid-unq6fp4j></div> </div>  <script>
  (function () {
    const DARK_ART = \`$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$&&X++x$&&$$$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$++:::::..:+x+X&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&x::             .:+X$$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&X;:.                  .:;;++$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$$$
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&+.                      ...:+$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$$$$X++;
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$;           .                 ;$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$x++++;;;
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&x     :;;++xxx++++;;::::       .X&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$X+;;;;;
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&;   ;xXXXXXXXXXXXXXXxxx+;:      X&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&X+;;++;
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&X: ;XX$$$$$$$$XXXXXXXXxxx+;:     +&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$XXXX;
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&+.;X$$$X$$$$$$$XXXXXXxxx+++;:    X&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$Xx;
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&:.+X$X$$$$$$X$$$XXXXXxxx+++;:   .&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$Xx;
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$::+X$$$$XXXXXXXXXXXXXXXX+++;:    $&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$X+
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$::XX+;:.  :;;++;:. .::::;;++;    X&&&&&&&&&&&&&&&&&&&&&&&&$&&&&&&&&&&&&&$X
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&+:::.       .             :::.  .$&&&&&&&&&&&&&&&&&&&&&$$$$&&&&&&&&&&&&&&$
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&x+;::        .Xx           .::. .::+$&&&&&&&&&&&&&&&&&$$XXX$&&&&&&&&&&&&&&$
X&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$xxX::::      x$X:          ;;;;.:;;;X&&&&&&&&&&&&&$$$$XXXxX$&&$$$$&&&&&&&&X
X$$$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&X+X+:::.....+$$X+:       .;++;: .:;+$&$$$$$$$$$$$$XXxxXXxxXXXXXXX$&&&&&&&&X
xXXX$$$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$+xXX++++;:xxXx++x+ ::::;;+++;. :;+X&$$$$$$XXxxxXXxx++xxxxxxxxXxxXX$$$&&&&X
xXXXXXX$$$&&&&&&&&&&&&&&&&&&$$&&&&&&&&&&&&&$+;xXXXXXxx;::.  :.;xXx+++;+;:  :+xX$X$$$$$XXXXx+++xxx++++++++++++xXX$$&&$X
xXXXXXXXXXXX$$$$$$&&&&&&&$$XX$$$$&&&&&&&&&&$;:;xxxXX;;;;::::::::;x+;;;:.   :;+xXXXXXXxx+xxxxxXXXx++;++;;;;+++++xXXXXXX
xX$$XXXXXXXXXXXxxX$&&$$XXxxxxXXXXXXX$$&&&&&X:  :+xX;: .:;;;;:   .:+;:.      ;++++xxxx+++++x++++++++++++++++++;;++xxxx+
++xxxxxxxxxx++++++X$$$Xx+++++x++++++xXX$$$$X.   .;++:;x++;;;;;;:..::        ;xx++xxxxx+++++;;;:::;+++++xx++;;;;;++++++
:;++;;:::::::::;;;+xXXx+;;;;++++;;;;+++xXX$+     .:::;++;: .:;;:           .;Xxx++++xx+++;;;;;:.:;++;;++xx+;;;;;++x++;
;+++++;;;;;::::::;;+++;;;;;;+++;;;;;;++xxxXx;        ::+++;;;:.            :XXx+++xx++;;;;;;;;::.:::::;+xx+++++;;;++++
;++xxx++;+++;:::;;+++++;;;;;+++;;;;;;;++x+++;.         ...                .+XXx++++++;;;;;;;:::...:::::;++;;++++;;;+++
+XXXXXxx+xXX++;+++xxxx+++++++x++;;;;;;++x+xx+:                             ;x++++++++;;;+++;:::..::::::;;;;+++;;;;;;;+
xXXXXXXxxxXXx+xxXXXXXXXxxx+;++++++++++xXXXXXX;.                            .;;++xx++;;;+++;;;;;:::::::;;;::;;;:::;;;;;
;+xxx++++++++++xxXXXXXXXx++;;+++++xXXXXXXXXXx;.                              ;xXx+;::::;;;:::;;::::::;++;:::::::;;::::
;++++;;;++;;;;;+++++++++++;:;;++++xxXXXXXXXXx;.                              .:++;::..:;;;:..:::;;::;+++++;::::;;;:.::
;+++;;++++;;;;++++++++++++;::;+++++xx++;;;;:::.                                ..:::::;++;:..:::;;;;;+++;;;;::;++;::::
+++++++x++++++xXXXXXXXXXXx++++xx+++;:::::::::::.                               .......::::::::;;::;;;;;:::;;;++++;::;:
;++;;;++++;;;;+XXXXXXxxxxXXXXXx+;;::....:.::::::                                  .... .::::::::;;;;++;::::;+xx+++;;;;
+XXXx+xXx+;::+XX$$$XX+;;+xX$X+;:::.. ....::::::::                                     .:........:;++++;;::;;;++++++;;;
X&&&$$&&$X;;x$&&&&&&$x++XX$X+:::.  .. ..:::::::::. .                          .    .. ....    ....:;++;;;;;;;;;;;++++;
X&&&$$&&$X;;+$&&&&&&$x++x$X+:..    . .::.:::::::::. .   +x.::              .         ..  ..      ...;;;;;;;;;;;;;;;;+;
+X$XxxXXx+::+x$$&&&&$x+;+x;:.     .: ...:::::::::....    +;.:                .  ....  .     .   .  ..;;;;;;+++++++++xx
+XXx+xXXx+;:+xX$$&$$$XxxX+::...   .:..::::::::::::....    +               .   ....   .  .             ;+++xxxxXXXXX$$X
+$$XxX$$$X+;X$$&&&&&$$XXX+ ..    .:. .:::::::::::::....                    .. ....                     ;XXXXXXXXXXXXXX
;+x+++X$$x;;X$$$$$&&$Xx+x;      .....:::::::::::::::..  ::      .   ..   ...... ..  .                   +XXXXXXXXXxxx+
;+x+++XXx;::+XXXXX$$Xx+;;:     ..  .::::::::::::::::...     ...   .    ......  ..  ..                   ;XXXXXXXXXXxx+
+X$XXXXXx;:;+XX$$$$XXx++;        ....::::::::::::::.............    .  .....   .  ...                   :X$$$$$$XXXXXx
+X$XxX$Xx;:;x$$$$$$$XX++;.      ...::::::::::::::::..........   ...  .....   ...  ...  .                 +$$$$$$$$$$$X
+X$XXX$$X+;;x$&&&&&&$Xx+:     ...:.::::::::::::::.... ....    ....  .....   .    ..                      :X$$$$$$$$$$X
+$$XXX$$X+;;x$&&&&&&$Xx+:      ...::::::::.:........    .    ....  ::....  .........                      x$$$$$$$$$$X
x$$XXX$$X+:;x$$&&&&$$Xx; .     .:..::::::..:........ .. .   ... . ........                                ;X$$$$$$$$$X
x$$$XX$$X+;;x$&&&&&&$X+:.     .:::::::::..........     .  .........::...   .                               X$$$$$$$$XX
X$&$XX$$X+;;x$&&&&&&$X;.      ::;;;::::..........  .    . ..   .. .......   ..                             ;$$$$$$$$$X
X$$$XX$$Xx;;x$&&&&&$$X;       :::::::.........       :;:.    ...  .....   .                                .X$$$$$$$$X
X$$$XX$$Xx++x$$&&&&$$X:          ..::...  .        ..:;:. .:.... ..: . ..                                   x$$$$$$$$X
X$$$$$$$XXXxX$$&&&&$$X.         ......  .            .:. ..  .   ... .                                      ;$$$$$$$$X
X&&$$$$$XXXXX$$$$&$$$+..        ....  .                           ..                                        :X$$$$XX$X
X&&&$$$$$$$XX$$$$$$$$;           ...  .                                                                      X$$$$$$$X
$&&&$$$$$$$$$$&&&$$$X:..         .. ..                       :.                                              +$$$$$$$X
$&&&&$$$$$$$$$&&&&$$x           .:.. .             .....   ...   ...       ..                                +X$$$$$$X
$&&&&&&$$$$$$$$$$$$$+..         :....            .....:. .:::.  .. .     ...                                 ;X$$$$$$X\`;

    const LIGHT_ART = \`:...............................::::::::::::::::::::::::::::::::::::::::...........................:
:..............................:::::::::::::::::::::::::::::::::::::::::::::.......................:
:......::::::..::...::::::::::::::::::::::::::...:::::::::::::::::::::::::::.......................:
:.................:::::::::::::::::::::::::.................::::::::::::::.........................:
:...................::::::::::::::::::::::.......................:::::::...........................:
:........................:::::::::::::::::::::::::.................................................:
:..........................::::::::::::::::::::::::................................................:
:............................:::::::::::::::::::::::..:::..........................................:
:......::::::.................::::::::::::::::;++XXXXx+++;:........................................:
:......:::::::::..:::.......:::::::::.....:;+xX$$$$$$$$$XXx;::.....................................:
::::.::::::::::::::::::::::::::::.......:+XX$$$&&&&&&&&&&$$$Xxx+;...............................:::;
::::::::::::::::::::::::::::::::.......:X$$&&&&&&&&&&&&&&&$$$$$X+...........................:;;;;+xx
::::::::::::::::::::::::::::::::......;$$&&&&$XXXxXX$$$$$$$&$$$$$;.........................::;++xxxx
:::::::::::::::::::::::::::::::::.....+$&$x+;;;;;;;;;;+++xxX$$$&&;...........................:;xxXxx
:::::::::::::::::::::::::::::::::....:X$x;;;;:::;;;;;;;;+++xX$&&&x..::.......................::;+;+x
::::::::::::::::::::::::::::::::.....+$x;:;:;;;;;;;;;;;;++++xX&&&+...::::......................::;+x
::::::::::::::::::::::::::::::::::..:xX+;;;:::::;:;;;;;;++++xX&&&:..............................:;+x
:::::::::::::::::::::::::::::::::::::xX+;;;;++;;;;;+++++++++xX$&&+...................:::.........:;+
:::::::::::::::::::::::::::::::::::::+X++XX$$$XXxxX$$$$$$XXxxx$&&;.................::::::........::;
:::::::::::::::::::::::::::::::::::::+xX$$$&&&&$xx$&&&&&$&&$XX$&xx+...........::::::;;;:...........:
;:::::::::::::::::::::::::::::::::::;+;XxX$&&&$X;;X&&&&&&$$XxxXXxxx;::........:::;;;++;::::::....::;
;;:::::::::::::::::::::::::::::::::::+;+XXXXXXX;:;+X$$$$$$X++xX$Xx+::::::;;::::;++++++;;;;;;:::::.:;
+;;;;::::::::::::::::::::::::::::::::++;;;++xx+++xXxxXxxxxxxxx$$xx;:;;::;;++++++++++++++++++;;;::.:;
+;;;;;;::::::::::::::::::::::::::::::;x+;;;;;+xX$$$Xx+;++xxxx$$$++;;;;;;;++++++++++xxxxxxxxx+++;:::;
;;;;;;;;;;;;;;;:::::;;;+;;;;;;:::::::x$Xx+;+XXxxxxxXX$Xx+xXX$&&$X++++++++xx++++++++xx+xxxx+++x++++++
+;;;;;;;;;+++++;:::;+xx++++++++;;::::x&&$x++XX+;++++xX$XXX$$&&&$x++++++++++++xxXXXx+++++++xxxxxx+++x
XxxxxXXXXXXXxxxx+;;+xxxx++xxxxxx++;;;X&&$$XXXx+xX$$Xxx$$$&&&&&&$X+++++++++xxxxxXX$Xxxxx+++xxxxxx+++x
x++++xxxxXXXXXXx++xxxXxx++xxxxxx+++++x$$$&$$$XxxxxxXX$$$&&&&&&&$+++x++++xxxxxxxXX$XXXXXx++xxxxxxxx+x
x++;++++++xxXXxx+++xxxxx++xxxXXxx++++xX$&&$$$&$$$$$$&&&&&&&&&&&x+++++++xxxxxxXXXX$XXXXXXxxxx+xxxxxxx
+;;;;;+++;+++++;+++++++++++xxxxx++++++x$$$$$$&&&&&&&&&&&&&&&&&&$xxxx+++xxxx+xxXXX$XXXXXXxXxxxXXXxxxx
x+++++++++++++;;;;;;+++xx+++++;;;;;;;+x$$$$$&&&&&&&&&&&&&&&&&&&$$X+++xxXXXxxXXXxXXXXXXxxxX$XXXXXXXXX
xx++xxxxxxxxx+++++++++xxx+++++;;;;;;;+x$$$$&&&&&&&&&&&&&&&&&&&$$$$x+xxX$$XxxX$$XXXXXXxxxxxxXXXXxXXXX
x+xxxx++xxxxx+++++++++xXxx+++++++xxxxXX$$$&&&&&&&&&&&&&&&&&&&&&$$$$$XXXXXxxxXX$XXXXXxxxxxxxXXxxxXXXX
x++++++++xx++;;;;;;;;;++++++xxXXXXXXXXXXX&&&&&&&&&&&&&&&&&&&&&&$$$$$$$XXXXXXXXXxxXXXXxxXXXXxx++xxXXX
xxxxxxxxxxXx+;;;;++x++;;;+xxXXXX$XXXXXXXX$$$&&&&&&&&&&&&&&&&&&$$$$$$$$$$$$XXXXXXXXxxxxxXXXXx++++xxxx
;::;;::;+xx;:::::;+x+;;;xXXX$$X$XXXXXXXXXX$$$$&&&&&$&&&&&&&&&&&$$$$$$X$$$$XX$$$$$XXxxxxxXXXxxxxxxxxx
;:::;:.:+x+::...:;+x+;:xXX$$$$X$XXXXXXXXXX$$$&$$xX$$&&&&&&&&&$$$$$$$$$$$$$$$$$$$$$$$Xxxxxxxxxxxxxxxx
+;;;+;;+xXx;:::::;+xx+xX$$$$$X$$XXXXXXXXXXXX$$$&xxXX&&&&&&$$$$$$$$$$$$$$$$$$$$$$$$$$$Xxxxxxxxxxxx+++
+;;++;;+xXx;;::::;;+++XX$X$$$XX$XXXXXXXXXXX$X$$$$x$$$$&$$$$$$$$$$$$$$$$$X$$X&$$$$$$$$$$x++++++;;;;;;
+;;++;::+x+:::::::;+;+$X$$$$XXX$XXXXXXXXXXXX$$X$$&&&&&$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$X+;;;;;;;;;;+
xx+xx+;+xX+;;;;::;+x+x$$&$$$$$XXXXXXXXXXXXXXX$$$X$$$$$$$$$$$$$X$$$$$$$$X$$$$$$$$$$&&$$$$x;;;++++++++
+;;;;;;+XX+;;;;;;;+xx$$&&$$$$$XXXXXXXXXXXXXXXX$$$$$XX$$$$$$$X$$XX$$$$$X$$$$$$$$$$&&&$$$$X;;;;;;;;;;+
x;;+;;;+XX+;:::::;++x$$$&$$$$$XXXXXXXXXXXXXX$$XXX$X$$$$$$$$$XXX$$$X$$$XX$$X$&$$$$&&&$$$$$+;;;;;;;;;;
+;;;;;;+xx+::::::;++X$$$$$$$XXXXXXXXXXXXXXXX$$XX$$$$$$X$$$XX$$$$$$$$$$$$$$$$$$&$$&&&$$$$$X::::::;;;;
+;;;;:;+xx+::::::;;+X$$$$$$X$XXXXXXXXXXXXX$$$$$$$$$$$$$$$XX$$$$$$$X$$$X$$$$$&&&$$&&&$$$$$$;:;:::;;;;
+:;;;::;xX+;:::::;;x$$$$$$$XXXXXXXXXXXXXX$$$$$$$$$$XX$$$$XXX$$$$$$$$$$$$$$$&&&&&$&&$$$$$$$X;;;;;;;;+
;::;;::;xx+::::::;+X$$$$$XXXXXXXXXXXX$$$$$$$$$$$$$X$$$X$$X$$$X$$$X$$$$$$$$$&&&$$&&&$$$$$$$$;;;;;;;;;
;::;;::;xx+::::::;+X$$$&&XXXXXXX$$$$$$$$$$$$$XX$$$$$$$$$XXXX$$$$$$$$$$$$$$$$&&&$&$&$$$$$$$$x;;;;;;;;
;::;;::;+x+;:::::;+X$$$&&$$$XXX$$$$$$$$$$$$$$XxX$XXXX$$$XX$$$$$$$$$$$$$$$$&&&&&$&&&$$$$$$$$X;;;;;;;;
;::;;::;;++;::::::x$$$$&&&$$X$X$$$X$$$$$$$$$$XX$$$$$$$$$$$$$$$$$$$$$$$$$$$$&&&&&&&&$$$$$$$$X+;;;;;;;
;::::::;;;;;:::::;X$$$$&&&&$XX$$$$$$$$$$$$$$$&$$$$$$$$$$$$$$$$$$$$$$$$$$$&&&&&&&$&&$$$$$$$$$+;;;;;;;
;::::::;;;;::::::+X$$$$&&&&$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$&$$$&&&&$&&&$$$$$$$$$x;;;;;;;
;::::::;:;;::::::+$$$$$$&&$$X$X$$$$$$$$$$$$$XX$$$$$X$$$$X$$$$$$$$$$$$$$$$$$&&&&&&&$$$$$$$$$$X;;;;;;;
:::::::;;;;:::::;x$$$$$$&&&X$$$$$$$$$$$$$$$$$XX$$XXX$$$$$$$$$$$$$$$$$$$$$$&&&&&&$&$$$$$$$$$$X+;;;;;+\`;

    const cnv = document.getElementById("ascii-smoke-canvas");
    if (!cnv) return;
    const ctx = cnv.getContext("2d");

    function isDark() {
      const theme = document.documentElement.getAttribute('data-theme');
      // Cyberpunk and Nord have dark backgrounds
      if (theme === 'cyberpunk' || theme === 'nord') return true;
      // Brutal is always light
      if (theme === 'brutal') return false;
      // Sass/default: use the dark class
      return document.documentElement.classList.contains('dark');
    }

    function buildParticles(art) {
      const lines = art.split("\\n");
      const rows = lines.length;
      const cols = Math.max(...lines.map((l) => l.length));
      const CELL_W = 3.6;
      const CELL_H = 7;
      const particles = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < lines[r].length; c++) {
          const ch = lines[r][c];
          if (ch === " ") continue;
          particles.push({
            ch,
            homeX: c * CELL_W,
            homeY: r * CELL_H,
            x: c * CELL_W,
            y: r * CELL_H,
            vx: 0,
            vy: 0,
            opacity: 1,
            homeOpacity: 1,
          });
        }
      }

      const artW = cols * CELL_W;
      const artH = rows * CELL_H;
      const cx = artW / 2;
      const cy = artH / 2;

      for (const p of particles) {
        const dx = (p.homeX - cx) / (artW * 0.48);
        const dy = (p.homeY - cy) / (artH * 0.48);
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        const noiseVal = pseudoNoise(angle * 3, dist * 5) * 0.3;
        const edgeThreshold = 0.7 + noiseVal;

        if (dist > edgeThreshold) {
          const fade = 1 - (dist - edgeThreshold) / (0.4 + noiseVal * 0.2);
          p.homeOpacity = Math.max(0, Math.min(1, fade));
          p.opacity = p.homeOpacity;
        }
      }

      return {
        visible: particles.filter((p) => p.homeOpacity > 0.01),
        artW,
        artH,
        CELL_H,
      };
    }

    function pseudoNoise(x, y) {
      const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      return n - Math.floor(n);
    }

    let currentTheme = isDark() ? "dark" : "light";
    let data = buildParticles(currentTheme === "dark" ? DARK_ART : LIGHT_ART);

    let width, height, offsetX, offsetY, scale, dpr;
    let mouseX = -9999, mouseY = -9999;
    let isVisible = false;
    let isHovering = false;
    let animating = false;

    const observerOptions = { threshold: 0.1 };
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible) startAnim();
      });
    }, observerOptions);
    io.observe(cnv);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function draw() {
      if (!isVisible && !isHovering) {
        animating = false;
        return;
      }

      const nowTheme = isDark() ? "dark" : "light";
      if (nowTheme !== currentTheme) {
        currentTheme = nowTheme;
        data = buildParticles(currentTheme === "dark" ? DARK_ART : LIGHT_ART);
        resize();
        updateCachedColors();
      }

      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);

      ctx.font = \`\${data.CELL_H * 0.95}px "JetBrains Mono", monospace\`;
      ctx.textBaseline = "top";

      const baseRadius = 90;
      const pushStrength = 22;
      const frameTime = performance.now() * 0.001;

      let localMX, localMY;
      if (isHovering) {
        localMX = (mouseX - offsetX) / scale;
        localMY = (mouseY - offsetY) / scale;
      }

      let needsNextFrame = isHovering || !prefersReducedMotion;

      for (const p of data.visible) {
        if (isHovering) {
          const ddx = p.x - localMX;
          const ddy = p.y - localMY;
          const dist = Math.sqrt(ddx * ddx + ddy * ddy);

          const n = pseudoNoise(
            p.homeX * 0.07 + frameTime * 0.4,
            p.homeY * 0.07,
          );
          const smokeRadius = baseRadius * (0.55 + n * 0.9);

          if (dist < smokeRadius && dist > 0) {
            const force = (1 - dist / smokeRadius) * pushStrength;
            const angle = Math.atan2(ddy, ddx);
            const jitter =
              0.7 +
              pseudoNoise(p.homeX * 0.13, p.homeY * 0.13 + frameTime) * 0.6;
            p.vx += Math.cos(angle) * force * 0.3 * jitter;
            p.vy += (Math.sin(angle) * force - force * 0.12) * 0.3 * jitter;
          }
        }

        const springK = isHovering ? 0.02 : 0.06;
        p.vx += (p.homeX - p.x) * springK;
        p.vy += (p.homeY - p.y) * springK;
        p.vx *= 0.88;
        p.vy *= 0.88;
        p.x += p.vx;
        p.y += p.vy;

        const dispDist = Math.sqrt((p.x - p.homeX) ** 2 + (p.y - p.homeY) ** 2);
        const dispFade = Math.max(0.08, 1 - dispDist / 80);
        p.opacity += (p.homeOpacity * dispFade - p.opacity) * 0.1;

        if (
          Math.abs(p.vx) > 0.01 ||
          Math.abs(p.vy) > 0.01 ||
          Math.abs(p.opacity - p.homeOpacity * dispFade) > 0.005
        ) {
          needsNextFrame = true;
        }

        let color = cachedMutedColor;
        if (isHovering) {
          const md = Math.sqrt((p.x - localMX) ** 2 + (p.y - localMY) ** 2);
          const colorNoise = pseudoNoise(
            p.homeX * 0.09 + frameTime * 0.3,
            p.homeY * 0.09,
          );
          const colorRadius = baseRadius * (0.8 + colorNoise * 1.2);
          if (md < colorRadius) {
            color = cachedAccentColor;
          }
        }

        let alpha = p.opacity;
        if (!isHovering && !prefersReducedMotion) {
          const nx = p.homeX / data.artW;
          const wavePhase = nx * Math.PI * 2.5 - frameTime * 2.0;
          const wave = Math.sin(wavePhase);
          const crest = (wave * 0.5) + 0.5;
          alpha *= 0.75 + crest * 0.25;
          needsNextFrame = true; 
        }

        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.fillStyle = color;
        ctx.fillText(p.ch, p.x, p.y);
      }

      ctx.restore();

      if (needsNextFrame && (isVisible || isHovering)) {
        animating = true;
        requestAnimationFrame(draw);
      } else {
        animating = false;
      }
    }

    function startAnim() {
      if (!animating && (isVisible || isHovering)) {
        animating = true;
        requestAnimationFrame(draw);
      }
    }

    resize();
    updateCachedColors();
    startAnim();

    // Watch for theme toggles
    const themeObserver = new MutationObserver(() => {
      updateCachedColors();
      startAnim();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    window.addEventListener("resize", () => {
      resize();
      startAnim();
    });

    const avatar = cnv.closest(".ascii-avatar");
    avatar.addEventListener("mouseenter", () => {
      isHovering = true;
      startAnim();
    });
    avatar.addEventListener("mousemove", (e) => {
      const rect = cnv.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      startAnim();
    });
    avatar.addEventListener("mouseleave", () => {
      isHovering = false;
      mouseX = -9999;
      mouseY = -9999;
      startAnim();
    });

    avatar.addEventListener(
      "touchstart",
      (e) => {
        isHovering = true;
        const rect = cnv.getBoundingClientRect();
        mouseX = e.touches[0].clientX - rect.left;
        mouseY = e.touches[0].clientY - rect.top;
        startAnim();
      },
      { passive: true },
    );
    avatar.addEventListener(
      "touchmove",
      (e) => {
        const rect = cnv.getBoundingClientRect();
        mouseX = e.touches[0].clientX - rect.left;
        mouseY = e.touches[0].clientY - rect.top;
        startAnim();
      },
      { passive: true },
    );
    avatar.addEventListener("touchend", () => {
      isHovering = false;
      mouseX = -9999;
      mouseY = -9999;
      startAnim();
    });
  })();
<\/script>`], ["", `<div class="ascii-avatar" aria-hidden="true" data-astro-cid-unq6fp4j> <canvas id="ascii-smoke-canvas" data-astro-cid-unq6fp4j></canvas> <div class="ascii-glow" data-astro-cid-unq6fp4j></div> </div>  <script>
  (function () {
    const DARK_ART = \\\`$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$&&X++x$&&$$$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$++:::::..:+x+X&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&x::             .:+X$$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&X;:.                  .:;;++$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$$$
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&+.                      ...:+$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$$$$X++;
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$;           .                 ;$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$x++++;;;
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&x     :;;++xxx++++;;::::       .X&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$X+;;;;;
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&;   ;xXXXXXXXXXXXXXXxxx+;:      X&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&X+;;++;
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&X: ;XX$$$$$$$$XXXXXXXXxxx+;:     +&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$XXXX;
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&+.;X$$$X$$$$$$$XXXXXXxxx+++;:    X&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$Xx;
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&:.+X$X$$$$$$X$$$XXXXXxxx+++;:   .&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$Xx;
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$::+X$$$$XXXXXXXXXXXXXXXX+++;:    $&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$X+
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$::XX+;:.  :;;++;:. .::::;;++;    X&&&&&&&&&&&&&&&&&&&&&&&&$&&&&&&&&&&&&&$X
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&+:::.       .             :::.  .$&&&&&&&&&&&&&&&&&&&&&$$$$&&&&&&&&&&&&&&$
$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&x+;::        .Xx           .::. .::+$&&&&&&&&&&&&&&&&&$$XXX$&&&&&&&&&&&&&&$
X&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$xxX::::      x$X:          ;;;;.:;;;X&&&&&&&&&&&&&$$$$XXXxX$&&$$$$&&&&&&&&X
X$$$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&X+X+:::.....+$$X+:       .;++;: .:;+$&$$$$$$$$$$$$XXxxXXxxXXXXXXX$&&&&&&&&X
xXXX$$$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$+xXX++++;:xxXx++x+ ::::;;+++;. :;+X&$$$$$$XXxxxXXxx++xxxxxxxxXxxXX$$$&&&&X
xXXXXXX$$$&&&&&&&&&&&&&&&&&&$$&&&&&&&&&&&&&$+;xXXXXXxx;::.  :.;xXx+++;+;:  :+xX$X$$$$$XXXXx+++xxx++++++++++++xXX$$&&$X
xXXXXXXXXXXX$$$$$$&&&&&&&$$XX$$$$&&&&&&&&&&$;:;xxxXX;;;;::::::::;x+;;;:.   :;+xXXXXXXxx+xxxxxXXXx++;++;;;;+++++xXXXXXX
xX$$XXXXXXXXXXXxxX$&&$$XXxxxxXXXXXXX$$&&&&&X:  :+xX;: .:;;;;:   .:+;:.      ;++++xxxx+++++x++++++++++++++++++;;++xxxx+
++xxxxxxxxxx++++++X$$$Xx+++++x++++++xXX$$$$X.   .;++:;x++;;;;;;:..::        ;xx++xxxxx+++++;;;:::;+++++xx++;;;;;++++++
:;++;;:::::::::;;;+xXXx+;;;;++++;;;;+++xXX$+     .:::;++;: .:;;:           .;Xxx++++xx+++;;;;;:.:;++;;++xx+;;;;;++x++;
;+++++;;;;;::::::;;+++;;;;;;+++;;;;;;++xxxXx;        ::+++;;;:.            :XXx+++xx++;;;;;;;;::.:::::;+xx+++++;;;++++
;++xxx++;+++;:::;;+++++;;;;;+++;;;;;;;++x+++;.         ...                .+XXx++++++;;;;;;;:::...:::::;++;;++++;;;+++
+XXXXXxx+xXX++;+++xxxx+++++++x++;;;;;;++x+xx+:                             ;x++++++++;;;+++;:::..::::::;;;;+++;;;;;;;+
xXXXXXXxxxXXx+xxXXXXXXXxxx+;++++++++++xXXXXXX;.                            .;;++xx++;;;+++;;;;;:::::::;;;::;;;:::;;;;;
;+xxx++++++++++xxXXXXXXXx++;;+++++xXXXXXXXXXx;.                              ;xXx+;::::;;;:::;;::::::;++;:::::::;;::::
;++++;;;++;;;;;+++++++++++;:;;++++xxXXXXXXXXx;.                              .:++;::..:;;;:..:::;;::;+++++;::::;;;:.::
;+++;;++++;;;;++++++++++++;::;+++++xx++;;;;:::.                                ..:::::;++;:..:::;;;;;+++;;;;::;++;::::
+++++++x++++++xXXXXXXXXXXx++++xx+++;:::::::::::.                               .......::::::::;;::;;;;;:::;;;++++;::;:
;++;;;++++;;;;+XXXXXXxxxxXXXXXx+;;::....:.::::::                                  .... .::::::::;;;;++;::::;+xx+++;;;;
+XXXx+xXx+;::+XX$$$XX+;;+xX$X+;:::.. ....::::::::                                     .:........:;++++;;::;;;++++++;;;
X&&&$$&&$X;;x$&&&&&&$x++XX$X+:::.  .. ..:::::::::. .                          .    .. ....    ....:;++;;;;;;;;;;;++++;
X&&&$$&&$X;;+$&&&&&&$x++x$X+:..    . .::.:::::::::. .   +x.::              .         ..  ..      ...;;;;;;;;;;;;;;;;+;
+X$XxxXXx+::+x$$&&&&$x+;+x;:.     .: ...:::::::::....    +;.:                .  ....  .     .   .  ..;;;;;;+++++++++xx
+XXx+xXXx+;:+xX$$&$$$XxxX+::...   .:..::::::::::::....    +               .   ....   .  .             ;+++xxxxXXXXX$$X
+$$XxX$$$X+;X$$&&&&&$$XXX+ ..    .:. .:::::::::::::....                    .. ....                     ;XXXXXXXXXXXXXX
;+x+++X$$x;;X$$$$$&&$Xx+x;      .....:::::::::::::::..  ::      .   ..   ...... ..  .                   +XXXXXXXXXxxx+
;+x+++XXx;::+XXXXX$$Xx+;;:     ..  .::::::::::::::::...     ...   .    ......  ..  ..                   ;XXXXXXXXXXxx+
+X$XXXXXx;:;+XX$$$$XXx++;        ....::::::::::::::.............    .  .....   .  ...                   :X$$$$$$XXXXXx
+X$XxX$Xx;:;x$$$$$$$XX++;.      ...::::::::::::::::..........   ...  .....   ...  ...  .                 +$$$$$$$$$$$X
+X$XXX$$X+;;x$&&&&&&$Xx+:     ...:.::::::::::::::.... ....    ....  .....   .    ..                      :X$$$$$$$$$$X
+$$XXX$$X+;;x$&&&&&&$Xx+:      ...::::::::.:........    .    ....  ::....  .........                      x$$$$$$$$$$X
x$$XXX$$X+:;x$$&&&&$$Xx; .     .:..::::::..:........ .. .   ... . ........                                ;X$$$$$$$$$X
x$$$XX$$X+;;x$&&&&&&$X+:.     .:::::::::..........     .  .........::...   .                               X$$$$$$$$XX
X$&$XX$$X+;;x$&&&&&&$X;.      ::;;;::::..........  .    . ..   .. .......   ..                             ;$$$$$$$$$X
X$$$XX$$Xx;;x$&&&&&$$X;       :::::::.........       :;:.    ...  .....   .                                .X$$$$$$$$X
X$$$XX$$Xx++x$$&&&&$$X:          ..::...  .        ..:;:. .:.... ..: . ..                                   x$$$$$$$$X
X$$$$$$$XXXxX$$&&&&$$X.         ......  .            .:. ..  .   ... .                                      ;$$$$$$$$X
X&&$$$$$XXXXX$$$$&$$$+..        ....  .                           ..                                        :X$$$$XX$X
X&&&$$$$$$$XX$$$$$$$$;           ...  .                                                                      X$$$$$$$X
$&&&$$$$$$$$$$&&&$$$X:..         .. ..                       :.                                              +$$$$$$$X
$&&&&$$$$$$$$$&&&&$$x           .:.. .             .....   ...   ...       ..                                +X$$$$$$X
$&&&&&&$$$$$$$$$$$$$+..         :....            .....:. .:::.  .. .     ...                                 ;X$$$$$$X\\\`;

    const LIGHT_ART = \\\`:...............................::::::::::::::::::::::::::::::::::::::::...........................:
:..............................:::::::::::::::::::::::::::::::::::::::::::::.......................:
:......::::::..::...::::::::::::::::::::::::::...:::::::::::::::::::::::::::.......................:
:.................:::::::::::::::::::::::::.................::::::::::::::.........................:
:...................::::::::::::::::::::::.......................:::::::...........................:
:........................:::::::::::::::::::::::::.................................................:
:..........................::::::::::::::::::::::::................................................:
:............................:::::::::::::::::::::::..:::..........................................:
:......::::::.................::::::::::::::::;++XXXXx+++;:........................................:
:......:::::::::..:::.......:::::::::.....:;+xX$$$$$$$$$XXx;::.....................................:
::::.::::::::::::::::::::::::::::.......:+XX$$$&&&&&&&&&&$$$Xxx+;...............................:::;
::::::::::::::::::::::::::::::::.......:X$$&&&&&&&&&&&&&&&$$$$$X+...........................:;;;;+xx
::::::::::::::::::::::::::::::::......;$$&&&&$XXXxXX$$$$$$$&$$$$$;.........................::;++xxxx
:::::::::::::::::::::::::::::::::.....+$&$x+;;;;;;;;;;+++xxX$$$&&;...........................:;xxXxx
:::::::::::::::::::::::::::::::::....:X$x;;;;:::;;;;;;;;+++xX$&&&x..::.......................::;+;+x
::::::::::::::::::::::::::::::::.....+$x;:;:;;;;;;;;;;;;++++xX&&&+...::::......................::;+x
::::::::::::::::::::::::::::::::::..:xX+;;;:::::;:;;;;;;++++xX&&&:..............................:;+x
:::::::::::::::::::::::::::::::::::::xX+;;;;++;;;;;+++++++++xX$&&+...................:::.........:;+
:::::::::::::::::::::::::::::::::::::+X++XX$$$XXxxX$$$$$$XXxxx$&&;.................::::::........::;
:::::::::::::::::::::::::::::::::::::+xX$$$&&&&$xx$&&&&&$&&$XX$&xx+...........::::::;;;:...........:
;:::::::::::::::::::::::::::::::::::;+;XxX$&&&$X;;X&&&&&&$$XxxXXxxx;::........:::;;;++;::::::....::;
;;:::::::::::::::::::::::::::::::::::+;+XXXXXXX;:;+X$$$$$$X++xX$Xx+::::::;;::::;++++++;;;;;;:::::.:;
+;;;;::::::::::::::::::::::::::::::::++;;;++xx+++xXxxXxxxxxxxx$$xx;:;;::;;++++++++++++++++++;;;::.:;
+;;;;;;::::::::::::::::::::::::::::::;x+;;;;;+xX$$$Xx+;++xxxx$$$++;;;;;;;++++++++++xxxxxxxxx+++;:::;
;;;;;;;;;;;;;;;:::::;;;+;;;;;;:::::::x$Xx+;+XXxxxxxXX$Xx+xXX$&&$X++++++++xx++++++++xx+xxxx+++x++++++
+;;;;;;;;;+++++;:::;+xx++++++++;;::::x&&$x++XX+;++++xX$XXX$$&&&$x++++++++++++xxXXXx+++++++xxxxxx+++x
XxxxxXXXXXXXxxxx+;;+xxxx++xxxxxx++;;;X&&$$XXXx+xX$$Xxx$$$&&&&&&$X+++++++++xxxxxXX$Xxxxx+++xxxxxx+++x
x++++xxxxXXXXXXx++xxxXxx++xxxxxx+++++x$$$&$$$XxxxxxXX$$$&&&&&&&$+++x++++xxxxxxxXX$XXXXXx++xxxxxxxx+x
x++;++++++xxXXxx+++xxxxx++xxxXXxx++++xX$&&$$$&$$$$$$&&&&&&&&&&&x+++++++xxxxxxXXXX$XXXXXXxxxx+xxxxxxx
+;;;;;+++;+++++;+++++++++++xxxxx++++++x$$$$$$&&&&&&&&&&&&&&&&&&$xxxx+++xxxx+xxXXX$XXXXXXxXxxxXXXxxxx
x+++++++++++++;;;;;;+++xx+++++;;;;;;;+x$$$$$&&&&&&&&&&&&&&&&&&&$$X+++xxXXXxxXXXxXXXXXXxxxX$XXXXXXXXX
xx++xxxxxxxxx+++++++++xxx+++++;;;;;;;+x$$$$&&&&&&&&&&&&&&&&&&&$$$$x+xxX$$XxxX$$XXXXXXxxxxxxXXXXxXXXX
x+xxxx++xxxxx+++++++++xXxx+++++++xxxxXX$$$&&&&&&&&&&&&&&&&&&&&&$$$$$XXXXXxxxXX$XXXXXxxxxxxxXXxxxXXXX
x++++++++xx++;;;;;;;;;++++++xxXXXXXXXXXXX&&&&&&&&&&&&&&&&&&&&&&$$$$$$$XXXXXXXXXxxXXXXxxXXXXxx++xxXXX
xxxxxxxxxxXx+;;;;++x++;;;+xxXXXX$XXXXXXXX$$$&&&&&&&&&&&&&&&&&&$$$$$$$$$$$$XXXXXXXXxxxxxXXXXx++++xxxx
;::;;::;+xx;:::::;+x+;;;xXXX$$X$XXXXXXXXXX$$$$&&&&&$&&&&&&&&&&&$$$$$$X$$$$XX$$$$$XXxxxxxXXXxxxxxxxxx
;:::;:.:+x+::...:;+x+;:xXX$$$$X$XXXXXXXXXX$$$&$$xX$$&&&&&&&&&$$$$$$$$$$$$$$$$$$$$$$$Xxxxxxxxxxxxxxxx
+;;;+;;+xXx;:::::;+xx+xX$$$$$X$$XXXXXXXXXXXX$$$&xxXX&&&&&&$$$$$$$$$$$$$$$$$$$$$$$$$$$Xxxxxxxxxxxx+++
+;;++;;+xXx;;::::;;+++XX$X$$$XX$XXXXXXXXXXX$X$$$$x$$$$&$$$$$$$$$$$$$$$$$X$$X&$$$$$$$$$$x++++++;;;;;;
+;;++;::+x+:::::::;+;+$X$$$$XXX$XXXXXXXXXXXX$$X$$&&&&&$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$X+;;;;;;;;;;+
xx+xx+;+xX+;;;;::;+x+x$$&$$$$$XXXXXXXXXXXXXXX$$$X$$$$$$$$$$$$$X$$$$$$$$X$$$$$$$$$$&&$$$$x;;;++++++++
+;;;;;;+XX+;;;;;;;+xx$$&&$$$$$XXXXXXXXXXXXXXXX$$$$$XX$$$$$$$X$$XX$$$$$X$$$$$$$$$$&&&$$$$X;;;;;;;;;;+
x;;+;;;+XX+;:::::;++x$$$&$$$$$XXXXXXXXXXXXXX$$XXX$X$$$$$$$$$XXX$$$X$$$XX$$X$&$$$$&&&$$$$$+;;;;;;;;;;
+;;;;;;+xx+::::::;++X$$$$$$$XXXXXXXXXXXXXXXX$$XX$$$$$$X$$$XX$$$$$$$$$$$$$$$$$$&$$&&&$$$$$X::::::;;;;
+;;;;:;+xx+::::::;;+X$$$$$$X$XXXXXXXXXXXXX$$$$$$$$$$$$$$$XX$$$$$$$X$$$X$$$$$&&&$$&&&$$$$$$;:;:::;;;;
+:;;;::;xX+;:::::;;x$$$$$$$XXXXXXXXXXXXXX$$$$$$$$$$XX$$$$XXX$$$$$$$$$$$$$$$&&&&&$&&$$$$$$$X;;;;;;;;+
;::;;::;xx+::::::;+X$$$$$XXXXXXXXXXXX$$$$$$$$$$$$$X$$$X$$X$$$X$$$X$$$$$$$$$&&&$$&&&$$$$$$$$;;;;;;;;;
;::;;::;xx+::::::;+X$$$&&XXXXXXX$$$$$$$$$$$$$XX$$$$$$$$$XXXX$$$$$$$$$$$$$$$$&&&$&$&$$$$$$$$x;;;;;;;;
;::;;::;+x+;:::::;+X$$$&&$$$XXX$$$$$$$$$$$$$$XxX$XXXX$$$XX$$$$$$$$$$$$$$$$&&&&&$&&&$$$$$$$$X;;;;;;;;
;::;;::;;++;::::::x$$$$&&&$$X$X$$$X$$$$$$$$$$XX$$$$$$$$$$$$$$$$$$$$$$$$$$$$&&&&&&&&$$$$$$$$X+;;;;;;;
;::::::;;;;;:::::;X$$$$&&&&$XX$$$$$$$$$$$$$$$&$$$$$$$$$$$$$$$$$$$$$$$$$$$&&&&&&&$&&$$$$$$$$$+;;;;;;;
;::::::;;;;::::::+X$$$$&&&&$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$&$$$&&&&$&&&$$$$$$$$$x;;;;;;;
;::::::;:;;::::::+$$$$$$&&$$X$X$$$$$$$$$$$$$XX$$$$$X$$$$X$$$$$$$$$$$$$$$$$$&&&&&&&$$$$$$$$$$X;;;;;;;
:::::::;;;;:::::;x$$$$$$&&&X$$$$$$$$$$$$$$$$$XX$$XXX$$$$$$$$$$$$$$$$$$$$$$&&&&&&$&$$$$$$$$$$X+;;;;;+\\\`;

    const cnv = document.getElementById("ascii-smoke-canvas");
    if (!cnv) return;
    const ctx = cnv.getContext("2d");

    function isDark() {
      const theme = document.documentElement.getAttribute('data-theme');
      // Cyberpunk and Nord have dark backgrounds
      if (theme === 'cyberpunk' || theme === 'nord') return true;
      // Brutal is always light
      if (theme === 'brutal') return false;
      // Sass/default: use the dark class
      return document.documentElement.classList.contains('dark');
    }

    function buildParticles(art) {
      const lines = art.split("\\\\n");
      const rows = lines.length;
      const cols = Math.max(...lines.map((l) => l.length));
      const CELL_W = 3.6;
      const CELL_H = 7;
      const particles = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < lines[r].length; c++) {
          const ch = lines[r][c];
          if (ch === " ") continue;
          particles.push({
            ch,
            homeX: c * CELL_W,
            homeY: r * CELL_H,
            x: c * CELL_W,
            y: r * CELL_H,
            vx: 0,
            vy: 0,
            opacity: 1,
            homeOpacity: 1,
          });
        }
      }

      const artW = cols * CELL_W;
      const artH = rows * CELL_H;
      const cx = artW / 2;
      const cy = artH / 2;

      for (const p of particles) {
        const dx = (p.homeX - cx) / (artW * 0.48);
        const dy = (p.homeY - cy) / (artH * 0.48);
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        const noiseVal = pseudoNoise(angle * 3, dist * 5) * 0.3;
        const edgeThreshold = 0.7 + noiseVal;

        if (dist > edgeThreshold) {
          const fade = 1 - (dist - edgeThreshold) / (0.4 + noiseVal * 0.2);
          p.homeOpacity = Math.max(0, Math.min(1, fade));
          p.opacity = p.homeOpacity;
        }
      }

      return {
        visible: particles.filter((p) => p.homeOpacity > 0.01),
        artW,
        artH,
        CELL_H,
      };
    }

    function pseudoNoise(x, y) {
      const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      return n - Math.floor(n);
    }

    let currentTheme = isDark() ? "dark" : "light";
    let data = buildParticles(currentTheme === "dark" ? DARK_ART : LIGHT_ART);

    let width, height, offsetX, offsetY, scale, dpr;
    let mouseX = -9999, mouseY = -9999;
    let isVisible = false;
    let isHovering = false;
    let animating = false;

    const observerOptions = { threshold: 0.1 };
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible) startAnim();
      });
    }, observerOptions);
    io.observe(cnv);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function draw() {
      if (!isVisible && !isHovering) {
        animating = false;
        return;
      }

      const nowTheme = isDark() ? "dark" : "light";
      if (nowTheme !== currentTheme) {
        currentTheme = nowTheme;
        data = buildParticles(currentTheme === "dark" ? DARK_ART : LIGHT_ART);
        resize();
        updateCachedColors();
      }

      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);

      ctx.font = \\\`\\\${data.CELL_H * 0.95}px "JetBrains Mono", monospace\\\`;
      ctx.textBaseline = "top";

      const baseRadius = 90;
      const pushStrength = 22;
      const frameTime = performance.now() * 0.001;

      let localMX, localMY;
      if (isHovering) {
        localMX = (mouseX - offsetX) / scale;
        localMY = (mouseY - offsetY) / scale;
      }

      let needsNextFrame = isHovering || !prefersReducedMotion;

      for (const p of data.visible) {
        if (isHovering) {
          const ddx = p.x - localMX;
          const ddy = p.y - localMY;
          const dist = Math.sqrt(ddx * ddx + ddy * ddy);

          const n = pseudoNoise(
            p.homeX * 0.07 + frameTime * 0.4,
            p.homeY * 0.07,
          );
          const smokeRadius = baseRadius * (0.55 + n * 0.9);

          if (dist < smokeRadius && dist > 0) {
            const force = (1 - dist / smokeRadius) * pushStrength;
            const angle = Math.atan2(ddy, ddx);
            const jitter =
              0.7 +
              pseudoNoise(p.homeX * 0.13, p.homeY * 0.13 + frameTime) * 0.6;
            p.vx += Math.cos(angle) * force * 0.3 * jitter;
            p.vy += (Math.sin(angle) * force - force * 0.12) * 0.3 * jitter;
          }
        }

        const springK = isHovering ? 0.02 : 0.06;
        p.vx += (p.homeX - p.x) * springK;
        p.vy += (p.homeY - p.y) * springK;
        p.vx *= 0.88;
        p.vy *= 0.88;
        p.x += p.vx;
        p.y += p.vy;

        const dispDist = Math.sqrt((p.x - p.homeX) ** 2 + (p.y - p.homeY) ** 2);
        const dispFade = Math.max(0.08, 1 - dispDist / 80);
        p.opacity += (p.homeOpacity * dispFade - p.opacity) * 0.1;

        if (
          Math.abs(p.vx) > 0.01 ||
          Math.abs(p.vy) > 0.01 ||
          Math.abs(p.opacity - p.homeOpacity * dispFade) > 0.005
        ) {
          needsNextFrame = true;
        }

        let color = cachedMutedColor;
        if (isHovering) {
          const md = Math.sqrt((p.x - localMX) ** 2 + (p.y - localMY) ** 2);
          const colorNoise = pseudoNoise(
            p.homeX * 0.09 + frameTime * 0.3,
            p.homeY * 0.09,
          );
          const colorRadius = baseRadius * (0.8 + colorNoise * 1.2);
          if (md < colorRadius) {
            color = cachedAccentColor;
          }
        }

        let alpha = p.opacity;
        if (!isHovering && !prefersReducedMotion) {
          const nx = p.homeX / data.artW;
          const wavePhase = nx * Math.PI * 2.5 - frameTime * 2.0;
          const wave = Math.sin(wavePhase);
          const crest = (wave * 0.5) + 0.5;
          alpha *= 0.75 + crest * 0.25;
          needsNextFrame = true; 
        }

        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.fillStyle = color;
        ctx.fillText(p.ch, p.x, p.y);
      }

      ctx.restore();

      if (needsNextFrame && (isVisible || isHovering)) {
        animating = true;
        requestAnimationFrame(draw);
      } else {
        animating = false;
      }
    }

    function startAnim() {
      if (!animating && (isVisible || isHovering)) {
        animating = true;
        requestAnimationFrame(draw);
      }
    }

    resize();
    updateCachedColors();
    startAnim();

    // Watch for theme toggles
    const themeObserver = new MutationObserver(() => {
      updateCachedColors();
      startAnim();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    window.addEventListener("resize", () => {
      resize();
      startAnim();
    });

    const avatar = cnv.closest(".ascii-avatar");
    avatar.addEventListener("mouseenter", () => {
      isHovering = true;
      startAnim();
    });
    avatar.addEventListener("mousemove", (e) => {
      const rect = cnv.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      startAnim();
    });
    avatar.addEventListener("mouseleave", () => {
      isHovering = false;
      mouseX = -9999;
      mouseY = -9999;
      startAnim();
    });

    avatar.addEventListener(
      "touchstart",
      (e) => {
        isHovering = true;
        const rect = cnv.getBoundingClientRect();
        mouseX = e.touches[0].clientX - rect.left;
        mouseY = e.touches[0].clientY - rect.top;
        startAnim();
      },
      { passive: true },
    );
    avatar.addEventListener(
      "touchmove",
      (e) => {
        const rect = cnv.getBoundingClientRect();
        mouseX = e.touches[0].clientX - rect.left;
        mouseY = e.touches[0].clientY - rect.top;
        startAnim();
      },
      { passive: true },
    );
    avatar.addEventListener("touchend", () => {
      isHovering = false;
      mouseX = -9999;
      mouseY = -9999;
      startAnim();
    });
  })();
<\/script>`])), maybeRenderHead());
}, "/Users/rabbi/Desktop/Projects/Sites/astro-portfolio/src/components/AsciiAvatar.astro", void 0);

const $$Hero = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section id="hero" class="hero-section min-h-[85svh] relative flex items-center overflow-hidden pt-20 pb-20" data-astro-cid-bbe6dxrz> <!-- Cursor-reactive light --> <div class="hero-cursor-light" aria-hidden="true" data-astro-cid-bbe6dxrz></div> <!-- Breathing glow --> <div class="hero-breathe" aria-hidden="true" data-astro-cid-bbe6dxrz></div> <!-- Diagonal grid - subtle --> <div class="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style="background-image:linear-gradient(var(--text-primary) 1px,transparent 1px),linear-gradient(90deg,var(--text-primary) 1px,transparent 1px);background-size:60px 60px;mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%);" aria-hidden="true" data-astro-cid-bbe6dxrz></div> <!-- Smooth merge fade at bottom --> <div class="absolute bottom-0 left-0 right-0 h-56 pointer-events-none z-20" style="background: linear-gradient(to bottom, transparent 0%, var(--bg-base) 100%);" data-astro-cid-bbe6dxrz></div> <div class="relative z-10 w-full max-w-6xl mx-auto px-6" data-astro-cid-bbe6dxrz> <div class="hero-grid" data-astro-cid-bbe6dxrz> <div class="max-w-2xl relative z-10" data-astro-cid-bbe6dxrz> <div class="badge-pill" data-astro-cid-bbe6dxrz> <span class="badge-dot" data-astro-cid-bbe6dxrz></span>
Available for freelance & collaboration
</div> <h1 class="mb-1" data-astro-cid-bbe6dxrz> <span class="block" data-astro-cid-bbe6dxrz>Hi, I'm</span> <span data-astro-cid-bbe6dxrz>Fazley Rabbi</span> </h1> <p class="hero-tagline font-serif italic" data-astro-cid-bbe6dxrz>
Building tools and systems that make software faster, cleaner, and
          more reliable.
</p> <p class="hero-body max-w-[550px] font-sans mt-4" data-astro-cid-bbe6dxrz>
With 4+ years of experience, I build scalable applications, client
          solutions, and commercial products. My
          work focuses on clean architecture, performance, and long-term
          maintainability. Currently developing SignalStack and Xentari to
          improve developer workflows and system stability.
</p> <div class="flex gap-3 flex-wrap mt-8" data-astro-cid-bbe6dxrz> <a href="/resume" class="btn-primary btn-magnetic" data-astro-cid-bbe6dxrz>Resume</a> <a href="#projects" class="btn-ghost" data-astro-cid-bbe6dxrz>View Projects</a> </div> <div class="connect-block mt-8" data-astro-cid-bbe6dxrz> <span class="section-label font-mono" style="margin-bottom:0.4rem;" data-astro-cid-bbe6dxrz>Connect</span> <div class="flex gap-5" data-astro-cid-bbe6dxrz> <a href="https://github.com/fazleyrabby" target="_blank" class="link-underline text-[var(--text-secondary)] text-[0.7rem] font-mono uppercase tracking-wider" data-astro-cid-bbe6dxrz>GitHub</a> <a href="https://www.linkedin.com/in/fazley-rabby/" target="_blank" class="link-underline text-[var(--text-secondary)] text-[0.7rem] font-mono uppercase tracking-wider" data-astro-cid-bbe6dxrz>LinkedIn</a> <a href="mailto:fazley111@gmail.com" class="link-underline text-[var(--text-secondary)] text-[0.7rem] font-mono uppercase tracking-wider" data-astro-cid-bbe6dxrz>Email</a> </div> </div> </div> <div class="hero-avatar-col" data-astro-cid-bbe6dxrz> ${renderComponent($$result, "AsciiAvatar", $$AsciiAvatar, { "data-astro-cid-bbe6dxrz": true })} </div> </div> </div> <!-- Scroll Down Indicator --> <div class="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 opacity-50 hidden md:block" data-astro-cid-bbe6dxrz> <div class="flex flex-col items-center gap-2" data-astro-cid-bbe6dxrz> <span class="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--text-muted)]" data-astro-cid-bbe6dxrz>Scroll</span> <div class="w-[1px] h-12 bg-gradient-to-b from-accent to-transparent" data-astro-cid-bbe6dxrz></div> </div> </div> </section> `;
}, "/Users/rabbi/Desktop/Projects/Sites/astro-portfolio/src/components/Hero.astro", void 0);

const $$ContactCTA = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section id="contact-cta" class="py-24 relative overflow-hidden" data-astro-cid-rcdzuq3a> <div class="absolute inset-0 z-0 opacity-10 pointer-events-none" data-astro-cid-rcdzuq3a> <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent rounded-full blur-[120px]" data-astro-cid-rcdzuq3a></div> </div> <div class="max-w-6xl mx-auto px-6 relative z-10 text-center" data-astro-cid-rcdzuq3a> <div class="inline-block mb-6" data-astro-cid-rcdzuq3a> <span class="section-label" data-astro-cid-rcdzuq3a>06 / Contact</span> </div> <h2 class="font-display text-[clamp(2.5rem,8vw,5rem)] leading-[1.05] mb-8 text-[var(--text-primary)]" data-astro-cid-rcdzuq3a>
Have a challenge for me?<br data-astro-cid-rcdzuq3a> <span class="italic text-[var(--accent)]" data-astro-cid-rcdzuq3a>Let's build it.</span> </h2> <p class="font-sans text-[var(--text-secondary)] text-lg max-w-xl mx-auto mb-12 opacity-90" data-astro-cid-rcdzuq3a>
Available for architectural consulting, backend leadership, and end-to-end product development. Currently accepting new collaborations for late 2026.
</p> <div class="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12" data-astro-cid-rcdzuq3a> <a href="mailto:fazley111@gmail.com" class="btn-primary flex items-center gap-2 group px-8 py-4 text-lg" data-astro-cid-rcdzuq3a>
Start a Conversation
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:translate-x-1" data-astro-cid-rcdzuq3a><path d="m22 2-7 20-4-9-9-4Z" data-astro-cid-rcdzuq3a></path><path d="M22 2 11 13" data-astro-cid-rcdzuq3a></path></svg> </a> <a href="/resume" class="btn-ghost px-8 py-4 text-lg" data-astro-cid-rcdzuq3a>Download Resume</a> </div> <div class="mt-20 pt-10 border-t border-border flex flex-wrap justify-center gap-x-12 gap-y-6" data-astro-cid-rcdzuq3a> <a href="https://github.com/fazleyrabby" target="_blank" class="font-mono text-[0.7rem] uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors" data-astro-cid-rcdzuq3a>GitHub</a> <a href="https://www.linkedin.com/in/fazley-rabby/" target="_blank" class="font-mono text-[0.7rem] uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors" data-astro-cid-rcdzuq3a>LinkedIn</a> </div> </div> </section> `;
}, "/Users/rabbi/Desktop/Projects/Sites/astro-portfolio/src/components/ContactCTA.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Fazley Rabbi \u2014 Laravel & Backend Engineer" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main> ${renderComponent($$result2, "Hero", $$Hero, {})} <div class="editorial-break"> <p class="editorial-phrase">
Building scalable systems,<br>not just interfaces.
</p> </div> ${renderComponent($$result2, "Projects", $$Projects, {})} ${renderComponent($$result2, "Skills", $$Skills, {})} ${renderComponent($$result2, "Experience", $$Experience, {})} <div class="editorial-break"> <p class="editorial-phrase">
Four years of real-world code.<br>Built to ship.
</p> </div> ${renderComponent($$result2, "LatestPosts", $$LatestPosts, {})} ${renderComponent($$result2, "ContactCTA", $$ContactCTA, {})} </main> ` })}`;
}, "/Users/rabbi/Desktop/Projects/Sites/astro-portfolio/src/pages/index.astro", void 0);

const $$file = "/Users/rabbi/Desktop/Projects/Sites/astro-portfolio/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
