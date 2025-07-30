# 📁 Thư mục Songs

Thư mục này chứa tất cả dữ liệu bài hát cho ứng dụng Karaoke.

## 📋 Cấu trúc thư mục

```
songs/
├── index.js                    # File export tất cả bài hát
├── anh_thoi_nhan_nhuong.js    # Bài hát "Anh Thôi Nhân Nhượng"
├── anh_vui.js                 # Bài hát "Anh Vui"
├── hay_hat_len.js            # Bài hát "Hãy Hát Lên"
└── README.md                 # Hướng dẫn này
```

## 🎵 Cách thêm bài hát mới

### Bước 1: Tạo file bài hát

Tạo file mới với tên `ten_bai_hat.js` trong thư mục `songs/`:

```javascript
// Tên bài hát
export const tenBaiHat = {
    id: 'ten_bai_hat',
    title: 'Tên Bài Hát',
    lyrics: {
        "sentence1": [
            { "time": 0, "text": "Từ" },
            { "time": 500, "text": "đầu" },
            { "time": 1000, "text": "tiên" }
        ],
        "sentence2": [
            { "time": 2000, "text": "Câu" },
            { "time": 2500, "text": "thứ" },
            { "time": 3000, "text": "hai" }
        ]
        // Thêm các câu tiếp theo...
    }
};
```

### Bước 2: Cập nhật file index.js

Thêm import và export vào file `songs/index.js`:

```javascript
// Import all songs
import { anhThoiNhanNhuong } from './anh_thoi_nhan_nhuong.js';
import { anhVui } from './anh_vui.js';
import { hayHatLen } from './hay_hat_len.js';
import { tenBaiHat } from './ten_bai_hat.js'; // Thêm dòng này

// Export all songs as an array
export const songs = [
    anhThoiNhanNhuong,
    anhVui,
    hayHatLen,
    tenBaiHat // Thêm dòng này
];

// Export individual songs
export { anhThoiNhanNhuong, anhVui, hayHatLen, tenBaiHat }; // Thêm tenBaiHat
```

## 📝 Định dạng dữ liệu bài hát

### Cấu trúc object bài hát:

```javascript
{
    id: 'unique_id',           // ID duy nhất cho bài hát
    title: 'Tên Bài Hát',      // Tên hiển thị
    lyrics: {                  // Object chứa lời bài hát
        "sentence1": [...],    // Câu 1
        "sentence2": [...],    // Câu 2
        // ...
    }
}
```

### Cấu trúc câu hát:

```javascript
"sentence1": [
    { "time": 0, "text": "Từ" },      // Thời gian (ms), nội dung
    { "time": 500, "text": "đầu" },   // Thời gian (ms), nội dung
    { "time": 1000, "text": "tiên" }  // Thời gian (ms), nội dung
]
```

## ⏰ Quy tắc thời gian

- **time**: Thời gian tính bằng **milliseconds** (1 giây = 1000ms)
- Thời gian bắt đầu từ 0ms
- Mỗi từ có thời gian riêng biệt
- Thời gian tăng dần theo thứ tự từ trong câu

## 🎯 Ví dụ hoàn chỉnh

```javascript
// bai_hat_moi.js
export const baiHatMoi = {
    id: 'bai_hat_moi',
    title: 'Bài Hát Mới',
    lyrics: {
        "sentence1": [
            { "time": 0, "text": "Đây" },
            { "time": 800, "text": "là" },
            { "time": 1200, "text": "câu" },
            { "time": 1600, "text": "đầu" },
            { "time": 2000, "text": "tiên" }
        ],
        "sentence2": [
            { "time": 3000, "text": "Đây" },
            { "time": 3800, "text": "là" },
            { "time": 4200, "text": "câu" },
            { "time": 4600, "text": "thứ" },
            { "time": 5000, "text": "hai" }
        ]
    }
};
```

## 🔧 Lưu ý quan trọng

1. **ID duy nhất**: Mỗi bài hát phải có ID khác nhau
2. **Thời gian chính xác**: Đảm bảo thời gian được tính chính xác
3. **Định dạng file**: Sử dụng ES6 modules (import/export)
4. **Tên file**: Sử dụng snake_case cho tên file
5. **Tên biến**: Sử dụng camelCase cho tên biến export

## 📚 Bài hát hiện có

- **Anh Thôi Nhân Nhượng** (11 câu)
- **Anh Vui** (6 câu)  
- **Hãy Hát Lên** (16 câu)

## 🚀 Cách test bài hát mới

1. Tạo file bài hát theo hướng dẫn
2. Cập nhật `index.js`
3. Mở `index.html` trong trình duyệt
4. Chọn bài hát mới từ danh sách
5. Kiểm tra hiển thị lyrics và timing 