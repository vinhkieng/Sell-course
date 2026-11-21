# Danh sách kiểm thử Phần 14. Trang học và tiến độ

- Đặc tả: docs/dac_ta/phan_14_trang_hoc.md
- Code kiểm thử tự động: backend/tests/phan_14_trang_hoc.test.js
- Cách kiểm: "Tự động" là Claude Code viết code kiểm thử và chạy bằng npm test; "Bấm tay" là người dùng mở web và làm theo các bước.
- Dữ liệu chung: khóa K1 của "ncc01" có 5 bài: 1 video 600 giây, 2 tài liệu PDF, 3 video 300 giây, 4 trắc nghiệm, 5 video; học viên "hvmua" đã mua K1; "hvchua" chưa mua; người cung cấp khác "ncc02"; admin. File video và PDF giả có sẵn trong luu_tru của kiểm thử.

## P14-01 Vào học lần đầu và lần sau
- Mục tiêu: chưa mở bài nào thì bài 1; đã mở thì bài mở gần nhất, bỏ qua bài đã xóa.
- Dữ liệu: hvmua chưa mở bài nào; sau đó mở bài 3 rồi bài 2; sau đó bài 2 bị xóa.
- Các bước: gọi GET /api/khoa-hoc/<K1>/vao-hoc ở ba thời điểm.
- Kết quả mong đợi: lần một bài 1; lần hai bài 2; lần ba bài 3.
- Cách kiểm: Tự động
- Nguồn: Phần 14 mục 14.3, 14.8

## P14-02 Quyền mở bài theo người xem
- Mục tiêu: máy chủ xét quyền mỗi lần mở bài.
- Dữ liệu: bài 1 và bài 3 của K1.
- Các bước: gọi GET /api/khoa-hoc/<K1>/hoc/<bài> bằng hvmua, admin, ncc01, khách, hvchua, ncc02.
- Kết quả mong đợi: hvmua mở được mọi bài ở chế độ đầy đủ; admin và ncc01 mở được mọi bài ở chế độ chủ khóa hoặc admin; khách, hvchua, ncc02 mở được bài 1 ở chế độ học thử, bài 3 bị từ chối (trang đưa về trang chi tiết với "Bạn cần mua khóa học này để vào học."); thông tin bài không có đường dẫn file.
- Cách kiểm: Tự động
- Nguồn: Phần 14 mục 14.3, 14.8

## P14-03 Khóa bị ẩn, bị gỡ, người cung cấp bị khóa
- Mục tiêu: xử lý đúng từng trường hợp.
- Dữ liệu: K1 'Bị ẩn'; K1 'Bị gỡ vĩnh viễn'; ncc01 bị khóa tài khoản.
- Các bước: hvmua, ncc01, admin mở bài 3 trong từng trường hợp.
- Kết quả mong đợi: bị ẩn: hvmua học bình thường; bị gỡ: hvmua nhận { khong_kha_dung: true }, ncc01 nhận 404, admin mở được; người cung cấp bị khóa: hvmua nhận { khong_kha_dung: true }.
- Cách kiểm: Tự động
- Nguồn: Phần 14 mục 14.3, 14.11

## P14-04 Bài đã xóa hoặc không thuộc khóa
- Mục tiêu: trả 404.
- Dữ liệu: bài đã xóa của K1; bài của khóa khác.
- Các bước: hvmua gọi GET /api/khoa-hoc/<K1>/hoc/<bài>.
- Kết quả mong đợi: 404.
- Cách kiểm: Tự động
- Nguồn: Phần 14 mục 14.3

## P14-05 Phát video theo từng đoạn
- Mục tiêu: trả 206 khi có tiêu đề Range.
- Dữ liệu: bài 1, hvmua.
- Các bước: gọi GET /api/bai-hoc/<bài 1>/video với Range: bytes=0-99.
- Kết quả mong đợi: 206, Content-Range đúng, 100 byte; không có đường dẫn file trong phản hồi.
- Cách kiểm: Tự động
- Nguồn: Phần 14 mục 14.6; Phần chung C12

## P14-06 Phát file khi không có quyền
- Mục tiêu: trả 404, không trả 403.
- Dữ liệu: bài 3 video, bài 2 tài liệu.
- Các bước: khách và hvchua gọi GET /api/bai-hoc/<bài 3>/video và /api/bai-hoc/<bài 2>/tai-lieu; ncc01 gọi video của K1 khi K1 bị gỡ.
- Kết quả mong đợi: đều 404. Khách gọi video bài 1 (học thử) thì nhận được.
- Cách kiểm: Tự động
- Nguồn: Phần 14 mục 14.6, 14.11

## P14-07 Tải tài liệu với tên file gốc
- Mục tiêu: xem trong trang và tải về.
- Dữ liệu: bài 2, ten_file "Bai giang CSS.pdf".
- Các bước: hvmua gọi GET /api/bai-hoc/<bài 2>/tai-lieu; gọi lại với ?tai_ve=1.
- Kết quả mong đợi: lần một trả PDF để xem; lần hai có tiêu đề tải về (Content-Disposition attachment) với tên "Bai giang CSS.pdf".
- Cách kiểm: Tự động
- Nguồn: Phần 14 mục 14.6

## P14-08 Mở bài ghi tiến độ
- Mục tiêu: ghi lan_mo_gan_nhat; bài tài liệu xong ngay khi mở.
- Dữ liệu: hvmua mở bài 2 (tài liệu) và bài 1 (video).
- Các bước: gọi GET /api/khoa-hoc/<K1>/hoc/<bài>.
- Kết quả mong đợi: hai dòng tien_do_hoc có lan_mo_gan_nhat; bài 2 da_hoc_xong 1; bài 1 da_hoc_xong 0.
- Cách kiểm: Tự động
- Nguồn: Phần 14 mục 14.5, 14.11

## P14-09 Chủ khóa, admin, học thử không tạo tiến độ
- Mục tiêu: không có dòng tien_do_hoc.
- Dữ liệu: ncc01, admin mở bài 2; hvchua mở bài 1.
- Các bước: gọi GET /api/khoa-hoc/<K1>/hoc/<bài>; gọi POST /api/bai-hoc/<bài 1>/vi-tri bằng hvchua.
- Kết quả mong đợi: không có dòng tien_do_hoc nào của họ; POST vi-tri của hvchua bị từ chối.
- Cách kiểm: Tự động
- Nguồn: Phần 14 mục 14.1, 14.5, 14.8, 14.11

## P14-10 Mốc xem liền mạch
- Mục tiêu: chỉ nâng mốc khi xem nối tiếp, cách không quá 15 giây.
- Dữ liệu: bài 1 dài 600 giây, mốc ban đầu NULL.
- Các bước: gửi vị trí 10, 20, 35 (cách 15), 60 (cách 25, tua tới), 30 (xem lại).
- Kết quả mong đợi: sau 10 mốc 10; sau 20 mốc 20; sau 35 mốc 35; sau 60 mốc vẫn 35, vi_tri_xem_cu 60; sau 30 mốc vẫn 35, vi_tri_xem_cu 30.
- Cách kiểm: Tự động
- Nguồn: Phần 14 mục 14.5

## P14-11 Học xong video khi mốc đạt 90%
- Mục tiêu: xem nối tiếp tới 90% thì xong; tua thẳng cuối thì chưa.
- Dữ liệu: bài 3 dài 300 giây.
- Các bước: gửi vị trí liên tục 10, 20, ..., 270; với một học viên khác gửi 10 rồi 295.
- Kết quả mong đợi: học viên thứ nhất da_hoc_xong 1 khi mốc đạt 270; học viên thứ hai chưa xong; đã xong thì gửi vị trí nhỏ hơn vẫn giữ xong.
- Cách kiểm: Tự động
- Nguồn: Phần 14 mục 14.5, 14.11

## P14-12 Tính tiến độ khóa
- Mục tiêu: làm tròn xuống, bài đã xóa không tính.
- Dữ liệu: khóa 24 bài, hvmua học xong 5 bài; sau đó xóa 1 bài đã xong và 1 bài chưa xong.
- Các bước: đọc tiến độ qua GET /api/khoa-hoc/:id (Phần 11) hoặc GET /api/hoc-vien/khoa-hoc-cua-toi.
- Kết quả mong đợi: lần một 20% (5/24); lần hai 4/22 là 18%.
- Cách kiểm: Tự động
- Nguồn: Phần 14 mục 14.5

## P14-13 Khóa học của tôi và tiến độ học
- Mục tiêu: hai danh sách đúng.
- Dữ liệu: hvmua có K1, K2 (mua sau), K3 bị gỡ, K4 đã hoàn tiền.
- Các bước: gọi GET /api/hoc-vien/khoa-hoc-cua-toi.
- Kết quả mong đợi: "Khóa học của tôi" có K2, K1, K3 (mua gần nhất ở trên), K3 đánh dấu không khả dụng, không có K4; "Tiến độ học" có K1, K2 (không có K3), mỗi khóa có x/y bài và phần trăm.
- Cách kiểm: Tự động
- Nguồn: Phần 14 mục 14.7

## P14-14 Người cung cấp được mở khóa, tiến độ còn
- Mục tiêu: học tiếp với tiến độ cũ.
- Dữ liệu: hvmua đã xong 2 bài của K1; ncc01 bị khóa rồi được mở khóa.
- Các bước: hvmua gọi vào học sau khi mở khóa.
- Kết quả mong đợi: mở được bài, tiến độ vẫn 2 bài xong.
- Cách kiểm: Tự động
- Nguồn: Phần 14 mục 14.7

## P14-15 Trang học video
- Mục tiêu: giao diện và phát tiếp.
- Dữ liệu: hvmua, K1.
- Các bước: bấm "Vào học"; xem video tới 3:45 rồi đóng trang; mở lại; bấm "Ẩn ›" rồi tải lại trang; bấm "Học bài tiếp theo →" và "← Bài trước".
- Kết quả mong đợi: đầu trang công khai, không có chân trang, "← Quay lại khóa học" và tên khóa; tua được; mở lại phát tiếp từ 3:45 và hiện "Lần trước bạn dừng ở 03:45"; dưới video có "01. <tên bài>", loại bài, "Báo cáo bài học này", khối "Bài tiếp theo"; cột phải có phần trăm, "Đã học x/y bài", dấu đã xong, "Đang xem", "Học đến đây"; "Ẩn ›" thu cột và nhớ sau khi tải lại; giống thiet_ke/trang_hoc/bai_video.html và bai_video_an_danh_sach.html.
- Cách kiểm: Bấm tay
- Nguồn: Phần 14 mục 14.4, 14.11

## P14-16 Trang học tài liệu
- Mục tiêu: xem PDF và tải về.
- Dữ liệu: bài 2.
- Các bước: mở bài 2; thu nhỏ, phóng to, chuyển trang; bấm "Tải về".
- Kết quả mong đợi: thanh công cụ có tên file, "PDF · N MB", phần trăm, "x / y" như thiet_ke/trang_hoc/bai_tai_lieu.html; tải về đúng tên file gốc; tiến độ tăng ngay.
- Cách kiểm: Bấm tay
- Nguồn: Phần 14 mục 14.4, 14.11

## P14-17 Học thử
- Mục tiêu: dải học thử và chặn bài khác.
- Dữ liệu: khách, hvchua, ncc02.
- Các bước: mở bài 1 của K1; bấm bài 3 trong danh sách; gõ thẳng /khoa-hoc/<K1>/hoc/<bài 3>.
- Kết quả mong đợi: khách và hvchua thấy dải "Bạn đang xem thử miễn phí bài đầu tiên. Mua khóa học để học toàn bộ 5 bài." kèm "Mua ngay", "Thêm vào giỏ hàng"; ncc02 chỉ thấy "Bạn đang xem thử miễn phí bài đầu tiên."; không có tiến độ và liên kết báo cáo; bấm bài 3 hiện dòng nhắc như Phần 11; gõ thẳng thì về trang chi tiết với "Bạn cần mua khóa học này để vào học."; giống thiet_ke/trang_hoc/bai_hoc_thu_chua_mua.html.
- Cách kiểm: Bấm tay
- Nguồn: Phần 14 mục 14.3, 14.4, 14.11

## P14-18 Khóa không khả dụng và trang hồ sơ
- Mục tiêu: trang không khả dụng và hai mục hồ sơ.
- Dữ liệu: K1 bị gỡ; một học viên chưa mua khóa nào.
- Các bước: hvmua bấm "Vào học" ở "Khóa học của tôi"; xem mục "Tiến độ học"; học viên chưa mua mở /ho-so#khoa-hoc-cua-toi.
- Kết quả mong đợi: trang "Khóa học không khả dụng", "Vui lòng liên hệ hỗ trợ nếu bạn cần được hỗ trợ.", nút "Về Khóa học của tôi"; K1 có nhãn "Không khả dụng" ở "Khóa học của tôi", không có ở "Tiến độ học"; học viên chưa mua thấy "Bạn chưa mua khóa học nào." và nút "Khám phá khóa học".
- Cách kiểm: Bấm tay
- Nguồn: Phần 14 mục 14.3, 14.7, 14.10, 14.11
