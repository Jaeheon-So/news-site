let news = [];
let page = 1;
let totalPage = 0;
let url = new URL(
  "https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10"
);
const apiKey = "h-MTLxJ5rPB3QlJrVRLt5yJdB7IXgStQEX85IqLpGwI";
let header = new Headers({
  "x-api-key": apiKey,
});

let searchInput = document.getElementById("search-input");
let btnSearch = document.getElementById("btn-search");
let mainImg = document.getElementById("main-img");
let menuList = document.querySelectorAll("#menu-list button");

const getNews = async () => {
  try {
    url.searchParams.set("page", page);
    let response = await fetch(url, { headers: header });
    let data = await response.json();
    if (response.status == 200) {
      if (data.total_hits == 0) {
        throw new Error(data.status);
      }
      news = data.articles;
      page = data.page;
      totalPage = data.total_pages;
      console.log(news);
      render();
      pageRender();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.log("Error: " + error.message);
    errorRender(error.message);
  }
};

const getLatestNews = () => {
  page = 1;
  searchInput.value = "";
  url = new URL(
    "https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10"
  );
  getNews();
};

const getNewsByTopic = (e) => {
  page = 1;
  searchInput.value = "";
  let topic = e.target.textContent.toLowerCase();
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=${topic}&page_size=10`
  );
  console.log("clicked!! " + topic);
  window.scrollTo({ top: 0, behavior: "smooth" });
  getNews();
};

const searchNews = () => {
  page = 1;
  console.log("Go search!!");
  let inputValue = searchInput.value;
  if (inputValue == "") {
    alert("내용을 입력하주세요.");
    return;
  }
  url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${inputValue}&page_size=10`
  );
  window.scrollTo({ top: 0, behavior: "smooth" });
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

const pageRender = () => {
  let paginationHtml = "";
  let pageGroup = Math.ceil(page / 5);
  let last = pageGroup * 5;
  if (last > totalPage) {
    last = totalPage;
  }
  let first = last - 4 <= 0 ? 1 : last - 4;
  if (first >= 6) {
    paginationHtml = `<li class="page-item" onclick="pageClick(1)">
                        <a class="page-link" href='#'>&lt;&lt;</a>
                      </li>
                      <li class="page-item" onclick="pageClick(${page - 1})">
                        <a class="page-link" href='#'>&lt;</a>
                      </li>`;
  }
  for (let i = first; i <= last; i++) {
    paginationHtml += `<li class="page-item ${i == page ? "active" : ""}">
                        <a class="page-link" href="#" onclick="pageClick(${i})">${i}</a>
                      </li>`;
  }
  if (last < totalPage) {
    paginationHtml += `<li class="page-item" onclick="pageClick(${page + 1})">
                        <a  class="page-link" href='#'>&gt;</a>
                       </li>
                       <li class="page-item" onclick="pageClick(${totalPage})">
                        <a class="page-link" href='#'>&gt;&gt;</a>
                       </li>`;
  }
  document.querySelector(".pagination").innerHTML = paginationHtml;
};

const errorRender = (message) => {
  let errorHtml = `<h2 class="text-center alert alert-danger mt-1">${message}</h2>`;
  document.getElementById("news-board").innerHTML = errorHtml;
};

const pageClick = (pageNum) => {
  page = pageNum;
  window.scrollTo({ top: 0, behavior: "smooth" });
  getNews();
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
