export const INPUTS = [
  { label: "Ф.И.О. родителя", key: "parentName" },
  {
    label: "Зал где вы занимаетесь",
    key: "place",
    items: [
      { value: "ФОК Орловского", label: "ФОК Орловского" },
      { value: "ФОК Златоустовкого", label: "ФОК Златоустовкого" },
      { value: "Дворец гимнастики", label: "Дворец гимнастики" },
    ],
  },
  {
    label: "Пол ребёнка",
    key: "sex",
    items: [
      { value: "мою дочь", label: "Девочка" },
      { value: "моего сына", label: "Мальчик" },
    ],
  },
  { label: "Номер паспорта(в формате KB111111111)", key: "KB" },
  { label: "Когда выдан", key: "pasportDate" },
  { label: "Кем выдан", key: "pasportPlace" },
  { label: "Телефон", key: "phone" },
  { label: "Ф.И.О. ребёнка", key: "childrenName" },
  { label: "Дата рождения ребёнка", key: "birthday" },
  { label: "Хронические заболевания ребёнка", key: "diseases" },
  { label: "Адрес проживания", key: "address" },
];

export const REQUIRED_FIELDS = [
  "address",
  "birthday",
  "childrenName",
  "diseases",
  "KB",
  "parentName",
  "pasportDate",
  "pasportPlace",
  "phone",
  "place",
  "sex",
];
