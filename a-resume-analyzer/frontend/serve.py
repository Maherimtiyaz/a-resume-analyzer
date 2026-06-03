#!/usr/bin/env python3
"""
Python HTTP Server for serving the React frontend built with Vite.
Handles SPA routing by redirecting non-existent files to index.html
"""

import os
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

class SPAHandler(SimpleHTTPRequestHandler):
    """Handler for Single Page Application (SPA) routing"""
    
    def do_GET(self):
        # Get the file path
        file_path = Path(self.path.lstrip('/'))
        
        # If the path doesn't exist and it's not a known file type, serve index.html
        if not (Path('.') / file_path).exists() and not self.path.startswith('/api'):
            if not self.path.endswith(('.js', '.css', '.png', '.jpg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf')):
                self.path = '/index.html'
        
        return super().do_GET()
    
    def end_headers(self):
        """Add cache control headers"""
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        return super().end_headers()
    
    def log_message(self, format, *args):
        """Custom logging format"""
        sys.stderr.write(f"[{self.log_date_time_string()}] {format % args}\n")


def run_server(port=3000, directory='dist'):
    """Start the HTTP server"""
    
    # Get the script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Check for dist/dist first (Vite double nesting), then fall back to dist
    full_directory = os.path.join(script_dir, directory, 'dist')
    if not os.path.exists(full_directory):
        full_directory = os.path.join(script_dir, directory)
    
    # Change to the dist directory
    if not os.path.exists(full_directory):
        print(f"❌ Error: Directory '{full_directory}' not found!")
        print(f"Please run 'npm run build' first to create the {directory} folder.")
        sys.exit(1)
    
    os.chdir(full_directory)
    
    server_address = ('0.0.0.0', port)
    httpd = HTTPServer(server_address, SPAHandler)
    
    print(f"""
╔════════════════════════════════════════╗
║     AI Resume Analyzer Frontend        ║
║        Python HTTP Server              ║
╚════════════════════════════════════════╝

✅ Server starting...
📍 URL: http://localhost:{port}
📁 Serving from: {os.path.abspath(directory)}
🔄 SPA routing enabled

Press Ctrl+C to stop the server
""")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n👋 Shutting down server...")
        httpd.shutdown()
        print("✅ Server stopped.")
        sys.exit(0)


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 3000
    directory = sys.argv[2] if len(sys.argv) > 2 else 'dist'
    run_server(port, directory)
