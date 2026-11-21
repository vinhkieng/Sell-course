# PHẦN 16. ĐÁNH GIÁ, BÁO CÁO ĐÁNH GIÁ, BÁO CÁO KHÓA HỌC VI PHẠM (PHÍA HỌC VIÊN)

Làm sau Phần 15. Các khối này nằm trên trang chi tiết khóa (Phần 11) và trang học (Phần 14). Phía admin xử lý ở Phần 20.

## 16.1 Mục đích và ai dùng
- Mọi người, kể cả khách, xem điểm trung bình, phân bố sao và danh sách đánh giá.
- Học viên có quyền học và đã học xong ít nhất 1 bài: viết và sửa đánh giá của mình.
- Học viên có quyền học: báo cáo đánh giá của người khác; báo cáo phần giới thiệu khóa và các bài.
- Người cung cấp và admin chỉ xem, không có nút đánh giá hay báo cáo.

## 16.2 Màn thiết kế
- thiet_ke/chi_tiet_khoa_hoc/da_mua.html (màn "Chi tiết khóa học (đã mua)"): khối "Thấy nội dung vi phạm?" (ô tích ở danh sách bài) và khối viết đánh giá.
- thiet_ke/chi_tiet_khoa_hoc/da_mua_chua_hoc_xong_bai_nao.html (màn "Chi tiết khóa học - Đã mua (chưa học xong bài nào)"): đã mua nhưng chưa học xong bài nào ("Hãy học xong ít nhất 1 bài để viết đánh giá.").
- thiet_ke/danh_gia_bao_cao/da_mua_da_danh_gia.html (màn "Chi tiết khóa học - Đã mua (đã đánh giá)"): đã có đánh giá (hiện đánh giá của mình và nút "Sửa đánh giá").
- thiet_ke/danh_gia_bao_cao/bao_cao_thanh_cong.html (màn "Chi tiết khóa học (báo cáo thành công)"): gửi báo cáo khóa học thành công.
- thiet_ke/danh_gia_bao_cao/bao_cao_loi.html (màn "Chi tiết khóa học (báo cáo lỗi)"): báo cáo khóa học thiếu mục, thiếu lý do, thiếu ghi chú.
- thiet_ke/danh_gia_bao_cao/bao_cao_danh_gia.html (màn "Chi tiết khóa học (báo cáo đánh giá)"): hộp "Báo cáo đánh giá này?".

## 16.3 Khối "Đánh giá khóa học" (mọi người xem)
- Điểm trung bình (một chữ số thập phân, dấu phẩy, ví dụ 4,7), "N đánh giá", năm dòng "5 sao … 1 sao" kèm thanh và phần trăm (số nguyên). Chưa có đánh giá hợp lệ nào thì hiện "Chưa có đánh giá" và ẩn phân bố sao.
- "Đánh giá của học viên": mỗi đánh giá có ảnh chữ cái đầu, tên (họ tên, trống thì "Học viên AVA"), số sao, ngày viết (dd/mm/yyyy), nhận xét. Mới nhất ở trên. Hiện 3 cái đầu, dòng "Hiển thị 3 trên N đánh giá", nút "Xem thêm đánh giá" mỗi lần tải thêm 10, hết thì ẩn nút.
- Nút "Báo cáo" dưới mỗi đánh giá chỉ có với học viên có quyền học, trừ đánh giá của chính mình. Đã báo cáo đánh giá đó rồi (kể cả admin đã xử lý) thì thay bằng chữ mờ "Đã báo cáo".

## 16.4 Đánh giá hợp lệ (dùng cho điểm trung bình, số lượt, phân bố sao, danh sách ở mọi trang)
- Một đánh giá được tính và được hiện công khai khi đủ bốn điều:
  - bi_an = 0 (chưa bị admin ẩn);
  - người viết còn ít nhất một lượt mua khóa đó trong một đơn 'Đã thanh toán' mà da_hoan_tien = 0;
  - tài khoản người viết không bị khóa (được mở khóa thì đánh giá hiện lại);
  - khóa không 'Bị gỡ vĩnh viễn'.
- Hoàn tiền và khóa tài khoản không đụng tới bảng danh_gia (không đặt bi_an = 1, vì cột bi_an = 1 bắt buộc có lý do và admin ẩn). Việc "ẩn" trong hai trường hợp này là do câu truy vấn lọc theo bốn điều trên.

## 16.5 Viết và sửa đánh giá
- Khối "Đánh giá của bạn":
  - Học viên có quyền học, đã học xong ít nhất 1 bài chưa xóa, chưa có đánh giá: 5 ngôi sao để chọn, ô nhận xét không bắt buộc (đếm "0/1000"), nút "Gửi đánh giá". Chưa chọn sao mà bấm gửi thì báo "Hãy chọn số sao trước khi gửi".
  - Có quyền học nhưng chưa học xong bài nào: dòng "Hãy học xong ít nhất 1 bài để viết đánh giá.".
  - Đã có đánh giá: hiện số sao, ngày viết, nhận xét và nút "Sửa đánh giá". Bấm thì khối đổi thành biểu mẫu điền sẵn, có nút "Cập nhật đánh giá" và "Hủy".
  - Đánh giá đã bị admin ẩn: hiện đánh giá kèm dòng "Đánh giá này đã bị ẩn khỏi trang khóa học.", không có nút sửa.
- Khách thấy dòng "Đăng nhập và mua khóa học để viết đánh giá."; học viên chưa mua thấy "Mua khóa học này để viết đánh giá.". Người cung cấp và admin không thấy khối này.
- Máy chủ kiểm lại quyền học và điều kiện đã học xong ít nhất 1 bài. Mỗi học viên mỗi khóa một đánh giá (danh_gia không trùng id_hoc_vien và id_khoa_hoc): chưa có thì thêm, có rồi thì chỉ sửa, không xóa được. Sửa không đổi ngay_tao (ngày hiển thị là ngày viết lần đầu, thứ tự theo ngày này).
- Khóa đang 'Bị ẩn' mà học viên còn quyền học thì vẫn viết và sửa được.
- Học viên được hoàn tiền rồi mua lại: đánh giá cũ hiện lại và sửa được.
- Nhận xét để trống thì lưu NULL; tối đa 1000 ký tự.

## 16.6 Báo cáo đánh giá
- Bấm "Báo cáo" mở hộp "Báo cáo đánh giá này?", dòng "Chọn lý do để quản trị viên xem xét đánh giá này.", ba lý do (nút tròn): "Ngôn từ phản cảm", "Quảng cáo hoặc spam", "Lý do khác"; ô "Ghi chú" "Không bắt buộc" đếm "0/500"; nút "Hủy" và "Gửi báo cáo". Chưa chọn lý do thì báo "Hãy chọn lý do báo cáo".
- Máy chủ kiểm: học viên có quyền học khóa đó, không phải đánh giá của chính mình, chưa từng báo cáo đánh giá này (bao_cao_danh_gia không trùng id_hoc_vien và id_danh_gia, kể cả phiếu đã xử lý), đánh giá đang hợp lệ.
- Lưu phiếu: bien_phap_xu_ly NULL ("Chưa xử lý"), chụp so_sao_luc_bao_cao và nhan_xet_luc_bao_cao bằng nội dung đánh giá lúc đó. Gửi xong đóng hộp, nút đổi thành "Đã báo cáo", ô thông báo nhỏ "Đã gửi báo cáo. Cảm ơn bạn.".
- Người viết đánh giá không biết ai báo cáo và không được thông báo.

## 16.7 Báo cáo khóa học vi phạm
- Chỉ học viên có quyền học thấy các ô tích và khối "Thấy nội dung vi phạm?". Khách, học viên chưa mua, người cung cấp, admin không có.
- Ở danh sách "Nội dung khóa học" của trang chi tiết: ô đầu "Phần giới thiệu khóa học (tên, mô tả, ảnh bìa)", sau đó mỗi bài một ô.
- Ô bị mờ khi: học viên đang có phiếu chờ xử lý ở đúng mục đó (kèm dòng "Bạn đã báo cáo, đang chờ xử lý"); hoặc là ô phần giới thiệu khi khóa đang 'Bị ẩn'.
- Khối "Thấy nội dung vi phạm?": dòng "Tích chọn phần giới thiệu khóa học hoặc một hay nhiều bài học ở trên, chọn lý do rồi gửi báo cáo để quản trị viên xem xét.", bốn lý do (nút tròn) "Nội dung phản cảm", "Vi phạm bản quyền", "Lừa đảo hoặc mô tả sai nội dung", "Lý do khác", ô ghi chú (tối đa 500 ký tự, bắt buộc khi chọn "Lý do khác"), nút "Báo cáo vi phạm".
- Lỗi (màn thiet_ke/danh_gia_bao_cao/bao_cao_loi.html): chưa tích ô nào "Hãy chọn ít nhất một mục để báo cáo"; chưa chọn lý do "Hãy chọn lý do báo cáo"; chọn "Lý do khác" mà không ghi chú "Vui lòng ghi chú khi chọn Lý do khác".
- Gửi thành công: mỗi ô đã tích tạo một phiếu bao_cao_khoa_hoc (ô phần giới thiệu ghi id_khoa_hoc, ô bài ghi id_bai_hoc, đúng một trong hai cột có giá trị), cùng lý do và ghi chú, bien_phap_xu_ly NULL. Hiện dòng "Đã gửi báo cáo. Cảm ơn bạn." trong khối, bỏ tích, các ô vừa báo cáo thành mờ.
- Mỗi học viên ở mỗi mục chỉ có một phiếu đang chờ (hai cột tự tính bai_hoc_dang_cho_xu_ly, khoa_hoc_dang_cho_xu_ly có ràng buộc không trùng). Admin xử lý xong thì báo cáo lại được.
- Liên kết "Báo cáo bài học này" ở trang học (Phần 14) mở hộp "Báo cáo bài học này?": bốn lý do như trên, ô ghi chú (bắt buộc khi "Lý do khác", tối đa 500 ký tự), nút "Hủy" và "Gửi báo cáo"; lỗi và quy tắc như trên. Gửi xong ô thông báo nhỏ "Đã gửi báo cáo. Cảm ơn bạn." và liên kết thành chữ mờ "Bạn đã báo cáo, đang chờ xử lý".
- Khóa 'Bị gỡ vĩnh viễn' hoặc người cung cấp bị khóa: học viên không mở được khóa nên không báo cáo được.
- Người cung cấp không biết ai báo cáo. Học viên không nhận kết quả xử lý. Không gửi email hay thông báo.

## 16.8 Đường xử lý ở máy chủ
- GET /api/khoa-hoc/:id/danh-gia?tu=3&so=10: danh sách đánh giá hợp lệ (để tải thêm), mỗi dòng kèm cờ "đã báo cáo" và "là của tôi".
- PUT /api/khoa-hoc/:id/danh-gia-cua-toi: nhận { so_sao, nhan_xet }. Thêm hoặc sửa. Chỉ học viên.
- POST /api/danh-gia/:id/bao-cao: nhận { ly_do, ghi_chu }.
- POST /api/khoa-hoc/:id/bao-cao: nhận { gioi_thieu: true | false, bai: [id…], ly_do, ghi_chu }. Kiểm từng bài thuộc khóa, chưa xóa, không có phiếu chờ của học viên; kiểm khóa không 'Bị ẩn' nếu có phần giới thiệu. Thêm mọi phiếu trong một giao dịch.
- Dữ liệu điểm trung bình, phân bố sao, đánh giá của tôi, các mục đang có phiếu chờ của tôi được trả kèm GET /api/khoa-hoc/:id (Phần 11).

## 16.9 Bảng dữ liệu dùng
- danh_gia, bao_cao_danh_gia, bao_cao_khoa_hoc, tien_do_hoc (đã học xong bài nào), don_hang, chi_tiet_don_hang, nguoi_dung.

## 16.10 Câu thông báo
- "Hãy chọn số sao trước khi gửi", "Hãy học xong ít nhất 1 bài để viết đánh giá.", "Đăng nhập và mua khóa học để viết đánh giá.", "Mua khóa học này để viết đánh giá."
- "Đã gửi đánh giá", "Đã cập nhật đánh giá" (ô thông báo nhỏ)
- "Đánh giá này đã bị ẩn khỏi trang khóa học."
- "Hãy chọn lý do báo cáo", "Hãy chọn ít nhất một mục để báo cáo", "Vui lòng ghi chú khi chọn Lý do khác"
- "Đã gửi báo cáo. Cảm ơn bạn.", "Bạn đã báo cáo, đang chờ xử lý", "Đã báo cáo"
- "Chưa có đánh giá"

## 16.11 Kiểm tra khi làm xong
- Học viên chưa học xong bài nào gọi thẳng API viết đánh giá: bị từ chối.
- Admin hoàn tiền khóa cho học viên: đánh giá của học viên đó biến khỏi trang công khai và điểm trung bình tính lại; cột bi_an vẫn 0.
- Học viên báo cáo một đánh giá, admin xử lý xong: nút vẫn là "Đã báo cáo", gọi thẳng API báo cáo lần hai bị từ chối.
- Tích phần giới thiệu và 2 bài rồi gửi: có 3 phiếu. Gửi lại cùng bài khi phiếu còn chờ: bị từ chối.
- Khóa đang bị ẩn: ô phần giới thiệu mờ, các ô bài vẫn tích được.
- Danh sách kiểm thử đầy đủ: docs/kiem_thu/phan_16_danh_gia_bao_cao.md
