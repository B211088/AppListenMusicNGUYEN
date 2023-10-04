const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'CHI_NGUYEN';

const heading = $('.title-music');
const cdThumb = $('.disk-music-img');
const audio = $('#audio');
const cd = $('.disk-music');
const containerscroll = $('container');
const diskMusic = $('.disk-music');
const playBtn = $('.play-music');
const iconPlay = $('.play-icon');
const iconPause = $('.pause-icon');
const progress = $('#progress');
const cddisk = $('.disk-music-img');
const nextBtn = $('.next-music') 
const prevBtn = $('.prev-music');
const randomBtn =  $('.random-music');
const repeatBtn = $('.repeat-music');
const volumeSong = $('#volume-song');
const iconVolumeContain = $('.icon-volume-contain');
const iconVolumeMuted = $('.icon-volume-muted');
const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))  || {},
    songs : [
        {
            name:'À Lôi',
            singer: 'Double2T',
            path: './assets/music/Aloi.mp3',
            image: './assets/img/Aloi.jpg'
        },
        {
            name:'Bật chế độ bay lên',
            singer: 'Bình GOLD',
            path: './assets/music/Batchedobaylen.mp3',
            image: './assets/img/Batchedobaylen.jpg'
        },
        {
            name:'Trơn',
            singer: 'Bình GOLD',
            path: './assets/music/Tron.mp3',
            image: './assets/img/tron.jpg'
        },
        {
            name:'Youngz',
            singer: 'Quang Tèo x Wxrdie',
            path: './assets/music/Youngz.mp3',
            image: './assets/img/youngz.jpg'
        },
        {
            name:'Đi bao xa',
            singer: 'Gill x RPT Orijinn x Rz Mas',
            path: './assets/music/Dibaoxa.mp3',
            image: './assets/img/dibaoxa.jpg'
        },
        {
            name:'Em iu',
            singer: ' Wxrdie x Bình Gold x 2pillz x V.A',
            path: './assets/music/Emiu.mp3',
            image: './assets/img/emiu.jpg'
        },
        {
            name:'Quan hệ rộng',
            singer: 'Bình GOLD',
            path: './assets/music/Quanherong.mp3',
            image: './assets/img/quanherong.jpg'
        },
        
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    render: function (){
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${this.currentIndex}  ${index === this.currentIndex ? 'active-song'  : ''}" data-index="${index}">
                <div class="thumb"><img src="${song.image}" alt=""></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fa-solid fa-ellipsis-vertical "></i>
                </div>       
            </div>
            `
        });
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong',{
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvent: function (){
        const _this = this;
        const cdWidth = cd.offsetWidth;
        //xử lý cd quay
        const cddiskanimate = cddisk.animate([
            {
                transform: 'rotate(380deg)'
            }
        ], {
            duration:  10000,// seconds
            itertions: Infinity,
        })
        cddiskanimate.pause();


        // xử lý phóng to thu nhỏ cd
        document.onscroll = function(){
            const scrollTop = document.scrollY || document.documentElement.scrollTop;
            const newcdWidth = cdWidth - scrollTop;;

            cd.style.width = newcdWidth > 0 ? newcdWidth + 'px': 0;
            cd.style.height = newcdWidth > 0 ? newcdWidth + 'px': 0;
            cd.style.opacity = newcdWidth / cdWidth;
            if(newcdWidth < 0){
                diskMusic.classList.add('none');
            }else diskMusic.classList.remove('none');
        }


        // xử lý khi nhấn play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause();
            }else{
               
                audio.play();
               
            }

        }


        //Khi song được play
        audio.onplay = function(){
            _this.isPlaying = true;
            iconPlay.classList.add('none');
            iconPause.classList.remove('none');
            cddiskanimate.play();
        }

        //Khi song được pause
        audio.onpause = function(){
            _this.isPlaying = false;
            iconPlay.classList.remove('none');
            iconPause.classList.add('none');
            cddiskanimate.pause();
        }        
                
        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }

        } 

        

        // Xử lý khi tua

        progress.oninput = function(e){
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // khi next song

        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
            }else{
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Khi previous song
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
            }else{
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // random song
        randomBtn.onclick = function(e){
           _this.isRandom = !_this.isRandom;
           _this.setConfig('isRandom', _this.isRandom );
            randomBtn.classList.toggle('active', _this.isRandom);
        }
        //repeat song 
        repeatBtn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat );
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }
        // xu ly next song khi audio  end

        audio.onended = function() {
            if(_this.isRepeat){
                audio.play();  
            }else
            nextBtn.click()
        }
        // xu ly  volume
        volumeSong.oninput = function(){
            const volumeInput = volumeSong.value / 100;
            audio.volume = volumeInput ;
            iconVolumeContain.classList.remove('none');
            iconVolumeMuted.classList.add('none');
            if(volumeInput === 0){
                iconVolumeContain.click()
            }
        }

         iconVolumeContain.onclick = function(){
            iconVolumeContain.classList.add('none');
            iconVolumeMuted.classList.remove('none');
            audio.volume = 0;
            volumeSong.value = 0
        }
         iconVolumeMuted.onclick = function(){
            iconVolumeContain.classList.remove('none');
            iconVolumeMuted.classList.add('none');
            audio.volume = 1;
            volumeSong.value = 100
        }
        // lang nghe click 
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)');

            if(songNode || e.target.closest('.option')){
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    audio.play();
                    _this.render();
                }

                // xu ly khi click vao option
                if(e.target.closest('.option')){

                }
            }
        }
         

    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        cdThumb.src = this.currentSong.image;
        audio.src = this.currentSong.path;
    },
    scrollToActiveSong : function(){
        setTimeout(()=>{
            $('.song.active-song').scrollIntoView({
                behavior: 'smooth',
                block : 'end',
            })
        }, 500)
    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    nextSong: function(){
        this.currentIndex ++; 
        if(this.currentIndex >= this.songs.length ){
            this.currentIndex = 0 ;
        }
        this.loadCurrentSong();
    },
    prevSong: function(){
        this.currentIndex --; 
        if(this.currentIndex < 0 ){
            this.currentIndex = this.songs.length - 1 ;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function(){
        let newIndex
        
        do{
            newIndex = Math.floor(Math.random() * this.songs.length - 1)  ;
        }while(newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();

    },
    

    start: function(){
        // Gan cau hinh tu condig vao ung dung
        this.loadConfig();

        //Định nghĩa các thuộc tính cho object
        this.defineProperties();

        // Lắng nghe các event
        this.handleEvent();

        //Tải thông tin bài hát đầu tiên vào UI khi chạy
        this.loadCurrentSong();

        //play audio

        //Render playlist
        this.render();

        repeatBtn.classList.toggle('active', this.isRepeat);
        randomBtn.classList.toggle('active', this.isRandom);
    },


}


app.start();