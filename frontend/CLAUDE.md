# Frontend AVA - quy tắc riêng

Đọc cùng với ../CLAUDE.md (Phần chung của đặc tả). File này chỉ gom lại các quy tắc của Phần chung dành cho frontend, không thêm luật mới. Giao diện và chữ theo ../thiet_ke; nghiệp vụ theo ../docs/dac_ta.

## 1. Công nghệ và lệnh (Phần chung C2)
- React 19 tạo bằng Vite, viết JavaScript (không dùng TypeScript). File có giao diện đuôi .jsx, file không có giao diện đuôi .js.
- Thư viện: react, react-dom, react-router-dom (chuyển trang), axios (gọi máy chủ, gửi kèm cookie), pdfjs-dist (hiện PDF). Công cụ: vite, @vitejs/plugin-react, oxlint, vitest. Không dùng thư viện giao diện có sẵn (Bootstrap, Tailwind...), không dùng fetch. Không cài thêm thư viện khi chưa hỏi người dùng.
- Phông Be Vietnam Pro nạp từ Google Fonts trong index.html (cỡ 400, 500, 600, 800 như thiết kế).
- Lệnh (gõ trong thư mục frontend):
  - npm run dev: chạy ở http://localhost:5173. Vite chuyển mọi đường /api sang backend cổng 8000, mở cho máy cùng wifi và chuyển kèm địa chỉ thật của máy gửi (C4).
  - npm test: chạy kiểm thử vitest (không có file kiểm thử nào thì vẫn tính là đạt).
  - npm run lint: oxlint. npm run build: dựng thử bản chạy thật.

## 2. Cấu trúc thư mục (trong src/)
```
main.jsx, App.jsx     điểm khởi động: CSS chung, BrowserRouter, CuonTrang, AuthProvider, ErrorBoundary, AppRouter
api/client.js         Axios dùng chung (baseURL '/api', withCredentials); thành công trả thẳng dữ liệu, lỗi đổi thành ApiError
api/ApiError.js       lỗi: status, message (câu loi), ma, cacO ({ ten_o: câu lỗi }), them (các trường khác)
contexts/, hooks/     authContext.js, AuthProvider.jsx (nguoiDung, null là khách), useAuth.js
components/           ErrorBoundary.jsx, CuonTrang.jsx; thành phần dùng chung từ hai nơi trở lên đặt ở đây
router/AppRouter.jsx  khai báo đường dẫn (C7); hiện chỉ có trang 404 tạm, Phần 1 thay
pages/                chung/ (dùng chung nhiều vai trò), student/, provider/, admin/; trang ai cũng vào được (công khai, tài khoản, trang lỗi) đặt trong pages/chung/; mỗi vai trò chia tiếp thư mục con theo thiet_ke/
utils/dinhDang.js     hàm định dạng (C10): dinhDangTien, dinhDangNgay; Phần 1 thêm hàm định dạng ngày giờ, mã đơn, chữ trạng thái (Phần 1 mục 1.1); các hàm khác phần nào dùng thì phần đó thêm
constants/vaiTro.js   VAI_TRO (1 admin, 2 học viên, 3 người cung cấp)
styles/               variables.css (màu, phông theo thiết kế), base.css (CSS chung)
```
- Mỗi file một component, tên file trùng tên component. Phần chỉ một trang dùng thì để cạnh trang đó.
- Trang mới đặt trong pages/<vai trò>/<tên thư mục thiết kế>/, tên thư mục con trùng tên thư mục thiết kế tương ứng trong ../thiet_ke (ví dụ pages/chung/dang_nhap/ chứa TrangDangNhap và TrangXacNhanDangNhap). File .jsx và .css của trang đặt cùng thư mục. Các mục của trang hồ sơ ở phần sau (Phần 8, 13, 14, 17) đặt trong pages/chung/ho_so/.
- Một màn thiết kế thường chỉ vẽ một trạng thái; trang thật là một trang duy nhất, hiện trạng thái tương ứng tùy dữ liệu và người xem (C8).

## 3. Khung dùng chung chỉ viết một lần (Phần chung C2, C9)
- Đầu trang công khai (4 kiểu theo người xem), chân trang, khung hồ sơ (menu bên trái), khung khu quản trị (đầu trang "Quản trị" và menu dọc 8 mục) mỗi thứ chỉ viết một lần rồi gọi lại ở các trang, không chép lại ở từng trang. Gắn khung bằng route lồng nhau của React Router và <Outlet />.
- Trang có chân trang và trang không có chân trang theo đúng danh sách ở C9.
- Thông báo sau khi làm xong một việc hiện thành ô nhỏ góc dưới bên phải, tự tắt sau khoảng 5 giây; lỗi dưới ô nhập hiện chữ đỏ ngay dưới ô (C9).

## 4. Giao diện (Phần chung C8, C10)
- Làm giống hệt file thiết kế: bố cục, màu, cỡ chữ, khoảng cách, chữ trên nút, nhãn, chữ gợi ý trong ô. Chỗ nào phần chức năng ghi khác thiết kế thì làm theo phần chức năng.
- Viết CSS thuần theo thiết kế; màu và phông dùng biến trong styles/variables.css, không ghi mã màu rải rác.
- Mỗi component hoặc trang có kiểu riêng thì kèm một file .css cùng tên đặt ngay cạnh file .jsx (ví dụ DauTrang.jsx và DauTrang.css); kiểu dùng chung nhiều nơi để ở styles/base.css; màu và phông dùng biến trong styles/variables.css.
- Mọi trang hiển thị tốt ở 1280px, 768px và 375px, không vỡ bố cục, không phải kéo ngang (C8).
- Chỉ dùng gạch ngắn "-". Số liệu, tên trong thiết kế chỉ là dữ liệu mẫu; trang thật lấy từ máy chủ.
- Ngày theo giờ Việt Nam, dạng dd/mm/yyyy; tiền dạng 349.000đ (C10). Không dùng dangerouslySetInnerHTML (C6).

## 5. Gọi máy chủ và lỗi
- Mọi lời gọi máy chủ đi qua api/client.js; mỗi nhóm chức năng một file trong api/ (ví dụ api/taiKhoan.js).
- Lỗi 401 kèm ma TAI_KHOAN_BI_KHOA hoặc DANG_NHAP_NOI_KHAC thì chuyển về trang đăng nhập với câu báo ở C4 (Phần 1 làm). Câu báo truyền qua state của bộ chuyển trang, không lên thanh địa chỉ: navigate('/dang-nhap', { state: { cauBao } }); trang đăng nhập (Phần 3) đọc useLocation().state?.cauBao rồi hiện thành dòng báo lỗi đỏ phía trên nút.
- Chưa đăng nhập mà vào trang cần đăng nhập thì chuyển sang trang đăng nhập kèm đường dẫn quay lại nội bộ bắt đầu bằng "/" (C5). Sai vai trò hiện trang 403 ngay tại đường dẫn đang mở, không có đường /khong-co-quyen.

## 6. Kiểm thử (Phần chung C2)
- vitest chỉ kiểm hàm thuần tính toán và định dạng (ví dụ "1.250.000đ", "4,7", "8,00/10", mã đơn). File kiểm thử đặt cạnh file hàm, đuôi .test.js, như utils/dinhDang.test.js.
