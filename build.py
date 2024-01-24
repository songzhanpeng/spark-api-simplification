import os
import json

def generate_json(folder_path, output_file):
    image_files = [f for f in os.listdir(folder_path) if f.endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp'))]

    image_data = []
    for image_file in image_files:
        image_path = os.path.join(folder_path, image_file)
        image_info = {
            'filename': image_file,
            'path': image_path,
            'size': os.path.getsize(image_path),  # 文件大小
            'last_modified': os.path.getmtime(image_path),  # 最后修改时间
        }
        image_data.append(image_info)

    with open(output_file, 'w') as json_file:
        json.dump(image_data, json_file, indent=2)

# 指定图片文件夹路径和输出 JSON 文件路径
image_folder_path = 'public'
output_json_file = './output.json'

# 生成 JSON 文件
generate_json(image_folder_path, output_json_file)
