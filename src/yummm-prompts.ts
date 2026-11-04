// @ts-nocheck
// Curated creative prompts for the YUMMM coffee and bakery brand demo.
// Every prompt is fully independent and keeps the original YUMMM identity.
const identity = [
  'Act as a senior editorial advertising art director and product photographer.',
  'Use the attached YUMMM product or storefront photograph as the visual master.',
  'Maintain its cream ivory, rich terracotta red, warm brown and natural golden-light palette.',
  'Preserve the original chunky rounded YUMMM wordmark, spelled exactly YUMMM, every package shape, logo placement, packaging print details and real product proportions.',
  'Create one single finished 4:5 portrait Instagram advertisement at 2160 x 2700 px where possible, never a grid, template sheet or collage.',
  'Typography should be premium but playful: rounded bold sans for the YUMMM name, refined editorial serif for headline, small tracked sans for accents.',
  'Use exactly the English headline \"A LITTLE SOMETHING YUMMM.\" with the small supporting copy \"COFFEE · BAKERY · SWEETS\" where text is required. Never invent prices, store addresses, awards or health claims.',
  'Use believable light, tactile paper and pastry texture, generous negative space and commercial photography. No green emoji, generic stickers, neon gradients or decorative arrows.'
].join(' ');
const directions = [
  ['Asymmetric Editorial', 'An oversized real YUMMM product or box occupies the RIGHT ~55% of the canvas; stack the headline at upper LEFT (x 8%, y 19%), small supporting copy beneath (x 9%, y 42%). Maintain airy cream negative space and natural window light. Do not hide the YUMMM print.'],
  ['Monumental Center', 'Place a huge centered headline across 80–90% of the upper middle (y 16–39%). Put the hero product centered BELOW (y 43–103%) with a carefully intentional lower-edge crop, leaving the logo and product identifiable. Use tiny footer details only.'],
  ['Type Behind Product', 'Build the headline as a giant background typography layer, with the photorealistic package or coffee in the CENTER foreground, partly covering the headline but not the YUMMM logo. Place quiet supporting text near the lower outer margins.'],
  ['Side-Cropped Close-Up', 'Make one photorealistic hero product enter massively from the RIGHT and bottom edges, occupying ~68% of the image, with deliberate cinematic crop. Keep all editorial copy cleanly stacked LEFT (x 8% to 35%), high contrast and never crossing the packaging wordmark.'],
  ['Offset Negative Space', 'Put the product in LOWER RIGHT at ~45% canvas width and the headline in UPPER LEFT at x 9%, y 11%. Keep the middle exceptionally open, with tiny tasteful brand details only in outer corners. Avoid overcrowding.'],
  ['Diagonal Visual Flow', 'Put the product HIGH RIGHT occupying ~50% of the canvas and the headline LOW LEFT, forming a calm visual diagonal through natural placement, not rotated type. Support with a subtle top-left micro label. Preserve original product shape.'],
  ['Vertical Editorial Stack', 'Use a clear column structure: narrow headline block at TOP (y 8–25%); supporting copy around middle y 38–47%; product emerges majestically from the BOTTOM (y 55–103%). Give everything generous breathing room.'],
  ['Magazine Column Split', 'Make a clean unequal magazine split: a 33% LEFT column with headline and small supporting copy, and a 67% RIGHT photographic product field. Align every element to a shared grid and ensure the YUMMM logo is visible.']
];
export const YUMMM_PROMPTS = directions.map((item,index)=>({
  id:'yummm-master-'+String(index+1).padStart(2,'0'),
  title:item[0],
  group:'Master prompts · 8 compositions',
  text: identity+' Specific composition: '+item[1]
}));
const photoBase = 'Produce ONE standalone commercial photograph, not a poster or web screenshot. Premium photorealism, natural morning sunlight, tactile cream and deep terracotta red YUMMM coffee-and-bakery branding, correct rounded wordmark exactly YUMMM, realistic food textures, professional editorial photography. No extra text, captions, user-interface elements, synthetic looking props, stock-photo watermarks or green emojis. Preserve the supplied brand reference.';
export const YUMMM_PHOTO_PROMPTS = [
  {title:'Storefront / Hero',group:'Photo production',text:photoBase+' Create a wide 16:9 exterior of a welcoming contemporary YUMMM café with cream stucco facade, large terracotta-red raised YUMMM sign, matching awning, cafe terrace with a few chairs, leafy dappled sunlight, warm pastry counter visible through the glass, composition with readable storefront at center-right and darker usable negative space at left for a future website heading.'},
  {title:'Bakery Display Counter',group:'Photo production',text:photoBase+' Create a wide 3:2 interior photograph of a well-lit glass pastry showcase overflowing with realistic chocolate chip cookies, glazed cinnamon rolls, croissants and small sweets. Neutral marble counter, cream packaging with the original terracotta scallop border, espresso machine behind, plants and warm pendants. No prices invented.'},
  {title:'Cookies / Behind the Scenes',group:'Photo production',text:photoBase+' Create an intimate vertical 4:5 in-the-kitchen scene of a real baker in a terracotta YUMMM apron scooping chunky chocolate-chip cookie dough onto parchment. Hands, scale and food textures must be realistic; warm flour-dusted countertop, natural side light, no faces needed.'},
  {title:'Take-Home Packaging',group:'Photo production',text:photoBase+' Create one vertical 4:5 beautifully art-directed tabletop packaging photograph: cream carry bag, four-cookie window box, large gift pastry box, petite paper cookie bag, red-lid takeaway cup and YUMMM branded napkins. Match original red scalloped bottom borders and YUMMM red wordmark exactly. Afternoon sun and believable shadows.'},
  {title:'Fresh Out of the Oven',group:'Photo production',text:photoBase+' Create a close-up vertical 4:5 photograph of golden chocolate-chip cookies visibly baking on a parchment-lined metal tray inside an illuminated commercial oven. Crisp edge, soft center, melted chocolate and realistic heat shimmer; no lettering or logos needed.'}
];
export const YUMMM_ALL_PROMPTS = [...YUMMM_PROMPTS,...YUMMM_PHOTO_PROMPTS];
