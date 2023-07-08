const BASE_URL_1 = "https://www.googleapis.com/youtube/v3";
const API_KEY_1 = "AIzaSyCkJL7aWZ0XqGopK1r-X0XX8n7sA2L5uC4";

const videoContainer = document.getElementById("yt-videoId");

const videoId = localStorage.getItem("videoId");

const commentsContainer = document.getElementById("video-comment");

videoContainer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`


async function getVideoDetail() {
    const url = `${BASE_URL_1}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${API_KEY_1}`
    try {
        const response = await fetch(url, {
            method:"get"
        });
        const data = await response.json();
        document.title = `${data.items[0].snippet.channelTitle}`
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
    videoDesc.innerHTML = '';
    videoDesc.innerHTML = `
                    <div class="video-title">
                        ${video.items[0].snippet.title}
                    </div>
                    <div class="likes-views">
                        <div class="like-left">
                            <span>${video.items[0].statistics
                                .viewCount} views</span>
                          <span>Oct 8, 2021</span>
                        </div>
                        <div class="like-right">
                            <div class="video-desc-icons-container video-desc-like">
                                <button class="video-desc-btn">
                                    <img src="./Assets/images/videoDetails/like-dislike/video-desc-like.png" alt="like button">
                                </button>
                                <span>1.7k</span>
                            </div>
                            <div class="video-desc-icons-container video-desc-dislike">
                                <button class="video-desc-btn">
                                    <img src="./Assets/images/videoDetails/like-dislike/video-desc-dislike.png" alt="dislike button">
                                </button>
                                <span>623</span>
                            </div>
                            <div class="video-desc-icons-container video-desc-share">
                                <button class="video-desc-btn">
                                    <img src="./Assets/images/videoDetails/like-dislike/share.png" alt="share button">
                                </button>
                                <span>Share</span>
                            </div>
                            <div class="video-desc-icons-container video-desc-save">
                                <button class="video-desc-btn"><img src="./Assets/images/videoDetails/like-dislike/save.png" alt="save button"></button>
                                <span>Save</span>
                            </div>
                            <div class="video-desc-icons-container video-desc-others">
                                <button class="video-desc-btn"><img src="./Assets/images/videoDetails/like-dislike/hamburger-icon.png" alt="menu icon"></button>
                            </div>
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
    comments.forEach((comment, index) => {
        commentsContainer.innerHTML += `
                     <div id="comment-${index}" class="comment">
                        <div class="comment-person">
                            <img src="${comment.snippet.topLevelComment.snippet.authorProfileImageUrl}" alt="">
                        </div>
                        <div id="comment-info-${index}" class="comment-info">
                            <div class="person-name">
                                <span class="name">
                                    ${comment.snippet.topLevelComment.snippet.authorDisplayName}
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
                            <div id="reply-${index}" class="reply">
                                <div class="comment-like">
                                    <span>
                                        <img src="./Assets/images/videoDetails/like-dislike/like.png" alt="">
                                    </span>
                                    <span class="likeno">
                                    ${comment.snippet.topLevelComment.snippet.likeCount}
                                    </span>
                                </div>
                                <div class="comment-dislike">
                                    <span>
                                        <img src="./Assets/images/videoDetails/like-dislike/dislike.png" alt="">
                                    </span>
                                </div>
                                <button id="reply-btn" class="reply-btn" onclick="seeReply('${comment.id}', '${index}')">
                                    REPLY
                                </button>
                                <div class="reply-no">
                                    <span>${comment.snippet.totalReplyCount}</span>
                                </div>
                            </div>
                        </div>
                    </div>`
    });
}



const replyComment = document.getElementById("reply-comment");

let previousCommentId = null;

async function seeReply(commentId, index) {

    if(replyComment.style.display === 'none')
    {
        previousCommentId = commentId
    }
    else if(previousCommentId !== commentId)
    {
        previousCommentId = commentId;
        replyComment.style.display = 'none'
    }

    const eachComment = document.getElementById(`comment-info-${index}`)
    if(replyComment.style.display === 'none')
    {
        replyComment.style.display = 'flex';
        const url = `${BASE_URL_1}/comments?key=${API_KEY_1}&part=snippet&parentId=${previousCommentId}&maxResults=5`
        try {
            const response = await fetch(url, {
                method:"get"
            });
            const data = await response.json();
            const replies = data.items;
            renderReplies(replies);
            eachComment.appendChild(replyComment)
        } catch (error) {
            console.log("error,occured", error)
        }
    }
    else{
        replyComment.style.display = 'none'
    }
    
}

function renderReplies(replies) {
    replyComment.innerHTML = '';
    replies.forEach(reply => {
        replyComment.innerHTML += `
                        <div class="comment">
                            <div class="comment-person">
                                <img src="${reply.snippet.authorProfileImageUrl}" alt="">
                            </div>
                            <div class="comment-info">
                                <div class="person-name">
                                    <span class="name">${reply.snippet.authorDisplayName}</span>
                                    <span class="when">8 hours ago</span>
                                </div>
                                <div class="comment-type">
                                    <span>
                                    ${reply.snippet.textDisplay}
                                    </span>
                                </div>
                                <div class="reply">
                                    <div class="comment-like">
                                        <span>
                                            <img src="./Assets/images/videoDetails/like-dislike/like.png" alt="">
                                        </span>
                                        <span class="likeno">${reply.snippet.likeCount}</span>
                                    </div>
                                    <div class="comment-dislike">
                                        <span>
                                            <img src="./Assets/images/videoDetails/like-dislike/dislike.png" alt="">
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `
    });   
}

getVideoDetail();
getComments();