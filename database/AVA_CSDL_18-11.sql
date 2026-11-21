SET NAMES utf8mb4;
SET time_zone = '+07:00';
CREATE DATABASE IF NOT EXISTS ava CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ava;

CREATE TABLE nguoi_dung (
  id INT NOT NULL AUTO_INCREMENT,
  ten_dang_nhap VARCHAR(30) NOT NULL,
  ho_ten VARCHAR(100) NULL,
  gmail VARCHAR(100) NOT NULL,
  so_dien_thoai VARCHAR(10) NULL,
  mat_khau_da_bam VARCHAR(255) NOT NULL,
  vai_tro TINYINT NOT NULL,
  ma_gioi_thieu CHAR(8) NOT NULL,
  anh_dai_dien VARCHAR(255) NULL,
  khoa TINYINT(1) NOT NULL DEFAULT 0,
  ly_do_khoa VARCHAR(255) NULL,
  id_quan_tri_vien INT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_nguoi_dung_ten_dang_nhap (ten_dang_nhap),
  UNIQUE KEY uq_nguoi_dung_gmail (gmail),
  UNIQUE KEY uq_nguoi_dung_ma_gioi_thieu (ma_gioi_thieu),
  CONSTRAINT ck_nguoi_dung_vai_tro CHECK (vai_tro IN (1, 2, 3)),
  CONSTRAINT ck_nguoi_dung_ten_dang_nhap CHECK (REGEXP_LIKE(ten_dang_nhap, '^[A-Za-z0-9]{4,30}$')),
  CONSTRAINT ck_nguoi_dung_gmail CHECK (REGEXP_LIKE(gmail, '^[a-z0-9]+([.][a-z0-9]+)*@gmail[.]com$', 'i')),
  CONSTRAINT ck_nguoi_dung_so_dien_thoai CHECK (so_dien_thoai IS NULL OR REGEXP_LIKE(so_dien_thoai, '^0[0-9]{9}$')),
  CONSTRAINT ck_nguoi_dung_ma_gioi_thieu CHECK (REGEXP_LIKE(ma_gioi_thieu, '^[A-Z0-9]{8}$', 'c')),
  CONSTRAINT ck_nguoi_dung_ly_do_khoa CHECK (ly_do_khoa IS NULL OR CHAR_LENGTH(TRIM(ly_do_khoa)) BETWEEN 5 AND 255),
  CONSTRAINT ck_nguoi_dung_khoa CHECK (
    (khoa = 1) = (ly_do_khoa IS NOT NULL) AND (khoa = 1) = (id_quan_tri_vien IS NOT NULL))
);

CREATE TABLE quan_tri_vien (
  id INT NOT NULL AUTO_INCREMENT,
  id_nguoi_dung INT NOT NULL,
  so_cccd CHAR(12) NOT NULL,
  ngay_cap_cccd DATE NOT NULL,
  noi_cap_cccd VARCHAR(150) NOT NULL,
  so_hop_dong VARCHAR(30) NOT NULL,
  ngay_bat_dau_lam DATE NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_quan_tri_vien_id_nguoi_dung (id_nguoi_dung),
  UNIQUE KEY uq_quan_tri_vien_so_cccd (so_cccd),
  UNIQUE KEY uq_quan_tri_vien_so_hop_dong (so_hop_dong),
  CONSTRAINT fk_quan_tri_vien_id_nguoi_dung FOREIGN KEY (id_nguoi_dung) REFERENCES nguoi_dung (id),
  CONSTRAINT ck_quan_tri_vien_so_cccd CHECK (REGEXP_LIKE(so_cccd, '^[0-9]{12}$'))
);

ALTER TABLE nguoi_dung
  ADD CONSTRAINT fk_nguoi_dung_id_quan_tri_vien FOREIGN KEY (id_quan_tri_vien) REFERENCES quan_tri_vien (id);

CREATE TABLE hoc_vien (
  id INT NOT NULL AUTO_INCREMENT,
  id_nguoi_dung INT NOT NULL,
  nghe_nghiep VARCHAR(100) NULL,
  ngay_sinh DATE NULL,
  dia_chi_ip VARCHAR(45) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_hoc_vien_id_nguoi_dung (id_nguoi_dung),
  CONSTRAINT fk_hoc_vien_id_nguoi_dung FOREIGN KEY (id_nguoi_dung) REFERENCES nguoi_dung (id),
  CONSTRAINT ck_hoc_vien_dia_chi_ip CHECK (dia_chi_ip IS NULL OR REGEXP_LIKE(dia_chi_ip, '^[0-9A-Fa-f.:]{2,45}$', 'c'))
);

CREATE TABLE nguoi_cung_cap (
  id INT NOT NULL AUTO_INCREMENT,
  id_nguoi_dung INT NOT NULL,
  ten_ngan_hang VARCHAR(100) NULL,
  so_tai_khoan VARCHAR(20) NULL,
  chu_tai_khoan VARCHAR(100) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_nguoi_cung_cap_id_nguoi_dung (id_nguoi_dung),
  CONSTRAINT fk_nguoi_cung_cap_id_nguoi_dung FOREIGN KEY (id_nguoi_dung) REFERENCES nguoi_dung (id),
  CONSTRAINT ck_nguoi_cung_cap_so_tai_khoan CHECK (so_tai_khoan IS NULL OR REGEXP_LIKE(so_tai_khoan, '^[0-9]{6,20}$')),
  CONSTRAINT ck_nguoi_cung_cap_nhan_tien CHECK (
    (ten_ngan_hang IS NULL) = (so_tai_khoan IS NULL) AND (so_tai_khoan IS NULL) = (chu_tai_khoan IS NULL))
);

CREATE TABLE ma_dat_lai_mat_khau (
  id INT NOT NULL AUTO_INCREMENT,
  id_nguoi_dung INT NOT NULL,
  ma_6_so_da_bam VARCHAR(255) NOT NULL,
  thoi_diem_gui DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  so_lan_sai TINYINT NOT NULL DEFAULT 0,
  da_dung TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  CONSTRAINT fk_ma_dat_lai_mat_khau_id_nguoi_dung FOREIGN KEY (id_nguoi_dung) REFERENCES nguoi_dung (id),
  CONSTRAINT ck_ma_dat_lai_mat_khau_so_lan_sai CHECK (so_lan_sai BETWEEN 0 AND 5)
);

CREATE TABLE xac_minh_ip (
  id INT NOT NULL AUTO_INCREMENT,
  id_hoc_vien INT NOT NULL,
  ma_xac_minh_da_bam VARCHAR(255) NOT NULL,
  dia_chi_ip_moi VARCHAR(45) NOT NULL,
  thoi_diem_gui_ma DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  so_lan_nhap_ma_sai TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_xac_minh_ip_id_hoc_vien (id_hoc_vien),
  CONSTRAINT fk_xac_minh_ip_id_hoc_vien FOREIGN KEY (id_hoc_vien) REFERENCES hoc_vien (id),
  CONSTRAINT ck_xac_minh_ip_so_lan_nhap_ma_sai CHECK (so_lan_nhap_ma_sai BETWEEN 0 AND 5),
  CONSTRAINT ck_xac_minh_ip_dia_chi_ip_moi CHECK (REGEXP_LIKE(dia_chi_ip_moi, '^[0-9A-Fa-f.:]{2,45}$', 'c'))
);

CREATE TABLE danh_muc (
  id INT NOT NULL AUTO_INCREMENT,
  ten VARCHAR(50) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_danh_muc_ten (ten),
  CONSTRAINT ck_danh_muc_ten CHECK (CHAR_LENGTH(ten) BETWEEN 2 AND 50 AND ten = TRIM(ten) AND NOT REGEXP_LIKE(ten, '  ')),
  CONSTRAINT ck_danh_muc_ky_tu CHECK (REGEXP_LIKE(ten, '^[[:alnum:] +#./-]+$'))
);

CREATE TABLE khoa_hoc (
  id INT NOT NULL AUTO_INCREMENT,
  id_nguoi_cung_cap INT NOT NULL,
  id_danh_muc INT NOT NULL,
  ten_khoa_hoc VARCHAR(200) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  mo_ta TEXT NOT NULL,
  anh_bia VARCHAR(255) NULL,
  gia_ban DECIMAL(12,0) NOT NULL,
  hoc_duoc_gi TEXT NULL,
  yeu_cau TEXT NULL,
  danh_cho_ai TEXT NULL,
  trang_thai ENUM('Đang bán','Bị ẩn','Bị gỡ vĩnh viễn') NOT NULL DEFAULT 'Đang bán',
  bi_an_boi ENUM('Tự ẩn','Admin ẩn','Hệ thống - khóa tài khoản') NULL,
  ly_do_an VARCHAR(255) NULL,
  da_xoa TINYINT(1) NOT NULL DEFAULT 0,
  ngay_tao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_khoa_hoc_id_id_nguoi_cung_cap (id, id_nguoi_cung_cap),
  KEY ix_khoa_hoc_trang_thai (trang_thai, da_xoa, id_danh_muc),
  CONSTRAINT fk_khoa_hoc_id_nguoi_cung_cap FOREIGN KEY (id_nguoi_cung_cap) REFERENCES nguoi_cung_cap (id),
  CONSTRAINT fk_khoa_hoc_id_danh_muc FOREIGN KEY (id_danh_muc) REFERENCES danh_muc (id),
  CONSTRAINT ck_khoa_hoc_gia_ban CHECK (gia_ban BETWEEN 10000 AND 50000000),
  CONSTRAINT ck_khoa_hoc_ten_mo_ta CHECK (CHAR_LENGTH(TRIM(ten_khoa_hoc)) > 0 AND CHAR_LENGTH(TRIM(mo_ta)) > 0),
  CONSTRAINT ck_khoa_hoc_bi_an_boi CHECK ((trang_thai = 'Bị ẩn') = (bi_an_boi IS NOT NULL)),
  CONSTRAINT ck_khoa_hoc_ly_do_an CHECK (
    (ly_do_an IS NOT NULL) = (trang_thai = 'Bị gỡ vĩnh viễn' OR (trang_thai = 'Bị ẩn' AND bi_an_boi <> 'Tự ẩn'))
    AND (ly_do_an IS NULL OR CHAR_LENGTH(TRIM(ly_do_an)) > 0))
);

CREATE TABLE bai_hoc (
  id INT NOT NULL AUTO_INCREMENT,
  id_khoa_hoc INT NOT NULL,
  ten_bai_hoc VARCHAR(200) NOT NULL,
  so_thu_tu INT NOT NULL,
  loai ENUM('Video','Tài liệu','Trắc nghiệm') NOT NULL,
  duong_dan_file VARCHAR(255) NULL,
  ten_file VARCHAR(255) NULL,
  dung_luong BIGINT NULL,
  thoi_luong INT NULL,
  ma_bam_file CHAR(64) NULL,
  thoi_gian_lam_bai SMALLINT UNSIGNED NULL,
  da_xoa TINYINT(1) NOT NULL DEFAULT 0,
  khong_chan_ma_bam TINYINT(1) NOT NULL DEFAULT 0,
  ma_bam_dang_dung CHAR(64) GENERATED ALWAYS AS (IF(da_xoa = 0 AND khong_chan_ma_bam = 0, ma_bam_file, NULL)) STORED,
  PRIMARY KEY (id),
  UNIQUE KEY uq_bai_hoc_duong_dan_file (duong_dan_file),
  UNIQUE KEY uq_bai_hoc_ma_bam_dang_dung (ma_bam_dang_dung),
  UNIQUE KEY uq_bai_hoc_id_id_khoa_hoc (id, id_khoa_hoc),
  KEY ix_bai_hoc_khoa_hoc_thu_tu (id_khoa_hoc, da_xoa, so_thu_tu),
  CONSTRAINT fk_bai_hoc_id_khoa_hoc FOREIGN KEY (id_khoa_hoc) REFERENCES khoa_hoc (id),
  CONSTRAINT ck_bai_hoc_ten CHECK (CHAR_LENGTH(TRIM(ten_bai_hoc)) > 0),
  CONSTRAINT ck_bai_hoc_so_thu_tu CHECK (so_thu_tu >= 1),
  CONSTRAINT ck_bai_hoc_ma_bam CHECK (ma_bam_file IS NULL OR REGEXP_LIKE(ma_bam_file, '^[0-9a-f]{64}$', 'c')),
  CONSTRAINT ck_bai_hoc_loai CHECK (
    (loai = 'Video' AND duong_dan_file IS NOT NULL AND ten_file IS NOT NULL AND dung_luong IS NOT NULL
      AND thoi_luong IS NOT NULL AND ma_bam_file IS NOT NULL
      AND thoi_luong BETWEEN 1 AND 21600 AND dung_luong BETWEEN 1 AND 314572800 AND thoi_gian_lam_bai IS NULL)
    OR (loai = 'Tài liệu' AND duong_dan_file IS NOT NULL AND ten_file IS NOT NULL AND dung_luong IS NOT NULL
      AND ma_bam_file IS NOT NULL
      AND thoi_luong IS NULL AND dung_luong BETWEEN 1 AND 20971520 AND thoi_gian_lam_bai IS NULL)
    OR (loai = 'Trắc nghiệm' AND duong_dan_file IS NULL AND ten_file IS NULL AND dung_luong IS NULL
      AND thoi_luong IS NULL AND ma_bam_file IS NULL
      AND thoi_gian_lam_bai IS NOT NULL AND thoi_gian_lam_bai BETWEEN 1 AND 180)),
  CONSTRAINT ck_bai_hoc_trac_nghiem_so_thu_tu CHECK (loai <> 'Trắc nghiệm' OR so_thu_tu <> 1)
);

CREATE TABLE cau_hoi_bai_tap (
  id INT NOT NULL AUTO_INCREMENT,
  id_bai_hoc INT NOT NULL,
  so_thu_tu TINYINT UNSIGNED NOT NULL,
  noi_dung VARCHAR(1000) NOT NULL,
  lua_chon_a VARCHAR(255) NOT NULL,
  lua_chon_b VARCHAR(255) NOT NULL,
  lua_chon_c VARCHAR(255) NOT NULL,
  lua_chon_d VARCHAR(255) NOT NULL,
  dap_an_dung ENUM('A','B','C','D') NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_cau_hoi_bai_tap_id_bai_hoc_so_thu_tu (id_bai_hoc, so_thu_tu),
  CONSTRAINT fk_cau_hoi_bai_tap_id_bai_hoc FOREIGN KEY (id_bai_hoc) REFERENCES bai_hoc (id),
  CONSTRAINT ck_cau_hoi_bai_tap_so_thu_tu CHECK (so_thu_tu BETWEEN 1 AND 50),
  CONSTRAINT ck_cau_hoi_bai_tap_noi_dung CHECK (CHAR_LENGTH(TRIM(noi_dung)) > 0
    AND CHAR_LENGTH(TRIM(lua_chon_a)) > 0 AND CHAR_LENGTH(TRIM(lua_chon_b)) > 0
    AND CHAR_LENGTH(TRIM(lua_chon_c)) > 0 AND CHAR_LENGTH(TRIM(lua_chon_d)) > 0)
);

CREATE TABLE gio_hang (
  id INT NOT NULL AUTO_INCREMENT,
  id_hoc_vien INT NOT NULL,
  id_khoa_hoc INT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_gio_hang_id_hoc_vien_id_khoa_hoc (id_hoc_vien, id_khoa_hoc),
  CONSTRAINT fk_gio_hang_id_hoc_vien FOREIGN KEY (id_hoc_vien) REFERENCES hoc_vien (id),
  CONSTRAINT fk_gio_hang_id_khoa_hoc FOREIGN KEY (id_khoa_hoc) REFERENCES khoa_hoc (id)
);

CREATE TABLE cong_thanh_toan (
  id INT NOT NULL AUTO_INCREMENT,
  ten VARCHAR(50) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_cong_thanh_toan_ten (ten),
  CONSTRAINT ck_cong_thanh_toan_ten CHECK (CHAR_LENGTH(TRIM(ten)) > 0)
);

INSERT INTO cong_thanh_toan (id, ten) VALUES (1, 'VNPay');

CREATE TABLE don_hang (
  id INT NOT NULL AUTO_INCREMENT,
  id_hoc_vien INT NOT NULL,
  id_cong_thanh_toan INT NOT NULL,
  tong_tien DECIMAL(12,0) NOT NULL,
  trang_thai ENUM('Chờ thanh toán','Đã thanh toán','Hết hạn','Thất bại') NOT NULL DEFAULT 'Chờ thanh toán',
  ghi_chu VARCHAR(500) NULL,
  ngay_gui_cong_thanh_toan DATETIME NULL,
  id_giao_dich_thanh_toan INT NULL,
  ngay_tao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  hoc_vien_dang_cho_thanh_toan INT GENERATED ALWAYS AS (IF(trang_thai = 'Chờ thanh toán', id_hoc_vien, NULL)) STORED,
  PRIMARY KEY (id),
  UNIQUE KEY uq_don_hang_hoc_vien_dang_cho_thanh_toan (hoc_vien_dang_cho_thanh_toan),
  KEY ix_don_hang_trang_thai_ngay (trang_thai, ngay_tao),
  KEY ix_don_hang_hoc_vien_ngay (id_hoc_vien, ngay_tao),
  CONSTRAINT fk_don_hang_id_hoc_vien FOREIGN KEY (id_hoc_vien) REFERENCES hoc_vien (id),
  CONSTRAINT fk_don_hang_id_cong_thanh_toan FOREIGN KEY (id_cong_thanh_toan) REFERENCES cong_thanh_toan (id),
  CONSTRAINT ck_don_hang_tong_tien CHECK (tong_tien >= 10000),
  CONSTRAINT ck_don_hang_thanh_toan CHECK (
    (trang_thai = 'Đã thanh toán') = (id_giao_dich_thanh_toan IS NOT NULL)
    AND (trang_thai <> 'Đã thanh toán' OR ngay_gui_cong_thanh_toan IS NOT NULL))
);

CREATE TABLE chi_tiet_don_hang (
  id INT NOT NULL AUTO_INCREMENT,
  id_don_hang INT NOT NULL,
  id_khoa_hoc INT NOT NULL,
  ten_khoa_hoc VARCHAR(200) NOT NULL,
  gia DECIMAL(12,0) NOT NULL,
  nguon_ban ENUM('Giới thiệu','Học viên giới thiệu','Tự nhiên') NOT NULL DEFAULT 'Tự nhiên',
  ti_le_chia TINYINT UNSIGNED NOT NULL,
  da_hoan_tien TINYINT(1) NOT NULL DEFAULT 0,
  id_quan_tri_vien INT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_chi_tiet_don_hang_id_don_hang_id_khoa_hoc (id_don_hang, id_khoa_hoc),
  CONSTRAINT fk_chi_tiet_don_hang_id_don_hang FOREIGN KEY (id_don_hang) REFERENCES don_hang (id),
  CONSTRAINT fk_chi_tiet_don_hang_id_khoa_hoc FOREIGN KEY (id_khoa_hoc) REFERENCES khoa_hoc (id),
  CONSTRAINT fk_chi_tiet_don_hang_id_quan_tri_vien FOREIGN KEY (id_quan_tri_vien) REFERENCES quan_tri_vien (id),
  CONSTRAINT ck_chi_tiet_don_hang_gia CHECK (gia BETWEEN 10000 AND 50000000),
  CONSTRAINT ck_chi_tiet_don_hang_ti_le CHECK (
    (nguon_ban = 'Giới thiệu' AND ti_le_chia = 90) OR (nguon_ban <> 'Giới thiệu' AND ti_le_chia = 60)),
  CONSTRAINT ck_chi_tiet_don_hang_hoan_tien CHECK ((da_hoan_tien = 1) = (id_quan_tri_vien IS NOT NULL))
);

CREATE TABLE giao_dich_thanh_toan (
  id INT NOT NULL AUTO_INCREMENT,
  id_cong_thanh_toan INT NOT NULL,
  id_don_hang INT NULL,
  ma_don_cong_gui_ve VARCHAR(100) NOT NULL,
  nguon_den ENUM('Trình duyệt','Máy chủ cổng thanh toán','Kiểm tra lại') NOT NULL,
  ma_ket_qua VARCHAR(20) NULL,
  so_tien DECIMAL(15,0) NULL,
  ma_giao_dich_cong VARCHAR(50) NULL,
  chu_ky_hop_le TINYINT(1) NOT NULL,
  du_lieu_goc JSON NOT NULL,
  thoi_diem_nhan_ket_qua DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_giao_dich_thanh_toan_id_id_don_hang (id, id_don_hang),
  CONSTRAINT fk_giao_dich_thanh_toan_id_cong_thanh_toan FOREIGN KEY (id_cong_thanh_toan) REFERENCES cong_thanh_toan (id),
  CONSTRAINT fk_giao_dich_thanh_toan_id_don_hang FOREIGN KEY (id_don_hang) REFERENCES don_hang (id)
);

ALTER TABLE don_hang
  ADD CONSTRAINT fk_don_hang_giao_dich_thanh_toan FOREIGN KEY (id_giao_dich_thanh_toan, id) REFERENCES giao_dich_thanh_toan (id, id_don_hang);

CREATE TABLE tien_do_hoc (
  id INT NOT NULL AUTO_INCREMENT,
  id_hoc_vien INT NOT NULL,
  id_bai_hoc INT NOT NULL,
  lan_mo_gan_nhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  vi_tri_xem_cu INT NULL,
  moc_luu_video INT NULL,
  da_hoc_xong TINYINT(1) NOT NULL DEFAULT 0,
  diem_cao_nhat DECIMAL(4,2) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_tien_do_hoc_id_hoc_vien_id_bai_hoc (id_hoc_vien, id_bai_hoc),
  CONSTRAINT fk_tien_do_hoc_id_hoc_vien FOREIGN KEY (id_hoc_vien) REFERENCES hoc_vien (id),
  CONSTRAINT fk_tien_do_hoc_id_bai_hoc FOREIGN KEY (id_bai_hoc) REFERENCES bai_hoc (id),
  CONSTRAINT ck_tien_do_hoc_giay CHECK ((vi_tri_xem_cu IS NULL OR vi_tri_xem_cu >= 0) AND (moc_luu_video IS NULL OR moc_luu_video >= 0)),
  CONSTRAINT ck_tien_do_hoc_diem_cao_nhat CHECK (diem_cao_nhat IS NULL OR diem_cao_nhat BETWEEN 0 AND 10)
);

CREATE TABLE luot_lam_bai (
  id INT NOT NULL AUTO_INCREMENT,
  id_hoc_vien INT NOT NULL,
  id_bai_hoc INT NOT NULL,
  thoi_diem_bat_dau DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cau_tra_loi JSON NOT NULL DEFAULT (JSON_OBJECT()),
  PRIMARY KEY (id),
  UNIQUE KEY uq_luot_lam_bai_id_hoc_vien_id_bai_hoc (id_hoc_vien, id_bai_hoc),
  CONSTRAINT fk_luot_lam_bai_id_hoc_vien FOREIGN KEY (id_hoc_vien) REFERENCES hoc_vien (id),
  CONSTRAINT fk_luot_lam_bai_id_bai_hoc FOREIGN KEY (id_bai_hoc) REFERENCES bai_hoc (id)
);

CREATE TABLE yeu_cau_rut_tien (
  id INT NOT NULL AUTO_INCREMENT,
  id_nguoi_cung_cap INT NOT NULL,
  so_tien DECIMAL(12,0) NOT NULL,
  ten_ngan_hang VARCHAR(100) NOT NULL,
  so_tai_khoan VARCHAR(20) NOT NULL,
  chu_tai_khoan VARCHAR(100) NOT NULL,
  trang_thai ENUM('Chờ duyệt','Đã chuyển','Từ chối') NOT NULL DEFAULT 'Chờ duyệt',
  ly_do_tu_choi VARCHAR(255) NULL,
  ma_giao_dich_ngan_hang VARCHAR(50) NULL,
  id_quan_tri_vien INT NULL,
  ngay_tao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngay_xu_ly DATETIME NULL,
  nguoi_cung_cap_dang_cho_duyet INT GENERATED ALWAYS AS (IF(trang_thai = 'Chờ duyệt', id_nguoi_cung_cap, NULL)) STORED,
  PRIMARY KEY (id),
  UNIQUE KEY uq_yeu_cau_rut_tien_nguoi_cung_cap_dang_cho_duyet (nguoi_cung_cap_dang_cho_duyet),
  UNIQUE KEY uq_yeu_cau_rut_tien_id_id_nguoi_cung_cap (id, id_nguoi_cung_cap),
  CONSTRAINT fk_yeu_cau_rut_tien_id_nguoi_cung_cap FOREIGN KEY (id_nguoi_cung_cap) REFERENCES nguoi_cung_cap (id),
  CONSTRAINT fk_yeu_cau_rut_tien_id_quan_tri_vien FOREIGN KEY (id_quan_tri_vien) REFERENCES quan_tri_vien (id),
  CONSTRAINT ck_yeu_cau_rut_tien_so_tien CHECK (so_tien >= 100000),
  CONSTRAINT ck_yeu_cau_rut_tien_so_tai_khoan CHECK (REGEXP_LIKE(so_tai_khoan, '^[0-9]{6,20}$')),
  CONSTRAINT ck_yeu_cau_rut_tien_xu_ly CHECK (
    (trang_thai = 'Chờ duyệt') = (ngay_xu_ly IS NULL) AND (ngay_xu_ly IS NULL) = (id_quan_tri_vien IS NULL)),
  CONSTRAINT ck_yeu_cau_rut_tien_ly_do CHECK ((trang_thai = 'Từ chối') = (ly_do_tu_choi IS NOT NULL)
    AND (ly_do_tu_choi IS NULL OR CHAR_LENGTH(TRIM(ly_do_tu_choi)) > 0)),
  CONSTRAINT ck_yeu_cau_rut_tien_ma_gd CHECK (ma_giao_dich_ngan_hang IS NULL OR trang_thai = 'Đã chuyển')
);

CREATE TABLE thong_bao (
  id INT NOT NULL AUTO_INCREMENT,
  id_nguoi_cung_cap INT NOT NULL,
  loai ENUM('Khóa học bị ẩn','Khóa học bị gỡ vĩnh viễn','Đã chuyển tiền','Từ chối rút tiền') NOT NULL,
  id_khoa_hoc INT NULL,
  id_yeu_cau_rut_tien INT NULL,
  noi_dung TEXT NOT NULL,
  da_doc TINYINT(1) NOT NULL DEFAULT 0,
  ngay_tao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_thong_bao_yeu_cau (id_yeu_cau_rut_tien),
  KEY ix_thong_bao_nguoi_nhan (id_nguoi_cung_cap, da_doc, ngay_tao),
  CONSTRAINT fk_thong_bao_id_nguoi_cung_cap FOREIGN KEY (id_nguoi_cung_cap) REFERENCES nguoi_cung_cap (id),
  CONSTRAINT fk_thong_bao_khoa_hoc FOREIGN KEY (id_khoa_hoc, id_nguoi_cung_cap) REFERENCES khoa_hoc (id, id_nguoi_cung_cap),
  CONSTRAINT fk_thong_bao_yeu_cau_rut_tien FOREIGN KEY (id_yeu_cau_rut_tien, id_nguoi_cung_cap) REFERENCES yeu_cau_rut_tien (id, id_nguoi_cung_cap),
  CONSTRAINT ck_thong_bao_doi_tuong CHECK (
    (loai IN ('Đã chuyển tiền','Từ chối rút tiền') AND id_yeu_cau_rut_tien IS NOT NULL AND id_khoa_hoc IS NULL)
    OR (loai IN ('Khóa học bị ẩn','Khóa học bị gỡ vĩnh viễn') AND id_khoa_hoc IS NOT NULL AND id_yeu_cau_rut_tien IS NULL))
);

CREATE TABLE danh_gia (
  id INT NOT NULL AUTO_INCREMENT,
  id_hoc_vien INT NOT NULL,
  id_khoa_hoc INT NOT NULL,
  so_sao TINYINT NOT NULL,
  nhan_xet VARCHAR(1000) NULL,
  bi_an TINYINT(1) NOT NULL DEFAULT 0,
  ly_do_an VARCHAR(255) NULL,
  id_quan_tri_vien INT NULL,
  ngay_tao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_danh_gia_id_hoc_vien_id_khoa_hoc (id_hoc_vien, id_khoa_hoc),
  CONSTRAINT fk_danh_gia_id_hoc_vien FOREIGN KEY (id_hoc_vien) REFERENCES hoc_vien (id),
  CONSTRAINT fk_danh_gia_id_khoa_hoc FOREIGN KEY (id_khoa_hoc) REFERENCES khoa_hoc (id),
  CONSTRAINT fk_danh_gia_id_quan_tri_vien FOREIGN KEY (id_quan_tri_vien) REFERENCES quan_tri_vien (id),
  CONSTRAINT ck_danh_gia_so_sao CHECK (so_sao BETWEEN 1 AND 5),
  CONSTRAINT ck_danh_gia_an CHECK ((bi_an = 1) = (ly_do_an IS NOT NULL) AND (bi_an = 1) = (id_quan_tri_vien IS NOT NULL)
    AND (ly_do_an IS NULL OR CHAR_LENGTH(TRIM(ly_do_an)) > 0))
);

CREATE TABLE bao_cao_danh_gia (
  id INT NOT NULL AUTO_INCREMENT,
  id_danh_gia INT NOT NULL,
  id_hoc_vien INT NOT NULL,
  ly_do ENUM('Ngôn từ phản cảm','Quảng cáo hoặc spam','Lý do khác') NOT NULL,
  ghi_chu VARCHAR(500) NULL,
  so_sao_luc_bao_cao TINYINT NOT NULL,
  nhan_xet_luc_bao_cao VARCHAR(1000) NULL,
  bien_phap_xu_ly ENUM('Ẩn đánh giá','Không vi phạm') NULL,
  id_quan_tri_vien INT NULL,
  ngay_tao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_bao_cao_danh_gia_id_hoc_vien_id_danh_gia (id_hoc_vien, id_danh_gia),
  CONSTRAINT fk_bao_cao_danh_gia_id_danh_gia FOREIGN KEY (id_danh_gia) REFERENCES danh_gia (id),
  CONSTRAINT fk_bao_cao_danh_gia_id_hoc_vien FOREIGN KEY (id_hoc_vien) REFERENCES hoc_vien (id),
  CONSTRAINT fk_bao_cao_danh_gia_id_quan_tri_vien FOREIGN KEY (id_quan_tri_vien) REFERENCES quan_tri_vien (id),
  CONSTRAINT ck_bao_cao_danh_gia_so_sao CHECK (so_sao_luc_bao_cao BETWEEN 1 AND 5),
  CONSTRAINT ck_bao_cao_danh_gia_xu_ly CHECK ((bien_phap_xu_ly IS NULL) = (id_quan_tri_vien IS NULL))
);

CREATE TABLE bao_cao_khoa_hoc (
  id INT NOT NULL AUTO_INCREMENT,
  id_hoc_vien INT NOT NULL,
  id_khoa_hoc INT NULL,
  id_bai_hoc INT NULL,
  ly_do ENUM('Nội dung phản cảm','Vi phạm bản quyền','Lừa đảo hoặc mô tả sai nội dung','Lý do khác') NOT NULL,
  ghi_chu VARCHAR(500) NULL,
  bien_phap_xu_ly ENUM('Không vi phạm','Ẩn khóa','Gỡ vĩnh viễn') NULL,
  id_quan_tri_vien INT NULL,
  ngay_tao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bai_hoc_dang_cho_xu_ly INT GENERATED ALWAYS AS (IF(bien_phap_xu_ly IS NULL, id_bai_hoc, NULL)) STORED,
  khoa_hoc_dang_cho_xu_ly INT GENERATED ALWAYS AS (IF(bien_phap_xu_ly IS NULL, id_khoa_hoc, NULL)) STORED,
  PRIMARY KEY (id),
  UNIQUE KEY uq_bao_cao_khoa_hoc_bai_hoc_dang_cho_xu_ly (id_hoc_vien, bai_hoc_dang_cho_xu_ly),
  UNIQUE KEY uq_bao_cao_khoa_hoc_khoa_hoc_dang_cho_xu_ly (id_hoc_vien, khoa_hoc_dang_cho_xu_ly),
  CONSTRAINT fk_bao_cao_khoa_hoc_id_hoc_vien FOREIGN KEY (id_hoc_vien) REFERENCES hoc_vien (id),
  CONSTRAINT fk_bao_cao_khoa_hoc_id_khoa_hoc FOREIGN KEY (id_khoa_hoc) REFERENCES khoa_hoc (id),
  CONSTRAINT fk_bao_cao_khoa_hoc_id_bai_hoc FOREIGN KEY (id_bai_hoc) REFERENCES bai_hoc (id),
  CONSTRAINT fk_bao_cao_khoa_hoc_id_quan_tri_vien FOREIGN KEY (id_quan_tri_vien) REFERENCES quan_tri_vien (id),
  CONSTRAINT ck_bao_cao_khoa_hoc_doi_tuong CHECK ((id_khoa_hoc IS NULL) <> (id_bai_hoc IS NULL)),
  CONSTRAINT ck_bao_cao_khoa_hoc_ghi_chu CHECK (ly_do <> 'Lý do khác' OR (ghi_chu IS NOT NULL AND CHAR_LENGTH(TRIM(ghi_chu)) > 0)),
  CONSTRAINT ck_bao_cao_khoa_hoc_xu_ly CHECK ((bien_phap_xu_ly IS NULL) = (id_quan_tri_vien IS NULL))
);

CREATE TABLE lich_su_khoa_hoc (
  id INT NOT NULL AUTO_INCREMENT,
  id_khoa_hoc INT NOT NULL,
  id_bai_hoc INT NULL,
  id_nguoi_dung INT NOT NULL,
  hanh_dong ENUM('Đăng khóa học','Sửa thông tin khóa','Đổi giá','Đổi ảnh bìa','Đổi danh mục',
    'Thêm bài','Sửa bài','Thay file','Đổi thứ tự bài','Xóa bài',
    'Người cung cấp ẩn','Người cung cấp đăng lại','Người cung cấp xóa khóa học',
    'Quản trị viên ẩn khóa','Quản trị viên gỡ vĩnh viễn','Quản trị viên gộp danh mục',
    'Hệ thống ẩn do khóa tài khoản','Hệ thống gỡ vĩnh viễn','Hệ thống bán lại do mở khóa tài khoản') NOT NULL,
  noi_dung_thay_doi VARCHAR(255) NULL,
  gia_tri_cu TEXT NULL,
  gia_tri_moi TEXT NULL,
  duong_dan_file_cu VARCHAR(255) NULL,
  ghi_chu VARCHAR(255) NULL,
  ngay_tao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ix_lich_su_khoa_hoc_khoa_ngay (id_khoa_hoc, ngay_tao),
  CONSTRAINT fk_lich_su_khoa_hoc_id_khoa_hoc FOREIGN KEY (id_khoa_hoc) REFERENCES khoa_hoc (id),
  CONSTRAINT fk_lich_su_khoa_hoc_bai_hoc FOREIGN KEY (id_bai_hoc, id_khoa_hoc) REFERENCES bai_hoc (id, id_khoa_hoc),
  CONSTRAINT fk_lich_su_khoa_hoc_id_nguoi_dung FOREIGN KEY (id_nguoi_dung) REFERENCES nguoi_dung (id)
);
