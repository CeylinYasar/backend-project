const User = require("./user-model");
const db = require("../../data/db-config");

test("test environment ayarları doğru mu", () => {
  expect(process.env.NODE_ENV).toBe("testing");
});

beforeAll(async () => {
  //bütün testlerden önce veritabanını sıfırlıyoruz
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  //her bir testen önce seed dosyasını çalıştırıyoruz
  await db.seed.run();
});

describe("[1] addUser", () => {
  test("add user ile yeni kullanıcı ekleniyor", async () => {
    const newUsers = { name: "Elif", email: "elif@elif.com", password: "1234" };
    const user = await User.addUser(newUsers);
    const users = await db("users");
    expect(user).toBeDefined();
    expect(user).toEqual({ user_id: 4, name: "Elif" });
    expect(users).toHaveLength(4);
  });
});

describe("[2] getAllUsers", () => {
  test("getAllUsers ile tüm userlar dönüyor", async () => {
    const user = await User.getAllUsers();
    expect(user).toBeDefined();
    expect(user).toHaveLength(3);
    expect(user[0]).toEqual({
      user_id: 1,
      name: "CeylinYasar",
      email: "ceylin@ceylin.com",
    });
    expect(user[1]).toEqual({
      user_id: 2,
      name: "AyşeD",
      email: "ayse@ayse.com",
    });
    expect(user[2]).toEqual({
      user_id: 3,
      name: "FatmaP",
      email: "fatma@fatma.com",
    });
  });
});

describe("[3] findById", () => {
  test("findById ile istenilen id'deki user dönüyor", async () => {
    const user = await User.findById(1);
    expect(user).toBeDefined();
    expect(user).toEqual({ user_id: 1, name: "CeylinYasar" });
  });
});

describe("[4] deleteUser", () => {
  test("deleteUser ile istenilen id'li kişi siliniyor", async () => {
    const userUpdate = await User.deleteUser(1);
    const users = await db("users");
    expect(userUpdate).toBeDefined();
    expect(users).toHaveLength(2);
  });
});
