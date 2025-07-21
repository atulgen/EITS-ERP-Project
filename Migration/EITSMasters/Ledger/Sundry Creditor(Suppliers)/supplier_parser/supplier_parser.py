import pandas as pd
import re

def parse_address(address_str):
    """Extract the address from ADDRESS_LIST_TYPE=String; ADDRESS= pattern"""
    if not isinstance(address_str, str):
        return None
    
    pattern = r'ADDRESS_LIST_TYPE=String; ADDRESS=(.*?)(?:\||$)'
    match = re.search(pattern, address_str)
    
    if match:
        return match.group(1).strip()
    return address_str

def extract_mobile_number(text):
    """Extract all UAE mobile numbers while strictly excluding dates"""
    if not isinstance(text, str):
        return None
    
    # Skip if text is exactly an 8-digit date (e.g., 20240201)
    if re.fullmatch(r'^\d{8}$', text.strip()):
        return None
    
    # Comprehensive UAE mobile number patterns
    patterns = [
        r'\+971\s?[5]\d{1,8}',       # +9715XXXXXXX
        r'\+971\s?[2-9]\d{1,8}',      # +971[2-9]XXXXXXX (other UAE numbers)
        r'0[2-9]\d{1,8}',             # 0[2-9]XXXXXXX (local format)
        r'(?:Tel|Mob|Phone|Contact)[:\s]\s*(?:971)?\s?[2-9]\d{1,8}',  # Tel: 05XXXXXXX
        r'(?:Tel|Mob|Phone|Contact)[:\s]\s*\+\s?971\s?[2-9]\d{1,8}',  # Tel: +9715XXXXXXX
        r'\b[2-9]\d{7,}\b'            # Standalone 8+ digit numbers starting 2-9
    ]
    
    found_numbers = []
    for pattern in patterns:
        matches = re.finditer(pattern, text)
        for match in matches:
            number = match.group(0)
            # Clean the number (keep only digits and +)
            number = re.sub(r'[^\d+]', '', number)
            
            # Validate UAE number format
            if (number.startswith('971') and len(number) == 12) or \
               (number.startswith('0') and len(number) == 10) or \
               (number.startswith(('2','3','4','5','6','7','8','9')) and len(number) >= 8):
                found_numbers.append(number)
    
    # Return first valid number or None
    return found_numbers[0] if found_numbers else None

def extract_email(text):
    """Extract email addresses from text"""
    if not isinstance(text, str):
        return None
    
    pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    match = re.search(pattern, text, re.IGNORECASE)
    return match.group(0) if match else None

def process_sundry_creditor(file_path):
    df = pd.read_excel(file_path)
    
    suppliers = []
    addresses = []
    mobile_numbers = []
    emails = []
    
    for i in range(0, len(df), 2):
        supplier = df.iloc[i, 0]
        address_row1 = df.iloc[i, 1]
        address_row2 = df.iloc[i+1, 1] if i+1 < len(df) else None
        
        address = parse_address(address_row1) or parse_address(address_row2)
        if not address:
            address = address_row1 if isinstance(address_row1, str) else address_row2
        
        mobile = extract_mobile_number(address)
        email = extract_email(address)
        
        suppliers.append(supplier)
        addresses.append(address)
        mobile_numbers.append(mobile)
        emails.append(email)
    
    result_df = pd.DataFrame({
        'Supplier Name': suppliers,
        'Address': addresses,
        'Mobile Number': mobile_numbers,
        'Email': emails
    })
    
    return result_df

# Usage
input_file = "Sundry Creditor.xlsx"
output_file = "cleaned_suppliers_with_contacts.csv"

cleaned_data = process_sundry_creditor(input_file)
cleaned_data.to_csv(output_file, index=False)

print(f"Success! Cleaned data saved to '{output_file}'.")