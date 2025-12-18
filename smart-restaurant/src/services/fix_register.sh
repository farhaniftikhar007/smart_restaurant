#!/bin/bash

REGISTER_FILE="/home/saif/Downloads/resturent/final year project/final year project/smart-restaurant/src/pages/Register.tsx"

echo "🔧 Backing up Register.tsx..."
cp "$REGISTER_FILE" "${REGISTER_FILE}.backup"

echo "🔧 Adding debug logs to handleSubmit..."

# Create the new handleSubmit function with debug logs
cat > /tmp/new_handlesubmit.txt << 'EOF'
  const handleSubmit = async (e: React.FormEvent) => {
  console.log('🟢 BUTTON CLICKED!');
  e.preventDefault();
  console.log('🟢 Form prevented default');

  if (!validateForm()) {
    console.log('❌ Validation failed');
    return;
  }

  console.log('✅ Validation passed, starting registration...');
  setIsLoading(true);
  console.log('📤 Sending registration data:', {
    email: formData.email,
    username: formData.name.toLowerCase().replace(/\s+/g, '_'),
    password: '***HIDDEN***',
    full_name: formData.name,
    phone: formData.phone
  });

  try {
    const result = await authService.register({
      email: formData.email,
      username: formData.name.toLowerCase().replace(/\s+/g, '_'),
      password: formData.password,
      full_name: formData.name,
      phone: formData.phone
    });

    console.log('📥 Registration result:', result);

    if (result.success) {
      alert('✅ Registration successful! Please login with your credentials.');
      navigate('/login');
    } else {
      console.error('❌ Registration failed:', result.message);
      setErrors({ general: result.message });
    }
  } catch (error: any) {
    console.error('💥 Registration error:', error);
    setErrors({
      general: error.response?.data?.detail || 'Registration failed. Please try again.'
    });
  } finally {
    setIsLoading(false);
  }
};
EOF

# Use sed to replace the handleSubmit function
# Find the line with "const handleSubmit" and replace until the next function or closing brace
sed -i '/const handleSubmit = async (e: React.FormEvent) => {/,/^  };$/c\
'"$(cat /tmp/new_handlesubmit.txt)" "$REGISTER_FILE"

echo "✅ Register.tsx updated with debug logs!"
echo ""
echo "📋 To open console in Firefox, use: Ctrl+Shift+K"
echo "🔄 Now restart your dev server and try registering!"
