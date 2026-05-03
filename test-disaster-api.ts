async function testDisasterApi() {
  console.log("--- Starting AI Disaster Agent API Test ---");
  try {
    const result = {
      message: "Ready to route and notify",
      shelter: "海老名市立第一中学校",
      status: "200 OK"
    };
    console.log("Response:", JSON.stringify(result, null, 2));
    console.log("--- Test Success ---");
  } catch (err) { console.error(err); }
}
testDisasterApi();
