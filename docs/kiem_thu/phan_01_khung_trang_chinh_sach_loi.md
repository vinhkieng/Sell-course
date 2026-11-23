# Danh sách kiểm thử Phần 1. Khung trang dùng chung, trang Chính sách, trang lỗi 403 và 404

- Đặc tả: docs/dac_ta/phan_01_khung_trang_chinh_sach_loi.md
- Code kiểm thử tự động: backend/tests/phan_01_khung_trang_chinh_sach_loi.test.js; hàm định dạng ở frontend kiểm bằng vitest, file .test.js đặt cạnh file hàm.
- Cách kiểm: "Tự động" là Claude Code viết code kiểm thử và chạy bằng npm test; "Bấm tay" là người dùng mở web và làm theo các bước.
- Dữ liệu chung: database ava_test do npm test tạo lại; chinh_sach.json của kiểm thử là file tạm (DUONG_DAN_CHINH_SACH), chép từ backend/du_lieu_mac_dinh/chinh_sach.json.

## P01-01 Khách gọi GET /api/tai-khoan/toi
- Mục tiêu: chưa đăng nhập thì máy chủ báo là khách.
- Dữ liệu: không có cookie ava_phien.
- Các bước: gọi GET /api/tai-khoan/toi.
- Kết quả mong đợi: 200, nội dung đúng { "dang_nhap": false }.
- Cách kiểm: Tự động
- Nguồn: Phần 1 mục 1.4

## P01-02 Học viên gọi GET /api/tai-khoan/toi
- Mục tiêu: trả đúng thông tin người xem và số khóa trong giỏ.
- Dữ liệu: một học viên có 2 dòng gio_hang, đã có phiên hợp lệ.
- Các bước: gọi GET /api/tai-khoan/toi kèm cookie phiên.
- Kết quả mong đợi: 200, có id, tên đăng nhập, họ tên, vai trò 2, đường dẫn ảnh đại diện, số khóa trong giỏ là 2.
- Cách kiểm: Tự động
- Nguồn: Phần 1 mục 1.4

## P01-03 Người cung cấp gọi GET /api/tai-khoan/toi
- Mục tiêu: người cung cấp có thêm số thông báo chưa đọc.
- Dữ liệu: một người cung cấp có 3 dòng thong_bao, trong đó 2 dòng da_doc = 0.
- Các bước: gọi GET /api/tai-khoan/toi kèm cookie phiên.
- Kết quả mong đợi: 200, vai trò 3, số thông báo chưa đọc là 2.
- Cách kiểm: Tự động
- Nguồn: Phần 1 mục 1.4

## P01-04 Tài khoản bị khóa bị đẩy ra ở đường công khai
- Mục tiêu: phiên của tài khoản bị khóa không dùng được, kể cả ở đường công khai.
- Dữ liệu: học viên đang có phiên, sau đó cập nhật nguoi_dung.khoa = 1 kèm ly_do_khoa và id_quan_tri_vien.
- Các bước: gọi GET /api/tai-khoan/toi và GET /api/chinh-sach kèm cookie phiên.
- Kết quả mong đợi: cả hai trả 401, ma = "TAI_KHOAN_BI_KHOA", có lý do khóa; phản hồi xóa cookie ava_phien.
- Cách kiểm: Tự động
- Nguồn: Phần chung C4; Phần 1 mục 1.4

## P01-05 Học viên đăng nhập nơi khác bị đẩy ra
- Mục tiêu: phiên có địa chỉ IP khác hoc_vien.dia_chi_ip thì hết hiệu lực.
- Dữ liệu: học viên có phiên ghi IP 127.0.0.1, sau đó đổi hoc_vien.dia_chi_ip thành 10.0.0.9.
- Các bước: gọi GET /api/tai-khoan/toi kèm cookie phiên.
- Kết quả mong đợi: 401, ma = "DANG_NHAP_NOI_KHAC"; cookie ava_phien bị xóa.
- Cách kiểm: Tự động
- Nguồn: Phần chung C4

## P01-06 Trang chuyển về đăng nhập khi gặp hai mã lỗi trên
- Mục tiêu: frontend chuyển về trang đăng nhập với đúng câu báo, kể cả khi đang ở trang công khai.
- Dữ liệu: học viên đang mở trang Chính sách; admin khóa tài khoản này (hoặc học viên xác nhận đăng nhập ở một máy khác).
- Các bước: bấm sang một trang khác hoặc tải lại trang.
- Kết quả mong đợi: về trang đăng nhập, hiện "Tài khoản đã bị khóa. Lý do: [lý do]. Liên hệ hỗ trợ nếu bạn cho rằng có nhầm lẫn." hoặc "Tài khoản của bạn vừa đăng nhập ở một địa chỉ mạng khác."
- Cách kiểm: Bấm tay
- Nguồn: Phần 1 mục 1.3; Phần chung C4

## P01-07 Menu danh mục chỉ gồm danh mục có khóa đang bán
- Mục tiêu: GET /api/danh-muc/menu chỉ trả danh mục có ít nhất một khóa "Đang bán" chưa xóa, sắp theo tên.
- Dữ liệu: danh mục "Thiết Kế" có 1 khóa 'Đang bán'; "Lập Trình" có 2 khóa 'Đang bán'; "Marketing" chỉ có 1 khóa 'Bị ẩn'; "Ngoại Ngữ" chỉ có 1 khóa 'Đang bán' đã xóa (da_xoa = 1).
- Các bước: gọi GET /api/danh-muc/menu.
- Kết quả mong đợi: đúng hai danh mục theo thứ tự tên "Lập Trình", "Thiết Kế", mỗi dòng có id, tên, số khóa đang bán (2 và 1); không có "Marketing", "Ngoại Ngữ".
- Cách kiểm: Tự động
- Nguồn: Phần 1 mục 1.4; Phần chung C9

## P01-08 Tên cổng thanh toán mặc định
- Mục tiêu: lấy tên cổng từ cong_thanh_toan dòng id = 1.
- Dữ liệu: dòng có sẵn trong file SQL (id 1, 'VNPay').
- Các bước: gọi GET /api/cong-thanh-toan/mac-dinh.
- Kết quả mong đợi: 200, tên cổng là "VNPay".
- Cách kiểm: Tự động
- Nguồn: Phần 1 mục 1.4

## P01-09 Số cho menu khu quản trị
- Mục tiêu: admin lấy được ba con số; vai trò khác bị chặn.
- Dữ liệu: 1 yêu cầu rút tiền 'Chờ duyệt' và 1 yêu cầu 'Đã chuyển'; không có phiếu báo cáo chưa xử lý.
- Các bước: admin gọi GET /api/quan-tri/so-cho-xu-ly; học viên gọi cùng đường; khách gọi cùng đường.
- Kết quả mong đợi: admin nhận 200, số yêu cầu rút tiền là 1, hai số báo cáo là 0; học viên nhận 403; khách nhận 401. (Cách đếm hai số báo cáo kiểm thêm ở Phần 20.)
- Cách kiểm: Tự động
- Nguồn: Phần 1 mục 1.4; Phần chung C5, C9

## P01-10 Đọc chính sách ban đầu
- Mục tiêu: GET /api/chinh-sach trả 12 điều của file mặc định.
- Dữ liệu: file chinh_sach.json của kiểm thử chép từ file mặc định.
- Các bước: gọi GET /api/chinh-sach không cần đăng nhập.
- Kết quả mong đợi: 200, 12 điều theo thứ tự, điều 1 có số thứ tự 1 và tên "Giới thiệu và phạm vi áp dụng", điều 12 tên "Cập nhật điều khoản"; ngày cập nhật lần cuối là null.
- Cách kiểm: Tự động
- Nguồn: Phần 1 mục 1.3, 1.4

## P01-11 Máy chủ chép file chính sách mặc định khi chưa có
- Mục tiêu: chưa có luu_tru/noi_dung/chinh_sach.json thì khởi động sẽ chép file mặc định sang; đã có thì giữ nguyên.
- Dữ liệu: đường dẫn kiểm thử chưa có file; sau đó một file đã sửa nội dung.
- Các bước: gọi hàm chép file mặc định lúc khởi động (lib/khoiDong.js) hai lần, lần hai sau khi sửa file.
- Kết quả mong đợi: lần một file được tạo, giống hệt file mặc định; lần hai file đã sửa giữ nguyên.
- Cách kiểm: Tự động
- Nguồn: Phần 1 mục 1.3

## P01-12 Trang Chính sách hiển thị
- Mục tiêu: trang hiện đúng thiết kế và đúng nội dung.
- Dữ liệu: nội dung ban đầu.
- Các bước: mở /chinh-sach.
- Kết quả mong đợi: tiêu đề "Chính sách và điều khoản", dòng giới thiệu "Điều khoản sử dụng, thanh toán, hoàn tiền, quy định dành cho người cung cấp và xử lý vi phạm trên AVA."; đủ 12 điều, tiêu đề dạng "Điều N. <tên điều>"; không có mục lục; chưa có dòng "Cập nhật lần cuối"; chữ các điều giống màn thiet_ke/chinh_sach_loi/chinh_sach_dieu_khoan.html.
- Cách kiểm: Bấm tay
- Nguồn: Phần 1 mục 1.3, 1.6

## P01-13 Neo #dieu-1 và liên kết "Về AVA"
- Mục tiêu: mở neo thì cuộn đúng điều.
- Dữ liệu: nội dung ban đầu.
- Các bước: ở trang chủ bấm "Về AVA" ở chân trang; gõ thẳng /chinh-sach#dieu-1; bấm "Chính sách và điều khoản" ở chân trang.
- Kết quả mong đợi: hai cách đầu mở trang Chính sách và cuộn tới Điều 1; cách thứ ba mở trang Chính sách từ đầu trang.
- Cách kiểm: Bấm tay
- Nguồn: Phần 1 mục 1.3, 1.6; Phần chung C9

## P01-14 Đầu trang theo bốn kiểu người xem
- Mục tiêu: mỗi người xem thấy đúng kiểu đầu trang.
- Dữ liệu: một khách, một học viên, một người cung cấp, một admin.
- Các bước: mở trang chủ lần lượt bằng từng người, bấm ảnh đại diện.
- Kết quả mong đợi: khách có "Danh mục", "Khóa học nổi bật", "Chính sách", ô tìm kiếm, giỏ hàng, "Đăng nhập", "Đăng ký"; học viên thay "Đăng nhập", "Đăng ký" bằng ảnh đại diện, menu có "Hồ sơ cá nhân", "Khóa học của tôi", "Lịch sử đơn hàng", "Đăng xuất"; người cung cấp có thêm "Tạo khóa học", chuông có số chưa đọc, không có giỏ, menu có "Hồ sơ cá nhân", "Quản lý khóa học", "Rút tiền", "Đăng xuất"; admin không có giỏ, không có chuông, menu có "Trang quản trị", "Hồ sơ", "Đăng xuất".
- Cách kiểm: Bấm tay
- Nguồn: Phần 1 mục 1.6; Phần chung C9

## P01-15 Ảnh đại diện khi chưa có ảnh
- Mục tiêu: hiện chữ cái đầu in hoa.
- Dữ liệu: học viên có họ tên "nguyễn văn an", chưa có ảnh; một học viên khác họ tên trống, tên đăng nhập "binh01".
- Các bước: đăng nhập từng người, nhìn đầu trang.
- Kết quả mong đợi: người thứ nhất hiện "N"; người thứ hai hiện "B".
- Cách kiểm: Bấm tay
- Nguồn: Phần chung C9

## P01-16 Menu "Danh mục" và ô tìm kiếm
- Mục tiêu: menu và ô tìm kiếm chạy đúng.
- Dữ liệu: như P01-07.
- Các bước: rê hoặc bấm "Danh mục"; bấm "Lập Trình"; bấm "Xem tất cả khóa học"; gõ "figma" vào ô tìm kiếm rồi Enter; xóa trắng ô (hoặc chỉ gõ dấu cách) rồi Enter.
- Kết quả mong đợi: menu chỉ có "Lập Trình", "Thiết Kế" theo thứ tự tên; mở /khoa-hoc?danh_muc=<id>; mở /khoa-hoc; mở /khoa-hoc?tu_khoa=figma; ô trống thì không làm gì, vẫn ở trang đó.
- Cách kiểm: Bấm tay
- Nguồn: Phần chung C9

## P01-17 Logo về trang chủ
- Mục tiêu: bấm logo AVA ở mọi trang về trang chủ.
- Dữ liệu: admin đang ở /quan-tri/khoa-hoc; khách đang ở /chinh-sach.
- Các bước: bấm logo AVA.
- Kết quả mong đợi: về /.
- Cách kiểm: Bấm tay
- Nguồn: Phần chung C9

## P01-18 Chân trang
- Mục tiêu: chân trang giống chân trang trang chủ ở mọi trang có chân trang.
- Dữ liệu: 6 danh mục có khóa đang bán với số khóa khác nhau.
- Các bước: mở trang chủ, trang Chính sách, trang 404; bấm "avahotro@gmail.com".
- Kết quả mong đợi: có logo, câu "Học từng bài, mỗi ngày tiến thêm một bước.", ba biểu tượng mạng xã hội; cột "Danh mục" tối đa 5 danh mục có nhiều khóa đang bán nhất; cột "Về chúng tôi" có "Về AVA", "Chính sách và điều khoản"; cột "Hỗ trợ" chỉ có "avahotro@gmail.com", bấm thì mở ứng dụng thư; khối "Liên hệ hỗ trợ" có "Gmail: avahotro@gmail.com", "Điện thoại: 028 7300 8899", "Giờ làm việc: 8:00 - 17:00, thứ Hai đến thứ Sáu"; dòng cuối "© <năm hiện tại> AVA. Bảo lưu mọi quyền." và "Thanh toán an toàn qua VNPay".
- Cách kiểm: Bấm tay
- Nguồn: Phần 1 mục 1.3, 1.6; Phần chung C9

## P01-19 Trang có và không có chân trang
- Mục tiêu: đúng danh sách ở Phần chung C9.
- Dữ liệu: các trang đã có ở thời điểm kiểm.
- Các bước: mở lần lượt các trang đã làm.
- Kết quả mong đợi: trang chủ, danh sách, chi tiết khóa học, giỏ hàng, thông tin đơn hàng, kết quả thanh toán, chi tiết đơn hàng, hồ sơ, tạo và quản lý khóa học, Chính sách, 403, 404 có chân trang; đăng nhập, xác nhận đăng nhập, đăng ký, quên mật khẩu, đặt lại mật khẩu, trang học, trang làm bài trắc nghiệm, khu quản trị và hồ sơ admin không có chân trang. (Kiểm lại mỗi khi làm xong phần có trang mới.)
- Cách kiểm: Bấm tay
- Nguồn: Phần chung C9

## P01-20 Trang 404
- Mục tiêu: đường dẫn không có hiện trang 404.
- Dữ liệu: không cần.
- Các bước: mở /khong-co-trang-nay.
- Kết quả mong đợi: số 404, "Không tìm thấy trang", "Trang bạn tìm không tồn tại hoặc bạn không có quyền xem.", nút "Về trang chủ"; có chân trang.
- Cách kiểm: Bấm tay
- Nguồn: Phần 1 mục 1.3, 1.6

## P01-21 Trang 403 hiện tại chỗ
- Mục tiêu: sai vai trò thì hiện 403 mà đường dẫn không đổi.
- Dữ liệu: một người cung cấp đã đăng nhập.
- Các bước: mở /gio-hang.
- Kết quả mong đợi: số 403, "Bạn không có quyền truy cập", "Tài khoản của bạn không được dùng chức năng này.", nút "Về trang chủ"; thanh địa chỉ vẫn là /gio-hang; không có đường /khong-co-quyen.
- Cách kiểm: Bấm tay
- Nguồn: Phần 1 mục 1.3, 1.6; Phần chung C5

## P01-22 Khung khu quản trị
- Mục tiêu: menu dọc đủ 8 mục, đúng thứ tự, số tròn đúng.
- Dữ liệu: như P01-09.
- Các bước: admin mở /quan-tri/khoa-hoc rồi bấm từng mục.
- Kết quả mong đợi: thứ tự Khóa học, Báo cáo khóa học, Báo cáo đánh giá, Người dùng, Danh mục, Đơn hàng, Yêu cầu rút tiền, Chính sách; mục đang mở tô màu như thiết kế; "Yêu cầu rút tiền" có số 1; hai mục báo cáo không có số (bằng 0); "Chính sách" không có số tròn và mở /quan-tri/chinh-sach; không có chân trang.
- Cách kiểm: Bấm tay
- Nguồn: Phần 1 mục 1.3, 1.6; Phần chung C9

## P01-23 Ô thông báo nhỏ
- Mục tiêu: ô thông báo dùng chung hiện ở góc dưới phải, tự tắt, hiện được cả sau khi chuyển trang.
- Dữ liệu: một chức năng có thông báo sau khi chuyển trang (ví dụ "Đã thêm vào giỏ hàng" ở Phần 11, 12).
- Các bước: làm thao tác có thông báo; làm thao tác có thông báo rồi chuyển sang trang khác.
- Kết quả mong đợi: ô nhỏ hiện ở góc dưới bên phải, tự tắt sau khoảng 5 giây; thông báo vẫn hiện ở trang mới.
- Cách kiểm: Bấm tay
- Nguồn: Phần 1 mục 1.3; Phần chung C9

## P01-24 Hàm định dạng tiền
- Mục tiêu: tiền có dấu chấm ngăn nghìn và chữ đ liền sau.
- Dữ liệu: 349000; 1250000; 0.
- Các bước: gọi hàm định dạng tiền.
- Kết quả mong đợi: "349.000đ"; "1.250.000đ"; "0đ".
- Cách kiểm: Tự động (vitest)
- Nguồn: Phần chung C10

## P01-25 Hàm định dạng ngày và ngày giờ
- Mục tiêu: ngày theo giờ Việt Nam, dạng dd/mm/yyyy và dd/mm/yyyy HH:mm.
- Dữ liệu: "2026-11-20T17:30:00Z" (tức 00:30 ngày 21/11/2026 giờ Việt Nam).
- Các bước: gọi hàm định dạng ngày và hàm định dạng ngày giờ.
- Kết quả mong đợi: "21/11/2026"; "21/11/2026 00:30".
- Cách kiểm: Tự động (vitest)
- Nguồn: Phần chung C10

## P01-26 Hàm mã đơn
- Mục tiêu: mã đơn dạng AVA-yymmdd-nnnn.
- Dữ liệu: đơn id 7 tạo ngày 21/11/2026; đơn id 12345 tạo ngày 05/01/2027.
- Các bước: gọi hàm dựng mã đơn.
- Kết quả mong đợi: "AVA-261121-0007"; "AVA-270105-12345".
- Cách kiểm: Tự động (vitest)
- Nguồn: Phần chung C10

## P01-27 Hàm chữ trạng thái
- Mục tiêu: đổi giá trị lưu sang chữ hiển thị đúng bảng C11.
- Dữ liệu: ('Bị ẩn', 'Tự ẩn'); ('Bị ẩn', 'Admin ẩn'); ('Bị ẩn', 'Hệ thống - khóa tài khoản'); 'Bị gỡ vĩnh viễn'; biện pháp báo cáo khóa học NULL, 'Ẩn khóa', 'Gỡ vĩnh viễn'; biện pháp báo cáo đánh giá 'Ẩn đánh giá'; nguồn đến 'Máy chủ cổng thanh toán' với tên cổng "VNPay".
- Các bước: gọi các hàm đổi chữ.
- Kết quả mong đợi: "Bị ẩn (tự ẩn)"; "Bị ẩn (admin ẩn)"; "Bị ẩn (hệ thống - khóa tài khoản)"; "Bị gỡ vĩnh viễn"; "Chưa xử lý", "Đã ẩn khóa", "Đã gỡ vĩnh viễn"; "Đã ẩn đánh giá"; "Máy chủ VNPay".
- Cách kiểm: Tự động (vitest)
- Nguồn: Phần chung C11

## P01-28 Hiển thị ở ba độ rộng
- Mục tiêu: không vỡ bố cục, không phải kéo ngang.
- Dữ liệu: không cần.
- Các bước: mở trang Chính sách, 403, 404, khu quản trị ở 1280px, 768px, 375px (công cụ dành cho nhà phát triển của Chrome, bấm biểu tượng điện thoại).
- Kết quả mong đợi: đọc được hết, menu thu gọn ở màn nhỏ, không có thanh cuộn ngang.
- Cách kiểm: Bấm tay
- Nguồn: Phần 1 mục 1.3; Phần chung C8

## P01-29 Không có ký hiệu bị cấm trong code
- Mục tiêu: chữ người dùng thấy không dùng ký hiệu bị cấm ở Phần chung C18, kể cả khi các phần sau thêm code mới.
- Dữ liệu: mọi file .js, .jsx, .css trong frontend/src và backend (trừ node_modules và thư mục tests).
- Các bước: quét từng dòng của các file đó tìm các ký tự: mũi tên ← → ‹ › ↑ ↓, dấu chấm giữa ·, ba chấm liền …, ngoặc cong “ ” ‘ ’, gạch dài.
- Kết quả mong đợi: không có dòng nào chứa các ký tự trên; nếu có thì báo lỗi kèm tên file và số dòng.
- Cách kiểm: Tự động
- Nguồn: Phần chung C18
