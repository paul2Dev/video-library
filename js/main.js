import 'flowbite';
import '../css/style.css'

const input = document.querySelector('#newVideo');
const button = document.querySelector('#addVideo');
const select = document.querySelector('#videoCategory');
const iframe = document.querySelector('#iframeVideo');
const closeModal = document.querySelector('#closeModal');

const videos = JSON.parse(localStorage.getItem("videos") || JSON.stringify({}))

const categories = {
  'gaming': [],
  'coding': [],
  'photography': [],
  'gym': [],
};

initLocalStorageAndCategoriesSelect(categories, videos, select);

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
  iframe.innerHTML = '';
});

renderVideos();


// Functions

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
    videoContainer.innerHTML = `
      <img src="https://img.youtube.com/vi/${video}/0.jpg" alt="video" class="cursor-pointer" data-modal-toggle="defaultModal" />
    `;
    videosGrid.appendChild(videoContainer);

    videoContainer.addEventListener('click', function(e) {
      e.preventDefault();
      iframe.innerHTML = `
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

