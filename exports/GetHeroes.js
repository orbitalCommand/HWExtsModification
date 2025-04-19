export async function getHeroes() {
  const Heroes = await Send({
    calls: [{ name: "heroGetAll", args: {}, ident: "body" }],
  }).then((r) => r.results[0].result.response);

  return Object.values(Heroes)
    .map((h) => {
      const slots = lib.data.hero[h.id].color[h.color].items
        .map((val, ind) => h.slots[ind] ?? val)
        .filter(Number);
      const colors = Array.from(
        { length: 18 - h.color + 1 },
        (_, i) => i + h.color
      ).map((c) => ({
        id: c,
        value: `${h.id}|${c}`,
        name: `${cheats.translate(lib.data.enum.heroColor[c].locale_key)} ${
          lib.data.enum.heroColor[c].ident.match(/\+/g)?.length || ""
        }`,
      }));

      return {
        id: h.id,
        name: cheats.translate(`LIB_HERO_NAME_${h.id}`),
        colors,
        slots,
        power: h.power,
      };
    })
    .filter((h) => h.slots.reduce((a, s) => a + s, 0) > 0)
    .sort((a, b) => b.power - a.power);
}
