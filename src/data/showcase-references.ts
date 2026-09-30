// Temporary visual references for public portfolio presentation.
// These images remain externally hosted and are not part of Meilin's portfolio work.
// Replace each entry when original project artwork is available.
export interface ShowcaseReference {
  image: string;
  source: string;
  search: string;
  width: number;
  height: number;
}

const pinterestSearch = (query: string) => `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`;

const references: Array<[string, string, number, number]> = [
  ['ac/3a/a5/ac3aa590afa7f87a21a278dd86f54e50.jpg', 'experimental typography poster', 1000, 1500],
  ['bf/1f/33/bf1f330a0c2bb74af5dcc0793cb6b600.jpg', 'visual identity system', 1000, 2000],
  ['6b/79/3a/6b793a8bd733102f44d8607939b72950.jpg', 'editorial layout design', 1600, 1000],
  ['a1/85/85/a1858533a9d76967d0c64bffce6a180c.jpg', 'modern editorial illustration', 1000, 1680],
  ['4a/a4/da/4aa4da5d03f387b9832da61fa68139d7.jpg', 'brand campaign photography', 1600, 1000],
  ['31/16/9d/31169d1923ce5a24c57b5109a3911513.jpg', 'independent graphic design studio', 1000, 1840],
  ['f2/1f/af/f21faffc99d73cbc2f6ab48a908f49ad.jpg', 'swiss typography poster', 1600, 1000],
  ['4c/63/9d/4c639dffd1405fae727d3ddfef37aa0b.jpg', 'digital art direction', 1600, 1000],
  ['76/29/d2/7629d2049d1739824458f4800af3bbbf.jpg', 'art direction campaign', 1550, 1000],
  ['70/90/c7/7090c76cfc0fcddd0eb8eb4cdc1b8a4c.jpg', 'contemporary poster design', 1600, 1000],
  ['32/57/ab/3257abb31d864bcf1059cc6bb425e2a9.jpg', 'creative coding visual', 1000, 1500],
  ['12/13/3d/12133d0892c1fbb5ae31318ebf3b79e0.jpg', 'art book graphic design', 1000, 1710],
  ['1e/48/7e/1e487e728f3e18436da11a4e06ff9238.jpg', 'experimental visual identity', 1000, 1500],
  ['4a/31/ad/4a31ad69b40d2b7ae50f1a2c50526cf4.jpg', 'brand identity editorial design', 1000, 1500],
  ['44/71/bb/4471bbd99c17fcf89d84724aa6a679f0.jpg', 'creative coding generative grid', 1200, 1200],
  ['d0/b6/ce/d0b6cef5df323426031cac046366c15c.jpg', 'experimental typography system', 1000, 1500],
  ['e6/6a/6b/e66a6bb789def3c71fccd93cfb017469--bad-design-cover-design.jpg', 'experimental graphic poster', 1000, 1500],
];

export const showcaseReferences: ShowcaseReference[] = references.map(([path, search, width, height]) => ({
  // Pinterest does not expose every original rendition to logged-out visitors.
  // Its 736px derivative is the stable public preview for still-image references.
  image: `https://i.pinimg.com/${path.endsWith('.gif') ? 'originals' : '736x'}/${path}`,
  source: pinterestSearch(search),
  search,
  width,
  height,
})).concat([
  { image: 'https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/89041c206471115.66cd51a94584d.png', source: 'https://www.behance.net/gallery/206471115/Made-in-Korea', search: 'brand identity editorial design', width: 1400, height: 933 },
  { image: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/c5ba59132495263.61a9fde5aacd0.jpg', source: 'https://www.behance.net/gallery/132495263/LESS-IS-MORE-20th-Anniversary-Edition', search: 'minimal visual identity editorial', width: 1200, height: 800 },
  { image: 'https://inspgr.id/app/uploads/2020/11/design-monotone-collection-16.jpg', source: 'https://theinspirationgrid.com/monotone-collection-by-sauman-wong/', search: 'monotone identity system', width: 1200, height: 800 },
  { image: 'https://assets-global.website-files.com/61fb01cb4eba03ac5359e396/61fc8d7d319ebd45fabe1105_Wearstler_7.jpg', source: 'https://www.drewfrist.com/project/kelly-wearstler', search: 'material brand art direction', width: 1600, height: 1067 },
  { image: 'https://mir-s3-cdn-cf.behance.net/project_modules/fs/e8149d108090847.5fb5f4ca75ca0.jpg', source: 'https://www.behance.net/gallery/108090847/Homey-Magazine-Brand-Identity', search: 'editorial identity layout', width: 1400, height: 933 },
  { image: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_632_webp/b3bef2208686533.66f2e1bfdbbba.png', source: 'https://www.behance.net/gallery/208686533/Paula-Scher-poster-monograph', search: 'experimental typography monograph', width: 632, height: 894 },
  { image: 'https://static.booktopia.com.au/internals/9781780671642-5.jpg', source: 'https://www.booktopia.com.au/editorial-design-cath-caldwell/book/9781780671642.html', search: 'editorial design art book', width: 1200, height: 800 },
  { image: 'https://mir-s3-cdn-cf.behance.net/project_modules/1400/0e3738150975477.6303facb44730.jpg', source: 'https://www.behance.net/gallery/150975477/Virgil-Ablohs-history', search: 'orange editorial typography', width: 1400, height: 933 },
  { image: 'https://images.squarespace-cdn.com/content/v1/671fd050ad87684faf3a63a1/d6c1d098-230f-4160-959a-af953264f6b3/unigrid_1.jpg', source: 'https://www.asenya.com/intuitive-evolution', search: 'visual identity system editorial', width: 1400, height: 933 },
  { image: 'https://cdn.dribbble.com/userupload/6932700/file/original-474fa5e3774f01d668642e52a9f6294e.png?resize=1600x1200', source: 'https://dribbble.com/shots/21434645-Editorial-Collage-Illustration', search: 'modern editorial collage illustration', width: 1600, height: 1200 },
  { image: 'https://www.timschmeer.de/fileadmin/_processed_/6/e/csm_2016_OHNE_WORTE_BOOK_008_3395a44416.jpg', source: 'https://www.timschmeer.de/', search: 'experimental geometric typography book', width: 1200, height: 800 },
  { image: 'https://design-milk.com/images/2023/06/Camille-Walala-Creative-Studio-Our-Department-16.jpg', source: 'https://design-milk.com/camille-walalas-vibrant-studio-where-happiness-joy-are-created/', search: 'independent design studio color system', width: 1400, height: 933 },
  { image: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200_webp/df7d3c214253447.6797dcc94e137.png', source: 'https://www.behance.net/gallery/214253447/Transcend-Illustrations', search: 'editorial illustration system', width: 1200, height: 900 },
  { image: 'https://thedrum-media.imgix.net/thedrum-user-assets-prod/s3/images/original/kampania-rekrutacyjna-red-dot-200427-asz1.jpeg?ar=default&auto=&crop=faces&fit=crop&w=1280', source: 'https://briefly.co/anchor/Design/story/adminds-employer-branding-campaign', search: 'illustrated brand campaign', width: 1280, height: 853 },
  { image: 'https://images.squarespace-cdn.com/content/v1/5e441b2fb746a7235f25667e/d4efa672-650d-45a3-b67c-87366e5301ab/MC%2B-%2BFond.png?format=2500w', source: 'https://www.motscles.net/', search: 'editorial communication identity', width: 1600, height: 1000 },
  { image: 'https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/74e12e234255273.68c006210341e.png', source: 'https://www.behance.net/gallery/234255273/Jobby-Brand-Communication', search: 'illustration brand communication', width: 1400, height: 933 },
  { image: 'https://mir-s3-cdn-cf.behance.net/project_modules/fs/21c829168245497.643703b7acced.png', source: 'https://www.behance.net/gallery/168245497/Coding-Art', search: 'generative coding waveform', width: 1400, height: 933 },
  { image: 'https://cdn.prod.website-files.com/5fc71849eca5b2f0ede06e46/66b5194258009545a790bd1a_freeProjects-thumbnail-min.png', source: 'https://www.redrivera.design/designers-sandbox', search: 'creative coding design experiments', width: 1400, height: 933 },
  { image: 'https://i.ytimg.com/vi/coS_lvjnD4w/maxresdefault.jpg', source: 'https://www.youtube.com/watch?v=coS_lvjnD4w', search: 'TouchDesigner generative visual system', width: 1280, height: 720 },
  { image: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_3840/672ca4188800093.65a15b3a084a4.jpg', source: 'https://www.behance.net/gallery/188800093/Identidade-Visual-Lab-Parole', search: 'editorial illustration visual identity', width: 1600, height: 1000 },
  { image: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_632_webp/e41f3b164621799.6430f6ef9e03e.jpg', source: 'https://www.behance.net/gallery/164621799/Historian-Mark-Solonin-Worldbuilding', search: 'illustration system print design', width: 632, height: 894 },
  { image: 'https://www.underconsideration.com/brandnew/archives/wunderkind_manifesto.jpg', source: 'https://www.underconsideration.com/brandnew/archives/new_logo_and_identity_for_wunderkind_by_multiadaptors.php', search: 'character illustration identity', width: 1200, height: 800 },
  { image: 'https://images.squarespace-cdn.com/content/v1/60c82729f12e8e02989d5008/1624981478116-UT5D0UHULX50Z8LUN0IS/Modern-Species-Good-Taste-Branding-Logo-Design-Bitter-Posters-Coasters.jpg', source: 'https://modernspecies.com/work/good-taste-brand-experiment', search: 'illustrated poster brand experiment', width: 1400, height: 933 },
  { image: 'https://cdn.mos.cms.futurecdn.net/YZL7FpQeWoyNB2M643GFp.jpg', source: 'https://www.creativebloq.com/inspiration/8-inspiring-uses-of-editorial-illustration', search: 'conceptual editorial illustration', width: 1200, height: 800 },
]);

const workSlots = new Map<string, number>();
const placementSlots = new Map<string, Map<string, number>>();

export function portfolioReference(workId: string, placement: string) {
  if (!workSlots.has(workId)) workSlots.set(workId, workSlots.size);
  if (!placementSlots.has(workId)) placementSlots.set(workId, new Map());
  const placements = placementSlots.get(workId)!;
  if (!placements.has(placement)) placements.set(placement, placements.size);
  const workSlot = workSlots.get(workId)!;
  const placementSlot = placements.get(placement)!;
  const coverPool = Math.min(12, showcaseReferences.length);
  if (placementSlot === 0) return showcaseReferences[workSlot % coverPool];
  const detailPool = showcaseReferences.length - coverPool;
  return showcaseReferences[coverPool + ((workSlot * 11 + placementSlot - 1) % detailPool)];
}
