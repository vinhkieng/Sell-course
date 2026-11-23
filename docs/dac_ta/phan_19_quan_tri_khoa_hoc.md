# PHẦN 19. QUẢN TRỊ - KHÓA HỌC: DANH SÁCH, CHI TIẾT, ẨN, GỠ VĨNH VIỄN, LỊCH SỬ THAY ĐỔI

Làm sau Phần 18. Khung khu quản trị (menu dọc 8 mục, mục 8 là "Chính sách"; số tròn) đã làm ở Phần 1. Trang của mục "Chính sách" làm ở Phần 24.

## 19.1 Mục đích và ai dùng
- Chỉ admin. Xem mọi khóa, xem từng bài, xem lịch sử thay đổi, ẩn hoặc gỡ vĩnh viễn khóa vi phạm.

## 19.2 Màn thiết kế
- thiet_ke/quan_tri_khoa_hoc/danh_sach_khoa_hoc.html (màn "Quản trị - Khóa học (danh sách)"): danh sách khóa học (trang mở đầu khi admin đăng nhập).
- thiet_ke/quan_tri_khoa_hoc/khoa_dang_ban.html (màn "Quản trị - Khóa đang bán"): chi tiết khóa đang bán, kèm hai hộp "Ẩn khóa học này?" và "Gỡ vĩnh viễn khóa học này?".
- thiet_ke/quan_tri_khoa_hoc/khoa_dang_ban_hop_go_vinh_vien.html (màn "Quản trị - Khóa đang bán (hộp Gỡ vĩnh viễn)"): chi tiết khóa đang bán, đang mở hộp gỡ vĩnh viễn.
- thiet_ke/quan_tri_khoa_hoc/xem_bai_hoc.html (màn "Quản trị - Xem bài học"): hộp xem một bài video.
- thiet_ke/quan_tri_khoa_hoc/xem_bai_trac_nghiem.html (màn "Quản trị - Xem bài trắc nghiệm"): hộp xem bài trắc nghiệm kèm đáp án đúng.
- thiet_ke/quan_tri_khoa_hoc/lich_su_thay_doi.html (màn "Quản trị - Lịch sử thay đổi"): tab "Lịch sử thay đổi".
- thiet_ke/quan_tri_khoa_hoc/khoa_tu_an.html (màn "Quản trị - Khóa tự ẩn"): khóa người cung cấp tự ẩn.
- thiet_ke/quan_tri_khoa_hoc/khoa_admin_an.html (màn "Quản trị - Khóa admin ẩn"): khóa admin đã ẩn (nút "Ẩn khóa học" mờ).
- thiet_ke/quan_tri_khoa_hoc/khoa_an_do_khoa_tai_khoan.html (màn "Quản trị - Khóa ẩn do khóa tài khoản"): khóa bị ẩn do khóa tài khoản người cung cấp.
- thiet_ke/quan_tri_khoa_hoc/khoa_bi_go_vinh_vien.html (màn "Quản trị - Khóa bị gỡ vĩnh viễn"): khóa bị gỡ vĩnh viễn (không còn nút).

## 19.3 Danh sách khóa học (/quan-tri/khoa-hoc)
- Bốn lựa chọn lọc kèm số: "Tất cả", "Đang bán", "Bị ẩn", "Bị gỡ vĩnh viễn". Khóa đã bị người cung cấp xóa không hiện.
- Cột: Khóa học, Người cung cấp (họ tên như thiết kế, trống thì tên đăng nhập), Danh mục, Ngày đăng (dd/mm/yyyy), Trạng thái (chữ theo Phần chung C11), Hành động "Xem" (mở /quan-tri/khoa-hoc/:id).
- Mới nhất ở trên, 20 dòng mỗi trang, dòng "Hiển thị 1-20 trên N khóa học (20 dòng mỗi trang)" (đổi chữ theo bộ lọc như thiết kế), nút "Trước", số trang, "Sau".

## 19.4 Chi tiết khóa học của admin (/quan-tri/khoa-hoc/:id)
- Đường dẫn trên cùng "Khóa học / Chi tiết khóa học (quản trị)", tên khóa, "Người cung cấp: họ tên", nhãn trạng thái, hai tab "Nội dung" và "Lịch sử thay đổi" (kèm số dòng lịch sử).
- Tab "Nội dung": khối "Thông tin khóa học" (ảnh bìa lấy qua GET /api/anh/anh_bia/<tên>, Danh mục, Giá bán, Mô tả, Bạn sẽ học được gì, Yêu cầu trước khi học, Dành cho ai); khối "Danh sách bài học" ("N bài học", cột STT, Nội dung bài học, Loại, Hành động "Xem").
- "Xem" một bài:
  - Video: hộp "Bài 05 - Tên bài", khung phát video (tua được), dòng "Độ dài 12:00, 48 MB", nút "Đóng".
  - Tài liệu: hộp cùng kiểu, xem PDF trong hộp.
  - Trắc nghiệm: hộp "Bài 06 - Tên bài", "Trắc nghiệm, N câu, M phút", mọi câu hỏi kèm nhãn "Đáp án đúng", nút "Đóng". Không làm bài, không thấy điểm học viên.
  - Admin xem được bài của khóa ở mọi trạng thái, kể cả khóa bị gỡ vĩnh viễn (file vẫn ở chỗ cũ).
- Dưới danh sách bài: khối lý do ("Lý do ẩn:" hoặc "Lý do gỡ:" kèm ly_do_an, khi có) và dòng "Học viên đã mua:" kèm "vẫn học được" (đang bán, bị ẩn tự ẩn hoặc admin ẩn) hay "không học được" (bị gỡ vĩnh viễn, hoặc người cung cấp đang bị khóa tài khoản).
- Nút theo trạng thái khóa:
| Khóa đang | Ẩn khóa học | Gỡ vĩnh viễn |
| --- | --- | --- |
| Đang bán | Có | Có |
| Bị ẩn (tự ẩn) | Có (ẩn đè, tính một lần ẩn) | Có |
| Bị ẩn (admin ẩn hoặc hệ thống - khóa tài khoản) | Mờ | Có |
| Bị gỡ vĩnh viễn | Không có nút | Không có nút |

- Mở trang này từ một dòng ở trang "Báo cáo khóa học" thì đường dẫn mang theo mục bị báo cáo (?muc=bai-<id> hoặc ?muc=gioi-thieu) để các nút ẩn và gỡ biết đổi kết quả phiếu nào (19.6).

## 19.5 Ẩn khóa học và gỡ vĩnh viễn
- Hộp "Ẩn khóa học này?": ô "Lý do ẩn *" (nhiều dòng, bắt buộc, tối đa 255 ký tự), dòng "Người cung cấp sẽ nhìn thấy lý do này.", nút "Hủy" và "Ẩn khóa học". Không cảnh báo lần ẩn thứ hai (admin tự xem tab lịch sử).
- Hộp "Gỡ vĩnh viễn khóa học này?": ô "Lý do gỡ *" (bắt buộc, tối đa 255 ký tự), cùng dòng nhắc, nút "Hủy" và "Gỡ vĩnh viễn".
- Bỏ trống lý do: "Vui lòng nhập lý do".
- Ẩn, trong một giao dịch (khóa dòng khoa_hoc bằng SELECT … FOR UPDATE, kiểm lại trạng thái cho phép theo bảng 19.4):
  - Đếm số lần đã bị ẩn trong lich_su_khoa_hoc (dòng 'Quản trị viên ẩn khóa' hoặc 'Hệ thống ẩn do khóa tài khoản').
  - Chưa có lần nào: trang_thai 'Bị ẩn', bi_an_boi 'Admin ẩn', ly_do_an = lý do. Lịch sử 'Quản trị viên ẩn khóa' (ghi_chu = lý do, gia_tri_cu và gia_tri_moi là chữ trạng thái cũ và mới). Thông báo 'Khóa học bị ẩn' (Phần 18). Phiếu báo cáo đổi kết quả 'Ẩn khóa' (19.6).
  - Đã có một lần: đây là lần thứ hai. Lịch sử ghi 'Quản trị viên ẩn khóa' rồi 'Hệ thống gỡ vĩnh viễn'; khóa làm các bước gỡ vĩnh viễn bên dưới với lý do là lý do admin vừa gõ; thông báo 'Khóa học bị gỡ vĩnh viễn'; phiếu đổi kết quả 'Gỡ vĩnh viễn'.
- Gỡ vĩnh viễn (do admin bấm, hoặc lần ẩn thứ hai), trong một giao dịch:
  - trang_thai 'Bị gỡ vĩnh viễn', bi_an_boi NULL, ly_do_an = lý do.
  - Mọi bài của khóa (cả bài đã xóa) đặt khong_chan_ma_bam = 1 để file không còn chặn người khác đăng lại (Phần chung C3. Hai cột da_xoa và khong_chan_ma_bam của bài học). File vẫn để nguyên chỗ cũ.
  - Lịch sử 'Quản trị viên gỡ vĩnh viễn' (hoặc 'Hệ thống gỡ vĩnh viễn' ở lần ẩn thứ hai), ghi_chu = lý do, không có "File cũ".
  - Thông báo 'Khóa học bị gỡ vĩnh viễn'. Phiếu báo cáo đổi kết quả 'Gỡ vĩnh viễn'.
  - Hệ quả tự có nhờ các câu truy vấn: học viên đã mua không học được và thấy "Khóa học không khả dụng"; đánh giá của khóa không còn hiện; khóa trong giỏ hiện "Không còn bán"; khách mở trang khóa gặp 404; người cung cấp chỉ xem được (Phần 8).
- Mọi dòng lịch sử do admin hoặc hệ thống gây ra ghi id_nguoi_dung là tài khoản admin vừa bấm.
- Xong thì ô thông báo nhỏ "Đã ẩn khóa học" hoặc "Đã gỡ vĩnh viễn khóa học", trang tải lại.
- Không có nút "Hiện lại". Khóa bị admin ẩn chỉ bán lại khi người cung cấp sửa rồi bấm "Đăng" (Phần 8). Admin không gỡ riêng từng bài.
- Người cung cấp đang sửa khóa mà admin ẩn hoặc gỡ: lần "Đăng" của người cung cấp bị từ chối (đã làm ở Phần 8).

## 19.6 Đổi kết quả phiếu báo cáo khóa học khi ẩn hoặc gỡ
- Mọi phiếu bao_cao_khoa_hoc đang chờ (bien_phap_xu_ly NULL) của khóa (phiếu phần giới thiệu và phiếu mọi bài của khóa) đổi sang 'Ẩn khóa' hoặc 'Gỡ vĩnh viễn', id_quan_tri_vien = admin.
- Nếu trang được mở từ trang báo cáo (có ?muc=): thêm mọi phiếu của đúng mục đó (dù đang 'Không vi phạm' hay 'Ẩn khóa') đổi sang kết quả mới.
- Mở từ menu "Khóa học" (không có ?muc=): chỉ phiếu đang chờ đổi; phiếu đã 'Không vi phạm' giữ nguyên.
- Riêng khi hệ thống ẩn khóa do khóa tài khoản người cung cấp (Phần 21): phiếu đang chờ giữ nguyên 'Chưa xử lý'.

## 19.7 Tab "Lịch sử thay đổi"
- Dòng "Mọi thay đổi của khóa học đều được ghi lại. Mới nhất ở trên.".
- Cột: Thời điểm (dd/mm/yyyy HH:mm), Người thực hiện (tên đăng nhập), Hành động (noi_dung_thay_doi nếu có, không thì hanh_dong; ví dụ "Xóa bài - Bài 07 Bảng màu cơ bản", "Đổi giá"), Giá trị cũ, Giá trị mới, Ghi chú, File cũ (liên kết "File cũ" khi duong_dan_file_cu có giá trị). Ô trống hiện "-".
- Giá trị dài (mô tả) cắt ngắn, CSS tự thêm dấu ba chấm, rê chuột thấy đủ.
- Bấm "File cũ" mở hộp xem file trong kho lưu trữ (video phát được, PDF xem được, ảnh bìa xem được). Mọi file cũ, kể cả ảnh bìa cũ, lấy qua đường file cũ ở 19.8, không lấy qua /api/anh (đường /api/anh chỉ lấy hai thư mục anh_bia và anh_dai_dien).
- 20 dòng mỗi trang, dòng "Hiển thị N trên M thay đổi".
- Không có chức năng sửa hay xóa lịch sử. Người cung cấp không xem được tab này.

## 19.8 Đường xử lý ở máy chủ (chỉ admin)
- GET /api/quan-tri/khoa-hoc?trang_thai=tat-ca|dang-ban|bi-an|bi-go&trang=: danh sách và số đếm của bốn lựa chọn.
- GET /api/quan-tri/khoa-hoc/:id: thông tin, danh sách bài chưa xóa, trạng thái, lý do, học viên đã mua còn học được không, số dòng lịch sử. Khóa đã xóa: 404.
- GET /api/quan-tri/bai-hoc/:id/video, /tai-lieu, /trac-nghiem: xem bài (video theo từng đoạn để tua).
- POST /api/quan-tri/khoa-hoc/:id/an: nhận { ly_do, muc }. POST /api/quan-tri/khoa-hoc/:id/go-vinh-vien: nhận { ly_do, muc }. Trạng thái không cho phép (ví dụ khóa vừa bị admin khác gỡ): 409 "Trạng thái khóa học vừa thay đổi, vui lòng tải lại trang.".
- GET /api/quan-tri/khoa-hoc/:id/lich-su?trang=.
- GET /api/quan-tri/lich-su/:idDong/file-cu: phát file cũ của đúng dòng lịch sử đó (chỉ lấy đường dẫn từ cơ sở dữ liệu, không nhận đường dẫn từ trình duyệt). Video trả theo từng đoạn.

## 19.9 Bảng dữ liệu dùng
- khoa_hoc, bai_hoc (khong_chan_ma_bam), cau_hoi_bai_tap, lich_su_khoa_hoc, thong_bao, bao_cao_khoa_hoc, nguoi_dung, nguoi_cung_cap, danh_muc.

## 19.10 Câu thông báo
- "Ẩn khóa học này?", "Gỡ vĩnh viễn khóa học này?", "Người cung cấp sẽ nhìn thấy lý do này.", "Vui lòng nhập lý do"
- "Đã ẩn khóa học", "Đã gỡ vĩnh viễn khóa học"
- "Trạng thái khóa học vừa thay đổi, vui lòng tải lại trang."
- "Học viên đã mua:" "vẫn học được" / "không học được"

## 19.11 Kiểm tra khi làm xong
- Ẩn một khóa đang bán lần đầu: 'Bị ẩn' 'Admin ẩn', lịch sử 1 dòng, người cung cấp có thông báo, học viên đã mua vẫn học.
- Người cung cấp sửa rồi đăng lại, admin ẩn lần nữa: khóa thành 'Bị gỡ vĩnh viễn', lịch sử thêm 2 dòng, mọi bài có khong_chan_ma_bam = 1, người khác tải lên đúng file đó được.
- Khóa người cung cấp tự ẩn: admin ẩn đè được và tính một lần.
- Khóa admin đã ẩn: nút "Ẩn khóa học" mờ, gọi thẳng API ẩn bị từ chối.
- Bấm "File cũ" ở dòng "Thay file": xem được file cũ. Người cung cấp gọi thẳng API file cũ: 403.
- Danh sách kiểm thử đầy đủ: docs/kiem_thu/phan_19_quan_tri_khoa_hoc.md
