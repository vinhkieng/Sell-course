# PHẦN 3. ĐĂNG NHẬP, ĐĂNG XUẤT VÀ XÁC NHẬN ĐỊA CHỈ MẠNG

Làm sau Phần 2.

## 3.1 Mục đích và ai dùng
- Khách đăng nhập bằng tên đăng nhập và mật khẩu. Học viên đăng nhập từ một địa chỉ IP khác địa chỉ đã lưu phải nhập mã 6 chữ số gửi qua Gmail. Mọi người đã đăng nhập đăng xuất được.
- Người đã đăng nhập mở /dang-nhap thì về trang chủ.

## 3.2 Màn thiết kế
- thiet_ke/dang_nhap/dang_nhap.html (màn "Đăng nhập"): trang đăng nhập bình thường.
- thiet_ke/dang_nhap/dang_nhap_de_trong.html (màn "Đăng nhập (để trống ô bắt buộc)"): bấm "Đăng nhập" khi ô còn trống.
- thiet_ke/dang_nhap/dang_nhap_mat_khau_sai_dinh_dang.html (màn "Đăng nhập (mật khẩu sai định dạng)"): mật khẩu không đủ 6 chữ số.
- thiet_ke/dang_nhap/dang_nhap_sai_ten_hoac_mat_khau.html (màn "Đăng nhập (sai tên hoặc mật khẩu)"): sai tên đăng nhập hoặc mật khẩu.
- thiet_ke/dang_nhap/dang_nhap_sai_5_lan.html (màn "Đăng nhập (sai 5 lần)"): đang bị tạm chặn do sai nhiều lần.
- thiet_ke/dang_nhap/dang_nhap_tai_khoan_bi_khoa.html (màn "Đăng nhập (tài khoản bị khóa)"): tài khoản bị khóa.
- thiet_ke/dang_nhap/tu_nut_mua.html (màn "Đăng nhập (từ nút Mua)"): đăng nhập khi đến từ nút "Mua" hoặc "Mua ngay" (có thêm dòng "Vui lòng đăng nhập để mua khóa học").
- thiet_ke/dang_nhap/tu_nut_mua_de_trong.html (màn "Đăng nhập (từ nút Mua) (để trống ô bắt buộc)"): như trên, để trống ô.
- thiet_ke/dang_nhap/tu_nut_mua_mat_khau_sai_dinh_dang.html (màn "Đăng nhập (từ nút Mua) (mật khẩu sai định dạng)"): như trên, mật khẩu sai định dạng.
- thiet_ke/dang_nhap/tu_nut_mua_sai_ten_hoac_mat_khau.html (màn "Đăng nhập (từ nút Mua) (sai tên hoặc mật khẩu)"): như trên, sai tên hoặc mật khẩu.
- thiet_ke/dang_nhap/tu_nut_mua_sai_5_lan.html (màn "Đăng nhập (từ nút Mua) (sai 5 lần)"): như trên, bị tạm chặn.
- thiet_ke/dang_nhap/tu_nut_mua_tai_khoan_bi_khoa.html (màn "Đăng nhập (từ nút Mua) (tài khoản bị khóa)"): như trên, tài khoản bị khóa.
- thiet_ke/dang_nhap/xac_nhan_dang_nhap.html (màn "Xác nhận đăng nhập (địa chỉ mạng mới)"): trang "Xác nhận đăng nhập" ngay sau khi vừa gửi mã (các lỗi của trang này không vẽ riêng, xem 3.7).

## 3.3 Giao diện và hành vi
- Trang đăng nhập: ô "Tên đăng nhập", ô "Mật khẩu" (chỉ chữ số), liên kết "Quên mật khẩu?" ngay dưới ô mật khẩu (mở /quen-mat-khau), nút "Đăng nhập", liên kết "Đăng ký".
- Đường dẫn trang đăng nhập nhận ?quay_lai=<đường dẫn nội bộ> và ?tu=mua. Có ?tu=mua thì hiện dòng "Vui lòng đăng nhập để mua khóa học" như màn thiet_ke/dang_nhap/tu_nut_mua.html.
- Bấm "Đăng nhập": trang kiểm tra hai ô trước (để trống, mật khẩu không đủ 6 chữ số), sai thì báo dưới ô và chưa gửi. Lỗi do máy chủ trả về (sai tên hoặc mật khẩu, bị chặn, bị khóa) hiện thành một dòng báo lỗi đỏ phía trên nút như các màn thiết kế.
- Máy chủ trả "cần xác nhận địa chỉ mạng" thì chuyển sang /xac-nhan-dang-nhap (giữ nguyên quay_lai và tu=mua để dùng sau khi xác nhận xong).
- Đăng nhập xong (hoặc xác nhận mã xong): nếu có quay_lai hợp lệ thì về đó; nếu không thì học viên về trang chủ, người cung cấp về /ho-so#quan-ly-khoa-hoc, admin về /quan-tri/khoa-hoc. Việc gộp giỏ tạm và việc đi tiếp khi đến từ nút "Mua", "Mua ngay" làm theo Phần 12 mục 12.3.
- Trang "Xác nhận đăng nhập": dòng "Bạn đang đăng nhập từ một địa chỉ mạng mới. Chúng tôi đã gửi mã gồm 6 chữ số tới Gmail a***@gmail.com. Vui lòng nhập mã để tiếp tục." (Gmail che bớt: giữ ký tự đầu, phần còn lại trước @ thành ***), ô "Mã xác nhận" (6 chữ số), nút "Xác nhận" mờ khi chưa đủ 6 chữ số, liên kết "Gửi lại mã" (đếm ngược "Gửi lại mã sau N giây" trong 60 giây kể từ lần gửi gần nhất, hết đếm mới bấm được), liên kết "Quay lại đăng nhập". Lỗi hiện chữ đỏ dưới ô mã; gửi lại thành công hiện dòng xanh.
- Mở thẳng /xac-nhan-dang-nhap khi không có lượt đăng nhập đang chờ xác nhận thì chuyển về /dang-nhap.
- Đăng xuất (mục "Đăng xuất" ở menu ảnh đại diện và ở menu trái trang hồ sơ): hủy phiên, về trang chủ. Giỏ hàng của học viên vẫn còn vì nằm trong cơ sở dữ liệu.

## 3.4 Quy tắc
- Thứ tự kiểm tra ở máy chủ khi bấm "Đăng nhập", gặp lỗi đầu tiên thì dừng:
  1. Hai ô không trống, mật khẩu đúng 6 chữ số.
  2. Tên đăng nhập (viết thường) hoặc địa chỉ IP đang bị tạm chặn (bộ đếm trong bộ nhớ, Phần chung C13) thì báo bị chặn và dừng, dù mật khẩu đúng.
  3. Tìm tài khoản theo tên đăng nhập không phân biệt hoa thường, so mật khẩu bằng bcrypt. Sai tên hoặc sai mật khẩu đều báo chung một câu và tính thêm một lần sai cho tên đăng nhập đó và cho địa chỉ IP đó.
  4. Đúng mật khẩu nhưng tài khoản bị khóa (khoa = 1) thì báo bị khóa kèm lý do. Câu bị khóa chỉ hiện khi đã nhập đúng mật khẩu.
  5. Tài khoản học viên: so địa chỉ IP đang dùng (đã quy về một dạng, Phần chung C4) với hoc_vien.dia_chi_ip. Chưa có địa chỉ nào được lưu (lần đăng nhập đầu) thì lưu luôn địa chỉ đang dùng và đi tiếp bước 6. Trùng thì đi tiếp bước 6. Khác thì gửi mã và yêu cầu xác nhận (3.5). Người cung cấp và admin không qua bước này.
  6. Tạo phiên đăng nhập (Phần chung C4), đặt lại số lần sai của tên đăng nhập về 0.
- Giới hạn sai: 5 lần sai liên tiếp của một tên đăng nhập thì chặn tên đó 5 phút. Một địa chỉ IP sai 20 lần trong 15 phút thì chặn địa chỉ đó 15 phút. Đăng nhập thành công thì số lần sai của tên đăng nhập về 0. Nhập sai mã xác nhận không tính vào giới hạn này.
- Phiên có hạn 7 ngày. Tài khoản đang đăng nhập mà bị admin khóa thì bị đẩy ra ở lần bấm kế tiếp.
- Mã xác nhận địa chỉ mạng: 6 chữ số ngẫu nhiên, hiệu lực 10 phút, dùng một lần; cơ sở dữ liệu chỉ lưu bản băm (bcrypt). Nhập sai 5 lần thì mã hết hiệu lực. "Gửi lại mã" chỉ được sau 60 giây kể từ lần gửi gần nhất; mã mới được gửi thì mã cũ hết hiệu lực. Mỗi học viên được gửi mã tối đa 5 lần trong 1 giờ (bộ đếm trong bộ nhớ, tính cả lần gửi đầu tiên).
- Mã đúng: lưu địa chỉ IP mới vào hoc_vien.dia_chi_ip thay địa chỉ cũ, xóa dòng xac_minh_ip của học viên đó, tạo phiên. Phiên ở nơi cũ bị đăng xuất ở lần bấm kế tiếp (Phần chung C4). Các máy dùng chung một địa chỉ IP (cùng wifi) không bị hỏi mã và dùng được cùng lúc.
- Địa chỉ IP chỉ kiểm tra lúc đăng nhập; đang đăng nhập mà địa chỉ đổi (ví dụ wifi sang 4G) thì vẫn dùng tiếp tới hết phiên. Riêng việc so địa chỉ trong mã phiên với hoc_vien.dia_chi_ip ở Phần chung C4 vẫn làm ở mỗi yêu cầu (so địa chỉ đã xác nhận, không so địa chỉ đang dùng).
- Email gửi mã: tiêu đề "Mã xác nhận đăng nhập AVA"; nội dung "Có người vừa đăng nhập tài khoản AVA của bạn từ một địa chỉ mạng mới. Mã xác nhận của bạn là: [mã 6 chữ số]. Mã có hiệu lực trong 10 phút. Nếu không phải bạn, hãy đổi mật khẩu ngay."
- Lượt đăng nhập đang chờ xác nhận: sau khi đúng mật khẩu ở bước 5, máy chủ đặt một cookie tạm tên ava_cho_xac_nhan, có chữ ký bằng COOKIE_SECRET (httpOnly, hạn 10 phút), ghi id học viên và địa chỉ IP mới, để trang "Xác nhận đăng nhập" biết đang xác nhận cho ai. Cookie này chỉ nằm trong trình duyệt, không lưu vào database. Chưa xác nhận xong thì chưa có phiên đăng nhập.

## 3.5 Đường xử lý ở máy chủ
POST /api/tai-khoan/dang-nhap
- Nhận: ten_dang_nhap, mat_khau. Làm theo thứ tự ở 3.4.
- Trả: thành công 200 kèm thông tin người dùng (như /api/tai-khoan/toi) và đặt cookie phiên; cần xác nhận địa chỉ mạng 200 kèm { "can_xac_nhan": true, "gmail_che": "a***@gmail.com", "giay_cho_gui_lai": 60 }; sai tên hoặc mật khẩu 400; bị chặn 429; bị khóa 401 kèm mã TAI_KHOAN_BI_KHOA và lý do (trang đăng nhập hiện câu ngay trên nút, không chuyển sang trang 403).
- Khi cần xác nhận: kiểm tra giới hạn 5 lần gửi trong 1 giờ (vượt thì trả 429 với câu "Bạn đã yêu cầu gửi mã quá nhiều lần. Vui lòng thử lại sau." và không gửi); tạo mã, xóa dòng xac_minh_ip cũ của học viên (nếu có) rồi thêm dòng mới (ma_xac_minh_da_bam, dia_chi_ip_moi, thoi_diem_gui_ma = NOW(), so_lan_nhap_ma_sai = 0); gửi email; đặt cookie tạm.
POST /api/tai-khoan/xac-nhan-dang-nhap
- Nhận: ma (6 chữ số). Đọc cookie tạm; không có hoặc hết hạn thì trả 400 và trang chuyển về /dang-nhap.
- Tìm dòng xac_minh_ip của học viên: không có, hoặc thoi_diem_gui_ma quá 10 phút thì báo hết hạn; so_lan_nhap_ma_sai đã đủ 5 thì báo sai quá nhiều lần; so mã sai thì tăng so_lan_nhap_ma_sai và báo mã sai (lần sai thứ 5 thì báo sai quá nhiều lần).
- Mã đúng: trong một giao dịch, cập nhật hoc_vien.dia_chi_ip = dia_chi_ip_moi, xóa dòng xac_minh_ip; xóa cookie tạm, tạo phiên (địa chỉ đã xác nhận trong phiên là dia_chi_ip_moi), trả thông tin người dùng.
POST /api/tai-khoan/gui-lai-ma-dang-nhap
- Đọc cookie tạm. Chưa đủ 60 giây kể từ thoi_diem_gui_ma thì trả 429 kèm số giây còn lại. Vượt 5 lần trong 1 giờ thì trả 429 kèm câu gửi quá nhiều. Hợp lệ thì tạo mã mới, ghi đè dòng xac_minh_ip (mã mới, thoi_diem_gui_ma = NOW(), so_lan_nhap_ma_sai = 0), gửi email, trả 200.
POST /api/tai-khoan/dang-xuat
- Xóa cookie phiên, trả 200.

## 3.6 Bảng dữ liệu dùng
- nguoi_dung: ten_dang_nhap, mat_khau_da_bam, vai_tro, khoa, ly_do_khoa, gmail.
- hoc_vien: dia_chi_ip (địa chỉ IP của lần xác nhận gần nhất; trống nghĩa là chưa đăng nhập lần nào).
- xac_minh_ip: mỗi học viên tối đa một dòng (ràng buộc không trùng id_hoc_vien). Cột id_hoc_vien, ma_xac_minh_da_bam, dia_chi_ip_moi, thoi_diem_gui_ma, so_lan_nhap_ma_sai (0 đến 5).

## 3.7 Câu thông báo
- "Vui lòng nhập tên đăng nhập", "Vui lòng nhập mật khẩu", "Mật khẩu phải gồm đúng 6 chữ số".
- "Tên đăng nhập hoặc mật khẩu không đúng".
- Bị chặn theo tên đăng nhập: "Bạn đã nhập sai nhiều lần, vui lòng thử lại sau 5 phút". Bị chặn theo địa chỉ IP: "Bạn đã nhập sai nhiều lần, vui lòng thử lại sau 15 phút".
- "Tài khoản đã bị khóa. Lý do: [lý do]. Liên hệ hỗ trợ nếu bạn cho rằng có nhầm lẫn."
- Trang xác nhận: "Mã xác nhận không đúng."; "Mã đã hết hạn, vui lòng bấm Gửi lại mã."; "Bạn đã nhập sai quá nhiều lần, vui lòng bấm Gửi lại mã."; "Bạn đã yêu cầu gửi mã quá nhiều lần. Vui lòng thử lại sau."; dòng xanh khi gửi lại được "Đã gửi mã mới tới Gmail a***@gmail.com.".
- Bị đẩy ra: "Tài khoản của bạn vừa đăng nhập ở một địa chỉ mạng khác."

## 3.8 Kiểm tra khi làm xong
- Học viên mới đăng ký đăng nhập lần đầu: không bị hỏi mã, hoc_vien.dia_chi_ip được lưu.
- Chuẩn bị thử bằng điện thoại theo Phần chung C4 (đổi CLIENT_ORIGIN trong backend/.env thành địa chỉ wifi của máy tính, chạy lại backend và frontend). Đăng nhập học viên đó từ điện thoại cùng wifi (địa chỉ khác 127.0.0.1): bị hỏi mã, email tới đúng Gmail. Nhập đúng mã thì vào được; quay lại máy tính bấm bất kỳ trang nào thì bị đẩy về trang đăng nhập.
- Sai mật khẩu 5 lần thì bị chặn 5 phút kể cả khi nhập đúng; đặt lại mật khẩu (Phần 4) thì hết bị chặn.
- Admin khóa một tài khoản đang đăng nhập: lần bấm kế tiếp người đó bị đẩy ra và thấy câu bị khóa.
- Người cung cấp và admin đăng nhập từ địa chỉ nào cũng không bị hỏi mã.
- Danh sách kiểm thử đầy đủ: docs/kiem_thu/phan_03_dang_nhap.md
