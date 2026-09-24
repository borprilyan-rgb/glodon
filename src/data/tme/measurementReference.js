// Complete visible Measurement Settings rows from the three supplied screenshots.
// Empty units are intentionally blank, matching the source.
const tee = 'Calculation of irregular tee and cross (divided into regular fittings based on main pipe diameters)'
const minimum = 'The minimum diameter of the divided fitting'
const elbow = 'Calculation of irregular elbow'
const teeValue = 'As a bigger tee/cross and a reducer'
const elbowValue = 'As a bigger regular elbow and a reducer'

export const measurementReferences = {
  'plumbing-measurement-settings': {
    heading: 'MEASUREMENT SETTING UNTUK PLUMBING', tab: 'Plumbing & Sanitary',
    rows: [
      ['', 'Calculation of supply branch pipe height (vertical)', '', 'Based on elevation difference between horizontal supply pipe & sanitary ware'],
      ['Supply', 'Based on normal installation height', 'mm', 'Set calculated value', true],
      ['Supply', 'Based on height of sanitary ware above floor', 'mm', '300', true],
      ['', 'Calculation of drainage branch pipe height (vertical)', '', 'Based on elevation difference between horizontal drainage pipe & sanitary ware'],
      ['Drainage', 'Based on normal installation height', 'mm', 'Set calculated value', true],
      ['Drainage', 'Based on height of sanitary ware above floor', 'mm', '300', true],
      ['', 'Calculation of support number', 'nos.', 'Round Off'],
      ['', 'Setting for pipe connector distance', 'mm', '12000'],
      ['', tee, '', teeValue],
      ['', minimum, 'mm', '70'],
      ['', elbow, '', elbowValue],
      ['', 'Length reserved for water pipe', '%', '0'],
    ],
  },
  'fire-measurement-settings': {
    heading: 'MEASUREMENT SETTING UNTUK FIRE SERVICE', tab: 'Fire Service',
    rows: [
      ['Fire Extinguishing System', 'Calculation of support number', 'nos.', 'Round Off'],
      ['Fire Extinguishing System', 'Setting for mechanical tee and cross', 'nos.', 'Not Calculated'],
      ['Fire Extinguishing System', 'Pipe size setting for mechanical tee and cross', 'mm', 'Pipe Size Setting'],
      ['Fire Extinguishing System', tee, '', teeValue],
      ['Fire Extinguishing System', minimum, 'mm', '70'],
      ['Fire Extinguishing System', 'Setting for pipe connector distance', 'mm', '6000'],
      ['Fire Extinguishing System', 'Length reserved for water pipe', '%', '0'],
      ['Fire Extinguishing System', elbow, '', elbowValue],
      ['Fire Alarm System / Cable', 'Length reserved for sag, S-shaped configuration and intersection', '%', '0'],
      ['Fire Alarm System / Cable', 'Length reserved for connecting signal cable and telephone terminal box', 'mm', '150'],
      ['Fire Alarm System / Cable', 'Length reserved for connecting cable end', 'mm', '0'],
      ['Fire Alarm System / Electric Wire', 'Length reserved for connecting signal wire and telephone terminal box', 'mm', '150'],
    ],
  },
  'mvac-measurement-settings': {
    heading: 'MEASUREMENT SETTING UNTUK MVAC', tab: 'Air Conditioning & Mechanical Ventilation',
    rows: [
      ['', 'Whether to calculate Air Duct Fittings', 'nos.', 'Yes and include the area occupied by fittings'],
      ['', 'Measurement setting for Air Duct length', 'mm', 'The length of the reducer is included'],
      ['', 'Setting for pipe connector distance', 'mm', '12000'],
      ['', 'Whether to calculate End Cap of Air Duct', 'm2', 'Yes'],
      ['', tee, '', teeValue],
      ['', minimum, 'mm', '70'],
      ['', elbow, '', elbowValue],
      ['', 'Length reserved for water pipe', '%', '0'],
      ['', 'The minimum diameter for calculation of Refrigerant Pipe Elbows', 'mm', '26'],
      ['', 'Calculation of support number', 'nos.', 'Round Off'],
    ],
  },
}
