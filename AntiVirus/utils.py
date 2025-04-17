import hashlib

def get_file_hash(file_path, algo="sha256"):
    hasher = hashlib.new(algo)
    with open(file_path, 'rb') as f:
        while chunk := f.read(8192):
            hasher.update(chunk)
    return hasher.hexdigest()
