# script.py
import sys

def main():
    print("Python mock executed successfully!")
    print(f"Argument received: {sys.argv[1] if len(sys.argv) > 1 else 'No argument provided'}")

if __name__ == "__main__":
    main()
