async function getsongs(){
    let a= await fetch("http://127.0.0.1:3000/Custom_Spotify_Homepage/songs/");
    let responce=await a.text();
    let div=document.createElement("div");
    div.innerHTML=responce;
    let as=div.getElementsByTagName("a");
    console.log(as);
    let song=[];
    for(let i=0 ; i<as.length ; i++){
        const ele=as[i];
        if(ele.href.endsWith(".mp3")){
            song.push(ele.href);
        }
    }
    return song
}
async function main(){
    let song=await getsongs();
    //console.log(song);
    let song1= await getsongs();
    for(let i=0 ;i<song1.length ; i++){
       
        song1[i]=song1[i].split("/songs/")[1];
        song1[i]=song1[i].replaceAll("%20", " ");
        song1[i]=song1[i].replaceAll(".mp3"," ");
        song1[i]=song1[i].replaceAll("_"," ");
        song1[i]=song1[i].replaceAll("-"," ");
        song1[i]=song1[i].replaceAll("02"," ");
        song1[i]=song1[i].replaceAll("04"," ");
        song1[i]=song1[i].replaceAll("11"," ");
        song1[i]=song1[i].replaceAll("13"," ");
        //song1[i]=song1[i].replaceAll(" ","");
    }
    for(let a=0;a<song1.length;a++){
        song1[a]=song1[a].trim();
    }
    console.log(song1);
    //var audio=new Audio(song[1]);
    //audio.play()
    
    async function adding_cards( a , ele ,name , anime){
        ele.innerHTML=ele.innerHTML+`<div class="card">
                        <img aria-hidden="false" draggable="false" loading="lazy" src=${a} data-testid="card-image" alt="" class="mMx2LUixlnN_Fu45JpFB yMQTWVwLJ5bV8VGiaqU3 yOKoknIYYzAE90pe7_SE Yn2Ei5QZn19gria6LjZj" height="150" width="140">
                        <h4 style="position: relative; bottom: 12px; font-family: 'Baloo 2'; font-weight: 600;">Anime OSTs</h4>
                        <p class="author">${name} OST , Anime-${anime}</p>
                    </div>`
    }
    let ele=document.body.getElementsByClassName("cardcontainer")[0];
    await adding_cards("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL7Mab4KuISNY055_qBipxYlgS2wHxSOJhKQ&s",ele,"Galaxy","Parasyte");
    await adding_cards("https://i.scdn.co/image/ab67616d0000b2731defa0b4327bdb7460b79414",ele,"Next to you","Parasyte");
    await adding_cards("https://i1.sndcdn.com/artworks-000112003003-bk0x3a-t1080x1080.jpg",ele,"Pride or joy","Parasyte");
    await adding_cards("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQou4QRc1LmJ0MQ81gOTTnD77IIuGj9-H-2RA&s",ele,"Kyo's","Fruit Basket");
    await adding_cards("https://steamuserimages-a.akamaihd.net/ugc/786372587416415119/6FF19608BEF51FD61A58B354421B7A203D9403C6/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false",ele,"Giyu's","Demon Slayer");
    await adding_cards("https://i.scdn.co/image/ab67616d0000b2736c781781e5f1b9c55b2cfc7a",ele,"Rage","Demon Slayer");
    await adding_cards("https://i1.sndcdn.com/artworks-000314270526-5p3pl7-t500x500.jpg",ele,"Ken's","Tokyo Ghoul")
    await adding_cards("https://i.ytimg.com/vi/CYoSl97Ls9s/maxresdefault.jpg",ele,"Rengoku's","Demon Slayer");
    await adding_cards("https://i.makeagif.com/media/10-13-2023/fD5Hd1.gif",ele,"sugarCrash" , "AMV");
    await adding_cards("https://i.ytimg.com/vi/MY8jo2Qswr4/hq720.jpg?sqp=-oaymwE7CK4FEIIDSFryq4qpAy0IARUAAAAAGAElAADIQj0AgKJD8AEB-AH-CYAC0AWKAgwIABABGGQgZChkMA8=&rs=AOn4CLB8XiHtBWVYCXLyRB-aBjWcrgu1jw" , ele ,"Unravel" , "Tokyo Ghoul");
    await adding_cards("https://i.pinimg.com/736x/31/bf/a6/31bfa6e7222782404bb4bf7aa1781ebb.jpg",ele,"Yorichii","Demon Slayer");
    await adding_cards("https://picfiles.alphacoders.com/504/50493.jpg",ele,"Sparkle","Your Name");
    await adding_cards("https://i.pinimg.com/originals/b6/a6/35/b6a63578b7539be9f1e058f2a10cdab9.jpg",ele,"Zenitsu","Demon Slayer");
    //await adding_cards("https://i.pinimg.com/originals/b6/a6/35/b6a63578b7539be9f1e058f2a10cdab9.jpg",ele,"Zenitsu","Demon Slayer");

    let btn=document.getElementsByClassName("round_box")[0];
    let pc=document.body.getElementsByClassName("lb1box1")[0];
    btn.addEventListener("click",()=>{
        pc.innerHTML="";
        for(let i=0;i<song1.length ;i++){
            pc.innerHTML=pc.innerHTML+`<ul><li class="j"><button class="jj">play</button>${song1[i]}</li></ul>`;
        }
        let btn1=document.body.getElementsByClassName("jj");
        let currentAudio = null; 
        let playingIndex = -1;
        let previousAudio=null;
        for(let i=0 ;i<btn1.length;i++){
            btn1[i].addEventListener("click",()=>{
                if (currentAudio && playingIndex !== i) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0; // Reset playback position
                    btn1[playingIndex].innerHTML = "play";
                }
        
                if (currentAudio && playingIndex === i) {
                    // If the clicked button is the one currently playing, pause it
                    currentAudio.pause();
                    btn1[i].innerHTML = "play";
                    currentAudio = null; // Clear the reference to the audio
                    playingIndex = -1; // Clear the index
                } else {
                    // Create a new Audio object and play it
                    
                    currentAudio = new Audio(song[i]);
                    previousAudio=currentAudio;
                    currentAudio.play();
                    let m=document.body.getElementsByClassName("innerplaybar")[0];
                    m.innerHTML="Currently Playing:-"+song1[i];
                    btn1[i].innerHTML = "pause";
                    playingIndex = i; // Update the index of the currently playing button
                }
            })
        }
        let newaudio=null;
        let check=true;
        let butt=document.body.getElementsByClassName("control");
        butt[0].addEventListener("click",()=>{
            currentAudio.pause();
            btn1[playingIndex].innerHTML="play";
            if(playingIndex!=0){
                newaudio=new Audio(song[playingIndex-1]);
                currentAudio=newaudio;
                playingIndex=playingIndex-1;
                btn1[playingIndex].innerHTML="pause";
                newaudio.play();
                let m=document.body.getElementsByClassName("innerplaybar")[0];
                m.innerHTML="Currently Playing:-"+song1[playingIndex];
                check=false;
            }
            else{
                playingIndex=song1.length-1;
                newaudio=new Audio(song[playingIndex]);
                currentAudio=newaudio;
                newaudio.play();
                btn1[playingIndex].innerHTML="pause";
                let m=document.body.getElementsByClassName("innerplaybar")[0];
                m.innerHTML="Currently Playing:-"+song1[playingIndex];
                check=false;
            }
        })
        butt[1].addEventListener("click",()=>{
            if(check==false){
                check=true;
                currentAudio.pause()
                btn1[playingIndex].innerHTML="play";
            }
            else{
                check=false;
                currentAudio.play();
                btn1[playingIndex].innerHTML="pause";
            }
        })
        butt[2].addEventListener("click",()=>{
            currentAudio.pause();
            btn1[playingIndex].innerHTML="play";
            if(playingIndex<song1.length-1){
                newaudio=new Audio(song[playingIndex+1]);
                currentAudio=newaudio;
                newaudio.play();
                playingIndex=playingIndex+1;
                btn1[playingIndex].innerHTML="pause";
                let m=document.body.getElementsByClassName("innerplaybar")[0];
                m.innerHTML="Currently Playing:-"+song1[playingIndex];
                check=false;
            }
            else{
                playingIndex=0;
                newaudio=new Audio(song[playingIndex]);
                currentAudio=newaudio;
                newaudio.play();
                btn1[playingIndex].innerHTML="pause";
                let m=document.body.getElementsByClassName("innerplaybar")[0];
                m.innerHTML="Currently Playing:-"+song1[playingIndex];
                check=false;
            }
        })
    })
    
    let tokyo=document.getElementsByClassName("home2")[0];
    tokyo.addEventListener("click",()=>{
        tokyo.innerHTML=`<form action="post">                                                                                
        <div class="forms"><label for="songs">search</label><input type="text" id="username" name="username" placeholder="Enter song name">
        <button class="innerpp">enter</button></div>`;
        document.getElementById('username').focus();
        let c=document.getElementsByClassName("innerpp")[0];
        c.addEventListener("click",()=>{
            let checker=false;
            let sd=username.value;
            for(let i=0 ; i<song1.length ; i++){
                if(song1[i]==sd){
                    alert("The song is available");
                    checker=true;
                    break;
                }
            }
            if(checker==false){
                alert("This song is not available")
            }
        })  
    })

} 
main();

