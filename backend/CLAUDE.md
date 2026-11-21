# Backend AVA - quy tắc riêng

Đọc cùng với ../CLAUDE.md (Phần chung của đặc tả). File này chỉ gom lại các quy tắc của Phần chung dành cho backend, không thêm luật mới. Nghiệp vụ lấy từ ../docs/dac_ta, tên bảng và cột lấy từ ../database/AVA_CSDL_18-11.sql.

## 1. Công nghệ và lệnh (Phần chung C2)
- Node.js 24, Express 5, JavaScript, ES Modules (import ... from; package.json có "type": "module").
- Thư viện: express, mysql2 (câu SQL viết tay, pool, tham số dấu ?, không dùng ORM), zod, bcrypt, multer, nodemailer, jsonwebtoken, cookie-parser, helmet, cors, dotenv. Công cụ: oxlint, supertest; node:test có sẵn trong Node. Không dùng file-type, không dùng nodemon, không dùng ffmpeg. Không cài thêm thư viện khi chưa hỏi người dùng.
- Lệnh (gõ trong thư mục backend):
  - npm run dev: chạy máy chủ ở cổng 8000, tự chạy lại khi sửa code (node --watch).
  - npm start: chạy máy chủ không tự chạy lại.
  - npm run seed: tạo admin từ ADMIN_TEN_DANG_NHAP, ADMIN_GMAIL, ADMIN_MAT_KHAU trong .env.
  - npm test: tạo lại database ava_test rồi chạy kiểm thử (mục 6).
  - npm run lint: kiểm tra cách viết code bằng oxlint.

## 2. Cấu trúc thư mục
```
server.js          điểm khởi động: tạo thư mục luu_tru, chép chinh_sach.json mặc định, thử kết nối MySQL, bật máy chủ; việc chạy định kỳ (C13) đặt ở đây
app.js             helmet, cors, đọc JSON (1MB), cookie, kiểm Origin, đọc phiên, routes, middleware lỗi; không bật máy chủ (để kiểm thử nạp được)
config.js          đọc .env một lần, kiểm tra bằng Zod; mọi nơi lấy cấu hình từ đây
database/db.js     nhóm kết nối mysql2 (giờ +07:00, cột DATE trả chuỗi yyyy-mm-dd) và withTransaction(congViec)
routes/            index.js gom các nhóm route; mỗi nhóm chức năng một file route riêng rồi gắn vào index.js
controllers/       nhận req, gọi service, trả res; không chứa câu SQL
services/          logic nghiệp vụ theo đặc tả; không dùng req, res
repositories/      toàn bộ câu SQL, mỗi bảng hoặc nhóm bảng một file
validators/        các schema Zod, mỗi nhóm chức năng một file
middleware/        auth.js (docPhien, canDangNhap, canVaiTro), validate.js, checkOrigin.js, errorHandler.js
lib/               httpError.js, token.js (cookie ava_phien), diaChiIp.js, logger.js, maGioiThieu.js, khoiDong.js
constants/         vaiTro.js, trangThai.js (ENUM chép đúng file SQL), nghiepVu.js (số chép đúng đặc tả)
scripts/           seed.js, kiemThu.js
du_lieu_mac_dinh/  chinh_sach.json mặc định (đưa lên GitHub)
luu_tru/           file người dùng tải lên và chinh_sach.json đang dùng (không đưa lên GitHub, chỉ giữ 7 thư mục con)
tests/             kiểm thử backend
```
Luồng một yêu cầu: route, middleware, controller, service, repository, MySQL. File mới đặt đúng thư mục trên (ví dụ lib/email.js, lib/vnpay.js).

## 3. Viết code
- Luôn dùng async/await. Express 5 tự chuyển lỗi của hàm async về middleware lỗi, không cần bọc try/catch chỉ để gọi next(err).
- Chú thích bằng tiếng Việt, chỉ chú thích chỗ không hiển nhiên. Không để lại code thừa đã tắt.
- Ghi nhật ký qua lib/logger.js. Không bao giờ ghi mật khẩu, mã phiên, mã 6 số, khóa VNPay, mật khẩu ứng dụng Gmail, số CCCD (C2). Riêng config.js và scripts/ được in thẳng bằng console.
- Không đọc ghi file kiểu đồng bộ (readFileSync, writeFileSync) trong lúc xử lý yêu cầu.
- Câu SQL luôn có tham số dấu ?, không ghép chuỗi (C6). Nhóm thao tác phải trọn gói thì dùng withTransaction và khóa dòng bằng SELECT ... FOR UPDATE (C6).
- Mọi phép so thời gian (30 phút, 24 giờ, 7 ngày, 10 phút, 60 giây) làm trong câu SQL bằng NOW(), không trộn giờ của Node với giờ của MySQL (C10). Ngoại lệ duy nhất: ngày cập nhật chính sách (Phần 24).
- Trạng thái và giá trị ENUM luôn lấy từ constants/trangThai.js, không gõ tay chuỗi.

## 4. Phản hồi và lỗi (Phần chung C6)
- Thành công trả thẳng dữ liệu, không bọc { data }. Ví dụ { "dang_nhap": false }. Riêng đường IPN của VNPay trả đúng { "RspCode", "Message" } (Phần 13 mục 13.7).
- Lỗi: throw HttpError hoặc các hàm tắt loi400, loi401, loi403, loi404, loi409, loi413, loi429 trong lib/httpError.js. Phản hồi có dạng { "loi": "câu thông báo", "ma": "MA_LOI_NEU_CO", "cac_o": { "ten_o": "câu lỗi dưới ô" } }. Cần trả thêm thông tin thì truyền them, ví dụ loi409('...', { them: { vi_tri_bai: 3 } }); các trường này đứng cùng cấp với loi.
- Mã trạng thái: 400 dữ liệu sai, 401 chưa đăng nhập hoặc phiên hết hiệu lực, 403 sai vai trò hoặc thao tác bị cấm với tài khoản đích, 404 không tìm thấy hoặc không đủ quyền xem, 409 trùng hoặc trạng thái vừa đổi, 413 quá lớn, 429 làm quá nhiều lần. Lỗi không lường trước trả 500 với câu chung.
- Mở dữ liệu của người khác thì trả 404, không trả 403 (C5).

## 5. Phiên, quyền và dữ liệu gửi lên
- docPhien chạy ở mọi đường (gắn trong app.js) và đặt req.nguoiDung (null là khách). Có sẵn id_hoc_vien, id_nguoi_cung_cap, id_quan_tri_vien, dia_chi_ip để dùng ở các bảng nghiệp vụ (C4).
- Đường cần đăng nhập gắn canDangNhap; đường theo vai trò gắn canVaiTro(VAI_TRO.HOC_VIEN) chẳng hạn. Mọi đường đều kiểm tra, không dựa vào việc ẩn nút (C5).
- Tạo phiên bằng datPhien(res, nguoiDung, ipDaXacNhan) trong lib/token.js; với học viên truyền địa chỉ IP đã chuẩn hóa (lib/diaChiIp.js, hàm layIp).
- Mọi dữ liệu từ req.body, req.query, req.params qua validate({ body, query, params }) với schema Zod. Dữ liệu đã kiểm nằm ở req.validated. Câu báo lỗi trong schema đúng nguyên văn đặc tả. Zod 4: ô bị thiếu hẳn thì đặt câu cho cả trường hợp này, ví dụ z.string({ error: 'Vui lòng nhập tên đăng nhập' }).trim().min(1, 'Vui lòng nhập tên đăng nhập'). Chữ người dùng gõ thì trim trước khi kiểm, trừ mật khẩu.
- Thao tác ghi dữ liệu (POST, PUT, PATCH, DELETE) chỉ nhận khi tiêu đề Origin đúng bằng CLIENT_ORIGIN (C6), checkOrigin đã làm sẵn.

## 6. Kiểm thử (Phần chung C2)
- npm test (scripts/kiemThu.js) làm lần lượt: đặt NODE_ENV=test, DB_NAME=ava_test, DUONG_DAN_CHINH_SACH trỏ tới một file tạm; xóa và tạo lại database ava_test từ file SQL; tạo admin kiểm thử (tests/duLieuKiemThu.js); chạy mọi file *.test.js trong tests, lần lượt từng file. Database ava không bị đụng tới.
- Mỗi phần một file: tests/phan_XX_<tên>.test.js (cùng tên với docs/kiem_thu/phan_XX_<tên>.md), mỗi trường hợp tự động trong danh sách là một test, ghi mã trường hợp ở đầu tên test, ví dụ test('P02-01 Đăng ký học viên hợp lệ', ...).
- Dùng supertest gửi yêu cầu vào app.js. Yêu cầu ghi dữ liệu phải set('Origin', ORIGIN_HOP_LE). Cuối mỗi file gọi pool.end() trong after(), như tests/khung_kiem_tra_ket_noi.test.js.
- Kiểm thử không gửi email thật, không gọi VNPay thật: dùng hộp thư giả và VNPay giả khi NODE_ENV=test (C2).
- Các file tests/khung_*.test.js là kiểm thử hạ tầng của khung dự án, giữ nguyên.

## 7. Cấu hình (.env)
- Tên biến xem .env.example. Giá trị công khai điền sẵn, giá trị bí mật để trống (C2). Không bao giờ in giá trị bí mật ra màn hình hay ghi vào nhật ký.
- Chưa điền cấu hình Gmail hoặc VNPay mà dùng tới chức năng cần nó thì báo lỗi rõ thiếu dòng nào trong .env (C2).
- DUONG_DAN_CHINH_SACH chỉ dùng khi kiểm thử, không ghi trong .env.example (Phần 1 mục 1.4).
