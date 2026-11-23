# PHẦN 18. THÔNG BÁO (CHUÔNG CỦA NGƯỜI CUNG CẤP)

Làm sau Phần 17. Các thông báo được tạo ở Phần 19, 21, 23; phần này làm chuông, danh sách, đánh dấu đã đọc và một hàm tạo thông báo dùng chung.

## 18.1 Mục đích và ai dùng
- Chỉ người cung cấp có chuông và nhận thông báo. Học viên và admin không có.

## 18.2 Màn thiết kế
- thiet_ke/thong_bao/co_thong_bao_moi.html (màn "Hồ sơ người cung cấp - Có thông báo mới"): chuông có số thông báo chưa đọc.
- thiet_ke/thong_bao/mo_bang_thong_bao.html (màn "Hồ sơ người cung cấp - Mở bảng thông báo"): bảng thông báo đang mở.
- thiet_ke/thong_bao/chua_co_thong_bao.html (màn "Hồ sơ người cung cấp - Chưa có thông báo"): chưa có thông báo nào.
- thiet_ke/thong_bao/tat_ca_thong_bao.html (màn "Thông báo - Tất cả thông báo"): trang xem tất cả thông báo.

## 18.3 Giao diện và hành vi
- Chuông ở đầu trang của người cung cấp (mọi trang công khai và trang hồ sơ), số tròn là số thông báo chưa đọc, bằng 0 thì không hiện số. Số được lấy lại mỗi lần chuyển trang.
- Bấm chuông mở bảng "Thông báo": nút "Đánh dấu tất cả đã đọc" (mờ khi không có thông báo chưa đọc), 5 thông báo mới nhất (thông báo chưa đọc có nền khác như thiết kế), mỗi thông báo hiện nội dung đã lưu (phần đầu "Khóa học “Tên”" hay "Yêu cầu rút tiền 500.000đ" in như thiết kế) và thời điểm tương đối ("5 phút trước", "2 giờ trước", "Hôm qua", "3 ngày trước", quá 7 ngày thì hiện ngày). Cuối bảng "Hiển thị 5 thông báo gần nhất" và liên kết "Xem tất cả thông báo →" mở /thong-bao. Chưa có thông báo: "Chưa có thông báo nào." và không có liên kết.
- Bấm một thông báo: thông báo đó thành đã đọc, rồi mở trang liên quan: thông báo về khóa học mở /nguoi-cung-cap/khoa-hoc/:id (khóa bị gỡ vĩnh viễn thì trang quản lý ở chế độ chỉ xem, Phần 8); thông báo về rút tiền mở /ho-so#rut-tien.
- "Đánh dấu tất cả đã đọc": mọi thông báo của người đó thành đã đọc, số trên chuông biến mất.
- Trang "Thông báo" (/thong-bao, chỉ người cung cấp; có đầu trang và chân trang): tiêu đề "Thông báo", dòng "Mới nhất ở trên", nút "Đánh dấu tất cả đã đọc" (mờ khi không có thông báo chưa đọc); mọi thông báo của chính người cung cấp, mỗi thông báo hiện như trong bảng chuông (nội dung đã lưu, thời điểm tương đối, thông báo chưa đọc có nền khác); 10 thông báo mỗi trang, dòng "Hiển thị 1-10 trên N thông báo", nút "‹ Trước", số trang, "Sau ›". Bấm một thông báo hoặc "Đánh dấu tất cả đã đọc" xử lý giống ở bảng chuông. Chưa có thông báo: "Chưa có thông báo nào.". Khách mở /thong-bao thì chuyển sang trang đăng nhập; học viên và admin thấy trang 403.

## 18.4 Bốn loại thông báo và nội dung (lưu thành câu hoàn chỉnh ngay lúc tạo, không sửa, không xóa)
| loai | Khi nào | Nội dung lưu |
| --- | --- | --- |
| 'Khóa học bị ẩn' (admin ẩn) | Admin bấm "Ẩn khóa học" và đây là lần ẩn được tính thứ nhất | Khóa học “Tên khóa” đã bị quản trị viên ẩn. Lý do: <lý do>. Nếu bị ẩn thêm 1 lần nữa, khóa học sẽ bị gỡ vĩnh viễn. |
| 'Khóa học bị ẩn' (hệ thống) | Khóa tài khoản người cung cấp, khóa đang bán chưa từng bị ẩn được tính | Khóa học “Tên khóa” đã bị ẩn do tài khoản bị khóa. Lý do: Tài khoản bị khóa. Nếu bị ẩn thêm 1 lần nữa, khóa học sẽ bị gỡ vĩnh viễn. |
| 'Khóa học bị gỡ vĩnh viễn' | Admin bấm "Gỡ vĩnh viễn", hoặc lần ẩn được tính thứ hai (do admin hay do khóa tài khoản) | Khóa học “Tên khóa” đã bị gỡ vĩnh viễn. Lý do: <lý do>. |
| 'Đã chuyển tiền' | Admin bấm "Đã chuyển" | Yêu cầu rút tiền 500.000đ đã được chuyển. Mã giao dịch: <mã>. (không có mã thì dừng ở "đã được chuyển.") |
| 'Từ chối rút tiền' | Admin bấm "Từ chối", hoặc yêu cầu tự bị từ chối khi khóa tài khoản | Yêu cầu rút tiền 500.000đ bị từ chối. Lý do: <lý do>. |

- Lý do người dùng gõ đã có dấu chấm ở cuối thì không thêm dấu chấm nữa.
- Thông báo về khóa học ghi id_khoa_hoc; thông báo về rút tiền ghi id_yeu_cau_rut_tien (mỗi yêu cầu chỉ có một thông báo).
- Lần ẩn thứ hai làm khóa bị gỡ thì chỉ tạo một thông báo 'Khóa học bị gỡ vĩnh viễn' (lý do là lý do admin vừa gõ; với khóa tài khoản là "Khóa học bị ẩn lần thứ 2 nên bị gỡ vĩnh viễn").
- Không tạo thông báo khi: người cung cấp tự ẩn, mở khóa tài khoản, có người mua, đánh giá mới, báo cáo mới. Thông báo không ghi tên người báo cáo.
- Hàm dùng chung tao_thong_bao(ket_noi, id_nguoi_cung_cap, loai, id_khoa_hoc hoặc id_yeu_cau, noi_dung) chạy trong cùng giao dịch với việc gây ra thông báo.

## 18.5 Đường xử lý ở máy chủ (chỉ người cung cấp, chỉ thông báo của chính mình)
- GET /api/thong-bao: số chưa đọc và 5 thông báo mới nhất.
- GET /api/thong-bao/tat-ca?trang=: số chưa đọc, tổng số thông báo và 10 thông báo của trang đó, mới nhất ở trên.
- POST /api/thong-bao/:id/da-doc: đánh dấu một thông báo đã đọc, trả đường dẫn cần mở.
- POST /api/thong-bao/da-doc-tat-ca.

## 18.6 Bảng dữ liệu dùng
- thong_bao (loai, id_khoa_hoc, id_yeu_cau_rut_tien, noi_dung, da_doc, ngay_tao).

## 18.7 Câu thông báo
- "Chưa có thông báo nào.", "Hiển thị 5 thông báo gần nhất", "Đánh dấu tất cả đã đọc", "Xem tất cả thông báo →", "Mới nhất ở trên", "Hiển thị 1-10 trên N thông báo"

## 18.8 Kiểm tra khi làm xong
- Admin ẩn khóa: chuông người cung cấp tăng 1, nội dung đúng mẫu, bấm vào mở trang quản lý khóa đó và số giảm.
- Có 7 thông báo: bảng chỉ hiện 5 cái mới nhất.
- Người cung cấp A gọi API đánh dấu đã đọc thông báo của người cung cấp B: 404.
- Có 12 thông báo: /thong-bao trang 1 có 10 thông báo, trang 2 có 2; học viên mở /thong-bao thấy trang 403.
- Danh sách kiểm thử đầy đủ: docs/kiem_thu/phan_18_thong_bao.md
