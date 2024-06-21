const { connectAutocomplete, connectHits, connectSearchBox } = instantsearch.connectors;
// or directly use instantsearch.connectors.connectAutocomplete()

const {
	configure,
	hits,
	pagination,
	panel,
	refinementList,
	menu,
	heirarchalMenu,
	searchBox,
	trendingItems,
	toggleRefinement,
	sortBy,
	clearRefinements,
	currentRefinements
} = instantsearch.widgets;

const searchClient = algoliasearch(
	"GKXGAPVGMV",
	"23617e4368e8137272e0ca5a05e85ab9"
);
const search = instantsearch({
	indexName: "dev_Products",
	searchClient,
	insights: true
});
const renderSearchBox = (renderOptions, isFirstRender) => {
	const {query, refine} = renderOptions;
	
	const container = document.querySelector('#searchbox');
	
	if (isFirstRender) {
		const inputGroup = document.createElement('div');
		inputGroup.classList.add('input-group');
		
		const input = document.createElement('input');
		input.setAttribute('type', 'text');
		input.setAttribute('name', 'search');
		input.setAttribute('placeholder', 'Find');
		input.setAttribute('autocomplete', 'off')
		input.id = 'search'
		input.classList.add('text-input')
		
		input.addEventListener('input', (e) => {
			refine(e.target.value);
		})
		
		const label = document.createElement('label');
		label.setAttribute('for', 'search');
		label.innerHTML = 'Filter';
		
		inputGroup.appendChild(input);
		inputGroup.appendChild(label);
		container.appendChild(inputGroup);
	}
	
	container.querySelector('input').value = query;
}

const customSearchBox = connectSearchBox(
	renderSearchBox
)
const renderHits = (renderOptions, isFirstRender) => {
  const { hits, widgetParams } = renderOptions;
  const { container } = widgetParams;

  // Group hits by categories.lvl0 and categoriecon
  const groupedItems = hits.reduce((acc, item) => {
    const categoryLvl0 = item.categories.lvl0;
    const categoryLvl1 = item.categories.lvl1;
    if (!acc[categoryLvl0]) {
      acc[categoryLvl0] = {};
    }
    if (!acc[categoryLvl0][categoryLvl1]) {
      acc[categoryLvl0][categoryLvl1] = [];
    }
    acc[categoryLvl0][categoryLvl1].push(item);
    return acc;
  }, {});
		const optionMap = {
			0: '',
			1: 'optionA',
			2: 'optionB'
		}
		const removeFromCart = `
			<div class="btn-round item-cart-remove">
				<svg class="icon">
					<use xlink:href="/_home/Images/Icons/icons.svg#minus"></use>
				</svg>
			</div>
			`
  // Create the HTML structure
  const markup = Object.entries(groupedItems).map(([categoryLvl0, lvl1Groups]) => {
    const categoryHeaderLvl0 = `<h4 class="category-header">${categoryLvl0}</h4>`;
    const lvl1Markup = Object.entries(lvl1Groups).map(([categoryLvl1, items], i) => {
      const categoryHeaderLvl1 = `<h5 class="category-header">${categoryLvl1}</h5>`;
      const categoryItems = items.map((hit, itemNum) => {
							console.log()
							return`
						<div class="shop-item">
						<img src="https://cdn.freshharvest.com/${hit.img_paths[0]}">
						<div class="item-information">
							<div class="item-tags"></div>
							<span class="item-vendor">${hit.vendor.name}</span>
							<h6 class="item-name">${hit.name}</h6>
						</div>
						<div class="item-purchase">
							<div class="item-price-details">
								<div class="item-price">$${hit.price}</div>
								<span class="item-uom">6 oz</span>
							</div>
							<div class="item-cart ${optionMap[i % 3]}">
									${itemNum > 0 || i % 3 > 0 ? removeFromCart : ''}
								<span class="item-cart-quantity">${itemNum === 0 && i % 3 === 0 ? 'ADD' : itemNum}</span>
								<div class="btn-round item-cart-add">
									<svg class="icon">
										<use xlink:href="home/Images/Icons/icons.svg#plus"></use>
									</svg>
								</div>
							</div>
						</div>
					</div>
      `}).join('');
      return `${categoryHeaderLvl1}<div class="shop-items">${categoryItems}</div>`;
    }).join('');
    return `${categoryHeaderLvl0}${lvl1Markup}`;
  }).join('');

  // Update the container's HTML
  container.innerHTML = markup;
};


const customHits = connectHits(renderHits);

search.addWidgets([
	customSearchBox({
	}),
  customHits({
    container: document.querySelector(".shop"),
  }),
	configure({
		hitsPerPage: 50
	}),
	// panel({
	// 	templates: { header: "Categories" },
	// 	cssClasses: {
	// 		root: 'filter-panel'
	// 	}
	// })(refinementList)({
	// 	container: ".shop-filters",
	// 	attribute: "categories.lvl0",
	// 	sortBy: ["name"],
	// 	cssClasses: {
	// 		label: 'input-group',
	// 		root: 'filter-outer'
	// 	},
	// 	templates: {
	// 		item(item, {html}) {
	// 			const { url, label, count, isRefined } = item;
	// 			return html`
	// 			<div class="input-group">
	// 				<input type="checkbox" class="checkbox-sm" checked="${isRefined ? 'checked' : '' }" />
	// 				<label>${label}</s>
	// 			</div>
	// 			`
	// 		}
	// 	}
	// })
	//     pagination({
	//       container: "#pagination"
	//     }),
	//     currentRefinements({
	//       container: "#sort-by",
	//       transformItems(items) {
	//         console.log(items);
	//         return items.map(item => {
	//           item.label = item.label.startsWith("categories") ? "Categories" : item.label;

	//         })
	//       }
	//     }),
	// sortBy({
	//   container: "#sort-by",
	//   items: [
	//     { label: "Best Match", value: "instant_search" },
	//     { label: "Price: Low to High", value: "instant_search_price_asc" },
	//     { label: "Price: High to Low", value: "instant_search_price_desc" }
	//   ]
	// }),
	// trendingItems({
	//   container: "#trending",
	//   limit: 4,
	//   templates: {
	//     item: (item, { html }) => html`
	//       <article>
	//         <div>
	//           <img src="https://cdn.freshharvest.com${item.images[0]}" />
	//           <h2>${item.name}</h2>
	//         </div>
	//         <a href="/products.html?pid=${item.objectID}">See product</a>
	//       </article>
	//     `
	//   }
	// })
]);

search.start();

function showFilters() {
	const filterContainer = document.querySelector('.shop-filters');
	filterContainer.classList.toggle('shop-filters-visible');
}

