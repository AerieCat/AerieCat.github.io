import os
from PIL import Image

def create_thumbnail(image_path):
    image = Image.open(image_path)
    width, height = image.size
    new_width = 360
    new_height = int(height * (new_width / width))
    thumbnail = image.resize((new_width, new_height), Image.ANTIALIAS)
    return thumbnail

def main():
    script_directory = os.path.dirname(os.path.abspath(__file__))
    output_directory = os.path.join(script_directory, "thumbnails")

    if not os.path.exists(output_directory):
        os.makedirs(output_directory)

    for filename in os.listdir(script_directory):
        if filename.lower().endswith((".png", ".jpg", ".jpeg")) and "thumbnail" not in filename:
            image_path = os.path.join(script_directory, filename)
            thumbnail_path = os.path.join(output_directory, f"{filename.split('.')[0]}-thumbnail.png")

            if not os.path.exists(thumbnail_path):
                thumbnail = create_thumbnail(image_path)
                thumbnail.save(thumbnail_path)
                print(f"Created thumbnail: {thumbnail_path}")

if __name__ == "__main__":
    main()
