import bcrypt from "bcryptjs";

async function run() {
  const hash = await bcrypt.hash("pranav@02", 10);
  console.log(hash);
}
run();
