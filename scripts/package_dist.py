import os
import zipfile
import shutil

def package_dist():
    app_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    dist_dir = os.path.join(app_dir, 'dist')
    zip_path = os.path.join(app_dir, 'dojo-app-build.zip')
    public_zip = os.path.join(app_dir, 'public', 'dojo-app-build.zip')
    dist_zip = os.path.join(dist_dir, 'dojo-app-build.zip')

    if not os.path.exists(dist_dir):
        print(f"Error: {dist_dir} does not exist. Run build first.")
        return False

    print(f"Creating {zip_path} from {dist_dir}...")
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(dist_dir):
            for file in files:
                if file == 'dojo-app-build.zip':
                    continue
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, dist_dir)
                zf.write(full_path, rel_path)

    # Copy to public/ and dist/
    os.makedirs(os.path.dirname(public_zip), exist_ok=True)
    shutil.copyfile(zip_path, public_zip)
    shutil.copyfile(zip_path, dist_zip)

    # Also copy to lionmode-karate-update-v3.zip to avoid browser cache collision
    v3_zip = os.path.join(app_dir, 'lionmode-karate-update-v3.zip')
    v3_public = os.path.join(app_dir, 'public', 'lionmode-karate-update-v3.zip')
    v3_dist = os.path.join(dist_dir, 'lionmode-karate-update-v3.zip')
    shutil.copyfile(zip_path, v3_zip)
    shutil.copyfile(zip_path, v3_public)
    shutil.copyfile(zip_path, v3_dist)

    size_mb = os.path.getsize(zip_path) / (1024 * 1024)
    print(f"SUCCESS: Packaged {zip_path} and {v3_zip} ({size_mb:.2f} MB)")
    print(f"Copied to {public_zip} and {v3_public}")
    return True

if __name__ == '__main__':
    package_dist()
