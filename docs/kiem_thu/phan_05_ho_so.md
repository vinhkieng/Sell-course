# Danh sách kiểm thử Phần 5. Hồ sơ cá nhân và đổi mật khẩu

- Đặc tả: docs/dac_ta/phan_05_ho_so.md
- Code kiểm thử tự động: backend/tests/phan_05_ho_so.test.js
- Cách kiểm: "Tự động" là Claude Code viết code kiểm thử và chạy bằng npm test; "Bấm tay" là người dùng mở web và làm theo các bước.
- Dữ liệu chung: học viên "hv01" chưa có đơn; học viên "hv02" có một đơn 'Hết hạn'; người cung cấp "ncc01" chưa có khóa; người cung cấp "ncc02" có một khóa đã xóa (da_xoa = 1); admin kiểm thử (CCCD 079200001234). File ảnh mẫu: một PNG thật nhỏ, một JPG thật nhỏ, một file .txt đổi đuôi thành .png, một PNG lớn hơn 2MB.

## P05-01 Xem hồ sơ theo vai trò
- Mục tiêu: mỗi vai trò nhận đúng trường; chỉ admin thấy hợp đồng.
- Dữ liệu: hv01, ncc02, admin.
- Các bước: mỗi người gọi GET /api/ho-so.
- Kết quả mong đợi: học viên có nghe_nghiep, ngay_sinh, không có thông tin hợp đồng; người cung cấp có da_dang_khoa_hoc = true (vì có khóa đã xóa), không có thông tin hợp đồng; admin có số CCCD "079200001234", ngày cấp, nơi cấp, số hợp đồng "HD-2026-001", ngày bắt đầu làm. Khách gọi thì 401.
- Cách kiểm: Tự động
- Nguồn: Phần 5 mục 5.3, 5.5, 5.8

## P05-02 Cập nhật thông tin hợp lệ
- Mục tiêu: lưu đúng và chuẩn hóa họ tên, Gmail.
- Dữ liệu: hv01 gửi ho_ten "  Nguyễn   Văn  An ", gmail "HV01Moi@Gmail.com", so_dien_thoai "0912345678", nghe_nghiep "Sinh viên", ngay_sinh "2004-03-15".
- Các bước: gọi PUT /api/ho-so.
- Kết quả mong đợi: 200 kèm dữ liệu mới; ho_ten lưu "Nguyễn Văn An"; gmail lưu "hv01moi@gmail.com"; không có email nào được gửi.
- Cách kiểm: Tự động
- Nguồn: Phần 5 mục 5.4, 5.5

## P05-03 Họ tên, số điện thoại, ngày sinh, nghề nghiệp sai
- Mục tiêu: báo đúng câu ở từng ô.
- Dữ liệu: ho_ten "A", ho_ten "An123", ho_ten "王小明", ho_ten "Nguyễn Ж", ho_ten "José Muñoz", so_dien_thoai "1912345678", so_dien_thoai "091234567"; ngay_sinh "2026-02-30", ngay_sinh ngày mai, ngay_sinh "1899-12-31"; nghe_nghiep 101 ký tự.
- Các bước: gọi PUT /api/ho-so với từng giá trị.
- Kết quả mong đợi: 400 với "Họ tên từ 2 đến 100 ký tự, chỉ gồm chữ và dấu cách"; "Số điện thoại gồm 10 chữ số, bắt đầu bằng số 0"; "Ngày sinh không hợp lệ"; nghề nghiệp quá 100 ký tự báo "Nghề nghiệp tối đa 100 ký tự". Ba họ tên có chữ nước ngoài cũng báo "Họ tên từ 2 đến 100 ký tự, chỉ gồm chữ và dấu cách". Biên đúng: ngày sinh "1900-01-01" được nhận; họ tên "Đặng Thị Ánh Tuyết" được nhận.
- Cách kiểm: Tự động
- Nguồn: Phần 5 mục 5.4, 5.7

## P05-04 Gmail sai hoặc trùng
- Mục tiêu: luật Gmail như lúc đăng ký.
- Dữ liệu: gmail rỗng; gmail "hv01@yahoo.com"; gmail "hv..01@gmail.com"; gmail của hv02 viết hoa.
- Các bước: hv01 gọi PUT /api/ho-so.
- Kết quả mong đợi: rỗng báo 400 "Vui lòng nhập Gmail"; sai đuôi báo 400 "Gmail phải có đuôi @gmail.com"; sai phần trước @ báo 400 "Gmail không đúng định dạng. Ví dụ: ten@gmail.com"; trùng thì báo "Gmail này đã được sử dụng".
- Cách kiểm: Tự động
- Nguồn: Phần 5 mục 5.4, 5.7

## P05-05 Học viên có đơn không xóa trống họ tên, số điện thoại
- Mục tiêu: có ít nhất một đơn (bất kỳ trạng thái) thì phải giữ hai ô.
- Dữ liệu: hv02 đang có họ tên và số điện thoại, có đơn 'Hết hạn'.
- Các bước: gửi so_dien_thoai rỗng; gửi ho_ten rỗng.
- Kết quả mong đợi: 400 "Bạn đã có đơn hàng nên cần giữ họ tên và số điện thoại."; dữ liệu không đổi.
- Cách kiểm: Tự động
- Nguồn: Phần 5 mục 5.4, 5.7, 5.8

## P05-06 Học viên chưa có đơn, người cung cấp, admin được để trống
- Mục tiêu: để trống hai ô được nhận.
- Dữ liệu: hv01, ncc01, admin đang có họ tên và số điện thoại.
- Các bước: mỗi người gửi ho_ten và so_dien_thoai rỗng.
- Kết quả mong đợi: 200, hai cột thành trống (NULL).
- Cách kiểm: Tự động
- Nguồn: Phần 5 mục 5.4, 5.8

## P05-07 Người cung cấp đã đăng khóa không đổi họ tên, số điện thoại
- Mục tiêu: máy chủ chặn kể cả khi gọi thẳng API.
- Dữ liệu: ncc02 (có khóa đã xóa) đang có họ tên "Trần Bình", số "0987654321".
- Các bước: gửi ho_ten "Trần Bình An"; gửi so_dien_thoai khác; gửi lại đúng giá trị cũ kèm Gmail mới.
- Kết quả mong đợi: hai lần đầu 400, dữ liệu không đổi; lần ba 200 (đổi Gmail được).
- Cách kiểm: Tự động
- Nguồn: Phần 5 mục 5.3, 5.5, 5.8

## P05-08 Đổi ảnh đại diện hợp lệ
- Mục tiêu: lưu ảnh mới, xóa file ảnh cũ.
- Dữ liệu: hv01; lần một gửi PNG thật, lần hai gửi JPG thật.
- Các bước: gọi POST /api/ho-so/anh-dai-dien hai lần; gọi GET /api/anh/anh_dai_dien/<tên file mới>.
- Kết quả mong đợi: mỗi lần 200; nguoi_dung.anh_dai_dien có dạng anh_dai_dien/<uuid>.<đuôi>; sau lần hai file của lần một không còn trong luu_tru/anh_dai_dien; đường lấy ảnh trả 200 không cần đăng nhập.
- Cách kiểm: Tự động
- Nguồn: Phần 5 mục 5.4, 5.5, 5.6; Phần chung C12

## P05-09 Ảnh sai loại hoặc quá 2MB
- Mục tiêu: kiểm loại bằng byte đầu file, giới hạn 2MB.
- Dữ liệu: file .txt đổi đuôi thành .png; PNG lớn hơn 2MB.
- Các bước: gọi POST /api/ho-so/anh-dai-dien.
- Kết quả mong đợi: file giả trả 400; file quá lớn trả 413 (hoặc 400); câu "Ảnh phải là jpg hoặc png, tối đa 2MB"; ảnh cũ giữ nguyên.
- Cách kiểm: Tự động
- Nguồn: Phần 5 mục 5.4, 5.5, 5.7; Phần chung C12

## P05-10 Đường lấy ảnh chỉ cho hai thư mục và tên đúng mẫu
- Mục tiêu: không lấy được file ngoài anh_bia, anh_dai_dien.
- Dữ liệu: tên file không đúng mẫu uuid; thư mục "video"; tên có "../".
- Các bước: gọi GET /api/anh/anh_dai_dien/abc.png, GET /api/anh/video/<uuid>.mp4, GET /api/anh/anh_dai_dien/..%2F..%2Fconfig.js.
- Kết quả mong đợi: đều 404.
- Cách kiểm: Tự động
- Nguồn: Phần chung C12

## P05-11 Đổi mật khẩu thành công
- Mục tiêu: đổi được, không đăng xuất nơi khác.
- Dữ liệu: hv01 mật khẩu "123456", có hai phiên (hai lần đăng nhập cùng địa chỉ).
- Các bước: phiên một gọi POST /api/ho-so/doi-mat-khau với "123456", "654321", "654321"; phiên hai gọi GET /api/tai-khoan/toi; đăng nhập bằng "654321".
- Kết quả mong đợi: 200; phiên hai vẫn dùng được; mật khẩu mới đăng nhập được.
- Cách kiểm: Tự động
- Nguồn: Phần 5 mục 5.4, 5.5, 5.7

## P05-12 Đổi mật khẩu sai
- Mục tiêu: báo đúng câu từng trường hợp.
- Dữ liệu: ô trống; mới "12345"; mới và xác nhận khác nhau; hiện tại sai; mới trùng hiện tại.
- Các bước: gọi POST /api/ho-so/doi-mat-khau với từng bộ; gửi mật khẩu hiện tại sai 6 lần liên tiếp.
- Kết quả mong đợi: ô mật khẩu hiện tại và mật khẩu mới để trống báo "Vui lòng nhập mật khẩu", ô xác nhận để trống báo "Vui lòng nhập lại mật khẩu"; "Mật khẩu phải gồm đúng 6 chữ số"; "Mật khẩu nhập lại không khớp"; "Mật khẩu hiện tại không đúng"; "Mật khẩu mới trùng với mật khẩu cũ, vui lòng nhập mật khẩu khác"; sai mật khẩu hiện tại nhiều lần không bị chặn (không có 429).
- Cách kiểm: Tự động
- Nguồn: Phần 5 mục 5.4, 5.7

## P05-13 Admin không sửa được hợp đồng
- Mục tiêu: PUT /api/ho-so bỏ qua mọi trường hợp đồng.
- Dữ liệu: admin gửi kèm so_cccd "079299999999", so_hop_dong "HD-2099-999".
- Các bước: gọi PUT /api/ho-so.
- Kết quả mong đợi: quan_tri_vien không đổi.
- Cách kiểm: Tự động
- Nguồn: Phần 5 mục 5.4

## P05-14 Số CCCD không ghi vào nhật ký
- Mục tiêu: nhật ký máy chủ không có số CCCD.
- Dữ liệu: admin gọi GET /api/ho-so.
- Các bước: chạy máy chủ (npm run dev), mở hồ sơ admin, xem cửa sổ Terminal của backend.
- Kết quả mong đợi: không thấy "079200001234" ở bất kỳ dòng nhật ký nào.
- Cách kiểm: Bấm tay
- Nguồn: Phần 5 mục 5.3; Phần chung C2

## P05-15 Trang hồ sơ và menu trái
- Mục tiêu: menu đúng vai trò, bấm thì cuộn tới mục.
- Dữ liệu: học viên, người cung cấp, admin.
- Các bước: mở /ho-so bằng từng người; bấm từng mục menu trái; mở /ho-so#doi-mat-khau; mở /ho-so#khong-co-muc-nay.
- Kết quả mong đợi: học viên có Thông tin cá nhân, Đổi mật khẩu, Khóa học của tôi, Tiến độ học, Lịch sử đơn hàng, Đăng xuất; người cung cấp có Thông tin cá nhân, Đổi mật khẩu, Quản lý khóa học, Ví, Rút tiền, Đăng xuất; admin có Thông tin cá nhân, Thông tin hợp đồng, Đổi mật khẩu, Đăng xuất; bấm mục thì cuộn đúng; neo đúng tự cuộn tới; neo sai ở đầu trang, không lỗi; hồ sơ admin không có chân trang, hai vai trò kia có.
- Cách kiểm: Bấm tay
- Nguồn: Phần 5 mục 5.3, 5.8

## P05-16 Ô thông tin và nút Hủy
- Mục tiêu: giao diện mục Thông tin cá nhân đúng thiết kế.
- Dữ liệu: học viên.
- Các bước: xem mục Thông tin cá nhân; sửa vài ô rồi bấm "Hủy"; sửa rồi bấm "Lưu thay đổi"; đổi ảnh.
- Kết quả mong đợi: có ảnh và nút "Đổi ảnh" với dòng "JPG hoặc PNG, tối đa 2 MB", tên đăng nhập chỉ xem, Gmail điền sẵn, ngày sinh dạng dd/mm/yyyy; "Hủy" trả các ô về giá trị đang lưu; lưu được thì có thông báo "Đã cập nhật thông tin"; ảnh mới hiện ngay ở hồ sơ và đầu trang; lỗi hiện như thiet_ke/ho_so/ho_so_hoc_vien_bao_loi.html.
- Cách kiểm: Bấm tay
- Nguồn: Phần 5 mục 5.3, 5.7

## P05-17 Người cung cấp đã đăng khóa thấy ô mờ
- Mục tiêu: ô họ tên, số điện thoại bị mờ kèm dòng giải thích.
- Dữ liệu: ncc02.
- Các bước: mở /ho-so.
- Kết quả mong đợi: hai ô mờ, dòng "Đã đăng khóa học nên không đổi được họ tên và số điện thoại."
- Cách kiểm: Bấm tay
- Nguồn: Phần 5 mục 5.3, 5.7

## P05-18 Mục đổi mật khẩu và thông tin hợp đồng
- Mục tiêu: giao diện đúng.
- Dữ liệu: học viên; admin.
- Các bước: xem mục Đổi mật khẩu, thử đổi sai và đúng; admin xem mục Thông tin hợp đồng.
- Kết quả mong đợi: ba ô và dòng gợi ý "Mật khẩu gồm 6 chữ số", nút "Đổi mật khẩu", đổi được thì "Đã đổi mật khẩu", lỗi như thiet_ke/ho_so/ho_so_hoc_vien_loi_mat_khau.html; admin thấy Số CCCD, Ngày cấp, Nơi cấp, Số hợp đồng, Ngày bắt đầu làm và dòng "Thông tin hợp đồng chỉ để xem. Cần thay đổi thì liên hệ bộ phận quản lý nhân sự."
- Cách kiểm: Bấm tay
- Nguồn: Phần 5 mục 5.3, 5.7
