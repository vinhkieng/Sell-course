# PHẦN 4. QUÊN MẬT KHẨU

Làm sau Phần 3.

## 4.1 Mục đích và ai dùng
- Người đã có tài khoản (học viên, người cung cấp hoặc admin) quên mật khẩu, thực hiện lúc chưa đăng nhập.

## 4.2 Màn thiết kế
- thiet_ke/quen_mat_khau/quen_mat_khau.html (màn "Quên mật khẩu"): trang nhập Gmail (màn vẽ kèm lỗi Gmail sai định dạng).
- thiet_ke/quen_mat_khau/dat_lai_mat_khau.html (màn "Đặt lại mật khẩu"): trang đặt lại mật khẩu sau khi bấm "Gửi mã" (màn vẽ kèm các lỗi).

## 4.3 Giao diện và hành vi
- Trang quên mật khẩu: ô Gmail, nút "Gửi mã", liên kết "← Quay lại đăng nhập". Gmail sai định dạng hoặc không có đuôi @gmail.com thì báo dưới ô, không gửi.
- Bấm "Gửi mã" hợp lệ thì chuyển sang /dat-lai-mat-khau, hiện dòng "Nếu Gmail này đã đăng ký, mã xác nhận đã được gửi. Vui lòng kiểm tra hộp thư.", dòng "Gmail bạn đã nhập: …" kèm liên kết "Nhập lại Gmail" (về trang quên mật khẩu).
- Trang đặt lại: ô "Mã xác nhận", "Mật khẩu mới", "Nhập lại mật khẩu mới", nút "Đặt lại mật khẩu", dòng "Chưa nhận được mã?" và liên kết "Gửi lại mã" có đếm ngược 60 giây như thiết kế.
- Đặt lại thành công: về trang chủ kèm ô thông báo nhỏ "Đặt lại mật khẩu thành công, vui lòng đăng nhập". Không tự đăng nhập.

## 4.4 Quy tắc
- Máy chủ luôn trả cùng một câu dù Gmail có tài khoản hay không, để người lạ không dò được Gmail nào đã đăng ký.
- Chỉ khi Gmail thuộc một tài khoản đang hoạt động (khoa = 0) mới tạo mã và gửi; tài khoản bị khóa thì không tạo mã, không gửi.
- Mã 6 chữ số, hiệu lực 10 phút kể từ lúc gửi, dùng một lần, lưu bản băm. "Gửi lại mã" phải chờ 60 giây; mã mới được gửi thì mọi mã cũ chưa dùng của tài khoản đó hết hiệu lực (đặt da_dung = 1 hoặc xóa). Nhập sai 5 lần thì mã bị hủy.
- Mật khẩu mới đúng 6 chữ số, hai ô giống nhau.
- Đặt lại thành công: lưu mật khẩu mới (băm bcrypt), đánh dấu mã đã dùng, xóa số lần sai đăng nhập và gỡ tạm chặn của tên đăng nhập đó trong bộ đếm bộ nhớ.
- Email: tiêu đề "Mã đặt lại mật khẩu AVA"; nội dung "Mã xác nhận để đặt lại mật khẩu tài khoản AVA của bạn là: [mã 6 chữ số]. Mã có hiệu lực trong 10 phút. Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này."

## 4.5 Đường xử lý ở máy chủ
POST /api/tai-khoan/quen-mat-khau
- Nhận: gmail. Sai định dạng trả 400. Hợp lệ luôn trả 200 cùng một câu. Nếu Gmail thuộc tài khoản đang hoạt động: nếu tài khoản có mã gửi chưa quá 60 giây thì không gửi thêm (vẫn trả 200 như thường); còn lại thì hủy các mã cũ chưa dùng, thêm dòng ma_dat_lai_mat_khau mới, gửi email.
POST /api/tai-khoan/dat-lai-mat-khau
- Nhận: gmail, ma, mat_khau_moi, nhap_lai. Kiểm tra mật khẩu mới trước (định dạng, khớp). Tìm dòng mã mới nhất chưa dùng của tài khoản: không có, quá 10 phút, hoặc mã sai thì báo "Mã xác nhận không đúng hoặc đã hết hạn" (mã sai thì tăng so_lan_sai; đủ 5 thì đặt da_dung = 1 và báo sai quá nhiều lần).
- Hợp lệ: trong một giao dịch cập nhật mat_khau_da_bam, đặt da_dung = 1; xóa bộ đếm sai của tên đăng nhập; trả 200.
POST /api/tai-khoan/gui-lai-ma-dat-lai
- Nhận: gmail. Xử lý như quên mật khẩu nhưng trả 429 kèm số giây còn lại nếu chưa đủ 60 giây (chỉ khi Gmail có tài khoản; nếu không có thì vẫn trả 200 để không lộ).

## 4.6 Bảng dữ liệu dùng
- nguoi_dung: gmail, khoa, mat_khau_da_bam, ten_dang_nhap.
- ma_dat_lai_mat_khau: id_nguoi_dung, ma_6_so_da_bam, thoi_diem_gui, so_lan_sai (0 đến 5), da_dung.

## 4.7 Câu thông báo
- "Gmail không đúng định dạng. Ví dụ: ten@gmail.com"
- "Nếu Gmail này đã đăng ký, mã xác nhận đã được gửi. Vui lòng kiểm tra hộp thư."
- "Mã xác nhận không đúng hoặc đã hết hạn"
- "Bạn đã nhập sai quá nhiều lần, vui lòng gửi lại mã mới"
- "Mật khẩu phải gồm đúng 6 chữ số", "Mật khẩu nhập lại không khớp"
- "Đặt lại mật khẩu thành công, vui lòng đăng nhập"

## 4.8 Kiểm tra khi làm xong
- Nhập Gmail không có tài khoản: vẫn thấy cùng câu, không có email nào được gửi.
- Nhập Gmail của tài khoản bị khóa: không có email.
- Mã quá 10 phút thì không dùng được; gửi lại mã thì mã cũ không dùng được nữa.
- Đặt lại xong đăng nhập bằng mật khẩu mới được, mật khẩu cũ không được.
- Danh sách kiểm thử đầy đủ: docs/kiem_thu/phan_04_quen_mat_khau.md
