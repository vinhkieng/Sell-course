# Danh sách kiểm thử Phần 18. Thông báo của người cung cấp

- Đặc tả: docs/dac_ta/phan_18_thong_bao.md
- Code kiểm thử tự động: backend/tests/phan_18_thong_bao.test.js; hàm hiện thời điểm tương đối ở frontend kiểm bằng vitest.
- Cách kiểm: "Tự động" là Claude Code viết code kiểm thử và chạy bằng npm test; "Bấm tay" là người dùng mở web và làm theo các bước.
- Dữ liệu chung: người cung cấp "nccA" có khóa K1 và một yêu cầu rút tiền; "nccB"; học viên; admin.

## P18-01 Hàm tạo thông báo dùng chung
- Mục tiêu: ghi đúng các cột, chạy trong giao dịch của việc gây ra thông báo.
- Dữ liệu: gọi tao_thong_bao trong một giao dịch rồi hoàn tác giao dịch; gọi lại trong giao dịch được lưu.
- Các bước: đọc bảng thong_bao.
- Kết quả mong đợi: lần hoàn tác không có dòng nào; lần lưu có một dòng với loai, id_khoa_hoc (hoặc id_yeu_cau_rut_tien), noi_dung, da_doc 0.
- Cách kiểm: Tự động
- Nguồn: Phần 18 mục 18.4

## P18-02 Nội dung bốn loại thông báo
- Mục tiêu: câu lưu đúng mẫu; lý do có sẵn dấu chấm thì không thêm.
- Dữ liệu: ẩn K1 với lý do "Sai bản quyền"; ẩn K2 với lý do "Sai bản quyền." (có dấu chấm); hệ thống ẩn do khóa tài khoản; gỡ vĩnh viễn với lý do "Lừa đảo"; đã chuyển 500.000 có mã "FT123"; đã chuyển không có mã; từ chối 500.000 lý do "Sai tên chủ tài khoản".
- Các bước: tạo từng thông báo qua các thao tác của Phần 19, 21, 23 (hoặc gọi thẳng hàm dựng câu).
- Kết quả mong đợi: "Khóa học “<tên>” đã bị quản trị viên ẩn. Lý do: Sai bản quyền. Nếu bị ẩn thêm 1 lần nữa, khóa học sẽ bị gỡ vĩnh viễn." (cả hai lý do cho cùng một câu, không có hai dấu chấm); "Khóa học “<tên>” đã bị ẩn do tài khoản bị khóa. Lý do: Tài khoản bị khóa. Nếu bị ẩn thêm 1 lần nữa, khóa học sẽ bị gỡ vĩnh viễn."; "Khóa học “<tên>” đã bị gỡ vĩnh viễn. Lý do: Lừa đảo."; "Yêu cầu rút tiền 500.000đ đã được chuyển. Mã giao dịch: FT123."; "Yêu cầu rút tiền 500.000đ đã được chuyển."; "Yêu cầu rút tiền 500.000đ bị từ chối. Lý do: Sai tên chủ tài khoản."
- Cách kiểm: Tự động
- Nguồn: Phần 18 mục 18.4

## P18-03 Đọc thông báo
- Mục tiêu: số chưa đọc và 5 thông báo mới nhất.
- Dữ liệu: nccA có 7 thông báo, 4 chưa đọc.
- Các bước: gọi GET /api/thong-bao.
- Kết quả mong đợi: số chưa đọc 4; đúng 5 thông báo mới nhất, mới nhất ở trên.
- Cách kiểm: Tự động
- Nguồn: Phần 18 mục 18.3, 18.5, 18.8

## P18-04 Đánh dấu một thông báo đã đọc
- Mục tiêu: đổi da_doc và trả đường dẫn cần mở.
- Dữ liệu: một thông báo về K1; một thông báo về rút tiền.
- Các bước: gọi POST /api/thong-bao/:id/da-doc cho từng thông báo.
- Kết quả mong đợi: da_doc 1; đường dẫn /nguoi-cung-cap/khoa-hoc/<K1> và /ho-so#rut-tien.
- Cách kiểm: Tự động
- Nguồn: Phần 18 mục 18.3, 18.5

## P18-05 Đánh dấu tất cả đã đọc
- Mục tiêu: chỉ thông báo của chính người đó.
- Dữ liệu: nccA và nccB đều có thông báo chưa đọc.
- Các bước: nccA gọi POST /api/thong-bao/da-doc-tat-ca.
- Kết quả mong đợi: mọi thông báo của nccA da_doc 1; của nccB giữ nguyên.
- Cách kiểm: Tự động
- Nguồn: Phần 18 mục 18.3, 18.5

## P18-06 Thông báo của người khác và phân quyền
- Mục tiêu: không đọc hay đánh dấu thông báo của người khác.
- Dữ liệu: thông báo của nccB.
- Các bước: nccA gọi POST /api/thong-bao/<id của nccB>/da-doc; học viên và admin gọi GET /api/thong-bao.
- Kết quả mong đợi: nccA nhận 404; học viên và admin 403.
- Cách kiểm: Tự động
- Nguồn: Phần 18 mục 18.1, 18.5, 18.8

## P18-07 Những việc không tạo thông báo
- Mục tiêu: không tạo thông báo ngoài bốn loại.
- Dữ liệu: nccA tự ẩn K1; có người mua K1; có đánh giá mới; có báo cáo mới; nccA được mở khóa tài khoản.
- Các bước: làm lần lượt các việc trên.
- Kết quả mong đợi: bảng thong_bao không thêm dòng nào.
- Cách kiểm: Tự động
- Nguồn: Phần 18 mục 18.4

## P18-08 Hàm thời điểm tương đối
- Mục tiêu: hiện đúng kiểu.
- Dữ liệu: 5 phút trước; 2 giờ trước; hôm qua; 3 ngày trước; 8 ngày trước.
- Các bước: gọi hàm.
- Kết quả mong đợi: "5 phút trước", "2 giờ trước", "Hôm qua", "3 ngày trước", và ngày dạng dd/mm/yyyy cho 8 ngày trước.
- Cách kiểm: Tự động (vitest)
- Nguồn: Phần 18 mục 18.3; Phần chung C10

## P18-09 Chuông và bảng thông báo
- Mục tiêu: giao diện đúng thiết kế.
- Dữ liệu: nccA có 7 thông báo, có thông báo chưa đọc; một người cung cấp chưa có thông báo.
- Các bước: mở trang bất kỳ; bấm chuông; bấm một thông báo; mở lại chuông; bấm "Đánh dấu tất cả đã đọc".
- Kết quả mong đợi: số tròn là số chưa đọc, bằng 0 thì không hiện; bảng "Thông báo" có 5 thông báo, chưa đọc có nền khác, thời điểm tương đối, "Hiển thị 5 thông báo gần nhất"; bấm thông báo thì mở trang liên quan và số giảm; nút đánh dấu tất cả mờ khi không còn chưa đọc; người chưa có thông báo thấy "Chưa có thông báo nào."; giống các màn thiet_ke/thong_bao/; học viên và admin không có chuông.
- Cách kiểm: Bấm tay
- Nguồn: Phần 18 mục 18.3, 18.7, 18.8
