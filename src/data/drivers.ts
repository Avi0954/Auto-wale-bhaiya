import type { Driver } from '../types';

export const drivers: Driver[] = [
  {
    id: 'd1',
    name: 'Raju Bhai',
    personality: 'Old-school romantic.',
    musicTaste: ['90s Bollywood', 'Romantic', 'Melodic'],
    preferences: {
      '90s': 'high',
      'Romantic': 'high',
      'Bollywood': 'high',
      'Party': 'low',
      'High Energy': 'low'
    },
    messageFrequency: 0.3,
    image: '/images/driver-1.jpg',
    messages: [
      "Aaj purane gaane sunte hain.",
      "Ye wala gaana skip mat karna.",
      "90s ka alag hi scene tha.",
      "Pyaar mein dhoka khaya hai kya?",
      "Baarish hoti toh maza aa jata."
    ],
    reactions: {
      skip: [
        "Arre bhai, ye toh accha tha.",
        "Jaldi mein ho kya?",
        "Chalo, dusra sunte hain.",
        "Mujhe toh pasand tha ye..."
      ],
      positive: [
        "Sahi mood ban gaya na?",
        "Tension mat lo, safar lamba hai.",
        "Lagta hai aapki aur meri choice milti hai."
      ]
    }
  },
  {
    id: 'd2',
    name: 'Sharma Ji',
    personality: 'Classic Bollywood purist.',
    musicTaste: ['Retro', '60s', 'Kishore Kumar'],
    preferences: {
      '60s': 'high',
      'Retro': 'high',
      'Classic': 'high',
      'Soulful': 'medium',
      '2010s': 'low',
      '2020s': 'low',
      'Party': 'low'
    },
    messageFrequency: 0.25,
    image: '/images/driver-2.jpg',
    messages: [
      "Asli sangeet toh unhi dino mein tha.",
      "Awaaz dekho Rafi saab ki.",
      "Aajkal ke gaano mein wo baat kahan?",
      "Aaraam se suno, man shant hoga."
    ],
    reactions: {
      skip: [
        "Purane gaane ki kadar hi nahi hai.",
        "Naye bachhe... kya samjhenge.",
        "Thoda thehar jao beta.",
        "Koi baat nahi, agli baar."
      ],
      positive: [
        "Sangeet sunna ek kala hai.",
        "Aapko sangeet ki samajh hai, lagta hai.",
        "Aise hi shanti se sunna chahiye."
      ]
    }
  },
  {
    id: 'd3',
    name: 'Bunty',
    personality: 'Energetic and unpredictable.',
    musicTaste: ['Punjabi Pop', 'Party', 'EDM'],
    preferences: {
      'Punjabi Pop': 'high',
      'Party': 'high',
      'High Energy': 'high',
      'Upbeat': 'high',
      'Sad': 'low',
      'Soulful': 'low'
    },
    messageFrequency: 0.4,
    image: '/images/driver-3.jpg',
    messages: [
      "Bhai bass badhaun kya?",
      "Raat baaki hai mere dost!",
      "Neend aa rahi thi, ab theek hai.",
      "Full volume pe chalne do!",
      "Ek number track hai bhai."
    ],
    reactions: {
      skip: [
        "Theek hai, next suno.",
        "Ye slow tha wese bhi.",
        "Hatao isko, banger lagata hu.",
        "Boring tha na?"
      ],
      positive: [
        "Vibe set ho gayi hai bhai!",
        "Maza aa raha hai na?",
        "Agla gaana aur bhi faad hoga!"
      ]
    }
  },
  {
    id: 'd4',
    name: 'Imran Bhai',
    personality: 'Late-night emotional playlist.',
    musicTaste: ['Sad', 'Heartbreak', 'Ghazals'],
    preferences: {
      'Sad': 'high',
      'Heartbreak': 'high',
      'Soulful': 'high',
      'Romantic': 'medium',
      'Party': 'low',
      'Upbeat': 'low'
    },
    messageFrequency: 0.35,
    image: '/images/driver-4.jpg',
    messages: [
      "Raat ke 2 baje ye gaana... alag hi dard hai.",
      "Zindagi mein sab chala jata hai, bas yaadein reh jati hain.",
      "Ro lo bhai, dil halka hoga.",
      "Khamoshi mein hi sukoon hai.",
      "Dil toota hai kisi ka?"
    ],
    reactions: {
      skip: [
        "Dard sahan nahi hua kya?",
        "Zada heavy ho gaya?",
        "Koi baat nahi, mood change karte hain.",
        "Aage badhna bhi zaroori hai."
      ],
      positive: [
        "Sath milke rote hain bhai.",
        "Raat aur bhi gehri lag rahi hai.",
        "Baat toh dil ki hi hai."
      ]
    }
  },
  {
    id: 'd5',
    name: 'Pintu',
    personality: 'Completely random.',
    musicTaste: ['Anything and everything'],
    preferences: {}, // Empty preferences means all songs have equal weight
    messageFrequency: 0.2,
    image: '/images/driver-5.jpg',
    messages: [
      "Bhaiya humko sab pasand hai.",
      "Shuffle pe rakha hai playlist.",
      "Jo baje, wahi theek hai.",
      "Aap batao, kaisa lag raha hai?"
    ],
    reactions: {
      skip: [
        "Chalo, jo aapki marzi.",
        "Next karke dekhte hain.",
        "Ye theek nahi tha kya?",
        "Shuffle zindabad."
      ],
      positive: [
        "Sab badhiya chal raha hai.",
        "Gaane khatam nahi honge mere paas.",
        "Chill maaro."
      ]
    }
  }
];
