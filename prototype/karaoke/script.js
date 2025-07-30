// Import songs from songs directory
import { songs } from './songs/index.js';

// Karaoke Player Application
class KaraokePlayer {
    constructor() {
        this.currentSong = null;
        this.isPlaying = false;
        this.startTime = 0;
        this.currentTime = 0;
        this.animationId = null;
        this.songs = songs; // Use imported songs
        this.lyricsLines = []; // Mảng chứa các dòng lyrics hiện tại
        this.currentSentenceIndex = 0; // Index của câu đang hát
        this.totalLines = 0; // Số dòng hiển thị hiện tại
        
        this.initializeElements();
        this.bindEvents();
        this.renderSongGrid();
        this.initializeTheme();
    }

    initializeElements() {
        // Main containers
        this.songSelection = document.getElementById('songSelection');
        this.karaokePlayer = document.getElementById('karaokePlayer');
        this.loadingScreen = document.getElementById('loadingScreen');
        this.songGrid = document.getElementById('songGrid');

        // Player elements
        this.currentSongTitle = document.getElementById('currentSongTitle');
        this.currentTimeEl = document.getElementById('currentTime');
        this.totalTimeEl = document.getElementById('totalTime');
        this.progressFill = document.getElementById('progressFill');
        this.lyricsLinesContainer = document.getElementById('lyricsLines');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.backToSelection = document.getElementById('backToSelection');
        this.themeToggle = document.getElementById('themeToggle');

        // Info elements
        this.songDuration = document.getElementById('songDuration');
        this.totalSentences = document.getElementById('totalSentences');
        this.playerStatus = document.getElementById('playerStatus');
    }

    bindEvents() {
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.stopBtn.addEventListener('click', () => this.stop());
        this.backToSelection.addEventListener('click', () => this.showSongSelection());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('karaoke-theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('karaoke-theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    updateThemeIcon(theme) {
        const icon = this.themeToggle.querySelector('i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    renderSongGrid() {
        this.songGrid.innerHTML = '';
        
        this.songs.forEach((song, index) => {
            const songCard = document.createElement('div');
            songCard.className = 'song-card';
            songCard.innerHTML = `
                <h3>${song.title}</h3>
                <p>Bài hát ${index + 1} trong danh sách</p>
                <i class="fas fa-play play-icon"></i>
            `;
            
            songCard.addEventListener('click', () => this.selectSong(song));
            this.songGrid.appendChild(songCard);
        });
    }

    selectSong(song) {
        this.currentSong = song;
        this.showLoading();
        
        // Simulate loading time
        setTimeout(() => {
            this.hideLoading();
            this.showKaraokePlayer();
            this.initializeSong();
        }, 1000);
    }

    showLoading() {
        this.loadingScreen.classList.remove('hidden');
    }

    hideLoading() {
        this.loadingScreen.classList.add('hidden');
    }

    showKaraokePlayer() {
        this.songSelection.classList.add('hidden');
        this.karaokePlayer.classList.remove('hidden');
    }

    showSongSelection() {
        this.stop();
        this.karaokePlayer.classList.add('hidden');
        this.songSelection.classList.remove('hidden');
    }

    initializeSong() {
        if (!this.currentSong) return;

        this.currentSongTitle.textContent = this.currentSong.title;
        
        // Calculate total duration
        const sentences = Object.values(this.currentSong.lyrics);
        const lastSentence = sentences[sentences.length - 1];
        const totalDuration = lastSentence[lastSentence.length - 1].time + 1000;
        
        this.totalTimeEl.textContent = this.formatTime(totalDuration);
        this.songDuration.textContent = this.formatTime(totalDuration);
        this.totalSentences.textContent = sentences.length;
        
        // Initialize lyrics display
        this.initializeLyricsDisplay();
        this.updateProgress(0, totalDuration);
    }

    initializeLyricsDisplay() {
        // Xóa nội dung cũ
        this.lyricsLinesContainer.innerHTML = '';
        this.lyricsLines = [];
        
        const sentences = Object.values(this.currentSong.lyrics);
        this.currentSentenceIndex = 0;
        
        // Luôn hiển thị 5 dòng từ đầu, với câu đầu tiên ở giữa
        this.totalLines = 5;
        this.createLyricsLines(5);
        
        // Thiết lập layout ban đầu cho câu đầu tiên
        this.updateLyricsPosition(0);
        
        // Hiển thị nội dung câu đầu tiên
        this.updateLyricsDisplay(0);
    }

    createLyricsLines(count) {
        this.lyricsLinesContainer.innerHTML = '';
        this.lyricsLines = [];
        
        for (let i = 0; i < count; i++) {
            const lineElement = document.createElement('div');
            lineElement.className = 'lyrics-line';
            this.lyricsLinesContainer.appendChild(lineElement);
            this.lyricsLines.push(lineElement);
        }
    }

    formatTime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    getCurrentSentence(currentTime) {
        const sentences = Object.entries(this.currentSong.lyrics);
        
        for (const [sentenceKey, words] of sentences) {
            const startTime = words[0].time;
            const endTime = words[words.length - 1].time + 1000;
            
            if (startTime <= currentTime && currentTime <= endTime) {
                return { sentenceKey, words };
            }
        }
        
        return { sentenceKey: null, words: null };
    }

    createLyricsHTML(words, currentTime, isCurrent = true) {
        if (!words) return '<span class="empty-text">-</span>';
        
        return words.map(word => {
            let className = 'word';
            
            if (isCurrent && word.time <= currentTime && currentTime <= word.time + 800) {
                className += ' current';
            } else if (word.time <= currentTime) {
                className += ' passed';
            } else {
                className += ' future';
            }
            
            // Không cần thêm effect elements nữa vì sẽ tạo bằng JavaScript
            return `<span class="${className}">${word.text}</span>`;
        }).join('');
    }

    updateLyricsDisplay(currentTime) {
        const sentences = Object.values(this.currentSong.lyrics);
        const currentSentence = this.getCurrentSentence(currentTime);
        
        if (!currentSentence.words) return;
        
        // Tìm index của câu hiện tại
        const currentIndex = Object.values(this.currentSong.lyrics).findIndex(sentence => 
            sentence === currentSentence.words
        );
        
        // Kiểm tra nếu cần cập nhật vị trí hiển thị
        if (currentIndex !== this.currentSentenceIndex) {
            this.updateLyricsPosition(currentIndex);
            this.currentSentenceIndex = currentIndex;
        }
        
        // Cập nhật nội dung câu đang hát (luôn ở vị trí trung tâm - index 2)
        const currentLine = this.lyricsLines[2];
        if (currentLine) {
            const oldHTML = currentLine.innerHTML;
            currentLine.innerHTML = this.createLyricsHTML(currentSentence.words, currentTime, true);
            
            // Force restart animation cho từng từ đang hát
            this.forceAnimationRestart(currentLine, oldHTML);
        }
    }

    forceAnimationRestart(element, oldHTML) {
        // Tìm tất cả từ đang hát
        const currentWords = element.querySelectorAll('.word.current');
        console.log('Found current words:', currentWords.length); // Debug
        
        currentWords.forEach(word => {
            console.log('Creating firework for word:', word.textContent); // Debug
            // Thêm sparkle đơn giản
            this.addSimpleSparkle(word);
        });
    }

    addSimpleSparkle(wordElement) {
        // Xóa sparkle cũ nếu có
        const oldSparkles = wordElement.querySelectorAll('.sparkle-simple');
        oldSparkles.forEach(sparkle => sparkle.remove());
        
        // Tạo nhiều sparkle với emoji khác nhau
        const sparkles = ['✨', '⭐', '💫', '🌟'];
        const positions = [
            { top: '-40px', left: '50%' },
            { top: '-35px', left: '30%' },
            { top: '-35px', left: '70%' },
            { top: '-45px', left: '50%' }
        ];
        
        sparkles.forEach((emoji, index) => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle-simple';
            sparkle.textContent = emoji;
            sparkle.style.top = positions[index].top;
            sparkle.style.left = positions[index].left;
            sparkle.style.animationDelay = `${index * 0.1}s`;
            
            wordElement.appendChild(sparkle);
            
            // Xóa sparkle sau animation
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.remove();
                }
            }, 1500 + (index * 100));
        });
        
        console.log('Multiple sparkles added'); // Debug
    }

    getCurrentLineIndex() {
        // Câu hiện tại luôn ở vị trí trung tâm (index 2)
        return 2;
    }

    updateLyricsPosition(newIndex) {
        const sentences = Object.values(this.currentSong.lyrics);
        
        // Luôn hiển thị 5 dòng
        this.totalLines = 5;
        
        // Tính toán các index cần hiển thị
        const displayIndexes = this.calculateDisplayIndexes(newIndex);
        
        // Cập nhật nội dung các dòng với animation
        displayIndexes.forEach((sentenceIndex, lineIndex) => {
            const lineElement = this.lyricsLines[lineIndex];
            if (lineElement) {
                if (sentenceIndex === -1) {
                    // Hiển thị dòng trống
                    lineElement.innerHTML = '<span class="empty-text">-</span>';
                } else if (sentenceIndex < sentences.length) {
                    const isCurrentLine = lineIndex === 2; // Vị trí trung tâm
                    lineElement.innerHTML = this.createLyricsHTML(sentences[sentenceIndex], 0, isCurrentLine);
                    
                    // Thêm animation cho dòng mới (dòng cuối cùng)
                    if (lineIndex === 4) {
                        lineElement.classList.add('slide-up');
                        setTimeout(() => {
                            lineElement.classList.remove('slide-up');
                        }, 600);
                    }
                } else {
                    // Hiển thị dòng trống nếu không có nội dung
                    lineElement.innerHTML = '<span class="empty-text">-</span>';
                }
            }
        });
    }

    calculateDisplayIndexes(currentIndex) {
        const sentences = Object.values(this.currentSong.lyrics);
        const totalSentences = sentences.length;
        const indexes = [];
        
        if (currentIndex === 0) {
            // Câu đầu tiên: hiển thị 3 dòng thực tế (dòng 3, 4, 5)
            indexes.push(
                -1,                                             // Dòng 1: Trống
                -1,                                             // Dòng 2: Trống
                currentIndex,                                   // Dòng 3: Câu hiện tại (trung tâm)
                Math.min(totalSentences - 1, currentIndex + 1), // Dòng 4: Câu tiếp theo 1
                Math.min(totalSentences - 1, currentIndex + 2)  // Dòng 5: Câu tiếp theo 2
            );
        } else if (currentIndex === 1) {
            // Câu thứ 2: hiển thị 4 dòng thực tế
            indexes.push(
                -1,                                             // Dòng 1: Trống
                currentIndex - 1,                               // Dòng 2: Câu đã hát (câu đầu)
                currentIndex,                                   // Dòng 3: Câu hiện tại (trung tâm)
                Math.min(totalSentences - 1, currentIndex + 1), // Dòng 4: Câu tiếp theo 1
                Math.min(totalSentences - 1, currentIndex + 2)  // Dòng 5: Câu tiếp theo 2
            );
        } else if (currentIndex === totalSentences - 2) {
            // Câu kế cuối: không hiển thị dòng 5
            indexes.push(
                currentIndex - 2,                               // Dòng 1: Câu đã hát 1
                currentIndex - 1,                               // Dòng 2: Câu đã hát 2
                currentIndex,                                   // Dòng 3: Câu hiện tại (trung tâm)
                currentIndex + 1,                               // Dòng 4: Câu tiếp theo (câu cuối)
                -1                                              // Dòng 5: Trống
            );
        } else if (currentIndex === totalSentences - 1) {
            // Câu cuối: không hiển thị dòng 4 và 5
            indexes.push(
                currentIndex - 2,                               // Dòng 1: Câu đã hát 1
                currentIndex - 1,                               // Dòng 2: Câu đã hát 2
                currentIndex,                                   // Dòng 3: Câu hiện tại (trung tâm)
                -1,                                             // Dòng 4: Trống
                -1                                              // Dòng 5: Trống
            );
        } else {
            // Các câu ở giữa: hiển thị đủ 5 dòng
            indexes.push(
                currentIndex - 2,                               // Dòng 1: Câu đã hát 1
                currentIndex - 1,                               // Dòng 2: Câu đã hát 2
                currentIndex,                                   // Dòng 3: Câu hiện tại (trung tâm)
                Math.min(totalSentences - 1, currentIndex + 1), // Dòng 4: Câu tiếp theo 1
                Math.min(totalSentences - 1, currentIndex + 2)  // Dòng 5: Câu tiếp theo 2
            );
        }
        
        return indexes;
    }

    updateProgress(currentTime, totalDuration) {
        const progress = (currentTime / totalDuration) * 100;
        this.progressFill.style.width = `${progress}%`;
        this.currentTimeEl.textContent = this.formatTime(currentTime);
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        if (!this.currentSong) return;
        
        this.isPlaying = true;
        this.startTime = Date.now() - this.currentTime;
        this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        this.playPauseBtn.classList.add('playing');
        this.playerStatus.textContent = 'Đang phát';
        
        this.animate();
    }

    pause() {
        this.isPlaying = false;
        this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        this.playPauseBtn.classList.remove('playing');
        this.playerStatus.textContent = 'Tạm dừng';
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    stop() {
        this.isPlaying = false;
        this.currentTime = 0;
        this.startTime = 0;
        
        this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        this.playPauseBtn.classList.remove('playing');
        this.playerStatus.textContent = 'Sẵn sàng';
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        this.initializeLyricsDisplay();
        this.updateProgress(0, this.getTotalDuration());
    }

    getTotalDuration() {
        if (!this.currentSong) return 0;
        const sentences = Object.values(this.currentSong.lyrics);
        const lastSentence = sentences[sentences.length - 1];
        return lastSentence[lastSentence.length - 1].time + 1000;
    }

    animate() {
        if (!this.isPlaying) return;
        
        this.currentTime = Date.now() - this.startTime;
        const totalDuration = this.getTotalDuration();
        
        this.updateLyricsDisplay(this.currentTime);
        this.updateProgress(this.currentTime, totalDuration);
        
        // Check if song is finished
        if (this.currentTime >= totalDuration) {
            this.stop();
            this.playerStatus.textContent = 'Hoàn thành';
            return;
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new KaraokePlayer();
});