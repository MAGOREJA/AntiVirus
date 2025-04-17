import sys
import os
from PyQt5.QtWidgets import (
    QApplication, QWidget, QVBoxLayout, QPushButton,
    QTextEdit, QFileDialog, QLabel
)
from quarantine import quarantine_file, QUARANTINE_LOG
from scanner import load_signatures, scan_file


class AntivirusGUI(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Python Antivirus")
        self.setGeometry(100, 100, 600, 400)
        self.setup_ui()

    def setup_ui(self):
        layout = QVBoxLayout()

        self.label = QLabel("Choose a folder to scan:")
        layout.addWidget(self.label)

        self.result_box = QTextEdit()
        self.result_box.setReadOnly(True)
        layout.addWidget(self.result_box)

        self.scan_button = QPushButton("Scan Folder")
        layout.addWidget(self.scan_button)
        self.scan_button.clicked.connect(self.scan_folder)

        self.log_button = QPushButton("View Quarantine Log")
        layout.addWidget(self.log_button)
        self.log_button.clicked.connect(self.view_quarantine_log)

        self.setLayout(layout)

    def scan_folder(self):
        folder_path = QFileDialog.getExistingDirectory(self, "Select Folder to Scan")
        if not folder_path:
            return

        self.result_box.clear()
        self.result_box.append(f"Scanning folder: {folder_path}\n")

        signatures = load_signatures()
        infected_files = []

        for root, dirs, files in os.walk(folder_path):
            for file in files:
                full_path = os.path.join(root, file)
                try:
                    result, malware_name = scan_file(full_path, signatures)
                    if result:
                        msg = f"[!!] Infected: {full_path} (matched: {malware_name})"
                        quarantined_to = quarantine_file(full_path)
                        msg += f"\n     ➤ Quarantined to: {quarantined_to}"
                        infected_files.append(full_path)
                    else:
                        msg = f"[OK] {full_path}"
                    self.result_box.append(msg)
                except Exception as e:
                    self.result_box.append(f"[ERROR] {full_path} - {e}")

        if infected_files:
            self.result_box.append("\nScan Complete. Infected files found and quarantined:")
            for f in infected_files:
                self.result_box.append(f)
        else:
            self.result_box.append("\nScan Complete. No threats found.")

    def view_quarantine_log(self):
        log_text = ""
        try:
            with open(QUARANTINE_LOG, "r") as log_file:
                log_text = log_file.read()
        except FileNotFoundError:
            log_text = "No quarantine log found."

        log_viewer = QTextEdit()
        log_viewer.setReadOnly(True)
        log_viewer.setText(log_text)
        log_viewer.setWindowTitle("Quarantine Log")
        log_viewer.resize(500, 400)
        log_viewer.show()


# Run the app
if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = AntivirusGUI()
    window.show()
    sys.exit(app.exec_())