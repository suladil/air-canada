import { getMetadata } from '../../scripts/aem.js';

export default function decorate(block) {
  console.log('destination templte: ', block)

  const slug = getMetadata('slug');
  if (!slug) return;
}