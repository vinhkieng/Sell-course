# AVA - Website bán khóa học trực tuyến (đồ án tốt nghiệp)

Hướng dẫn này viết cho người mới, làm trên Windows, chủ yếu bấm chuột trong Visual Studio Code. Chỉ gõ lệnh ở những chỗ bắt buộc.

## 1. Thư mục này có gì

```
Do_An/
  CLAUDE.md           nội quy cho Claude Code (Claude Code tự đọc mỗi lần làm việc)
  README.md           file bạn đang đọc
  database/           file SQL tạo database ava (23 bảng)
  docs/dac_ta/        đặc tả: Phần chung và 24 phần chức năng
  docs/kiem_thu/      danh sách trường hợp kiểm thử của 24 phần
  thiet_ke/           128 màn thiết kế, bấm đúp là mở trong Chrome
  backend/            máy chủ (Node.js, Express, MySQL), chạy ở cổng 8000
  frontend/           giao diện (React, Vite), chạy ở cổng 5173
  .github/workflows/  GitHub Actions: tự kiểm tra mỗi lần đẩy code lên GitHub
```

Khung dự án mới có phần nền, chưa có trang nào. Các trang làm dần theo thứ tự Phần 1 đến Phần 24.

## 2. Cài phần mềm (làm một lần)

1. Node.js 24: vào https://nodejs.org, tải bản "24.x LTS" cho Windows (file .msi), bấm Next đến hết. Dự án ghi sẵn bản 24 trong file .nvmrc.
2. Laragon (có sẵn MySQL và phpMyAdmin để xem database trong trình duyệt): tải ở https://laragon.org, cài như bình thường. Laragon bản mới có nhiều bản MySQL, phải chọn bản 8.4 (chuột phải vào cửa sổ Laragon, chọn MySQL, chọn Version, chọn dòng mysql-8.4).
3. Visual Studio Code: tải ở https://code.visualstudio.com.
4. Git: máy bạn đã cài.

Kiểm tra Node đã cài đúng: làm bước 4 bên dưới để mở khung gõ lệnh, gõ `node -v` rồi Enter, phải thấy v24.

## 3. Mở dự án trong Visual Studio Code

1. Mở Visual Studio Code, chọn menu File, chọn Open Folder.
2. Chọn thư mục Do_An, bấm Select Folder. Nếu hỏi "Do you trust the authors", bấm Yes.
3. Khung bên trái hiện cây thư mục như mục 1.

## 4. Mở khung gõ lệnh (Terminal) loại Command Prompt

1. Chọn menu Terminal, chọn New Terminal. Một khung gõ lệnh hiện ở dưới.
2. Bấm mũi tên nhỏ ⌄ cạnh dấu + ở góc phải khung đó, chọn Command Prompt. (Không dùng PowerShell vì PowerShell hay chặn lệnh npm với câu "running scripts is disabled".)
3. Muốn có hai khung chạy song song (một cho backend, một cho frontend) thì bấm biểu tượng chia đôi (Split Terminal) ở góc phải khung.

## 5. Tạo database ava

1. Mở Laragon, bấm Start All. Đợi MySQL chạy.
2. Bấm nút Database trong Laragon, trình duyệt mở phpMyAdmin. Đăng nhập với tài khoản root, mật khẩu để trống. Khung "Database server" bên phải phải ghi "Server version: 8.4...".
3. Nếu cột bên trái đã có database ava cũ: bấm tab Databases, đánh dấu duy nhất ô vuông ở dòng ava, bấm nút Drop ở dưới bảng, đọc kỹ thấy đúng chữ ava rồi bấm OK. Lưu ý: khi đã chạy thử thanh toán VNPay thì không xóa rồi tạo lại database ava trong cùng một ngày, vì số đơn quay về 1 sẽ trùng mã đơn đã gửi VNPay (Phần chung C10).
4. Bấm dòng "Server: localhost:3306" ở thanh trên cùng (để không chọn database nào), bấm tab Import, bấm Choose File, chọn file Do_An/database/AVA_CSDL_18-11.sql, để "Character set of the file" là utf-8, kéo xuống cuối trang bấm Import. Thấy khung xanh "Import has been successfully finished" là xong.
5. Bấm F5 để tải lại trang, bấm vào ava ở cột trái: dòng cuối danh sách ghi "23 tables".

## 6. Tạo file cấu hình backend/.env

1. Trong khung bên trái của Visual Studio Code, mở thư mục backend.
2. Chuột phải vào file .env.example, chọn Copy; chuột phải vào thư mục backend, chọn Paste. Được file ".env copy.example".
3. Chuột phải vào file mới, chọn Rename, đổi tên thành `.env` rồi Enter.
4. Mở file .env, điền các dòng còn trống:
   - JWT_SECRET và COOKIE_SECRET: tự gõ hai chuỗi chữ không dấu và số, mỗi chuỗi ít nhất 16 ký tự, hai chuỗi khác nhau.
   - ADMIN_TEN_DANG_NHAP (4 đến 30 chữ không dấu và số), ADMIN_GMAIL (đuôi @gmail.com), ADMIN_MAT_KHAU (đúng 6 chữ số): tài khoản admin của bạn.
   - DB_PASSWORD để trống nếu Laragon chưa đặt mật khẩu MySQL.
   - GMAIL_USER, GMAIL_APP_PASSWORD (khi làm Phần 3, 4) và VNP_TMN_CODE, VNP_HASH_SECRET (khi làm Phần 13) điền sau.
5. Bấm Ctrl+S để lưu. File .env có mật khẩu nên không bao giờ được đưa lên GitHub (file .gitignore đã chặn sẵn).

## 7. Cài thư viện và tạo admin

Gõ lần lượt từng dòng vào khung Command Prompt, mỗi dòng xong bấm Enter và đợi chạy xong:

```
cd backend
npm install
npm run seed
cd ..\frontend
npm install
cd ..
```

Lệnh npm run seed in ra "Đã tạo tài khoản admin ..." là được. Chạy lại lệnh này lần nữa thì nó báo đã có và bỏ qua.

## 8. Chạy website

1. Khung thứ nhất (Command Prompt): `cd backend` rồi `npm run dev`. Đợi dòng "Backend đang chạy tại http://localhost:8000".
2. Chia đôi khung (Split Terminal), khung thứ hai: `cd frontend` rồi `npm run dev`. Đợi dòng "Local: http://localhost:5173/".
3. Muốn tắt thì bấm vào khung đó rồi bấm Ctrl+C.

## 9. Biết đã cài xong

- Mở Chrome, vào http://localhost:8000/api/kiem-tra-ket-noi: thấy {"server":"ok","database":"ok"} là máy chủ đang chạy và đã nối được database ava.
- Vào http://localhost:5173: thấy trang 404 tạm ("Không tìm thấy trang", "Đây là trang tạm của khung dự án...") là giao diện đang chạy. Chưa có trang nào vì chưa làm Phần 1, nên thấy trang này là đúng.
- Trong phpMyAdmin, bấm vào ava rồi bấm bảng nguoi_dung ở cột trái: có 1 dòng admin (vai_tro = 1). Bảng quan_tri_vien có 1 dòng hợp đồng HD-2026-001.

## 10. Chạy kiểm thử và kiểm tra code

Tắt website trước (Ctrl+C ở hai khung) hoặc mở thêm một khung mới, rồi gõ:

```
cd backend
npm test
npm run lint
cd ..\frontend
npm test
npm run lint
npm run build
cd ..
```

- npm test của backend tự xóa và tạo lại database ava_test (database riêng cho kiểm thử) rồi chạy kiểm thử; database ava của bạn không bị đụng tới. Lúc đầu có 5 kiểm thử của khung, phải đều đạt (dấu ✔).
- npm test của frontend có 1 kiểm thử của khung, phải đạt.
- npm run lint không báo lỗi; npm run build chạy xong là được.

## 11. Đẩy code lên GitHub bằng Source Control (bấm chuột)

1. Bấm biểu tượng Source Control ở thanh bên trái (hình ba chấm nối nhau).
2. Lần đầu: bấm Initialize Repository.
3. Kiểm tra danh sách thay đổi KHÔNG có file backend/.env và thư mục node_modules.
4. Gõ lời nhắn vào ô Message, ví dụ "Khởi tạo dự án AVA", bấm dấu ✓ Commit. Nếu hỏi có muốn đưa hết các thay đổi vào không, bấm Yes.
5. Lần đầu nối với kho vinhkieng/Sell-course: bấm dấu ba chấm (...) ở đầu khung Source Control, chọn Remote, chọn Add Remote, dán https://github.com/vinhkieng/Sell-course.git, Enter, đặt tên origin, Enter.
6. Bấm Publish Branch (hoặc Sync Changes). Lần đầu Visual Studio Code mở trình duyệt để đăng nhập GitHub, bấm cho phép.
7. Những lần sau chỉ cần làm bước 4 rồi bấm Sync Changes.

## 12. Xem kết quả GitHub Actions

Mỗi lần đẩy code, GitHub tự kiểm tra trên một máy tạm: oxlint, dựng thử frontend, bật MySQL 8.4 tạm, nạp file SQL, tạo admin giả, chạy kiểm thử backend và frontend. Vào trang kho Sell-course trên GitHub, bấm tab Actions: dấu tích xanh là đạt, dấu X đỏ là có lỗi (bấm vào để xem bước nào lỗi).

## 13. Thử bằng điện thoại cùng wifi (Phần chung C4)

1. Trong Command Prompt gõ `ipconfig`, tìm dòng IPv4 Address của wifi, ví dụ 192.168.1.5.
2. Trong backend/.env đổi CLIENT_ORIGIN=http://192.168.1.5:5173, lưu lại.
3. Tắt rồi chạy lại backend và frontend.
4. Trên điện thoại dùng chung wifi, mở http://192.168.1.5:5173.
5. Thử xong nhớ đổi CLIENT_ORIGIN về http://localhost:5173.

## 14. Làm từng phần với Claude Code

- Mở Claude Code trong thư mục Do_An và gõ, ví dụ: "Làm Phần 1 theo docs/dac_ta/phan_01_khung_trang_chinh_sach_loi.md".
- Làm theo thứ tự Phần 1 đến Phần 24. Làm xong mỗi phần, Claude Code viết kiểm thử theo docs/kiem_thu của phần đó, chạy npm test, rồi hướng dẫn bạn bấm thử.

## 15. Lỗi hay gặp

- "Không kết nối được MySQL": Laragon chưa bấm Start All, hoặc dòng DB_ trong backend/.env sai.
- "Cấu hình trong file .env chưa đúng": đọc dòng báo, sửa đúng dòng đó trong backend/.env.
- "Không bật được backend ở cổng 8000" hoặc "Port 5173 is in use": còn một khung npm run dev cũ đang chạy; tìm khung đó bấm Ctrl+C, hoặc đóng Visual Studio Code rồi mở lại.
- npm báo "Unsupported engine": máy chưa dùng Node 24; cài lại Node 24 ở mục 2.
