import re
import os

def extract_inserts(input_file, output_prefix):
    if not os.path.exists(input_file):
        print(f"Error: Input file '{input_file}' not found.")
        return

    with open(input_file, 'r', encoding='utf-8') as infile:
        content = infile.read()
        
    tables = ['Account', 'Brand', 'Category', 'Gear', 'PackingList', 'PackingListItem', 
              'PackingListLike', 'PersonalGear', 'Review', 'Trip', 'User', 'CacheEntry']
    
    for table in tables:
        pattern = rf'INSERT INTO public."{table}" \([^)]+\) VALUES \([^)]+\);'
        inserts = re.findall(pattern, content)
        
        if inserts:
            with open(f'{output_prefix}_{table.lower()}.sql', 'w', encoding='utf-8') as outfile:
                for insert in inserts:
                    outfile.write(insert + '\n')
            
            print(f"Extracted {len(inserts)} INSERT statements for {table} table")
        else:
            print(f"No INSERT statements found for {table} table")

if __name__ == "__main__":
    input_file = 'backup.sql'
    output_prefix = 'insert'
    extract_inserts(input_file, output_prefix)
    