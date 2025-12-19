import re

with open('Menu.tsx', 'r') as f:
    content = f.read()

# Add useRef import
content = re.sub(
    r'import React, { useState, useEffect }',
    'import React, { useState, useEffect, useRef }',
    content
)

# Add ref declaration after other useState
content = re.sub(
    r'(const \[showCart, setShowCart\] = useState\(false\);)',
    r'\1\n  const checkoutBtnRef = useRef<HTMLButtonElement>(null);',
    content
)

# Add useEffect to attach native click listener
effect_code = '''
  useEffect(() => {
    const btn = checkoutBtnRef.current;
    if (btn) {
      const handleClick = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        localStorage.setItem('checkoutCart', JSON.stringify(cart));
        navigate('/checkout');
      };
      btn.addEventListener('click', handleClick, true);
      return () => btn.removeEventListener('click', handleClick, true);
    }
  }, [cart, navigate]);
'''

content = re.sub(
    r'(useEffect\(\(\) => {[\s\S]*?}, \[user\]\);)',
    r'\1\n' + effect_code,
    content
)

# Update button to use ref
content = re.sub(
    r'<button[^>]*className="w-full bg-orange-500[^"]*"[^>]*>\s*Checkout\s*</button>',
    '<button ref={checkoutBtnRef} type="button" className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-semibold cursor-pointer">Checkout</button>',
    content,
    flags=re.DOTALL
)

with open('Menu.tsx', 'w') as f:
    f.write(content)

print("Fixed with useRef and native event listener!")
