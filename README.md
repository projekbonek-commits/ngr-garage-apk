# NGR v7 Map Rusdi

Rework NGR: GPS live dibuang. Fokus manual daily KM, MapLibre route planner titik-ke-titik, fuel, money, dan Kang Rusdi Assist.

## Build APK
1. Upload/replace semua file ZIP ini ke repo GitHub.
2. Buka Actions.
3. Run workflow `Build NGR v7 APK`.
4. Download artifact APK debug.

## Route ikut jalan
- Default: OSRM public demo fallback.
- Lebih stabil: isi OpenRouteService API Key di Settings.
- Kalau routing gagal/internet mati, app fallback garis lurus dan ditandai jelas.

## Reminder
- Web fallback aktif saat app dibuka.
- APK mencoba pakai Capacitor Local Notifications jika plugin tersedia.
