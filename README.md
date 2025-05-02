# Spotify Clone Project

## Giới thiệu

Dự án Spotify Clone là một ứng dụng web được xây dựng để mô phỏng các tính năng chính của Spotify, sử dụng React cho frontend và Django cho backend.

## Công nghệ sử dụng

### Frontend

- React 18.3.1
- TypeScript
- Tailwind CSS
- Vite
- React Router DOM
- Axios
- Ant Design
- React Spinners
- SimpleBar React

### Backend

- Django 5.1.7
- Django REST Framework
- MySQL
- JWT Authentication
- CORS Headers

## Tính năng chính

- Đăng nhập/Đăng ký người dùng
- Phát nhạc với các điều khiển cơ bản (play/pause, next/previous)
- Quản lý playlist
- Tìm kiếm bài hát
- Điều chỉnh âm lượng
- Shuffle và Repeat
- Phân quyền người dùng (superuser)
- Bảo vệ bản quyền bài hát
## Demo
![image](https://github.com/user-attachments/assets/ae761bcc-da2e-4382-bc87-c1e66e369187)

## Cài đặt

### Yêu cầu hệ thống

- Node.js (v14 trở lên)
- Python (v3.8 trở lên)
- MySQL

### Frontend

```bash
# Di chuyển vào thư mục frontend
cd du-an-fontend-react/spotifyFrontEndProject

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

### Backend

```bash
# Di chuyển vào thư mục backend
cd du-an-backend-python-django-be

# Tạo môi trường ảo
python -m venv venv

# Kích hoạt môi trường ảo
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# Cài đặt dependencies
pip install -r requirements.txt

# Chạy migrations
python manage.py migrate

# Chạy development server
python manage.py runserver
```

## Cấu hình

### Frontend

Tạo file `.env` trong thư mục frontend:

## Liên hệ

- Bùi Công Thạch

Link dự án: [https://github.com/buithachIT/ListenToMusicWeb](https://github.com/buithachIT/ListenToMusicWeb)
