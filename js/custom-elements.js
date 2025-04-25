document.addEventListener('DOMContentLoaded', function () {
    if (!customElements.get('custom-header')) {
        customElements.define('custom-header', class CustomHeader extends HTMLElement {
            constructor() {
                super(); 

                this.setSocials(this);
                this.setNavigation(this);
                this.secondLevelMenu();
            }
            
            setSocials(){
                const data = this.querySelector('#socials-info').dataset.urls;
                let splitArray = data.toString().toLowerCase().split(',');

                const keyValuePairs = splitArray.map(item => {
                    const match = item.match(/([^:]+):(.*)/);
                    if (match) {
                      const key = match[1].trim();
                      const value = match[2].trim();
                      return { key, value };
                    }
                    return null;
                  }).filter(item => item !== null);

                keyValuePairs.forEach(el => {
                    let element = this.querySelector(`#${el.key.replace(' ', '')}`)
                    if(!element) return;

                    element.style.display = "flex";
                    element.href = el.value.replace(' ', '');

                    //socials for footer
                    let footerElement = document.querySelector(`#${el.key.replace(' ', '')}-footer`);
                    if(!footerElement) return;

                    footerElement.style.display = "flex";
                    footerElement.href = el.value.replace(' ', '');
                })
            }

            setNavigation(){
                const menuBtn = this.querySelector('.menu-button');
                const menu = this.querySelector('.navbar-links-outer');
                const navbar = this;
                menu.style.transition = 'opacity 0.3s var(--ease-transition)';
            
                menuBtn.addEventListener('click', e => menuHandler(e));
                window.addEventListener('resize', debounce(() => {menuOnResize()}, 100)); //leave at 100, if smaller there is a bug with scrolling to the top
            
                function menuHandler(e){ 
                    if(menu.getAttribute('isopen') == 'true'){
                        closeMenu();
                    }else{
                        openMenu();
                    }
                }
            
                function closeMenu(){
                    enableScrolling();
            
                    if(window.matchMedia('(max-width: 991px)').matches){
                        setTimeout(() => {
                            menu.style.display = 'none';
                            menu.setAttribute("isopen", false);
                        }, 300);
                        menu.style.opacity = '0';
                    }
                
                    menuBtn.querySelector('.first-line').style.position = 'static';
                    menuBtn.querySelector('.first-line').style.transform = 'rotateZ(0deg)';
                    menuBtn.querySelector('.second-line').style.position = 'static';
                    menuBtn.querySelector('.second-line').style.transform = 'rotateZ(0deg)';
                    menuBtn.querySelector('.mobile-line').style.opacity = '1';
                }
                
                function openMenu(){
                    let currentPosition = window.pageYOffset;
                    let announcementBar = document.querySelector('#announcement-bar-root');
                    let announcementBarOffset = 0;

                    if(announcementBar && (currentPosition < announcementBar.offsetHeight)){                    
                        announcementBarOffset = announcementBar.offsetHeight - currentPosition;
                    }

                    disableScrolling();
                    menu.setAttribute("isopen", true);
                
                    menu.style.display = 'flex';
                        setTimeout(() => {
                            menu.style.opacity = '1';
                    }, 10);
                
                    
                    menu.style.height = `calc(100dvh - ${navbar.offsetHeight}px - ${announcementBarOffset}px)`;
                    menuBtn.querySelector('.first-line').style.position = 'absolute';
                    menuBtn.querySelector('.first-line').style.transform = 'rotateZ(-45deg)';
                    menuBtn.querySelector('.second-line').style.position = 'absolute';
                    menuBtn.querySelector('.second-line').style.transform = 'rotateZ(45deg)';
                    menuBtn.querySelector('.mobile-line').style.opacity = '0';
                }
                
                function menuOnResize(){
                    if(window.matchMedia('(max-width: 991px)').matches){
                        menu.classList.remove('desktop-navbar')
                    }else{
                        menu.classList.add('desktop-navbar');                        
                        enableScrolling(false);
                    }
                }
            }

            secondLevelMenu(){
                let navArray = [];
                const navbar = this.querySelector('.nav');
                if(navbar){
                    navbar.querySelectorAll('li').forEach(link => {       
                        if (link.dataset.label.charAt(0) === "-") {
                        link.dataset.parent = link.dataset.label.substring(1);                               
                        if(link.dataset.label.includes("--")){
                            var data = link.dataset.parent.split("--")
                            link.dataset.parent = data[0];
                            link.dataset.child = data[1];
                            
                            link.querySelector('.nav-link').innerHTML = link.dataset.child;
                            link.querySelector('.nav-link').setAttribute('tabindex', '0');
                            navArray.push({parent: data[0], child: link});
                        }else{
                            link.querySelector('.nav-link').innerHTML = link.dataset.parent;  
                
                            const anchor = link.querySelector('a');
                            const div = document.createElement('div');
                            const ul = document.createElement('ul');
                            const container = document.createElement('div')
                                
                            div.innerHTML = anchor.innerHTML;
                            div.classList.add('links-label');
                            div.dataset.label = link.dataset.parent;
                            div.innerHTML += `
                                <svg class="dropdown-arrow-svg" viewBox="0 0 9 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.09103 3.18205L0.908974 0L0 0.908974L4.09103 5L8.18205 0.908974L7.27243 0L4.09038 3.18205H4.09103Z" fill="var(--text-color)"/>
                                </svg>
                            `
                            anchor.parentNode.replaceChild(div, anchor);
                
                            link.appendChild(container);
                            container.classList.add('secondary-links');
                            container.appendChild(ul)           
                            ul.classList.add('secondary-links-inner');
                
                            //secondary links handler for mobile
                            div.addEventListener('click', e => this.openCloseLinksOnMobile(link));
                            window.addEventListener('resize', debounce(() => {this.secondaryLinksOnResize(link)}, 10));
                        }               
                        }
                    })
                
                    //move links
                    navArray.forEach(item => {
                        var secondaryList = document.querySelector(`.nav div.links-label[data-label="${item.parent}"]`).parentNode.querySelector('ul');
                        item.child.querySelector('a').classList.remove('hover-underline');
                        secondaryList.appendChild(item.child);
                    })

                    navbar.style.display = 'flex';
                }
            }

            openCloseLinksOnMobile(link){
                if(window.matchMedia('(max-width: 991px)').matches){
                    let container = link.querySelector('.secondary-links');
                    if(container.offsetHeight == 0){
                        container.style.height = 'auto';
                        link.querySelector('.dropdown-arrow-svg').style.transform = "rotateZ(180deg) translateX(-100%)";
                    }else{
                        container.style.height = '0px'
                        link.querySelector('.dropdown-arrow-svg').style.transform = "rotateZ(360deg) translateX(100%)";
                    }
                }
            }
            
            secondaryLinksOnResize(link){
                let container = link.querySelector('.secondary-links');
                if(window.matchMedia('(max-width: 991px)').matches){
                    container.style.height = '0px'
                    link.querySelector('.dropdown-arrow-svg').style.transform = "rotateZ(0deg) translateX(100%)";
                }else{
                    container.style.height = 'auto';
                    link.querySelector('.dropdown-arrow-svg').style.transform = "rotateZ(0deg) translateX(0%)";
                }
            }

        })
    }

    if (!customElements.get('custom-announcement-bar')) {
        customElements.define('custom-announcement-bar', class CustomAnnouncementBar extends HTMLElement {
            constructor() {
                super(); 

                this.barType = this.getAttribute('data-announcement-bar-type');
                this.container = document.querySelector('#announcement-bar-root');
                this.querySelector('.announcement-close-button').addEventListener('click', () => {
                    if(this.container.querySelector('button')){
                        this.container.querySelector('button').click();
                        this.style.display = "none";
                    }
                })

                this.setAnnouncementBar();         
            }

            setAnnouncementBar(){
                if(!this.container || this.barType == "Normal") {
                    this.hideCustomAnnouncementBar();
                    return;
                }

                // Check if children are already present
                if (this.container.children.length > 0) {
                    this.setAnnouncementBarData(this.container.querySelector('.gh-announcement-bar-content'));
                    this.showCustomAnnouncementBar();
                }

                const handleChildChange = (mutationsList, observer) => {
                    for (const mutation of mutationsList) {
                        if (mutation.type === "childList") {
                            // Child elements have been added or removed
                            const numChildren = this.container.children.length;
                            if(numChildren > 0){
                                this.setAnnouncementBarData(this.container.querySelector('.gh-announcement-bar-content'));
                                this.showCustomAnnouncementBar();
                            }
                        }
                    }
                };
                
                const observer = new MutationObserver(handleChildChange);
                const config = { childList: true };
                observer.observe(this.container, config);    
            }

            showCustomAnnouncementBar(){             
                this.container.style.display = "none";
                this.style.display = "flex";
            }

            hideCustomAnnouncementBar(){
                if(this.container){
                    this.container.style.display = "block";
                }               
                this.style.display = "none";
            }

            setAnnouncementBarData(text){                 
                switch (this.barType) {
                    case "Moving Several News":
                        let sentences = text.textContent.split('.');
                        let filteredSentences = sentences.filter(sentence => sentence.trim() !== '');

                        this.querySelectorAll('.announcement-text').forEach(item => {
                            item.innerHTML = "";
                            filteredSentences.forEach(sentence => {
                                item.classList.add('slide-animation');
                                item.innerHTML += sentence;
                                item.innerHTML += `
                                    <div class="announcement-circle"></div>
                                `
                            })
                        })
                        break;

                    case "Moving One News":
                        this.querySelectorAll('.announcement-text').forEach(item => {
                            item.classList.add('slide-animation');            
                            item.innerHTML = text.innerHTML;
                        })
                        break;
                    
                    case "Static":
                        this.querySelectorAll('.announcement-text').forEach(item => {
                            item.innerHTML = text.innerHTML;
                            item.classList.remove('slide-animation')
                        })                   
                        break;

                    default:
                        break;
                }          
            }
        })
    }

    if (!customElements.get('custom-pagination')) {
        customElements.define('custom-pagination', class CustomPagination extends HTMLElement {
            constructor() {
                super(); 
                
                this.loadMoreBtn = this.querySelector("#load-more-btn");               
                
                if(this.loadMoreBtn){
                    this.loadMoreBtn.addEventListener("click", () => {
                        this.loadMorePosts();
                    });
                }
            }
    
            loadMorePosts(cleanList = false) {
                let currentPage = parseInt(this.getAttribute("data-current-page"));
                let nextPage = cleanList ? currentPage = 1 : currentPage + 1;
                let startUrl = window.location;

                if(this.getAttribute('data-is-archivepage') == "true"){
                    let tagName = document.querySelector('archive-tags').getAttribute('data-current-tag')
                    tagName == "all-tags" ? startUrl = window.location.origin + "/": startUrl = window.location.origin + `/tag/${tagName}/`
                }
                
                let url = startUrl + `page/${nextPage}/`;

    
                // Make the AJAX request
                fetch(url)
                    .then(response => response.text())
                    .then(data => {
                        let parser = new DOMParser();
                        let html = parser.parseFromString(data, "text/html");
                        let grid = document.querySelector("#pagination-grid");
                        let newPosts = html.querySelector("#pagination-grid").innerHTML;
                        
                        // Append the new posts to the existing ones
                        cleanList ? grid.innerHTML = newPosts : grid.insertAdjacentHTML("beforeend", newPosts);     
                        
                        if(cleanList){
                            let postNumber = html.querySelector('#data-length');
                            if(postNumber){
                                document.querySelector(".archive-grid-article-number").innerHTML = postNumber.getAttribute('data-length');
                            }
                        }
    
                        // Update the "Load more" button attributes
                        this.setAttribute("data-current-page", nextPage);
                        if(this.loadMoreBtn){
                            this.loadMoreBtn.style.display = html.querySelector("#load-more-btn") ? "block" : "none";
                        }
                        
                        lazyLoadImages(grid);
                    })
                    .catch(error => {
                        console.error("Error loading more posts:", error);
                    });
            }
        })
    }

    if (!customElements.get('archive-tags')) {
        customElements.define('archive-tags', class ArchiveTags extends HTMLElement {
            constructor() {
                super(); 

                this.querySelectorAll('.archive-tag-button').forEach(button => {
                    button.addEventListener('change', this.archiveButtonChange.bind(this))
                })
            }

            archiveButtonChange(e){  
                this.setAttribute('data-current-tag', e.target.id);
                
                // Make the AJAX request
                document.getElementById('custom-pagination').loadMorePosts(true);

                document.querySelector('.archive-grid-title').textContent = e.target.getAttribute('data-name');
            }
        })
    }

    if (!customElements.get('featured-tags')) {
        customElements.define('featured-tags', class FeaturedTags extends HTMLElement {
            constructor() {
                super(); 
                this.tagSlugs = this.getAttribute('data-featured-tags');
                this.setFeaturedTags();
            }
    
            async setFeaturedTags() {
                const tags = this.tagSlugs.split(',').map(item => item.trim());
                const grid = this.querySelector('.featured-tags-inner');
    
                for (const tag of tags) {
                    try {
                        const url = `${window.location.origin}/tag/${tag}/page/1/`;
                        const response = await fetch(url);
                        const data = await response.text();
                        const parser = new DOMParser();
                        const html = parser.parseFromString(data, "text/html");
                        const newPosts = html.querySelector(".articles-grid-section");
                        const newHeading = html.querySelector('.text-card-heading');
                        const articleNumber = html.querySelector('.section-heading-article-number');
                        const button = html.querySelector('#homepage-section-heading-button');
    
                        newPosts.setAttribute('featured-tag-slug', tag);
    
                        // Creating a heading wrapper
                        const headingWrapper = document.createElement('div');
                        headingWrapper.classList.add('sponsored-heading');
    
                        // Clean up new posts
                        newPosts.querySelector('custom-pagination')?.remove();
                        newPosts.querySelector('.articles-grid-section .section-heading-title').textContent = newHeading.textContent;
                        newPosts.querySelector('.section-heading').insertBefore(headingWrapper, newPosts.querySelector('.section-heading').firstChild);
                        headingWrapper.appendChild(newPosts.querySelector('.articles-grid-section .section-heading-title'));
                        articleNumber.remove();
                        button.classList.remove('hidden');
                        newPosts.querySelector('.pagination-grid').removeAttribute('id');
                        newPosts.querySelector('.section-heading-button')?.removeAttribute('id');
    
                        newPosts.querySelectorAll('.grid-small-card').forEach((card, index) => {
                            if (index > 3) {
                                card.remove();
                            }
                        });
    
                        lazyLoadImages(newPosts);
                        grid.appendChild(newPosts);
    
                    } catch (error) {
                        console.error("Error loading more posts:", error);
                    }
                }
    
                document.querySelector('.featured-tags-section').style.display = 'block';
            }
        });
    }    

    if (!customElements.get('custom-notifications')) {
        customElements.define('custom-notifications', class CustomNotifications extends HTMLElement {
            constructor() {
                super(); 

                this.setNotification();
            }
    
            setNotification() {
                var action = getParameterByName('action');
                var stripe = getParameterByName('stripe');
                var success = getParameterByName('success');
            
                if(success == null && action == null && stripe == null) return;
        
                var notifications = document.querySelector('.global-notifications');
                if(stripe){
                    notifications.classList.add(`stripe-${stripe}`);
        
                    notifications.addEventListener('animationend', () => {
                        notifications.classList.remove(`stripe-${stripe}`);
                    });
                }else{
                    notifications.classList.add(`${action}-${success}`);
        
                    notifications.addEventListener('animationend', () => {
                        notifications.classList.remove(`${action}-${success}`);
                    });
                }
            }           
        })
    }

    if (!customElements.get('custom-form')) {
        customElements.define('custom-form', class CustomForm extends HTMLElement {
            constructor() {
                super(); 
    
                const formElement = this.querySelector('form');
                const heading = document.querySelector('.form-page-content h1');
                const description = document.querySelector('.form-page-excerpt');
                const homeButton = document.querySelector('.form-success-button');
                const successHeading = this.querySelector("#form-success-heading-text").getAttribute('data-success-heading');
                const successParagraph = this.querySelector("#form-success-paragraph-text").getAttribute('data-success-paragraph');
                
                let success = false;
                const observer = new MutationObserver(function(mutationsList) {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const classList = mutation.target.classList;
                    if (classList.contains('success') && !success) {
                        success = true;
                
                        formElement.style.display = "none";
    
                        heading.innerHTML = successHeading;
                        homeButton.style.display = "block";
    
                        description.innerHTML = successParagraph;
                    }
                    }
                }
                });
                
                observer.observe(formElement, { attributes: true });
            }
        })
    }

    if (!customElements.get('custom-membership')) {
        customElements.define('custom-membership', class CustomMembership extends HTMLElement {
            constructor() {
                super(); 

                let currencies = [];
    
                this.querySelectorAll('.membership-button').forEach(button => {
                    button.addEventListener('click', this.tabChange.bind(this))
                })
    
                if(!this.querySelector('.tier-card')){
                    this.remove();
                }

                this.querySelectorAll('.tier-price').forEach(price => {
                    let newText = this.extractCurrency(price.querySelector('.tier-price-span').textContent.toString().trim());

                    price.querySelector('.tier-currency').textContent = newText?.currency;
                    price.querySelector('.tier-price-span').textContent = newText?.stringWithoutCurrency;
                    currencies.push(newText?.currency);
                })

                const currenciesNoEmptyStrings = currencies.filter((str) => str.trim() !== '');

                const cleanedCurrencies = [...new Set(currenciesNoEmptyStrings)];

                this.querySelectorAll('.tier-currency-free').forEach(currency => {
                    
                    cleanedCurrencies.length === 0 ? currency.textContent = "$" : currency.textContent = cleanedCurrencies[0];
                })

                this.style.display = 'block';
            }
    
            tabChange(e) {
                if(e.target.getAttribute('data-inactive') == "true"){
                    e.target.setAttribute('data-inactive', "false");
                    let name = e.target.getAttribute('data-tab')
                    this.querySelector(`.membership-tiers[data-tab-content=${name}]`).setAttribute('data-inactive', "false")
            
                    let oposite;
                    name == "yearly" ? oposite = "monthly" : oposite = "yearly"
            
                    this.querySelector(`.membership-button[data-tab=${oposite}]`).setAttribute('data-inactive', "true");
                    this.querySelector(`.membership-tiers[data-tab-content=${oposite}]`).setAttribute('data-inactive', "true")
                }   
            }

            extractCurrency(inputString) {
                const regex = /^(.*?)(?=\d)/;
                const match = inputString.match(regex);

                if (match) {
                    const currency = match[1];
                    const stringWithoutCurrency = inputString.replace(currency, '');

                    return { currency, stringWithoutCurrency };
                }
                return null;
            }
        })
    }

    if (!customElements.get('custom-footer')) {
        customElements.define('custom-footer', class CustomFooter extends HTMLElement {
            constructor() {
                super(); 
                
                this.secondLevelFooter(this);
            }  
            
            secondLevelFooter(){
                let navArray = [];
                const footerNav = document.querySelector('.footer-nav');
                if(footerNav){
                    footerNav.querySelectorAll('li').forEach(link => {         
                        if (link.dataset.label.charAt(0) === "-") {
                
                            link.dataset.parent = link.dataset.label.substring(1);
                            if(link.dataset.label.includes("--")){
                                var data = link.dataset.parent.split("--")
                                link.dataset.parent = data[0];
                                link.dataset.child = data[1];
                                
                                link.querySelector('.footer-nav-link').innerHTML = link.dataset.child;
                                navArray.push({parent: data[0], child: link});
                                }
                                else{
                                link.querySelector('.footer-nav-link').innerHTML = link.dataset.parent;  
                
                                const anchor = link.querySelector('a');
                                const div = document.createElement('div');
                                const ul = document.createElement('ul');
                                const groupUl = document.createElement('ul')
                
                
                                div.innerHTML = anchor.innerHTML;
                                div.classList.add('footer-links-label')
                                groupUl.classList.add('footer-links-group')
                                div.dataset.label = link.dataset.parent;
                                anchor.parentNode.replaceChild(div, anchor);
                
                                link.appendChild(ul);
                                ul.classList.add('footer-secondary-links');
                
                                
                                document.querySelector('.footer-navigation').appendChild(groupUl)
                                groupUl.appendChild(link)
                            }    
                        }else {
                            document.querySelector('.footer-normal-links').appendChild(link)
                        }
                    })

                    //move links
                    navArray.forEach(item => {
                        var secondaryList = this.querySelector(`div.footer-links-label[data-label="${item.parent}"]`).parentNode.querySelector('ul');
                        secondaryList.appendChild(item.child)
                    })

                    if(footerNav.children.length === 0){
                        footerNav.remove();
                    }
                    
                    if(document.querySelector('.footer-normal-links').children.length === 0){
                        document.querySelector('.footer-normal-links-group').remove();
                    }

                    this.querySelector('.footer-navigation').style.display = 'flex';
                }
            }
        })
    }
})