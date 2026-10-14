/**
 * India Map Region Mapping Data
 * Maps SVG map region identifiers (ISO 3166-2:IN codes) to:
 * - stateId: corresponding existing ID (1 to 36) from src/data/state.js
 * - label: existing State / Union Territory Name
 * - shortLabel: compact name for tight SVG boundaries
 * - x, y: center coordinates for SVG text labels (in 612x696 viewBox)
 */

export const indiaMapData = {
  "ap": {
    stateId: 1,
    label: "Andhra Pradesh",
    shortLabel: "Andhra Pradesh",
    x: 265,
    y: 525
  },
  "ar": {
    stateId: 2,
    label: "Arunachal Pradesh",
    shortLabel: "Arunachal",
    x: 550,
    y: 205
  },
  "as": {
    stateId: 3,
    label: "Assam",
    shortLabel: "Assam",
    x: 505,
    y: 260
  },
  "br": {
    stateId: 4,
    label: "Bihar",
    shortLabel: "Bihar",
    x: 370,
    y: 275
  },
  "ct": {
    stateId: 5,
    label: "Chhattisgarh",
    shortLabel: "Chhattisgarh",
    x: 295,
    y: 400
  },
  "ga": {
    stateId: 6,
    label: "Goa",
    shortLabel: "Goa",
    x: 106,
    y: 512
  },
  "gj": {
    stateId: 7,
    label: "Gujarat",
    shortLabel: "Gujarat",
    x: 80,
    y: 345
  },
  "hr": {
    stateId: 8,
    label: "Haryana",
    shortLabel: "Haryana",
    x: 168,
    y: 195
  },
  "hp": {
    stateId: 9,
    label: "Himachal Pradesh",
    shortLabel: "Himachal",
    x: 195,
    y: 135
  },
  "jh": {
    stateId: 10,
    label: "Jharkhand",
    shortLabel: "Jharkhand",
    x: 365,
    y: 335
  },
  "ka": {
    stateId: 11,
    label: "Karnataka",
    shortLabel: "Karnataka",
    x: 175,
    y: 535
  },
  "kl": {
    stateId: 12,
    label: "Kerala",
    shortLabel: "Kerala",
    x: 172,
    y: 630
  },
  "mp": {
    stateId: 13,
    label: "Madhya Pradesh",
    shortLabel: "Madhya Pradesh",
    x: 235,
    y: 340
  },
  "mh": {
    stateId: 14,
    label: "Maharashtra",
    shortLabel: "Maharashtra",
    x: 185,
    y: 440
  },
  "mn": {
    stateId: 15,
    label: "Manipur",
    shortLabel: "Manipur",
    x: 545,
    y: 305
  },
  "ml": {
    stateId: 16,
    label: "Meghalaya",
    shortLabel: "Meghalaya",
    x: 475,
    y: 285
  },
  "mz": {
    stateId: 17,
    label: "Mizoram",
    shortLabel: "Mizoram",
    x: 525,
    y: 345
  },
  "nl": {
    stateId: 18,
    label: "Nagaland",
    shortLabel: "Nagaland",
    x: 555,
    y: 268
  },
  "or": {
    stateId: 19,
    label: "Odisha",
    shortLabel: "Odisha",
    x: 345,
    y: 410
  },
  "pb": {
    stateId: 20,
    label: "Punjab",
    shortLabel: "Punjab",
    x: 152,
    y: 155
  },
  "rj": {
    stateId: 21,
    label: "Rajasthan",
    shortLabel: "Rajasthan",
    x: 130,
    y: 270
  },
  "sk": {
    stateId: 22,
    label: "Sikkim",
    shortLabel: "SK",
    x: 423,
    y: 230
  },
  "tn": {
    stateId: 23,
    label: "Tamil Nadu",
    shortLabel: "Tamil Nadu",
    x: 215,
    y: 625
  },
  "tg": {
    stateId: 24,
    label: "Telangana",
    shortLabel: "Telangana",
    x: 242,
    y: 462
  },
  "tr": {
    stateId: 25,
    label: "Tripura",
    shortLabel: "TR",
    x: 488,
    y: 330
  },
  "up": {
    stateId: 26,
    label: "Uttar Pradesh",
    shortLabel: "Uttar Pradesh",
    x: 275,
    y: 255
  },
  "ut": {
    stateId: 27,
    label: "Uttarakhand",
    shortLabel: "Uttarakhand",
    x: 235,
    y: 175
  },
  "wb": {
    stateId: 28,
    label: "West Bengal",
    shortLabel: "West Bengal",
    x: 415,
    y: 335
  },
  // 8 Union Territories (all mapped to existing state.js IDs 29–36)
  "an": {
    stateId: 29,
    label: "Andaman and Nicobar Islands",
    shortLabel: "A&N Islands",
    x: 535,
    y: 620,
    isUnionTerritory: true
  },
  "ch": {
    stateId: 30,
    label: "Chandigarh",
    shortLabel: "CH",
    x: 179,
    y: 160,
    isUnionTerritory: true
  },
  "dn": {
    stateId: 31,
    label: "Dadra and Nagar Haveli and Daman and Diu",
    shortLabel: "DNH & DD",
    x: 102,
    y: 405,
    isUnionTerritory: true
  },
  "dd": {
    stateId: 31,
    label: "Dadra and Nagar Haveli and Daman and Diu",
    shortLabel: "Daman & Diu",
    x: 54,
    y: 391,
    isUnionTerritory: true
  },
  "dl": {
    stateId: 32,
    label: "Delhi",
    shortLabel: "Delhi",
    x: 196,
    y: 215,
    isUnionTerritory: true
  },
  "jk": {
    stateId: 33,
    label: "Jammu and Kashmir",
    shortLabel: "J&K",
    x: 142,
    y: 82,
    isUnionTerritory: true
  },
  "la": {
    stateId: 34,
    label: "Ladakh",
    shortLabel: "Ladakh",
    x: 205,
    y: 62,
    isUnionTerritory: true
  },
  "ld": {
    stateId: 35,
    label: "Lakshadweep",
    shortLabel: "Lakshadweep",
    x: 99,
    y: 635,
    isUnionTerritory: true
  },
  "py": {
    stateId: 36,
    label: "Puducherry",
    shortLabel: "Puducherry",
    x: 268,
    y: 560,
    isUnionTerritory: true
  }
};

export default indiaMapData;
