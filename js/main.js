import '../css/style.css'

const input = document.querySelector('#newVideo');
const button = document.querySelector('#addVideo');

const videos = [];

button.addEventListener('click', function(e) {
  e.preventDefault();
  const video = input.value;
  const videoId = getYoutubeVideoId(video)

  if(videoId) {
    if(!videos.includes(videoId)) {
      videos.push(videoId);
      renderVideos();
    } else {
      alert('Video already added');
    }
  }

});

function renderVideos() {
  const videosContainer = document.querySelector('#videos');
  videosContainer.innerHTML = '';
  videos.forEach( video =>  {
    const videoContainer = document.createElement('div');
    videoContainer.innerHTML = `
      <iframe width="360" height="280" src="https://www.youtube.com/embed/${video}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `;
    videosContainer.appendChild(videoContainer);
  });
}

function getYoutubeVideoId(url){
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return (match&&match[7].length==11)? match[7] : false;
}

renderVideos();
