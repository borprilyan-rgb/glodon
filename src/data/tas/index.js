import * as indonesian from '../tutorialData.id.js'
import * as english from '../tutorialData.en.js'

export const getTasData = (language) => language === 'id' ? indonesian : english
