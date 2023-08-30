let totalItems = 0;
let totalPages = 0;
let currentPage = 1;
let itemPerPage = 8;
let categories;
let movieWrapper = document.querySelector(".moviewrapper");
let pageDisplay = document.querySelector(".page-display");

const nextBtn = document.querySelector(".next-btn");
const prevBtn = document.querySelector(".prev-btn");

async function fetchData() {
    try {
        const resp = await fetch("https://api.tvmaze.com/shows");
        const response = await resp.json();
        totalItems = response.length;
        totalPages = Math.ceil(totalItems / itemPerPage);
        return response;
    } catch (error) {
        console.log(error);
    }
}
// let likeCounter = 0

function displayPage(pageNumber, data) {
    let startIndex = (pageNumber - 1) * itemPerPage; // where to start. always dependent on the current page ('-1 because arr are index based)
    let endIndex = startIndex + itemPerPage; //where to end
    let currentPageData = data.slice(startIndex, endIndex); // the set of data for the current page
    movieWrapper.innerHTML = ""; // always reset the responseDiv. You can comment it to see the page behaviour
    currentPageData.forEach((cat) => {
        let likeCounter = 0;
        let movie = document.createElement("div");
        let movieImage = document.createElement("img");
        movieImage.style.cursor = "pointer";
        let movieicons = document.createElement("div");

        let size = document.createElement("div");
        let likeicon = document.createElement("div");
        let likeCount = document.createElement("div");
        let comments = document.createElement("div");

        movie.className = "movie";
        movieImage.className = "movieImage";
        movieicons.className = "movieicons";
        size.className = "size";
        likeicon.className = "likeicon";
        likeCount.className = "likecount";
        comments.className = "comments";

        movieImage.src = `${cat.image.medium}`;
        comments.innerHTML = `comments`;
        let iconEl = document.createElement("i");
        iconEl.className = "fas fa-heart";
        likeicon.appendChild(iconEl);
        size.innerText = `${cat.weight}mb`;
        likeCount.innerText = `${likeCounter}likes`;


        movieicons.appendChild(size);
        movieicons.appendChild(likeicon);
        movieicons.appendChild(likeCount);

        movie.appendChild(movieImage);
        movie.appendChild(movieicons);
        movie.appendChild(comments);

        let overlay = popUpPage(cat);
        
        comments.addEventListener("click", () => {
            overlay.style.display = "block";
        });
        movieImage.addEventListener("click", () => {
            overlay.style.display = "block";
        });

        movieWrapper.appendChild(movie);
        likeicon.addEventListener("click", () => {
            likeCounter++;
            likeCount.innerText = `${likeCounter}likes`;
            console.log(likeCounter);
        });
    });
}

function popUpPage(data) {
    let mainDiv = document.createElement("div");
    let innerDiv = document.createElement("div");
    let commentDiv = document.createElement("div");
    let tvInfo = document.createElement("div");
    let form = document.createElement("form");
    let movHead = document.createElement("h1");
    let movCard = document.createElement("img");
    let description = document.createElement("p");
    let wrapper = document.createElement("div");

    let paragraph0 = document.createElement("h1");
    let paragraph1 = document.createElement("p");
    let paragraph2 = document.createElement("p");
    let paragraph3 = document.createElement("p");
    let paragraph4 = document.createElement("p");
    let paragraph5 = document.createElement("p");
    let paragraph6 = document.createElement("p");
    let paragraph7 = document.createElement("p");
    let paragraph8 = document.createElement("p");

    let nameDiv = document.createElement("div");
    nameDiv.className = 'nameDiv'
    let nameLabel = document.createElement("label");
    nameLabel.innerText = `Name`;
    let nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = `Enter Name here`;

    nameDiv.append(nameLabel, nameInput);
    form.appendChild(nameDiv);

    let commentDiver = document.createElement("div");
    commentDiver.className = 'commentDiver'
    let commentLabel = document.createElement("label");
    commentLabel.innerText = `Comments`;
    let commentInput = document.createElement("textarea");
    commentInput.type = "text";
    commentInput.placeholder = `Enter Comments`;

    commentDiver.append(commentLabel, commentInput);
    form.appendChild(commentDiver);

    let submitdiv = document.createElement("div");
    let submit = document.createElement("button");
    submit.className = 'submit'
    submit.innerText = `submit`;
    submitdiv.appendChild(submit);
    form.appendChild(submitdiv);

    let commentHeader = document.createElement('h1')
    commentHeader.innerText = 'All Comments'
    commentHeader.style.marginTop = '80px'
    form.appendChild(commentHeader)

    let allComments = document.createElement("div");
    let commentUl = document.createElement("ul");
    commentUl.className = 'comcon'
    allComments.appendChild(commentUl);
    form.appendChild(allComments);

    mainDiv.appendChild(innerDiv);
    innerDiv.appendChild(wrapper);
    wrapper.appendChild(commentDiv);
    wrapper.appendChild(tvInfo);
    wrapper.appendChild(form);
    tvInfo.append(
        paragraph0,
        paragraph1,
        paragraph2,
        paragraph3,
        paragraph4,
        paragraph5,
        paragraph6,
        paragraph7,
        paragraph8
    );

    paragraph0.innerText = `TV INFO`;
    paragraph1.innerText = `type: ${data.type}`;
    paragraph2.innerText = `language: ${data.language}`;
    paragraph3.innerText = `runtime: ${data.runtime}`;
    paragraph4.innerText = `premiered: ${data.premiered}`;
    paragraph5.innerText = `ended: ${data.ended}`;
    paragraph6.innerText = `officialsite: ${data.officialSite}`;
    paragraph7.innerText = `rating: ${data.rating.average}`;
    paragraph8.innerText = `weight: ${data.weight}`;
    commentDiv.appendChild(movHead);
    movHead.innerText = data.name;
    commentDiv.appendChild(movCard);
    movCard.src = data.image.medium;
    commentDiv.appendChild(description);
    description.innerHTML = data.summary;
    document.body.appendChild(mainDiv);

    wrapper.className = "innerwrapper";
    mainDiv.className = "mainDiv";
    innerDiv.className = "innerDiv";
    commentDiv.className = "commentDiv";
    tvInfo.className = "tvInfo";
    form.className = "form";
    movCard.className = "movCard";
    movHead.className = "movHead";
    description.className = "description";

    mainDiv.style.display = "none";

    mainDiv.addEventListener("click", () => {
        overlay.style.display = "none";
    });

    

    submit.addEventListener("click", async (e) => {
        e.preventDefault()
        let response = await fetch(
            "https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/c1RJ5M0hPMqFyVu0gTpA/comments",
            {
                method: "POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    item_id: data.id,
                    username: nameInput.value,
                    comment: commentInput.value
                }),
            }
        );
        nameInput.innerText =''
        commentInput.innerText =''
        if (response.ok) {
            console.log("comment succesful");
            fetchComments(data.id)
        } else {
            console.log("unsucessful");
        }
    });

    async function fetchComments (id){
       await fetch(`https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/c1RJ5M0hPMqFyVu0gTpA/comments?item_id=${id}`)
        .then(response=> {return response.json()})
        .then(res=>{ 
            
            res.forEach(item=>{
            // commentUl.innerHTML =''
            let li = document.createElement('li')
            li.className = 'commentlist'
            li.innerHTML = `name:${item.username} <br/> comment:${item.comment}<br/> date:${item.creation_date}`
            commentUl.appendChild(li)
        })} )
        .catch(err=> console.log (err))
        
        
    }
    fetchComments(data.id)


    return mainDiv;
}

async function next() {
    if (totalPages == currentPage) {
        return;
    }
    currentPage += 1; //first, increases the current page
    const response = await fetchData(); //data is fetched
    displayPage(currentPage, response); // fetches and displays the data by the current page
}

async function prev() {
    if (currentPage < 2) {
        console.log("not going");
        return; // ensures the current page is a positive integer
    }
    currentPage -= 1; //subtracts 1
    const response = await fetchData();
    displayPage(currentPage, response); // fetches and displays the data by the current page
}

nextBtn.addEventListener("click", next); // event listener for next button click
prevBtn.addEventListener("click", prev); //event listener for prev button click

// async function displayPaginationButtons() {
//     const paginationDiv = document.querySelector(".pagination-btn");
//     const response = await fetchData();
//     for (let i = 0; i < totalPages; i++) {
//         const btn = document.createElement("button");
//         btn.classList.add("page-btn");
//         btn.innerText = i + 1;
//         btn.addEventListener("click", () => {
//             currentPage = i + 1;
//             displayPage(currentPage, response);
//         });
//         paginationDiv.appendChild(btn);
//     }
// }

async function sendComments() {
    // const url = https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/YplZCILezIpAlZvquBKY/comments
}

async function getTheAppRunning() {
    const response = await fetchData(); // fetch data on file load and destructure out the categories
    // displayPaginationButtons();
    displayPage(currentPage, response); // go ahead and display the first page count data in our case itemPerPage is 3
}

getTheAppRunning();
