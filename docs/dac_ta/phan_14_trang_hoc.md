# PHẦN 14. TRANG HỌC, TIẾN ĐỘ, KHÓA HỌC CỦA TÔI

Làm sau Phần 13. Bài trắc nghiệm trên trang học làm ở Phần 15; hộp "Báo cáo bài học này" làm ở Phần 16 (ở phần này chỉ đặt liên kết).

## 14.1 Mục đích và ai dùng
- Học viên có quyền học: học mọi bài, có tiến độ.
- Mọi người (kể cả khách, người cung cấp khác, học viên chưa mua): chỉ xem bài học thử (bài số 1) của khóa họ được xem trang chi tiết, không có tiến độ.
- Chủ khóa và admin: mở mọi bài của khóa, không tạo tiến độ (riêng khóa 'Bị gỡ vĩnh viễn' thì chỉ admin mở được bài, xem 14.3).

## 14.2 Màn thiết kế
- thiet_ke/trang_hoc/bai_video.html (màn "Trang học - Bài video (kiểu rạp)"): bài video, danh sách bài bên phải.
- thiet_ke/trang_hoc/bai_video_an_danh_sach.html (màn "Trang học - Bài video (đã ẩn danh sách)"): bài video khi đã bấm "Ẩn" danh sách bài.
- thiet_ke/trang_hoc/bai_tai_lieu.html (màn "Trang học - Tài liệu (kết hợp 4 hướng)"): bài tài liệu PDF.
- thiet_ke/trang_hoc/bai_hoc_thu_chua_mua.html (màn "Trang học - Bài học thử (chưa mua)"): bài học thử khi chưa mua.
- thiet_ke/trang_hoc/khoa_hoc_khong_kha_dung.html (màn "Trang học - Khóa học không khả dụng"): trang "Khóa học không khả dụng".
- thiet_ke/ho_so/ho_so_hoc_vien.html (màn "Hồ sơ - Học viên"): hai mục "Khóa học của tôi" và "Tiến độ học" trong hồ sơ học viên.

## 14.3 Vào học
- Đường dẫn trang học: /khoa-hoc/:id/hoc/:idBai.
- Nút "Vào học" (trang chi tiết, "Khóa học của tôi"): gọi GET /api/khoa-hoc/:id/vao-hoc để biết mở bài nào: chưa mở bài nào thì bài số 1; đã mở thì bài có tien_do_hoc.lan_mo_gan_nhat gần nhất (bỏ qua bài đã xóa). Bấm thẳng tên bài thì mở đúng bài đó.
- Máy chủ xét quyền mỗi lần mở bài:
  - Học viên có quyền học, admin, và chủ khóa của khóa chưa bị gỡ vĩnh viễn: mở được. Chủ khóa mở bài của khóa 'Bị gỡ vĩnh viễn': 404 (đúng Chương 2: người cung cấp chỉ xem thông tin khóa và danh sách bài ở trang quản lý khóa, Phần 8).
  - Học viên đã mua mà khóa 'Bị gỡ vĩnh viễn' hoặc người cung cấp đang bị khóa tài khoản: trả { khong_kha_dung: true }, trang hiện "Khóa học không khả dụng", "Vui lòng liên hệ hỗ trợ nếu bạn cần được hỗ trợ.", nút "Về Khóa học của tôi".
  - Bài số 1 (bài học thử) với người xem được trang chi tiết khóa (Phần 11 mục 11.4): mở được ở chế độ học thử.
  - Còn lại: đưa về trang chi tiết khóa kèm ô thông báo nhỏ "Bạn cần mua khóa học này để vào học.". Bài đã xóa hoặc không thuộc khóa: 404.
- Khóa 'Bị ẩn' thì học viên đã mua vẫn học bình thường.

## 14.4 Giao diện trang học
- Đầu trang công khai như các trang khác, nhưng không có chân trang (trang học, kể cả bài trắc nghiệm ở Phần 15, nằm trong nhóm trang không có chân trang ở Phần chung C9); liên kết "Quay lại khóa học" (về /khoa-hoc/:id) và tên khóa.
- Vùng nội dung bài:
  - Video: khung phát video lấy từ GET /api/bai-hoc/:id/video, tua được. Lần trước đã xem dở thì phát tiếp từ vi_tri_xem_cu và hiện dòng "Lần trước bạn dừng ở mm:ss".
  - Tài liệu: xem PDF ngay trong trang với thanh công cụ như thiết kế (tên file, "PDF, 1,2 MB", thu nhỏ, phóng to, phần trăm, chuyển trang "3 / 8", nút "Tải về"). Dùng thư viện pdfjs-dist để vẽ PDF. Nút "Tải về" lấy file kèm tên file gốc.
  - Trắc nghiệm: Phần 15.
- Dưới nội dung: số thứ tự và tên bài ("05. CSS: màu sắc và bố cục"), loại bài, liên kết "Báo cáo bài học này" (chỉ học viên có quyền học; bài đang có phiếu chờ xử lý của chính học viên thì thành chữ mờ "Bạn đã báo cáo, đang chờ xử lý"), khối "Bài tiếp theo" (bài kế, không có thì ẩn), nút "Bài trước" và "Học bài tiếp theo".
- Cột "Nội dung khóa học" bên phải: phần trăm và "Đã học x/y bài" (chỉ học viên có quyền học), danh sách mọi bài chưa xóa theo số thứ tự (dấu đã học xong ở bài xong, chữ "Đang xem" ở bài đang mở, chữ "Học đến đây" ở bài mở gần nhất trước đó, nhãn trắc nghiệm theo Phần 11). Nút "Ẩn" thu cột lại để nội dung rộng ra, nút "Hiện" mở lại; nhớ lựa chọn trong trình duyệt (localStorage, bọc try/catch).
- Học thử khi chưa mua: dải "Bạn đang xem thử miễn phí bài đầu tiên. Mua khóa học để học toàn bộ N bài." kèm nút "Mua ngay" và "Thêm vào giỏ hàng" (hành vi như Phần 12). Người cung cấp xem thử khóa của người khác thì dải chỉ có câu "Bạn đang xem thử miễn phí bài đầu tiên.", không có hai nút. Bấm bài khác trong danh sách thì hiện dòng nhắc như Phần 11. Không có liên kết báo cáo, không có tiến độ.
- Chủ khóa và admin: không có tiến độ, không có "Lần trước bạn dừng ở", không có liên kết báo cáo.

## 14.5 Ghi tiến độ (chỉ học viên có quyền học)
- Mở một bài: thêm hoặc cập nhật dòng tien_do_hoc (id_hoc_vien, id_bai_hoc), lan_mo_gan_nhat = NOW(). Bài tài liệu thì da_hoc_xong = 1 ngay khi mở.
- Video đang phát: khoảng 10 giây trình duyệt gửi vị trí đang xem (giây, số nguyên) một lần qua POST /api/bai-hoc/:id/vi-tri, và gửi thêm một lần khi bấm tạm dừng. Máy chủ:
  - vi_tri_xem_cu = vị trí mới.
  - Mốc xem liền mạch moc_luu_video (NULL coi là 0): vị trí mới lớn hơn hoặc bằng mốc và cách mốc không quá 15 giây thì nâng mốc lên vị trí mới; tua tới xa hơn 15 giây hoặc xem lại đoạn dưới mốc thì mốc giữ nguyên.
  - Mốc đạt từ 90% thoi_luong trở lên thì da_hoc_xong = 1. Đã xong thì giữ xong.
- Bài trắc nghiệm xong khi nộp bài lần đầu (Phần 15).
- Tiến độ khóa = số bài chưa xóa đã học xong chia tổng số bài chưa xóa, nhân 100, làm tròn xuống (24 bài, xong 5 bài: 20%). Bài đã xóa không tính ở cả tử và mẫu.
- Không có nút "Đã học xong", không bắt học theo thứ tự.
- Người cung cấp thay video một bài: bài đã xong vẫn xong, bài chưa xong thì vi_tri_xem_cu và moc_luu_video về 0 (đã làm ở Phần 8).

## 14.6 Phát file có kiểm tra quyền
- GET /api/bai-hoc/:id/video: kiểm quyền như 14.3 (kể cả chặn chủ khóa của khóa bị gỡ vĩnh viễn) (học thử chỉ bài số 1), trả video theo từng đoạn (HTTP Range, mã 206) để tua được. Người gọi không có quyền xem bài này thì trả 404 (không tìm thấy), không trả 403, và không lộ đường dẫn file. Mã 403 chỉ dùng khi sai vai trò (Phần chung C6).
- GET /api/bai-hoc/:id/tai-lieu: kiểm quyền như trên, trả PDF để xem trong trang; thêm ?tai_ve=1 thì trả kèm tiêu đề tải về với tên file gốc (ten_file).
- Admin xem bài của khóa bị gỡ vĩnh viễn và file cũ trong kho lưu trữ: Phần 19.

## 14.7 Khóa học của tôi và Tiến độ học (hồ sơ học viên)
- "Khóa học của tôi" (/ho-so#khoa-hoc-cua-toi): mỗi khóa học viên đang có lượt mua đã thanh toán chưa hoàn tiền, khóa mua gần nhất ở trên. Mỗi dòng: tên khóa (bấm mở trang chi tiết) và nút "Vào học". Khóa 'Bị gỡ vĩnh viễn' hoặc của người cung cấp đang bị khóa vẫn nằm đây với nhãn "Không khả dụng"; nút "Vào học" vẫn có, bấm thì ra trang "Khóa học không khả dụng". Khóa đã hoàn tiền biến khỏi danh sách. Chưa có khóa nào thì hiện "Bạn chưa mua khóa học nào." và nút "Khám phá khóa học".
- "Tiến độ học" (/ho-so#tien-do-hoc): mỗi khóa đang có quyền học (không tính khóa "Không khả dụng"): tên khóa, "x/y bài", phần trăm và thanh tiến độ.
- Người cung cấp được mở khóa tài khoản thì học viên học tiếp, tiến độ vẫn còn.

## 14.8 Đường xử lý ở máy chủ
- GET /api/khoa-hoc/:id/vao-hoc: trả id bài cần mở hoặc { khong_kha_dung: true }.
- GET /api/khoa-hoc/:id/hoc/:idBai: thông tin bài (không có đường dẫn file), chế độ (đầy đủ, học thử, chủ khóa hoặc admin), danh sách bài, tiến độ, vi_tri_xem_cu, bài kế và bài trước, học viên có phiếu báo cáo chờ ở bài này không. Ghi lan_mo_gan_nhat và tiến độ bài tài liệu như 14.5.
- POST /api/bai-hoc/:id/vi-tri: nhận { giay }. Chỉ học viên có quyền học.
- GET /api/bai-hoc/:id/video, GET /api/bai-hoc/:id/tai-lieu: như 14.6.
- GET /api/hoc-vien/khoa-hoc-cua-toi: hai danh sách cho 14.7.

## 14.9 Bảng dữ liệu dùng
- bai_hoc, khoa_hoc, tien_do_hoc, don_hang, chi_tiet_don_hang (quyền học), nguoi_dung (khóa tài khoản), bao_cao_khoa_hoc (phiếu chờ của học viên).

## 14.10 Câu thông báo
- "Bạn cần mua khóa học này để vào học."
- "Khóa học không khả dụng", "Vui lòng liên hệ hỗ trợ nếu bạn cần được hỗ trợ."
- "Lần trước bạn dừng ở mm:ss"
- "Bạn đang xem thử miễn phí bài đầu tiên. Mua khóa học để học toàn bộ N bài."
- "Bạn chưa mua khóa học nào."

## 14.11 Kiểm tra khi làm xong
- Học viên xem video nối tiếp tới 90%: bài thành đã học xong. Tua thẳng tới cuối: chưa xong.
- Đóng trang ở phút 3:45 rồi mở lại: video phát tiếp từ 3:45 và hiện "Lần trước bạn dừng ở 03:45".
- Mở bài PDF: bài thành đã học xong ngay, tiến độ tăng.
- Khách mở /khoa-hoc/12/hoc/<bài số 2>: về trang chi tiết với câu "Bạn cần mua khóa học này để vào học.". Gọi thẳng /api/bai-hoc/<bài số 2>/video khi chưa mua: nhận 404.
- Admin gỡ vĩnh viễn khóa: học viên đã mua bấm "Vào học" ra trang "Khóa học không khả dụng".
- Chủ khóa mở trang học: không có dòng tien_do_hoc nào được tạo.
- Danh sách kiểm thử đầy đủ: docs/kiem_thu/phan_14_trang_hoc.md
