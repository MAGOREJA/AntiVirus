import os
import shutil
import datetime

QUARANTINE_FOLDER = "quarantine"
QUARANTINE_LOG = "quarantine_log.txt"

def ensure_quarantine_folder():
    if not os.path.exists(QUARANTINE_FOLDER):
        os.makedirs(QUARANTINE_FOLDER)

def quarantine_file(file_path):
    ensure_quarantine_folder()
    try:
        filename = os.path.basename(file_path)
        timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        new_name = f"{timestamp}_{filename}.quarantined"
        dest_path = os.path.join(QUARANTINE_FOLDER, new_name)

        shutil.move(file_path, dest_path)
        
        with open(QUARANTINE_LOG, "a") as log:
            log.write(f"{file_path} -> {dest_path}\n")

        return dest_path
    except Exception as e:
        return f"Failed to quarantine: {e}"

def view_quarantine_log(self):
    try:
        if os.path.exists(QUARANTINE_LOG):
            with open(QUARANTINE_LOG, "r") as f:
                content = f.read()
            self.result_box.setPlainText("🔐 Quarantine Log:\n\n" + content)
        else:
            self.result_box.setPlainText("No quarantine log found.")
    except Exception as e:
        self.result_box.setPlainText(f"Error reading log: {e}")
