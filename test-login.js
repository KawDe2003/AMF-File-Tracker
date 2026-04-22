async function run() {
    try {
        const r = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@amf.lk', password: 'Admin@123' })
        });
        const data = await r.json();
        console.log("RESPONSE:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}
run();
