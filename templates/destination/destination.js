/* eslint-disable */
import AdobeAemHeadlessClientJs from 'https://cdn.skypack.dev/pin/@adobe/aem-headless-client-js@v3.2.0-R5xKUKJyh8kNAfej66Zg/mode=imports,min/optimized/@adobe/aem-headless-client-js.js';
import { getConfigValue } from '../../scripts/configs.js';
import { createOptimizedPicture, getMetadata } from '../../scripts/aem.js';

async function initialize(slug) {
  try {
    const AEM_HOST = await getConfigValue('aem-host');
    const AEM_GRAPHQL_ENDPOINT = await getConfigValue('aem-graphql-endpoint');
    const AEM_HEADLESS_CLIENT = new AdobeAemHeadlessClientJs({ serviceURL: AEM_HOST });
    
    let dataObj = {};

    dataObj = await AEM_HEADLESS_CLIENT.runPersistedQuery('ac/' + AEM_GRAPHQL_ENDPOINT + ';airportCode=' + slug  + '?cache=' + Math.floor(Date.now() / 1000) );
    const data = dataObj?.data?.hotelOfferList?.items;
    return data;

  } catch (error) {
    console.error('Error fetching data:', error);
    return false;
  }
}

export default async function decorate(block) {
  const slug = getMetadata('slug');
  if (!slug) return;

  let data = [];
  let updatedColumnItems = [];
  data = await initialize(slug);
  
  // create html
  data.forEach((item) => {
    //const imagePath = item.bannerImage?._path;
    //const parts = imagePath.split('/');
    //let fileName = parts[parts.length - 1];
    //fileName =  fileName.replaceAll('_', '-');
    //const path = `/images/${fileName}?1234`;
    
    //const optimizedDemoImage = createOptimizedPicture(path, item.airportcode, false, [{ width: '1174' }]);

    const path = item.bannerImage?._publishUrl + '?cache=' + Math.floor(Date.now() / 1000) ;

    updatedColumnItems.push(`
      <div id=${item.airportcode}>
        <div class="columns-img-col">
          <picture>
          <source type="image/webp" srcset="${path}">
          <img loading="lazy" alt="LAS" src="${path}" width="1174" height="250">
        </picture>
        
        </div>
        <div class="info">
          <p><strong>${item.title}</strong></p>
          ${item.teaser.html}
          <a href="${item.linkUrl}" title="${item.title}" target="_blank" class="button">${item.linkLabel}</a>
        </div>
      </div>
    `);
  });


  const firstSection = block.querySelector('.section.hero-container');
  const airportBannerHTML = updatedColumnItems.join('');
  const tempContainer = document.createElement('div');
  tempContainer.classList.add('section', 'hotel-offer-banner');
  tempContainer.innerHTML = airportBannerHTML

  firstSection.insertAdjacentElement('afterend', tempContainer);
}
