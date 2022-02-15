// 사이드바 스타일 꾸미기
// 페이지 리스트 설정
// 초기 이미지, 배경 설정
// 매우 디테일한 기능들은 후순위
let news = [];
let url = new URL(
  "https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10"
);
const apiKey = "vq01P3HWuOsEDmdK2FK2gp_9Q00Tjfa1VONOQiIRU1Q";
let header = new Headers({
  "x-api-key": apiKey,
});

let searchInput = document.getElementById("search-input");
let btnSearch = document.getElementById("btn-search");
let mainImg = document.getElementById("main-img");
let menuList = document.querySelectorAll("#menu-list button");

const getNews = async () => {
  let response = await fetch(url, { headers: header });
  let data = await response.json();
  news = data.articles;
  console.log(news);
  render();
};

const getLatestNews = () => {
  searchInput.value = "";
  url = new URL(
    "https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10"
  );
  getNews();
};

const getNewsByTopic = (e) => {
  searchInput.value = "";
  let topic = e.target.textContent.toLowerCase();
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=${topic}&page_size=10`
  );
  console.log("clicked!! " + topic);
  getNews();
};

const searchNews = () => {
  console.log("Go search!!");
  let inputValue = searchInput.value;
  if (inputValue == "") {
    alert("내용을 입력하주세요.");
    return;
  }
  url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${inputValue}&page_size=10`
  );
  getNews();
};

const render = () => {
  let newsHtml = "";
  newsHtml = news
    .map((item) => {
      checkNull(item);
      return `<div class="row news">
              <div class="col-lg-4 col-sm-12">
                <img
                  class="news-img-size"
                  src="${item.media}"
                />
              </div>
              <div class="content col-lg-8 col-sm-12">
                <a class="title" target="_blank" href="${item.link}">
                  ${item.title}</a>
                <p>
                  ${item.summary}
                </p>
                <div>
                  ${item.rights}
                  ${moment(item.published_date).fromNow()}
                </div>
              </div>
            </div>`;
    })
    .join("");
  document.getElementById("news-board").innerHTML = newsHtml;
};

const checkNull = (item) => {
  if (item.media == null) {
    item.media =
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU";
  }
  if (item.summary == null || item.summary == "") {
    item.summary = "내용 없음";
  }
  if (item.summary.length >= 200) {
    item.summary = item.summary.substring(0, 200) + "...";
  }
  if (item.rights == null) {
    item.rights = "no-source";
  }
  return;
};

const openNav = () => {
  document.getElementById("mySidenav").style.width = "250px";
};

const closeNav = () => {
  document.getElementById("mySidenav").style.width = "0";
};

const openSearchBox = () => {
  let inputArea = document.getElementById("input-area");
  if (inputArea.style.display === "inline") {
    inputArea.style.display = "none";
  } else {
    inputArea.style.display = "inline";
  }
};

getLatestNews();
searchInput.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    searchNews(e);
  }
});
mainImg.addEventListener("click", getLatestNews);
menuList.forEach((item) => {
  item.addEventListener("click", (e) => getNewsByTopic(e));
});
