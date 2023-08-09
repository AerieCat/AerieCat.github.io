from PIL import Image
import os

def resize_image(image_path, output_folder, new_width, new_height):
    img = Image.open(image_path)

    # Convert RGBA image to RGB
    if img.mode == 'RGBA':
        img = img.convert('RGB')

    resized_img = img.resize((new_width, new_height), Image.ANTIALIAS)
    base_name = os.path.splitext(os.path.basename(image_path))[0]
    output_path = os.path.join(output_folder, f'{base_name}_small.jpg')
    resized_img.save(output_path)

if __name__ == '__main__':
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_folder = script_dir
    new_width = 854  # 480p width
    new_height = 480  # 480p height

    for filename in os.listdir(script_dir):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            image_path = os.path.join(script_dir, filename)
            resize_image(image_path, output_folder, new_width, new_height)

