# PHẦN 21. QUẢN TRỊ - NGƯỜI DÙNG: KHÓA VÀ MỞ KHÓA TÀI KHOẢN

Làm sau Phần 20.

## 21.1 Mục đích và ai dùng
- Chỉ admin. Tìm người dùng, lọc theo vai trò, khóa và mở khóa tài khoản học viên và người cung cấp.

## 21.2 Màn thiết kế
- thiet_ke/quan_tri_nguoi_dung/nguoi_dung.html (màn "Quản trị - Người dùng"): danh sách người dùng, kèm hộp "Khóa tài khoản này?".
- thiet_ke/quan_tri_nguoi_dung/nguoi_dung_mo_khoa.html (màn "Quản trị - Người dùng (mở khóa tài khoản)"): hộp "Mở khóa tài khoản này?".

## 21.3 Giao diện và hành vi
- Ô tìm "Tìm theo tên đăng nhập hoặc Gmail" (tìm chứa chữ, không phân biệt hoa thường), bộ lọc "Vai trò:" Tất cả, Học viên, Người cung cấp, Admin.
- Cột: Tên đăng nhập, Họ tên, Gmail, Vai trò, Trạng thái ("Hoạt động", hoặc "Bị khóa" kèm dòng "Lý do: [lý do]"), Hành động ("Khóa" hoặc "Mở khóa"; dòng tài khoản admin hiện "-", không có nút).
- Tài khoản mới tạo ở trên, 20 dòng mỗi trang, "Hiển thị 1-20 trên N người dùng (20 dòng mỗi trang)".
- Hộp "Khóa tài khoản này?": ô "Lý do *", các nút chọn nhanh "Dùng chung tài khoản", "Vi phạm bản quyền", "Lừa đảo", "Khác". Bấm một nút chọn nhanh thì điền chữ đó vào ô (admin sửa thêm được); bấm "Khác" thì xóa trắng ô để tự gõ. Lý do 5 đến 255 ký tự, sai thì báo "Lý do từ 5 đến 255 ký tự.". Nút "Hủy" và "Khóa tài khoản".
- Hộp "Mở khóa tài khoản này?": dòng "Lý do đã khóa: [lý do]", nút "Hủy" và "Mở khóa".
- Xong thì ô thông báo nhỏ "Đã khóa tài khoản" hoặc "Đã mở khóa tài khoản", bảng tải lại.

## 21.4 Khóa tài khoản (mọi việc trong một giao dịch)
- Chung: nguoi_dung.khoa = 1, ly_do_khoa, id_quan_tri_vien = admin đã khóa. Người đó đang đăng nhập thì bị đẩy ra ở lần gửi yêu cầu kế tiếp tới máy chủ, kể cả khi đang ở trang công khai: máy chủ xóa cookie, trả 401 kèm mã, trang chuyển về trang đăng nhập với câu báo (Phần chung C4). Dữ liệu giữ nguyên.
- Không khóa được tài khoản admin (kể cả chính mình): máy chủ từ chối 403.
- Học viên:
  - Không đăng nhập được, không học được khóa đã mua (quyền học tính lại), không được hoàn tiền (admin tự xét).
  - Đánh giá của học viên không còn hiện và không tính điểm (tự có nhờ Phần 16 mục 16.4, không đụng bảng danh_gia).
  - Xóa hẳn: các phiếu bao_cao_khoa_hoc và bao_cao_danh_gia đang chờ do học viên đó gửi; các phiếu bao_cao_danh_gia đang chờ mà người khác báo cáo đánh giá của học viên đó. Phiếu đã xử lý giữ lại. Mở khóa sau này thì phiếu đã xóa không quay lại.
- Người cung cấp:
  - Không đăng nhập được, ví đóng băng.
  - Yêu cầu rút tiền 'Chờ duyệt' (nếu có) chuyển 'Từ chối', ly_do_tu_choi "Tài khoản bị khóa", id_quan_tri_vien = admin, ngay_xu_ly = NOW(); thông báo 'Từ chối rút tiền' (Phần 18). Tiền tự quay về ví.
  - Với từng khóa 'Đang bán' chưa xóa của người đó, đếm số lần đã bị ẩn trong lịch sử:
    - Chưa có lần nào: trang_thai 'Bị ẩn', bi_an_boi 'Hệ thống - khóa tài khoản', ly_do_an "Tài khoản bị khóa"; lịch sử 'Hệ thống ẩn do khóa tài khoản'; thông báo 'Khóa học bị ẩn' (mẫu hệ thống ở Phần 18). Phiếu báo cáo đang chờ của khóa giữ nguyên "Chưa xử lý".
    - Đã có một lần: lịch sử 'Hệ thống ẩn do khóa tài khoản' rồi 'Hệ thống gỡ vĩnh viễn'; khóa làm các bước gỡ vĩnh viễn như Phần 19 mục 19.5 với lý do "Khóa học bị ẩn lần thứ 2 nên bị gỡ vĩnh viễn"; thông báo 'Khóa học bị gỡ vĩnh viễn'; phiếu đang chờ của khóa đổi 'Gỡ vĩnh viễn'.
  - Khóa đang bị ẩn sẵn (tự ẩn hoặc admin ẩn) và khóa đã gỡ giữ nguyên, không tính thêm lần.
  - Học viên đã mua mọi khóa của người này không học được nữa, thấy "Khóa học không khả dụng" (tính lại từ quyền học).
  - Mọi dòng lịch sử ghi id_nguoi_dung là admin đã khóa.

## 21.5 Mở khóa tài khoản (một giao dịch)
- nguoi_dung.khoa = 0, ly_do_khoa NULL, id_quan_tri_vien NULL. Đăng nhập lại được ngay.
- Học viên: học lại được, đánh giá hiện lại (tự có).
- Người cung cấp: ví hết đóng băng; mọi khóa đang 'Bị ẩn' với bi_an_boi 'Hệ thống - khóa tài khoản' chuyển 'Đang bán' (bi_an_boi, ly_do_an về NULL), lịch sử 'Hệ thống bán lại do mở khóa tài khoản' (id_nguoi_dung là admin mở khóa). Lần ẩn đó vẫn được tính một lần. Khóa bị admin ẩn vẫn ẩn; khóa đã gỡ không quay lại. Học viên học tiếp, tiến độ còn nguyên. Yêu cầu rút cũ đã bị từ chối, muốn rút thì gửi yêu cầu mới.
- Mở khóa không tạo thông báo.

## 21.6 Đường xử lý ở máy chủ (chỉ admin)
- GET /api/quan-tri/nguoi-dung?tu_khoa=&vai_tro=tat-ca|hoc-vien|nguoi-cung-cap|admin&trang=.
- POST /api/quan-tri/nguoi-dung/:id/khoa: nhận { ly_do }.
- POST /api/quan-tri/nguoi-dung/:id/mo-khoa.
- Tài khoản đã bị khóa mà khóa lần nữa, hoặc chưa khóa mà mở khóa: 409.

## 21.7 Bảng dữ liệu dùng
- nguoi_dung, hoc_vien, nguoi_cung_cap, khoa_hoc, bai_hoc, lich_su_khoa_hoc, thong_bao, yeu_cau_rut_tien, bao_cao_khoa_hoc, bao_cao_danh_gia, danh_gia.

## 21.8 Câu thông báo
- "Khóa tài khoản này?", "Lý do từ 5 đến 255 ký tự.", "Đã khóa tài khoản"
- "Mở khóa tài khoản này?", "Lý do đã khóa: [lý do]", "Đã mở khóa tài khoản"
- Lý do tự ghi: "Tài khoản bị khóa", "Khóa học bị ẩn lần thứ 2 nên bị gỡ vĩnh viễn"

## 21.9 Kiểm tra khi làm xong
- Khóa người cung cấp có 2 khóa đang bán (một khóa chưa từng bị ẩn, một khóa đã bị admin ẩn một lần rồi đăng lại) và 1 yêu cầu rút chờ: khóa thứ nhất 'Bị ẩn (hệ thống - khóa tài khoản)', khóa thứ hai 'Bị gỡ vĩnh viễn', yêu cầu rút 'Từ chối', có 3 thông báo.
- Mở khóa người đó: khóa thứ nhất bán lại, khóa thứ hai vẫn gỡ, lịch sử có dòng 'Hệ thống bán lại do mở khóa tài khoản'. Admin ẩn khóa thứ nhất sau đó: khóa bị gỡ ngay (lần thứ hai).
- Khóa học viên đang đăng nhập: lần bấm kế tiếp bị đưa về trang đăng nhập với câu "Tài khoản đã bị khóa. Lý do: [lý do]. Liên hệ hỗ trợ nếu bạn cho rằng có nhầm lẫn.".
- Khóa học viên có 2 phiếu báo cáo chờ và 1 phiếu đã xử lý: còn lại đúng 1 phiếu đã xử lý.
- Gọi thẳng API khóa một tài khoản admin: 403.
- Danh sách kiểm thử đầy đủ: docs/kiem_thu/phan_21_quan_tri_nguoi_dung.md
