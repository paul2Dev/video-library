export default class videoLibrary {
    constructor() {

        this.input = document.querySelector('#newVideo');
        this.button = document.querySelector('#addVideo');
        this.select = document.querySelector('#videoCategory');
        this.modal = document.querySelector('#iframeVideo');
        this.closeModal = document.querySelector('#closeModal');

        this.videos = JSON.parse(localStorage.getItem("videos") || JSON.stringify({}))

        this.categories = {
        'gaming': [],
        'coding': [],
        'photography': [],
        'gym': [],
        };
    }

    init() {
        this.renderCategorySelect();

        this.renderNavigation();

        this.registerAddVideoEvent();

        this.registerCloseModalEvent();

        this.renderVideos();
    }

    renderCategorySelect() {
        for (const category in this.categories) {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            this.select.appendChild(option);
            if(!this.videos[category]){
                this.videos[category] = [];
            }
        }
        this.updateStorage();
    }

    updateStorage() {
        localStorage.setItem('videos', JSON.stringify(this.videos));
    }

    renderNavigation(){
        const navigationList = document.querySelector('#navigationList');
      
        const navigationItemFirst = document.createElement('li');
        navigationItemFirst.classList.add('mr-2');
        navigationItemFirst.innerHTML = `
          <a href="#" class="inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" data-category="all">all</a>
        `;
        navigationList.appendChild(navigationItemFirst);

        this.registerNavigationEvent(navigationItemFirst);
      
        for(const category in this.categories) {
            const navigationItem = document.createElement('li');
            navigationItem.classList.add('mr-2');
            navigationItem.innerHTML = `
            <a href="#" class="inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" data-category="${category}">${category}</a>
            `;
            navigationList.appendChild(navigationItem);
        
            this.registerNavigationEvent(navigationItem, category);
        }
    }

    registerNavigationEvent(item, category = 'all') {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            item.parentElement.querySelectorAll('li').forEach( link => {
                if(link.classList.contains('active') === true)  {
                    link.classList.remove('border-b-2', 'border-blue-600', 'active', 'text-blue-600');
                }
            });

            item.classList.add('border-b-2', 'border-blue-600', 'active', 'text-blue-600');
            
            console.log('registerNavigationEvent for category: ' + category);
            this.renderVideos(category);
        }.bind(this));
    }

    registerAddVideoEvent() {
        this.button.addEventListener('click', function(e) {
            e.preventDefault();

            const video = this.input.value;
            const videoId = this.getYoutubeVideoId(video);
            const category = this.select.value;

            if(videoId) {
                if(!this.videos[category].includes(videoId)) {
                    this.addVideo(category, videoId);
                    this.updateStorage();
                    this.input.value = '';
                    console.log('registerAddVideoEvent for category: ' + category);
                    this.renderVideos(category);
                } else {
                    alert('Video already added');
                }
            }
        }.bind(this));
    }

    registerCloseModalEvent() {
        this.closeModal.addEventListener('click', function(e) {
            e.preventDefault();
            this.modal.innerHTML = '';
        }.bind(this));
    }

    getYoutubeVideoId(url){
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return (match&&match[7].length==11)? match[7] : false;
    }
    
    renderVideos(renderCategory = 'all') {
        const videosContainer = document.querySelector('#videos');
        videosContainer.innerHTML = '';
      
        if(renderCategory === 'all') {
            this.renderAllVideos(videosContainer);
        } else {
            this.renderCategoryVideos(videosContainer, renderCategory);
        }
    }

    renderAllVideos(videosContainer) {
        this.renderVideosGrid(videosContainer);
    }

    renderVideosGrid(parentContainer){
        const videosGrid = document.createElement('div');
        videosGrid.classList.add('videos', 'grid', 'grid-cols-6', 'gap-10', 'my-5');
        parentContainer.appendChild(videosGrid);
      
        
        for(const category in this.videos) {
            this.videos[category].forEach( video => {
                const videoContainer = document.createElement('div');
                videoContainer.classList.add('relative');
                videoContainer.innerHTML = `
                    <img src="https://img.youtube.com/vi/${video}/0.jpg" alt="video" class="cursor-pointer" data-modal-toggle="defaultModal" />
                    <button type="button" class="absolute top-2 right-1 text-gray-400 bg-gray-100 hover:bg-gray-300 hover:text-gray-900 rounded-lg text-sm p-0.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    </button>
                `;
                videosGrid.appendChild(videoContainer);

                this.registerRemoveVideoEvent(video, category, videoContainer);

                this.registerAddVideoToModalEvent(video, videoContainer);
            });
        }
        
    }

    renderCategoryVideos(videosContainer, renderCategory) {
        this.renderCategoryTitle(videosContainer, renderCategory);
        this.renderVideosCategoryGrid(videosContainer, renderCategory);
    }

    renderCategoryTitle(parentContainer, category) {
        const categoryTitle = document.createElement('h2');
        categoryTitle.classList.add('category-title', 'text-2xl', 'font-bold', 'my-4');
        categoryTitle.innerHTML = category;
        parentContainer.appendChild(categoryTitle);
    }

    renderVideosCategoryGrid(parentContainer, category) {
        const videosGrid = document.createElement('div');
        videosGrid.classList.add('videos', 'grid', 'grid-cols-6', 'gap-10', 'my-5');
        parentContainer.appendChild(videosGrid);
      
        this.videos[category].forEach( video => {
            const videoContainer = document.createElement('div');
            videoContainer.classList.add('relative');
            videoContainer.innerHTML = `
            <img src="https://img.youtube.com/vi/${video}/0.jpg" alt="video" class="cursor-pointer" data-modal-toggle="defaultModal" />
            <button type="button" class="absolute top-2 right-1 text-gray-400 bg-gray-100 hover:bg-gray-300 hover:text-gray-900 rounded-lg text-sm p-0.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </button>
            `;
            videosGrid.appendChild(videoContainer);

            this.registerRemoveVideoEvent(video, category, videoContainer);

            this.registerAddVideoToModalEvent(video, videoContainer);
        });
    }

    registerRemoveVideoEvent(video, category, videoContainer) {
        const removeButton = videoContainer.querySelector('button');
    
        removeButton.addEventListener('click', function(e) {
            e.preventDefault();
            this.videos[category] = this.videos[category].filter( videoId => videoId !== video);
            this.updateStorage(videos);
            this.renderVideos(category);
        }.bind(this));
    }

    registerAddVideoToModalEvent(video, videoContainer) {
        videoContainer.addEventListener('click', function(e) {
            e.preventDefault();
            this.modal.innerHTML = `
                <iframe class="w-full h-96" src="https://www.youtube.com/embed/${video}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            `;
        }.bind(this));
    }


    addVideo(category, videoId) {
        this.videos[category].push(videoId);
    }

}