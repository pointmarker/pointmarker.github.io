import { philosophers,fetchPhilosopherData, showAllPhi } from "./api.js";
import { createPhiAvatarEl, showPhiInfos,clearA2111,createAudioEl ,updateDynamicBar,updateCurrRemTime} from "./ui.js";
import { preventDefaults } from "./utils.js";

let main = document.querySelector("main");

//document enter
document.addEventListener("DOMContentLoaded", async () => {
    await fetchPhilosopherData();
    showAllPhi(philosophers)
})

let firstClose = true;
//main window
window.addEventListener("click", (e) => {
    if(e.target.id == "close-fullscreen-btn"){
        let fullscreen = document.getElementById("fullscreen");
        if(firstClose){
            fullscreen.classList.add("fadeout");
            firstClose = false;
            fullscreen.addEventListener("transitionend", function() {
                fullscreen.remove();
            });
        }else{
            fullscreen.remove();
        }
    }
})

//seeing resize event on window
window.addEventListener("keydown",(e)=> {
})

// first screen events
let a12 = document.getElementById("a12");
a12.addEventListener("click",(e) => {
    
    //philist
    if(e.target.className == "phi-avatar" ||e.target.className ==  "phi-img" ||e.target.className ==  "phi-name-div" || e.target.className == "phi-text"){
        if(e.target.querySelector(".phi-avatar") || e.target.closest(".phi-avatar")){
            let id = e.target.querySelector(".phi-avatar") || e.target.closest(".phi-avatar");
            let idVal = id.getAttribute("data-id");
            let phi = philosophers.find(p => p.dataid == idVal);
            showPhiInfos(phi);
        }
    }
})
//searchbar
let searchBar = document.getElementById("a1111");
let timeOut;
searchBar.addEventListener("keyup", (e) => {

    clearTimeout(timeOut);
    let a12 = document.getElementById("a12");
    a12.innerHTML = "";
    if(searchBar.value.trim() == ""){showAllPhi(philosophers)};
    timeOut = setTimeout(() => {
        let value = e.target.value;
        let startsWith = philosophers.filter(phi => {
            return phi.name.split(/[-\s]+/).some(name => name.toLowerCase().startsWith(value.toLowerCase())) 
            });
        if((startsWith[0] != undefined)){
            startsWith.forEach(p => createPhiAvatarEl(p,a12))
            
        }else if(value.trim() != "" || !(parseInt(value.trim())))
            {
            let valueKeys = value.split("");
            let result =[];
            philosophers.forEach(
                phi => {
                const control = valueKeys.some(key=> phi.name.toLowerCase().includes(key));
                if(control){
                    result.push(phi.name);
                }
            });
            let final = [];
            for(let phi of result){
                let phiNameList = phi.split(/[-\s]+/);
                let groupPoint = 0;
                for(let p of phiNameList){
                    let pkeylist = p.split("");
                    let letterPoint = 0;
                    let topListPoint = 0;
                    let topList = new Set();
                    let carpimCounter = 1;
                    for (let vk of valueKeys){
                        let vki = 1;
                        let pki = 1;
                        for(let pk of pkeylist){
                            if(vk.toLowerCase()==pk.toLowerCase()){
                                topList.add(vki);
                                break;}
                            else{if(pki==pkeylist.length-1){carpimCounter++}}
                            pki++;
                            vki++;
                        }
                    }
                    let topListArray = [...topList];
                    let sortedList = [...topList].sort();
                    let difference = 0;
                    let j = 0;
                    for (let n of topListArray){
                        difference += Math.abs(n-sortedList[j]);
                        j++;
                    }
                    let i = 0;
                    let isInline = 0;
                        for(let n of topListArray){
                            if(i != topListArray.length-1){
                                if(topListArray[i]>topListArray[i+1]){
                                    topListPoint += (topListArray[i])*2;
                                    isInline++
                                }else{
                                    topListPoint+= topListArray[i];
                                }
                            }else{
                                if(topListArray[i] < topListArray[i-1]){
                                    topListPoint+= topListArray[i]*2;
                                    isInline ++;
                                }
                            }
                            i++;
                        }
                        if(carpimCounter > topListArray.length){
                            carpimCounter += Math.abs(carpimCounter - topListArray.length); 
                        }
                        
                        letterPoint = (carpimCounter * p.length) + topListPoint;
                        if(topListPoint*2<carpimCounter){
                            letterPoint = 1000;
                        }else{
                            if(!(Math.abs(topListArray.length - valueKeys.length) > 2)){
                                if(topListArray.length == valueKeys.length){
                                    letterPoint = letterPoint / 4;
                                }
                                else if(topListArray.length-1 == valueKeys.length){
                                    letterPoint = letterPoint / 3;
                                }else{
                                    letterPoint = letterPoint / 2;
                                }
                            }
                            if(phi.includes(" ")){
                                letterPoint = letterPoint /2;
                            }
                            if(valueKeys.length > p.trim().length*1.5){
                                letterPoint = letterPoint*1.5;
                            }
                            else if(valueKeys.length+2 || valueKeys.length-2 > p.trim().length){
                                letterPoint = letterPoint*1.3;
                            }
                            else if(valueKeys.length > p.trim().length *3){
                                letterPoint = letterPoint *2.5;
                            }
                            if(valueKeys.length / 2 > topListArray.length && difference != 0){
                                letterPoint = letterPoint *1.5
                            }else if(valueKeys.length / 1.5 < topListArray.length && difference == 0){
                                letterPoint = letterPoint / 2
                            }
                        }
                        if(groupPoint != 0){
                            if(groupPoint > letterPoint){
                                groupPoint = letterPoint;
                            }
                        }else{
                            groupPoint = letterPoint;
                        }
                }
                final.push({[phi]: groupPoint});
            }
            final.sort((a,b) => {
                const keya = Object.keys(a)[0];
                const keyb = Object.keys(b)[0];
                return a[keya] - b[keyb];
            })
            let top5 = [];
            let values = [];
            let i = 0;
            for(let f of final){
                let entries = Object.entries(f);
                top5.push(entries[0][0]);
                values.push(entries[0][1]);
                if(i == 4){
                    break;
                }
                i++;
            }
            let sum =0;
            values.forEach(n => 
                sum += n
            )
            let whoWilShown = values.map(p=> {
                if(p < sum /5){
                    return p;
                }else{
                    return "";
                }
            })
            whoWilShown.forEach((w,i) => {
                if(w != ""){
                    let p = Object.values(philosophers).find(val => val.name === top5[i]);
                    createPhiAvatarEl(p,a12);
                }
            })
        }
    }, 100);
    
})


// second screen events
let a2111 = document.getElementById("a211");
a2111.addEventListener("click", (e) => {

    if(e.target.id  == "clear-a2111-btn"){
            clearA2111()
    }
    //phi images gets full screen
    if(e.target.className == "phi-images" || e.target.className == "bookcover"){
        let fullscreen = document.createElement("div");
        let closefullscreenbtn = document.createElement("div");
        let fullscreenImg = document.createElement("img");
        fullscreenImg.style.borderRadius = "10px"

        fullscreen.id = "fullscreen"
        closefullscreenbtn.id = "close-fullscreen-btn";

        fullscreenImg.src=e.target.src;
        fullscreen.appendChild(closefullscreenbtn);
        fullscreen.appendChild(fullscreenImg);

        main.appendChild(fullscreen);
    }
    
    

})
//bioscreen


//player
//sound deck

//otomated scrolling overflowed song name
let a21212 = document.getElementById("a21212");
let a2211 = document.getElementById("a2211");

[a21212,a2211].forEach(va => {
    va.addEventListener("mouseover", (e) => {
        let targetDiv = "";
        if(e.target.className == "song"){
            targetDiv = e.target.closest(".song");
        }
        else if(e.target.id=="a2211"){
            targetDiv = e.target.querySelector("#title");
        }
        if(targetDiv != ""){
            apply(targetDiv);
        }
        function apply(targetDiv){
            targetDiv.scrollLeft = targetDiv.scrollWidth - targetDiv.offsetWidth;
            setTimeout(() => {
                targetDiv.scrollLeft = targetDiv.offsetWidth - targetDiv.scrollWidth;
            },1000)
        }
            
    })
})

let selectedSong;
//dragging songs from playlist
a21212.addEventListener("dragstart", (e) => {
    if(e.target.className == "song"){
        selectedSong = e.target;
    }
})

//removing default settings for dragging
let a212121 = document.getElementById("a212121");
["dragenter","dragover","drop","dragleave"].forEach(ev => {
    a212121.addEventListener(ev,preventDefaults);
})

a212121.addEventListener("dragenter",() => a212121.classList.add("highlight"));
a212121.addEventListener("dragleave",() => a212121.classList.remove("highlight"));
//dropping musics
a212121.addEventListener("drop",(e) => {
    a212121.classList.remove("highlight");
    let dt = e.dataTransfer;
    if(dt.files[0] != undefined){
        if(dt.files.length > 1){
            let count = 0
            Array.from(dt.files).forEach((s,i) => {
                if(s.type == "audio/mp3" || s.type == "audio/wav" || s.type == "audio/mpeg"){
                    createAudioEl(s);
                }
                else{
                    count ++;
                    if(i == dt.files.length -1){
                        alert(`${count} files has wrong format, accepts only .mp3, .mpeg or .wav`);
                    }
                }
            })
        }else{
            if(dt.files[0].type == "audio/mp3" || dt.files[0].type == "audio/wav" || dt.files[0].type == "audio/mpeg"){
                createAudioEl(dt.files[0])
            }else{
                alert("only .mp3 , .mpeg or .wav formats accepted");
            }
        }
    }else{
        let newEl = selectedSong.cloneNode(true)
        a212121.insertBefore(newEl,e.target.closest(".song"));
        selectedSong.remove();
    }
})
//delete song from playlist
a212121.addEventListener("click", (e) => {
    if(e.target.className == "deletesong-btn"){
        e.target.closest(".song").remove();
    }
})


//listens clicked song
let plays = {
    song:"",
    playing: false
}
let currentSong = "";
//plays music
a21212.addEventListener("dblclick", (e) => {
    currentSong = e.target.querySelector("audio"); 
    if(e.target.className == "song"){
        document.getElementById("dynamicplay").style.width = 0;
        playLogic(currentSong,plays);
        let playButton = document.querySelector("#play i");
        playButton.classList.remove("fa-play");
        playButton.classList.add("fa-pause");
    }
})


//volume elements 
const slider = document.getElementById("volume");
const volumeVal = document.getElementById("volumeValue");

slider.addEventListener("input", (e) => {
    console.dir(e);
    volumeVal.textContent = slider.value;

    const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
    volumeVal.style.left = `calc(${value}%)`;
    volumeVal.style.transform = "translateX(-50%)";

    currentSong.volume = (slider.value) / 100;
})

//volume value visibility
slider.addEventListener("mouseenter", () => {
    volumeVal.style.display = "block"
})
slider.addEventListener("mouseleave", () => {
    volumeVal.style.display = "none";
})




//selecting song
a21212.addEventListener("click", (e) => {
    if(e.target.className == "song"){
        let titleName = document.getElementById("title");
        let elements = document.querySelectorAll("#a22121 *");

        titleName.innerText = e.target.closest(".song").innerText;
        currentSong = e.target.querySelector("audio");

        updateCurrRemTime(currentSong);
        Array.from(elements).forEach(el =>{
            el.style.opacity = "1";
            el.style.cursor = "pointer";
        } )
        
    }
})


//music control buttons
let a2212 = document.getElementById("a2212");
a2212.addEventListener("click", (e) => {
    if(e.target.classList.contains("fa-backward")){

    }
    else if(e.target.classList.contains("fa-forward")){
        
    }
    else if(e.target.classList.contains("fa-play")){
        if(currentSong != ""){
            playLogic(currentSong,plays);
            e.target.classList.remove("fa-play");
            e.target.classList.add("fa-pause");
            plays.playing = true;
        }
    }
    else if(e.target.classList.contains("fa-pause")){
        if(currentSong != ""){
            currentSong.pause();
            e.target.classList.remove("fa-pause");
            e.target.classList.add("fa-play");
            plays.playing = false;
        }
    }
})

//play logic
function playLogic(currentSong,plays){
    if(plays.playing == false){
        currentSong.play();
        plays.song = currentSong;
        plays.playing = true;
        requestAnimationFrame(() => {
            updateDynamicBar(currentSong,plays);
        })

    }else{
        plays.song.pause();
        currentSong.load();
        currentSong.play();
        plays.song = currentSong;
    }
}




