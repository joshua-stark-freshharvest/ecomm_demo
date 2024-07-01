// File: /path/to/optimized_script.js

// Debounce utility function
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Utility function to create HTML elements from a string
function html(htmlInput) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlInput, "text/html");
    return doc.body.firstChild;
}

// Function to create dropdown menu link
function dropdownMenuLink(dropdownText) {
    if (!dropdownText) return false;
    const htmlString = `<li class="dropdown-link">${dropdownText}</li>`;
    return html(htmlString);
}

// Initialize event listeners on DOM content loaded
document.addEventListener("DOMContentLoaded", () => {    
    const dropdownStorage = [];
		const dropdowns = document.querySelectorAll(".dropdown");
    const navContainer = document.querySelector(".shop-nav");
    const navMenu = document.querySelector(".shop-nav-menu");
    const showMore = document.querySelector(".dropdown.more");
    const showMoreLinks = showMore.querySelector(".dropdown-links");

    function adjustMenu() {
        const checkDistance = 10;
        const navContainerRight = navContainer.getBoundingClientRect().right;
        let navMenuRight = navMenu.getBoundingClientRect().right;
        let distance = navContainerRight - navMenuRight;

        // Move items to 'More' dropdown if needed
        while (distance < checkDistance && navMenu.querySelectorAll(".dropdown:not(.more)").length > 0) {
            const dropdownsNotMore = navMenu.querySelectorAll(".dropdown:not(.more)");
            const lastDropdown = dropdownsNotMore[dropdownsNotMore.length - 1];

            if (!lastDropdown) {
                break;
            }

            dropdownStorage.unshift([lastDropdown, lastDropdown.offsetWidth]);
            showMoreLinks.prepend(dropdownMenuLink(lastDropdown.querySelector(".dropdown-button").innerText));
            lastDropdown.remove();

            navMenuRight = navMenu.getBoundingClientRect().right;
            distance = navContainerRight - navMenuRight;
        }

        // Move items back from 'More' dropdown if there's enough space
        while (dropdownStorage.length > 0) {
            const [dropdown, dropdownWidth] = dropdownStorage[0];
            navMenuRight = navMenu.getBoundingClientRect().right;
            distance = navContainerRight - navMenuRight;

            if (distance + (checkDistance * 2) >= dropdownWidth) {
                navMenu.insertBefore(dropdown, showMore);
                showMoreLinks.firstChild.remove();
                dropdownStorage.shift();

                navMenuRight = navMenu.getBoundingClientRect().right;
                distance = navContainerRight - navMenuRight;
            } else {
                break;
            }
        }
    }
		function registerDropdownImageEvents() {
			dropdowns.forEach((dropdown) => {
					const backgroundContainer = dropdown.querySelector(".dropdown-background");
					const links = dropdown.querySelectorAll(".dropdown-link");
					let activeBackgroundImage = null;

					const changeBackgroundImage = debounce((backgroundImage) => {
							if (backgroundImage !== activeBackgroundImage) {
									backgroundContainer.style.backgroundImage = `url(${backgroundImage})`;
									activeBackgroundImage = backgroundImage;
							}
					}, 100);

					function preloadImage(link) {
							if (!link.dataset.loaded) {
									const img = new Image();
									img.src = link.dataset.backgroundImage;
									link.dataset.loaded = true;
							}
					}

					dropdown.addEventListener("mouseenter", () => {
							links.forEach(preloadImage);
					});

					dropdown.addEventListener("mouseover", (e) => {
							if (e.target.classList.contains("dropdown-link")) {
									const backgroundImage = e.target.dataset.backgroundImage || false;
									if (backgroundImage) {
											changeBackgroundImage(backgroundImage);
									}
							}
					});
			});
		}

    const debouncedAdjustMenu = debounce(adjustMenu, 50);
    window.addEventListener("resize", debouncedAdjustMenu);
    adjustMenu();
    registerDropdownImageEvents();
});
