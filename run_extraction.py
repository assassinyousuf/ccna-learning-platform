import os
import sys
import subprocess
import zipfile
import time
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
BOOKS_DIR = BASE_DIR / "books" / "McDowell J. Acing the CCNA Exam  Vol 2. Advanced Networking and Security 2024"

VOLUMES = [
    {
        "name": "Volume 1 - Fundamentals and Protocols",
        "pdf": BOOKS_DIR / "McDowell J. Acing the CCNA Exam  Vol 1. Fundamentals and Protocols 2024.pdf",
        "output_dir": BASE_DIR / "extracted_content" / "vol1",
    },
    {
        "name": "Volume 2 - Advanced Networking and Security",
        "pdf": BOOKS_DIR / "McDowell J. Acing the CCNA Exam  Vol 2. Advanced Networking and Security 2024.pdf",
        "output_dir": BASE_DIR / "extracted_content" / "vol2",
    },
]

MINERU_KIT = BASE_DIR / ".venv" / "Scripts" / "mineru-kit.exe"

def run_extraction():
    print("=== Starting MinerU Extraction Pipeline (Tier: Basic / GPU Accelerated) ===")
    print(f"MinerU executable: {MINERU_KIT}")
    print(f"Target books: {len(VOLUMES)}")

    total_start = time.time()

    for idx, vol in enumerate(VOLUMES, 1):
        name = vol["name"]
        pdf_path = vol["pdf"]
        out_dir = vol["output_dir"]
        zip_temp_dir = out_dir / "zip_temp"

        print(f"\n[{idx}/{len(VOLUMES)}] Processing: {name}")
        print(f"  Source: {pdf_path}")
        print(f"  Output: {out_dir}")

        if not pdf_path.exists():
            print(f"  ERROR: File not found: {pdf_path}")
            continue

        zip_temp_dir.mkdir(parents=True, exist_ok=True)
        out_dir.mkdir(parents=True, exist_ok=True)

        cmd = [
            str(MINERU_KIT),
            "parse",
            str(pdf_path),
            "-o", str(zip_temp_dir),
            "-f", "zip",
            "--tier", "basic",
            "--pages", "all",
            "-v"
        ]

        vol_start = time.time()
        print("  Executing MinerU parse (all pages)...")
        ret = subprocess.run(cmd)

        if ret.returncode != 0:
            print(f"  ERROR: mineru-kit returned exit code {ret.returncode}")
            continue

        # Look for zip file in zip_temp_dir
        zip_files = list(zip_temp_dir.glob("*.zip"))
        if not zip_files:
            print(f"  WARNING: No zip file found in {zip_temp_dir}")
        else:
            zip_file = zip_files[0]
            size_mb = zip_file.stat().st_size / 1024 / 1024
            print(f"  Found output package: {zip_file.name} ({size_mb:.2f} MB)")
            print(f"  Unpacking contents to {out_dir}...")
            with zipfile.ZipFile(zip_file, 'r') as zf:
                zf.extractall(out_dir)
            print("  Unpacking complete.")

            # Remove temp zip directory
            try:
                zip_file.unlink()
                zip_temp_dir.rmdir()
            except Exception as e:
                print(f"  Note: Cleanup error: {e}")

        vol_time = time.time() - vol_start
        print(f"  Finished {name} in {vol_time / 60:.2f} minutes.")

    total_time = time.time() - total_start
    print(f"\n=== All Extractions Complete in {total_time / 60:.2f} minutes ===")

if __name__ == "__main__":
    run_extraction()
