export {philosophers,fetchPhilosopherData,showAllPhi}
import { createPhiAvatarEl } from "./ui.js";


let philosophers = [];
let interests = [];

let isFetched = false;
// classic fetch funtion and have details to philosophers array
async function fetchPhilosopherData(){
    if(isFetched) return;
    isFetched = true;

    let philosophersHttp = "https://philosophersapi.com/api/philosophers";
    try {
        let response = await fetch(philosophersHttp);
        if(!response.ok){
            throw new Error("response.ok false");
        }
        let data = await response.json();
        data.map(phi => {
            let phiInfo = {
                name: phi.name,
                lifeInterval: `${phi.birthDate} - ${phi.deathDate}`,
                interests: phi.interests,
                images: phi.images,
                educate: phi.school,
                hasEbook: phi.hasEBooks,
                speLink : phi.speLink,
                id:phi.id
            }
            philosophers.push(phiInfo);
        })
        let i = 1;
        philosophers.map(p => {
            p.dataid = i;
            i++
        })
        sortingJson(philosophers).forEach(int => interests.push(int));
        
    } catch (error) {
            console.error("catch kısmı hata kodu :",error);
    }
}

// creates phi avatar screen
async function showAllPhi(philosophers){    
    await fetchPhilosopherData();
    let a12 = document.getElementById("a12");
    philosophers.forEach(p => {
        createPhiAvatarEl(p,a12)
    })
}


//its removes duplicates from from, aranging charcasing, sorts and returns array
function sortingJson(from){
    let backup = [];
        let final = new Set([]);
        from.forEach(phi => backup.push(phi.interests));
        backup.forEach(int=> {
                let interest = int.split(",");
                interest.forEach(i => {
                    final.add(i.trim().toLowerCase());
                })
        })
        let ints = [];
        final.forEach(int => ints.push(int));
        let to = ints.map(name => {
            let newname = name.replace(/(?:\s|-)([a-z])/g,(_,char) => ` ${char.toUpperCase()}`)
            return newname.replace(/^(.)/, (_,char) => `${char.toUpperCase()}`);
        });
        return to.sort();
}

// it creates and auto download json file 
function downloadJsonFile(jsonFile){

        const json = JSON.stringify(jsonFile,null,2);
        let blob = new Blob([json], {type: "application/json"});
        const url = URL.createObjectURL(blob);

        const aEl = document.createElement("a");
        aEl.href = url;
        aEl.download = "data.json";

        document.body.appendChild(aEl);
        aEl.click();

}


