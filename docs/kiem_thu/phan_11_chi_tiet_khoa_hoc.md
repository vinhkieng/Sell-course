# Danh sách kiểm thử Phần 11. Chi tiết khóa học và ghi nhớ link giới thiệu

- Đặc tả: docs/dac_ta/phan_11_chi_tiet_khoa_hoc.md
- Code kiểm thử tự động: backend/tests/phan_11_chi_tiet_khoa_hoc.test.js
- Cách kiểm: "Tự động" là Claude Code viết code kiểm thử và chạy bằng npm test; "Bấm tay" là người dùng mở web và làm theo các bước.
- Dữ liệu chung: người cung cấp chủ khóa "ncc01" (mã giới thiệu MAINCC01), người cung cấp khác "ncc02"; học viên "hvmua" đã mua khóa K1, học viên "hvchua" chưa mua; admin. K1 'Đang bán' có 4 bài (bài 4 trắc nghiệm 5 câu, 15 phút); hvmua đã học xong bài 1 và có điểm bài 4 là 8.

## P11-01 Xem khóa đang bán theo từng người xem
- Mục tiêu: vai trò người xem và dữ liệu đúng.
- Dữ liệu: K1.
- Các bước: gọi GET /api/khoa-hoc/<K1> bằng khách, hvchua, hvmua, ncc02, ncc01, admin.
- Kết quả mong đợi: vai trò lần lượt khách, học viên chưa mua, học viên có quyền học, người cung cấp khác, chủ khóa, admin; danh sách bài chưa xóa không có đường dẫn file; hvmua có tiến độ (bài 1 xong, điểm cao nhất bài 4 là 8, số bài xong, phần trăm); người khác không có tiến độ; có điểm trung bình, phân bố sao, 3 đánh giá đầu, tối đa 4 khóa cùng danh mục (trừ K1, nhiều học viên nhất).
- Cách kiểm: Tự động
- Nguồn: Phần 11 mục 11.3, 11.6

## P11-02 Link chia sẻ theo người xem
- Mục tiêu: khách link thường, học viên và người cung cấp khác link kèm mã của chính mình, chủ khóa và admin không có.
- Dữ liệu: K1 đang bán; K1 khi bị ẩn (xem bằng hvmua).
- Các bước: gọi GET /api/khoa-hoc/<K1> bằng từng người.
- Kết quả mong đợi: khách <địa chỉ website>/khoa-hoc/<id>; hvchua và ncc02 <địa chỉ website>/khoa-hoc/<id>?ref=<mã của chính họ>; ncc01 và admin không có link; khóa bị ẩn không có link.
- Cách kiểm: Tự động
- Nguồn: Phần 11 mục 11.3

## P11-03 Ai xem được khóa bị ẩn
- Mục tiêu: chỉ chủ khóa, admin, học viên có quyền học.
- Dữ liệu: K1 chuyển 'Bị ẩn' (Admin ẩn).
- Các bước: gọi GET bằng khách, hvchua, ncc02, hvmua, ncc01, admin.
- Kết quả mong đợi: khách, hvchua, ncc02 nhận 404; hvmua, ncc01, admin xem được.
- Cách kiểm: Tự động
- Nguồn: Phần 11 mục 11.4, 11.9

## P11-04 Khóa bị gỡ vĩnh viễn
- Mục tiêu: học viên đã mua thấy "không khả dụng".
- Dữ liệu: K1 'Bị gỡ vĩnh viễn'.
- Các bước: gọi GET bằng hvmua, admin, ncc01, hvchua, khách.
- Kết quả mong đợi: hvmua nhận { khong_kha_dung: true }; admin và ncc01 xem được; hvchua và khách 404.
- Cách kiểm: Tự động
- Nguồn: Phần 11 mục 11.4

## P11-05 Khóa của người cung cấp bị khóa tài khoản
- Mục tiêu: học viên đã mua thấy "không khả dụng", admin xem được, người khác 404.
- Dữ liệu: ncc01 bị khóa tài khoản (khóa K1 vẫn 'Đang bán' trong dữ liệu thử).
- Các bước: gọi GET bằng hvmua, admin, hvchua.
- Kết quả mong đợi: hvmua { khong_kha_dung: true }; admin xem được; hvchua 404.
- Cách kiểm: Tự động
- Nguồn: Phần 11 mục 11.4

## P11-06 Khóa đã xóa
- Mục tiêu: không ai xem được.
- Dữ liệu: K1 da_xoa 1.
- Các bước: gọi GET bằng hvmua, ncc01, admin.
- Kết quả mong đợi: đều 404.
- Cách kiểm: Tự động
- Nguồn: Phần 11 mục 11.4

## P11-07 Ghi nhớ link giới thiệu
- Mục tiêu: ghi cookie ava_gioi_thieu có chữ ký theo từng khóa.
- Dữ liệu: K1, mã MAINCC01; mã "KHONGCO1" không thuộc tài khoản nào.
- Các bước: gọi POST /api/gioi-thieu với id K1 và MAINCC01; gọi với "KHONGCO1"; đọc cookie.
- Kết quả mong đợi: mỗi lần trả 200; cookie ava_gioi_thieu (httpOnly, có chữ ký, hạn 24 giờ) có mục cho K1 gồm id khóa, mã MAINCC01, thời điểm bấm; mã không tồn tại bị bỏ qua, ghi nhớ không đổi. Không cần đăng nhập.
- Cách kiểm: Tự động
- Nguồn: Phần 11 mục 11.5, 11.6

## P11-08 Luật ghi đè ghi nhớ
- Mục tiêu: link chủ khóa luôn ghi đè; link người khác chỉ ghi đè khi chưa có, không phải của chủ khóa, hoặc đã quá 24 giờ.
- Dữ liệu: mã chủ khóa MAINCC01; mã học viên A, B.
- Các bước: (1) ghi mã A, rồi ghi mã B; (2) ghi MAINCC01, rồi ghi mã A; (3) ghi mã A rồi ghi MAINCC01; (4) ghi MAINCC01 với thời điểm 25 giờ trước, rồi ghi mã A.
- Kết quả mong đợi: (1) ghi nhớ là B; (2) vẫn là MAINCC01; (3) là MAINCC01; (4) là A.
- Cách kiểm: Tự động
- Nguồn: Phần 11 mục 11.5, 11.9

## P11-09 Ghi nhớ riêng từng khóa
- Mục tiêu: mỗi khóa một mục.
- Dữ liệu: K1 và K2.
- Các bước: ghi mã A cho K1, mã B cho K2.
- Kết quả mong đợi: cookie có hai mục riêng, K1 là A, K2 là B.
- Cách kiểm: Tự động
- Nguồn: Phần 11 mục 11.5

## P11-10 Xem câu hỏi trắc nghiệm kèm đáp án
- Mục tiêu: chỉ chủ khóa và admin.
- Dữ liệu: bài 4 của K1.
- Các bước: gọi GET /api/khoa-hoc/<K1>/bai/<bài 4>/trac-nghiem-xem bằng ncc01, admin, hvmua, ncc02, khách.
- Kết quả mong đợi: ncc01 và admin nhận câu hỏi kèm đáp án đúng; hvmua và ncc02 bị từ chối; khách 401.
- Cách kiểm: Tự động
- Nguồn: Phần 11 mục 11.6, 11.9

## P11-11 Giao diện theo từng người xem
- Mục tiêu: khung mua, khối chia sẻ, danh sách bài đúng 11.3.
- Dữ liệu: K1.
- Các bước: mở /khoa-hoc/<K1> bằng sáu người xem.
- Kết quả mong đợi: khách và hvchua thấy giá, "Mua ngay", "Thêm vào giỏ hàng", các dòng "Học thử miễn phí bài đầu tiên", "Học mãi mãi sau khi mua", "N bài học", "Tiến độ học tự động cập nhật"; hvmua thấy "Đã sở hữu", "Đã học x/y bài", thanh tiến độ, "Vào học", nhãn "Đã học" ở bài 1 và "8,00/10, trắc nghiệm, 5 câu, 15 phút" ở bài 4; ncc02 và admin thấy dòng "Tài khoản người cung cấp và quản trị viên không thể mua khóa học."; bài 1 có nhãn "Học thử miễn phí" và nút "Xem thử" với người chưa có quyền học, không có với chủ khóa và admin; khối "Chia sẻ khóa học" có nút "Sao chép link" đổi thành "Đã sao chép"; tên trang trình duyệt là tên khóa; giống các màn thiet_ke/chi_tiet_khoa_hoc/.
- Cách kiểm: Bấm tay
- Nguồn: Phần 11 mục 11.3, 11.8, 11.9

## P11-12 Bấm vào một bài
- Mục tiêu: dòng nhắc đúng theo người xem.
- Dữ liệu: K1 bài 2.
- Các bước: khách bấm bài 2; hvchua bấm bài 2; ncc02 bấm bài 2; mọi người bấm bài 1; ncc01 bấm bài 4.
- Kết quả mong đợi: khách thấy "Vui lòng đăng nhập và mua khóa học để xem bài học này" kèm nút "Đăng nhập" (mở /dang-nhap?quay_lai=<trang này>) và nút ✕; hvchua thấy "Bạn cần mua khóa học này để xem bài học"; ncc02 thấy "Bạn không thể xem nội dung khóa học của người cung cấp khác"; bài 1 mở được trang học với mọi người; ncc01 bấm bài trắc nghiệm mở hộp xem câu hỏi có nhãn "Đáp án đúng" và nút "Đóng", không làm bài được.
- Cách kiểm: Bấm tay
- Nguồn: Phần 11 mục 11.3, 11.8

## P11-13 Ghi nhớ link chỉ khi mở từ ngoài vào
- Mục tiêu: bấm link bên trong AVA không gọi POST /api/gioi-thieu.
- Dữ liệu: link /khoa-hoc/<K1>?ref=MAINCC01.
- Các bước: dán link vào thẻ trình duyệt mới; rồi bấm link đó từ một trang bên trong AVA (ví dụ dán trong mô tả khóa); xem tab Network và cookie trong công cụ của Chrome.
- Kết quả mong đợi: mở từ ngoài vào thì có lời gọi POST /api/gioi-thieu và cookie ava_gioi_thieu; bấm từ trong AVA thì không có lời gọi; đăng ký hay đăng nhập giữa chừng cookie vẫn còn.
- Cách kiểm: Bấm tay
- Nguồn: Phần 11 mục 11.5, 11.9

## P11-14 Trang "Khóa học không khả dụng" và khối cùng danh mục
- Mục tiêu: hiện đúng màn và ẩn khối khi trống.
- Dữ liệu: K1 bị gỡ; một khóa là khóa duy nhất trong danh mục.
- Các bước: hvmua mở /khoa-hoc/<K1>; mở khóa duy nhất trong danh mục.
- Kết quả mong đợi: hvmua thấy trang như thiet_ke/trang_hoc/khoa_hoc_khong_kha_dung.html; khóa duy nhất không có khối "Khóa học cùng danh mục"; ô "Yêu cầu trước khi học" trống thì cả khối bị ẩn.
- Cách kiểm: Bấm tay
- Nguồn: Phần 11 mục 11.3, 11.4
