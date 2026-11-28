# ĐẶC TẢ WEBSITE AVA CHO CLAUDE CODE
Website bán khóa học trực tuyến AVA - bản đặc tả để lập trình

## Cách dùng file này
- File gồm "Phần chung" và 24 phần chức năng, đánh số theo thứ tự nên làm. Phần 1 đến Phần 23 theo luận văn. Phần 24 là chức năng thêm, không có trong luận văn.
- Nội dung file này cũng nằm sẵn trong thư mục dự án Do_An: Phần chung là docs/dac_ta/phan_00_chung.md, mỗi phần chức năng là một file docs/dac_ta/phan_XX_<tên>.md (ví dụ docs/dac_ta/phan_13_dat_hang_thanh_toan.md). File Word AVA_Dac_ta_cho_Claude_Code.docx (để ngoài thư mục Do_An) và các file trong docs/dac_ta luôn giống nhau.
- Phần chung đã được chép vào file CLAUDE.md ở thư mục gốc Do_An. Claude Code tự đọc file CLAUDE.md mỗi lần làm việc nên mọi phần chức năng đều dùng được các quy tắc chung này. Hai file backend/CLAUDE.md và frontend/CLAUDE.md ghi lại các quy tắc của Phần chung dành riêng cho backend và cho frontend.
- Mỗi lần làm một chức năng: mở Claude Code trong thư mục Do_An và gõ, ví dụ, "Làm Phần 13 theo docs/dac_ta/phan_13_dat_hang_thanh_toan.md" (hoặc dán đúng một phần chức năng, từ dòng tiêu đề của phần đó tới trước tiêu đề phần kế tiếp). Phần đó đã ghi đủ màn thiết kế cần xem, quy tắc, đường xử lý ở máy chủ, bảng dữ liệu, câu thông báo và cách kiểm tra.
- Mỗi phần có một danh sách kiểm thử cùng tên trong thư mục docs/kiem_thu (ví dụ docs/kiem_thu/phan_13_dat_hang_thanh_toan.md). Làm xong một phần thì Claude Code viết code kiểm thử của đúng phần đó theo danh sách này rồi chạy kiểm thử (xem C2).
- Nguồn nghiệp vụ gốc là Chương 2 của luận văn bản ngày 16/11/2026. Chỗ nào file này ghi chi tiết hơn Chương 2 là phần đã được sinh viên chốt thêm để lập trình.

# PHẦN CHUNG (chép vào CLAUDE.md)


## C1. Giới thiệu hệ thống
- AVA là sàn bán khóa học trực tuyến có thu phí, nhiều người cung cấp cùng bán trên một nền tảng. Có bốn nhóm người dùng: khách (chưa đăng nhập), học viên, người cung cấp khóa học (gọi tắt là người cung cấp) và quản trị viên (gọi tắt là admin).
- Người cung cấp tạo khóa học, bấm "Đăng" là khóa lên bán ngay, không có bước admin duyệt. Admin kiểm soát sau khi đăng: xem báo cáo vi phạm của học viên, ẩn hoặc gỡ vĩnh viễn khóa vi phạm.
- Học viên mua khóa qua cổng thanh toán (hiện dùng VNPay ở môi trường thử sandbox, không trừ tiền thật), học bài video, tài liệu PDF và bài trắc nghiệm, đánh giá và báo cáo vi phạm.
- Doanh thu chia theo hai mức cố định: người cung cấp nhận 90% khi học viên mua qua link giới thiệu của chính chủ khóa trong 24 giờ, các trường hợp còn lại nhận 60%. Tiền bán được tạm giữ 7 ngày rồi mới rút được. Học viên được hoàn tiền trong 7 ngày nếu chưa học quá 30% (admin xét).
- Mọi chữ hiển thị trên website là tiếng Việt.

## C2. Công nghệ, thư mục và kiểm thử
- Máy của sinh viên: Windows, Node.js 24 (file .nvmrc ghi 24), MySQL 8.4 chạy trong Laragon. Dự án gồm hai thư mục frontend và backend, nằm chung trong thư mục Do_An. Backend chạy ở cổng 8000, frontend chạy ở cổng 5173.
- Frontend: React tạo bằng Vite, viết JavaScript (không dùng TypeScript), React Router để chuyển trang, gọi máy chủ bằng Axios (không dùng fetch) có gửi kèm cookie (withCredentials). Riêng thẻ video phát thẳng từ đường GET /api/bai-hoc/:id/video và pdfjs-dist tự tải file PDF theo đường dẫn (Phần 14). Vite chuyển mọi đường bắt đầu bằng /api sang backend ở cổng 8000. Hiện tài liệu PDF bằng pdfjs-dist. Giao diện viết CSS theo đúng file thiết kế, không dùng thư viện giao diện có sẵn.
- Đầu trang, chân trang, khung hồ sơ (menu bên trái) và khung khu quản trị (menu dọc 8 mục) chỉ viết một lần thành thành phần dùng chung rồi gọi lại ở các trang, không chép lại ở từng trang.
- Backend: Node.js với Express 5. Đọc ghi MySQL bằng câu SQL viết tay qua thư viện mysql2 (dùng pool và câu lệnh có tham số dấu ?), không dùng ORM (thư viện tự sinh câu SQL). Kiểm tra dữ liệu gửi lên bằng Zod. Băm mật khẩu và mã 6 số bằng bcrypt. Nhận file tải lên bằng multer. Gửi email bằng nodemailer qua Gmail dùng mật khẩu ứng dụng. Phiên đăng nhập dùng jsonwebtoken, đọc cookie bằng cookie-parser, thêm tiêu đề bảo mật bằng helmet, cho phép frontend gọi bằng cors, đọc file .env bằng dotenv.
- Kiểm tra cách viết code bằng oxlint ở cả frontend và backend. Không dùng thư viện file-type (loại file tự kiểm bằng mấy byte đầu, xem C12). Frontend có thêm gói @vitejs/plugin-react (gói đi kèm khi tạo React bằng Vite). Backend tự chạy lại khi sửa code bằng lệnh node --watch có sẵn trong Node, không cài nodemon. Ngoài các thư viện ghi trong mục này không cài thêm thư viện nào khác.
- Cơ sở dữ liệu MySQL tên ava, tạo từ file database/AVA_CSDL_18-11.sql ở thư mục gốc Do_An (23 bảng). Khi cần biết kiểu dữ liệu, độ dài hay ràng buộc chính xác của một cột thì mở file SQL này ra xem. Không tự đổi tên bảng hay tên cột. File SQL đã đúng, không cần sửa trước khi code.
- Tài khoản admin không đăng ký được trên website mà được tạo bằng lệnh npm run seed:
  - Tên đăng nhập, Gmail và mật khẩu của admin lấy từ ba dòng ADMIN_TEN_DANG_NHAP, ADMIN_GMAIL, ADMIN_MAT_KHAU trong backend/.env. Sinh viên tự điền ba dòng này. Mật khẩu admin cũng đúng 6 chữ số. Gmail phải đúng mẫu kiểm tra (CHECK) của cột Gmail trong file SQL.
  - Lệnh tạo một dòng nguoi_dung (vai_tro = 1) và một dòng quan_tri_vien kèm thông tin hợp đồng mẫu: số CCCD 079200001234, ngày cấp 01/05/2021, nơi cấp "Cục Cảnh sát quản lý hành chính về trật tự xã hội", số hợp đồng HD-2026-001, ngày bắt đầu hợp đồng 02/01/2026. Hai dòng được tạo trong một giao dịch.
  - Chạy lại lệnh được: tài khoản đã có (trùng tên đăng nhập hoặc Gmail) thì bỏ qua, không báo lỗi. Điền giá trị khác vào ba dòng trên rồi chạy lại thì tạo thêm một admin thứ hai. Từ admin thứ hai trở đi, số CCCD và số hợp đồng mẫu tự tăng thêm 1 (admin thứ hai là 079200001235 và HD-2026-002, admin thứ ba là 079200001236 và HD-2026-003), vì file SQL không cho hai admin trùng hai số này.
  - Số CCCD chỉ admin xem được và không bao giờ được ghi vào nhật ký.
- Kiểm thử: mỗi phần làm xong phải có kiểm thử.
  - Backend dùng node:test (có sẵn trong Node) cùng supertest, gửi yêu cầu vào từng đường API rồi so kết quả với đặc tả. Kiểm thử chạy trên database riêng tên ava_test: mỗi lần chạy thì xóa và tạo lại ava_test từ file database/AVA_CSDL_18-11.sql rồi tạo admin. Database ava không bị đụng tới.
  - Frontend dùng vitest, chỉ kiểm các hàm thuần tính toán và định dạng, ví dụ "1.250.000đ", "4,7", "8,00/10" và mã đơn.
  - Danh sách các trường hợp cần kiểm của mỗi phần nằm ở docs/kiem_thu/phan_XX_<tên>.md. Làm xong phần nào thì viết code kiểm thử của phần đó vào backend/tests (và frontend nếu có hàm thuần) theo đúng danh sách, rồi chạy cho tới khi qua hết.
  - Kiểm thử không gửi email thật và không gọi VNPay thật: dùng hộp thư giả và VNPay giả.
  - GitHub Actions chạy mỗi lần đẩy code lên GitHub: kiểm tra cách viết code (oxlint) và dựng thử frontend; bật một MySQL 8.4 tạm, nạp file SQL, chạy lệnh tạo admin, rồi chạy kiểm thử backend; chạy kiểm thử vitest của frontend. Chỉ chạy các kiểm thử đã có.
- Các thông số cấu hình nằm trong file backend/.env. File này không bao giờ được đưa lên GitHub. Có file backend/.env.example (được đưa lên GitHub) ghi tên mọi biến:
  - Giá trị công khai được điền sẵn trong .env.example, ví dụ cổng máy chủ 8000, CLIENT_ORIGIN = http://localhost:5173 (địa chỉ frontend), máy và tên database (localhost, ava), các đường dẫn VNPay sandbox.
  - Giá trị bí mật để trống trong .env.example, sinh viên tự điền vào .env, và không bao giờ in ra màn hình hay ghi vào nhật ký: mật khẩu MySQL, khóa ký phiên đăng nhập, khóa ký cookie (COOKIE_SECRET), Gmail và mật khẩu ứng dụng Gmail, mã website VNPay (vnp_TmnCode), khóa bí mật VNPay (vnp_HashSecret), mật khẩu admin.
  - Chưa điền cấu hình Gmail hoặc VNPay mà dùng tới chức năng cần nó thì máy chủ báo lỗi rõ ràng là đang thiếu dòng nào trong .env.

## C3. Hai cột da_xoa và khong_chan_ma_bam của bài học
- File SQL 18-11 đã có sẵn cột khong_chan_ma_bam trong bảng bai_hoc và cột tự tính ma_bam_dang_dung = IF(da_xoa = 0 AND khong_chan_ma_bam = 0, ma_bam_file, NULL). Cột ma_bam_dang_dung có ràng buộc không trùng, nên một file (cùng mã băm) chỉ được dùng ở một bài đang có hiệu lực.
- da_xoa = 1 nghĩa là người cung cấp đã xóa bài đó hoặc đã xóa cả khóa học. Bài đã xóa không còn chặn người khác đăng cùng file.
- khong_chan_ma_bam = 1 nghĩa là khóa học của bài đó đã bị gỡ vĩnh viễn. Bài vẫn còn (da_xoa vẫn là 0, admin vẫn xem được), nhưng không còn chặn người khác đăng lại cùng file (đúng Chương 2).
- Khi khóa chuyển "Bị gỡ vĩnh viễn" (do admin gỡ, do ẩn lần thứ hai, hoặc do khóa tài khoản người cung cấp ở lần ẩn thứ hai) thì đặt khong_chan_ma_bam = 1 cho mọi bài của khóa đó trong cùng một giao dịch.
- Cột bi_an_boi của bảng khoa_hoc dùng giá trị 'Hệ thống - khóa tài khoản' (gạch ngắn), đúng như file SQL.

## C4. Vai trò và phiên đăng nhập
- Cột nguoi_dung.vai_tro: 1 = admin, 2 = học viên, 3 = người cung cấp. Mỗi tài khoản đúng một vai trò. Học viên có thêm một dòng trong hoc_vien, người cung cấp có một dòng trong nguoi_cung_cap, admin có một dòng trong quan_tri_vien (cột id_nguoi_dung trỏ về nguoi_dung). Các bảng nghiệp vụ trỏ về bảng con (id_hoc_vien, id_nguoi_cung_cap, id_quan_tri_vien), riêng lich_su_khoa_hoc.id_nguoi_dung trỏ về nguoi_dung.
- Phiên đăng nhập là một mã có chữ ký (JWT) cất trong cookie tên ava_phien: httpOnly (mã JavaScript của trang không đọc được), SameSite=Lax, có hạn 7 ngày. Trong mã có id người dùng, vai trò, thời điểm hết hạn, và với học viên thì có thêm địa chỉ IP đã xác nhận lúc đăng nhập. Không có bảng phiên trong cơ sở dữ liệu.
- Mỗi yêu cầu có gửi kèm cookie ava_phien, ở bất kỳ đường nào kể cả đường công khai không cần đăng nhập, máy chủ đọc lại dòng nguoi_dung:
  - khoa = 1 thì xóa cookie, trả lỗi 401 kèm mã TAI_KHOAN_BI_KHOA và lý do khóa. Frontend chuyển về trang đăng nhập với dòng "Tài khoản đã bị khóa. Lý do: [lý do]. Liên hệ hỗ trợ nếu bạn cho rằng có nhầm lẫn."
  - Học viên mà địa chỉ IP trong mã khác hoc_vien.dia_chi_ip (nghĩa là đã xác nhận đăng nhập ở nơi khác) thì xóa cookie, trả 401 kèm mã DANG_NHAP_NOI_KHAC. Frontend chuyển về trang đăng nhập với dòng "Tài khoản của bạn vừa đăng nhập ở một địa chỉ mạng khác."
- Đổi mật khẩu hoặc đặt lại mật khẩu không đăng xuất các nơi khác (hạn chế đã biết).
- Địa chỉ IP lấy từ yêu cầu và quy về một dạng trước khi so: "::1" và "::ffff:127.0.0.1" đổi thành "127.0.0.1", bỏ phần "::ffff:" ở đầu các địa chỉ IPv4.
- Máy trung gian: Express luôn tin địa chỉ do máy trung gian chạy ngay trên máy mình (loopback, tức Vite) chuyển tới. Vite được đặt để mở cho các máy khác trong cùng mạng wifi (mạng LAN) và chuyển kèm địa chỉ thật của máy gửi yêu cầu (tùy chọn xfwd). Biến môi trường TIN_MAY_TRUNG_GIAN (mặc định tắt) chỉ dùng khi đưa website lên máy chủ thật có máy trung gian khác đứng trước.
- Thử luồng "địa chỉ mạng mới" bằng điện thoại trên máy cá nhân: chỉ đổi một dòng CLIENT_ORIGIN trong backend/.env thành địa chỉ wifi của máy tính (ví dụ http://192.168.1.5:5173), chạy lại backend và frontend, rồi mở địa chỉ đó trên điện thoại dùng chung wifi. Máy chủ sẽ thấy địa chỉ 192.168.x.x của điện thoại. Khi đưa lên tên miền thật thì điện thoại dùng bình thường, không cần làm bước này.

## C5. Phân quyền
Mọi đường xử lý ở máy chủ đều kiểm tra đăng nhập và vai trò, không chỉ dựa vào việc ẩn nút trên giao diện.
| Chức năng | Khách | Học viên | Người cung cấp | Admin |
| --- | --- | --- | --- | --- |
| Xem trang chủ, danh sách và chi tiết khóa học đang bán; tìm kiếm, lọc, sắp xếp; xem bài học thử | Có | Có | Có | Có |
| Đăng ký, đăng nhập, quên mật khẩu | Có | Không | Không | Không |
| Đăng xuất, xem và sửa hồ sơ, đổi mật khẩu | Không | Có | Có | Có |
| Giỏ hàng | Có (giỏ tạm trong trình duyệt) | Có | Không | Không |
| Thanh toán, lịch sử và chi tiết đơn hàng, kiểm tra lại thanh toán | Phải đăng nhập bằng tài khoản học viên | Đơn của mình | Không | Không |
| Vào học, làm bài trắc nghiệm, tiến độ học | Chỉ bài học thử, không có tiến độ | Khóa có quyền học (có tiến độ); khóa khác chỉ bài học thử | Khóa của mình, không tạo tiến độ | Mọi khóa, không tạo tiến độ |
| Đánh giá khóa học | Không | Khóa có quyền học và đã học xong ít nhất 1 bài | Không | Không |
| Xem đánh giá; báo cáo đánh giá vi phạm | Chỉ xem | Xem; báo cáo khi đang có quyền học khóa đó (trừ đánh giá của chính mình) | Chỉ xem | Chỉ xem |
| Báo cáo khóa học vi phạm | Không | Khi đang có quyền học: phần giới thiệu khóa và mọi bài | Không | Không |
| Chia sẻ link khóa học đang bán | Có (link thường, không có mã) | Có (link kèm mã giới thiệu) | Khóa của người khác: link kèm mã; khóa của mình: nút "Sao chép link giới thiệu" ở hồ sơ | Không |
| Tạo, đăng, sửa, ẩn, đăng lại, xóa khóa học và bài học; ví, rút tiền; nhận thông báo | Không | Không | Khóa và ví của mình | Không |
| Ẩn, gỡ vĩnh viễn khóa học; xử lý báo cáo; quản lý người dùng và danh mục; xem đơn hàng và hoàn tiền; duyệt rút tiền; xem lịch sử khóa học | Không | Không | Không | Có |
| Xem trang Chính sách và điều khoản | Có | Có | Có | Có |
| Thêm, sửa, xóa, đổi thứ tự các điều của chính sách (Phần 24, chức năng thêm, không có trong luận văn) | Không | Không | Không | Có |

- Chưa đăng nhập mà vào trang cần đăng nhập thì chuyển sang trang đăng nhập, đăng nhập xong quay lại đúng trang đó (chỉ nhận đường dẫn quay lại là đường dẫn nội bộ bắt đầu bằng "/", không nhận địa chỉ trang khác để chống chuyển hướng sang trang lạ).
- Sai vai trò thì hiện trang lỗi 403 "Bạn không có quyền truy cập" ngay tại đường dẫn đang mở, không chuyển sang đường dẫn khác (không có đường /khong-co-quyen). Trang không tồn tại hoặc người xem không đủ quyền xem nội dung đó thì hiện trang lỗi 404.
- Người cung cấp chỉ thao tác trên khóa học, bài học và ví của mình; học viên chỉ xem giỏ hàng, đơn hàng, tiến độ của mình. Mở dữ liệu của người khác thì trả 404.
- Quyền học (dùng ở nhiều phần): học viên được học một khóa khi cả bốn điều sau đúng: có ít nhất một dòng chi_tiet_don_hang của khóa đó thuộc một don_hang của chính học viên có trang_thai 'Đã thanh toán' và da_hoan_tien = 0; khóa không 'Bị gỡ vĩnh viễn' và chưa bị xóa; tài khoản học viên không bị khóa; tài khoản người cung cấp chủ khóa không bị khóa. Không có bảng ghi danh, quyền học luôn được tính lại từ đơn hàng. Khóa đang "Bị ẩn" thì học viên đã mua vẫn học bình thường.
- "Học viên đã mua" (dùng cho trang "Khóa học không khả dụng" và nhãn "Không khả dụng"): học viên có ít nhất một dòng chi_tiet_don_hang của khóa đó trong đơn 'Đã thanh toán' của chính mình với da_hoan_tien = 0, không xét trạng thái khóa và tài khoản người cung cấp.

## C6. Quy ước đường xử lý ở máy chủ (API)
- Mọi đường bắt đầu bằng /api, nhận và trả dữ liệu dạng JSON (trừ tải file lên và phát file).
- Thành công thì trả thẳng dữ liệu, không bọc trong { data }, ví dụ { "dang_nhap": false }. Riêng đường IPN (máy chủ VNPay gọi tới) trả đúng { "RspCode", "Message" } như VNPay yêu cầu (Phần 13 mục 13.7); đường trình duyệt quay về từ VNPay trả dữ liệu như mọi đường khác.
- Lỗi trả theo mẫu: mã trạng thái HTTP kèm nội dung { "loi": "câu thông báo hiện cho người dùng", "ma": "MA_LOI_NEU_CO", "cac_o": { "ten_o": "câu lỗi dưới ô đó" } }. Chỗ nào phần chức năng cần trả thêm thông tin thì thêm trường cùng cấp với loi, ma, cac_o (ví dụ vi_tri_bai khi trùng file, số giây còn lại khi bị chặn).
- Dùng 400 khi dữ liệu sai, 401 khi chưa đăng nhập hoặc phiên hết hiệu lực, 403 khi sai vai trò (ví dụ người cung cấp gọi API giỏ hàng) hoặc khi thao tác bị cấm với tài khoản đích (admin khóa tài khoản admin, Phần 21), 404 khi không tìm thấy hoặc không đủ quyền xem, 409 khi trùng hoặc trạng thái vừa đổi, 413 khi file hoặc dữ liệu gửi lên quá lớn, 429 khi bị chặn do làm quá nhiều lần.
- Mọi thao tác làm thay đổi dữ liệu dùng POST, PUT, PATCH hoặc DELETE và chỉ nhận khi tiêu đề Origin đúng bằng CLIENT_ORIGIN (chống trang web lạ lợi dụng cookie đăng nhập, gọi là CSRF). Ngoại lệ: hai đường nhận kết quả từ cổng thanh toán (Phần 13).
- Dữ liệu gửi lên luôn được kiểm tra lại ở máy chủ bằng Zod (độ dài, định dạng, giá trị cho phép), kể cả khi trang đã kiểm tra trước.
- Câu SQL luôn có tham số, không ghép chuỗi. Nội dung người dùng gõ khi hiển thị phải được thoát ký tự (React tự làm; không dùng dangerouslySetInnerHTML) để chống chèn mã script (XSS).
- Nhóm thao tác phải "trọn gói hoặc không gì cả" thì chạy trong một giao dịch cơ sở dữ liệu (transaction) và khóa dòng cần thiết bằng SELECT … FOR UPDATE.
- Đường GET /api/kiem-tra-ket-noi (có sẵn trong khung dự án) trả { "server": "ok", "database": "ok" } khi máy chủ chạy và kết nối được MySQL. Đường này dùng để kiểm tra máy chủ còn chạy, kể cả trong GitHub Actions.

## C7. Đường dẫn các trang (frontend)
- / trang chủ; /khoa-hoc danh sách khóa học (nhận ?tu_khoa=, ?danh_muc=, ?gia=, ?sap_xep=, ?trang=); /khoa-hoc/:id chi tiết khóa học (đường dẫn dùng số id của khóa, không dùng chữ không dấu; chữ "ava.vn/khoa-hoc/lap-trinh-web" trong thiết kế chỉ là minh họa); /khoa-hoc/:id/hoc/:idBai trang học.
- /dang-ky, /dang-nhap, /xac-nhan-dang-nhap, /quen-mat-khau, /dat-lai-mat-khau.
- /gio-hang, /thong-tin-don-hang, /thanh-toan/ket-qua (trang kết quả sau khi cổng thanh toán đưa về), /don-hang/:id (chi tiết đơn của học viên).
- /ho-so (trang hồ sơ dài, menu trái bấm thì cuộn tới mục). Các mục: #thong-tin-ca-nhan, #doi-mat-khau; học viên thêm #khoa-hoc-cua-toi, #tien-do-hoc, #lich-su-don-hang; người cung cấp thêm #quan-ly-khoa-hoc, #vi, #rut-tien; admin thêm #thong-tin-hop-dong.
- /nguoi-cung-cap/tao-khoa-hoc (tạo khóa), /nguoi-cung-cap/khoa-hoc/:id (quản lý khóa), /thong-bao (tất cả thông báo của người cung cấp).
- /chinh-sach: mỗi điều có neo #dieu-<số thứ tự của điều>, ví dụ #dieu-1 là Điều 1.
- Khu quản trị: /quan-tri/khoa-hoc (trang mở đầu khi admin đăng nhập), /quan-tri/khoa-hoc/:id, /quan-tri/bao-cao-khoa-hoc, /quan-tri/bao-cao-danh-gia, /quan-tri/nguoi-dung, /quan-tri/danh-muc, /quan-tri/don-hang, /quan-tri/rut-tien, /quan-tri/chinh-sach.

## C8. Dùng thiết kế
- Thiết kế nằm ở thư mục thiet_ke/ trong Do_An, mỗi chức năng một thư mục con, mỗi màn một file HTML. Mỗi phần chức năng ghi rõ đường dẫn các file cần xem. Phụ lục A cuối file là bảng đối chiếu tên màn với tên file.
- File thiết kế là chuẩn cho bố cục, màu, cỡ chữ, khoảng cách, chữ trên nút, nhãn, chữ gợi ý trong ô. Làm giống hệt. Font chữ Be Vietnam Pro.
- Số liệu, tên người, tên khóa trong thiết kế chỉ là dữ liệu mẫu; trang thật lấy dữ liệu từ cơ sở dữ liệu. Chữ có dạng [Số], [Tên người dùng], [Năm] là chỗ điền dữ liệu thật.
- Một màn thiết kế thường chỉ vẽ một trạng thái (ví dụ đang báo lỗi). Trang thật là một trang duy nhất, hiện trạng thái tương ứng tùy dữ liệu và người xem.
- Chỗ nào phần chức năng ghi khác thiết kế thì làm theo phần chức năng.
- Trang "Trang thanh toán VNPay (minh họa)" là trang của VNPay, AVA không làm trang này.
- Giao diện điện thoại: mọi trang phải hiển thị tốt ở ba độ rộng 1280px (máy tính), 768px (máy tính bảng) và 375px (điện thoại), không vỡ bố cục, không phải kéo ngang. Thiết kế chỉ có bản máy tính. Ở độ rộng nhỏ, Claude Code tự xếp lại bố cục nhưng giữ cùng màu, chữ, kiểu nút của thiết kế, ví dụ menu thành nút ba gạch, các cột xếp chồng lên nhau.

## C9. Đầu trang, chân trang, thông báo nhỏ
- Đầu trang công khai có bốn kiểu theo người xem (xem thiet_ke/chung/):
  - Khách: logo AVA, nút "Danh mục" (menu xổ), "Khóa học nổi bật", "Chính sách", ô tìm kiếm, biểu tượng giỏ hàng, "Đăng nhập", "Đăng ký".
  - Học viên: như khách nhưng thay "Đăng nhập", "Đăng ký" bằng ảnh đại diện; bấm ảnh đại diện mở menu "Hồ sơ cá nhân", "Khóa học của tôi", "Lịch sử đơn hàng", "Đăng xuất".
  - Người cung cấp: thêm mục "Tạo khóa học" trên thanh, chuông thông báo có số chưa đọc, không có giỏ; menu ảnh đại diện có "Hồ sơ cá nhân", "Quản lý khóa học", "Rút tiền", "Đăng xuất".
  - Admin xem trang công khai: không giỏ, không chuông; menu ảnh đại diện có "Trang quản trị", "Hồ sơ", "Đăng xuất".
- Ảnh đại diện: có ảnh thì hiện ảnh, chưa có thì hiện chữ cái đầu của họ tên (họ tên trống thì chữ cái đầu của tên đăng nhập), in hoa.
- Menu "Danh mục" chỉ liệt kê danh mục đang có ít nhất một khóa "Đang bán" (chưa xóa), sắp theo tên; cuối menu có "Xem tất cả khóa học" mở /khoa-hoc. Bấm một danh mục mở /khoa-hoc?danh_muc=<id>.
- Ô tìm kiếm: gõ rồi bấm Enter thì mở /khoa-hoc?tu_khoa=<chữ đã gõ>. Ô để trống (hoặc chỉ có dấu cách) mà bấm Enter thì không làm gì, vẫn ở trang đó.
- Bấm logo AVA ở mọi trang (kể cả khu quản trị) về trang chủ.
- Chân trang lấy chân trang của màn Trang chủ làm chuẩn, giống hệt nhau ở mọi trang có chân trang:
  - Logo AVA, câu "Học từng bài, mỗi ngày tiến thêm một bước." và ba biểu tượng mạng xã hội.
  - Cột "Danh mục": tối đa 5 danh mục có nhiều khóa đang bán nhất.
  - Cột "Về chúng tôi": "Về AVA" mở /chinh-sach#dieu-1 (cuộn tới Điều 1); "Chính sách và điều khoản" mở /chinh-sach từ đầu trang.
  - Cột "Hỗ trợ": chỉ có dòng "avahotro@gmail.com", bấm vào thì mở ứng dụng thư (liên kết mailto:avahotro@gmail.com).
  - Khối "Liên hệ hỗ trợ": "Gmail: avahotro@gmail.com", "Điện thoại: 028 7300 8899", "Giờ làm việc: 8:00 - 17:00, thứ Hai đến thứ Sáu".
  - Dòng cuối: "© [Năm] AVA. Bảo lưu mọi quyền." (điền năm hiện tại) và "Thanh toán an toàn qua VNPay" (tên cổng lấy từ cong_thanh_toan.ten).
- Trang có chân trang: mọi trang dùng đầu trang công khai (trừ trang học và trang làm bài trắc nghiệm), gồm trang chủ, danh sách khóa học, chi tiết khóa học, giỏ hàng, thông tin đơn hàng, kết quả thanh toán, chi tiết đơn hàng, hồ sơ, trang Thông báo, tạo khóa học, quản lý khóa học (kể cả thêm và sửa bài), Chính sách, trang lỗi 403 và 404. Nhiều màn thiết kế của các trang này không vẽ chân trang, nhưng trang thật vẫn có.
- Trang không có chân trang: các trang tài khoản không dùng đầu trang công khai (đăng nhập, xác nhận đăng nhập, đăng ký, quên mật khẩu, đặt lại mật khẩu), trang học, trang làm bài trắc nghiệm và mọi trang dùng đầu trang "Quản trị" (toàn bộ khu quản trị và trang hồ sơ của admin).
- Khu quản trị có đầu trang gọn chữ "Quản trị" và menu dọc 8 mục: Khóa học, Báo cáo khóa học, Báo cáo đánh giá, Người dùng, Danh mục, Đơn hàng, Yêu cầu rút tiền, Chính sách. Ba mục có số tròn: "Báo cáo khóa học" = số dòng đang chưa xử lý (cách gom dòng ở Phần 20), "Báo cáo đánh giá" = số đánh giá đang có phiếu chưa xử lý, "Yêu cầu rút tiền" = số yêu cầu "Chờ duyệt". Số bằng 0 thì không hiện. Mục "Chính sách" không có số tròn.
- Thông báo sau khi làm xong một việc hoặc sau khi chuyển trang (ví dụ "Đã thêm vào giỏ hàng") hiện thành ô nhỏ ở góc dưới bên phải, tự tắt sau khoảng 5 giây. Lỗi dưới ô nhập thì hiện chữ đỏ ngay dưới ô.

## C10. Định dạng chung
- Giờ: mọi mốc thời gian tính theo giờ Việt Nam (+07:00). Kết nối mysql2 đặt timezone '+07:00' và chạy SET time_zone = '+07:00' cho mỗi kết nối. Mọi phép so thời gian (30 phút, 24 giờ, 7 ngày, 10 phút, 60 giây) làm trong câu SQL bằng NOW() của MySQL, không trộn giờ của Node với giờ của MySQL. Ngoại lệ thứ nhất: ngày "Cập nhật lần cuối" của trang Chính sách lấy theo giờ Node ở múi giờ Asia/Ho_Chi_Minh, vì nội dung chính sách nằm trong file, không nằm trong MySQL (Phần 24 mục 24.4). Ngoại lệ thứ hai: dọn file tạm quá 24 giờ so theo giờ của file trên máy chủ, vì file tạm không nằm trong MySQL.
- Ngày hiển thị dạng dd/mm/yyyy, ngày giờ dạng dd/mm/yyyy HH:mm. Thời điểm trong chuông thông báo hiện kiểu "5 phút trước", "2 giờ trước", "Hôm qua", "3 ngày trước", quá 7 ngày thì hiện ngày.
- Tiền là số nguyên đồng, hiện có dấu chấm ngăn nghìn và chữ đ liền sau, ví dụ 349.000đ.
- Điểm, phần trăm: điểm trung bình đánh giá làm tròn 1 chữ số thập phân, dùng dấu phẩy (4,7); tỷ lệ từng mức sao làm tròn thành số nguyên phần trăm; điểm trắc nghiệm làm tròn 2 chữ số thập phân, hiện dạng 8,00/10; tiến độ khóa làm tròn xuống thành số nguyên phần trăm; phần tiền người cung cấp nhận làm tròn xuống đồng, phần AVA nhận = giá trừ phần người cung cấp.
- Mã đơn hiển thị dạng AVA-yymmdd-nnnn, ghép từ don_hang.ngay_tao (yymmdd) và don_hang.id đệm số 0 bên trái cho đủ ít nhất 4 chữ số (vượt 9999 thì để nguyên số chữ số). Mã đơn không lưu thành cột. Khi nhận mã đơn từ ngoài vào, tách phần số để tìm đơn theo id rồi so lại phần ngày với ngay_tao. Lưu ý khi chạy thử: không xóa và tạo lại database ava trong cùng một ngày (id quay về 1 sẽ trùng mã đơn đã gửi VNPay). Luật này chỉ áp cho database ava; database kiểm thử ava_test dùng VNPay giả nên được xóa và tạo lại mỗi lần chạy kiểm thử.
- Tên hiện ở trang công khai (người cung cấp, người viết đánh giá) là họ tên; họ tên trống thì hiện "Học viên AVA". Khu quản trị hiện tên đăng nhập.
- Trên giao diện chỉ dùng gạch ngắn "-", không dùng gạch dài.

## C11. Đổi giá trị lưu sang chữ hiển thị
- khoa_hoc.trang_thai và bi_an_boi: 'Đang bán' → "Đang bán"; 'Bị ẩn' + 'Tự ẩn' → "Bị ẩn (tự ẩn)"; 'Bị ẩn' + 'Admin ẩn' → "Bị ẩn (admin ẩn)"; 'Bị ẩn' + 'Hệ thống - khóa tài khoản' → "Bị ẩn (hệ thống - khóa tài khoản)"; 'Bị gỡ vĩnh viễn' → "Bị gỡ vĩnh viễn".
- bao_cao_khoa_hoc.bien_phap_xu_ly: NULL → "Chưa xử lý"; 'Không vi phạm' → "Không vi phạm"; 'Ẩn khóa' → "Đã ẩn khóa"; 'Gỡ vĩnh viễn' → "Đã gỡ vĩnh viễn".
- bao_cao_danh_gia.bien_phap_xu_ly: NULL → "Chưa xử lý"; 'Không vi phạm' → "Không vi phạm"; 'Ẩn đánh giá' → "Đã ẩn đánh giá".
- giao_dich_thanh_toan.nguon_den: 'Trình duyệt' → "Trình duyệt"; 'Máy chủ cổng thanh toán' → "Máy chủ " + tên cổng (ví dụ "Máy chủ VNPay"); 'Kiểm tra lại' → "Kiểm tra lại".
- Tên cổng thanh toán (chữ "VNPay" trên giao diện) lấy từ cong_thanh_toan.ten, không viết cứng trong code. Riêng chữ "VNPay" nằm trong nội dung các điều của chính sách là chữ thường do admin gõ (Phần 24).

## C12. Lưu file
- Mọi file nằm trong thư mục backend/luu_tru (không công khai, không phục vụ trực tiếp), tên file trên máy chủ là chuỗi ngẫu nhiên (uuid) kèm đuôi: luu_tru/video, luu_tru/tai_lieu, luu_tru/anh_bia, luu_tru/anh_dai_dien, luu_tru/tam/<id_nguoi_cung_cap> (file tạm lúc tạo hoặc sửa khóa), luu_tru/kho_luu_tru (file cũ giữ làm bằng chứng), luu_tru/noi_dung (file chinh_sach.json chứa nội dung trang Chính sách, Phần 24). Riêng file mặc định backend/du_lieu_mac_dinh/chinh_sach.json nằm ngoài luu_tru và được đưa lên GitHub (Phần 1 mục 1.3).
- Cột lưu file trong database ghi đường dẫn tương đối tính từ luu_tru, ví dụ anh_bia/3f2a....jpg.
- Kiểm tra loại file thật bằng mấy byte đầu file, không tin phần đuôi tên file: MP4 có chữ "ftyp" ở vị trí byte thứ 4; PDF bắt đầu bằng "%PDF-"; JPG bắt đầu bằng FF D8 FF; PNG bắt đầu bằng 89 50 4E 47.
- Video và tài liệu chỉ lấy được qua đường có kiểm tra quyền (Phần 14). Video trả về theo từng đoạn (HTTP Range, trình duyệt xin từng phần của file) để tua được.
- Ảnh bìa và ảnh đại diện lấy qua hai đường công khai (không cần đăng nhập): GET /api/anh/anh_bia/<tên file> và GET /api/anh/anh_dai_dien/<tên file>. Đường này chỉ cho lấy trong hai thư mục anh_bia và anh_dai_dien, tên file phải đúng mẫu uuid kèm đuôi; sai thì trả 404.
- Dấu vân tay của file (mã băm SHA-256 viết chữ thường 64 ký tự) do máy chủ tự tính sau khi nhận đủ file.
- Thời lượng video do trình duyệt đọc được khi phát thử và gửi lên (giây, số nguyên làm tròn lên); máy chủ chỉ kiểm tra trong khoảng 1 đến 21600 giây (1 giây đến 6 giờ). Không dùng ffmpeg.

## C13. Bộ đếm trong bộ nhớ máy chủ và việc chạy định kỳ
- Ba bộ đếm sau lưu trong bộ nhớ của máy chủ Node (một Map), không lưu cơ sở dữ liệu; khởi động lại máy chủ thì về 0 (hạn chế đã biết):
  - Số lần đăng nhập sai liên tiếp theo tên đăng nhập (viết thường): sai 5 lần liên tiếp thì chặn tên đó 5 phút.
  - Số lần đăng nhập sai theo địa chỉ IP: 20 lần sai trong 15 phút thì chặn địa chỉ đó 15 phút.
  - Số lần gửi mã xác nhận đăng nhập theo từng học viên: tối đa 5 lần trong 1 giờ.
- Việc chạy định kỳ trong máy chủ:
  - Mỗi phút: chuyển mọi đơn "Chờ thanh toán" có ngay_tao quá 30 phút sang "Hết hạn".
  - Mỗi giờ: xóa file tạm (và file mô tả kèm theo) trong luu_tru/tam có thời điểm tải lên quá 24 giờ.

## C14. Email
- Website chỉ gửi email ở hai chỗ: mã đặt lại mật khẩu (Phần 4) và mã xác nhận đăng nhập khi học viên đăng nhập từ địa chỉ IP mới (Phần 3). Gửi bằng một Gmail riêng của website dùng mật khẩu ứng dụng. Không gửi email ở bất kỳ chỗ nào khác.
- Chưa điền Gmail hoặc mật khẩu ứng dụng trong backend/.env mà dùng tới chức năng gửi email thì máy chủ báo lỗi rõ ràng là đang thiếu dòng nào. Khi chạy kiểm thử thì dùng hộp thư giả, không gửi thư thật.

## C15. Lịch sử khóa học (dùng ở nhiều phần)
- Mọi thay đổi của khóa, dù nhỏ nhất, ghi thêm một dòng vào lich_su_khoa_hoc; không bao giờ sửa hay xóa dòng lịch sử. Mỗi dòng có: id_khoa_hoc, id_bai_hoc (nếu thay đổi một bài), id_nguoi_dung (người thực hiện; việc do hệ thống tự làm thì ghi admin đã gây ra việc đó), hanh_dong (một trong 19 giá trị trong file SQL), noi_dung_thay_doi (mô tả ngắn, ví dụ "Sửa thông tin khóa - Mô tả" hoặc "Xóa bài - Bài 07 Bảng màu cơ bản"), gia_tri_cu, gia_tri_moi, duong_dan_file_cu (với "Thay file", "Xóa bài", "Đổi ảnh bìa"), ghi_chu (lý do xóa bài, lý do ẩn, lý do gỡ), ngay_tao.
- Số lần khóa đã bị ẩn (dùng cho luật hai lần) đếm số dòng có hanh_dong là 'Quản trị viên ẩn khóa' hoặc 'Hệ thống ẩn do khóa tài khoản'. Người cung cấp tự ẩn không tính.

## C16. Phân trang
- Danh sách khóa học 9 khóa mỗi trang. Mọi bảng ở khu quản trị 20 dòng mỗi trang. Bảng "Doanh thu gần đây" ở ví 5 dòng mỗi trang. Lịch sử đơn hàng và lịch sử yêu cầu rút tiền 10 dòng mỗi trang. Đánh giá ở trang chi tiết hiện 3 cái đầu, mỗi lần bấm "Xem thêm đánh giá" tải thêm 10. Chuông thông báo hiện 5 thông báo mới nhất; trang Thông báo 10 thông báo mỗi trang.

## C17. Hạn chế đã biết (không cần xử lý)
- Không dùng chống sao chép nội dung số (DRM): học viên đã mua vẫn có thể quay màn hình hoặc tải video qua trình duyệt.
- Máy chủ tin thời lượng video do trình duyệt gửi lên.
- Bộ đếm sai mật khẩu, chặn địa chỉ IP và số lần gửi mã mất khi khởi động lại máy chủ.
- Gmail không được kiểm tra lúc đăng ký và lúc đổi Gmail.
- Lượt làm bài trắc nghiệm bỏ dở mà học viên không mở lại bài thì nằm lại trong bảng.
- Không lưu đề cũ khi người cung cấp sửa bài trắc nghiệm; chỉ lưu điểm cao nhất, không lưu lịch sử từng lần làm.
- Đơn được hoàn tất nhờ "Kiểm tra lại thanh toán" có thời điểm thanh toán là lúc AVA nhận được câu trả lời, muộn hơn lúc học viên trả tiền thật.
- Dòng trong sổ kết quả thanh toán không gắn với đơn nào (chữ ký sai, không tìm thấy đơn) không có trang xem riêng, admin xem trực tiếp trong cơ sở dữ liệu.
- Đổi mật khẩu không đăng xuất các nơi khác.
- Chuyển tiền khi rút tiền và khi hoàn tiền chỉ là mô phỏng.
- Trang Chính sách không lưu các bản cũ khi admin sửa (Phần 24).

## C18. Ký hiệu trên giao diện
- Mọi chữ người dùng thấy (trang, nút, liên kết, câu báo, chữ mờ trong ô, thư gửi qua Gmail) chỉ dùng chữ và dấu câu gõ được từ bàn phím, không dùng ký hiệu trang trí.
- Không dùng mũi tên ←, →, ‹, ›, ↑, ↓. Liên kết và nút ghi chữ thường, ví dụ "Quay lại đăng nhập", "Quay lại khóa học", "Quay lại", "Bài trước", "Học bài tiếp theo", "Xem tất cả khóa học", "Xem tất cả thông báo", "Trước", "Sau", "Trang trước", "Trang tiếp theo"; nút thu cột ở trang học ghi "Ẩn". Nút đổi thứ tự ghi "Lên", "Xuống"; nút về đầu trang ghi "Lên đầu trang".
- Không dùng dấu chấm giữa "·" để ngăn thông tin, thay bằng dấu phẩy, ví dụ "Trần Thị Bích, 16 bài, 120 học viên", "24 bài, 299.000đ", "Trắc nghiệm, 5 câu, 10 phút", "8,00/10, trắc nghiệm, 5 câu, 10 phút". Liên kết đứng sau một thông tin (ví dụ "Nhập lại Gmail" đứng sau Gmail đã nhập) thì cách ra bằng khoảng trống, không có dấu ngăn.
- Không dùng ký tự ba chấm liền "…". Chữ mờ trong ô không có dấu ba chấm, ví dụ "Tìm khóa học". Chữ quá dài bị cắt thì để CSS tự thêm dấu ba chấm.
- Ngoặc kép dùng ngoặc thẳng ", không dùng ngoặc cong “ ” ‘ ’.
- Không dùng biểu tượng cảm xúc (emoji), không dùng gạch dài.
- Được giữ: nút ✕ để đóng hộp và ô thông báo nhỏ; sao ★ ở đánh giá và hàng sao khi chấm; dấu © ở dòng cuối chân trang; nút − và + phóng to, thu nhỏ khi xem tài liệu.
- Thiết kế trong thiet_ke/ còn các ký hiệu bị cấm ở trên thì không sửa file thiết kế; khi code thì làm theo quy tắc này.

# PHỤ LỤC A. BẢNG ĐỐI CHIẾU MÀN THIẾT KẾ VỚI TÊN FILE

Thư mục thiet_ke/ đặt trong thư mục Do_An. Mỗi file HTML là bản mở xem được của một màn trên Claude Design, được đổi tên không dấu và xếp vào thư mục của chức năng: chỉ gỡ lớp vỏ riêng của Claude Design để bấm đúp là mở được trong trình duyệt, và sửa các liên kết giữa các màn sang tên file mới; chữ, mã HTML và CSS của màn giữ nguyên. Bản xem được giống một tấm ảnh chụp: menu xổ, nút bấm không chạy. Bảng xếp theo thứ tự các màn xuất hiện trong các phần.

| Tên màn trên Claude Design | File gốc | Đường dẫn trong Do_An |
| --- | --- | --- |
| Thanh đầu trang - đã đăng nhập | HeaderLoggedIn.dc.html | thiet_ke/chung/dau_trang_da_dang_nhap.html |
| Thanh đầu trang - đã đăng nhập (admin xem trang công khai) | HeaderLoggedInAdmin.dc.html | thiet_ke/chung/dau_trang_admin_xem_cong_khai.html |
| Trang chủ | HomeStudentDark.dc.html | thiet_ke/trang_chu/trang_chu.html |
| Chính sách và điều khoản | Policies.dc.html | thiet_ke/chinh_sach_loi/chinh_sach_dieu_khoan.html |
| Lỗi 403 - Không có quyền truy cập | Error403.dc.html | thiet_ke/chinh_sach_loi/loi_403.html |
| Lỗi 404 - Không tìm thấy trang | Error404.dc.html | thiet_ke/chinh_sach_loi/loi_404.html |
| Đăng ký | Register.dc.html | thiet_ke/dang_ky/dang_ky.html |
| Đăng ký (để trống ô bắt buộc) | RegisterEmpty.dc.html | thiet_ke/dang_ky/dang_ky_de_trong.html |
| Đăng ký (sai định dạng) | RegisterFormat.dc.html | thiet_ke/dang_ky/dang_ky_sai_dinh_dang.html |
| Đăng ký (tên và Gmail đã tồn tại) | RegisterTaken.dc.html | thiet_ke/dang_ky/dang_ky_da_ton_tai.html |
| Đăng nhập | Login.dc.html | thiet_ke/dang_nhap/dang_nhap.html |
| Đăng nhập (để trống ô bắt buộc) | LoginEmpty.dc.html | thiet_ke/dang_nhap/dang_nhap_de_trong.html |
| Đăng nhập (mật khẩu sai định dạng) | LoginPwFormat.dc.html | thiet_ke/dang_nhap/dang_nhap_mat_khau_sai_dinh_dang.html |
| Đăng nhập (sai tên hoặc mật khẩu) | LoginWrong.dc.html | thiet_ke/dang_nhap/dang_nhap_sai_ten_hoac_mat_khau.html |
| Đăng nhập (sai 5 lần) | LoginTooMany.dc.html | thiet_ke/dang_nhap/dang_nhap_sai_5_lan.html |
| Đăng nhập (tài khoản bị khóa) | LoginLocked.dc.html | thiet_ke/dang_nhap/dang_nhap_tai_khoan_bi_khoa.html |
| Đăng nhập (từ nút Mua) | LoginFromPay.dc.html | thiet_ke/dang_nhap/tu_nut_mua.html |
| Đăng nhập (từ nút Mua) (để trống ô bắt buộc) | LoginFromPayEmpty.dc.html | thiet_ke/dang_nhap/tu_nut_mua_de_trong.html |
| Đăng nhập (từ nút Mua) (mật khẩu sai định dạng) | LoginFromPayPwFormat.dc.html | thiet_ke/dang_nhap/tu_nut_mua_mat_khau_sai_dinh_dang.html |
| Đăng nhập (từ nút Mua) (sai tên hoặc mật khẩu) | LoginFromPayWrong.dc.html | thiet_ke/dang_nhap/tu_nut_mua_sai_ten_hoac_mat_khau.html |
| Đăng nhập (từ nút Mua) (sai 5 lần) | LoginFromPayTooMany.dc.html | thiet_ke/dang_nhap/tu_nut_mua_sai_5_lan.html |
| Đăng nhập (từ nút Mua) (tài khoản bị khóa) | LoginFromPayLocked.dc.html | thiet_ke/dang_nhap/tu_nut_mua_tai_khoan_bi_khoa.html |
| Xác nhận đăng nhập (địa chỉ mạng mới) | LoginNewNetwork.dc.html | thiet_ke/dang_nhap/xac_nhan_dang_nhap.html |
| Quên mật khẩu | ForgotPassword.dc.html | thiet_ke/quen_mat_khau/quen_mat_khau.html |
| Đặt lại mật khẩu | ResetPassword.dc.html | thiet_ke/quen_mat_khau/dat_lai_mat_khau.html |
| Hồ sơ - Học viên | ProfileStudent.dc.html | thiet_ke/ho_so/ho_so_hoc_vien.html |
| Hồ sơ - Học viên (báo lỗi: ảnh, số điện thoại, để trống mật khẩu) | ProfileStudentError.dc.html | thiet_ke/ho_so/ho_so_hoc_vien_bao_loi.html |
| Hồ sơ - Học viên (lỗi mật khẩu: sai định dạng, không khớp) | ProfileStudentPassError.dc.html | thiet_ke/ho_so/ho_so_hoc_vien_loi_mat_khau.html |
| Hồ sơ - Học viên (đã lưu thông tin, mật khẩu mới trùng cũ) | ProfileStudentSaved.dc.html | thiet_ke/ho_so/ho_so_hoc_vien_da_luu.html |
| Hồ sơ người cung cấp | ProfileProvider.dc.html | thiet_ke/ho_so/ho_so_nguoi_cung_cap.html |
| Hồ sơ - Admin | ProfileAdmin.dc.html | thiet_ke/ho_so/ho_so_admin.html |
| Quản trị - Danh mục | AdminCategories.dc.html | thiet_ke/quan_tri_danh_muc/danh_muc.html |
| Quản trị - Danh mục (gộp) | AdminCategoriesMerge.dc.html | thiet_ke/quan_tri_danh_muc/danh_muc_gop.html |
| Tạo khóa - Bước 1 | CreateCourse.dc.html | thiet_ke/tao_khoa_hoc/buoc_1.html |
| Tạo khóa - Bước 1 (báo lỗi) | CreateCourseError.dc.html | thiet_ke/tao_khoa_hoc/buoc_1_bao_loi.html |
| Tạo khóa - Bước 2 (chưa đủ 3 bài) | ManageLessonsEmpty.dc.html | thiet_ke/tao_khoa_hoc/buoc_2_chua_du_3_bai.html |
| Tạo khóa - Bước 2 (hộp Đăng) | ManageLessonsPending.dc.html | thiet_ke/tao_khoa_hoc/buoc_2_hop_dang.html |
| Thêm bài (video) | AddLesson.dc.html | thiet_ke/tao_khoa_hoc/them_bai_video.html |
| Thêm bài (tài liệu, sai loại file) | AddLessonDoc.dc.html | thiet_ke/tao_khoa_hoc/them_bai_tai_lieu_sai_loai_file.html |
| Thêm bài (video, quá 300MB) | AddLessonError.dc.html | thiet_ke/tao_khoa_hoc/them_bai_video_qua_300mb.html |
| Thêm bài (video không phát được) | AddLessonNoPlay.dc.html | thiet_ke/tao_khoa_hoc/them_bai_video_khong_phat_duoc.html |
| Thêm bài (file đã có trên AVA) | AddLessonDup.dc.html | thiet_ke/tao_khoa_hoc/them_bai_file_da_co.html |
| Thêm bài (trắc nghiệm) | AddLessonQuiz.dc.html | thiet_ke/tao_khoa_hoc/them_bai_trac_nghiem.html |
| Thêm bài (trắc nghiệm, báo lỗi) | AddLessonQuizError.dc.html | thiet_ke/tao_khoa_hoc/them_bai_trac_nghiem_bao_loi.html |
| Quản lý khóa - Bước 1 (đang bán) | EditCourse.dc.html | thiet_ke/quan_ly_khoa_hoc/buoc_1_dang_ban.html |
| Quản lý khóa - Bước 1 (admin ẩn) | EditCourseHidden.dc.html | thiet_ke/quan_ly_khoa_hoc/buoc_1_admin_an.html |
| Quản lý khóa - Bước 1 (tự ẩn) | EditCourseHiddenByProvider.dc.html | thiet_ke/quan_ly_khoa_hoc/buoc_1_tu_an.html |
| Quản lý khóa - Bước 1 (hộp Xóa khóa) | EditCoursePending.dc.html | thiet_ke/quan_ly_khoa_hoc/buoc_1_hop_xoa_khoa.html |
| Quản lý khóa - Bước 1 (bị gỡ, chỉ xem) | EditCourseRejected.dc.html | thiet_ke/quan_ly_khoa_hoc/buoc_1_bi_go_chi_xem.html |
| Quản lý khóa - Bước 2 (đang bán) | ManageLessons.dc.html | thiet_ke/quan_ly_khoa_hoc/buoc_2_dang_ban.html |
| Quản lý khóa - Bước 2 (còn 3 bài) | ManageLessonsLast.dc.html | thiet_ke/quan_ly_khoa_hoc/buoc_2_con_3_bai.html |
| Quản lý khóa - Bước 2 (lỗi bài số 1) | ManageLessonsFirstErr.dc.html | thiet_ke/quan_ly_khoa_hoc/buoc_2_loi_bai_so_1.html |
| Quản lý khóa - Bước 2 (bị gỡ, chỉ xem) | ManageLessonsRemoved.dc.html | thiet_ke/quan_ly_khoa_hoc/buoc_2_bi_go_chi_xem.html |
| Sửa bài (đổi bài học thử) | EditLesson.dc.html | thiet_ke/quan_ly_khoa_hoc/sua_bai_doi_bai_hoc_thu.html |
| Danh sách khóa học (chưa đăng nhập) | CourseList.dc.html | thiet_ke/danh_sach_khoa_hoc/chua_dang_nhap.html |
| Danh sách khóa học (đã đăng nhập) | CourseListLoggedIn.dc.html | thiet_ke/danh_sach_khoa_hoc/da_dang_nhap.html |
| Danh sách khóa học (đang lọc) | CourseListLoggedInFiltered.dc.html | thiet_ke/danh_sach_khoa_hoc/dang_loc.html |
| Danh sách khóa học (không có kết quả) | CourseListLoggedInEmpty.dc.html | thiet_ke/danh_sach_khoa_hoc/khong_co_ket_qua.html |
| Chi tiết khóa học (chưa đăng nhập) | Course.dc.html | thiet_ke/chi_tiet_khoa_hoc/chua_dang_nhap.html |
| Chi tiết khóa học (đã đăng nhập) | CourseLoggedIn.dc.html | thiet_ke/chi_tiet_khoa_hoc/da_dang_nhap_chua_mua.html |
| Chi tiết khóa học (đã có trong giỏ) | CourseInCart.dc.html | thiet_ke/chi_tiet_khoa_hoc/da_co_trong_gio.html |
| Chi tiết khóa học (đã mua) | CourseOwned.dc.html | thiet_ke/chi_tiet_khoa_hoc/da_mua.html |
| Chi tiết khóa học - Đã mua (chưa học xong bài nào) | CourseOwnedNone.dc.html | thiet_ke/chi_tiet_khoa_hoc/da_mua_chua_hoc_xong_bai_nao.html |
| Chi tiết khóa - Người cung cấp khác xem | CourseProviderView.dc.html | thiet_ke/chi_tiet_khoa_hoc/nguoi_cung_cap_khac_xem.html |
| Chi tiết khóa - Chủ khóa / Quản trị viên xem | CourseAdminOwnerView.dc.html | thiet_ke/chi_tiet_khoa_hoc/chu_khoa_hoac_admin_xem.html |
| Chi tiết khóa - Chủ khóa xem bài trắc nghiệm | CourseOwnerQuizView.dc.html | thiet_ke/chi_tiet_khoa_hoc/chu_khoa_xem_bai_trac_nghiem.html |
| Giỏ hàng (đã đăng nhập) | Cart.dc.html | thiet_ke/gio_hang/gio_hang_da_dang_nhap.html |
| Giỏ hàng (chưa đăng nhập) | CartGuest.dc.html | thiet_ke/gio_hang/gio_hang_chua_dang_nhap.html |
| Giỏ hàng (trống) | CartEmpty.dc.html | thiet_ke/gio_hang/gio_hang_trong.html |
| Giỏ hàng (chưa chọn khóa nào) | CartNoneSelected.dc.html | thiet_ke/gio_hang/gio_hang_chua_chon_khoa.html |
| Giỏ hàng (có khóa không còn bán) | CartUnavailable.dc.html | thiet_ke/gio_hang/gio_hang_co_khoa_khong_con_ban.html |
| Thông tin đơn hàng | OrderInfo.dc.html | thiet_ke/dat_hang_thanh_toan/thong_tin_don_hang.html |
| Thông tin đơn hàng (hồ sơ thiếu thông tin) | OrderInfoError.dc.html | thiet_ke/dat_hang_thanh_toan/thong_tin_don_hang_thieu_ho_so.html |
| Trang thanh toán VNPay (minh họa) | VNPayQR.dc.html | thiet_ke/dat_hang_thanh_toan/trang_vnpay_minh_hoa_khong_lam.html |
| Kết quả thanh toán - Thành công | PaySuccess.dc.html | thiet_ke/dat_hang_thanh_toan/thanh_toan_thanh_cong.html |
| Kết quả thanh toán - Thất bại | PayFail.dc.html | thiet_ke/dat_hang_thanh_toan/thanh_toan_that_bai.html |
| Đơn hàng đã hết hạn | OrderExpired.dc.html | thiet_ke/dat_hang_thanh_toan/don_hang_het_han.html |
| Chi tiết đơn hàng (học viên) | OrderDetailStudent.dc.html | thiet_ke/dat_hang_thanh_toan/chi_tiet_don_hang.html |
| Chi tiết đơn hàng (học viên - chưa thanh toán) | OrderDetailStudentUnpaid.dc.html | thiet_ke/dat_hang_thanh_toan/chi_tiet_don_hang_chua_thanh_toan.html |
| Hồ sơ - Học viên (đang kiểm tra lại thanh toán) | ProfileStudentRecheck.dc.html | thiet_ke/dat_hang_thanh_toan/kiem_tra_lai_dang_kiem_tra.html |
| Hồ sơ - Học viên (VNPay chưa ghi nhận thanh toán) | ProfileStudentRecheckNone.dc.html | thiet_ke/dat_hang_thanh_toan/kiem_tra_lai_chua_ghi_nhan.html |
| Hồ sơ - Học viên (lỗi kết nối VNPay) | ProfileStudentRecheckError.dc.html | thiet_ke/dat_hang_thanh_toan/kiem_tra_lai_loi_ket_noi.html |
| Trang học - Bài video (kiểu rạp) | LearnVideoCinema.dc.html | thiet_ke/trang_hoc/bai_video.html |
| Trang học - Bài video (đã ẩn danh sách) | LearnVideoHidden.dc.html | thiet_ke/trang_hoc/bai_video_an_danh_sach.html |
| Trang học - Tài liệu (kết hợp 4 hướng) | LearnDocAll.dc.html | thiet_ke/trang_hoc/bai_tai_lieu.html |
| Trang học - Bài học thử (chưa mua) | LearnVideoTrial.dc.html | thiet_ke/trang_hoc/bai_hoc_thu_chua_mua.html |
| Trang học - Khóa học không khả dụng | LearnBlocked.dc.html | thiet_ke/trang_hoc/khoa_hoc_khong_kha_dung.html |
| Trang học - Bài trắc nghiệm (giới thiệu, chưa làm) | QuizIntro.dc.html | thiet_ke/trac_nghiem/gioi_thieu_chua_lam.html |
| Trang học - Bài trắc nghiệm (giới thiệu, đã làm) | QuizIntroDone.dc.html | thiet_ke/trac_nghiem/gioi_thieu_da_lam.html |
| Trang học - Bài trắc nghiệm (đang làm) | QuizDoing.dc.html | thiet_ke/trac_nghiem/dang_lam.html |
| Trang học - Bài trắc nghiệm (hỏi lại khi nộp) | QuizSubmitConfirm.dc.html | thiet_ke/trac_nghiem/hoi_lai_khi_nop.html |
| Trang học - Bài trắc nghiệm (hoàn thành) | QuizResult.dc.html | thiet_ke/trac_nghiem/hoan_thanh.html |
| Trang học - Bài trắc nghiệm (xem đáp án) | QuizReview.dc.html | thiet_ke/trac_nghiem/xem_dap_an.html |
| Chi tiết khóa học - Đã mua (đã đánh giá) | CourseOwnedRated.dc.html | thiet_ke/danh_gia_bao_cao/da_mua_da_danh_gia.html |
| Chi tiết khóa học (báo cáo thành công) | CourseReportOk.dc.html | thiet_ke/danh_gia_bao_cao/bao_cao_thanh_cong.html |
| Chi tiết khóa học (báo cáo lỗi) | CourseReportError.dc.html | thiet_ke/danh_gia_bao_cao/bao_cao_loi.html |
| Chi tiết khóa học (báo cáo đánh giá) | CourseReportReview.dc.html | thiet_ke/danh_gia_bao_cao/bao_cao_danh_gia.html |
| Hồ sơ người cung cấp - Thiếu thông tin nhận tiền | ProfileProviderWdNoBank.dc.html | thiet_ke/vi_rut_tien/thieu_thong_tin_nhan_tien.html |
| Hồ sơ người cung cấp - Rút quá số dư | ProfileProviderWdOver.dc.html | thiet_ke/vi_rut_tien/rut_qua_so_du.html |
| Hồ sơ người cung cấp - Đang có yêu cầu chờ | ProfileProviderWdPending.dc.html | thiet_ke/vi_rut_tien/dang_co_yeu_cau_cho.html |
| Hồ sơ người cung cấp - Đã gửi yêu cầu rút | ProfileProviderWdSent.dc.html | thiet_ke/vi_rut_tien/da_gui_yeu_cau.html |
| Hồ sơ người cung cấp - Có thông báo mới | ProfileProviderBell.dc.html | thiet_ke/thong_bao/co_thong_bao_moi.html |
| Hồ sơ người cung cấp - Mở bảng thông báo | ProfileProviderBellOpen.dc.html | thiet_ke/thong_bao/mo_bang_thong_bao.html |
| Hồ sơ người cung cấp - Chưa có thông báo | ProfileProviderBellEmpty.dc.html | thiet_ke/thong_bao/chua_co_thong_bao.html |
| Thông báo - Tất cả thông báo | NotificationsAll.dc.html | thiet_ke/thong_bao/tat_ca_thong_bao.html |
| Quản trị - Khóa học (danh sách) | AdminCourses.dc.html | thiet_ke/quan_tri_khoa_hoc/danh_sach_khoa_hoc.html |
| Quản trị - Khóa đang bán | AdminCourseReviewApproved.dc.html | thiet_ke/quan_tri_khoa_hoc/khoa_dang_ban.html |
| Quản trị - Khóa đang bán (hộp Gỡ vĩnh viễn) | AdminCourseReview.dc.html | thiet_ke/quan_tri_khoa_hoc/khoa_dang_ban_hop_go_vinh_vien.html |
| Quản trị - Xem bài học | AdminCourseReviewVideoPreview.dc.html | thiet_ke/quan_tri_khoa_hoc/xem_bai_hoc.html |
| Quản trị - Xem bài trắc nghiệm | AdminCourseQuizView.dc.html | thiet_ke/quan_tri_khoa_hoc/xem_bai_trac_nghiem.html |
| Quản trị - Lịch sử thay đổi | AdminCourseReviewApprovedChanges.dc.html | thiet_ke/quan_tri_khoa_hoc/lich_su_thay_doi.html |
| Quản trị - Khóa tự ẩn | AdminCourseHiddenByProvider.dc.html | thiet_ke/quan_tri_khoa_hoc/khoa_tu_an.html |
| Quản trị - Khóa admin ẩn | AdminCourseReviewHidden.dc.html | thiet_ke/quan_tri_khoa_hoc/khoa_admin_an.html |
| Quản trị - Khóa ẩn do khóa tài khoản | AdminCourseReviewHiddenBlocked.dc.html | thiet_ke/quan_tri_khoa_hoc/khoa_an_do_khoa_tai_khoan.html |
| Quản trị - Khóa bị gỡ vĩnh viễn | AdminCourseRejected.dc.html | thiet_ke/quan_tri_khoa_hoc/khoa_bi_go_vinh_vien.html |
| Quản trị - Báo cáo khóa học | AdminReports.dc.html | thiet_ke/quan_tri_bao_cao/bao_cao_khoa_hoc.html |
| Quản trị - Báo cáo đánh giá | AdminReportsReviews.dc.html | thiet_ke/quan_tri_bao_cao/bao_cao_danh_gia.html |
| Quản trị - Báo cáo đánh giá (hộp chi tiết) | AdminReportsReviewDetail.dc.html | thiet_ke/quan_tri_bao_cao/bao_cao_danh_gia_hop_chi_tiet.html |
| Quản trị - Người dùng | AdminUsers.dc.html | thiet_ke/quan_tri_nguoi_dung/nguoi_dung.html |
| Quản trị - Người dùng (mở khóa tài khoản) | AdminUsersUnlock.dc.html | thiet_ke/quan_tri_nguoi_dung/nguoi_dung_mo_khoa.html |
| Quản trị - Đơn hàng | AdminOrders.dc.html | thiet_ke/quan_tri_don_hang/don_hang.html |
| Quản trị - Đơn hàng (đơn mới) | AdminOrdersDetail.dc.html | thiet_ke/quan_tri_don_hang/don_hang_chi_tiet_don_moi.html |
| Quản trị - Đơn hàng (đơn quá 7 ngày) | AdminOrdersExpired.dc.html | thiet_ke/quan_tri_don_hang/don_hang_chi_tiet_qua_7_ngay.html |
| Quản trị - Yêu cầu rút tiền | AdminWithdrawals.dc.html | thiet_ke/quan_tri_rut_tien/yeu_cau_rut_tien.html |
| Quản trị - Chính sách | AdminPolicies.dc.html | thiet_ke/quan_tri_chinh_sach/chinh_sach.html |
| Quản trị - Chính sách (sửa điều) | AdminPoliciesEdit.dc.html | thiet_ke/quan_tri_chinh_sach/chinh_sach_sua_dieu.html |
| Quản trị - Chính sách (thêm điều, báo lỗi) | AdminPoliciesAddError.dc.html | thiet_ke/quan_tri_chinh_sach/chinh_sach_them_dieu_bao_loi.html |
| Quản trị - Chính sách (hộp Xóa) | AdminPoliciesDelete.dc.html | thiet_ke/quan_tri_chinh_sach/chinh_sach_hop_xoa.html |

Tổng cộng 128 màn.
