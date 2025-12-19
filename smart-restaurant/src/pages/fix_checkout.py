import re

with open('Menu.tsx', 'r') as f:
    content = f.read()

# Find and replace the checkout button with a working version
old_button = r'<button[^>]*onClick=\{[^}]*navigate\("/checkout"\)[^}]*\}[^>]*className="w-full bg-orange-500[^"]*"[^>]*>\s*Checkout\s*</button>'

new_button = '''<button 
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("Navigating to checkout...");
                        window.location.href = "/checkout";
                      }}
                      className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-semibold cursor-pointer"
                    >
                      Checkout
                    </button>'''

content = re.sub(old_button, new_button, content, flags=re.DOTALL)

with open('Menu.tsx', 'w') as f:
    f.write(content)

print("Fixed!")
