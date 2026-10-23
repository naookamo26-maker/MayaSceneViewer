# -*- coding: utf-8 -*-
"""スタンドアロン版の起動スクリプト。  python run_viewer.py [scene.ma]"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from ma_viewer.app import main  # noqa: E402

if __name__ == "__main__":
    sys.exit(main())
