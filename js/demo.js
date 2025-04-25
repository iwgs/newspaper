if (!customElements.get('settings-sidebar')) {
    customElements.define('settings-sidebar', class SettingsSidebar extends HTMLElement {
        constructor() {
            super(); 
         
            this.isOpen = false;
            this.tocInited = false;
            this.postLayout = 'narrow';
            this.postSidebar = 'false';
            this.customAnnouncementBar = document.querySelector('custom-announcement-bar');

            this.backgroundColorInput = this.querySelector('#background-color');
            this.textColorInput = this.querySelector('#text-color');
            this.fontsInput = this.querySelector('#fonts');
            this.announcementBarInput = this.querySelector('#announcement-bar-type');
            this.cardHeadingInput = this.querySelector('#card-heading-style');
            this.imageStyleInput = this.querySelector('#image-style');
            this.initialsInput = this.querySelector('#use-initials');
            this.newsletterInput = this.querySelector('#use-newsletter');
            this.sidebarPositionInput = this.querySelector('#sidebar-position');
            this.sidebarContentInput = this.querySelector('#sidebar-content');
            this.themePresetsInput = this.querySelector('#theme-presets');

            document.querySelector("#settings-button").addEventListener('click', this.settingsVisibility.bind(this));
            this.backgroundColorInput.addEventListener('input', this.backgroundColorChange.bind(this));
            this.textColorInput.addEventListener('input', this.textColorChange.bind(this));
            this.fontsInput.addEventListener('change', this.fontsChange.bind(this));
            this.announcementBarInput.addEventListener('change', this.announcementBarTypeChange.bind(this));
            this.cardHeadingInput.addEventListener('change', this.cardHeadingStyleChange.bind(this));
            this.imageStyleInput.addEventListener('change', this.imageStyleChange.bind(this));
            this.initialsInput.addEventListener('change', this.initialsChange.bind(this));
            this.newsletterInput.addEventListener('change', this.newsletterChange.bind(this));
            this.sidebarPositionInput.addEventListener('change', this.sidebarPositionChange.bind(this));
            this.sidebarContentInput.addEventListener('change', this.sidebarContentChange.bind(this));
            this.themePresetsInput.addEventListener('change', this.themePresetsChange.bind(this));

            //close open settings
            document.addEventListener('click', this.outsideClick.bind(this));

            //check URL attributes
            this.checkAttributes();

            //hide and reveal
            let article = document.querySelector('article');
            if(article){
                article.style.opacity = 1;
            }

            let main = document.querySelector('.main');
            if(main){
                main.style.opacity = 1;
            }
        }      

        checkAttributes(){
            var queryParams = new URLSearchParams(window.location.search);

            let tagLayout = queryParams.get('tag-layout');
            if(tagLayout && tagLayout == "simple"){
                document.querySelector('.simple-hero').classList.remove('hide-on-desktop');
                document.querySelector('.column-layout').remove();
            }

            let authorLayout = queryParams.get('author-layout');
            if(authorLayout){
                switch (authorLayout) {
                    case "author-image-left":
                        document.querySelector('.column-layout').classList.add('author-image-layout');
                        break;

                    case "author-image-right":
                        document.querySelector('.column-layout').classList.add('author-image-layout');
                        document.querySelector('.column-layout').classList.add('author-image-right');
                        break;
                
                    default:
                        break;
                }
            }          

            let accountSubscribeButton = queryParams.get('no-subscribe-button');
            if(accountSubscribeButton && accountSubscribeButton == "true"){
                document.querySelector('.account-subscribe-button').remove();
            }

            let accountLayout = queryParams.get('account-layout');
            if(accountLayout && accountLayout == "simple"){
                document.querySelector('.account-data').remove();
            }

            if(queryParams.get('post-layout')){
                this.postLayout = queryParams.get('post-layout');
            }
            
            if(this.postLayout && document.querySelector('article')){
                switch (this.postLayout) {
                    case "narrow":
                        document.querySelector('article header').classList.add('narrow-container');
                        document.querySelector('article').setAttribute('data-post-header-type', 'Narrow');
                        break;

                    case "wide":
                        document.querySelector('article').setAttribute('data-post-header-type', 'Wide');
                        break;

                    case "featured-image-left":
                        document.querySelector('article header').classList.add('vertical-post-header');
                        document.querySelector('article header').classList.add('vertical-post-image-left');
                        document.querySelector('article').setAttribute('data-post-header-type', 'Featured Image Left');
                        break;

                    case "featured-image-right":
                        document.querySelector('article header').classList.add('vertical-post-header');
                        document.querySelector('article').setAttribute('data-post-header-type', 'Featured Image Right');
                        break;
                
                    default:
                        break;
                }
            }

            if(queryParams.get('sidebar')){
                this.postSidebar = queryParams.get('sidebar');
            }

            if(this.postSidebar && document.querySelector('article')){
                if(this.postSidebar == "false"){
                    document.querySelector('article').setAttribute('data-use-sidebar', 'false');
                    document.querySelector('article .post-content-outer').classList.add('post-content-outer-without-sidebar');
                    document.querySelector('article .post-content-outer .post-main-image-wrapper')?.remove();
                    document.querySelector('article .post-sidebar')?.remove();
                }    
                else{
                    if(document.querySelector('article').getAttribute('data-post-header-type') != 'Narrow'){
                        document.querySelector('article .post-content-outer .post-main-image-wrapper')?.remove();
                    }
    
                    if(document.querySelector('article').getAttribute('data-post-header-type') == 'Featured Image Left'){
                        this.sidebarPositionInput.value = "Left";
                        this.sidebarPositionChange();
                    }
    
                    document.querySelector('article header').classList.remove('narrow-container');
                    document.querySelector('article').setAttribute('data-use-sidebar', 'true');
                }
            }

            let themePreset = queryParams.get('theme-preset');
            if(themePreset){
                this.themePresetsInput.value = themePreset;
                this.themePresetsChange();
            }
        }

        themePresetsChange(){
            let preset = this.themePresetsInput.value;
            switch (preset) {
                case "old-newspaper-light":
                    this.backgroundColorInput.value = "#f6f6f6";
                    this.textColorInput.value = "#222222";
                    this.imageStyleInput.value = "grayscale(1)";
                    this.initialsInput.value = "true";
                    break;

                case "modern-newspaper-light":
                    this.backgroundColorInput.value = "#ffffff";
                    this.textColorInput.value = "#000000";
                    this.imageStyleInput.value = "unset";
                    this.initialsInput.value = "false";
                    break;

                case "old-newspaper-tinted":
                    this.backgroundColorInput.value = "#f0ede8";
                    this.textColorInput.value = "#222222";
                    this.imageStyleInput.value = "grayscale(1) sepia(0.35) contrast(0.85)";
                    this.initialsInput.value = "true";
                    break;

                case "elegant-newspaper-light":
                    this.backgroundColorInput.value = "#F2F1EF";
                    this.textColorInput.value = "#222222";
                    this.imageStyleInput.value = "unset";
                    this.initialsInput.value = "false";
                    break;

                case "elegant-newspaper-dark":
                    this.backgroundColorInput.value = "#222222";
                    this.textColorInput.value = "#F0EAE1";
                    this.imageStyleInput.value = "unset";
                    this.initialsInput.value = "false";
                    break;

                case "old-newspaper-dark":
                    this.backgroundColorInput.value = "#000000";
                    this.textColorInput.value = "#ffffff";
                    this.imageStyleInput.value = "grayscale(1)";
                    this.initialsInput.value = "true";
                    break;

                case "modern-newspaper-dark":
                    this.backgroundColorInput.value = "#000000";
                    this.textColorInput.value = "#ffffff";
                    this.imageStyleInput.value = "unset";
                    this.initialsInput.value = "false";
                    break;
            
                default:
                    break;
            }

            this.backgroundColorChange();
            this.textColorChange();
            this.imageStyleChange();
            this.initialsChange();
        }

        sidebarContentChange(){
            const sidebar = document.querySelector('.post-sidebar');

            if(sidebar){
                if(this.sidebarContentInput.value == "Table Of Contents"){
                    sidebar.querySelector('.sidebar-articles').style.display = 'none';
                    sidebar.querySelector('.hidden-sidebar-newsletter').classList.remove('sidebar-newsletter-container');
                    sidebar.classList.remove('sidebar-related-articles');

                    this.tocInited == false ? this.tocInit() : document.querySelector('.gh-toc-outer').style.display = 'block';
                    
                }else{
                    document.querySelector('.gh-toc-outer').style.display = 'none';
                    sidebar.querySelector('.sidebar-articles').style.display = 'block';
                    sidebar.querySelector('.hidden-sidebar-newsletter').classList.add('sidebar-newsletter-container');
                    sidebar.classList.add('sidebar-related-articles');
                }
            }

            stickySidebar();
        }

        tocInit(){
            // Create elements
            var outerDiv = document.createElement('div');
            outerDiv.classList.add('gh-toc-outer');

            var headingDiv = document.createElement('div');
            headingDiv.classList.add('medium-text', 'toc-heading');
            headingDiv.textContent = 'Table of Contents';

            var tocDiv = document.createElement('div');
            tocDiv.classList.add('gh-toc');

            // Insert elements into the container div
            outerDiv.appendChild(headingDiv);
            outerDiv.appendChild(tocDiv);

            // Insert the container div into the body of the document
            document.querySelector('.post-sidebar').appendChild(outerDiv);

            var tocbotScript = document.createElement('script');
            tocbotScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/tocbot/4.12.3/tocbot.min.js';
            document.head.appendChild(tocbotScript);

            tocbotScript.onload = function () {
                tocbot.init({
                    // Where to render the table of contents.
                    tocSelector: '.gh-toc',
                    // Where to grab the headings to build the table of contents.
                    contentSelector: '.gh-content', // Adjust this selector based on your actual content structure
                    // Which headings to grab inside of the contentSelector element.
                    headingSelector: 'h2, h3, h4',
                    // Ensure correct positioning
                    hasInnerContainers: true,
                    ignoreSelector: '.kg-card h2, .kg-card h3, .kg-card h4, .post-upgrade-cta h2'
                });
            }

            this.tocInited = true;
        }

        sidebarPositionChange(){
            const sidebar = document.querySelector('.post-content-and-sidebar');

            if(sidebar){
                this.sidebarPositionInput.value == "Right" ? sidebar.classList.remove('sidebar-left') : sidebar.classList.add('sidebar-left');
            }
        }

        newsletterChange(){
            const homepage = document.querySelector('.homepage .column-layout');

            if(homepage){
                this.newsletterInput.value == "true" ? homepage.classList.add('homepage-newsletter') : homepage.classList.remove('homepage-newsletter')
            }

            const post = document.querySelector('.post-sidebar .hidden-sidebar-newsletter');

            if(post){
                this.newsletterInput.value == "true" ? post.classList.add('sidebar-newsletter-container') : post.classList.remove('sidebar-newsletter-container');
                stickySidebar();
            }
        }

        initialsChange(){
            if(this.initialsInput.value == 'false'){
                document.querySelectorAll(".initial-paragraph").forEach(paragraph => {
                    paragraph.classList.remove('initial-paragraph')
                    paragraph.classList.add('initial-paragraph-reset')
                })
            }else{
                document.querySelectorAll(".initial-paragraph-reset").forEach(paragraph => {
                    paragraph.classList.remove('initial-paragraph-reset')
                    paragraph.classList.add('initial-paragraph')
                })
            }          
        }

        imageStyleChange() {
            document.documentElement.style.setProperty('--image-filter', this.imageStyleInput.value);
            document.documentElement.setAttribute('data-image-style', this.imageStyleInput.options[this.imageStyleInput.selectedIndex].textContent);
        }

        cardHeadingStyleChange(){
            document.documentElement.style.setProperty('--heading-style', this.cardHeadingInput.value);
        }

        announcementBarTypeChange(){
            this.customAnnouncementBar.setAttribute('data-announcement-bar-type', this.announcementBarInput.value);
            this.customAnnouncementBar.barType = this.announcementBarInput.value;

            if(this.customAnnouncementBar.getAttribute('data-announcement-bar-type') == "Normal"){
                this.customAnnouncementBar.hideCustomAnnouncementBar();
            }else{
                this.customAnnouncementBar.setAnnouncementBarData(this.customAnnouncementBar.container.querySelector('.gh-announcement-bar-content'));
                this.customAnnouncementBar.showCustomAnnouncementBar();
            }        
        }

        outsideClick(event){
            if (this.isOpen && !this.contains(event.target) && !document.querySelector("#settings-button").contains(event.target)) {
                this.settingsVisibility();
            }
        }

        settingsVisibility(){      
            this.isOpen = !this.isOpen;
            this.classList.toggle('open-settings-sidebar')
            document.querySelector("#settings-button").classList.toggle('open-settings-sidebar-button')
        }

        backgroundColorChange(){
            document.documentElement.style.setProperty('--background-color', this.backgroundColorInput.value);
            this.changeCommentsStyles();
        }

        textColorChange(){
            document.documentElement.style.setProperty('--text-color', this.textColorInput.value);
            hexToRgba(this.textColorInput.value);
            this.changeCommentsStyles();
        }

        fontsChange(){
            loadFonts(this.fontsInput.value);
            this.changeCommentsStyles();
        }

        changeCommentsStyles(){
            const iframe = document.querySelector('#ghost-comments-root iframe');
                if(!iframe) return;
                
                var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                var targetHead = iframe.contentDocument.head;
    
                var newLink = document.createElement("link");
                newLink.setAttribute("rel", "stylesheet");
                newLink.setAttribute("type", "text/css");
                newLink.setAttribute("href", "{{asset 'css/comments.css'}}");

                let section = iframeDoc.querySelector('section');
                section.id = "comments-section"

                const rootStyles = getComputedStyle(document.documentElement);

                //initial variables
                iframeDoc.documentElement.style.setProperty('--text-color', rootStyles.getPropertyValue('--text-color'))
                iframeDoc.documentElement.style.setProperty('--background-color', rootStyles.getPropertyValue('--background-color'))
                iframeDoc.documentElement.style.setProperty('--ease-transition', rootStyles.getPropertyValue('--ease-transition'))
                iframeDoc.documentElement.style.setProperty('--font1', rootStyles.getPropertyValue('--font1'))
                iframeDoc.documentElement.style.setProperty('--font2', rootStyles.getPropertyValue('--font2'))
                iframeDoc.documentElement.style.setProperty('--font3', rootStyles.getPropertyValue('--font3'))
                iframeDoc.documentElement.style.setProperty('--font4', rootStyles.getPropertyValue('--font4'))
                iframeDoc.documentElement.style.setProperty('--image-filter', rootStyles.getPropertyValue('--image-filter'))

                loadFonts(this.fontsInput.value, iframeDoc);
        }
    })
}