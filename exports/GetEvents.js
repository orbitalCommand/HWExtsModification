export default function getEvents() {
  var d = new Date();
  d.setDate(d.getDate() - 3);
  return Object.values(lib.data.specialQuestEvent.type)
    .filter((x1) => !!x1.requirement.questEventDates)
    .filter((x2) => !!x2.requirement.questEventDates.startDate)
    .filter(
      (x3) => new Date(x3.requirement.questEventDates.endDate) > new Date()
    )
    .map((x4) => ({
      name: cheats.translate(x4.name_localeKey),
      startDate: x4.requirement.questEventDates.startDate,
      endDate: x4.requirement.questEventDates.endDate,
      steps: x4.questChains.map((x5) => {
        let arr = lib.data.specialQuestEvent.chain[x5].specialQuests.map(
          (x6) => lib.data.quest.special[x6]
        );
        let name = cheats.translate(
          `LIB_QUEST_TRANSLATE_${arr[0].translationMethod.toUpperCase()}`
        );
        if (name == "LIB_QUEST_TRANSLATE_POINTEVENTXPADD") {
          name = "Получи очков события";
        }
        if (arr.length > 0) {
          return {
            name,
            b: arr.map((x) => x.farmCondition),
          };
        }
        return {};
      }),
    }))
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
}
