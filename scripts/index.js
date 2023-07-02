const BASE_URL = "https://www.googleapis.com/youtube/v3";
const API_KEY = "AIzaSyCkJL7aWZ0XqGopK1r-X0XX8n7sA2L5uC4";

const allVidoesContainer = document.getElementById("yt-uploaded-videos");

async function getVideos(searchString) {
    const url = `${BASE_URL}/search?key=${API_KEY}&q=${searchString}&part=snippet&type=video&maxResults=20`;
    try{
        const response = await fetch(url,{
            method:'get'
        });
        const data = await response.json();
        if(data===error)
        {
            throw error;
        }
        const videos = data.items;
        getVideoData(videos);
    }catch (error) {
        allVidoesContainer.innerHTML = '';
        allVidoesContainer.innerHTML += 
        `<div class="error">
            You Have reached a Today's Limit of Fetching API's
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
  
    // console.log(videoData);
    renderVideos(videoData);
  }
  
  async function getVideoDetails(videoId) {
    const url = `${BASE_URL}/videos?key=${API_KEY}&part=snippet,contentDetails,statistics&id=${videoId}`;
    const response = await fetch(url, {
      method: "get",
    });
    const data = await response.json();
    return data.items[0];
  }

const searchVideo = document.getElementById("search");
searchVideo.addEventListener("keyup" , (event) => {
    const keyword = event.target.value;
    getVideos(keyword)
})


function renderVideos(videos){
    allVidoesContainer.innerHTML = '';
    videos.forEach(video => {
        const thumbnailUrl = video.snippet.thumbnails.high.url;
        allVidoesContainer.innerHTML += `
                                    <div class="video-info" onclick="openVideoDetails('${video.id}')">
                                        <div class="video-card">
                                            <div class="thumbnail">
                                                <img src="${thumbnailUrl}" alt="logo">
                                            </div>
                                            <div class="owner-title">
                                                <span class="owner-photo"><img src="./Assets/images/Header/Profile.png" alt="owner pic"></span>
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
                                    </div>`
    });
}

function openVideoDetails(videoId) {
    localStorage.setItem("videoId", videoId);
    window.open("/videoDetails.html");
}

getVideos("")