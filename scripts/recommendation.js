const BASE_URL_3 = "https://www.googleapis.com/youtube/v3";
const API_KEY_3 = "AIzaSyCkJL7aWZ0XqGopK1r-X0XX8n7sA2L5uC4";


const recommendationContainer = document.getElementById("recommendation");

async function getVideos(searchString) {
    const url = `${BASE_URL_3}/search?key=${API_KEY_3}&q=${searchString}&part=snippet&type=video&maxResults=20`;
    try{
        const response = await fetch(url,{
            method:'get'
        });
        const data = await response.json();
        const videos = data.items;
        if(videos === undefined)
        {
            throw error;
        }
        getVideoData(videos);
    }catch (error) {
        recommendationContainer.innerHTML = '';
        recommendationContainer.innerHTML += 
        `<div class="error">
            No Recommendation
        </div>`

    }
}

async function getVideoData(videos) {
    let videoData = [];
    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      const videoId = video.id.videoId;
      videoData.push(await getVideoDetails(videoId));
    }
  
    renderVideos(videoData);
  }
  
  async function getVideoDetails(videoId) {
    const url = `${BASE_URL_3}/videos?key=${API_KEY_3}&part=snippet,contentDetails,statistics&id=${videoId}`;
    const response = await fetch(url, {
      method: "get",
    });
    const data = await response.json();
    return data.items[0];
  }


  function renderVideos(videos){
    recommendationContainer.innerHTML = '';
    videos.forEach(video => {
        const thumbnailUrl = video.snippet.thumbnails.high.url;
        recommendationContainer.innerHTML += `
                                        <div class="video-recommend" onclick="openVideoDetails('${video.id}')">
                                        <div class="video-card">
                                            <div class="thumbnail">
                                                <img src="${thumbnailUrl}" alt="logo">
                                            </div>
                                            <div class="recommend-content">
                                                <div class="owner-title">
                                                    <span class="video-desc">${video.snippet.title}</span>
                                                </div>
                                                <div class="owner-name">
                                                    <span>${video.snippet.channelTitle}</span>
                                                </div>
                                                <div class="views-upload-date">
                                                    <span>15k views </span>
                                                    <span>1 week ago</span>
                                                </div>
                                            </div>
                                        </div> 
                                    </div>
                                        `
    });
}

function openVideoDetails(videoId) {
    localStorage.setItem("videoId", videoId);
    window.open("/videoDetails.html");
}

getVideos("")