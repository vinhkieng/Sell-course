# PHẦN 24. QUẢN TRỊ - CHÍNH SÁCH

Chức năng thêm, không có trong luận văn. Làm sau Phần 23. Trang Chính sách công khai, file chinh_sach.json, đường GET /api/chinh-sach và hàm dựng nội dung theo luật gõ đã làm ở Phần 1; phần này thêm trang để admin sửa.

## 24.1 Mục đích và ai dùng
- Chỉ admin. Admin thêm điều mới, sửa tên và nội dung một điều, xóa một điều, đổi thứ tự các điều của trang "Chính sách và điều khoản" ngay trên website, không cần sửa code.
- Học viên, người cung cấp và khách chỉ xem trang /chinh-sach (Phần 1). Người khác vai trò gọi các đường của phần này thì trả 403.
- Không lưu các bản cũ, không gửi thông báo cho ai, không ghi vào lich_su_khoa_hoc. Database giữ nguyên 23 bảng.

## 24.2 Màn thiết kế
- thiet_ke/quan_tri_chinh_sach/chinh_sach.html (màn "Quản trị - Chính sách"): trang quản lý chính sách (danh sách các điều), kèm ô thông báo "Đã lưu điều" ở góc dưới phải.
- thiet_ke/quan_tri_chinh_sach/chinh_sach_sua_dieu.html (màn "Quản trị - Chính sách (sửa điều)"): hộp soạn khi bấm "Sửa" một điều (ví dụ Điều 7), có khung "Xem trước". Chữ trong ô Nội dung và khung "Xem trước" của màn này chỉ là dữ liệu mẫu (vẫn còn mục "7.6. Link giới thiệu" đã bỏ khỏi trang Chính sách); trang thật điền nội dung đang lưu trong chinh_sach.json.
- thiet_ke/quan_tri_chinh_sach/chinh_sach_them_dieu_bao_loi.html (màn "Quản trị - Chính sách (thêm điều, báo lỗi)"): hộp soạn khi bấm "+ Thêm điều" rồi bấm "Lưu" lúc hai ô còn trống.
- thiet_ke/quan_tri_chinh_sach/chinh_sach_hop_xoa.html (màn "Quản trị - Chính sách (hộp Xóa)"): hộp hỏi lại khi bấm "Xóa" một điều.

## 24.3 Giao diện và hành vi
- Mục thứ 8 "Chính sách" của menu quản trị (đứng cuối, sau "Yêu cầu rút tiền", không có số tròn) mở /quan-tri/chinh-sach. Trang không có chân trang (khu quản trị).
- Trang gồm tiêu đề "Chính sách và điều khoản", dòng "Cập nhật lần cuối: dd/mm/yyyy" (chưa sửa lần nào thì không hiện), nút "+ Thêm điều" và danh sách các điều theo thứ tự. Mỗi dòng là "Điều N. <tên điều>" kèm bốn nút "↑", "↓", "Sửa", "Xóa".
- Tiêu đề trang "Chính sách và điều khoản" và dòng giới thiệu trên trang công khai là chữ cố định, admin không sửa được.
- Số "Điều N." do máy tự đánh theo thứ tự hiện tại; admin chỉ gõ phần tên. Ví dụ xóa Điều 3 thì Điều 4 thành Điều 3.
- Đổi thứ tự: bấm "↑" thì điều đó đổi chỗ với điều ngay trên, bấm "↓" thì đổi chỗ với điều ngay dưới. Bấm là lưu ngay, hiện ô thông báo "Đã đổi thứ tự". Nút "↑" của điều đầu tiên và nút "↓" của điều cuối cùng bị mờ. Không có kéo thả.
- "Sửa" mở hộp soạn tiêu đề "Sửa Điều N", điền sẵn tên và nội dung hiện tại. "+ Thêm điều" mở hộp soạn tiêu đề "Thêm điều", hai ô trống; điều mới được thêm vào cuối danh sách.
- Hộp soạn gồm:
  - Ô "Tên điều" (bắt buộc), dòng nhắc "Chỉ gõ tên. Chữ "Điều N." do hệ thống tự thêm." (N là số của điều đang sửa, hoặc số kế tiếp khi thêm).
  - Ô "Nội dung" (bắt buộc), bên dưới là bảng nhắc luật gõ đúng như thiết kế, và dòng nhắc "Đổi thứ tự hoặc xóa điều có thể làm sai các chỗ ghi "Điều …" trong nội dung, hãy kiểm tra lại."
  - Khung "Xem trước" nằm bên cạnh ô nội dung, hiện nội dung đúng như trên trang công khai, cập nhật ngay khi gõ. Ở độ rộng điện thoại thì khung "Xem trước" xếp dưới ô nội dung (Phần chung C8).
  - Nút "Hủy" (đóng hộp, không lưu) và "Lưu".
- Bấm "Lưu": trang kiểm tra trước, ô nào sai thì hiện chữ đỏ dưới ô (như màn thiet_ke/quan_tri_chinh_sach/chinh_sach_them_dieu_bao_loi.html) và chưa gửi. Lưu thành công thì đóng hộp, cập nhật danh sách và dòng "Cập nhật lần cuối", hiện ô thông báo "Đã lưu điều" (khi sửa) hoặc "Đã thêm điều" (khi thêm). Mỗi lần lưu chỉ ghi điều đang soạn.
- "Xóa" mở hộp hỏi lại "Xóa Điều N. <tên điều>?" với nút "Hủy" và "Xóa". Bấm "Xóa" thì xóa ngay, các điều phía sau tự đánh lại số, hiện ô thông báo "Đã xóa điều". Khi chỉ còn 1 điều thì nút "Xóa" bị mờ.
- Khi đã có 50 điều thì nút "+ Thêm điều" bị mờ.
- Đang mở hộp soạn mà nội dung đã thay đổi chưa lưu, nếu người dùng rời trang (đóng thẻ, tải lại, bấm sang trang khác) thì trình duyệt hỏi lại trước khi rời.
- Máy chủ trả 409 vì admin khác vừa thay đổi chính sách (24.5) thì hiện câu "Chính sách vừa được quản trị viên khác thay đổi. Vui lòng tải lại trang." và không lưu.
- Chữ "VNPay" trong nội dung các điều là chữ thường do admin gõ; đổi cổng thanh toán thì admin tự sửa chữ này.

## 24.4 Quy tắc
- Tên điều: bắt buộc (bỏ dấu cách ở đầu và cuối rồi mới kiểm), 1 đến 200 ký tự. Ô tên không cho gõ quá 200 ký tự; máy chủ vẫn kiểm lại.
- Nội dung: bắt buộc (bỏ dấu cách và dòng trống ở đầu và cuối rồi mới kiểm), 1 đến 20.000 ký tự. Quá 20.000 ký tự thì báo "Nội dung quá dài." dưới ô.
- Phải luôn còn ít nhất 1 điều và có tối đa 50 điều.
- Luật gõ nội dung (dùng chung cho trang công khai và khung "Xem trước"):
  - Dòng bắt đầu bằng số rồi dấu chấm và một dấu cách (ví dụ "1. ", "4. ") là một khoản đánh số. Số hiện đúng như admin gõ, máy không tự đếm lại. Chữ như "1.000 học viên" (sau dấu chấm không có dấu cách) không phải khoản đánh số.
  - Dòng bắt đầu bằng "- " là một gạch đầu dòng. Dòng bắt đầu bằng 2 dấu cách rồi "- " là gạch đầu dòng con, nằm trong khoản hoặc gạch đầu dòng ngay phía trên.
  - Dòng thụt vào 2 dấu cách mà không có dấu "-" là một đoạn văn nằm trong khoản phía trên (ví dụ đoạn đứng sau các gạch con của một khoản).
  - Dòng bắt đầu bằng "## " là một tiêu đề nhỏ; số của tiêu đề nhỏ (ví dụ "7.1.") do admin gõ tay, máy không tự đổi khi điều đổi số.
  - Một dòng trống là sang đoạn mới. Các dòng liền nhau không có dấu ở đầu thì nối thành một đoạn.
- Nội dung luôn được dựng thành phần tử React theo luật trên, không dùng dangerouslySetInnerHTML; admin gõ thẻ HTML hay script thì chỉ hiện thành chữ.
- Mọi thay đổi thành công (lưu, thêm, xóa, đổi thứ tự) cập nhật ngày "Cập nhật lần cuối" thành ngày hiện tại theo giờ Việt Nam. Ngày này lấy theo giờ của Node ở múi giờ Asia/Ho_Chi_Minh, vì file không nằm trong MySQL (ngoại lệ của Phần chung C10).
- Nội dung ban đầu: 12 điều như ghi ở Phần 1 mục 1.3. Khi chưa có lần lưu nào thì không có ngày cập nhật.

## 24.5 Đường xử lý ở máy chủ
Mọi đường dưới đây chỉ dành cho admin và đi qua kiểm tra phiên (Phần chung C4); các đường thay đổi dữ liệu (POST, PUT, DELETE) đi qua kiểm tra Origin (Phần chung C6). Mỗi yêu cầu thay đổi gửi kèm phien_ban mà trang đang có; phien_ban khác số trong file thì trả 409 với câu "Chính sách vừa được quản trị viên khác thay đổi. Vui lòng tải lại trang." và không ghi gì. Thành công thì tăng phien_ban thêm 1, cập nhật ngày, ghi file và trả lại toàn bộ chính sách mới (danh sách các điều, phien_ban, ngày cập nhật).
- GET /api/quan-tri/chinh-sach: trả danh sách các điều (số thứ tự, tên, nội dung), phien_ban, ngày cập nhật lần cuối.
- POST /api/quan-tri/chinh-sach/dieu: nhận ten, noi_dung, phien_ban. Thêm điều vào cuối. Đã có 50 điều thì trả 400 kèm mã QUA_SO_DIEU (giao diện không gặp trường hợp này vì nút đã mờ).
- PUT /api/quan-tri/chinh-sach/dieu/:so: nhận ten, noi_dung, phien_ban. Sửa điều số :so. Không có điều đó thì 404.
- DELETE /api/quan-tri/chinh-sach/dieu/:so: nhận phien_ban. Chỉ còn 1 điều thì trả 400 kèm mã CON_MOT_DIEU (giao diện không gặp vì nút đã mờ).
- POST /api/quan-tri/chinh-sach/dieu/:so/doi-thu-tu: nhận huong ('len' hoặc 'xuong') và phien_ban. Điều đầu không lên được, điều cuối không xuống được (trả 400).
- Lỗi kiểm tra ô trả 400 kèm cac_o { ten, noi_dung } theo Phần chung C6.
- Ghi file an toàn: ghi ra một file tạm trong cùng thư mục rồi đổi tên đè lên chinh_sach.json, để tắt máy giữa chừng không làm hỏng file. Các yêu cầu ghi được xếp hàng làm lần lượt, không ghi chồng lên nhau.
- File chinh_sach.json hỏng hoặc không đọc được thì máy chủ ghi lỗi vào nhật ký và dùng file mặc định backend/du_lieu_mac_dinh/chinh_sach.json.

## 24.6 Bảng dữ liệu dùng
- Không dùng bảng nào. Nội dung nằm trong file backend/luu_tru/noi_dung/chinh_sach.json (cấu trúc ở Phần 1 mục 1.3); file mặc định backend/du_lieu_mac_dinh/chinh_sach.json.
- Đường dẫn file đổi được bằng biến môi trường để kiểm thử không ghi đè file thật (Phần 1 mục 1.4).

## 24.7 Câu thông báo
- Dưới ô: "Vui lòng nhập tên điều", "Vui lòng nhập nội dung", "Nội dung quá dài.".
- Hộp hỏi lại: "Xóa Điều N. <tên điều>?".
- Ô thông báo nhỏ: "Đã lưu điều", "Đã thêm điều", "Đã xóa điều", "Đã đổi thứ tự".
- Hai admin cùng sửa: "Chính sách vừa được quản trị viên khác thay đổi. Vui lòng tải lại trang."
- Dòng nhắc trong hộp soạn: "Đổi thứ tự hoặc xóa điều có thể làm sai các chỗ ghi "Điều …" trong nội dung, hãy kiểm tra lại."

## 24.8 Kiểm tra khi làm xong
- Học viên hoặc người cung cấp gọi các đường /api/quan-tri/chinh-sach thì bị 403; khách bị 401.
- Sửa Điều 2 rồi lưu: trang /chinh-sach hiện nội dung mới và dòng "Cập nhật lần cuối" với ngày hôm nay.
- Xóa Điều 3: Điều 4 cũ thành Điều 3; mở /chinh-sach#dieu-3 cuộn tới điều đó. Còn 1 điều thì không xóa được.
- Bấm "↓" ở Điều 1: Điều 1 và Điều 2 đổi chỗ, lưu ngay.
- Gõ "1. ", "- ", "  - ", dòng thụt 2 dấu cách, "## " và dòng trống: khung "Xem trước" và trang công khai hiện đúng; gõ "<script>" chỉ hiện thành chữ.
- Hai thẻ cùng mở trang quản lý, thẻ thứ nhất lưu trước, thẻ thứ hai lưu sau thì nhận câu báo 409 và nội dung của thẻ thứ nhất không bị đè.
- Danh sách kiểm thử đầy đủ: docs/kiem_thu/phan_24_quan_tri_chinh_sach.md
