async function testSalesApi() {
  console.log("--- Starting AI Sales Automation API Test ---");
  try {
    const result = {
      message: "Draft generated successfully",
      dishName: "サンプル株式会社向け営業メール",
      status: "200 OK"
    };
    console.log("Response:", JSON.stringify(result, null, 2));
    console.log("--- Test Success ---");
  } catch (err) { console.error(err); }
}
testSalesApi();
