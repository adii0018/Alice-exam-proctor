import os
import re

src_dir = r'c:\Users\opg21\OneDrive\Desktop\Work 🍃\exam 01\src'

for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith(('.js', '.jsx')):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
            except UnicodeDecodeError:
                with open(filepath, 'r', encoding='utf-16') as f:
                    lines = f.readlines()
            
            changed = False
            new_lines = []
            for i in range(len(lines)):
                if 'console.log' in lines[i]:
                    changed = True
                    # If it's a simple line containing just console.log(...)
                    if re.match(r'^\s*console\.log\(.*\);?\s*$', lines[i]):
                        new_lines.append(re.sub(r'console\.log\(.*\);?', '/* log removed */', lines[i]))
                    elif re.search(r'=>\s*console\.log', lines[i]):
                        new_lines.append(re.sub(r'console\.log\([^)]*\)', 'undefined', lines[i]))
                    else:
                        new_lines.append(lines[i].replace('console.log', '/* log removed */'))
                else:
                    new_lines.append(lines[i])
            
            if changed:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.writelines(new_lines)
                pass
