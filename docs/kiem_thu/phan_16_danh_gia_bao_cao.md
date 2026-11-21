# Danh sách kiểm thử Phần 16. Đánh giá, báo cáo đánh giá, báo cáo khóa học

- Đặc tả: docs/dac_ta/phan_16_danh_gia_bao_cao.md
- Code kiểm thử tự động: backend/tests/phan_16_danh_gia_bao_cao.test.js
- Cách kiểm: "Tự động" là Claude Code viết code kiểm thử và chạy bằng npm test; "Bấm tay" là người dùng mở web và làm theo các bước.
- Dữ liệu chung: khóa K1 'Đang bán' 4 bài của "ncc01"; học viên "hvA" (đã mua, đã học xong bài 1), "hvB" (đã mua, chưa học xong bài nào), "hvC" (đã mua, đã học xong 1 bài), "hvchua" (chưa mua); admin.

## P16-01 Viết đánh giá lần đầu
- Mục tiêu: thêm đánh giá khi đủ điều kiện.
- Dữ liệu: hvA gửi { so_sao 5, nhan_xet "Rất hay" }.
- Các bước: gọi PUT /api/khoa-hoc/<K1>/danh-gia-cua-toi.
- Kết quả mong đợi: thêm một dòng danh_gia, bi_an 0, có ngay_tao.
- Cách kiểm: Tự động
- Nguồn: Phần 16 mục 16.5, 16.8

## P16-02 Sửa đánh giá
- Mục tiêu: chỉ sửa, không thêm dòng, không đổi ngay_tao.
- Dữ liệu: hvA gửi { so_sao 4, nhan_xet "" }.
- Các bước: gọi lại PUT.
- Kết quả mong đợi: vẫn một dòng, so_sao 4, nhan_xet NULL, ngay_tao giữ nguyên.
- Cách kiểm: Tự động
- Nguồn: Phần 16 mục 16.5

## P16-03 Không đủ điều kiện viết đánh giá
- Mục tiêu: máy chủ kiểm quyền học và đã học xong ít nhất 1 bài.
- Dữ liệu: hvB; hvchua; ncc01; admin.
- Các bước: gọi PUT với so_sao 5.
- Kết quả mong đợi: đều bị từ chối, không thêm dòng.
- Cách kiểm: Tự động
- Nguồn: Phần 16 mục 16.5, 16.11

## P16-04 Số sao và nhận xét sai
- Mục tiêu: kiểm dữ liệu.
- Dữ liệu: so_sao 0, 6, thiếu; nhận xét 1001 ký tự.
- Các bước: hvA gọi PUT.
- Kết quả mong đợi: thiếu sao báo "Hãy chọn số sao trước khi gửi"; 0, 6 và nhận xét quá 1000 ký tự bị từ chối.
- Cách kiểm: Tự động
- Nguồn: Phần 16 mục 16.5, 16.10

## P16-05 Đánh giá hợp lệ và điểm trung bình
- Mục tiêu: chỉ tính đánh giá đủ bốn điều.
- Dữ liệu: đánh giá 5 sao của hvA; 3 sao của hvC; 1 sao của học viên đã hoàn tiền; 2 sao bi_an 1; 4 sao của học viên bị khóa tài khoản.
- Các bước: gọi GET /api/khoa-hoc/<K1> và GET /api/khoa-hoc/<K1>/danh-gia.
- Kết quả mong đợi: điểm trung bình 4,0 từ 2 đánh giá; phân bố 5 sao 50%, 3 sao 50%, còn lại 0%; danh sách chỉ có 2 đánh giá; bảng danh_gia không đổi (bi_an của đánh giá hoàn tiền và bị khóa vẫn 0).
- Cách kiểm: Tự động
- Nguồn: Phần 16 mục 16.3, 16.4, 16.11

## P16-06 Đánh giá hiện lại
- Mục tiêu: mở khóa tài khoản hoặc mua lại thì đánh giá hiện lại.
- Dữ liệu: đánh giá của học viên bị khóa ở P16-05; học viên đã hoàn tiền mua lại K1.
- Các bước: mở khóa tài khoản; tạo đơn 'Đã thanh toán' mới cho người đã hoàn tiền; đọc danh sách; người mua lại sửa đánh giá.
- Kết quả mong đợi: hai đánh giá hiện lại; người mua lại sửa được đánh giá cũ.
- Cách kiểm: Tự động
- Nguồn: Phần 16 mục 16.4, 16.5

## P16-07 Khóa bị gỡ không tính đánh giá
- Mục tiêu: khóa 'Bị gỡ vĩnh viễn' không có đánh giá hợp lệ.
- Dữ liệu: K1 bị gỡ.
- Các bước: admin gọi GET /api/khoa-hoc/<K1>.
- Kết quả mong đợi: không có đánh giá hợp lệ nào.
- Cách kiểm: Tự động
- Nguồn: Phần 16 mục 16.4

## P16-08 Tải thêm đánh giá và cờ của người xem
- Mục tiêu: phân trang 3 rồi 10, mới nhất trên, cờ "đã báo cáo" và "là của tôi".
- Dữ liệu: 15 đánh giá hợp lệ; hvA đã báo cáo một đánh giá.
- Các bước: gọi GET /api/khoa-hoc/<K1>/danh-gia?tu=3&so=10 bằng hvA.
- Kết quả mong đợi: 10 đánh giá kế tiếp theo ngày viết giảm dần; đánh giá hvA đã báo cáo có cờ đã báo cáo; đánh giá của hvA có cờ là của tôi; tên trống hiện "Học viên AVA".
- Cách kiểm: Tự động
- Nguồn: Phần 16 mục 16.3, 16.8; Phần chung C10, C16

## P16-09 Báo cáo đánh giá
- Mục tiêu: lưu phiếu và chụp nội dung lúc báo cáo.
- Dữ liệu: hvC báo cáo đánh giá của hvA (4 sao, nhận xét X) với ly_do "Quảng cáo hoặc spam".
- Các bước: gọi POST /api/danh-gia/<id>/bao-cao.
- Kết quả mong đợi: một dòng bao_cao_danh_gia, bien_phap_xu_ly NULL, so_sao_luc_bao_cao 4, nhan_xet_luc_bao_cao X.
- Cách kiểm: Tự động
- Nguồn: Phần 16 mục 16.6

## P16-10 Báo cáo đánh giá bị từ chối
- Mục tiêu: các điều kiện ở 16.6.
- Dữ liệu: hvC báo cáo lại cùng đánh giá (kể cả sau khi admin đã xử lý); hvA báo cáo đánh giá của chính mình; hvchua báo cáo; báo cáo đánh giá đang bị ẩn; không có lý do; lý do lạ.
- Các bước: gọi POST /api/danh-gia/<id>/bao-cao.
- Kết quả mong đợi: đều bị từ chối; không có lý do báo "Hãy chọn lý do báo cáo".
- Cách kiểm: Tự động
- Nguồn: Phần 16 mục 16.6, 16.10, 16.11

## P16-11 Báo cáo khóa học nhiều mục
- Mục tiêu: mỗi mục một phiếu, trong một giao dịch.
- Dữ liệu: hvA gửi { gioi_thieu: true, bai: [bài 2, bài 3], ly_do "Vi phạm bản quyền", ghi_chu "" }.
- Các bước: gọi POST /api/khoa-hoc/<K1>/bao-cao.
- Kết quả mong đợi: 3 dòng bao_cao_khoa_hoc: một dòng chỉ có id_khoa_hoc, hai dòng chỉ có id_bai_hoc; cùng lý do; bien_phap_xu_ly NULL.
- Cách kiểm: Tự động
- Nguồn: Phần 16 mục 16.7, 16.8, 16.11

## P16-12 Báo cáo khóa học bị từ chối
- Mục tiêu: kiểm điều kiện.
- Dữ liệu: gửi lại bài 2 khi phiếu còn chờ; không tích mục nào; không chọn lý do; "Lý do khác" không ghi chú; ghi chú 501 ký tự; bài thuộc khóa khác; bài đã xóa; phần giới thiệu khi K1 đang 'Bị ẩn'; hvchua gửi.
- Các bước: gọi POST /api/khoa-hoc/<K1>/bao-cao.
- Kết quả mong đợi: đều bị từ chối, không thêm phiếu nào (kể cả các mục hợp lệ đi kèm trong cùng lần gửi); câu "Hãy chọn ít nhất một mục để báo cáo", "Hãy chọn lý do báo cáo", "Vui lòng ghi chú khi chọn Lý do khác" ở đúng trường hợp.
- Cách kiểm: Tự động
- Nguồn: Phần 16 mục 16.7, 16.8, 16.10, 16.11

## P16-13 Báo cáo lại sau khi admin xử lý
- Mục tiêu: phiếu cũ đã xử lý thì gửi phiếu mới được.
- Dữ liệu: phiếu bài 2 của hvA có bien_phap_xu_ly 'Không vi phạm'.
- Các bước: hvA báo cáo lại bài 2.
- Kết quả mong đợi: thêm phiếu mới.
- Cách kiểm: Tự động
- Nguồn: Phần 16 mục 16.7

## P16-14 Khối đánh giá trên trang
- Mục tiêu: giao diện đúng theo người xem.
- Dữ liệu: K1 có 5 đánh giá; một khóa chưa có đánh giá.
- Các bước: mở trang chi tiết bằng khách, hvchua, hvB, hvA, ncc01; bấm "Xem thêm đánh giá"; hvA bấm "Sửa đánh giá" rồi "Hủy"; admin ẩn đánh giá của hvA rồi hvA xem lại.
- Kết quả mong đợi: điểm trung bình một chữ số thập phân dạng 4,7, "N đánh giá", năm thanh sao; khóa chưa có đánh giá hiện "Chưa có đánh giá" và ẩn phân bố; "Hiển thị 3 trên 5 đánh giá" và nút tải thêm; khách thấy "Đăng nhập và mua khóa học để viết đánh giá."; hvchua thấy "Mua khóa học này để viết đánh giá."; hvB thấy "Hãy học xong ít nhất 1 bài để viết đánh giá."; hvA thấy đánh giá của mình và "Sửa đánh giá"; ncc01 không có khối này; đánh giá bị ẩn hiện "Đánh giá này đã bị ẩn khỏi trang khóa học." không có nút sửa; ô thông báo "Đã gửi đánh giá", "Đã cập nhật đánh giá"; giống thiet_ke/danh_gia_bao_cao/da_mua_da_danh_gia.html.
- Cách kiểm: Bấm tay
- Nguồn: Phần 16 mục 16.3, 16.5, 16.10

## P16-15 Hộp báo cáo đánh giá
- Mục tiêu: giao diện và kết quả.
- Dữ liệu: hvC.
- Các bước: bấm "Báo cáo" dưới đánh giá của hvA; bấm gửi khi chưa chọn lý do; chọn lý do rồi gửi.
- Kết quả mong đợi: hộp "Báo cáo đánh giá này?" với dòng "Chọn lý do để quản trị viên xem xét đánh giá này.", ba lý do, ô "Ghi chú" đếm "0/500"; lỗi "Hãy chọn lý do báo cáo"; gửi xong nút thành "Đã báo cáo", ô thông báo "Đã gửi báo cáo. Cảm ơn bạn."; không có nút "Báo cáo" dưới đánh giá của chính mình; giống thiet_ke/danh_gia_bao_cao/bao_cao_danh_gia.html.
- Cách kiểm: Bấm tay
- Nguồn: Phần 16 mục 16.3, 16.6, 16.10

## P16-16 Khối báo cáo khóa học và báo cáo ở trang học
- Mục tiêu: ô tích, lỗi, trạng thái mờ.
- Dữ liệu: hvA; K1 đang bán rồi bị ẩn.
- Các bước: ở trang chi tiết bấm "Báo cáo vi phạm" khi chưa tích; tích phần giới thiệu và 2 bài, chọn "Lý do khác" không ghi chú; ghi chú rồi gửi; cho K1 bị ẩn rồi xem lại; ở trang học bấm "Báo cáo bài học này".
- Kết quả mong đợi: ô đầu "Phần giới thiệu khóa học (tên, mô tả, ảnh bìa)"; lỗi như thiet_ke/danh_gia_bao_cao/bao_cao_loi.html; gửi xong dòng "Đã gửi báo cáo. Cảm ơn bạn." trong khối, các ô vừa báo cáo mờ kèm "Bạn đã báo cáo, đang chờ xử lý"; khóa bị ẩn thì ô phần giới thiệu mờ, ô bài vẫn tích được; hộp "Báo cáo bài học này?" ở trang học, gửi xong liên kết thành chữ mờ "Bạn đã báo cáo, đang chờ xử lý"; khách, hvchua, người cung cấp, admin không thấy khối báo cáo.
- Cách kiểm: Bấm tay
- Nguồn: Phần 16 mục 16.7, 16.10, 16.11
