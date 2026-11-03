async function testPatch() {
  try {
    const res = await fetch('http://localhost:5000/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: '6ae97e09a8a08a60b678f0c1',
        orderStatus: 'Preparing'
      })
    });
    console.log('Status code:', res.status);
    const data = await res.json();
    console.log('Result:', data);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testPatch();
