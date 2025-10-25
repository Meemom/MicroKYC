from google.cloud import vision

# Add any key-related functionality here
def get_vision_client():
    return vision.ImageAnnotatorClient()