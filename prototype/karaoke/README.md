# Karaoke Player - Web Application

Ứng dụng karaoke được chuyển đổi từ Python sang HTML/CSS/JavaScript với giao diện hiện đại và responsive.

## Tính năng

### 🎵 Chức năng chính
- **Chọn bài hát**: Giao diện grid hiển thị danh sách bài hát
- **Phát karaoke**: Hiển thị lyrics theo thời gian thực
- **Điều khiển**: Play/Pause, Stop, quay lại menu chọn bài hát
- **Hiển thị lyrics**: 
  - Câu đang hát (highlight từng từ theo thời gian)
  - Câu tiếp theo (preview)
  - Progress bar theo thời gian

### 🎨 Giao diện
- **Responsive Design**: Tương thích với desktop, tablet, mobile
- **Dark/Light Mode**: Chuyển đổi theme với lưu trữ local
- **Modern UI**: Thiết kế hiện đại với gradient, animation
- **Smooth Animations**: Chuyển cảnh mượt mà

### 📱 Responsive
- Desktop: Layout 2 cột cho lyrics
- Tablet: Layout thích ứng
- Mobile: Layout 1 cột, tối ưu cho màn hình nhỏ

## Cấu trúc file

```
karaoke/
├── index.html          # File HTML chính
├── style.css           # CSS styles và responsive
├── script.js           # JavaScript logic
└── README.md           # Hướng dẫn sử dụng
```

## Cách sử dụng

### 1. Mở ứng dụng
- Mở file `index.html` trong trình duyệt web
- Hoặc sử dụng local server để chạy

### 2. Chọn bài hát
- Xem danh sách bài hát trong grid
- Click vào bài hát muốn phát
- Màn hình loading sẽ hiển thị

### 3. Phát karaoke
- Nhấn nút **Play** để bắt đầu
- Lyrics sẽ hiển thị theo thời gian:
  - Từ đang hát: Highlight màu xanh
  - Từ đã hát: Màu xám nhạt
  - Từ chưa hát: Màu bình thường
- Nhấn **Pause** để tạm dừng
- Nhấn **Stop** để dừng và quay về đầu

### 4. Điều khiển
- **Play/Pause**: Bắt đầu/tạm dừng phát
- **Stop**: Dừng và reset về đầu
- **Quay lại**: Trở về menu chọn bài hát
- **Theme Toggle**: Chuyển đổi dark/light mode

## Dữ liệu bài hát

Hiện tại có 3 bài hát được chuyển đổi từ Python:

1. **Anh Thôi Nhân Nhượng** - 11 câu
2. **Anh Vui** - 6 câu  
3. **Hãy Hát Lên** - 16 câu

### Cấu trúc dữ liệu
```javascript
{
  id: 'song_id',
  title: 'Tên bài hát',
  lyrics: {
    "sentence1": [
      { "time": 60, "text": "Từ" },
      { "time": 560, "text": "tiếp" },
      // ...
    ],
    // ...
  }
}
```

## Công nghệ sử dụng

- **HTML5**: Cấu trúc semantic
- **CSS3**: 
  - CSS Grid & Flexbox
  - CSS Variables (Custom Properties)
  - Animations & Transitions
  - Media Queries cho responsive
- **JavaScript ES6+**:
  - Classes
  - Arrow Functions
  - Template Literals
  - Local Storage
  - RequestAnimationFrame

## Tùy chỉnh

### Thêm bài hát mới
1. Thêm dữ liệu vào mảng `songs` trong `script.js`
2. Format dữ liệu theo cấu trúc đã định
3. Thời gian tính bằng milliseconds

### Thay đổi giao diện
- Chỉnh sửa CSS variables trong `:root` và `[data-theme="dark"]`
- Thêm animation trong `@keyframes`
- Tùy chỉnh responsive breakpoints

### Tùy chỉnh timing
- Điều chỉnh thời gian highlight từ trong `createLyricsHTML()`
- Thay đổi refresh rate trong `animate()`

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Tương lai

Có thể mở rộng thêm:
- Tích hợp audio file
- Upload bài hát mới
- Chế độ duet
- Hiệu ứng âm thanh
- Export/Import dữ liệu
- PWA support

## Chuyển đổi từ Python

Ứng dụng này được chuyển đổi từ phiên bản Python với:
- Rich library → CSS animations
- Terminal UI → Web UI
- Python classes → JavaScript classes
- File-based songs → Inline data

Tất cả logic timing và hiển thị lyrics được giữ nguyên để đảm bảo trải nghiệm tương tự.