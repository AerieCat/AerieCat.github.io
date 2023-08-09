from PIL import Image
import os

def scale_image(image_path, new_width):
    img = Image.open(image_path)
    width_percent = (new_width / float(img.size[0]))
    new_height = int((float(img.size[1]) * float(width_percent)))
    new_img = img.resize((new_width, new_height), Image.ANTIALIAS)
    new_img.save(image_path)

if __name__ == '__main__':
    script_dir = os.path.dirname(os.path.abspath(__file__))
    new_width = 800

    for filename in os.listdir(script_dir):
        if filename.endswith('.png'):
            image_path = os.path.join(script_dir, filename)
            scale_image(image_path, new_width)
