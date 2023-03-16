/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").truncate();
  await knex("posts").truncate();
  await knex("comments").truncate();
  await knex("users").insert([
    {
      name: "CeylinYasar",
      email: "ceylin@ceylin.com",
      password: "$2a$08$r/qsj26XGTZqOdfT9tgF/uKQGZm.QbmGQABhfUxAnOb69lK.8CYIa", //1234
    },
    {
      name: "AyşeD",
      email: "ayse@ayse.com",
      password: "$2a$08$MNGsMUlxyRS9IUlqdK27.ujXDaTMHKIInhpQ/0APhIb2tGvGxioRe", //3456
    },
    {
      name: "FatmaP",
      email: "fatma@fatma.com",
      password: "$2a$08$MVeLrc0R1HgqHZoWi04nmeyjbPtjuXJ2IIerKnykM8QxB5p7vsKAq", //dasf
    },
  ]);
  await knex("posts").insert([
    { post_content: "Herkese Merhaba", user_id: 1 },
    { post_content: "İyi geceler", user_id: 1 },
    { post_content: "Bugün hava çok soğuk", user_id: 2 },
    { post_content: "Perşembe günü sunum var", user_id: 3 },
  ]);
  await knex("comments").insert([
    { post_comment: "Selammm", post_id: 1 },
    { post_comment: "Hoşgeldin", post_id: 1 },
    { post_comment: "İyi uykular", post_id: 2 },
    { post_comment: "Evet dışarı çıkarken sıkı giyin", post_id: 3 },
    { post_comment: "Dikkat et", post_id: 3 },
    { post_comment: "Başarılar", post_id: 4 },
  ]);
};
