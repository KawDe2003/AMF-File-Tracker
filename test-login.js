async function run() {
    try {
        const r = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'manager@amf.lk', password: 'Manager@123' })
        });

        // get text response to see if it's HTML (Nextjs crash) or JSON
        const text = await r.text();
        console.log("STATUS:", r.status);
        console.log("RESPONSE:", text);
    } catch (e) {
        console.error("Script failed:", e);
    }
}
run();
