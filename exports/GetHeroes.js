export async function getHeroes() {
  const Heroes = await Send({
    calls: [{ name: "heroGetAll", args: {}, ident: "body" }],
  }).then((r) => r.results[0].result.response);

  return Object.values(Heroes)
    .map((h) => {
      const colors = Array.from(
        { length: 18 - h.color + 1 },
        (_, i) => i + h.color
      ).map((c) => {
        const slots = lib.data.hero[h.id].color[c].items
          .map((val, ind) => (h.color == c ? h.slots[ind] ?? val : val))
          .filter(Number);
        return {
          id: c,
          slots: slots,
          value: `${h.id}|${c}`,
          name: `${cheats.translate(lib.data.enum.heroColor[c].locale_key)} ${
            lib.data.enum.heroColor[c].ident.match(/\+/g)?.length || ""
          }`,
        };
      });

      return {
        id: h.id,
        name: cheats.translate(`LIB_HERO_NAME_${h.id}`),
        colors,
        power: h.power,
      };
    })
    .filter((h) => h.colors.reduce((a, c) => a + c.slots.reduce((a1, s) => a1 + s, 0), 0) > 0)
    .sort((a, b) => b.power - a.power);
}
