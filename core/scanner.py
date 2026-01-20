import requests
import os
import base64

class LinkScanner:
    def __init__(self):
        # Change this to match whatever you named it in your .env file!
        self.api_key = os.getenv("VT_API_KEY") or os.getenv("URLSCAN_API_KEY")
        self.base_url = "https://www.virustotal.com/api/v3/urls"

    def scan(self, target_url):
        if not self.api_key:
            return {"error": "API Key missing in .env file"}

        try:
            # VirusTotal needs the URL encoded in Base64
            url_id = base64.urlsafe_b64encode(target_url.encode()).decode().strip("=")
            headers = {"x-apikey": self.api_key}
            
            response = requests.get(f"{self.base_url}/{url_id}", headers=headers)
            print(f"DEBUG: VT Status {response.status_code}")

            if response.status_code == 200:
                attr = response.json()['data']['attributes']
                stats = attr['last_analysis_stats']
                return {
                    "malicious": stats['malicious'],
                    "safe": stats['harmless'],
                    "link": f"https://www.virustotal.com/gui/url/{url_id}/detection"
                }
            else:
                return {"error": f"VirusTotal Error {response.status_code}. Try a well-known link like google.com"}
        except Exception as e:
            return {"error": str(e)}