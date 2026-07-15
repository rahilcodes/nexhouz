async function check() {
  try {
    const urls = [
      "https://nexhouz.com/properties/anvita-ivana-apartments--sky-villas-",
      "https://nexhouz.com/properties/anvita-ivana-apartments--sky-villas-/",
      "https://nexhouz.com/properties/kg",
      "https://nexhouz.com/properties/kg/"
    ];
    for (const url of urls) {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
        redirect: "manual"
      });
      console.log(`=== URL: ${url} ===`);
      console.log("Status:", res.status);
      console.log("Location:", res.headers.get("location"));
      console.log("Content-Type:", res.headers.get("content-type"));
      if (res.status === 200) {
        const text = await res.text();
        console.log("Is HTML:", text.includes("<html") || text.includes("<!DOCTYPE"));
        console.log("Title tag:", text.match(/<title>([^<]+)<\/title>/)?.[1]);
      }
      console.log();
    }
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}
check();
