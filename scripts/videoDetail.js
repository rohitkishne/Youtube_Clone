const BASE_URL_1 = "https://www.googleapis.com/youtube/v3";
const API_KEY_1 = "AIzaSyCkJL7aWZ0XqGopK1r-X0XX8n7sA2L5uC4";

const videoContainer = document.getElementById("yt-videoId");

const videoId = localStorage.getItem("videoId");

const commentsContainer = document.getElementById("comment");

videoContainer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`


async function getVideoDetail(videoId) {
    const url = `${BASE_URL_1}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${API_KEY_1}`

    try {
        const response = await fetch(url, {
            method:"get"
        });
        const data = await response.json();
         
        renderVideoDetails(data);

    } catch (error) {
        const videoInfo = document.getElementById("videoInfo")
        videoInfo.innerHTML ='';
        videoInfo.innerHTML += `
                        <div>
                            Sorry No Data Found
                        </div>
                        `
    }
    
}

const videoDesc = document.getElementById("video-desc");

function renderVideoDetails(video) {
    videoDesc.innerHTML = `
                        <div class="video-title">
                            ${video.snippet.title}
                        </div>
                        <div class="likes-views">
                            <div class="like-left">
                                <span>${video.statistics.viewCount} views</span>
                                <span>Oct 8, 2021</span>
                            </div>
                            <div class="like-right">
                                <img src="./Assets/images/videoDetails/video-share/Top-Level.png" alt="">
                            </div>
                        </div>

                    `
}


async function getComments() {
    const url = `${BASE_URL_1}/commentThreads?key=${API_KEY_1}&part=snippet&videoId=${videoId}&maxResults=25&order=time`
    try {
        const response = await fetch(url, {
            method:"get"
        });
        const data = await response.json();

        const comments = data.items;

        renderComments(comments);

    } catch (error) {
        commentsContainer.innerHTML = '';
        commentsContainer.innerHTML +=`
                            <div class="comment-error">
                                Comments are not Found!
                            </div>
                                `
    }
}



function renderComments(comments) {
    commentsContainer.innerHTML = '';
    comments.forEach(comment => {
        commentsContainer.innerHTML += `
                        <div class="comment-person">
                            <img src="./Assets/images/Header/Profile.png" alt="">
                        </div>
                        <div class="comment-info">
                            <div class="person-name">
                                <span class="name">
                                    James Gouse
                                </span>
                                <span class="when">
                                    8 hours ago
                                </span>
                            </div>
                            <div class="comment-type">
                                <span>
                                    ${comment.snippet.topLevelComment.snippet.textDisplay}
                                </span>
                            </div>
                            <div class="reply">
                                <div class="comment-like">
                                    <span>
                                        <img src="./Assets/images/videoDetails/like-dislike/like.png" alt="">
                                    </span>
                                    <span class="likeno">
                                        3
                                    </span>
                                </div>
                                <div class="comment-dislike">
                                    <span>
                                        <img src="./Assets/images/videoDetails/like-dislike/dislike.png" alt="">
                                    </span>
                                </div>
                                <button class="reply-btn" onclick="seeReply('${comment.id}')">
                                    REPLY
                                </button>
                            </div>
                        </div>`
    });
}


// async function seeReply(commentId) {
    
//     const url = `${BASE_URL_1}/comments?key=${API_KEY_1}&part=snippet&parentId=${commentId}&maxResults=5`
//     try {
//         const response = await fetch(url, {
//             method:"get"
//         });
//         const data = await response.json();

//         const replies = data.items;

//         renderReplies(replies);

//     } catch (error) {
//         console.log(error)
//     }
// }

// function renderReplies(replies) {
    
// }

getVideoDetail(videoId);
getComments();