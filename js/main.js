import 'flowbite';
import '../css/style.css'

const input = document.querySelector('#newVideo');
const button = document.querySelector('#addVideo');
const select = document.querySelector('#videoCategory');
const modal = document.querySelector('#iframeVideo');
const closeModal = document.querySelector('#closeModal');

const videos = JSON.parse(localStorage.getItem("videos") || JSON.stringify({}))

const categories = {
  'gaming': [],
  'coding': [],
  'photography': [],
  'gym': [],
};

initLocalStorageAndCategoriesSelect(categories, videos, select);

renderNavigation(categories);

button.addEventListener('click', function(e) {
  e.preventDefault();

  const video = input.value;
  const videoId = getYoutubeVideoId(video);
  const category = select.value;

  if(videoId) {
    if(!videos[category].includes(videoId)) {
      videos[category].push(videoId);
      localStorage.setItem("videos", JSON.stringify(videos));
      input.value = '';
      renderVideos();
    } else {
      alert('Video already added');
    }
  }

});

closeModal.addEventListener('click', function(e) {
  e.preventDefault();
  modal.innerHTML = '';
});

renderVideos();


// Functions

function renderNavigation(categories){
  const navigationList = document.querySelector('#navigationList');
  navigationList.innerHTML = `
    <li class="mr-2">
      <a href="#" class="inline-block p-4 rounded-t-lg border-b-2 border-gray-300 text-gray-600">all</a>
    </li>
  `;

  for(const category in categories) {
    const navigationItem = document.createElement('li');
    navigationItem.classList.add('mr-2');
    navigationItem.innerHTML = `
      <a href="#" class="inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">${category}</a>
    `;
    navigationList.appendChild(navigationItem);
  }
}

function initLocalStorageAndCategoriesSelect(categories, videos, select) {
  
  for(const category in categories) {
    const option = document.createElement('option');
    option.value = category;
    option.innerHTML = category;
    select.appendChild(option);
    if(!videos[category]){
      videos[category] = [];
    }
  };

  localStorage.setItem("videos", JSON.stringify(videos));
}


function renderVideos() {
  const videosContainer = document.querySelector('#videos');
  videosContainer.innerHTML = '';

  for(const category in videos) {

    const categoryContainer = document.createElement('div');
    categoryContainer.classList.add('category');

    renderCategoryTitle(categoryContainer, category);

    renderVideosCategoryGrid(categoryContainer, category);

    videosContainer.appendChild(categoryContainer);

  }

}

function renderCategoryTitle(parentContainer, category) {
  const categoryTitle = document.createElement('h2');
  categoryTitle.classList.add('category-title', 'text-2xl', 'font-bold', 'my-4');
  categoryTitle.innerHTML = category;
  parentContainer.appendChild(categoryTitle);
}

function renderVideosCategoryGrid(parentContainer, category) {
  const videosGrid = document.createElement('div');
  videosGrid.classList.add('videos', 'grid', 'grid-cols-6', 'gap-10');
  parentContainer.appendChild(videosGrid);

  videos[category].forEach( video => {
    const videoContainer = document.createElement('div');
    videoContainer.classList.add('relative');
    videoContainer.innerHTML = `
      <img src="https://img.youtube.com/vi/${video}/0.jpg" alt="video" class="cursor-pointer" data-modal-toggle="defaultModal" />
      <button type="button" class="absolute top-2 right-1 text-gray-400 bg-gray-100 hover:bg-gray-300 hover:text-gray-900 rounded-lg text-sm p-0.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
          <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
          <span class="sr-only">Close modal</span>
      </button>
    `;
    videosGrid.appendChild(videoContainer);

    const removeButton = videoContainer.querySelector('button');

    removeButton.addEventListener('click', function(e) {
      e.preventDefault();
      videos[category] = videos[category].filter( videoId => videoId !== video);
      localStorage.setItem("videos", JSON.stringify(videos));
      renderVideos();
    });

    videoContainer.addEventListener('click', function(e) {
      e.preventDefault();
      modal.innerHTML = `
        <iframe class="w-full h-96" src="https://www.youtube.com/embed/${video}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      `;
    });

  });
}

function getYoutubeVideoId(url){
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return (match&&match[7].length==11)? match[7] : false;
}

