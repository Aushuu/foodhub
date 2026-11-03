async function probe() {
  try {
    const res = await fetch('http://localhost:3000/');
    console.log('GET / -> Status:', res.status, res.statusText);
    const text = await res.text();
    console.log('GET / HTML preview:', text.slice(0, 200));

    const resAdmin = await fetch('http://localhost:3000/admin');
    console.log('GET /admin -> Status:', resAdmin.status, resAdmin.statusText);

    const resOrders = await fetch('http://localhost:3000/orders');
    console.log('GET /orders -> Status:', resOrders.status, resOrders.statusText);
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}

probe();
