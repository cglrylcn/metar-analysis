#!/usr/bin/env python3
"""METAR Rüzgar Tahmin — Lokal sunucu (CORS proxy + statik dosya)"""

import http.server
import json
import urllib.request
import urllib.error
import os
import sys

PORT = 8787

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # API proxy endpoint
        if self.path.startswith('/api/metar?'):
            query = self.path.split('?', 1)[1]
            url = f"https://aviationweather.gov/api/data/metar?{query}"
            try:
                req = urllib.request.Request(url, headers={
                    'User-Agent': 'Mozilla/5.0 MetarWindApp/1.0'
                })
                with urllib.request.urlopen(req, timeout=15) as resp:
                    data = resp.read().decode('utf-8')
                self.send_response(200)
                self.send_header('Content-Type', 'text/plain; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(data.encode('utf-8'))
            except urllib.error.URLError as e:
                self.send_response(502)
                self.send_header('Content-Type', 'text/plain')
                self.end_headers()
                self.wfile.write(f"Upstream error: {e}".encode())
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'text/plain')
                self.end_headers()
                self.wfile.write(f"Server error: {e}".encode())
            return

        # Serve static files (index.html etc.)
        return super().do_GET()

    def log_message(self, format, *args):
        print(f"  {args[0]}")

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    server = http.server.HTTPServer(('127.0.0.1', PORT), Handler)
    print(f"\n  ✈️  METAR Rüzgar Tahmin Sistemi")
    print(f"  ─────────────────────────────")
    print(f"  🌐 http://localhost:{PORT}")
    print(f"  Durdurmak için Ctrl+C\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n  Sunucu kapatıldı.")
        server.server_close()
