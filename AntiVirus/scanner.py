import json
from utils import get_file_hash

def load_signatures(path="signatures.json"):
    with open(path, 'r') as f:
        return json.load(f)

def scan_file(file_path, signatures):
    file_hash = get_file_hash(file_path)
    for name, sig_hash in signatures.items():
        if file_hash == sig_hash:
            return True, name
    return False, None
