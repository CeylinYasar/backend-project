const request = require("supertest");
const server = require("./server");
const db = require("../data/db-config");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/index");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db.seed.run();
});

afterAll(async () => {
  await db.destroy();
});

describe("API END POINT TESTLERI", () => {
  describe("[GET] /", () => {
    test("[1] not found mesajını geri dönüyor", async () => {
      const res = await request(server).get("/");
      expect(res.body).toMatchObject({ message: "not found" });
      expect(res.status).toBe(404);
    });
  });
  describe("[POST] /api/auth", () => {
    test("[2] register olunca doğru status kodu dönüyor", async () => {
      const register = {
        name: "Ayşe",
        email: "Ayşe@Ayşe.com",
        password: "1234",
      };
      const res = await request(server)
        .post("/api/auth/register")
        .send(register);
      expect(res.status).toBe(201);
    });
    test("[3] register olunca user_id ve name dönüyor", async () => {
      const register = {
        name: "Ayşe",
        email: "Ayşe@Ayşe.com",
        password: "1234",
      };
      const res = await request(server)
        .post("/api/auth/register")
        .send(register);
      expect(res.body).toEqual({
        user_id: 4,
        name: "Ayşe",
      });
    });
    test("[4] login olunca doğru status kodu dönüyor", async () => {
      const login = {
        name: "CeylinYasar",
        password: "1234",
      };
      const res = await request(server).post("/api/auth/login").send(login);
      expect(res.status).toBe(200);
    });
    test("[5] login olunca doğru mesajı dönüyor", async () => {
      const login = {
        name: "CeylinYasar",
        password: "1234",
      };
      const res = await request(server).post("/api/auth/login").send(login);
      expect(res.body.message).toMatch(/welcome/i);
    });
    test("[6] login olurken name ve password  farklı ise doğru mesajı dönüyor", async () => {
      const login = {
        name: "Ceylin",
        password: "1234",
      };
      const res = await request(server).post("/api/auth/login").send(login);
      expect(res.body.message).toMatch(/geçersiz kriterler/i);
    });
  });
  describe("[GET] /api/users", () => {
    test("[7] token var ve tüm userlar dönüyor", async () => {
      const login = {
        name: "CeylinYasar",
        password: "1234",
      };
      let res = await request(server).post("/api/auth/login").send(login);
      res = await request(server)
        .get("/api/users")
        .set("Authorization", res.body.token);
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(3);
      expect(res.body[2]).toEqual({
        user_id: 3,
        name: "FatmaP",
        email: "fatma@fatma.com",
      });
    });
  });
  describe("[DELETE] /api/users", () => {
    test("[8] istenilen id'li kullanıcı siliniyor ve doğru mesajı dönüyor", async () => {
      const login = {
        name: "CeylinYasar",
        password: "1234",
      };
      let res = await request(server).post("/api/auth/login").send(login);
      res = await request(server)
        .delete("/api/users/1")
        .set("Authorization", res.body.token);
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/olan kullanıcı silindi/i);
    });
    test("[8] istenilen id'li kullanıcı yoksa doğru mesajı dönüyor", async () => {
      const login = {
        name: "CeylinYasar",
        password: "1234",
      };
      let res = await request(server).post("/api/auth/login").send(login);
      res = await request(server)
        .delete("/api/users/5")
        .set("Authorization", res.body.token);
      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/id bulunamadı/i);
    });
  });
  describe("[GET] /api/twit", () => {
    test("[9] tüm postlar dönüyor", async () => {
      const login = {
        name: "CeylinYasar",
        password: "1234",
      };
      let res = await request(server).post("/api/auth/login").send(login);
      res = await request(server)
        .get("/api/twit")
        .set("Authorization", res.body.token);
      expect(res.status).toBe(200);
      expect(res.body[0]).toMatchObject({
        user_id: 2,
        name: "AyşeD",
        post_content: "Bugün hava çok soğuk",
      });
      expect(res.body[1]).toMatchObject({
        user_id: 1,
        name: "CeylinYasar",
        post_content: "Herkese Merhaba",
      });
    });
  });
  describe("[GET] /api/twit/:id", () => {
    test("[10] id ye göre posts ve comments dönüyor", async () => {
      const login = {
        name: "CeylinYasar",
        password: "1234",
      };
      let res = await request(server).post("/api/auth/login").send(login);
      res = await request(server)
        .get("/api/twit/2")
        .set("Authorization", res.body.token);
      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
    });
    test("[11] id yoksa hata kodunu ve hata mesajını doğru dönüyor", async () => {
      const login = {
        name: "CeylinYasar",
        password: "1234",
      };
      let res = await request(server).post("/api/auth/login").send(login);
      res = await request(server)
        .get("/api/twit/88")
        .set("Authorization", res.body.token);
      expect(res.status).toBe(404);
      expect(res.body.message).toEqual("id bulunamadı");
    });
  });
  describe("[POST] /api/twit", () => {
    test("[12] id ye göre posts ve comments dönüyor", async () => {
      const login = {
        name: "CeylinYasar",
        password: "1234",
      };
      let res = await request(server).post("/api/auth/login").send(login);
      res = await request(server)
        .post("/api/twit")
        .set("Authorization", res.body.token)
        .send({ user_id: 2, post_content: "Sunuma varrrr" });
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        post_content: "Sunuma varrrr",
        user_id: 2,
      });
    });
    test("[13] alanlar doldurulmadıysa hata mesajı doğru dönüyor", async () => {
      const login = {
        name: "CeylinYasar",
        password: "1234",
      };
      let res = await request(server).post("/api/auth/login").send(login);
      res = await request(server)
        .post("/api/twit")
        .set("Authorization", res.body.token)
        .send({ post_content: "Sunuma varrrr" });
      expect(res.status).toBe(400);
      expect(res.body.message).toEqual("Eksik alan var");
    });
  });
  describe("[DELETE] /api/twit/:post_id", () => {
    test("[12] post_id ye göre postu siliyor", async () => {
      const login = {
        name: "CeylinYasar",
        password: "1234",
      };
      let res = await request(server).post("/api/auth/login").send(login);
      res = await request(server)
        .delete("/api/twit/3")
        .set("Authorization", res.body.token);
      expect(res.status).toBe(200);
    });
    test("[13] pots_id yoksa hata mesajı doğru dönüyor", async () => {
      const login = {
        name: "CeylinYasar",
        password: "1234",
      };
      let res = await request(server).post("/api/auth/login").send(login);
      res = await request(server)
        .delete("/api/twit/11")
        .set("Authorization", res.body.token);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("id bulunamadı");
    });
  });
});
