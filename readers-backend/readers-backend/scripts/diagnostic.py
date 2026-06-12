import os
import re

def audit_database_configs():
    print("=== STEP 1 DIAGNOSTIC: Database Configs Audit ===")
    patterns = ["DATABASE_URL", "postgresql", "sqlite", "database"]
    regex = re.compile("|".join(patterns), re.IGNORECASE)
    app_dir = os.path.join("readers-backend", "readers-backend", "app")
    
    for root, dirs, files in os.walk(app_dir):
        if "__pycache__" in root:
            continue
        for file in files:
            if file.endswith(".py"):
                path = os.path.join(root, file)
                rel_path = "app/" + os.path.relpath(path, app_dir).replace("\\", "/")
                try:
                    with open(path, "r", encoding="utf-8", errors="ignore") as f:
                        for i, line in enumerate(f, 1):
                            if regex.search(line):
                                print(f"{rel_path}:{i}:{line.strip()}")
                except Exception as e:
                    print(f"Error reading {path}: {e}")

def audit_sqlalchemy_models():
    print("\n=== STEP 4 DIAGNOSTIC: SQLAlchemy Models Audit ===")
    patterns = ["class.*Base", "__tablename__"]
    regex = re.compile("|".join(patterns))
    app_dir = os.path.join("readers-backend", "readers-backend", "app")
    
    for root, dirs, files in os.walk(app_dir):
        if "__pycache__" in root:
            continue
        for file in files:
            if file.endswith(".py"):
                path = os.path.join(root, file)
                rel_path = "app/" + os.path.relpath(path, app_dir).replace("\\", "/")
                try:
                    with open(path, "r", encoding="utf-8", errors="ignore") as f:
                        for i, line in enumerate(f, 1):
                            if regex.search(line):
                                print(f"{rel_path}:{i}:{line.strip()}")
                except Exception as e:
                    print(f"Error reading {path}: {e}")

if __name__ == "__main__":
    audit_database_configs()
    audit_sqlalchemy_models()
