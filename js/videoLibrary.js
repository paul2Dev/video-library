export default class videoLibrary {
    constructor() {

        this.appContainer = document.querySelector('#app');
        
        this.input = '';
        this.button = '';
        this.select = '';
        this.modal = '';
        this.modalContent = '';
        this.closeModal = '';
        this.dragStartIndex = '';
        this.currentCategory = 'all';

        this.videos = JSON.parse(localStorage.getItem("videos") || JSON.stringify({}))

        this.categories = {
        'gaming': [],
        'coding': [],
        'photography': [],
        'gym': [],
        };
        
    }

    init() {
        this.renderForm();

        this.renderNavigation();

        this.renderDisplayVideos();

        this.renderVideoModal();

        this.renderVideos();

    }

    renderVideoModal() {
        const videoModal = document.createElement('div');
        videoModal.classList.add('fixed', 'top-0', 'left-0', 'right-0', 'z-50', 'hidden', 'w-full', 'p-4', 'overflow-x-hidden', 'overflow-y-auto', 'md:inset-0', 'h-modal', 'md:h-full');
        videoModal.id = 'defaultModal';
        videoModal.innerHTML = `
        <div class="relative w-full h-full max-w-2xl md:h-auto">
            <!-- Modal content -->
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <!-- Modal header -->
                <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                        Watch video
                    </h3>
                    <button id="closeModal" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <!-- Modal body -->
                <div class="p-6 space-y-6" id="iframeVideo">

                </div>
        
            </div>
        </div>
        `;
        this.appContainer.appendChild(videoModal);

        // set the modal menu element
        const targetEl = document.getElementById('defaultModal');

        // options with default values
        const options = {
            placement: 'center',
            backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
            onHide: () => {
                console.log('modal is hidden');
            },
            onShow: () => {
                console.log('modal is shown');
            },
            onToggle: () => {
                console.log('modal has been toggled');
            }
        };

        this.modal = new Modal(targetEl, options);

        this.modalContent = document.querySelector('#iframeVideo');
        this.closeModal = document.querySelector('#closeModal');

        this.registerCloseModalEvent();
        
    }

    renderDisplayVideos() {
        const videosContainer = document.createElement('div');
        videosContainer.classList.add('container', 'mx-auto');
        videosContainer.id = 'videos';
        this.appContainer.appendChild(videosContainer);
    }


    renderForm() {

        const formContainer = document.createElement('div');
        formContainer.classList.add('container', 'mx-auto', 'p-10', 'flex', 'items-center', 'justify-center');

        const form = document.createElement('form');
        form.classList.add('w-1/2');

        form.innerHTML = `
        <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-20" xml:space="preserve" y="0" x="0" id="Layer_1" version="1.1" viewBox="-57.15 -21.25 495.3 127.5"><style id="style7427" type="text/css">.st2{fill:#282828}</style><g id="g7433"><path id="path7429" d="M118.9 13.3c-1.4-5.2-5.5-9.3-10.7-10.7C98.7 0 60.7 0 60.7 0s-38 0-47.5 2.5C8.1 3.9 3.9 8.1 2.5 13.3 0 22.8 0 42.5 0 42.5s0 19.8 2.5 29.2C3.9 76.9 8 81 13.2 82.4 22.8 85 60.7 85 60.7 85s38 0 47.5-2.5c5.2-1.4 9.3-5.5 10.7-10.7 2.5-9.5 2.5-29.2 2.5-29.2s.1-19.8-2.5-29.3z" fill="red"/><path id="polygon7431" fill="#fff" d="M48.6 24.3v36.4l31.6-18.2z"/></g><g id="g7451"><g id="g7449"><path id="path7435" d="M176.3 77.4c-2.4-1.6-4.1-4.1-5.1-7.6-1-3.4-1.5-8-1.5-13.6v-7.7c0-5.7.6-10.3 1.7-13.8 1.2-3.5 3-6 5.4-7.6 2.5-1.6 5.7-2.4 9.7-2.4 3.9 0 7.1.8 9.5 2.4 2.4 1.6 4.1 4.2 5.2 7.6 1.1 3.4 1.7 8 1.7 13.8v7.7c0 5.7-.5 10.2-1.6 13.7-1.1 3.4-2.8 6-5.2 7.6-2.4 1.6-5.7 2.4-9.8 2.4-4.2-.1-7.6-.9-10-2.5zm13.5-8.4c.7-1.7 1-4.6 1-8.5V43.9c0-3.8-.3-6.6-1-8.4-.7-1.8-1.8-2.6-3.5-2.6-1.6 0-2.8.9-3.4 2.6-.7 1.8-1 4.6-1 8.4v16.6c0 3.9.3 6.8 1 8.5.6 1.7 1.8 2.6 3.5 2.6 1.6 0 2.7-.8 3.4-2.6z" class="st2"/><path id="path7437" d="M360.9 56.3V59c0 3.4.1 6 .3 7.7.2 1.7.6 3 1.3 3.7.6.8 1.6 1.2 3 1.2 1.8 0 3-.7 3.7-2.1.7-1.4 1-3.7 1.1-7l10.3.6c.1.5.1 1.1.1 1.9 0 4.9-1.3 8.6-4 11-2.7 2.4-6.5 3.6-11.4 3.6-5.9 0-10-1.9-12.4-5.6-2.4-3.7-3.6-9.4-3.6-17.2v-9.3c0-8 1.2-13.8 3.7-17.5 2.5-3.7 6.7-5.5 12.6-5.5 4.1 0 7.3.8 9.5 2.3 2.2 1.5 3.7 3.9 4.6 7 .9 3.2 1.3 7.6 1.3 13.2v9.1h-20.1zm1.5-22.4c-.6.8-1 2-1.2 3.7-.2 1.7-.3 4.3-.3 7.8v3.8h8.8v-3.8c0-3.4-.1-6-.3-7.8-.2-1.8-.7-3-1.3-3.7-.6-.7-1.6-1.1-2.8-1.1-1.4-.1-2.3.3-2.9 1.1z" class="st2"/><path id="path7439" d="M147.1 55.3L133.5 6h11.9l4.8 22.3c1.2 5.5 2.1 10.2 2.7 14.1h.3c.4-2.8 1.3-7.4 2.7-14l5-22.4h11.9L159 55.3v23.6h-11.8V55.3z" class="st2"/><path id="path7441" d="M241.6 25.7V79h-9.4l-1-6.5h-.3c-2.5 4.9-6.4 7.4-11.5 7.4-3.5 0-6.1-1.2-7.8-3.5-1.7-2.3-2.5-5.9-2.5-10.9V25.7h12v39.1c0 2.4.3 4.1.8 5.1s1.4 1.5 2.6 1.5c1 0 2-.3 3-1 1-.6 1.7-1.4 2.1-2.4V25.7z" class="st2"/><path id="path7443" d="M303.1 25.7V79h-9.4l-1-6.5h-.3c-2.5 4.9-6.4 7.4-11.5 7.4-3.5 0-6.1-1.2-7.8-3.5-1.7-2.3-2.5-5.9-2.5-10.9V25.7h12v39.1c0 2.4.3 4.1.8 5.1s1.4 1.5 2.6 1.5c1 0 2-.3 3-1 1-.6 1.7-1.4 2.1-2.4V25.7z" class="st2"/><path id="path7445" d="M274.2 15.7h-11.9v63.2h-11.7V15.7h-11.9V6h35.5z" class="st2"/><path id="path7447" d="M342.8 34.2c-.7-3.4-1.9-5.8-3.5-7.3s-3.9-2.3-6.7-2.3c-2.2 0-4.3.6-6.2 1.9-1.9 1.2-3.4 2.9-4.4 4.9h-.1V3.3h-11.6v75.6h9.9l1.2-5h.3c.9 1.8 2.3 3.2 4.2 4.3 1.9 1 3.9 1.6 6.2 1.6 4.1 0 7-1.9 8.9-5.6 1.9-3.7 2.9-9.6 2.9-17.5v-8.4c-.1-6.1-.4-10.8-1.1-14.1zm-11 21.7c0 3.9-.2 6.9-.5 9.1-.3 2.2-.9 3.8-1.6 4.7-.8.9-1.8 1.4-3 1.4-1 0-1.9-.2-2.7-.7-.8-.5-1.5-1.2-2-2.1V38.1c.4-1.4 1.1-2.6 2.1-3.6 1-.9 2.1-1.4 3.2-1.4 1.2 0 2.2.5 2.8 1.4.7 1 1.1 2.6 1.4 4.8.3 2.3.4 5.5.4 9.6v7z" class="st2"/></g></g></svg>
            </div>
            <input type="search" 
                id="newVideo" 
                class="block w-full p-4 pl-32 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="paste youtube url here..." 
                required>
            <select id="videoCategory"
                class="absolute right-28 bottom-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
            </select>  
            <button type="submit" 
                id="addVideo"
                class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                save video
            </button>
        </div>`;
        formContainer.appendChild(form);
        this.appContainer.appendChild(formContainer);


        this.input = document.querySelector('#newVideo');
        this.button = document.querySelector('#addVideo');
        this.select = document.querySelector('#videoCategory');
        
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

        this.registerAddVideoEvent();
    }

    updateStorage() {
        localStorage.setItem('videos', JSON.stringify(this.videos));
    }

    renderNavigation(){

        const navigationContainer = document.createElement('nav');
        navigationContainer.classList.add('container', 'mx-auto', 'text-sm', 'font-medium', 'text-center', 'text-gray-500', 'border-b', 'border-gray-200', 'dark:text-gray-400', 'dark:border-gray-700');

        const navigationList = document.createElement('ul');
        navigationList.id = 'navigationList';
        navigationList.classList.add('flex', 'flex-wrap', '-mb-px');

        navigationContainer.appendChild(navigationList);

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

        this.appContainer.appendChild(navigationContainer);
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
            
            this.renderVideos(category); //this may be the problem

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
            this.modalContent.innerHTML = '';
            this.modal.hide();
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
            this.currentCategory = 'all';
            this.renderAllVideos(videosContainer);
        } else {
            this.currentCategory = renderCategory;
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
            this.videos[category].forEach( (video, index) => {
                const videoContainer = document.createElement('div');
                videoContainer.classList.add('relative');
                videoContainer.setAttribute('data-index', index);
                videoContainer.innerHTML = `
                    <img draggable="true" src="https://img.youtube.com/vi/${video}/0.jpg" alt="video" class="draggable cursor-pointer" />
                    <button type="button" class="absolute top-2 right-1 text-gray-400 bg-gray-100 hover:bg-gray-300 hover:text-gray-900 rounded-lg text-sm p-0.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    </button>
                `;
                videosGrid.appendChild(videoContainer);

                this.registerRemoveVideoEvent(video, category, videoContainer);

                this.registerAddVideoToModalEvent(video, videoContainer);
            });

            //this.addDragAndDropEvents();
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
      
        this.videos[category].forEach( (video, index) => {
            const videoContainer = document.createElement('div');
            videoContainer.classList.add('relative');
            videoContainer.setAttribute('data-index', index);
            videoContainer.innerHTML = `
            <img draggable="true" src="https://img.youtube.com/vi/${video}/0.jpg" alt="video" class="draggable cursor-pointer" />
            <button type="button" class="absolute top-2 right-1 text-gray-400 bg-gray-100 hover:bg-gray-300 hover:text-gray-900 rounded-lg text-sm p-0.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </button>
            `;
            videosGrid.appendChild(videoContainer);

            this.registerRemoveVideoEvent(video, category, videoContainer);

            this.registerAddVideoToModalEvent(video, videoContainer);
        });

        this.addDragAndDropEvents();
    }

    addDragAndDropEvents() {
        const draggables = document.querySelectorAll('.draggable');
        const draggableList = document.querySelectorAll('.videos div');

        draggables.forEach( draggable => {
            draggable.addEventListener('dragstart', function(e) {
                this.dragStartIndex = +draggable.parentElement.getAttribute('data-index');
            }.bind(this));
        });

        draggableList.forEach( item => {
            item.addEventListener('dragover', function(e) {
                //console.log('dragover');
                e.preventDefault();
            });
            item.addEventListener('drop', function(e) {
                //console.log('dragDrop');
                const dragEndIndex = +item.getAttribute('data-index');
                this.swapVideos(this.dragStartIndex, dragEndIndex);
            }.bind(this));
            item.addEventListener('dragenter', function(e) {
                console.log('DragEnter');
                //console.log(this);
                item.classList.add('opacity-50');
            });
            item.addEventListener('dragleave', function(e) {
                item.classList.remove('opacity-50');
            });
        });
        
    }

    swapVideos(fromIndex, toIndex) {
        const itemOne = this.videos[this.currentCategory][fromIndex];
        const itemTwo = this.videos[this.currentCategory][toIndex];

        this.videos[this.currentCategory][fromIndex] = itemTwo;
        this.videos[this.currentCategory][toIndex] = itemOne;

        this.updateStorage(this.videos);
        this.renderVideos(this.currentCategory);
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
        const videoThumb = videoContainer.querySelector('img');
        videoThumb.addEventListener('click', function(e) {
            e.preventDefault();
            this.modalContent.innerHTML = `
                <iframe class="w-full h-96" src="https://www.youtube.com/embed/${video}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            `;
            this.modal.show();
        }.bind(this));
    }


    addVideo(category, videoId) {
        this.videos[category].push(videoId);
    }

}