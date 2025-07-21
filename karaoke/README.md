# Karaoke Terminal Player 🎤

## 1. Yêu cầu hệ thống
- Python >= 3.8
- Hệ điều hành: Windows, Linux, macOS

## 2. Cài đặt thư viện cần thiết

Chạy lệnh sau trong terminal:

```bash
pip install rich
```

**Nếu bạn dùng Windows, cài thêm:**
```bash
pip install windows-curses
```

## 3. Cấu trúc thư mục

```
karaoke/
│   README.md
│   main.py
│
├── karaoke/
│     └── karaoke.py
│
└── songs/
      ├── ten_bai_hat_1.py
      ├── ten_bai_hat_2.py
      └── ...
```

- `main.py`: Chạy chương trình, hiển thị menu chọn bài hát.
- `karaoke/karaoke.py`: Logic phát karaoke, hiệu ứng đẹp với rich.
- `songs/`: Thư mục chứa các file dữ liệu từng bài hát.

## 4. Thêm bài hát mới

Tạo file mới trong thư mục `songs/`, ví dụ: `songs/anh_vui.py` với nội dung mẫu:

```python
title = "Anh Vui"
lyrics = {
    "sentence1": [
        {"time": 0, "text": "Anh"},
        {"time": 500, "text": "vui"},
        ...
    ],
    ...
}
```
- `title`: Tên hiển thị của bài hát.
- `lyrics`: Dữ liệu lời bài hát, chia theo từng câu, mỗi từ có thời gian hiển thị (ms).

## 5. Chạy chương trình

Từ thư mục gốc của project, chạy:

```bash
python karaoke/main.py
```

- Dùng phím **lên/xuống** hoặc **k/j** để chọn bài hát.
- Nhấn **Enter** để phát karaoke.
- Nhấn **Ctrl+C** để dừng khi đang phát.

## 6. Lưu ý
- Nếu thêm/xóa bài hát, chỉ cần thao tác trong thư mục `songs/`.
- Nếu gặp lỗi phím mũi tên trên Windows, hãy dùng phím `k` (lên), `j` (xuống).
- Không cần chỉnh sửa file trong `karaoke/` trừ khi muốn thay đổi hiệu ứng.

---
Chúc bạn hát vui vẻ! 🎶 