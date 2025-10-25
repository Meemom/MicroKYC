def validate_file_type(filename: str) -> bool:
    allowed_ext = ['pdf', 'png', 'jpg', 'jpeg']
    return filename.split('.')[-1].lower() in allowed_ext