# PHẦN 1. KHUNG TRANG DÙNG CHUNG, TRANG CHÍNH SÁCH, TRANG LỖI 403 VÀ 404

Làm sau khi dựng xong dự án (Phần chung). Phần này tạo các khung dùng chung mà mọi phần sau đều gọi lại. Giao diện cũ trong khung dự án (Header, Footer, AdminLayout, TrangChu và CSS đi kèm) đã bị xóa; mọi khung giao diện dùng chung làm mới theo thiết kế. Phần nền có sẵn trong khung được giữ và dùng lại, không viết lại: api/client.js, AuthProvider, ErrorBoundary, utils/dinhDang.js, CuonTrang (đã sửa lỗi).

## 1.1 Mục đích và ai dùng
- Tạo một lần các thành phần dùng chung: đầu trang công khai (4 kiểu theo người xem), chân trang, ô thông báo nhỏ góc dưới phải, khung khu quản trị (đầu trang "Quản trị" và menu dọc 8 mục, ba mục có số tròn), hàm định dạng tiền, ngày, mã đơn, chữ trạng thái (Phần chung mục C9, C10, C11).
- Trang "Chính sách và điều khoản" (mọi người xem được) và hai trang lỗi 403, 404.

## 1.2 Màn thiết kế
- thiet_ke/chung/dau_trang_da_dang_nhap.html (màn "Thanh đầu trang - đã đăng nhập"): đầu trang khi học viên và người cung cấp đã đăng nhập, kèm menu mở khi bấm ảnh đại diện.
- thiet_ke/chung/dau_trang_admin_xem_cong_khai.html (màn "Thanh đầu trang - đã đăng nhập (admin xem trang công khai)"): đầu trang khi admin xem trang công khai.
- thiet_ke/trang_chu/trang_chu.html (màn "Trang chủ"): chân trang chuẩn dùng cho mọi trang có chân trang (phần chân trang ở cuối màn, không lấy khối "Bắt đầu bài học đầu tiên của bạn hôm nay." đứng ngay trên nó).
- thiet_ke/chinh_sach_loi/chinh_sach_dieu_khoan.html (màn "Chính sách và điều khoản"): trang Chính sách và điều khoản; đầu trang kiểu khách cũng lấy từ màn này. Ngày "Cập nhật lần cuối: 18/11/2026" trong màn chỉ là mẫu; trang thật làm theo 1.3.
- thiet_ke/chinh_sach_loi/loi_403.html (màn "Lỗi 403 - Không có quyền truy cập"): trang lỗi 403.
- thiet_ke/chinh_sach_loi/loi_404.html (màn "Lỗi 404 - Không tìm thấy trang"): trang lỗi 404.
- Đầu trang khu quản trị và menu dọc 8 mục: xem bất kỳ màn nào trong thiet_ke/quan_tri_khoa_hoc/.

## 1.3 Giao diện và hành vi
- Đầu trang, chân trang làm đúng Phần chung C9 (gồm danh sách trang có và không có chân trang). Thanh đầu trang biết người xem là ai bằng cách gọi GET /api/tai-khoan/toi lúc mở website.
- Khung khu quản trị: menu dọc 8 mục theo đúng thứ tự Khóa học, Báo cáo khóa học, Báo cáo đánh giá, Người dùng, Danh mục, Đơn hàng, Yêu cầu rút tiền, Chính sách. Mục đang mở được tô màu như thiết kế. Mục "Chính sách" mở /quan-tri/chinh-sach (trang này làm ở Phần 24).
- Trang Chính sách:
  - Tiêu đề "Chính sách và điều khoản" và dòng giới thiệu "Điều khoản sử dụng, thanh toán, hoàn tiền, quy định dành cho người cung cấp và xử lý vi phạm trên AVA." cố định theo thiết kế.
  - Dưới tiêu đề là dòng "Cập nhật lần cuối: dd/mm/yyyy". Khi admin chưa lưu thay đổi nào (Phần 24) thì không hiện dòng này.
  - Các điều đọc từ máy chủ (GET /api/chinh-sach), hiện theo thứ tự, tiêu đề mỗi điều là "Điều N. <tên điều>" với N là thứ tự của điều. Mỗi điều có neo #dieu-N. Mở /chinh-sach#dieu-1 thì cuộn tới Điều 1.
  - Không có mục lục.
  - Nội dung mỗi điều dựng thành phần tử React theo luật gõ ở Phần 24 mục 24.4 (không dùng dangerouslySetInnerHTML). Phần 24 dùng lại đúng hàm dựng này cho khung "Xem trước".
- Nội dung ban đầu của chính sách: đúng 12 điều trong màn thiet_ke/chinh_sach_loi/chinh_sach_dieu_khoan.html (màn "Chính sách và điều khoản"), chữ giữ nguyên văn, viết lại theo luật gõ của Phần 24. Nội dung nằm trong file backend/luu_tru/noi_dung/chinh_sach.json. Thư mục luu_tru không đưa lên GitHub, nên khung dự án có sẵn file mặc định backend/du_lieu_mac_dinh/chinh_sach.json (đưa lên GitHub); máy chủ khởi động mà chưa có luu_tru/noi_dung/chinh_sach.json thì chép file mặc định sang.
- File chinh_sach.json gồm: danh sách các điều theo thứ tự (mỗi điều có ten và noi_dung, không lưu số điều), thời điểm cập nhật lần cuối (null khi chưa sửa lần nào) và số phiên bản (tăng 1 mỗi lần lưu, dùng ở Phần 24).
- Dòng "Thanh toán an toàn qua VNPay" ở chân trang lấy tên cổng từ cong_thanh_toan.ten.
- Trang 403: số 403, "Bạn không có quyền truy cập", "Tài khoản của bạn không được dùng chức năng này.", nút "Về trang chủ". Hiện ngay tại đường dẫn đang mở, không chuyển sang đường dẫn khác.
- Trang 404: số 404, "Không tìm thấy trang", "Trang bạn tìm không tồn tại hoặc bạn không có quyền xem.", nút "Về trang chủ". Mọi đường dẫn không khớp trang nào cũng hiện trang này.
- Ô thông báo nhỏ: một thành phần dùng chung, gọi được từ mọi trang, kể cả thông báo cần hiện sau khi chuyển sang trang khác (ví dụ lưu câu thông báo tạm rồi trang mới đọc ra và hiện).
- Khi bất kỳ đường API nào trả 401 kèm mã TAI_KHOAN_BI_KHOA hoặc DANG_NHAP_NOI_KHAC (Phần chung C4), frontend chuyển về trang đăng nhập với đúng câu báo, kể cả khi người dùng đang ở trang công khai.
- Mọi trang của phần này hiển thị tốt ở 1280px, 768px và 375px (Phần chung C8).

## 1.4 Đường xử lý ở máy chủ
- GET /api/tai-khoan/toi: chưa đăng nhập thì trả { "dang_nhap": false }. Đã đăng nhập thì trả id, tên đăng nhập, họ tên, vai trò, đường dẫn ảnh đại diện; người cung cấp thêm số thông báo chưa đọc; học viên thêm số khóa trong giỏ. Đi qua bước kiểm tra phiên ở Phần chung C4.
- GET /api/danh-muc/menu: danh sách danh mục có ít nhất một khóa "Đang bán" chưa xóa (id, tên, số khóa đang bán), sắp theo tên; dùng cho menu "Danh mục" và chân trang.
- GET /api/cong-thanh-toan/mac-dinh: trả tên cổng thanh toán (dòng id = 1).
- GET /api/quan-tri/so-cho-xu-ly (chỉ admin): trả ba con số cho menu khu quản trị (cách đếm ở Phần chung C9).
- GET /api/chinh-sach (công khai, không cần đăng nhập): đọc file chinh_sach.json, trả danh sách các điều theo thứ tự (số thứ tự, tên, nội dung) và ngày cập nhật lần cuối (null nếu chưa sửa lần nào).
- Đường dẫn file chinh_sach.json đổi được bằng biến môi trường DUONG_DAN_CHINH_SACH (khung dự án đã có sẵn trong backend/config.js, lệnh npm test tự đặt biến này trỏ tới một file tạm), để kiểm thử không ghi đè file thật.

## 1.5 Bảng dữ liệu dùng
- nguoi_dung (id, ten_dang_nhap, ho_ten, vai_tro, anh_dai_dien, khoa), hoc_vien, nguoi_cung_cap, quan_tri_vien để biết người xem.
- danh_muc (id, ten) và khoa_hoc (id_danh_muc, trang_thai, da_xoa) để làm menu danh mục.
- cong_thanh_toan (id, ten).
- thong_bao (id_nguoi_cung_cap, da_doc) để đếm số chưa đọc; gio_hang để đếm số khóa trong giỏ.
- bao_cao_khoa_hoc, bao_cao_danh_gia, yeu_cau_rut_tien để đếm số trên menu khu quản trị.
- Nội dung chính sách không nằm trong database mà nằm trong file backend/luu_tru/noi_dung/chinh_sach.json (database vẫn 23 bảng).

## 1.6 Kiểm tra khi làm xong
- Mở trang chủ khi chưa đăng nhập thấy đầu trang kiểu khách; đăng nhập bằng từng vai trò thấy đúng kiểu đầu trang và đúng các mục trong menu ảnh đại diện.
- Gõ một đường dẫn không có thì thấy trang 404; người cung cấp mở /gio-hang thì thấy trang 403 mà đường dẫn vẫn là /gio-hang.
- Trang Chính sách hiện đủ 12 điều như thiết kế, không có mục lục, chưa có dòng "Cập nhật lần cuối". Bấm "Về AVA" ở chân trang thì mở trang Chính sách và cuộn đúng Điều 1.
- Chân trang ở mọi trang có chân trang giống chân trang trang chủ; bấm "avahotro@gmail.com" thì mở ứng dụng thư.
- Admin thấy menu quản trị đủ 8 mục, mục "Chính sách" đứng cuối.
- Danh sách kiểm thử đầy đủ: docs/kiem_thu/phan_01_khung_trang_chinh_sach_loi.md
