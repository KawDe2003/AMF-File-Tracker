async function testApi() {
  try {
    const res = await fetch('http://localhost:3000/api/files');
    const data = await res.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('API Error:', err);
  }
}

testApi();
