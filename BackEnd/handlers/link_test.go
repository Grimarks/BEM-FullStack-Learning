package handlers

import "testing"

func TestValidLink(t *testing.T) {
	diterima := []string{"", "https://example.com", "http://localhost:5173", "#proyek", "/cv.pdf", "mailto:halo@example.com"}
	ditolak := []string{"javascript:alert(1)", "//evil.com", "data:text/html,x", "ftp://example.com", "#", "/../etc/passwd", "mailto:bukan email", "contoh.com"}
	for _, v := range diterima {
		if !validLink(v) {
			t.Errorf("harus diterima: %q", v)
		}
	}
	for _, v := range ditolak {
		if validLink(v) {
			t.Errorf("harus ditolak: %q", v)
		}
	}
}
