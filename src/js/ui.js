import {philosophers} from "./api.js";
import { preventDefaults } from "./utils.js";
export{createPhiAvatarEl,showPhiInfos};
// for deciding night or day
let date = new Date();
let currentTime = date.getHours();

let fullscreen = document.getElementById("fullscreen")

// creating stars logic
function randomizePositions(id) {
    const header = document.getElementById(id);
    const stars = header.querySelectorAll('div');
    const maxX = header.clientWidth - 20;
    const maxY = header.clientHeight - 20; 
    stars.forEach((star,i) => {
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);
        
        star.style.left = `${randomX}px`;
        star.style.top = `${randomY}px`;
    });
}
    
//creates philosopher avatar based on searched string
function createPhiAvatarEl(phi,a12){
    let phiDiv = document.createElement("div");
    let nameDiv = document.createElement("div");
    let nameText = document.createElement("div");
    let phiImg = document.createElement("img");

    nameText.className = "phi-text"
    nameDiv.className = "phi-name-div";
    phiDiv.className = "phi-avatar";
    phiImg.className = "phi-img";

    phiDiv.setAttribute("data-id",phi.dataid);
    phiDiv.setAttribute("title", phi.name)
    nameText.innerText = phi.name;
    phiImg.src = `https://philosophersapi.com/${phi.images.illustrations.ill250x250}`
    phiImg.alt=phi.name

    phiDiv.appendChild(phiImg);
    nameDiv.appendChild(nameText);
    phiDiv.appendChild(nameDiv);

    a12.appendChild(phiDiv);
}
//bioscreen
function showPhiInfos(phi){

    clearA2111();
    let a2111 = document.getElementById("a2111");

    //name pic age
    let a21111 = document.createElement("div");
    a21111.id = "a21111";
    a2111.appendChild(a21111);
    //name age
    let a211111 = document.createElement("div")
    a211111.id = "a211111";
    const h2 = document.createElement("h2");
    const p = document.createElement("p");

    h2.innerText = phi.name;
    p.innerText = phi.lifeInterval;

    a211111.appendChild(h2);
    a211111.appendChild(p);

    a21111.appendChild(a211111);
    //picture
    const imgdiv = document.createElement("div");
    imgdiv.id = "a211112"
    const img = document.createElement("img");
    img.src = "https://philosophersapi.com"+phi.images.faceImages.face250x250;
    imgdiv.appendChild(img);

    a21111.appendChild(imgdiv);
    a2111.appendChild(a21111);

    //other details
    const a21112 = document.createElement("div");
    a21112.id = "a21112";
    const interestP = document.createElement("p");
    const interestB = document.createElement("b");
    const educateP = document.createElement("p");
    const educateB = document.createElement("b");
    const moreP = document.createElement("p");
    const moreB = document.createElement("b");
    const moreA = document.createElement("a");

    interestP.innerText = phi.interests;
    interestB.innerText = "Interests: ";
    interestP.insertBefore(interestB,interestP.firstChild);
    
    educateP.innerText = phi.educate;
    educateB.innerText = "Educated in: "
    educateP.insertBefore(educateB,educateP.firstChild);

    moreB.innerText = "More Info: ";
    moreA.href = phi.speLink;
    moreA.target = "blank"
    moreA.innerText = "Standford Page"; 
    moreP.appendChild(moreB);
    moreP.appendChild(moreA);

    a21112.appendChild(interestP);
    a21112.appendChild(educateP);
    a21112.appendChild(moreP);

    a2111.appendChild(a21112);

    //creates book div if it necessary
    let a21113 = document.createElement("div");
    a21113.id = "a21113";
    a2111.appendChild(a21113);
    //books container if it has
    if(phi.hasEbook){

        let p = document.createElement("p");
        let b = document.createElement("b");
        b.innerText = "Books";
        p.appendChild(b);
        a21113.appendChild(p);

        fetchEbooks();
        async function fetchEbooks(){
            let phiHttp = "https://philosophersapi.com/api/philosophers";
            try {
                let idResponse = await fetch(phiHttp);
                if(!idResponse.ok){
                    throw new Error("ebook id fetchi response ok değil");
                }

                let data = await idResponse.json();
                let pi = data.find(p => p.name == phi.name);
                
                let bookResponse = await fetch(phiHttp+`/ebooks/${pi.id}`);
                if(!bookResponse.ok){
                    throw new Error("bookresponseta hata");
                }

                let idData = await bookResponse.json();
                //fetching images of books and url's
                let imagediv = document.createElement("div");
                imagediv.id = "a211132";

                idData.librivoxAudiobooks.forEach(au => {
                    let bookImg = document.createElement("img");
                    let bookLink = document.createElement("a");

                    bookLink.className = "audiobook";

                    bookImg.src = "https://philosophersapi.com"+au.coverArtPath;
                    bookImg.className = "bookcover";
                    bookImg.setAttribute("audioid", au.id);

                    bookLink.appendChild(bookImg);
                    imagediv.appendChild(bookLink);
                })


                a21113.appendChild(imagediv);
            } catch (error) {
                console.error("ebook catchi : ",error)
            }
        }
    }else{
        a21113.style.display = "none";
    }

    //creates image slider container
    const a21114 = document.createElement("div");
    a21114.id = "a21114";
    //creates images
    const images = phi.images;

    for(const cat in images){
        for(let size in images[cat]){
            if(size == "ill500x500" || size == "full420x560" || size == "face500x500"){
                let imgEl = document.createElement("img");
                imgEl.src = `https://philosophersapi.com/${images[cat][size]}`;
                imgEl.className = "phi-images";
                if(size == "ill500x500"){
                    imgEl.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
                }
                a21114.appendChild(imgEl);
            }
        }
    }
    a2111.appendChild(a21114);

    let a21115 = document.createElement("div");
    a21115.id = "a21115";
    a2111.appendChild(a21115);
    fetchQuotes("all");
    
    //creates quotes
    async function fetchQuotes(per) {
        
        let quoteResponse = await fetch("https://philosophersapi.com/api/philosophers/"+phi.id);

        if(!(quoteResponse.ok)){
            throw new Error("quote response down")
        }
        let quoteData = await quoteResponse.json();

        if(per == "all"){
            quoteData.quotes.forEach((q,i)=> {
                    let quoteP = document.createElement("p");
                    quoteP.className = "quote";
                    quoteP.innerText = q.quote;

                    let quoteHr = document.createElement("hr");

                    a21115.appendChild(quoteP);
                    if(i != quoteData.quotes.length-1){
                        a21115.appendChild(quoteHr);
                    }
            })    
        }else{
            if(per / 5){


            }else{
                throw new Error("fetchquote parametresi sayı değil");
            }
        }   
    }
}



//clears a2111(details container)
export function clearA2111(){
    let a2111 = document.getElementById("a2111");
    a2111.innerHTML = `<div id="clear-a2111-btn" style="position: absolute;"></div>`;
}

















































//music player







































//creates audio html element with infos
export function createAudioEl(song){
    let audioUrl = URL.createObjectURL(song);
    let audioEl = document.createElement("audio");
    let audioDiv = document.createElement("div");
    let deletedivbtn = document.createElement("div");

    let songname = song.name.replace(/\.(mp3|mov|wav)$/i,"");
    
    
    deletedivbtn.className = "deletesong-btn";
    deletedivbtn.title = "delete from list"

    audioEl.className = "song";
    audioEl.src = audioUrl;

    audioDiv.className = "song";
    audioDiv.title = "double-click to play"
    audioDiv.innerText = songname;
    audioDiv.draggable = true;

    audioDiv.appendChild(audioEl);
    audioDiv.appendChild(deletedivbtn);
    a212121.appendChild(audioDiv);
}






// updating dynamic currenttime bar
export function updateDynamicBar(dblclickedsong,plays) {
    let dynamicbar = document.getElementById("dynamicplay");
    let progress = (dblclickedsong.currentTime / dblclickedsong.duration) * 100;
    
    dynamicbar.style.width = progress + "%"

    updateCurrRemTime(dblclickedsong);

    if(plays.playing && !dblclickedsong.paused){
            requestAnimationFrame(() => {
            updateDynamicBar(dblclickedsong,plays);
        });
    }
}

//formats time for calculating remaining song time
export function formatTime(seconds){
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2,"0")}`;
}

//updates current and remaining times
export function updateCurrRemTime(song){
    const currentDiv = document.getElementById("currenttime");
    const remainingDiv = document.getElementById("remainingtime");

    currentDiv.innerText = formatTime(song.currentTime);
    
    let remainingtime = song.duration - song.currentTime;
    remainingDiv.innerText = formatTime(remainingtime);

}












































//day/night mode
window.onload=function(){
    randomizePositions(`h1`);
}
let button = document.querySelector("button");
button.addEventListener("click", toggleDayNight);
function toggleDayNight(){
    let html = document.querySelector("html");
    let body = document.body;
    let main = document.querySelector("main");
    
    if(html.className == "day"){  
        let header = document.querySelector("header");
        header.remove();
        html.style.opacity = 1;
        html.style.background = "none";
        main.style.marginTop = "100px";

        let nightCont = document.createElement("div");
        nightCont.id = "nightCont";

        const fragment = document.createDocumentFragment();
        for (let i = 0; i < 800; i++) {
            let el = document.createElement("div");
            el.classList = "star"
            fragment.appendChild(el);
        }
        nightCont.appendChild(fragment);
        body.prepend(nightCont);
        html.className = "night";

        window.onload=randomizePositions("nightCont");
    }else{
        html.style.background="var(--day)";
        main.style.marginTop = 0;

        html.className = "day";

        document.getElementById("nightCont").remove();

        let header = document.createElement("header");
        let h1 = document.createElement("div");
        let h2 = document.createElement("div");
        let h21 = document.createElement("div");
        
        h1.id = "h1", h2.id = "h2", h21.id = "h21";

        for (let i = 0; i < 30; i++) {
            let el = document.createElement("div");
            el.classList = "star"
            h1.appendChild(el);
        }

        header.appendChild(h1);
        h2.appendChild(h21);
        header.appendChild(h2);
        body.prepend(header);

        window.onload =randomizePositions("h1");
    }
}


