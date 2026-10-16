import pages from '../data/pages.json';
import Blocks from '../components/Blocks';
import { PageHero, Seo, ContactSection } from '../components/ui';
import { UP } from '../data/site';

const DEFAULT_BG = `${UP}/2025/08/library-New-Career-Piont-lll-scaled.jpg`;
const isSmall = s => /-150x150|-300x\d+|\.svg$|icon/i.test(s);

/** Any WordPress page rendered through the smart block renderer. */
export default function Generic({ slug, crumbs, title: forcedTitle, prose, contact }) {
  const page = pages[slug];
  if (!page) return null;
  const blocks = [...page.blocks];
  // a leading banner image becomes the hero background
  let heroImg = null;
  if (blocks[0]?.t === 'img') heroImg = blocks.shift().v;
  heroImg = heroImg || blocks.find(b => b.t === 'img' && !isSmall(b.v))?.v || DEFAULT_BG;
  const firstH = blocks.findIndex(b => /^h[12]$/.test(b.t));
  const useHeading = firstH > -1 && firstH < 2 && blocks[firstH].v.length < 110;
  const title = forcedTitle || (useHeading ? blocks[firstH].v : page.title);
  const hasContact = blocks.some(b => b.t === 'contact');
  return (
    <>
      <Seo slug={slug} title={page.title} />
      <PageHero title={title} crumbs={crumbs} image={heroImg} />
      <Blocks blocks={blocks} skipFirstHeading={useHeading && firstH === 0} prose={prose} />
      {contact && !hasContact && <ContactSection />}
    </>
  );
}
